/* TOOLDECK — watermark-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;
  const rgb = PDFLib.rgb;
  const degrees = PDFLib.degrees;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  
  let wmImageFile = null;
  let wmImageDataUrl = null;
  
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const typeTextBtn = $('type-text');
  const typeImgBtn = $('type-img');
  const textOpts = $('text-watermark-opts');
  const imgOpts = $('img-watermark-opts');
  
  const wmText = $('wm-text');
  const wmSize = $('wm-size');
  const wmColor = $('wm-color');
  const wmOpacity = $('wm-opacity');
  
  const wmImgInput = $('wm-img-input');
  const wmImgScale = $('wm-img-scale');
  const wmImgOpacity = $('wm-img-opacity');
  
  const wmRotation = $('wm-rotation');
  const wmPosition = $('wm-position');
  
  const overlay = $('watermark-overlay');
  
  const applyBtn = $('apply-btn');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  let activeType = 'text'; // 'text' or 'img'

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    
    currentFile = file;
    fileBuffer = await file.arrayBuffer();
    
    fileNameDisplay.innerText = file.name;
    fileSizeDisplay.innerText = formatSize(file.size);
    
    dropZone.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Loading preview...';

    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1 });
      const wrapper = $('preview-wrapper');
      
      // Calculate scale to fit in the preview column
      const maxWidth = wrapper.parentElement.clientWidth - 32;
      const scale = Math.min(1.5, maxWidth / viewport.width);
      const scaledViewport = page.getViewport({ scale });

      const canvas = $('preview-canvas');
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: scaledViewport
      }).promise;

      progressWrap.classList.remove('visible');
      workspace.style.display = 'block';
      
      updatePreview();

    } catch (err) {
      console.error(err);
      alert('Error loading PDF preview.');
      progressWrap.classList.remove('visible');
      dropZone.style.display = 'block';
    }
  };

  // Toggle Type
  typeTextBtn.addEventListener('click', () => {
    activeType = 'text';
    typeTextBtn.classList.add('active');
    typeImgBtn.classList.remove('active');
    textOpts.style.display = 'block';
    imgOpts.style.display = 'none';
    updatePreview();
  });
  
  typeImgBtn.addEventListener('click', () => {
    activeType = 'img';
    typeImgBtn.classList.add('active');
    typeTextBtn.classList.remove('active');
    imgOpts.style.display = 'block';
    textOpts.style.display = 'none';
    updatePreview();
  });

  // Handle Image Watermark Upload
  wmImgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    wmImageFile = file;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      wmImageDataUrl = ev.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  });

  // Update Visual Preview DOM overlay
  const updatePreview = () => {
    overlay.innerHTML = '';
    
    const rot = wmRotation.value;
    const pos = wmPosition.value;
    
    // Convert PDF point size roughly to CSS pixels for the preview scale
    // Actual scale ratio is approx 1:1 if we assume 72dpi. 
    // It's a rough visual guide.
    
    const div = document.createElement('div');
    
    if (activeType === 'text') {
      const text = wmText.value;
      const size = wmSize.value;
      const color = wmColor.value;
      const opacity = wmOpacity.value / 100;
      
      div.innerText = text;
      div.style.fontSize = \`\${size}px\`;
      div.style.color = color;
      div.style.opacity = opacity;
      div.style.fontWeight = 'bold';
      div.style.fontFamily = 'Helvetica, Arial, sans-serif';
    } else {
      if (!wmImageDataUrl) {
        div.innerText = 'Upload image first';
        div.style.color = 'var(--t2)';
        div.style.opacity = '0.5';
      } else {
        const img = document.createElement('img');
        img.src = wmImageDataUrl;
        img.style.transform = \`scale(\${wmImgScale.value / 100})\`;
        div.style.opacity = wmImgOpacity.value / 100;
        div.appendChild(img);
      }
    }
    
    div.style.transform = \`rotate(\${rot}deg)\`;
    div.style.position = 'absolute';
    
    // Position
    if (pos === 'center') {
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      div.style.position = 'relative';
    } else if (pos === 'top-left') {
      div.style.top = '20px';
      div.style.left = '20px';
    } else if (pos === 'top-right') {
      div.style.top = '20px';
      div.style.right = '20px';
    } else if (pos === 'bottom-left') {
      div.style.bottom = '20px';
      div.style.left = '20px';
    } else if (pos === 'bottom-right') {
      div.style.bottom = '20px';
      div.style.right = '20px';
    } else if (pos === 'tiled') {
      // Simplified tile preview
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      div.style.position = 'relative';
      if (activeType === 'text') {
        div.innerText = Array(50).fill(wmText.value).join('      ');
        div.style.whiteSpace = 'pre-wrap';
        div.style.textAlign = 'center';
      }
    }

    overlay.appendChild(div);
  };

  // Add listeners to all inputs to update preview
  [wmText, wmSize, wmColor, wmOpacity, wmImgScale, wmImgOpacity, wmRotation, wmPosition].forEach(el => {
    el.addEventListener('input', updatePreview);
  });

  // Hex to RGB float [0, 1]
  const hexToRgbFloat = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  applyBtn.addEventListener('click', async () => {
    if (activeType === 'img' && !wmImageDataUrl) {
      alert('Please upload an image for the watermark.');
      return;
    }

    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Applying watermark...';

    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      
      let pdfImage = null;
      let imgDims = null;
      
      if (activeType === 'img') {
        const imageBytes = await wmImageFile.arrayBuffer();
        if (wmImageFile.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        }
        
        const scale = parseFloat(wmImgScale.value) / 100;
        imgDims = pdfImage.scale(scale);
      }

      const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
      const size = parseFloat(wmSize.value);
      const rot = parseFloat(wmRotation.value);
      const pos = wmPosition.value;
      const opacity = (activeType === 'text' ? wmOpacity.value : wmImgOpacity.value) / 100;
      
      const c = hexToRgbFloat(wmColor.value);
      const pdfColor = rgb(c.r, c.g, c.b);

      const text = wmText.value;

      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        // Calculate bounding box roughly
        let wmWidth = 0;
        let wmHeight = 0;
        
        if (activeType === 'text') {
          wmWidth = font.widthOfTextAtSize(text, size);
          wmHeight = font.heightAtSize(size);
        } else {
          wmWidth = imgDims.width;
          wmHeight = imgDims.height;
        }

        const margin = 20;
        
        const drawOpts = {
          rotate: degrees(rot),
          opacity: opacity
        };

        if (activeType === 'text') {
          drawOpts.text = text;
          drawOpts.font = font;
          drawOpts.size = size;
          drawOpts.color = pdfColor;
        } else {
          drawOpts.width = wmWidth;
          drawOpts.height = wmHeight;
        }

        const drawMethod = activeType === 'text' ? (opts) => page.drawText(opts.text, opts) : (opts) => page.drawImage(pdfImage, opts);

        if (pos === 'tiled') {
          const stepX = wmWidth * 1.5;
          const stepY = wmHeight * 3;
          for (let x = -width; x < width * 2; x += stepX) {
            for (let y = -height; y < height * 2; y += stepY) {
              drawMethod({ ...drawOpts, x, y });
            }
          }
        } else {
          let x = 0, y = 0;
          
          if (pos === 'center') {
            x = width / 2 - wmWidth / 2;
            y = height / 2 - wmHeight / 2;
          } else if (pos === 'top-left') {
            x = margin;
            y = height - margin - wmHeight;
          } else if (pos === 'top-right') {
            x = width - margin - wmWidth;
            y = height - margin - wmHeight;
          } else if (pos === 'bottom-left') {
            x = margin;
            y = margin;
          } else if (pos === 'bottom-right') {
            x = width - margin - wmWidth;
            y = margin;
          }

          // Adjust for rotation around origin (bottom-left of text/image)
          // To make it look centered despite rotation, we could do more complex math,
          // but for a simple tool, relying on pdf-lib's origin rotation is usually acceptable.
          
          drawMethod({ ...drawOpts, x, y });
        }
      });

      progressFill.style.width = '90%';
      progressText.innerText = 'Saving...';

      const pdfBytes = await pdfDoc.save();
      finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
      }, 500);

    } catch (err) {
      console.error(err);
      workspace.style.display = 'block';
      progressWrap.classList.remove('visible');
      alert('Error applying watermark.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_watermarked.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  changeFileBtn.addEventListener('click', () => fileInput.click());

  resetBtn.addEventListener('click', () => {
    currentFile = null; fileBuffer = null; finalBlob = null;
    wmImageDataUrl = null; wmImageFile = null; wmImgInput.value = '';
    resultZone.classList.remove('visible');
    workspace.style.display = 'none';
    dropZone.style.display = 'block';
  });


  if (typeof dropZone !== 'undefined' && dropZone) {
    dropZone.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        var fi = document.getElementById('file-input');
        if (fi) fi.click();
      }
    });
  }
})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
