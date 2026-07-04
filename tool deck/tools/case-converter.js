/* TOOLDECK — case-converter.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var inputText = $('input-text');
  var btnClear = $('btn-clear');
  var btnCopy = $('btn-copy');

  // Convert helpers
  function splitWords(str) {
    // Split by spaces, hyphens, underscores, or camelCase boundaries
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_\-]+/).filter(Boolean);
  }

  $('btn-upper').addEventListener('click', function() {
    if (!inputText.value) return;
    inputText.value = inputText.value.toUpperCase();
  });

  $('btn-lower').addEventListener('click', function() {
    if (!inputText.value) return;
    inputText.value = inputText.value.toLowerCase();
  });

  $('btn-title').addEventListener('click', function() {
    if (!inputText.value) return;
    inputText.value = inputText.value.toLowerCase().replace(/(?:^|\s|-|_)\w/g, function(match) {
      return match.toUpperCase();
    });
  });

  $('btn-sentence').addEventListener('click', function() {
    if (!inputText.value) return;
    var t = inputText.value.toLowerCase();
    inputText.value = t.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
      return c.toUpperCase();
    });
  });

  $('btn-camel').addEventListener('click', function() {
    if (!inputText.value) return;
    var words = splitWords(inputText.value);
    var res = words.map(function(w, i) {
      w = w.toLowerCase();
      if (i === 0) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    inputText.value = res.join('');
  });

  $('btn-pascal').addEventListener('click', function() {
    if (!inputText.value) return;
    var words = splitWords(inputText.value);
    var res = words.map(function(w) {
      w = w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    inputText.value = res.join('');
  });

  $('btn-snake').addEventListener('click', function() {
    if (!inputText.value) return;
    var words = splitWords(inputText.value);
    inputText.value = words.map(function(w) { return w.toLowerCase(); }).join('_');
  });

  $('btn-kebab').addEventListener('click', function() {
    if (!inputText.value) return;
    var words = splitWords(inputText.value);
    inputText.value = words.map(function(w) { return w.toLowerCase(); }).join('-');
  });

  $('btn-constant').addEventListener('click', function() {
    if (!inputText.value) return;
    var words = splitWords(inputText.value);
    inputText.value = words.map(function(w) { return w.toUpperCase(); }).join('_');
  });

  $('btn-alt').addEventListener('click', function() {
    if (!inputText.value) return;
    var res = '';
    var lower = true;
    for (var i = 0; i < inputText.value.length; i++) {
      var c = inputText.value[i];
      if (/[a-zA-Z]/.test(c)) {
        res += lower ? c.toLowerCase() : c.toUpperCase();
        lower = !lower;
      } else {
        res += c;
      }
    }
    inputText.value = res;
  });

  $('btn-inverse').addEventListener('click', function() {
    if (!inputText.value) return;
    var res = '';
    for (var i = 0; i < inputText.value.length; i++) {
      var c = inputText.value[i];
      if (c === c.toUpperCase()) res += c.toLowerCase();
      else res += c.toUpperCase();
    }
    inputText.value = res;
  });

  btnClear.addEventListener('click', function() {
    inputText.value = '';
    inputText.focus();
  });
  
  btnCopy.addEventListener('click', function() {
    if (!inputText.value) return;
    navigator.clipboard.writeText(inputText.value).then(function() {
      var origHtml = btnCopy.innerHTML;
      btnCopy.textContent = 'Copied!';
      setTimeout(function() { btnCopy.textContent = origHtml; }, 2000);
    });
  });

})();
