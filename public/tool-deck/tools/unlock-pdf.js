/* TOOLDECK — unlock-pdf.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  var progressWrap = $('progress-wrap');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');
  var passwordInput = $('pdf-password');
  var btnUnlock = $('btn-unlock');
  var passwordError = $('password-error');

  var currentFile = null;
  var currentFileBytes = null;

  // Upload Handlers
  btnSelect.addEventListener('click', function() { fileInput.click(); });
  fileInput.addEventListener('change', function(e) { if (e.target.files.length) handleFile(e.target.files[0]); });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(ev) {
    uploadZone.addEventListener(ev, function(e) {
      e.preventDefault(); e.stopPropagation();
    });
  });
  uploadZone.addEventListener('dragover', function() { uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', function() { uploadZone.classList.remove('dragover'); });
  uploadZone.addEventListener('drop', function(e) {
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    currentFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      currentFileBytes = new Uint8Array(e.target.result);
      checkEncryption(currentFileBytes);
    };
    reader.readAsArrayBuffer(file);
  }

  function checkEncryption(bytes) {
    // Attempt to load without password
    PDFLib.PDFDocument.load(bytes)
      .then(function() {
        // Not encrypted!
        alert('This PDF is not password protected.');
        // Reset
        fileInput.value = '';
      })
      .catch(function(err) {
        if (err.message && err.message.toLowerCase().indexOf('encrypted') !== -1) {
          // It is encrypted
          uploadZone.style.display = 'none';
          workspace.style.display = 'block';
          passwordInput.focus();
        } else {
          alert('Error reading PDF: ' + err.message);
        }
      });
  }

  // Handle Unlock
  btnUnlock.addEventListener('click', processUnlock);
  passwordInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') processUnlock();
  });

  function processUnlock() {
    var pwd = passwordInput.value;
    if (!pwd) {
      passwordError.textContent = 'Please enter a password.';
      passwordError.style.display = 'block';
      return;
    }
    passwordError.style.display = 'none';
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';

    // Small delay to allow UI to update
    setTimeout(function() {
      PDFLib.PDFDocument.load(currentFileBytes, { password: pwd })
        .then(function(pdfDoc) {
          // Password correct, PDF loaded!
          return pdfDoc.save();
        })
        .then(function(unlockedBytes) {
          // Success!
          progressWrap.style.display = 'none';
          resultZone.style.display = 'block';
          
          var blob = new Blob([unlockedBytes], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          var originalName = currentFile.name.replace(/\.pdf$/i, '');
          btnDownload.href = url;
          btnDownload.download = originalName + '-unlocked.pdf';
        })
        .catch(function(err) {
          // Password incorrect
          progressWrap.style.display = 'none';
          workspace.style.display = 'block';
          
          if (err.message && err.message.toLowerCase().indexOf('encrypted') !== -1) {
            passwordError.textContent = 'Incorrect password. Please try again.';
          } else {
            passwordError.textContent = 'Failed to unlock: ' + err.message;
          }
          passwordError.style.display = 'block';
          passwordInput.value = '';
          passwordInput.focus();
        });
    }, 100);
  }


  if (typeof uploadZone !== 'undefined' && uploadZone) {
    uploadZone.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        var fi = document.getElementById('file-input');
        if (fi) fi.click();
      }
    });
  }
})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
