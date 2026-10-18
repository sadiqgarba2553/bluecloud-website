/* TOOLDECK — scan-to-pdf.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var btnAddMore = $('btn-add-more');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  var imgGrid = $('img-grid');
  
  var colorModeSelect = $('color-mode');
  var contrastSlider = $('contrast-slider');
  var pageSizeSelect = $('page-size');
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');

  var filesData = [];
  var idCounter = 0;

  // Upload Handlers
  btnSelect.addEventListener('click', function() { fileInput.click(); });
  btnAddMore.addEventListener('click', function() { fileInput.click(); });
  
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length) handleFiles(e.target.files);
    fileInput.value = '';
  });

  function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.match('image.*')) continue;
      
      (function(f) {
        var reader = new FileReader();
        reader.onload = function(evt) {
          var id = 'img_' + (idCounter++);
          filesData.push({ id: id, file: f, src: evt.target.result });
          renderGrid();
        };
        reader.readAsDataURL(f);
      })(file);
    }
  }

  function renderGrid() {
    imgGrid.innerHTML = '';
    if (filesData.length === 0) {
      workspace.style.display = 'none';
      uploadZone.style.display = 'block';
      return;
    }
    
    uploadZone.style.display = 'none';
    workspace.style.display = 'flex';

    filesData.forEach(function(item, index) {
      var card = document.createElement('div');
      card.className = 'img-card';
      card.draggable = true;
      card.setAttribute('data-id', item.id);
      
      var img = document.createElement('img');
      img.src = item.src;
      
      var btnRemove = document.createElement('button');
      btnRemove.className = 'btn-remove';
      btnRemove.innerHTML = '×';
      btnRemove.onclick = function() {
        filesData.splice(index, 1);
        renderGrid();
      };
      
      card.appendChild(img);
      card.appendChild(btnRemove);
      
      // Drag & Drop reordering
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragover', handleDragOver);
      card.addEventListener('drop', handleDrop);
      card.addEventListener('dragend', handleDragEnd);
      
      imgGrid.appendChild(card);
    });
  }

  var dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
    this.classList.add('dragging');
  }

  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (dragSrcEl !== this) {
      var srcId = dragSrcEl.getAttribute('data-id');
      var tgtId = this.getAttribute('data-id');
      
      var srcIdx = filesData.findIndex(function(x) { return x.id === srcId; });
      var tgtIdx = filesData.findIndex(function(x) { return x.id === tgtId; });
      
      var moved = filesData.splice(srcIdx, 1)[0];
      filesData.splice(tgtIdx, 0, moved);
      renderGrid();
    }
    return false;
  }

  function handleDragEnd() {
    var cards = document.querySelectorAll('.img-card');
    cards.forEach(function(c) { c.classList.remove('dragging'); });
  }

  btnCancel.addEventListener('click', function() {
    filesData = [];
    renderGrid();
  });

  // Image Processing Core
  function processImage(imgSrc, mode, contrastRaw) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (mode !== 'original' || contrastRaw !== 50) {
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var d = imgData.data;
          
          // Contrast logic (0 to 100)
          var contrast = (contrastRaw - 50) * 2; // -100 to 100
          var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

          for (var i = 0; i < d.length; i += 4) {
            var r = d[i], g = d[i+1], b = d[i+2];

            // Apply contrast
            if (contrast !== 0) {
              r = factor * (r - 128) + 128;
              g = factor * (g - 128) + 128;
              b = factor * (b - 128) + 128;
            }

            if (mode === 'grayscale' || mode === 'bw') {
              var lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (mode === 'bw') {
                // High contrast threshold
                lum = lum > 128 ? 255 : 0;
              }
              r = g = b = lum;
            }

            // Clamp
            d[i] = r > 255 ? 255 : r < 0 ? 0 : r;
            d[i+1] = g > 255 ? 255 : g < 0 ? 0 : g;
            d[i+2] = b > 255 ? 255 : b < 0 ? 0 : b;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = imgSrc;
    });
  }


  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var mode = colorModeSelect.value;
    var contrast = parseInt(contrastSlider.value);
    var pSize = pageSizeSelect.value; // A4, Letter, fit

    try {
      var pdfDoc = await PDFLib.PDFDocument.create();

      for (var i = 0; i < filesData.length; i++) {
        progressText.textContent = 'Processing Image ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 80) + '%';
        
        var processedBase64 = await processImage(filesData[i].src, mode, contrast);
        var resPromise = await fetch(processedBase64);
        var imgBytes = await resPromise.arrayBuffer();
        
        var pdfImage = await pdfDoc.embedJpg(imgBytes);
        var imgDims = pdfImage.scale(1);

        var pageW, pageH;
        if (pSize === 'A4') { pageW = 595.28; pageH = 841.89; }
        else if (pSize === 'Letter') { pageW = 612; pageH = 792; }
        else { pageW = imgDims.width; pageH = imgDims.height; }

        var page = pdfDoc.addPage([pageW, pageH]);

        if (pSize === 'fit') {
          page.drawImage(pdfImage, { x: 0, y: 0, width: pageW, height: pageH });
        } else {
          // Scale to fit within page bounds, maintaining aspect ratio
          var scale = Math.min(pageW / imgDims.width, pageH / imgDims.height);
          var drawW = imgDims.width * scale;
          var drawH = imgDims.height * scale;
          var drawX = (pageW - drawW) / 2;
          var drawY = (pageH - drawH) / 2;
          page.drawImage(pdfImage, { x: drawX, y: drawY, width: drawW, height: drawH });
        }
      }

      progressText.textContent = 'Generating PDF...';
      progressFill.style.width = '95%';

      var pdfBytes = await pdfDoc.save();

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      btnDownload.href = url;
      btnDownload.download = 'scanned-document.pdf';

    } catch (err) {
      console.error(err);
      alert('Error creating scanned PDF: ' + err.message);
      progressWrap.style.display = 'none';
      workspace.style.display = 'flex';
    }
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
