document.addEventListener('DOMContentLoaded', () => {
  const patternIn = document.getElementById('rgx-pattern');
  const flagsIn = document.getElementById('rgx-flags');
  const testInput = document.getElementById('test-input');
  const testHighlight = document.getElementById('test-highlight');
  const matchCount = document.getElementById('match-count');
  const rgxError = document.getElementById('rgx-error');

  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function evaluateRegex() {
    rgxError.style.display = 'none';
    const pattern = patternIn.value;
    const flags = flagsIn.value;
    const text = testInput.value;

    if (!pattern) {
      testHighlight.innerHTML = escapeHTML(text);
      matchCount.textContent = '0 matches';
      return;
    }

    let regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      rgxError.style.display = 'block';
      rgxError.textContent = e.message;
      testHighlight.innerHTML = escapeHTML(text);
      matchCount.textContent = 'Error';
      return;
    }

    if (!regex.global) {
      // If not global, just match first
      const match = text.match(regex);
      if (match) {
        const start = match.index;
        const end = start + match[0].length;
        testHighlight.innerHTML = 
          escapeHTML(text.substring(0, start)) + 
          `<span class="match-highlight">${escapeHTML(match[0])}</span>` + 
          escapeHTML(text.substring(end));
        matchCount.textContent = '1 match';
      } else {
        testHighlight.innerHTML = escapeHTML(text);
        matchCount.textContent = '0 matches';
      }
      return;
    }

    // Global replace for highlighting
    let mCount = 0;
    // We must handle empty match infinite loop
    let lastLastIndex = -1;
    let newHtml = text.replace(regex, (match, ...args) => {
      // Avoid infinite loop if regex matches empty string
      if(match.length === 0) return match; 
      mCount++;
      return `<span class="match-highlight">${escapeHTML(match)}</span>`;
    });

    testHighlight.innerHTML = newHtml.replace(/\n/g, '<br>');
    matchCount.textContent = `${mCount} match${mCount !== 1 ? 'es' : ''}`;

    // sync scroll
    testHighlight.scrollTop = testInput.scrollTop;
  }

  patternIn.addEventListener('input', evaluateRegex);
  flagsIn.addEventListener('input', evaluateRegex);
  testInput.addEventListener('input', evaluateRegex);
  testInput.addEventListener('scroll', () => {
    testHighlight.scrollTop = testInput.scrollTop;
  });

  // initial setup
  evaluateRegex();
});
