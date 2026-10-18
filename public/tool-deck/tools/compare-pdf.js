/* TOOLDECK — compare-pdf.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var box1 = $('box-1'), file1 = $('file-1'), info1 = $('info-1');
  var box2 = $('box-2'), file2 = $('file-2'), info2 = $('info-2');
  var btnCompare = $('btn-compare');
  var uploadZone = $('upload-zone');
  
  var progressWrap = $('progress-wrap'), progressFill = $('progress-fill'), progressText = $('progress-text');
  var resultZone = $('result-zone');
  var pane1 = $('pane-1'), pane2 = $('pane-2');

  var pdf1Bytes = null, pdf2Bytes = null;
  var pdfjsLib = window.pdfjsLib;

  // Box 1 handlers
  box1.addEventListener('click', function() { if (!pdf1Bytes) file1.click(); });
  file1.addEventListener('change', function(e) { if (e.target.files.length) handleFile(1, e.target.files[0]); });
  
  // Box 2 handlers
  box2.addEventListener('click', function() { if (!pdf2Bytes) file2.click(); });
  file2.addEventListener('change', function(e) { if (e.target.files.length) handleFile(2, e.target.files[0]); });

  function setupDrag(box, num) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(ev) {
      box.addEventListener(ev, function(e) { e.preventDefault(); e.stopPropagation(); });
    });
    box.addEventListener('dragover', function() { box.style.borderColor = 'var(--primary)'; });
    box.addEventListener('dragleave', function() { box.style.borderColor = 'var(--border)'; });
    box.addEventListener('drop', function(e) {
      box.style.borderColor = 'var(--border)';
      if (e.dataTransfer.files.length) handleFile(num, e.dataTransfer.files[0]);
    });
  }
  setupDrag(box1, 1);
  setupDrag(box2, 2);

  function handleFile(num, file) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var bytes = new Uint8Array(e.target.result);
      if (num === 1) {
        pdf1Bytes = bytes;
        info1.textContent = file.name;
        info1.style.display = 'block';
        box1.classList.add('has-file');
      } else {
        pdf2Bytes = bytes;
        info2.textContent = file.name;
        info2.style.display = 'block';
        box2.classList.add('has-file');
      }
      checkReady();
    };
    reader.readAsArrayBuffer(file);
  }

  function checkReady() {
    if (pdf1Bytes && pdf2Bytes) {
      btnCompare.disabled = false;
    }
  }

  btnCompare.addEventListener('click', async function() {
    if (!pdf1Bytes || !pdf2Bytes) return;
    
    uploadZone.style.display = 'none';
    progressWrap.style.display = 'block';

    try {
      progressText.textContent = 'Extracting Text from Original PDF...';
      progressFill.style.width = '20%';
      var text1 = await extractPdfText(pdf1Bytes);
      
      progressText.textContent = 'Extracting Text from Modified PDF...';
      progressFill.style.width = '50%';
      var text2 = await extractPdfText(pdf2Bytes);

      progressText.textContent = 'Computing Differences...';
      progressFill.style.width = '80%';
      
      // Compute diff
      var diffOutput = Diff.diffWords(text1, text2);
      
      renderDiff(diffOutput);
      
      progressFill.style.width = '100%';
      setTimeout(function() {
        progressWrap.style.display = 'none';
        resultZone.style.display = 'block';
      }, 500);

    } catch (err) {
      console.error(err);
      alert('Error comparing PDFs: ' + err.message);
      progressWrap.style.display = 'none';
      uploadZone.style.display = 'block';
    }
  });

  async function extractPdfText(bytes) {
    var loadingTask = pdfjsLib.getDocument({ data: bytes });
    var pdf = await loadingTask.promise;
    var totalPages = pdf.numPages;
    var fullText = "";

    for (var i = 1; i <= totalPages; i++) {
      var page = await pdf.getPage(i);
      var textContent = await page.getTextContent();
      var strings = textContent.items.map(function(item) { return item.str; });
      fullText += strings.join(' ') + "\\n\\n";
    }
    return fullText.replace(/\\s+/g, ' ').trim();
  }

  function renderDiff(diffOutput) {
    var html1 = '', html2 = '';
    
    diffOutput.forEach(function(part) {
      // Escape HTML
      var val = part.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      if (part.added) {
        html2 += '<span class="diff-add">' + val + '</span>';
      } else if (part.removed) {
        html1 += '<span class="diff-del">' + val + '</span>';
      } else {
        html1 += '<span class="diff-neutral">' + val + '</span>';
        html2 += '<span class="diff-neutral">' + val + '</span>';
      }
    });

    pane1.innerHTML = html1;
    pane2.innerHTML = html2;
  }

  // Sync scrolling between panes
  var isSyncingLeft = false, isSyncingRight = false;
  pane1.addEventListener('scroll', function() {
    if (!isSyncingLeft) {
      isSyncingRight = true;
      var ratio = pane1.scrollTop / (pane1.scrollHeight - pane1.clientHeight);
      pane2.scrollTop = ratio * (pane2.scrollHeight - pane2.clientHeight);
    }
    isSyncingLeft = false;
  });
  
  pane2.addEventListener('scroll', function() {
    if (!isSyncingRight) {
      isSyncingLeft = true;
      var ratio = pane2.scrollTop / (pane2.scrollHeight - pane2.clientHeight);
      pane1.scrollTop = ratio * (pane1.scrollHeight - pane1.clientHeight);
    }
    isSyncingRight = false;
  });

  // Global Drag & Drop preventer
  window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
  window.addEventListener('drop', function(e) { e.preventDefault(); }, false);

})();
