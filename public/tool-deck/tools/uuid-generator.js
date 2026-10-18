document.addEventListener('DOMContentLoaded', () => {
  const btnGen = document.getElementById('btn-gen');
  const btnCopyAll = document.getElementById('btn-copy-all');
  const btnClear = document.getElementById('btn-clear');
  const uuidCount = document.getElementById('uuid-count');
  const uuidList = document.getElementById('uuid-list');
  const emptyState = document.getElementById('empty-state');

  // fallback if crypto.randomUUID not available
  function generateUUIDv4() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function addUuids() {
    let count = parseInt(uuidCount.value) || 1;
    if (count > 500) count = 500;
    
    emptyState.style.display = 'none';

    for (let i = 0; i < count; i++) {
      const id = generateUUIDv4();
      const li = document.createElement('li');
      li.className = 'uuid-item';
      li.innerHTML = `
        <span class="uuid-text">${id}</span>
        <button onclick="copySingleUUID(this)" title="Copy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      `;
      // Prepend so newest is at top
      uuidList.insertBefore(li, uuidList.firstChild);
    }
  }

  btnGen.addEventListener('click', addUuids);

  btnClear.addEventListener('click', () => {
    uuidList.innerHTML = '';
    emptyState.style.display = 'block';
  });

  btnCopyAll.addEventListener('click', async () => {
    const items = uuidList.querySelectorAll('.uuid-text');
    if (items.length === 0) return;
    
    let text = Array.from(items).map(i => i.textContent).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      const orig = btnCopyAll.textContent;
      btnCopyAll.textContent = 'Copied!';
      setTimeout(() => btnCopyAll.textContent = orig, 1500);
    } catch (e) {
      alert('Failed to copy');
    }
  });

  // initial 1
  addUuids();
});

window.copySingleUUID = async function(btn) {
  const text = btn.previousElementSibling.textContent;
  try {
    await navigator.clipboard.writeText(text);
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    setTimeout(() => btn.innerHTML = orig, 1000);
  } catch(e) {
    alert('Failed to copy');
  }
};
