/* TOOLDECK — svg-to-png.js */
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
  
  var scaleSelect = $('scale-select');
  var transparentChk = $('transparent-chk');
  var bgColorInput = $('bg-color');
  
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

  transparentChk.addEventListener('change', function() {
    bgColorInput.disabled = transparentChk.checked;
    bgColorInput.style.opacity = transparentChk.checked ? '0.5' : '1';
  });
  bgColorInput.disabled = true;
  bgColorInput.style.opacity = '0.5';

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
      if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) continue;
      
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
    fileCount.textContent = filesData.length + (filesData.length === 1 ? ' file selected' : ' files selected');

    filesData.forEach(function(item, index) {
      var li = document.createElement('li');
      li.className = 'img-item';
      
      var left = document.createElement('div');
      left.className = 'img-info';
      
      var img = document.createElement('img');
      img.className = 'img-thumb';
      // Load SVG safely as data url for preview
      var reader = new FileReader();
      reader.onload = function(e) { img.src = e.target.result; };
      reader.readAsDataURL(item.file);
      
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

  function parseSVG(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'image/svg+xml');
        var svgElem = doc.querySelector('svg');
        if (!svgElem) {
          return reject(new Error('Invalid SVG file'));
        }
        
        // Extract dimensions
        var w = svgElem.getAttribute('width');
        var h = svgElem.getAttribute('height');
        
        // Convert 'px' to numbers if needed
        if (w && w.includes('px')) w = w.replace('px', '');
        if (h && h.includes('px')) h = h.replace('px', '');
        
        w = parseFloat(w);
        h = parseFloat(h);

        if (!w || !h || isNaN(w) || isNaN(h)) {
          var viewBox = svgElem.getAttribute('viewBox');
          if (viewBox) {
            var parts = viewBox.split(/[ ,]+/);
            if (parts.length === 4) {
              w = parseFloat(parts[2]);
              h = parseFloat(parts[3]);
            }
          }
        }
        
        // Default fallback
        if (!w || isNaN(w)) w = 800;
        if (!h || isNaN(h)) h = 600;

        // Force explicitly set attributes so the Image renderer knows the native size
        svgElem.setAttribute('width', w + 'px');
        svgElem.setAttribute('height', h + 'px');

        var serializer = new XMLSerializer();
        var fixedSvg = serializer.serializeToString(doc);
        
        // Create an Object URL from the string
        var blob = new Blob([fixedSvg], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(blob);

        resolve({ url: url, width: w, height: h });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function convertSvgToPng(svgData, scale, isTransparent, bgColor) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        var finalW = Math.round(svgData.width * scale);
        var finalH = Math.round(svgData.height * scale);

        var canvas = document.createElement('canvas');
        canvas.width = finalW;
        canvas.height = finalH;
        var ctx = canvas.getContext('2d');
        
        if (!isTransparent) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, finalW, finalH);
        }
        
        ctx.drawImage(img, 0, 0, finalW, finalH);
        
        URL.revokeObjectURL(svgData.url); // Clean up

        canvas.toBlob(function(blob) {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/png');
      };
      img.onerror = function() {
        URL.revokeObjectURL(svgData.url);
        reject(new Error('Failed to load SVG into Image object'));
      };
      img.src = svgData.url;
    });
  }

  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var scale = parseFloat(scaleSelect.value) || 1;
    var isTransparent = transparentChk.checked;
    var bgColor = bgColorInput.value;
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Rasterizing SVG ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var svgData = await parseSVG(item.file);
        var convertedBlob = await convertSvgToPng(svgData, scale, isTransparent, bgColor);
        
        var newName = item.file.name.replace(/\.[^/.]+$/, "") + ".png";
        zip.file(newName, convertedBlob);
      }

      progressText.textContent = 'Zipping files...';
      progressFill.style.width = '100%';

      var zipBlob = await zip.generateAsync({ type: 'blob' });

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var url = URL.createObjectURL(zipBlob);
      btnDownload.href = url;
      btnDownload.download = 'converted-pngs.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleName = filesData[0].file.name.replace(/\.[^/.]+$/, "") + ".png";
        var singleFile = await zip.file(singleName).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = singleName;
        btnDownload.textContent = 'Download PNG';
      }

    } catch (err) {
      console.error(err);
      alert('Error during conversion: ' + err.message);
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
