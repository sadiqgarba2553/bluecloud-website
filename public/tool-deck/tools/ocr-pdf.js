/* TOOLDECK — ocr-pdf.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var progressSub = $('progress-sub');
  var resultZone = $('result-zone');
  var resultTextarea = $('result-text');
  var btnDownload = $('btn-download');
  var btnCopy = $('btn-copy');

  var pdfPreview = $('pdf-preview');
  var pageInfo = $('page-info');
  var langSelect = $('lang-select');
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');

  var currentFile = null;
  var currentFileBytes = null;
  var pdfDocProxy = null;
  var totalPages = 0;

  var pdfjsLib = window.pdfjsLib;

  // Upload Handlers
  btnSelect.addEventListener('click', function() { fileInput.click(); });
  fileInput.addEventListener('change', function(e) { if (e.target.files.length) handleFile(e.target.files[0]); });

  function handleFile(file) {
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    currentFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      currentFileBytes = new Uint8Array(e.target.result);
      loadPDF(currentFileBytes);
    };
    reader.readAsArrayBuffer(file);
  }

  function loadPDF(bytes) {
    var loadingTask = pdfjsLib.getDocument({ data: bytes });
    loadingTask.promise.then(function(pdf) {
      pdfDocProxy = pdf;
      totalPages = pdf.numPages;
      pageInfo.textContent = totalPages + (totalPages === 1 ? ' page' : ' pages');
      
      uploadZone.style.display = 'none';
      workspace.style.display = 'block';
      
      // Render first page as preview
      pdf.getPage(1).then(function(page) {
        var viewport = page.getViewport({ scale: 1 });
        var maxW = 400;
        var scale = viewport.width > maxW ? maxW / viewport.width : 1;
        var scaledViewport = page.getViewport({ scale: scale });
        
        pdfPreview.width = scaledViewport.width;
        pdfPreview.height = scaledViewport.height;
        var ctx = pdfPreview.getContext('2d');
        
        page.render({ canvasContext: ctx, viewport: scaledViewport });
      });

    }).catch(function(err) {
      alert('Error loading PDF: ' + err.message);
    });
  }

  btnCancel.addEventListener('click', function() {
    currentFile = null;
    currentFileBytes = null;
    fileInput.value = '';
    workspace.style.display = 'none';
    uploadZone.style.display = 'block';
  });

  btnStart.addEventListener('click', function() {
    var lang = langSelect.value;
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    processOCR(lang);
  });

  async function processOCR(lang) {
    var fullText = "";
    
    try {
      progressText.textContent = 'Initializing OCR Engine...';
      progressSub.style.display = 'block';
      progressFill.style.width = '5%';

      var worker = await Tesseract.createWorker({
        logger: function(m) {
          if (m.status === 'recognizing text') {
            var progress = m.progress; // 0 to 1
            // We scale this over the current page
            // We will update the progress bar inside the loop
          } else if (m.status === 'loading tesseract core') {
             progressText.textContent = 'Loading Tesseract Core...';
          } else if (m.status === 'loading language traineddata') {
             progressText.textContent = 'Downloading Language Data (' + lang + ')...';
          } else {
             progressText.textContent = m.status;
          }
        }
      });
      
      await worker.loadLanguage(lang);
      await worker.initialize(lang);
      
      progressSub.style.display = 'none';

      for (var i = 1; i <= totalPages; i++) {
        progressText.textContent = 'Processing Page ' + i + ' of ' + totalPages + '...';
        progressFill.style.width = Math.round(((i - 1) / totalPages) * 100) + '%';
        
        // Render high-res canvas for OCR
        var page = await pdfDocProxy.getPage(i);
        var viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better OCR
        
        var canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        var ctx = canvas.getContext('2d');
        
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        
        var ret = await worker.recognize(canvas);
        fullText += ret.data.text + "\\n\\n";
        
        progressFill.style.width = Math.round((i / totalPages) * 100) + '%';
      }

      await worker.terminate();
      
      // Success
      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';
      
      resultTextarea.value = fullText.trim();
      
      var blob = new Blob([fullText.trim()], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var originalName = currentFile.name.replace(/\.pdf$/i, '');
      btnDownload.href = url;
      btnDownload.download = originalName + '-ocr.txt';

    } catch (err) {
      console.error(err);
      alert('OCR Processing Error: ' + err.message);
      progressWrap.style.display = 'none';
      workspace.style.display = 'block';
    }
  }

  btnCopy.addEventListener('click', function() {
    resultTextarea.select();
    document.execCommand('copy');
    var ogText = btnCopy.textContent;
    btnCopy.textContent = 'Copied!';
    setTimeout(function() { btnCopy.textContent = ogText; }, 2000);
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
