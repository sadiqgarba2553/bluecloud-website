/* TOOLDECK — organize-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  let pdfWidth = 595.28; // A4 default fallback
  let pdfHeight = 841.89;

  // pageState array objects: { id: uniqueId, originalIndex: number (-1 for blank), canvas: HTMLCanvasElement }
  let pageState = [];
  let nextId = 0;
  
  let draggedItem = null;

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  const pageGrid = $('page-grid');
  
  const addBlankBtn = $('add-blank-btn');
  const applyBtn = $('apply-btn');
  
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

  const createBlankCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'page-canvas';
    // Match rough A4 aspect ratio
    canvas.width = 150;
    canvas.height = 212;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const copyCanvas = (original) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'page-canvas';
    canvas.width = original.width;
    canvas.height = original.height;
    canvas.getContext('2d').drawImage(original, 0, 0);
    return canvas;
  };

  const renderGrid = () => {
    pageGrid.innerHTML = '';
    
    pageState.forEach((page, index) => {
      const item = document.createElement('div');
      item.className = 'page-item';
      item.draggable = true;
      item.dataset.id = page.id;
      
      const wrap = document.createElement('div');
      wrap.className = 'page-canvas-wrapper';
      wrap.appendChild(page.canvas);
      
      const label = document.createElement('div');
      label.className = 'page-label';
      label.innerText = \`Page \${index + 1}\`;

      const controls = document.createElement('div');
      controls.className = 'page-actions';
      
      // Duplicate Btn
      const btnDup = document.createElement('button');
      btnDup.className = 'page-btn';
      btnDup.title = 'Duplicate';
      btnDup.innerHTML = \`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>\`;
      btnDup.onclick = (e) => {
        e.stopPropagation();
        duplicatePage(page.id);
      };

      // Delete Btn
      const btnDel = document.createElement('button');
      btnDel.className = 'page-btn danger';
      btnDel.title = 'Delete';
      btnDel.innerHTML = \`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>\`;
      btnDel.onclick = (e) => {
        e.stopPropagation();
        deletePage(page.id);
      };

      controls.appendChild(btnDup);
      controls.appendChild(btnDel);

      item.appendChild(wrap);
      item.appendChild(label);
      item.appendChild(controls);
      
      // Drag events
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
      });
      
      item.addEventListener('dragend', () => {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
        updateStateFromDOM();
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(pageGrid, e.clientX);
        if (afterElement == null) {
          pageGrid.appendChild(draggedItem);
        } else {
          pageGrid.insertBefore(draggedItem, afterElement);
        }
      });

      pageGrid.appendChild(item);
    });
  };

  const getDragAfterElement = (container, x) => {
    const draggableElements = [...container.querySelectorAll('.page-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  const updateStateFromDOM = () => {
    const newOrder = [];
    document.querySelectorAll('.page-item').forEach(el => {
      const id = parseInt(el.dataset.id);
      const state = pageState.find(p => p.id === id);
      if (state) newOrder.push(state);
    });
    pageState = newOrder;
    
    // Update labels
    document.querySelectorAll('.page-item').forEach((el, index) => {
      el.querySelector('.page-label').innerText = \`Page \${index + 1}\`;
    });
  };

  const duplicatePage = (id) => {
    const index = pageState.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const source = pageState[index];
    const newPage = {
      id: nextId++,
      originalIndex: source.originalIndex,
      canvas: copyCanvas(source.canvas)
    };
    
    pageState.splice(index + 1, 0, newPage);
    renderGrid();
  };

  const deletePage = (id) => {
    if (pageState.length <= 1) {
      alert("You cannot delete the last page.");
      return;
    }
    pageState = pageState.filter(p => p.id !== id);
    renderGrid();
  };

  addBlankBtn.addEventListener('click', () => {
    pageState.push({
      id: nextId++,
      originalIndex: -1,
      canvas: createBlankCanvas()
    });
    renderGrid();
    // scroll to bottom
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

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
      
      pageState = [];
      nextId = 0;

      for (let i = 1; i <= totalPages; i++) {
        progressFill.style.width = \`\${10 + Math.round((i / totalPages) * 80)}%\`;
        
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        
        if (i === 1) {
          pdfWidth = viewport.width;
          pdfHeight = viewport.height;
        }

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

        pageState.push({
          id: nextId++,
          originalIndex: i - 1, // 0-indexed for pdf-lib
          canvas: canvas
        });
      }

      renderGrid();

      progressWrap.classList.remove('visible');
      workspace.style.display = 'block';

    } catch (err) {
      console.error(err);
      alert('Error loading PDF.');
      progressWrap.classList.remove('visible');
      dropZone.style.display = 'block';
    }
  };

  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  changeFileBtn.addEventListener('click', () => fileInput.click());

  resetBtn.addEventListener('click', () => {
    currentFile = null; fileBuffer = null; finalBlob = null; pageState = [];
    resultZone.classList.remove('visible');
    workspace.style.display = 'none';
    dropZone.style.display = 'block';
  });

  applyBtn.addEventListener('click', async () => {
    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Organizing PDF...';

    try {
      const srcDoc = await PDFDocument.load(fileBuffer);
      const newDoc = await PDFDocument.create();

      for (let i = 0; i < pageState.length; i++) {
        progressFill.style.width = \`\${30 + Math.round((i / pageState.length) * 60)}%\`;
        const state = pageState[i];
        
        if (state.originalIndex === -1) {
          // Blank page
          newDoc.addPage([pdfWidth, pdfHeight]);
        } else {
          const [copiedPage] = await newDoc.copyPages(srcDoc, [state.originalIndex]);
          newDoc.addPage(copiedPage);
        }
      }

      progressFill.style.width = '90%';
      progressText.innerText = 'Saving...';

      const pdfBytes = await newDoc.save();
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
      alert('Error organizing PDF.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_organized.pdf';
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
