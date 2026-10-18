/* TOOLDECK — pdf-to-pdfa.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;

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
    finalBlob = null;
    resultZone.classList.remove('visible');
    updateUI();
  });

  convertBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    convertBtn.disabled = true;
    actionRow.style.display = 'none';
    fileListContainer.style.display = 'none';
    
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Loading PDF...';

    try {
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      
      progressFill.style.width = '60%';
      progressText.innerText = 'Flattening & archiving...';

      // Flatten form fields
      const form = srcDoc.getForm();
      if (form) form.flatten();

      // Copy pages
      const copiedPages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copiedPages.forEach(p => newDoc.addPage(p));

      // Set standard metadata
      newDoc.setTitle(srcDoc.getTitle() || currentFile.name.replace(/\.pdf$/i, ''));
      newDoc.setAuthor(srcDoc.getAuthor() || 'ToolDeck');
      newDoc.setSubject(srcDoc.getSubject() || 'Archived PDF');
      newDoc.setProducer('ToolDeck PDF/A Converter');
      newDoc.setCreator('ToolDeck');
      newDoc.setCreationDate(new Date());
      newDoc.setModificationDate(new Date());

      progressFill.style.width = '90%';
      progressText.innerText = 'Saving...';

      const pdfBytes = await newDoc.save({ useObjectStreams: false });
      finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });

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
      alert(err.message || 'Error converting PDF to PDF/A.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_archived.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
