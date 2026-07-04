document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const urlOutput = document.getElementById('url-output');
  const btnEncode = document.getElementById('btn-encode');
  const btnDecode = document.getElementById('btn-decode');
  const btnClear = document.getElementById('btn-clear');
  const btnPaste = document.getElementById('btn-paste');
  const btnCopy = document.getElementById('btn-copy');

  btnEncode.addEventListener('click', () => {
    try {
      urlOutput.value = encodeURIComponent(urlInput.value);
    } catch (e) {
      urlOutput.value = "Error encoding: " + e.message;
    }
  });

  btnDecode.addEventListener('click', () => {
    try {
      urlOutput.value = decodeURIComponent(urlInput.value);
    } catch (e) {
      urlOutput.value = "Error decoding: " + e.message;
    }
  });

  btnClear.addEventListener('click', () => {
    urlInput.value = '';
    urlOutput.value = '';
    urlInput.focus();
  });

  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text;
      // Auto decode if looks encoded, otherwise encode
      if (text.includes('%')) {
        btnDecode.click();
      } else {
        btnEncode.click();
      }
    } catch (e) {
      alert("Failed to paste: " + e.message);
    }
  });

  btnCopy.addEventListener('click', async () => {
    if (!urlOutput.value) return;
    try {
      await navigator.clipboard.writeText(urlOutput.value);
      const orig = btnCopy.textContent;
      btnCopy.textContent = 'Copied!';
      setTimeout(() => btnCopy.textContent = orig, 1500);
    } catch (e) {
      alert("Failed to copy: " + e.message);
    }
  });
});
