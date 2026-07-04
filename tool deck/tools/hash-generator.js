document.addEventListener('DOMContentLoaded', () => {
  const hashInput = document.getElementById('hash-input');
  const outMd5 = document.getElementById('out-md5');
  const outSha1 = document.getElementById('out-sha1');
  const outSha256 = document.getElementById('out-sha256');
  const outSha512 = document.getElementById('out-sha512');

  function updateHashes() {
    const text = hashInput.value;
    if (!text) {
      outMd5.textContent = '';
      outSha1.textContent = '';
      outSha256.textContent = '';
      outSha512.textContent = '';
      return;
    }

    outMd5.textContent = CryptoJS.MD5(text).toString();
    outSha1.textContent = CryptoJS.SHA1(text).toString();
    outSha256.textContent = CryptoJS.SHA256(text).toString();
    outSha512.textContent = CryptoJS.SHA512(text).toString();
  }

  hashInput.addEventListener('input', updateHashes);
});

window.copyHash = async function(id) {
  const el = document.getElementById(id);
  const text = el.textContent;
  if (text) {
    try {
      await navigator.clipboard.writeText(text);
      el.style.backgroundColor = 'var(--bg3)';
      setTimeout(() => el.style.backgroundColor = '', 200);
    } catch (e) {
      alert('Failed to copy');
    }
  }
};
