/* TOOLDECK — watermark-image.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var btnAddMore = $('btn-add-more');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  var imgList = $('img-list');
  var fileCount = $('file-count');
  
  var wmText = $('wm-text');
  var wmPos = $('wm-pos');
  var wmColor = $('wm-color');
  var wmOpacity = $('wm-opacity');
  var wmOpVal = $('wm-op-val');
  var wmSize = $('wm-size');
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');

  var filesData = [];

  wmOpacity.addEventListener('input', function() {
    wmOpVal.textContent = wmOpacity.value + '%';
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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
      if (!file.type.match(/image.*/)) continue;
      
      filesData.push({ file: file, originalSize: file.size });
    }
    renderList();
  }

  function renderList() {
    imgList.innerHTML = '';
    if (filesData.length === 0) {
      workspace.style.display = 'none';
      uploadZone.style.display = 'block';
      return;
    }
    
    uploadZone.style.display = 'none';
    workspace.style.display = 'block';
    fileCount.textContent = filesData.length + (filesData.length === 1 ? ' image selected' : ' images selected');

    filesData.forEach(function(item, index) {
      var li = document.createElement('li');
      li.className = 'img-item';
      
      var left = document.createElement('div');
      left.className = 'img-info';
      
      var img = document.createElement('img');
      img.className = 'img-thumb';
      img.src = URL.createObjectURL(item.file);
      
      var meta = document.createElement('div');
      var name = document.createElement('div'); name.className = 'img-name'; name.textContent = item.file.name;
      var size = document.createElement('div'); size.className = 'img-size'; size.textContent = formatBytes(item.originalSize);
      meta.appendChild(name); meta.appendChild(size);
      left.appendChild(img); left.appendChild(meta);
      
      var right = document.createElement('div');
      
      var btnRemove = document.createElement('button');
      btnRemove.innerHTML = '&times;';
      btnRemove.style.background = 'none'; btnRemove.style.border = 'none'; btnRemove.style.color = 'var(--text-muted)'; btnRemove.style.cursor = 'pointer'; btnRemove.style.fontSize = '1.2rem';
      btnRemove.onclick = function() {
        filesData.splice(index, 1);
        renderList();
      };
      
      right.appendChild(btnRemove);
      
      li.appendChild(left);
      li.appendChild(right);
      imgList.appendChild(li);
    });
  }

  btnCancel.addEventListener('click', function() {
    filesData = [];
    renderList();
  });

  // Convert hex color to rgba with opacity
  function hexToRgba(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }

  function applyWatermark(file, text, pos, colorHex, opacityPerc, sizeRatio) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        if (!text) {
           // Skip watermark if text is empty
        } else {
          var w = img.width;
          var h = img.height;
          var dim = Math.max(w, h);
          var fontSize = Math.max(10, dim * sizeRatio);
          
          ctx.font = 'bold ' + fontSize + 'px sans-serif';
          ctx.fillStyle = hexToRgba(colorHex, opacityPerc / 100);
          
          var textMetrics = ctx.measureText(text);
          var textW = textMetrics.width;
          var textH = fontSize; // Approx
          
          var padding = dim * 0.02; // 2% padding
          var x = 0, y = 0;

          ctx.textBaseline = 'top';

          if (pos === 'center') {
            x = (w - textW) / 2;
            y = (h - textH) / 2;
          } else if (pos === 'top-left') {
            x = padding;
            y = padding;
          } else if (pos === 'top-right') {
            x = w - textW - padding;
            y = padding;
          } else if (pos === 'bottom-left') {
            x = padding;
            y = h - textH - padding;
          } else if (pos === 'bottom-right') {
            x = w - textW - padding;
            y = h - textH - padding;
          }
          
          // Add a subtle drop shadow for readability
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.fillText(text, x, y);
        }
        
        var format = file.type;
        if (format === 'image/svg+xml') format = 'image/png';
        
        canvas.toBlob(function(blob) {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, format, 0.95);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    
    var text = wmText.value.trim();
    var pos = wmPos.value;
    var colorHex = wmColor.value;
    var opacityPerc = parseInt(wmOpacity.value, 10);
    var sizeRatio = parseFloat(wmSize.value);

    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Applying Watermark ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var convertedBlob = await applyWatermark(item.file, text, pos, colorHex, opacityPerc, sizeRatio);
        
        var newName = item.file.name;
        if (item.file.type === 'image/svg+xml') {
          newName = newName.replace(/\.[^/.]+$/, "") + ".png";
        }
        
        zip.file(newName, convertedBlob);
      }

      progressText.textContent = 'Zipping files...';
      progressFill.style.width = '100%';

      var zipBlob = await zip.generateAsync({ type: 'blob' });

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var url = URL.createObjectURL(zipBlob);
      btnDownload.href = url;
      btnDownload.download = 'watermarked-images.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleName = filesData[0].file.name;
        if (filesData[0].file.type === 'image/svg+xml') singleName = singleName.replace(/\.[^/.]+$/, "") + ".png";
        var singleFile = await zip.file(singleName).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = 'watermarked-' + singleName;
        btnDownload.textContent = 'Download Image';
      }

    } catch (err) {
      console.error(err);
      alert('Error during processing: ' + err.message);
      progressWrap.style.display = 'none';
      workspace.style.display = 'block';
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
