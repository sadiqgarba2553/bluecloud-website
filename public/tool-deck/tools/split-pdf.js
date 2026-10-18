/* TOOLDECK — split-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  // State
  let currentFile = null;
  let fileBuffer = null;
  let outputFiles = []; // { name, bytes }

  // Elements
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const optionsPanel = $('options-panel');
  const optRadios = document.querySelectorAll('.opt-radio');
  const modeExtract = $('mode-extract');
  const modeSplit = $('mode-split');
  const optRanges = $('opt-ranges');
  const optMergeExtracted = $('opt-merge-extracted');
  const optSplitN = $('opt-split-n');

  const actionRow = $('action-row');
  const splitBtn = $('split-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const statFiles = $('stat-files');
  const statSize = $('stat-size');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  // Modes
  let currentMode = 'extract'; // 'extract' or 'split'
  optRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      optRadios.forEach(r => r.classList.remove('active'));
      radio.classList.add('active');
      currentMode = radio.dataset.mode;
      if (currentMode === 'extract') {
        modeExtract.style.display = 'block';
        modeSplit.style.display = 'none';
      } else {
        modeExtract.style.display = 'none';
        modeSplit.style.display = 'block';
      }
    });
  });

  optMergeExtracted?.addEventListener('click', () => {
    const active = optMergeExtracted.classList.toggle('active');
    optMergeExtracted.setAttribute('aria-checked', active);
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

  // UI State
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
    outputFiles = [];
    resultZone.classList.remove('visible');
    updateUI();
  });

  // Parse page ranges
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

  // Split logic
  splitBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    splitBtn.disabled = true;
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    resultZone.classList.remove('visible', 'error');
    outputFiles = [];

    try {
      const PDFDocument = PDFLib.PDFDocument;
      progressText.innerText = 'Loading PDF...';
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      let pagesToExtract = [];
      let chunks = []; // array of array of page indices (0-indexed)

      if (currentMode === 'extract') {
        pagesToExtract = parseRange(optRanges.value, totalPages);
        if (pagesToExtract.length === 0) throw new Error("No valid pages selected.");
        
        if (optMergeExtracted.classList.contains('active')) {
          chunks.push(pagesToExtract);
        } else {
          pagesToExtract.forEach(p => chunks.push([p]));
        }
      } else {
        // split mode
        const n = parseInt(optSplitN.value, 10) || 1;
        if (n < 1) throw new Error("Split pages must be at least 1.");
        for (let i = 0; i < totalPages; i += n) {
          const chunk = [];
          for (let j = 0; j < n && (i + j) < totalPages; j++) {
            chunk.push(i + j);
          }
          chunks.push(chunk);
        }
      }

      progressText.innerText = 'Splitting...';
      const originalName = currentFile.name.replace(/\.pdf$/i, '');

      for (let i = 0; i < chunks.length; i++) {
        progressFill.style.width = `${10 + Math.round((i / chunks.length) * 80)}%`;
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, chunks[i]);
        for (const page of copiedPages) {
          newPdf.addPage(page);
        }
        const bytes = await newPdf.save();
        let name = `${originalName}_part${i + 1}.pdf`;
        if (currentMode === 'extract' && optMergeExtracted.classList.contains('active')) {
          name = `${originalName}_extracted.pdf`;
        } else if (currentMode === 'extract' && chunks[i].length === 1) {
          name = `${originalName}_page${chunks[i][0] + 1}.pdf`;
        }
        outputFiles.push({ name, bytes });
      }

      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        
        statFiles.innerText = outputFiles.length;
        const totalSize = outputFiles.reduce((acc, f) => acc + f.bytes.byteLength, 0);
        statSize.innerText = formatSize(totalSize);
        
        if (outputFiles.length > 1) {
          downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download ZIP`;
        } else {
          downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF`;
        }

        fileListContainer.style.display = 'none';
        optionsPanel.style.display = 'none';
        actionRow.style.display = 'none';
        
        resultZone.classList.add('visible');
        splitBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      resultZone.classList.add('visible', 'error');
      resultZone.querySelector('.result-title').innerText = 'Error splitting PDF';
      $('result-sub').innerText = err.message || 'An unexpected error occurred.';
      splitBtn.disabled = false;
    }
  });

  // Download
  downloadBtn.addEventListener('click', async () => {
    if (outputFiles.length === 0) return;

    if (outputFiles.length === 1) {
      const blob = new Blob([outputFiles[0].bytes], { type: 'application/pdf' });
      saveAs(blob, outputFiles[0].name);
    } else {
      // ZIP
      const zip = new JSZip();
      outputFiles.forEach(f => {
        zip.file(f.name, f.bytes);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, currentFile.name.replace(/\.pdf$/i, '') + '_split.zip');
    }
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
