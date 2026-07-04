/* TOOLDECK — repair-pdf.js */
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
  var progressFill = $('progress-fill');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');
  var repairLog = $('repair-log');

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
    
    // Simulate some work time so UI shows up
    progressFill.style.width = '20%';
    repairLog.innerHTML = '';
    
    setTimeout(async function() {
      try {
        progressFill.style.width = '50%';
        var logLines = [];
        logLines.push('Reading PDF streams...');
        
        // Use forgiving options in pdf-lib to try and read broken structures
        var pdfDoc = await PDFLib.PDFDocument.load(currentFileBytes, { 
          ignoreEncryption: true, 
          throwOnInvalidObject: false,
          updateMetadata: false 
        });
        
        logLines.push('Recovered ' + pdfDoc.getPageCount() + ' pages.');
        logLines.push('Rebuilding cross-reference tables...');
        progressFill.style.width = '80%';
        
        var pdfBytes = await pdfDoc.save();
        logLines.push('Fixing EOF markers & streams...');
        logLines.push('Repair complete.');
        
        progressFill.style.width = '100%';
        
        setTimeout(function() {
          progressWrap.style.display = 'none';
          resultZone.style.display = 'block';
          
          logLines.forEach(function(l) {
            var li = document.createElement('li');
            li.textContent = l;
            repairLog.appendChild(li);
          });
          
          var blob = new Blob([pdfBytes], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          var originalName = currentFile.name.replace(/\.pdf$/i, '');
          btnDownload.href = url;
          btnDownload.download = originalName + '-repaired.pdf';
        }, 500);

      } catch (err) {
        console.error(err);
        alert('Could not repair PDF: The file is too corrupted or not a PDF.\\n\\nDetails: ' + err.message);
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
