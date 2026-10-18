/* TOOLDECK — merge-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  // State
  let files = [];
  let dragSrcEl = null;

  // Elements
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileList = $('file-list');
  const addMoreBtn = $('add-more-btn');
  const fileInputMore = $('file-input-more');
  const optionsPanel = $('options-panel');
  const pageRangesPanel = $('page-ranges-panel');
  const pageRangesContainer = $('page-ranges');
  const actionRow = $('action-row');
  const mergeBtn = $('merge-btn');
  const clearBtn = $('clear-btn');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  const resultZone = $('result-zone');
  const statFiles = $('stat-files');
  const statPages = $('stat-pages');
  const statSize = $('stat-size');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');
  
  let mergedPdfBytes = null;
  let finalFilename = '';

  // Options
  const optFilename = $('opt-filename');
  const optPageSize = $('opt-pagesize');
  const optBookmarks = $('opt-bookmarks');
  optBookmarks?.addEventListener('click', () => {
    const active = optBookmarks.classList.toggle('active');
    optBookmarks.setAttribute('aria-checked', active);
  });

  // Size formatter
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Unique ID for files
  const uid = () => Math.random().toString(36).substr(2, 9);

  // File handling
  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (validFiles.length === 0) {
      alert('Please upload a valid PDF file.');
      return;
    }

    validFiles.forEach(f => {
      files.push({ id: uid(), file: f, range: '' });
    });

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
    pageRangesContainer.innerHTML = '';

    files.forEach((f, index) => {
      // List item
      const item = document.createElement('div');
      item.className = 'file-item';
      item.draggable = true;
      item.dataset.id = f.id;
      item.innerHTML = `
        <div class="file-drag-handle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <div class="file-thumb">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="file-info">
          <div class="file-name">${f.file.name}</div>
          <div class="file-size">${formatSize(f.file.size)}</div>
        </div>
        <button class="file-remove" data-id="${f.id}" title="Remove file">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      // Drag events for reordering
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);

      // Remove event
      item.querySelector('.file-remove').addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        files = files.filter(file => file.id !== id);
        renderFileList();
        updateUI();
      });

      fileList.appendChild(item);

      // Page range item
      const rangeRow = document.createElement('div');
      rangeRow.className = 'option-row';
      rangeRow.innerHTML = `
        <div style="flex:1;min-width:0;padding-right:10px">
          <div class="option-label" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${index + 1}. ${f.file.name}</div>
        </div>
        <input type="text" class="opt-input range-input" data-id="${f.id}" value="${f.range}" placeholder="e.g. 1-3, 5" style="width:120px" />
      `;
      const rangeInput = rangeRow.querySelector('.range-input');
      rangeInput.addEventListener('input', (e) => {
        const file = files.find(file => file.id === f.id);
        if (file) file.range = e.target.value;
      });
      pageRangesContainer.appendChild(rangeRow);
    });
  };

  // Drag & Drop reordering logic
  function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
  function handleDragEnter(e) { this.classList.add('drag-over'); }
  function handleDragLeave(e) { this.classList.remove('drag-over'); }
  function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (dragSrcEl !== this) {
      // Reorder array
      const srcId = dragSrcEl.dataset.id;
      const tgtId = this.dataset.id;
      const srcIdx = files.findIndex(f => f.id === srcId);
      const tgtIdx = files.findIndex(f => f.id === tgtId);
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

  // UI State
  const updateUI = () => {
    if (files.length > 0) {
      dropZone.style.display = 'none';
      fileListContainer.style.display = 'block';
      optionsPanel.style.display = 'block';
      pageRangesPanel.style.display = 'block';
      actionRow.style.display = 'flex';
      mergeBtn.disabled = files.length < 2;
    } else {
      dropZone.style.display = 'block';
      fileListContainer.style.display = 'none';
      optionsPanel.style.display = 'none';
      pageRangesPanel.style.display = 'none';
      actionRow.style.display = 'none';
      resultZone.classList.remove('visible');
    }
  };

  clearBtn.addEventListener('click', () => {
    files = [];
    optFilename.value = 'merged';
    renderFileList();
    updateUI();
  });

  resetBtn.addEventListener('click', () => {
    files = [];
    mergedPdfBytes = null;
    resultZone.classList.remove('visible');
    renderFileList();
    updateUI();
  });

  // Parse page ranges (1-indexed string like "1-3, 5" -> 0-indexed array [0,1,2,4])
  const parseRange = (rangeStr, maxPages) => {
    if (!rangeStr.trim()) {
      return Array.from({length: maxPages}, (_, i) => i);
    }
    const pages = new Set();
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const p = part.trim();
      if (!p) continue;
      if (p.includes('-')) {
        const [start, end] = p.split('-').map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          for (let i = start; i <= end && i <= maxPages; i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const num = parseInt(p, 10);
        if (!isNaN(num) && num > 0 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a,b) => a-b);
  };

  // Merge logic
  mergeBtn.addEventListener('click', async () => {
    if (files.length < 2) return;

    mergeBtn.disabled = true;
    clearBtn.disabled = true;
    progressWrap.classList.add('visible');
    progressFill.style.width = '0%';
    resultZone.classList.remove('visible', 'error');

    try {
      const PDFDocument = PDFLib.PDFDocument;
      const mergedPdf = await PDFDocument.create();
      let totalPages = 0;
      let bookmarks = [];

      for (let i = 0; i < files.length; i++) {
        progressText.innerText = `Processing file ${i + 1} of ${files.length}...`;
        progressFill.style.width = `${Math.round((i / files.length) * 80)}%`;

        const fileData = await files[i].file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });
        const docPagesCount = pdfDoc.getPageCount();
        
        const pagesToCopy = parseRange(files[i].range, docPagesCount);
        
        if (pagesToCopy.length > 0) {
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pagesToCopy);
          
          if (optBookmarks.classList.contains('active')) {
             bookmarks.push({ title: files[i].file.name, dest: mergedPdf.getPageCount() });
          }

          for (const page of copiedPages) {
            mergedPdf.addPage(page);
            totalPages++;
          }
        }
      }

      progressText.innerText = 'Finalizing document...';
      progressFill.style.width = '90%';

      // Scale pages if needed (basic implementation)
      const pageSize = optPageSize.value;
      if (pageSize !== 'keep') {
         // A4: 595.28 x 841.89
         // Letter: 612 x 792
         // Legal: 612 x 1008
         let targetWidth, targetHeight;
         if (pageSize === 'a4') { targetWidth = 595.28; targetHeight = 841.89; }
         else if (pageSize === 'letter') { targetWidth = 612; targetHeight = 792; }
         else if (pageSize === 'legal') { targetWidth = 612; targetHeight = 1008; }

         const pages = mergedPdf.getPages();
         for (const page of pages) {
           page.setSize(targetWidth, targetHeight);
           // Note: True scaling requires wrapping content in an XObject. 
           // For simplicity, we just set the page box size.
         }
      }

      mergedPdfBytes = await mergedPdf.save();
      finalFilename = (optFilename.value.trim() || 'merged') + '.pdf';

      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        
        statFiles.innerText = files.length;
        statPages.innerText = totalPages;
        statSize.innerText = formatSize(mergedPdfBytes.byteLength);
        
        fileListContainer.style.display = 'none';
        optionsPanel.style.display = 'none';
        pageRangesPanel.style.display = 'none';
        actionRow.style.display = 'none';
        
        resultZone.classList.add('visible');
        mergeBtn.disabled = false;
        clearBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      resultZone.classList.add('visible', 'error');
      resultZone.querySelector('.result-title').innerText = 'Error merging files';
      $('result-sub').innerText = err.message || 'An unexpected error occurred.';
      mergeBtn.disabled = false;
      clearBtn.disabled = false;
    }
  });

  // Download
  downloadBtn.addEventListener('click', () => {
    if (!mergedPdfBytes) return;
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
