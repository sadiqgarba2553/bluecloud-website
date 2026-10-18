document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const btnMinHtml = document.getElementById('btn-min-html');
  const btnMinCss = document.getElementById('btn-min-css');
  const btnMinJs = document.getElementById('btn-min-js');
  const btnClear = document.getElementById('btn-clear');
  const btnCopy = document.getElementById('btn-copy');
  const errBox = document.getElementById('min-error');
  const successBox = document.getElementById('min-success');

  function showMessage(msg, isError) {
    if (isError) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
      successBox.style.display = 'none';
    } else {
      successBox.textContent = msg;
      successBox.style.display = 'block';
      errBox.style.display = 'none';
    }
  }

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024, dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  function reportSavings(oldCode, newCode) {
    const oldSize = new Blob([oldCode]).size;
    const newSize = new Blob([newCode]).size;
    const saved = oldSize - newSize;
    const percent = oldSize > 0 ? ((saved / oldSize) * 100).toFixed(1) : 0;
    showMessage(`Minified! Saved ${formatBytes(saved)} (${percent}%)`, false);
  }

  btnMinHtml.addEventListener('click', () => {
    const code = codeInput.value;
    if (!code) return;
    try {
      const minified = code
        .replace(/<!--[\s\S]*?-->/g, '') // remove comments
        .replace(/>\s+</g, '><') // remove spaces between tags
        .replace(/\s{2,}/g, ' ') // collapse spaces
        .trim();
      codeInput.value = minified;
      reportSavings(code, minified);
    } catch (e) {
      showMessage(e.message, true);
    }
  });

  btnMinCss.addEventListener('click', () => {
    const code = codeInput.value;
    if (!code) return;
    try {
      const minified = code
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s+/g, ' ') // collapse spaces
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // remove spaces around syntax
        .replace(/;}/g, '}') // remove trailing semicolon
        .trim();
      codeInput.value = minified;
      reportSavings(code, minified);
    } catch (e) {
      showMessage(e.message, true);
    }
  });

  btnMinJs.addEventListener('click', async () => {
    const code = codeInput.value;
    if (!code) return;
    try {
      if (typeof Terser !== 'undefined') {
        const result = await Terser.minify(code);
        if (result.error) throw result.error;
        codeInput.value = result.code;
        reportSavings(code, result.code);
      } else {
        // Fallback simple regex
        const minified = code
          .replace(/\/\*[\s\S]*?\*\//g, '') 
          .replace(/\/\/.*/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        codeInput.value = minified;
        reportSavings(code, minified);
      }
    } catch (e) {
      showMessage(e.message, true);
    }
  });

  btnClear.addEventListener('click', () => {
    codeInput.value = '';
    errBox.style.display = 'none';
    successBox.style.display = 'none';
  });

  btnCopy.addEventListener('click', async () => {
    if (!codeInput.value) return;
    try {
      await navigator.clipboard.writeText(codeInput.value);
      const orig = btnCopy.textContent;
      btnCopy.textContent = 'Copied!';
      setTimeout(() => btnCopy.textContent = orig, 1500);
    } catch (e) {
      alert('Failed to copy');
    }
  });
});
