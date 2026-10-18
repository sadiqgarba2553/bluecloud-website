/* TOOLDECK — rotate-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;
  const degrees = PDFLib.degrees;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  let pageRotations = []; // stores additional rotation per page in degrees

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  const pageGrid = $('page-grid');
  
  const applyBtn = $('apply-btn');
  const rotateAllLeftBtn = $('rotate-all-left');
  const rotateAllRightBtn = $('rotate-all-right');
  
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
    
    dropZone.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    progressText.innerText = 'Loading pages...';

    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      
      pageGrid.innerHTML = '';
      pageRotations = new Array(totalPages).fill(0);

      for (let i = 1; i <= totalPages; i++) {
        progressFill.style.width = \`\${10 + Math.round((i / totalPages) * 80)}%\`;
        
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const scale = 200 / Math.max(viewport.width, viewport.height);
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.className = 'page-canvas';
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({
          canvasContext: canvas.getContext('2d'),
          viewport: scaledViewport
        }).promise;

        // Container
        const item = document.createElement('div');
        item.className = 'page-item';
        
        const wrap = document.createElement('div');
        wrap.className = 'page-canvas-wrapper';
        wrap.appendChild(canvas);
        
        const label = document.createElement('div');
        label.className = 'page-label';
        label.innerText = \`Page \${i}\`;

        const controls = document.createElement('div');
        controls.className = 'rotate-controls';
        
        const btnL = document.createElement('button');
        btnL.className = 'rotate-btn';
        btnL.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>\`;
        btnL.onclick = () => updateRotation(i - 1, -90, canvas);

        const btnR = document.createElement('button');
        btnR.className = 'rotate-btn';
        btnR.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>\`;
        btnR.onclick = () => updateRotation(i - 1, 90, canvas);

        controls.appendChild(btnL);
        controls.appendChild(btnR);

        item.appendChild(wrap);
        item.appendChild(label);
        item.appendChild(controls);
        pageGrid.appendChild(item);
      }

      progressWrap.classList.remove('visible');
      workspace.style.display = 'block';

    } catch (err) {
      console.error(err);
      alert('Error loading PDF.');
      progressWrap.classList.remove('visible');
      dropZone.style.display = 'block';
    }
  };

  const updateRotation = (index, angle, canvas) => {
    pageRotations[index] += angle;
    canvas.style.transform = \`rotate(\${pageRotations[index]}deg)\`;
  };

  rotateAllLeftBtn.addEventListener('click', () => {
    const canvases = document.querySelectorAll('.page-canvas');
    for (let i = 0; i < pageRotations.length; i++) {
      updateRotation(i, -90, canvases[i]);
    }
  });

  rotateAllRightBtn.addEventListener('click', () => {
    const canvases = document.querySelectorAll('.page-canvas');
    for (let i = 0; i < pageRotations.length; i++) {
      updateRotation(i, 90, canvases[i]);
    }
  });

  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  
  changeFileBtn.addEventListener('click', () => fileInput.click());

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    fileBuffer = null;
    finalBlob = null;
    pageRotations = [];
    resultZone.classList.remove('visible');
    workspace.style.display = 'none';
    dropZone.style.display = 'block';
  });

  applyBtn.addEventListener('click', async () => {
    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '50%';
    progressText.innerText = 'Rotating pages...';

    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        if (pageRotations[i] % 360 !== 0) {
          const currentRotation = pages[i].getRotation().angle;
          pages[i].setRotation(degrees(currentRotation + pageRotations[i]));
        }
      }

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
      alert('Error rotating PDF pages.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_rotated.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
