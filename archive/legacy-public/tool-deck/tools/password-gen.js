document.addEventListener('DOMContentLoaded', () => {
  const passDisplay = document.getElementById('pass-display');
  const btnCopy = document.getElementById('btn-copy');
  const btnGen = document.getElementById('btn-gen');
  const passLen = document.getElementById('pass-len');
  const lenVal = document.getElementById('len-val');
  
  const chkUpper = document.getElementById('chk-upper');
  const chkLower = document.getElementById('chk-lower');
  const chkNum = document.getElementById('chk-num');
  const chkSym = document.getElementById('chk-sym');

  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    num: '0123456789',
    sym: '!@#$%^&*()_+~`|}{[]:;?><,./-='
  };

  function generatePassword() {
    let charset = '';
    if (chkUpper.checked) charset += chars.upper;
    if (chkLower.checked) charset += chars.lower;
    if (chkNum.checked) charset += chars.num;
    if (chkSym.checked) charset += chars.sym;

    if (!charset) {
      passDisplay.textContent = 'Select at least one option';
      passDisplay.style.color = 'var(--t3)';
      return;
    }

    let password = '';
    const length = parseInt(passLen.value);
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    passDisplay.textContent = password;
    passDisplay.style.color = 'var(--t1)';
  }

  passLen.addEventListener('input', () => {
    lenVal.textContent = passLen.value;
    generatePassword();
  });

  [chkUpper, chkLower, chkNum, chkSym].forEach(el => {
    el.addEventListener('change', generatePassword);
  });

  btnGen.addEventListener('click', generatePassword);

  btnCopy.addEventListener('click', async () => {
    const text = passDisplay.textContent;
    if (text && text !== 'Select at least one option') {
      try {
        await navigator.clipboard.writeText(text);
        const orig = btnCopy.innerHTML;
        btnCopy.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        setTimeout(() => btnCopy.innerHTML = orig, 2000);
      } catch (err) {
        alert('Failed to copy');
      }
    }
  });

  generatePassword();
});
