/* TOOLDECK — word-counter.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var inputText = $('input-text');
  var vWords = $('val-words');
  var vChars = $('val-chars');
  var vCharsNoSpace = $('val-chars-nospace');
  var vSentences = $('val-sentences');
  var vParagraphs = $('val-paragraphs');
  var vRead = $('val-read');
  var vSpeak = $('val-speak');
  
  var btnClear = $('btn-clear');
  var btnCopy = $('btn-copy');

  function analyzeText() {
    var text = inputText.value || '';
    
    // Characters
    var chars = text.length;
    var charsNoSpace = text.replace(/\s+/g, '').length;
    
    // Words
    var wordsMatch = text.match(/\S+/g);
    var words = wordsMatch ? wordsMatch.length : 0;
    
    // Sentences
    var sentencesMatch = text.match(/[^.!?]+[.!?]+/g);
    var sentences = sentencesMatch ? sentencesMatch.length : 0;
    if (words > 0 && sentences === 0) sentences = 1; // Basic fallback if no punctuation but has words
    
    // Paragraphs
    var paragraphsMatch = text.split(/\n+/).filter(function(p) { return p.trim().length > 0; });
    var paragraphs = paragraphsMatch.length;
    
    if (chars === 0) {
      sentences = 0;
    }

    // Time (Reading ~250 wpm, Speaking ~130 wpm)
    function formatTime(w, rate) {
      if (w === 0) return '0 min';
      var minutes = w / rate;
      if (minutes < 1) {
        var sec = Math.ceil(minutes * 60);
        return sec + ' sec';
      }
      var m = Math.floor(minutes);
      var s = Math.round((minutes - m) * 60);
      if (s === 0) return m + ' min';
      return m + 'm ' + s + 's';
    }

    vWords.textContent = words.toLocaleString();
    vChars.textContent = chars.toLocaleString();
    vCharsNoSpace.textContent = charsNoSpace.toLocaleString();
    vSentences.textContent = sentences.toLocaleString();
    vParagraphs.textContent = paragraphs.toLocaleString();
    
    vRead.textContent = formatTime(words, 250);
    vSpeak.textContent = formatTime(words, 130);
  }

  inputText.addEventListener('input', analyzeText);
  
  btnClear.addEventListener('click', function() {
    inputText.value = '';
    analyzeText();
    inputText.focus();
  });
  
  btnCopy.addEventListener('click', function() {
    if (!inputText.value) return;
    navigator.clipboard.writeText(inputText.value).then(function() {
      var origHtml = btnCopy.innerHTML;
      btnCopy.textContent = 'Copied!';
      setTimeout(function() { btnCopy.textContent = 'Copy'; }, 2000);
    });
  });

})();
