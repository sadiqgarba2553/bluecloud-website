/* TOOLDECK — md-to-html.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var textMd = $('text-md');
  var textHtml = $('text-html');
  var prevBox = $('preview-box');
  
  var btnClear = $('btn-clear');
  var btnCopy = $('btn-copy');
  
  var viewCode = $('view-code');
  var viewPrev = $('view-prev');
  
  var mode = 'code';

  function convert() {
    var md = textMd.value || '';
    if (!md) {
      textHtml.value = '';
      prevBox.innerHTML = '';
      return;
    }
    
    // Convert via marked
    var html = marked.parse(md);
    
    textHtml.value = html;
    prevBox.innerHTML = html;
  }

  textMd.addEventListener('input', convert);

  viewCode.addEventListener('click', function() {
    mode = 'code';
    viewCode.classList.add('active');
    viewPrev.classList.remove('active');
    textHtml.style.display = 'block';
    prevBox.classList.remove('active');
  });

  viewPrev.addEventListener('click', function() {
    mode = 'preview';
    viewPrev.classList.add('active');
    viewCode.classList.remove('active');
    textHtml.style.display = 'none';
    prevBox.classList.add('active');
  });

  btnClear.addEventListener('click', function() {
    textMd.value = '';
    convert();
    textMd.focus();
  });
  
  btnCopy.addEventListener('click', function() {
    var textToCopy = mode === 'code' ? textHtml.value : prevBox.innerText;
    if (!textToCopy) return;
    
    navigator.clipboard.writeText(textToCopy).then(function() {
      var origHtml = btnCopy.innerHTML;
      btnCopy.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(function() { btnCopy.innerHTML = origHtml; }, 2000);
    });
  });

  // Initial render if there is default text
  convert();

})();
