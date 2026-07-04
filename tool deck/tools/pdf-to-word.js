/* TOOLDECK — pdf-to-word.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const actionRow = $('action-row');
  const convertBtn = $('convert-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    currentFile = file;
    fileBuffer = await file.arrayBuffer();
    
    fileNameDisplay.innerText = file.name;
    fileSizeDisplay.innerText = formatSize(file.size);
    
    updateUI();
  };

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); }, false);
  });
  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.add('dragover'), false);
  });
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  
  changeFileBtn.addEventListener('click', () => fileInput.click());

  const updateUI = () => {
    if (currentFile) {
      dropZone.style.display = 'none';
      fileListContainer.style.display = 'block';
      actionRow.style.display = 'flex';
    } else {
      dropZone.style.display = 'block';
      fileListContainer.style.display = 'none';
      actionRow.style.display = 'none';
      resultZone.classList.remove('visible');
    }
  };

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    fileBuffer = null;
    finalBlob = null;
    resultZone.classList.remove('visible');
    updateUI();
  });

  convertBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    convertBtn.disabled = true;
    actionRow.style.display = 'none';
    fileListContainer.style.display = 'none';
    
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    progressText.innerText = 'Extracting Text...';

    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      
      const docxParagraphs = [];

      for (let i = 1; i <= totalPages; i++) {
        progressText.innerText = `Processing page ${i} of ${totalPages}...`;
        progressFill.style.width = `${10 + Math.round((i / totalPages) * 70)}%`;
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let lineText = '';

        // Extremely basic layout reconstruction
        for (const item of textContent.items) {
          const y = item.transform[5];
          if (lastY !== -1 && Math.abs(y - lastY) > 5) {
            docxParagraphs.push(new docx.Paragraph({ children: [new docx.TextRun(lineText)] }));
            lineText = '';
          }
          lineText += item.str + (item.hasEOL ? '' : ' ');
          lastY = y;
        }
        if (lineText) {
          docxParagraphs.push(new docx.Paragraph({ children: [new docx.TextRun(lineText)] }));
        }

        // Add page break if not last page
        if (i < totalPages) {
          docxParagraphs.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));
        }
      }

      progressText.innerText = 'Generating Word Document...';
      progressFill.style.width = '90%';

      const doc = new docx.Document({
        sections: [{ properties: {}, children: docxParagraphs }]
      });

      finalBlob = await docx.Packer.toBlob(doc);
      
      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
        convertBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      fileListContainer.style.display = 'block';
      actionRow.style.display = 'flex';
      convertBtn.disabled = false;
      alert(err.message || 'Error converting PDF to Word.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
