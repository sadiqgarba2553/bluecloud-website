document.addEventListener('DOMContentLoaded', () => {
  const qrText = document.getElementById('qr-text');
  const qrSize = document.getElementById('qr-size');
  const qrDark = document.getElementById('qr-color-dark');
  const qrLight = document.getElementById('qr-color-light');
  const qrcodeDiv = document.getElementById('qrcode');
  const qrPlaceholder = document.getElementById('qr-placeholder');
  const btnDownload = document.getElementById('btn-download');

  let qrCode = null;

  function generateQR() {
    const text = qrText.value.trim();
    if (!text) {
      qrcodeDiv.style.display = 'none';
      qrPlaceholder.style.display = 'block';
      btnDownload.style.display = 'none';
      return;
    }

    qrcodeDiv.innerHTML = '';
    const size = parseInt(qrSize.value);

    qrCode = new QRCode(qrcodeDiv, {
      text: text,
      width: size,
      height: size,
      colorDark : qrDark.value,
      colorLight : qrLight.value,
      correctLevel : QRCode.CorrectLevel.H
    });

    qrcodeDiv.style.display = 'block';
    qrPlaceholder.style.display = 'none';
    btnDownload.style.display = 'flex';
  }

  [qrText, qrSize, qrDark, qrLight].forEach(el => {
    el.addEventListener('input', generateQR);
    el.addEventListener('change', generateQR);
  });

  btnDownload.addEventListener('click', () => {
    const img = qrcodeDiv.querySelector('img');
    const canvas = qrcodeDiv.querySelector('canvas');
    if (!img && !canvas) return;

    const url = img && img.src ? img.src : canvas.toDataURL("image/png");
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // initial check
  generateQR();
});
