/* TOOLDECK — remove-bg.js */
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
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var progressSub = $('progress-sub');
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

  btnStart.addEventListener('click', async function() {
    if (filesData.length === 0) return;
    if (typeof imglyRemoveBackground === 'undefined') {
      alert("AI Model is still loading or failed to load. Please check your connection.");
      return;
    }
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Removing Background ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var config = {
          progress: function(key, current, total) {
            if (key.includes('fetch')) {
              progressSub.textContent = "Downloading AI Model... (" + Math.round((current/total)*100) + "%)";
            } else if (key === 'compute') {
              progressSub.textContent = "Processing image...";
            }
          }
        };

        var url = URL.createObjectURL(item.file);
        var blob = await imglyRemoveBackground(url, config);
        
        var newName = item.file.name.replace(/\.[^/.]+$/, "") + "-nobg.png";
        
        zip.file(newName, blob);
      }

      progressText.textContent = 'Zipping files...';
      progressSub.textContent = '';
      progressFill.style.width = '100%';

      var zipBlob = await zip.generateAsync({ type: 'blob' });

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var resultUrl = URL.createObjectURL(zipBlob);
      btnDownload.href = resultUrl;
      btnDownload.download = 'no-background.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleName = filesData[0].file.name.replace(/\.[^/.]+$/, "") + "-nobg.png";
        var singleFile = await zip.file(singleName).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = singleName;
        btnDownload.textContent = 'Download Image';
      }

    } catch (err) {
      console.error(err);
      alert('Error during background removal: ' + err.message);
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
