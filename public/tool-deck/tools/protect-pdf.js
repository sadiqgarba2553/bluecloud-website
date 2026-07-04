import { encryptPDF } from 'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-encrypt@1.0.2/dist/index.mjs';

var $ = function(id) { return document.getElementById(id); };

var fileInput = $('file-input');
var btnSelect = $('btn-select');
var uploadZone = $('upload-zone');
var workspace = $('workspace');
var progressWrap = $('progress-wrap');
var resultZone = $('result-zone');
var btnDownload = $('btn-download');
var pwdInput = $('pwd-input');
var pwdConfirm = $('pwd-confirm');
var btnProtect = $('btn-protect');
var pwdError = $('pwd-error');

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
    // Show workspace
    uploadZone.style.display = 'none';
    workspace.style.display = 'block';
    pwdInput.focus();
  };
  reader.readAsArrayBuffer(file);
}

// Handle Protect
btnProtect.addEventListener('click', processProtect);
pwdInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') pwdConfirm.focus(); });
pwdConfirm.addEventListener('keydown', function(e) { if (e.key === 'Enter') processProtect(); });

async function processProtect() {
  var pwd = pwdInput.value;
  var conf = pwdConfirm.value;

  if (!pwd) {
    pwdError.textContent = 'Please enter a password.';
    pwdError.style.display = 'block';
    return;
  }
  if (pwd !== conf) {
    pwdError.textContent = 'Passwords do not match.';
    pwdError.style.display = 'block';
    return;
  }
  pwdError.style.display = 'none';

  workspace.style.display = 'none';
  progressWrap.style.display = 'flex';

  try {
    // Encrypt PDF using the imported encryptPDF
    var encryptedBytes = await encryptPDF(currentFileBytes, pwd);
    
    // Success!
    progressWrap.style.display = 'none';
    resultZone.style.display = 'block';
    
    var blob = new Blob([encryptedBytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var originalName = currentFile.name.replace(/\.pdf$/i, '');
    btnDownload.href = url;
    btnDownload.download = originalName + '-protected.pdf';

  } catch (err) {
    console.error(err);
    progressWrap.style.display = 'none';
    workspace.style.display = 'block';
    pwdError.textContent = 'Failed to encrypt: ' + err.message;
    pwdError.style.display = 'block';
  }
}

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
