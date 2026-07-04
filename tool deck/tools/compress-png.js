/* TOOLDECK — compress-png.js */
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
  
  var levelSelect = $('level-select');
  var resizeChk = $('resize-chk');
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');
  
  var progressWrap = $('progress-wrap');
  var progressFill = $('progress-fill');
  var progressText = $('progress-text');
  var resultZone = $('result-zone');
  var btnDownload = $('btn-download');
  var resStats = $('res-stats');

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
      if (file.type !== 'image/png') continue;
      
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
    
    workspace.style.display = 'none';
    progressWrap.style.display = 'flex';
    
    var level = levelSelect.value;
    var maxSizeMB = 1;
    if (level === '2') maxSizeMB = 0.5;
    if (level === '3') maxSizeMB = 0.1;
    
    var doResize = resizeChk.checked;
    
    var totalOrig = 0;
    var totalNew = 0;
    var zip = new JSZip();

    try {
      for (var i = 0; i < filesData.length; i++) {
        var item = filesData[i];
        progressText.textContent = 'Compressing Image ' + (i+1) + ' of ' + filesData.length;
        progressFill.style.width = Math.round((i / filesData.length) * 100) + '%';
        
        var options = {
          maxSizeMB: maxSizeMB,
          useWebWorker: true,
          fileType: 'image/png',
          alwaysKeepResolution: !doResize
        };
        
        if (doResize) {
          options.maxWidthOrHeight = 1920;
        }

        var compressedFile = await imageCompression(item.file, options);
        
        totalOrig += item.originalSize;
        totalNew += compressedFile.size;
        
        zip.file(item.file.name, compressedFile);
      }

      progressText.textContent = 'Zipping files...';
      progressFill.style.width = '100%';

      var zipBlob = await zip.generateAsync({ type: 'blob' });

      progressWrap.style.display = 'none';
      resultZone.style.display = 'block';

      var savedPerc = totalOrig > 0 ? Math.round(((totalOrig - totalNew) / totalOrig) * 100) : 0;
      if (savedPerc < 0) savedPerc = 0;
      
      resStats.textContent = 'Saved ' + savedPerc + '% (' + formatBytes(totalOrig) + ' to ' + formatBytes(totalNew) + ')';

      var url = URL.createObjectURL(zipBlob);
      btnDownload.href = url;
      btnDownload.download = 'compressed-pngs.zip';
      
      // If single file, change download logic to just download the file
      if (filesData.length === 1) {
        var singleFile = await zip.file(filesData[0].file.name).async('blob');
        btnDownload.href = URL.createObjectURL(singleFile);
        btnDownload.download = 'compressed-' + filesData[0].file.name;
        btnDownload.textContent = 'Download Image';
      }

    } catch (err) {
      console.error(err);
      alert('Error during compression: ' + err.message);
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
