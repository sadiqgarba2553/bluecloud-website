/* TOOLDECK — jpg-to-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  // State
  let files = [];
  let dragSrcEl = null;
  let finalPdfBytes = null;

  // Elements
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileList = $('file-list');
  const addMoreBtn = $('add-more-btn');
  const fileInputMore = $('file-input-more');
  
  const optionsPanel = $('options-panel');
  const optSize = $('opt-size');
  const optMargin = $('opt-margin');
  const rowOrientation = $('row-orientation');
  const rowMargin = $('row-margin');
  const optRadios = document.querySelectorAll('.opt-radio');
  
  const actionRow = $('action-row');
  const convertBtn = $('convert-btn');
  const clearBtn = $('clear-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const statFiles = $('stat-files');
  const statSize = $('stat-size');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  let orientation = 'portrait';
  optRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      optRadios.forEach(r => r.classList.remove('active'));
      radio.classList.add('active');
      orientation = radio.dataset.orient;
    });
  });

  optSize.addEventListener('change', () => {
    if (optSize.value === 'fit') {
      rowOrientation.style.display = 'none';
      rowMargin.style.display = 'none';
    } else {
      rowOrientation.style.display = 'flex';
      rowMargin.style.display = 'flex';
    }
  });

  // Size formatter
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uid = () => Math.random().toString(36).substr(2, 9);

  // File handling
  const handleFiles = async (newFiles) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = Array.from(newFiles).filter(f => validTypes.includes(f.type) || /\.(jpg|jpeg|png|webp)$/i.test(f.name));
    
    if (validFiles.length === 0) {
      alert('Please upload valid JPG, PNG, or WebP images.');
      return;
    }

    for (const f of validFiles) {
      // Create object URL for thumbnail
      const url = URL.createObjectURL(f);
      files.push({ id: uid(), file: f, url });
    }

    renderFileList();
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
  dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files), false);
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => { handleFiles(e.target.files); fileInput.value = ''; });
  
  addMoreBtn.addEventListener('click', () => fileInputMore.click());
  fileInputMore.addEventListener('change', e => { handleFiles(e.target.files); fileInputMore.value = ''; });

  // Render list
  const renderFileList = () => {
    fileList.innerHTML = '';
    files.forEach((f) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.draggable = true;
      item.dataset.id = f.id;
      item.innerHTML = `
        <div class="file-drag-handle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <div class="file-thumb" style="background:#fff">
          <img src="${f.url}" alt="thumb" />
        </div>
        <div class="file-info">
          <div class="file-name">${f.file.name}</div>
          <div class="file-size">${formatSize(f.file.size)}</div>
        </div>
        <button class="file-remove" data-id="${f.id}" title="Remove file">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      // Drag events
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);

      // Remove
      item.querySelector('.file-remove').addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const idx = files.findIndex(file => file.id === id);
        if (idx > -1) {
          URL.revokeObjectURL(files[idx].url);
          files.splice(idx, 1);
        }
        renderFileList();
        updateUI();
      });

      fileList.appendChild(item);
    });
  };

  // Drag logic
  function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; }
  function handleDragEnter(e) { this.classList.add('drag-over'); }
  function handleDragLeave(e) { this.classList.remove('drag-over'); }
  function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
      const srcIdx = files.findIndex(f => f.id === dragSrcEl.dataset.id);
      const tgtIdx = files.findIndex(f => f.id === this.dataset.id);
      const [removed] = files.splice(srcIdx, 1);
      files.splice(tgtIdx, 0, removed);
      renderFileList();
    }
    return false;
  }
  function handleDragEnd(e) {
    this.style.opacity = '1';
    fileList.querySelectorAll('.file-item').forEach(i => i.classList.remove('drag-over'));
  }

  const updateUI = () => {
    if (files.length > 0) {
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

  clearBtn.addEventListener('click', () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    files = [];
    renderFileList();
    updateUI();
  });

  resetBtn.addEventListener('click', () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    files = [];
    finalPdfBytes = null;
    resultZone.classList.remove('visible');
    renderFileList();
    updateUI();
  });

  // Convert
  convertBtn.addEventListener('click', async () => {
    if (files.length === 0) return;

    convertBtn.disabled = true;
    clearBtn.disabled = true;
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    resultZone.classList.remove('visible', 'error');

    try {
      const PDFDocument = PDFLib.PDFDocument;
      const pdfDoc = await PDFDocument.create();
      
      const sizeMode = optSize.value;
      const marginPx = parseInt(optMargin.value, 10) || 0;
      
      let targetW, targetH;
      if (sizeMode === 'a4') {
        targetW = orientation === 'portrait' ? 595.28 : 841.89;
        targetH = orientation === 'portrait' ? 841.89 : 595.28;
      } else if (sizeMode === 'letter') {
        targetW = orientation === 'portrait' ? 612 : 792;
        targetH = orientation === 'portrait' ? 792 : 612;
      }

      for (let i = 0; i < files.length; i++) {
        progressText.innerText = `Converting image ${i + 1} of ${files.length}...`;
        progressFill.style.width = `${10 + Math.round((i / files.length) * 80)}%`;

        const imgBytes = await files[i].file.arrayBuffer();
        let pdfImage;
        const isPng = files[i].file.type === 'image/png' || files[i].file.name.toLowerCase().endsWith('.png');
        
        // Note: pdf-lib doesn't support WebP natively. So if it's WebP, we must rasterize it via canvas.
        const isWebp = files[i].file.type === 'image/webp' || files[i].file.name.toLowerCase().endsWith('.webp');

        if (isPng) {
          pdfImage = await pdfDoc.embedPng(imgBytes);
        } else if (isWebp) {
          // Render webp to canvas and get PNG bytes
          const img = new Image();
          img.src = files[i].url;
          await new Promise(r => img.onload = r);
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const pngBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
          pdfImage = await pdfDoc.embedPng(pngBytes);
        } else {
          pdfImage = await pdfDoc.embedJpg(imgBytes);
        }

        const imgDims = pdfImage.scale(1);
        let pageW, pageH, drawX, drawY, drawW, drawH;

        if (sizeMode === 'fit') {
          pageW = imgDims.width;
          pageH = imgDims.height;
          drawW = pageW; drawH = pageH;
          drawX = 0; drawY = 0;
        } else {
          pageW = targetW;
          pageH = targetH;
          
          const availW = pageW - (marginPx * 2);
          const availH = pageH - (marginPx * 2);
          
          const scaleW = availW / imgDims.width;
          const scaleH = availH / imgDims.height;
          const scale = Math.min(scaleW, scaleH);
          
          drawW = imgDims.width * scale;
          drawH = imgDims.height * scale;
          drawX = (pageW - drawW) / 2;
          drawY = (pageH - drawH) / 2;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(pdfImage, {
          x: drawX, y: drawY, width: drawW, height: drawH
        });
      }

      progressText.innerText = 'Saving PDF...';
      finalPdfBytes = await pdfDoc.save();
      progressFill.style.width = '100%';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        statFiles.innerText = files.length;
        statSize.innerText = formatSize(finalPdfBytes.byteLength);
        
        fileListContainer.style.display = 'none';
        optionsPanel.style.display = 'none';
        actionRow.style.display = 'none';
        
        resultZone.classList.add('visible');
        convertBtn.disabled = false;
        clearBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      resultZone.classList.add('visible', 'error');
      resultZone.querySelector('.result-title').innerText = 'Error converting images';
      $('result-sub').innerText = err.message || 'An unexpected error occurred.';
      convertBtn.disabled = false;
      clearBtn.disabled = false;
    }
  });

  // Download
  downloadBtn.addEventListener('click', () => {
    if (!finalPdfBytes) return;
    const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
