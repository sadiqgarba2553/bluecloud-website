/* TOOLDECK — flatten-pdf.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  
  var wsFilename = $('ws-filename');
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');

  var currentFile = null;
  var currentFileBytes = null;

  // Upload Handlers
  btnSelect.addEventListener('click', function() { fileInput.click(); });
  fileInput.addEventListener('change', function(e) { if (e.target.files.length) handleFile(e.target.files[0]); });

  function handleFile(file) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    currentFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      currentFileBytes = new Uint8Array(e.target.result);
      
      wsFilename.textContent = file.name;
      uploadZone.style.display = 'none';
      workspace.style.display = 'block';
    };
    reader.readAsArrayBuffer(file);
  }

  btnCancel.addEventListener('click', function() {
    currentFile = null;
    currentFileBytes = null;
    fileInput.value = '';
    workspace.style.display = 'none';
    uploadZone.style.display = 'block';
  });

  btnStart.addEventListener('click', async function() {
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    setTimeout(async function() {
      try {
        var pdfDoc = await PDFLib.PDFDocument.load(currentFileBytes);
        
        var form = pdfDoc.getForm();
        form.flatten();
        
        var pdfBytes = await pdfDoc.save();
        
        progressWrap.style.display = 'none';
        resultZone.style.display = 'block';
        
        var blob = new Blob([pdfBytes], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        var originalName = currentFile.name.replace(/\.pdf$/i, '');
        btnDownload.href = url;
        btnDownload.download = originalName + '-flattened.pdf';

      } catch (err) {
        console.error(err);
        alert('Could not flatten PDF: ' + err.message);
        progressWrap.style.display = 'none';
        workspace.style.display = 'block';
      }
    }, 100);
  });

  // Global Drag & Drop preventer and upload zone click
  window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
  window.addEventListener('drop', function(e) { e.preventDefault(); }, false);

  if (typeof uploadZone !== 'undefined' && uploadZone) {
    uploadZone.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        if (fileInput) fileInput.click();
      }
    });
  }

})();
