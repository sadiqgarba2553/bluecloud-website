/* TOOLDECK — html-to-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  const htmlInput = $('html-input');
  const optSize = $('opt-size');
  const convertBtn = $('convert-btn');
  const clearBtn = $('clear-btn');
  const resetBtn = $('reset-btn');
  const downloadBtn = $('download-btn');
  
  const editorWrap = $('editor-wrap');
  const actionRow = $('action-row');
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const resultZone = $('result-zone');
  
  const hiddenContainer = $('hidden-render-container');
  
  let finalPdfDataUri = null;

  clearBtn.addEventListener('click', () => {
    htmlInput.value = '';
    htmlInput.focus();
  });

  resetBtn.addEventListener('click', () => {
    finalPdfDataUri = null;
    resultZone.classList.remove('visible');
    editorWrap.style.display = 'block';
    actionRow.style.display = 'flex';
  });

  htmlInput.addEventListener('input', () => {
    convertBtn.disabled = htmlInput.value.trim().length === 0;
  });

  convertBtn.addEventListener('click', async () => {
    const rawHtml = htmlInput.value.trim();
    if (!rawHtml) return;

    convertBtn.disabled = true;
    clearBtn.disabled = true;
    
    editorWrap.style.display = 'none';
    actionRow.style.display = 'none';
    
    progressWrap.classList.add('visible');
    progressFill.style.width = '20%';

    try {
      // Inject HTML
      hiddenContainer.innerHTML = rawHtml;

      // Allow DOM to update
      await new Promise(r => setTimeout(r, 100));
      progressFill.style.width = '50%';

      // Render
      const canvas = await html2canvas(hiddenContainer, {
        scale: 2, // better resolution
        useCORS: true,
        logging: false
      });
      
      progressFill.style.width = '80%';

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const { jsPDF } = window.jspdf;
      const format = optSize.value; // 'a4' or 'letter'
      const pdf = new jsPDF('p', 'mm', format);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const margin = 10; // mm
      const innerW = pdfWidth - (margin * 2);
      
      const imgHeight = (imgProps.height * innerW) / imgProps.width;

      // Simple single page rendering (if it overflows, it gets cut off in this basic version)
      pdf.addImage(imgData, 'JPEG', margin, margin, innerW, imgHeight);

      finalPdfDataUri = pdf.output('bloburl');
      progressFill.style.width = '100%';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
        hiddenContainer.innerHTML = '';
        convertBtn.disabled = false;
        clearBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      editorWrap.style.display = 'block';
      actionRow.style.display = 'flex';
      convertBtn.disabled = false;
      clearBtn.disabled = false;
      hiddenContainer.innerHTML = '';
      alert('Error rendering HTML to PDF. Check console for details.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalPdfDataUri) return;
    const link = document.createElement('a');
    link.href = finalPdfDataUri;
    link.download = 'rendered.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
