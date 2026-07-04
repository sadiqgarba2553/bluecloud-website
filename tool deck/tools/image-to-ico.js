/* TOOLDECK — image-to-ico.js */
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
  
  var sizeSelect = $('size-select');
  
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
      if (!file.type.match(/image\/(png|jpeg|webp)/i)) continue;
      
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

  // Convert canvas to ArrayBuffer PNG
  function canvasToPngBuffer(canvas) {
    return new Promise(function(resolve, reject) {
      canvas.toBlob(function(blob) {
        if (!blob) return reject(new Error('Canvas toBlob failed'));
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  }

  function convertToIco(file, size) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = async function() {
        // Crop to square
        var d = Math.min(img.width, img.height);
        var sx = (img.width - d) / 2;
        var sy = (img.height - d) / 2;

        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        
        // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        ctx.drawImage(img, sx, sy, d, d, 0, 0, size, size);
        
        try {
          var pngBuffer = await canvasToPngBuffer(canvas);
          var pngView = new Uint8Array(pngBuffer);
          
          // Construct ICO header
          // ICONDIR (6 bytes)
          var icondir = new Uint8Array(6);
          var view = new DataView(icondir.buffer);
          view.setUint16(0, 0, true); // reserved
          view.setUint16(2, 1, true); // type (1 = ICO)
          view.setUint16(4, 1, true); // image count (1)

          // ICONDIRENTRY (16 bytes)
          var entry = new Uint8Array(16);
          var eview = new DataView(entry.buffer);
          
          var w = size === 256 ? 0 : size; // 0 means 256 in ICO
          var h = size === 256 ? 0 : size;
          
          eview.setUint8(0, w); // width
          eview.setUint8(1, h); // height
          eview.setUint8(2, 0); // color palette (0 = no palette)
          eview.setUint8(3, 0); // reserved
          eview.setUint16(4, 1, true); // color planes
          eview.setUint16(6, 32, true); // bpp
          eview.setUint32(8, pngView.length, true); // image data size
          eview.setUint32(12, 6 + 16, true); // offset from beginning (6 + 16 = 22)

          // Combine
          var icoBlob = new Blob([icondir, entry, pngView], { type: 'image/x-icon' });
          resolve(icoBlob);
        } catch(e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var size = parseInt(sizeSelect.value, 10);
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Generating Icon ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var convertedBlob = await convertToIco(item.file, size);
        var newName = item.file.name.replace(/\.[^/.]+$/, "") + ".ico";
        
        zip.file(newName, convertedBlob);
      }

      progressText.textContent = 'Zipping files...';
      progressFill.style.width = '100%';

      var zipBlob = await zip.generateAsync({ type: 'blob' });

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var url = URL.createObjectURL(zipBlob);
      btnDownload.href = url;
      btnDownload.download = 'converted-icons.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleName = filesData[0].file.name.replace(/\.[^/.]+$/, "") + ".ico";
        var singleFile = await zip.file(singleName).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = singleName;
        btnDownload.textContent = 'Download ICO';
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
