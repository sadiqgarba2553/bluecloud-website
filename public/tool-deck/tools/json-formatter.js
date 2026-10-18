document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('json-input');
  const btnFormat = document.getElementById('btn-format');
  const btnMinify = document.getElementById('btn-minify');
  const btnClear = document.getElementById('btn-clear');
  const btnCopy = document.getElementById('btn-copy');
  const errBox = document.getElementById('json-error');
  const validBox = document.getElementById('json-valid');

  function clearAlerts() {
    errBox.style.display = 'none';
    validBox.style.display = 'none';
  }

  function processJson(indent) {
    clearAlerts();
    const raw = jsonInput.value.trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      jsonInput.value = JSON.stringify(parsed, null, indent);
      validBox.style.display = 'block';
    } catch (e) {
      errBox.textContent = 'Invalid JSON: ' + e.message;
      errBox.style.display = 'block';
    }
  }

  btnFormat.addEventListener('click', () => processJson(2));
  btnMinify.addEventListener('click', () => processJson(0));

  btnClear.addEventListener('click', () => {
    jsonInput.value = '';
    clearAlerts();
    jsonInput.focus();
  });

  btnCopy.addEventListener('click', async () => {
    if (!jsonInput.value) return;
    try {
      await navigator.clipboard.writeText(jsonInput.value);
      const orig = btnCopy.textContent;
      btnCopy.textContent = 'Copied!';
      setTimeout(() => btnCopy.textContent = orig, 1500);
    } catch (e) {
      alert('Failed to copy');
    }
  });

  // optional real-time validation on blur
  jsonInput.addEventListener('blur', () => {
    if(jsonInput.value.trim()) {
      clearAlerts();
      try {
        JSON.parse(jsonInput.value.trim());
        validBox.style.display = 'block';
      } catch (e) {
        errBox.textContent = 'Invalid JSON: ' + e.message;
        errBox.style.display = 'block';
      }
    } else {
      clearAlerts();
    }
  });
});
