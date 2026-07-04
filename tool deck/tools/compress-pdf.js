/* TOOLDECK — compress-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  // Setup pdf.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  // State
  let currentFile = null;
  let fileBuffer = null;
  let compressedBytes = null;

  // Elements
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const optionsPanel = $('options-panel');
  const qBoxes = document.querySelectorAll('.q-box');
  const compWarning = $('compression-warning');
  const optGrayscale = $('opt-grayscale');
  
  const actionRow = $('action-row');
  const compressBtn = $('compress-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const statOrig = $('stat-orig');
  const statNew = $('stat-new');
  const statSaved = $('stat-saved');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  let level = 'standard';

  qBoxes.forEach(box => {
    box.addEventListener('click', () => {
      qBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');
      level = box.dataset.level;
      if (level !== 'standard') {
        compWarning.classList.add('visible');
      } else {
        compWarning.classList.remove('visible');
      }
    });
  });

  optGrayscale?.addEventListener('click', () => {
    const active = optGrayscale.classList.toggle('active');
    optGrayscale.setAttribute('aria-checked', active);
  });

  // Size formatter
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File handling
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

  // Drag & Drop
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
    compressedBytes = null;
    resultZone.classList.remove('visible');
    updateUI();
  });

  // Compression Logic
  compressBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    compressBtn.disabled = true;
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    resultZone.classList.remove('visible', 'error');

    try {
      const isGrayscale = optGrayscale.classList.contains('active');
      const PDFDocument = PDFLib.PDFDocument;

      if (level === 'standard' && !isGrayscale) {
        // Basic re-save (removes some metadata and object streams)
        progressText.innerText = 'Optimizing structure...';
        progressFill.style.width = '50%';
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        // Strip metadata to save tiny bit of space
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('ToolDeck');
        pdfDoc.setCreator('ToolDeck');
        
        compressedBytes = await pdfDoc.save({ useObjectStreams: false });
        progressFill.style.width = '100%';

      } else {
        // Rasterize pages (Strong / Extreme)
        progressText.innerText = 'Rendering pages...';
        
        const scale = level === 'extreme' ? 1.0 : 1.5; // lower scale = lower res
        const jpegQuality = level === 'extreme' ? 0.6 : 0.8;

        const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        const newDoc = await PDFDocument.create();

        for (let i = 1; i <= totalPages; i++) {
          progressText.innerText = `Compressing page ${i} of ${totalPages}...`;
          progressFill.style.width = `${10 + Math.round((i / totalPages) * 80)}%`;
          
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: ctx, viewport }).promise;

          if (isGrayscale) {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            for (let j = 0; j < data.length; j += 4) {
              const avg = 0.3 * data[j] + 0.59 * data[j+1] + 0.11 * data[j+2];
              data[j] = avg; data[j+1] = avg; data[j+2] = avg;
            }
            ctx.putImageData(imgData, 0, 0);
          }

          const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
          const imgBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
          
          const jpgImage = await newDoc.embedJpg(imgBytes);
          const pdfPage = newDoc.addPage([viewport.width, viewport.height]);
          pdfPage.drawImage(jpgImage, {
            x: 0, y: 0, width: viewport.width, height: viewport.height
          });
        }
        
        progressText.innerText = 'Saving compressed file...';
        compressedBytes = await newDoc.save();
        progressFill.style.width = '100%';
      }

      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        
        const origSize = currentFile.size;
        const newSize = compressedBytes.byteLength;
        const saved = origSize > newSize ? Math.round(((origSize - newSize) / origSize) * 100) : 0;

        statOrig.innerText = formatSize(origSize);
        statNew.innerText = formatSize(newSize);
        
        if (saved > 0) {
          statSaved.innerText = `${saved}%`;
          statSaved.style.color = 'var(--green)';
          $('result-sub').innerText = 'Your file size has been reduced successfully.';
        } else {
          statSaved.innerText = '0%';
          statSaved.style.color = 'var(--t2)';
          statNew.style.color = 'var(--yellow)';
          $('result-sub').innerText = 'File is already highly optimized. Try a stronger level.';
        }

        fileListContainer.style.display = 'none';
        optionsPanel.style.display = 'none';
        actionRow.style.display = 'none';
        
        resultZone.classList.add('visible');
        compressBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      resultZone.classList.add('visible', 'error');
      resultZone.querySelector('.result-title').innerText = 'Error compressing PDF';
      $('result-sub').innerText = err.message || 'An unexpected error occurred.';
      compressBtn.disabled = false;
    }
  });

  // Download
  downloadBtn.addEventListener('click', () => {
    if (!compressedBytes) return;
    const blob = new Blob([compressedBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_compressed.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
