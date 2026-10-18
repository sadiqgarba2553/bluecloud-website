/* TOOLDECK — base64-text.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var textRaw = $('text-raw');
  var textB64 = $('text-b64');
  var btnEncode = $('btn-encode');
  var btnDecode = $('btn-decode');
  var copyRaw = $('copy-raw');
  var copyB64 = $('copy-b64');
  var errorMsg = $('error-msg');

  function encodeBase64() {
    errorMsg.style.display = 'none';
    var raw = textRaw.value;
    if (!raw) {
      textB64.value = '';
      return;
    }
    try {
      // Handle unicode safely
      var b64 = btoa(unescape(encodeURIComponent(raw)));
      textB64.value = b64;
    } catch (e) {
      errorMsg.textContent = 'Error encoding text';
      errorMsg.style.display = 'block';
    }
  }

  function decodeBase64() {
    errorMsg.style.display = 'none';
    var b64 = textB64.value.trim();
    if (!b64) {
      textRaw.value = '';
      return;
    }
    try {
      // Handle unicode safely
      var raw = decodeURIComponent(escape(atob(b64)));
      textRaw.value = raw;
    } catch (e) {
      errorMsg.textContent = 'Invalid Base64 string';
      errorMsg.style.display = 'block';
    }
  }

  btnEncode.addEventListener('click', encodeBase64);
  btnDecode.addEventListener('click', decodeBase64);
  
  // Real-time
  textRaw.addEventListener('input', encodeBase64);
  textB64.addEventListener('input', decodeBase64);

  function setupCopy(btn, targetTextarea) {
    btn.addEventListener('click', function() {
      var val = targetTextarea.value;
      if (!val) return;
      navigator.clipboard.writeText(val).then(function() {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = orig; }, 2000);
      });
    });
  }

  setupCopy(copyRaw, textRaw);
  setupCopy(copyB64, textB64);

})();
