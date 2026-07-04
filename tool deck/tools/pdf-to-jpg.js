/* TOOLDECK — pdf-to-jpg.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  // Setup pdf.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalZipBlob = null;
  let totalConverted = 0;

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const optionsPanel = $('options-panel');
  const optScale = $('opt-scale');
  
  const actionRow = $('action-row');
  const convertBtn = $('convert-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const statPages = $('stat-pages');
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
      optionsPanel.style.display = 'block';
      actionRow.style.display = 'flex';
    } else {
      dropZone.style.display = 'block';
      fileListContainer.style.display = 'none';
      optionsPanel.style.display = 'none';
      actionRow.style.display = 'none';
      resultZone.classList.remove('visible');
    }
  };

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    fileBuffer = null;
    finalZipBlob = null;
    totalConverted = 0;
    resultZone.classList.remove('visible');
    updateUI();
  });

  convertBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    convertBtn.disabled = true;
    actionRow.style.display = 'none';
    fileListContainer.style.display = 'none';
    optionsPanel.style.display = 'none';
    
    progressWrap.classList.add('visible');
    progressFill.style.width = '5%';
    progressText.innerText = 'Reading PDF...';

    try {
      const scale = parseFloat(optScale.value);
      
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      totalConverted = totalPages;
      
      const zip = new JSZip();
      const baseName = currentFile.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= totalPages; i++) {
        progressText.innerText = `Rendering page ${i} of ${totalPages}...`;
        progressFill.style.width = `${10 + Math.round((i / totalPages) * 80)}%`;
        
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const imgData = dataUrl.split(',')[1];
        
        const pNum = i.toString().padStart(3, '0');
        zip.file(`${baseName}_page_${pNum}.jpg`, imgData, { base64: true });
      }

      progressText.innerText = 'Zipping files...';
      finalZipBlob = await zip.generateAsync({ type: 'blob' });
      
      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
        statPages.innerText = totalConverted.toString();
        convertBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      fileListContainer.style.display = 'block';
      optionsPanel.style.display = 'block';
      actionRow.style.display = 'flex';
      convertBtn.disabled = false;
      alert(err.message || 'Error converting PDF to JPG.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalZipBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalZipBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
