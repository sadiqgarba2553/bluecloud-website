/* TOOLDECK — crop-image.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var fileInput = $('file-input');
  var btnSelect = $('btn-select');
  var uploadZone = $('upload-zone');
  var workspace = $('workspace');
  var fileName = $('file-name');
  
  var image = $('image');
  var toolbar = $('toolbar');
  
  var btnStart = $('btn-start');
  var btnCancel = $('btn-cancel');

  var currentFile = null;
  var cropper = null;

  // Upload Handlers
  btnSelect.addEventListener('click', function() { fileInput.click(); });
  
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length) handleFile(e.target.files[0]);
    fileInput.value = '';
  });

  function handleFile(file) {
    if (!file.type.match(/image.*/)) {
      alert("Please select a valid image file.");
      return;
    }
    
    currentFile = file;
    fileName.textContent = file.name;
    
    uploadZone.style.display = 'none';
    workspace.style.display = 'block';
    
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    
    image.src = URL.createObjectURL(file);
    
    // Init cropper
    cropper = new Cropper(image, {
      aspectRatio: NaN, // Free
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true
    });
  }

  btnCancel.addEventListener('click', function() {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    currentFile = null;
    workspace.style.display = 'none';
    uploadZone.style.display = 'block';
  });

  // Toolbar Aspect Ratios
  if (toolbar) {
    var btns = toolbar.querySelectorAll('.tool-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!cropper) return;
        btns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        
        var ratio = parseFloat(btn.getAttribute('data-ratio'));
        cropper.setAspectRatio(ratio);
      });
    });
  }

  btnStart.addEventListener('click', function() {
    if (!cropper || !currentFile) return;
    
    // Default format logic (keep PNG if PNG, else JPG/WebP)
    var type = currentFile.type;
    var ext = currentFile.name.split('.').pop().toLowerCase();
    
    var canvas = cropper.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });
    
    if (!canvas) {
      alert("Could not crop image. Please try again.");
      return;
    }
    
    canvas.toBlob(function(blob) {
      if (!blob) {
        alert("Crop generation failed.");
        return;
      }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-' + currentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, type, 0.95);
  });

  // Global Drag & Drop preventer and upload zone click
  window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
  window.addEventListener('drop', function(e) { 
    e.preventDefault(); 
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      if (workspace.style.display === 'none') {
        handleFile(e.dataTransfer.files[0]);
      }
    }
  }, false);

  if (typeof uploadZone !== 'undefined' && uploadZone) {
    uploadZone.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        if (fileInput) fileInput.click();
      }
    });
  }

})();
