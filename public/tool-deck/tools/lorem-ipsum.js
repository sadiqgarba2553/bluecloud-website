/* TOOLDECK — lorem-ipsum.js */
(function() {
  'use strict';

  var $ = function(id) { return document.getElementById(id); };

  var countInput = $('count-input');
  var typeSelect = $('type-select');
  var startChk = $('start-chk');
  var btnGenerate = $('btn-generate');
  var outputText = $('output-text');
  var btnCopy = $('btn-copy');

  var words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", 
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", 
    "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", 
    "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", 
    "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];

  function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function generateSentence(wordCount) {
    var sentence = [];
    for (var i = 0; i < wordCount; i++) {
      sentence.push(randomWord());
    }
    return capitalize(sentence.join(' ')) + '.';
  }

  function generateParagraph() {
    var sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
    var paragraph = [];
    for (var i = 0; i < sentenceCount; i++) {
      var wordCount = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
      paragraph.push(generateSentence(wordCount));
    }
    return paragraph.join(' ');
  }

  function generateLorem() {
    var count = parseInt(countInput.value, 10) || 1;
    var type = typeSelect.value;
    var useStart = startChk.checked;
    
    var result = [];
    
    if (type === 'words') {
      for (var i = 0; i < count; i++) {
        result.push(randomWord());
      }
      if (useStart && count >= 2) {
        result[0] = "Lorem";
        result[1] = "ipsum";
      } else if (useStart && count === 1) {
        result[0] = "Lorem";
      }
      outputText.value = result.join(' ');
    } 
    else if (type === 'sentences') {
      for (var j = 0; j < count; j++) {
        var wc = Math.floor(Math.random() * 8) + 6;
        result.push(generateSentence(wc));
      }
      if (useStart) {
        // Force first sentence to be the classic one
        result[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      outputText.value = result.join(' ');
    }
    else if (type === 'paragraphs') {
      for (var k = 0; k < count; k++) {
        result.push(generateParagraph());
      }
      if (useStart) {
        // Force first paragraph to start with classic
        var classic = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
        result[0] = classic + result[0].substring(Math.min(50, result[0].length));
      }
      outputText.value = result.join('\n\n');
    }
  }

  btnGenerate.addEventListener('click', generateLorem);
  
  // Auto-generate on load
  generateLorem();

  btnCopy.addEventListener('click', function() {
    if (!outputText.value) return;
    
    navigator.clipboard.writeText(outputText.value).then(function() {
      var origHtml = btnCopy.innerHTML;
      btnCopy.classList.add('success');
      btnCopy.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      
      setTimeout(function() {
        btnCopy.classList.remove('success');
        btnCopy.innerHTML = origHtml;
      }, 2000);
    });
  });

})();
