/* TOOLDECK — excel-to-pdf.js */
(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  let currentFile = null;
  let fileBuffer = null;
  let finalPdfDataUri = null;

  const dropZone = $('upload-zone');
  const fileInput = $('file-input');
  const fileListContainer = $('file-list-container');
  const fileNameDisplay = $('file-name');
  const fileSizeDisplay = $('file-size');
  const changeFileBtn = $('change-file-btn');
  
  const actionRow = $('action-row');
  const convertBtn = $('convert-btn');
  
  const progressWrap = $('progress-wrap');
  const progressFill = $('progress-fill');
  const progressText = $('progress-text');
  
  const resultZone = $('result-zone');
  const downloadBtn = $('download-btn');
  const resetBtn = $('reset-btn');
  const hiddenContainer = $('hidden-render-container');

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file) => {
    if (!file) return;
    const validExts = ['.xlsx', '.xls', '.csv'];
    const isValid = validExts.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      alert('Please upload a valid Excel or CSV file.');
      return;
    }
    currentFile = file;
    fileBuffer = await file.arrayBuffer();
    
    fileNameDisplay.innerText = file.name;
    fileSizeDisplay.innerText = formatSize(file.size);
    
    updateUI();
  };

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); }, false);
  });
  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.add('dragover'), false);
  });
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false);
  });
  dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]), false);
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => { handleFile(e.target.files[0]); fileInput.value = ''; });
  
  changeFileBtn.addEventListener('click', () => fileInput.click());

  const updateUI = () => {
    if (currentFile) {
      dropZone.style.display = 'none';
      fileListContainer.style.display = 'block';
      actionRow.style.display = 'flex';
    } else {
      dropZone.style.display = 'block';
      fileListContainer.style.display = 'none';
      actionRow.style.display = 'none';
      resultZone.classList.remove('visible');
    }
  };

  resetBtn.addEventListener('click', () => {
    currentFile = null;
    fileBuffer = null;
    finalPdfDataUri = null;
    resultZone.classList.remove('visible');
    updateUI();
  });

  convertBtn.addEventListener('click', async () => {
    if (!currentFile || !fileBuffer) return;

    convertBtn.disabled = true;
    actionRow.style.display = 'none';
    fileListContainer.style.display = 'none';
    
    progressWrap.classList.add('visible');
    progressFill.style.width = '10%';
    progressText.innerText = 'Reading Spreadsheet...';

    try {
      // Parse Excel
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      progressFill.style.width = '30%';
      progressText.innerText = 'Generating HTML Table...';

      // Convert to HTML
      const htmlTable = XLSX.utils.sheet_to_html(worksheet);
      hiddenContainer.innerHTML = htmlTable;
      
      progressFill.style.width = '50%';
      progressText.innerText = 'Rendering pages...';
      
      await new Promise(r => setTimeout(r, 100)); // allow DOM render

      const canvas = await html2canvas(hiddenContainer, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      progressFill.style.width = '80%';
      progressText.innerText = 'Generating PDF...';

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const { jsPDF } = window.jspdf;
      // Using 'landscape' since spreadsheets are often wide
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      
      const margin = 10;
      const innerW = pdfWidth - (margin * 2);
      const imgHeight = (imgProps.height * innerW) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', margin, margin, innerW, imgHeight);

      finalPdfDataUri = pdf.output('bloburl');
      progressFill.style.width = '100%';
      progressText.innerText = 'Done!';

      setTimeout(() => {
        progressWrap.classList.remove('visible');
        resultZone.classList.add('visible');
        hiddenContainer.innerHTML = '';
        convertBtn.disabled = false;
      }, 500);

    } catch (err) {
      console.error(err);
      progressWrap.classList.remove('visible');
      fileListContainer.style.display = 'block';
      actionRow.style.display = 'flex';
      convertBtn.disabled = false;
      hiddenContainer.innerHTML = '';
      alert(err.message || 'Error converting Excel to PDF.');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!finalPdfDataUri) return;
    const link = document.createElement('a');
    link.href = finalPdfDataUri;
    link.download = currentFile.name.replace(/\.(xlsx|xls|csv)$/i, '') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

})();

window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
window.addEventListener('drop', function(e) { e.preventDefault(); }, false);
