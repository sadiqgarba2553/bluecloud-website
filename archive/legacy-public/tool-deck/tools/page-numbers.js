/* TOOLDECK — page-numbers.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);
  const PDFLib = window.PDFLib;
  const PDFDocument = PDFLib.PDFDocument;
  const rgb = PDFLib.rgb;

  let currentFile = null;
  let fileBuffer = null;
  let finalBlob = null;
  
  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const workspace = $('workspace');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const posGrid = $('pos-grid');
  const posBtns = posGrid.querySelectorAll('.pos-btn');
  const pnFormat = $('pn-format');
  const pnStart = $('pn-start');
  const pnSkip = $('pn-skip');
  const pnSize = $('pn-size');
  const pnColor = $('pn-color');
  const pnPreview = $('pn-preview');
  
  const applyBtn = $('apply-btn');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');

  let activePos = 'bottom-center';

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
    workspace.style.display = 'block';
    
    updatePreview();
  };

  posBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      posBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePos = btn.getAttribute('data-pos');
      updatePreview();
    });
  });

  const updatePreview = () => {
    const fmt = pnFormat.value;
    const st = parseInt(pnStart.value) || 1;
    
    let sample = '1';
    if (fmt === 'Page 1') sample = \`Page \${st}\`;
    else if (fmt === '1 of N') sample = \`\${st} of 10\`;
    else if (fmt === 'Page 1 of N') sample = \`Page \${st} of 10\`;
    else sample = \`\${st}\`;

    pnPreview.innerText = sample;
    pnPreview.style.fontSize = \`\${pnSize.value}px\`;
    pnPreview.style.color = pnColor.value;

    // CSS Positioning for visual preview (0 to 100%)
    const margin = '15%';
    
    if (activePos === 'top-left') {
      pnPreview.style.top = margin; pnPreview.style.left = margin;
    } else if (activePos === 'top-center') {
      pnPreview.style.top = margin; pnPreview.style.left = '50%';
    } else if (activePos === 'top-right') {
      pnPreview.style.top = margin; pnPreview.style.left = 'auto'; pnPreview.style.right = \`calc(\${margin} - 50%)\`;
    } else if (activePos === 'bottom-left') {
      pnPreview.style.top = 'auto'; pnPreview.style.bottom = margin; pnPreview.style.left = margin;
    } else if (activePos === 'bottom-center') {
      pnPreview.style.top = 'auto'; pnPreview.style.bottom = margin; pnPreview.style.left = '50%';
    } else if (activePos === 'bottom-right') {
      pnPreview.style.top = 'auto'; pnPreview.style.bottom = margin; pnPreview.style.left = 'auto'; pnPreview.style.right = \`calc(\${margin} - 50%)\`;
    }
  };

  [pnFormat, pnStart, pnSize, pnColor].forEach(el => el.addEventListener('input', updatePreview));

  const hexToRgbFloat = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16) / 255, g: parseInt(result[2], 16) / 255, b: parseInt(result[3], 16) / 255 } : { r: 0, g: 0, b: 0 };
  };

  applyBtn.addEventListener('click', async () => {
    workspace.style.display = 'none';
    progressWrap.classList.add('visible');
    progressFill.style.width = '30%';
    progressText.innerText = 'Adding page numbers...';

    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      
      const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
      const size = parseInt(pnSize.value) || 14;
      const c = hexToRgbFloat(pnColor.value);
      const color = rgb(c.r, c.g, c.b);
      
      const fmt = pnFormat.value;
      let currentNum = parseInt(pnStart.value) || 1;
      const skip = parseInt(pnSkip.value) || 0;
      
      const margin = 30; // Points from edge

      for (let i = 0; i < totalPages; i++) {
        if (i < skip) continue;
        
        const page = pages[i];
        const { width, height } = page.getSize();
        
        let text = \`\${currentNum}\`;
        if (fmt === 'Page 1') text = \`Page \${currentNum}\`;
        else if (fmt === '1 of N') text = \`\${currentNum} of \${totalPages}\`;
        else if (fmt === 'Page 1 of N') text = \`Page \${currentNum} of \${totalPages}\`;
        
        const textWidth = font.widthOfTextAtSize(text, size);
        
        let x = 0;
        let y = 0;
        
        if (activePos === 'top-left') {
          x = margin; y = height - margin - size;
        } else if (activePos === 'top-center') {
          x = width / 2 - textWidth / 2; y = height - margin - size;
        } else if (activePos === 'top-right') {
          x = width - margin - textWidth; y = height - margin - size;
        } else if (activePos === 'bottom-left') {
          x = margin; y = margin;
        } else if (activePos === 'bottom-center') {
          x = width / 2 - textWidth / 2; y = margin;
        } else if (activePos === 'bottom-right') {
          x = width - margin - textWidth; y = margin;
        }
        
        page.drawText(text, {
          x: x,
          y: y,
          size: size,
          font: font,
          color: color
        });
        
        currentNum++;
      }

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
      alert('Error applying page numbers.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);
    link.download = currentFile.name.replace(/\.pdf$/i, '') + '_numbered.pdf';
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
