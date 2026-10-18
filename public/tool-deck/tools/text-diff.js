/* TOOLDECK — text-diff.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var textOld = $('text-old');
  var textNew = $('text-new');
  var btnCompare = $('btn-compare');
  var btnClear = $('btn-clear');
  var chkWords = $('diff-words');
  
  var resWrap = $('diff-result-wrap');
  var resContent = $('diff-content');

  function performDiff() {
    var oldT = textOld.value || '';
    var newT = textNew.value || '';
    
    if (!oldT && !newT) return;
    
    var diffResult;
    if (chkWords.checked) {
      diffResult = Diff.diffWords(oldT, newT);
    } else {
      diffResult = Diff.diffChars(oldT, newT);
    }
    
    var fragment = document.createDocumentFragment();
    
    diffResult.forEach(function(part) {
      var span;
      if (part.added) {
        span = document.createElement('ins');
      } else if (part.removed) {
        span = document.createElement('del');
      } else {
        span = document.createElement('span');
      }
      span.appendChild(document.createTextNode(part.value));
      fragment.appendChild(span);
    });
    
    resContent.innerHTML = '';
    resContent.appendChild(fragment);
    
    resWrap.classList.add('visible');
    
    // Scroll to result smoothly
    setTimeout(function() {
      resWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  btnCompare.addEventListener('click', performDiff);
  
  btnClear.addEventListener('click', function() {
    textOld.value = '';
    textNew.value = '';
    resWrap.classList.remove('visible');
    resContent.innerHTML = '';
    textOld.focus();
  });

})();
