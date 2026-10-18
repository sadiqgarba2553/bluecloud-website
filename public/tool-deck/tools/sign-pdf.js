/* TOOLDECK — sign-pdf.js */
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

  var btnPrev = $('btn-prev');
  var btnNext = $('btn-next');
  var pageNumEl = $('page-num');
  var pdfContainer = $('pdf-container');
  var pdfPreview = $('pdf-preview');
  var overlayContainer = $('overlay-container');
  var btnSign = $('btn-sign');

  var currentFile = null;
  var currentFileBytes = null;
  var pdfDocProxy = null;
  var currentPageNum = 1;
  var totalPages = 1;
  var currentScale = 1;

  // Signatures State: { pageNumber: [ { id, src, x, y, width, height } ] }
  var pageSignatures = {};
  var sigIdCounter = 0;

  // Init pdf.js
  var pdfjsLib = window.pdfjsLib;

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
      loadPDF(currentFileBytes);
    };
    reader.readAsArrayBuffer(file);
  }

  function loadPDF(bytes) {
    var loadingTask = pdfjsLib.getDocument({ data: bytes });
    loadingTask.promise.then(function(pdf) {
      pdfDocProxy = pdf;
      totalPages = pdf.numPages;
      currentPageNum = 1;
      pageSignatures = {};
      for(var i=1; i<=totalPages; i++) { pageSignatures[i] = []; }
      
      uploadZone.style.display = 'none';
      workspace.style.display = 'flex';
      
      renderPage(currentPageNum);
    }).catch(function(err) {
      alert('Error loading PDF: ' + err.message);
    });
  }

  function renderPage(num) {
    pdfDocProxy.getPage(num).then(function(page) {
      var viewport = page.getViewport({ scale: 1 });
      // Calculate scale to fit width (max 800px)
      var maxW = 800;
      var scale = viewport.width > maxW ? maxW / viewport.width : 1;
      var scaledViewport = page.getViewport({ scale: scale });
      currentScale = scale;

      pdfPreview.width = scaledViewport.width;
      pdfPreview.height = scaledViewport.height;
      pdfContainer.style.width = scaledViewport.width + 'px';
      pdfContainer.style.height = scaledViewport.height + 'px';

      var renderContext = {
        canvasContext: pdfPreview.getContext('2d'),
        viewport: scaledViewport
      };
      
      page.render(renderContext).promise.then(function() {
        pageNumEl.textContent = 'Page ' + num + ' of ' + totalPages;
        btnPrev.disabled = num <= 1;
        btnNext.disabled = num >= totalPages;
        
        restoreSignaturesForPage(num);
      });
    });
  }

  btnPrev.addEventListener('click', function() {
    if (currentPageNum > 1) {
      saveSignaturesForPage(currentPageNum);
      currentPageNum--;
      renderPage(currentPageNum);
    }
  });

  btnNext.addEventListener('click', function() {
    if (currentPageNum < totalPages) {
      saveSignaturesForPage(currentPageNum);
      currentPageNum++;
      renderPage(currentPageNum);
    }
  });

  // TABS
  var tabs = document.querySelectorAll('.sign-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.sign-panel').forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      $(tab.getAttribute('data-target')).classList.add('active');
      if (tab.getAttribute('data-target') === 'panel-draw') resizeCanvas();
    });
  });

  // DRAW CANVAS
  var sigCanvas = $('sig-canvas');
  var ctx = sigCanvas.getContext('2d');
  var drawing = false;

  function resizeCanvas() {
    // Canvas CSS is 100% width, so we set exact pixels
    var rect = sigCanvas.parentElement.getBoundingClientRect();
    if(rect.width > 0) {
      sigCanvas.width = rect.width;
      // keep drawing context settings
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  }
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  function getPos(e) {
    var rect = sigCanvas.getBoundingClientRect();
    var clientX = e.clientX;
    var clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    var pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    var pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDraw(e) {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
  }

  sigCanvas.addEventListener('mousedown', startDraw);
  sigCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);
  sigCanvas.addEventListener('touchstart', startDraw);
  sigCanvas.addEventListener('touchmove', draw);
  window.addEventListener('touchend', stopDraw);

  $('btn-clear-sig').addEventListener('click', function() {
    ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  });

  function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  }

  $('btn-add-drawn').addEventListener('click', function() {
    if (isCanvasBlank(sigCanvas)) return alert('Please draw a signature first.');
    var dataURL = sigCanvas.toDataURL('image/png');
    addSignatureToPage(dataURL);
  });

  // TYPE TEXT
  var typeInput = $('sig-text');
  $('btn-add-typed').addEventListener('click', function() {
    var txt = typeInput.value.trim();
    if (!txt) return alert('Please type a signature first.');
    
    // Create an image from text
    var tcanvas = document.createElement('canvas');
    var tctx = tcanvas.getContext('2d');
    tcanvas.width = 400;
    tcanvas.height = 100;
    tctx.font = "60px 'Brush Script MT', 'Caveat', cursive, serif";
    tctx.textBaseline = 'middle';
    tctx.textAlign = 'center';
    tctx.fillStyle = '#000000';
    tctx.fillText(txt, 200, 50);
    
    addSignatureToPage(tcanvas.toDataURL('image/png'));
    typeInput.value = '';
  });

  // UPLOAD IMAGE
  var imgInput = $('sig-image-input');
  var imgPreview = $('sig-image-preview');
  var btnAddImg = $('btn-add-img');
  var loadedImgData = null;

  imgInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        loadedImgData = evt.target.result;
        imgPreview.src = loadedImgData;
        imgPreview.style.display = 'block';
        btnAddImg.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  });

  btnAddImg.addEventListener('click', function() {
    if (loadedImgData) {
      addSignatureToPage(loadedImgData);
      imgInput.value = '';
      imgPreview.style.display = 'none';
      loadedImgData = null;
      btnAddImg.disabled = true;
    }
  });


  // OVERLAY LOGIC
  function addSignatureToPage(dataURL) {
    var sig = {
      id: 'sig_' + (sigIdCounter++),
      src: dataURL,
      x: 50, // default center
      y: 50,
      width: 200,
      height: 100
    };
    
    // Auto calculate height based on image aspect ratio
    var img = new Image();
    img.onload = function() {
      var aspect = img.height / img.width;
      sig.height = sig.width * aspect;
      sig.x = (pdfContainer.offsetWidth - sig.width) / 2;
      sig.y = (pdfContainer.offsetHeight - sig.height) / 2;
      
      pageSignatures[currentPageNum].push(sig);
      createOverlayElement(sig);
    };
    img.src = dataURL;
  }

  function createOverlayElement(sig) {
    var el = document.createElement('div');
    el.className = 'overlay-item';
    el.id = sig.id;
    el.style.left = sig.x + 'px';
    el.style.top = sig.y + 'px';
    el.style.width = sig.width + 'px';
    el.style.height = sig.height + 'px';
    el.style.pointerEvents = 'auto'; // allow interaction

    var img = document.createElement('img');
    img.src = sig.src;
    el.appendChild(img);

    // Delete button
    var del = document.createElement('div');
    del.innerHTML = '×';
    del.style.position = 'absolute';
    del.style.top = '-10px';
    del.style.right = '-10px';
    del.style.background = '#ef4444';
    del.style.color = '#fff';
    del.style.width = '20px';
    del.style.height = '20px';
    del.style.borderRadius = '50%';
    del.style.textAlign = 'center';
    del.style.lineHeight = '18px';
    del.style.cursor = 'pointer';
    del.style.fontSize = '14px';
    del.addEventListener('click', function(e) {
      e.stopPropagation();
      el.remove();
      var arr = pageSignatures[currentPageNum];
      for(var i=0; i<arr.length; i++){
        if(arr[i].id === sig.id) { arr.splice(i, 1); break; }
      }
    });
    el.appendChild(del);

    // Resize Handle
    var resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.width = '16px';
    resizer.style.height = '16px';
    resizer.style.bottom = '-8px';
    resizer.style.right = '-8px';
    resizer.style.background = '#3b82f6';
    resizer.style.borderRadius = '50%';
    resizer.style.cursor = 'se-resize';
    el.appendChild(resizer);

    overlayContainer.appendChild(el);

    // Make Draggable & Resizable
    var isDragging = false;
    var isResizing = false;
    var startX, startY, startLeft, startTop, startW, startH;

    el.addEventListener('mousedown', function(e) {
      if(e.target === del) return;
      if(e.target === resizer) {
        isResizing = true;
      } else {
        isDragging = true;
      }
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseFloat(el.style.left);
      startTop = parseFloat(el.style.top);
      startW = parseFloat(el.style.width);
      startH = parseFloat(el.style.height);
      e.stopPropagation();
      e.preventDefault();
    });

    window.addEventListener('mousemove', function(e) {
      if(isDragging) {
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        el.style.left = (startLeft + dx) + 'px';
        el.style.top = (startTop + dy) + 'px';
        sig.x = startLeft + dx;
        sig.y = startTop + dy;
      } else if (isResizing) {
        var dx = e.clientX - startX;
        var newW = startW + dx;
        if(newW < 20) newW = 20;
        var aspect = startH / startW;
        var newH = newW * aspect;
        el.style.width = newW + 'px';
        el.style.height = newH + 'px';
        sig.width = newW;
        sig.height = newH;
      }
    });

    window.addEventListener('mouseup', function() {
      isDragging = false;
      isResizing = false;
    });
  }

  function saveSignaturesForPage(num) {
    // Current DOM already updates the sig.x/y/w/h references, so just ensure they stay in bounds?
    // Not strictly needed since objects are passed by reference, but good practice
  }

  function restoreSignaturesForPage(num) {
    overlayContainer.innerHTML = '';
    var arr = pageSignatures[num] || [];
    arr.forEach(function(sig) {
      createOverlayElement(sig);
    });
  }


  // PROCESS SIGN & SAVE
  btnSign.addEventListener('click', function() {
    saveSignaturesForPage(currentPageNum);
    
    // Check if there's any signature
    var hasSig = false;
    for(var i=1; i<=totalPages; i++) {
      if(pageSignatures[i].length > 0) hasSig = true;
    }
    if(!hasSig) {
      if(!confirm('No signatures added. Save original document?')) return;
    }

    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';

    setTimeout(function() {
      processSignAsync();
    }, 100);
  });

  async function processSignAsync() {
    try {
      var pdfDoc = await PDFLib.PDFDocument.load(currentFileBytes);
      var pages = pdfDoc.getPages();

      for (var i = 1; i <= totalPages; i++) {
        var sigs = pageSignatures[i] || [];
        if (sigs.length === 0) continue;
        
        var page = pages[i - 1];
        var pdfWidth = page.getWidth();
        var pdfHeight = page.getHeight();
        
        // Since pdfContainer width corresponds to pdfWidth in points via `currentScale`
        // Actually, pdf.js viewport scale was used. 
        // Real coordinate mapping:
        // HTML px / currentScale = PDF points
        // And PDF origin is bottom-left, HTML is top-left.
        
        for (var j = 0; j < sigs.length; j++) {
          var sig = sigs[j];
          var pngImageBytes = await fetch(sig.src).then(res => res.arrayBuffer());
          var pdfImage = await pdfDoc.embedPng(pngImageBytes);
          
          var pdfSigW = sig.width / currentScale;
          var pdfSigH = sig.height / currentScale;
          var pdfSigX = sig.x / currentScale;
          var pdfSigY = pdfHeight - (sig.y / currentScale) - pdfSigH; // Y invert

          page.drawImage(pdfImage, {
            x: pdfSigX,
            y: pdfSigY,
            width: pdfSigW,
            height: pdfSigH
          });
        }
      }

      var pdfBytes = await pdfDoc.save();
      
      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';
      
      var blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      var originalName = currentFile.name.replace(/\.pdf$/i, '');
      btnDownload.href = url;
      btnDownload.download = originalName + '-signed.pdf';

    } catch (err) {
      console.error(err);
      alert('Error signing PDF: ' + err.message);
      progressWrap.style.display = 'none';
      workspace.style.display = 'flex';
    }
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
