/* TOOLDECK — crop-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  
  let pdfOrigWidth = 0;
  let pdfOrigHeight = 0;
  
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const previewCanvas = $('preview-canvas');
  const cropContainer = $('crop-container');
  const cropOverlay = $('crop-overlay');
  const cropBox = $('crop-box');
  
  const applyBtn = $('apply-btn');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  // Crop State
  let box = { top: 10, left: 10, width: 80, height: 80 }; // percentages
  let isDragging = false;
  let dragType = null;
  let startX, startY;
  let startBox = {};

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
    
    dropZone.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Loading preview...';

    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1 });
      pdfOrigWidth = viewport.width;
      pdfOrigHeight = viewport.height;
      
      const wrapper = $('preview-col');
      const maxWidth = wrapper.clientWidth - 48;
      const scale = Math.min(1.5, maxWidth / viewport.width);
      const scaledViewport = page.getViewport({ scale });

      previewCanvas.width = scaledViewport.width;
      previewCanvas.height = scaledViewport.height;

      await page.render({
        canvasContext: previewCanvas.getContext('2d'),
        viewport: scaledViewport
      }).promise;

      progressWrap.classList.remove('visible');
      workspace.style.display = 'block';
      
      // Init crop box
      box = { top: 10, left: 10, width: 80, height: 80 };
      updateCropBox();

    } catch (err) {
      console.error(err);
      alert('Error loading PDF preview.');
      progressWrap.classList.remove('visible');
      dropZone.style.display = 'block';
    }
  };

  // Crop Dragging Logic
  const updateCropBox = () => {
    cropBox.style.top = box.top + '%';
    cropBox.style.left = box.left + '%';
    cropBox.style.width = box.width + '%';
    cropBox.style.height = box.height + '%';
    
    // Mask overlay
    cropOverlay.style.clipPath = \`polygon(
      0% 0%, 0% 100%, \${box.left}% 100%, \${box.left}% \${box.top}%,
      \${box.left + box.width}% \${box.top}%, \${box.left + box.width}% \${box.top + box.height}%,
      \${box.left}% \${box.top + box.height}%, \${box.left}% 100%, 100% 100%, 100% 0%
    )\`;
  };

  const getPointer = (e) => {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const startDrag = (e) => {
    e.preventDefault();
    isDragging = true;
    const p = getPointer(e);
    startX = p.x;
    startY = p.y;
    startBox = { ...box };
    
    if (e.target.classList.contains('handle')) {
      dragType = e.target.getAttribute('data-handle');
    } else {
      dragType = 'move';
    }
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const p = getPointer(e);
    const cw = cropContainer.clientWidth;
    const ch = cropContainer.clientHeight;
    
    const dx = ((p.x - startX) / cw) * 100;
    const dy = ((p.y - startY) / ch) * 100;

    let { top, left, width, height } = startBox;

    if (dragType === 'move') {
      top += dy;
      left += dx;
    } else if (dragType === 'nw') {
      top += dy; height -= dy; left += dx; width -= dx;
    } else if (dragType === 'ne') {
      top += dy; height -= dy; width += dx;
    } else if (dragType === 'sw') {
      height += dy; left += dx; width -= dx;
    } else if (dragType === 'se') {
      height += dy; width += dx;
    }

    // Constraints
    const minW = 5, minH = 5;
    if (width < minW) { width = minW; if(dragType.includes('w')) left = startBox.left + startBox.width - minW; }
    if (height < minH) { height = minH; if(dragType.includes('n')) top = startBox.top + startBox.height - minH; }

    if (left < 0) { width += left; left = 0; if(dragType==='move') width = startBox.width; }
    if (top < 0) { height += top; top = 0; if(dragType==='move') height = startBox.height; }
    if (left + width > 100) { width = 100 - left; if(dragType==='move') left = 100 - startBox.width; }
    if (top + height > 100) { height = 100 - top; if(dragType==='move') top = 100 - startBox.height; }

    box = { top, left, width, height };
    updateCropBox();
  };

  const endDrag = () => {
    isDragging = false;
    dragType = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  };

  cropBox.addEventListener('mousedown', startDrag);
  cropBox.addEventListener('touchstart', startDrag, { passive: false });

  applyBtn.addEventListener('click', async () => {
    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Cropping pages...';

    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      
      pages.forEach(page => {
        const { width: pWidth, height: pHeight } = page.getSize();
        
        // Calculate crop box coordinates in PDF points (bottom-left origin)
        const x = (box.left / 100) * pWidth;
        const width = (box.width / 100) * pWidth;
        const y = (1 - ((box.top + box.height) / 100)) * pHeight;
        const height = (box.height / 100) * pHeight;

        page.setCropBox(x, y, width, height);
      });

      progressFill.style.width = '90%';
      progressText.innerText = 'Saving...';

      const pdfBytes = await pdfDoc.save();
      finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
      }, 500);

    } catch (err) {
      console.error(err);
      workspace.style.display = 'block';
      progressWrap.classList.remove('visible');
      alert('Error cropping PDF.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_cropped.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  changeFileBtn.addEventListener('click', () => fileInput.click());

  resetBtn.addEventListener('click', () => {
    currentFile = null; fileBuffer = null; finalBlob = null;
    resultZone.classList.remove('visible');
    workspace.style.display = 'none';
    dropZone.style.display = 'block';
  });


  if (typeof dropZone !== 'undefined' && dropZone) {
    dropZone.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        var fi = document.getElementById('file-input');
        if (fi) fi.click();
      }
    });
  }
})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
