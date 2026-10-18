const fs = require('fs');
const path = require('path');
const toolsDir = path.join(process.cwd(), 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.js'));

const missingClick = [
  'crop-pdf.js','html-to-pdf.js','organize-pdf.js','page-numbers.js',
  'protect-pdf.js','redact-pdf.js','rotate-pdf.js','sign-pdf.js',
  'unlock-pdf.js','watermark-pdf.js'
];

files.forEach(f => {
  let content = fs.readFileSync(path.join(toolsDir, f), 'utf8');
  let changed = false;

  if (!content.includes("window.addEventListener('dragover'")) {
    content += "\nwindow.addEventListener('dragover', function(e) { e.preventDefault(); }, false);\n";
    content += "window.addEventListener('drop', function(e) { e.preventDefault(); }, false);\n";
    changed = true;
  }

  if (missingClick.includes(f)) {
    const zoneVar = content.includes('var uploadZone') || content.includes('const uploadZone') || content.includes('let uploadZone') ? 'uploadZone' : 'dropZone';
    
    // Check if it already has a click handler to avoid duplicates
    if (!content.includes(zoneVar + ".addEventListener('click'")) {
      const clickHandler = `\n  if (typeof ${zoneVar} !== 'undefined' && ${zoneVar}) {
    ${zoneVar}.addEventListener('click', function(e) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'input') {
        var fi = document.getElementById('file-input');
        if (fi) fi.click();
      }
    });
  }\n`;
      
      // Inject before the last })();
      const idx = content.lastIndexOf('})();');
      if (idx !== -1) {
        content = content.substring(0, idx) + clickHandler + content.substring(idx);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(path.join(toolsDir, f), content, 'utf8');
    console.log('Fixed ' + f);
  }
});
