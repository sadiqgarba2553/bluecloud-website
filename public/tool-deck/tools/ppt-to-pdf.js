/* TOOLDECK — ppt-to-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  let currentFile = null;
  let fileBuffer = null;
  let finalPdfBytes = null;

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
    if (!file.name.toLowerCase().endsWith('.pptx')) {
      alert('Please upload a valid .pptx file.');
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
    finalPdfBytes = null;
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
    progressText.innerText = 'Extracting Presentation Assets...';

    try {
      const zip = await JSZip.loadAsync(fileBuffer);
      
      const mediaFiles = [];
      zip.folder("ppt/media/").forEach((relativePath, file) => {
        if (!file.dir && /\.(png|jpe?g)$/i.test(file.name)) {
          mediaFiles.push(file);
        }
      });

      progressFill.style.width = '40%';
      progressText.innerText = 'Generating PDF...';

      const PDFDocument = PDFLib.PDFDocument;
      const pdfDoc = await PDFDocument.create();

      if (mediaFiles.length === 0) {
        // Fallback for empty/no-media PPTX
        const page = pdfDoc.addPage([600, 400]);
        const { rgb } = PDFLib;
        page.drawText('No media assets found in this presentation.', { x: 50, y: 300, size: 20, color: rgb(0,0,0) });
        page.drawText('Client-side PPTX conversion is currently limited to embedded images.', { x: 50, y: 260, size: 12, color: rgb(0.5,0.5,0.5) });
      } else {
        // Sort files to somewhat preserve order (image1.png, image2.png)
        mediaFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}));

        for (let i = 0; i < mediaFiles.length; i++) {
          progressFill.style.width = `${40 + Math.round((i / mediaFiles.length) * 50)}%`;
          progressText.innerText = `Processing asset ${i + 1} of ${mediaFiles.length}...`;
          
          const imgBytes = await mediaFiles[i].async("uint8array");
          let pdfImage;
          if (/\.png$/i.test(mediaFiles[i].name)) {
            pdfImage = await pdfDoc.embedPng(imgBytes);
          } else {
            pdfImage = await pdfDoc.embedJpg(imgBytes);
          }

          const imgDims = pdfImage.scale(1);
          // Standard presentation size 16:9 ~ 960x540 or just fit to page
          const pageW = imgDims.width;
          const pageH = imgDims.height;

          const page = pdfDoc.addPage([pageW, pageH]);
          page.drawImage(pdfImage, { x: 0, y: 0, width: pageW, height: pageH });
        }
      }

      progressText.innerText = 'Saving Document...';
      finalPdfBytes = await pdfDoc.save();

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
      alert(err.message || 'Error converting PPT to PDF.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalPdfBytes) return;
    const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = currentFile.name.replace(/\.pptx$/i, '') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
