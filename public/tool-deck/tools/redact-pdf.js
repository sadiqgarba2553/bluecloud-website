/* TOOLDECK — redact-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;
  const rgb = PDFLib.rgb;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  
  let pdfDocObj = null;
  let totalPages = 0;
  let currentPage = 1;
  let currentScale = 1;
  let currentViewport = null;
  
  // State: { pageNum: [{ x, y, w, h, id, color }] }  where coords are in percentages of the canvas size
  let redactions = {};
  let nextId = 0;

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const previewCanvas = $('preview-canvas');
  const redactContainer = $('redact-container');
  const drawingLayer = $('drawing-layer');
  
  const pageNumEl = $('page-num');
  const pageCountEl = $('page-count');
  const prevPageBtn = $('prev-page');
  const nextPageBtn = $('next-page');
  
  const redactColor = $('redact-color');
  const modeToggle = $('mode-toggle');
  const modeLabel = $('mode-label');
  let isPermanent = true;
  
  const applyBtn = $('apply-btn');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  // Drawing state
  let isDrawing = false;
  let startX, startY;
  let currentBox = null;

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
    progressText.innerText = 'Loading document...';

    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      pdfDocObj = await loadingTask.promise;
      totalPages = pdfDocObj.numPages;
      pageCountEl.innerText = totalPages;
      
      redactions = {};
      for(let i=1; i<=totalPages; i++) redactions[i] = [];
      
      await renderPage(1);

      progressWrap.classList.remove('visible');
      workspace.style.display = 'block';

    } catch (err) {
      console.error(err);
      alert('Error loading PDF preview.');
      progressWrap.classList.remove('visible');
      dropZone.style.display = 'block';
    }
  };

  const renderPage = async (num) => {
    currentPage = num;
    pageNumEl.innerText = num;
    prevPageBtn.disabled = num <= 1;
    nextPageBtn.disabled = num >= totalPages;
    
    const page = await pdfDocObj.getPage(num);
    const viewport = page.getViewport({ scale: 1 });
    
    const wrapper = previewCanvas.parentElement.parentElement;
    const maxWidth = wrapper.clientWidth - 48;
    currentScale = Math.min(1.5, maxWidth / viewport.width);
    currentViewport = page.getViewport({ scale: currentScale });

    previewCanvas.width = currentViewport.width;
    previewCanvas.height = currentViewport.height;

    await page.render({
      canvasContext: previewCanvas.getContext('2d'),
      viewport: currentViewport
    }).promise;
    
    renderRedactionBoxes();
  };

  const renderRedactionBoxes = () => {
    drawingLayer.innerHTML = '';
    const boxes = redactions[currentPage] || [];
    boxes.forEach(b => {
      const div = document.createElement('div');
      div.className = 'redact-box';
      div.style.left = b.x + '%';
      div.style.top = b.y + '%';
      div.style.width = b.w + '%';
      div.style.height = b.h + '%';
      div.style.backgroundColor = b.color;
      
      const del = document.createElement('div');
      del.className = 'del-btn';
      del.innerHTML = '&times;';
      del.onclick = (e) => {
        e.stopPropagation();
        redactions[currentPage] = redactions[currentPage].filter(r => r.id !== b.id);
        renderRedactionBoxes();
      };
      
      div.appendChild(del);
      drawingLayer.appendChild(div);
    });
  };

  prevPageBtn.onclick = () => { if (currentPage > 1) renderPage(currentPage - 1); };
  nextPageBtn.onclick = () => { if (currentPage < totalPages) renderPage(currentPage + 1); };

  // Drawing Logic
  const getPointer = (e) => {
    const rect = redactContainer.getBoundingClientRect();
    let clientX = e.clientX, clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  };

  const startDraw = (e) => {
    if (e.target.closest('.del-btn')) return; // ignore delete clicks
    e.preventDefault();
    isDrawing = true;
    const p = getPointer(e);
    startX = p.x;
    startY = p.y;
    
    currentBox = document.createElement('div');
    currentBox.className = 'redact-box';
    currentBox.style.left = startX + '%';
    currentBox.style.top = startY + '%';
    currentBox.style.width = '0%';
    currentBox.style.height = '0%';
    currentBox.style.backgroundColor = redactColor.value;
    drawingLayer.appendChild(currentBox);
    
    document.addEventListener('mousemove', onDraw);
    document.addEventListener('touchmove', onDraw, { passive: false });
    document.addEventListener('mouseup', endDraw);
    document.addEventListener('touchend', endDraw);
  };

  const onDraw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPointer(e);
    
    let x = Math.min(startX, p.x);
    let y = Math.min(startY, p.y);
    let w = Math.abs(p.x - startX);
    let h = Math.abs(p.y - startY);
    
    x = Math.max(0, x); y = Math.max(0, y);
    if (x + w > 100) w = 100 - x;
    if (y + h > 100) h = 100 - y;

    currentBox.style.left = x + '%';
    currentBox.style.top = y + '%';
    currentBox.style.width = w + '%';
    currentBox.style.height = h + '%';
  };

  const endDraw = (e) => {
    isDrawing = false;
    document.removeEventListener('mousemove', onDraw);
    document.removeEventListener('touchmove', onDraw);
    document.removeEventListener('mouseup', endDraw);
    document.removeEventListener('touchend', endDraw);
    
    if (currentBox) {
      const w = parseFloat(currentBox.style.width);
      const h = parseFloat(currentBox.style.height);
      
      if (w > 0.5 && h > 0.5) {
        redactions[currentPage].push({
          id: nextId++,
          x: parseFloat(currentBox.style.left),
          y: parseFloat(currentBox.style.top),
          w: w,
          h: h,
          color: redactColor.value
        });
      }
      currentBox.remove();
      currentBox = null;
      renderRedactionBoxes();
    }
  };

  redactContainer.addEventListener('mousedown', startDraw);
  redactContainer.addEventListener('touchstart', startDraw, { passive: false });

  modeToggle.addEventListener('click', () => {
    isPermanent = !isPermanent;
    modeToggle.classList.toggle('active', isPermanent);
    modeLabel.innerText = isPermanent ? 'Enabled' : 'Disabled';
  });

  const hexToRgbFloat = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16) / 255, g: parseInt(result[2], 16) / 255, b: parseInt(result[3], 16) / 255 } : { r: 0, g: 0, b: 0 };
  };

  applyBtn.addEventListener('click', async () => {
    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    progressText.innerText = isPermanent ? 'Rasterizing pages (may take a while)...' : 'Applying redactions...';

    try {
      const outDoc = await PDFDocument.create();
      
      if (!isPermanent) {
        const srcDoc = await PDFDocument.load(fileBuffer);
        const pages = srcDoc.getPages();
        
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const boxes = redactions[i + 1] || [];
          const { width, height } = page.getSize();
          
          boxes.forEach(b => {
            const x = (b.x / 100) * width;
            const w = (b.w / 100) * width;
            const h = (b.h / 100) * height;
            const y = height - ((b.y / 100) * height) - h; // PDF coord is bottom-left
            
            const c = hexToRgbFloat(b.color);
            page.drawRectangle({ x, y, width: w, height: h, color: rgb(c.r, c.g, c.b) });
          });
          
          const [copiedPage] = await outDoc.copyPages(srcDoc, [i]);
          outDoc.addPage(copiedPage);
        }
      } else {
        // Permanent: rasterize using pdf.js
        for (let i = 1; i <= totalPages; i++) {
          progressFill.style.width = \`\${10 + Math.round((i / totalPages) * 70)}%\`;
          progressText.innerText = \`Rasterizing page \${i} of \${totalPages}...\`;
          
          const page = await pdfDocObj.getPage(i);
          // High res for output
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          
          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          
          // Draw redactions directly on canvas
          const boxes = redactions[i] || [];
          boxes.forEach(b => {
            const x = (b.x / 100) * canvas.width;
            const y = (b.y / 100) * canvas.height;
            const w = (b.w / 100) * canvas.width;
            const h = (b.h / 100) * canvas.height;
            ctx.fillStyle = b.color;
            ctx.fillRect(x, y, w, h);
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const pdfImage = await outDoc.embedJpg(imgData);
          
          // Create page same size as original
          const origViewport = page.getViewport({ scale: 1 });
          const outPage = outDoc.addPage([origViewport.width, origViewport.height]);
          outPage.drawImage(pdfImage, {
            x: 0, y: 0,
            width: origViewport.width,
            height: origViewport.height
          });
        }
      }

      progressFill.style.width = '90%';
      progressText.innerText = 'Saving...';

      const pdfBytes = await outDoc.save();
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
      alert('Error processing redactions.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_redacted.pdf';
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
    currentFile = null; fileBuffer = null; finalBlob = null; redactions = {};
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
