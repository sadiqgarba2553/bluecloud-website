/* TOOLDECK — resize-image.js */
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
  
  var typeRadios = document.getElementsByName('resize-type');
  var setPerc = $('settings-percentage');
  var setPix = $('settings-pixels');
  
  var percSlider = $('perc-slider');
  var percVal = $('perc-val');
  
  var pxW = $('px-width');
  var pxH = $('px-height');
  var pxAspect = $('px-aspect');
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');

  var filesData = [];

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Toggle settings
  typeRadios.forEach(function(r) {
    r.addEventListener('change', function() {
      if (this.value === 'percentage') {
        setPerc.style.display = 'block';
        setPix.style.display = 'none';
      } else {
        setPerc.style.display = 'none';
        setPix.style.display = 'block';
      }
    });
  });

  percSlider.addEventListener('input', function() {
    percVal.textContent = this.value + '%';
  });

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

  function resizeImage(file, mode, perc, w, h, keepAspect) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        var origW = img.width;
        var origH = img.height;
        var targetW = origW;
        var targetH = origH;

        if (mode === 'percentage') {
          targetW = Math.round(origW * (perc / 100));
          targetH = Math.round(origH * (perc / 100));
        } else {
          // Pixel mode
          var inW = parseInt(w, 10);
          var inH = parseInt(h, 10);
          
          if (!inW && !inH) {
            // Nothing provided, keep original
          } else if (keepAspect) {
            if (inW && inH) {
              // Fit within inW x inH
              var ratio = Math.min(inW / origW, inH / origH);
              targetW = Math.round(origW * ratio);
              targetH = Math.round(origH * ratio);
            } else if (inW) {
              targetW = inW;
              targetH = Math.round(origH * (inW / origW));
            } else if (inH) {
              targetH = inH;
              targetW = Math.round(origW * (inH / origH));
            }
          } else {
            // Don't keep aspect
            targetW = inW || origW;
            targetH = inH || origH;
          }
        }

        // Prevent 0 width/height
        targetW = Math.max(1, targetW);
        targetH = Math.max(1, targetH);

        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetW, targetH);
        
        var format = file.type;
        if (format === 'image/svg+xml') format = 'image/png';
        
        canvas.toBlob(function(blob) {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, format, 0.95);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    
    var mode = 'percentage';
    if (document.querySelector('input[name="resize-type"]:checked').value === 'pixels') {
      mode = 'pixels';
    }
    
    var perc = parseInt(percSlider.value, 10);
    var w = pxW.value;
    var h = pxH.value;
    var keepAspect = pxAspect.checked;
    
    if (mode === 'pixels' && !w && !h) {
      alert('Please provide at least a width or height.');
      return;
    }

    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Resizing Image ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var convertedBlob = await resizeImage(item.file, mode, perc, w, h, keepAspect);
        
        // Fix extension if SVG -> PNG
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
      btnDownload.download = 'resized-images.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleName = filesData[0].file.name;
        if (filesData[0].file.type === 'image/svg+xml') singleName = singleName.replace(/\.[^/.]+$/, "") + ".png";
        var singleFile = await zip.file(singleName).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = 'resized-' + singleName;
        btnDownload.textContent = 'Download Image';
      }

    } catch (err) {
      console.error(err);
      alert('Error during resizing: ' + err.message);
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
