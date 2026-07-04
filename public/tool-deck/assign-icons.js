const fs = require('fs');
const path = require('path');

// 57 Unique SVG paths (using standard viewBox 0 0 24 24, stroke="currentColor", fill="none", stroke-width="2", stroke-linecap="round", stroke-linejoin="round")
const iconDict = {
    "merge-pdf": `<path d="M8 6H5a2 2 0 00-2 2v8a2 2 0 002 2h3M16 6h3a2 2 0 012 2v8a2 2 0 01-2 2h-3M12 3v18"/>`,
    "split-pdf": `<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>`,
    "compress-pdf": `<path d="M12 5v14M19 12l-7 7-7-7"/>`,
    "jpg-to-pdf": `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,
    "word-to-pdf": `<path d="M4 4h16v16H4z"/><path d="M8 8l2 8 2-4 2 4 2-8"/>`,
    "ppt-to-pdf": `<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>`,
    "excel-to-pdf": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>`,
    "html-to-pdf": `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
    "pdf-to-jpg": `<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M20 14L15 9l-3 3-2-2-6 6"/>`,
    "pdf-to-word": `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`,
    "pdf-to-ppt": `<path d="M4 4h16v12H4z"/><path d="M12 16v6M8 22h8"/>`,
    "pdf-to-excel": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>`,
    "pdf-to-pdfa": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    "rotate-pdf": `<path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>`,
    "watermark-pdf": `<circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/>`,
    "page-numbers": `<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>`,
    "organize-pdf": `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
    "crop-pdf": `<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 0 2-2V1"/>`,
    "redact-pdf": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`,
    "protect-pdf": `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    "unlock-pdf": `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`,
    "sign-pdf": `<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    "ocr-pdf": `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 16h8M8 8h2"/>`,
    "scan-to-pdf": `<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>`,
    "repair-pdf": `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
    "compare-pdf": `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    "flatten-pdf": `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,
    "compress-png": `<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>`,
    "compress-jpg": `<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9M8 17l4 4 4-4"/>`,
    "compress-webp": `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`,
    "png-to-webp": `<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>`,
    "jpg-to-webp": `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
    "png-to-jpg": `<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>`,
    "webp-to-png": `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
    "svg-to-png": `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    "image-to-ico": `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="8" y="8" width="8" height="8"/>`,
    "crop-image": `<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 0 2-2V1"/>`,
    "resize-image": `<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>`,
    "rotate-flip": `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,
    "watermark-image": `<path d="M12 2.69l5.66 4.2c.57.43 1.34.43 1.91 0L22 4.2V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4.2l2.43 2.69c.57.43 1.34.43 1.91 0L12 2.69z"/>`,
    "remove-bg": `<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>`,
    "qr-generator": `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
    "password-gen": `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    "hash-generator": `<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>`,
    "base64-text": `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
    "color-picker": `<path d="M12 2.69l5.66 4.2c.57.43 1.34.43 1.91 0L22 4.2V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4.2l2.43 2.69c.57.43 1.34.43 1.91 0L12 2.69z"/>`,
    "uuid-generator": `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    "json-formatter": `<path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/>`,
    "word-counter": `<line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>`,
    "case-converter": `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>`,
    "text-diff": `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    "lorem-ipsum": `<path d="M4 4h16v16H4z"/><path d="M8 8l2 8 2-4 2 4 2-8"/>`,
    "regex-tester": `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3"/>`,
    "code-minify": `<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>`,
    "md-to-html": `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`,
    "epoch-converter": `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    "url-encode": `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`
};

const buildSVG = (inner) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const ROOT_DIR = 'c:\\Users\\Garba Ibrahim\\Desktop\\tool deck';
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

function injectIconsIntoIndex() {
    const indexPath = path.join(ROOT_DIR, 'index.html');
    let content = fs.readFileSync(indexPath, 'utf8');

    // Replace in <a href="tools/FILE.html" ...><span class="ic">...</span>
    content = content.replace(/(<a href="tools\/([^"]+)\.html"[^>]*>[\s\S]*?<span class="(?:ic|tic)"[^>]*>)(<svg[\s\S]*?<\/svg>)(<\/span>)/g, (match, prefix, id, oldSvg, suffix) => {
        if (iconDict[id]) {
            return prefix + buildSVG(iconDict[id]) + suffix;
        }
        return match;
    });

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('Injected icons into index.html');
}

function injectIconsIntoTools() {
    const toolFiles = fs.readdirSync(TOOLS_DIR);
    toolFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const id = file.replace('.html', '');
            if (iconDict[id]) {
                const filePath = path.join(TOOLS_DIR, file);
                let content = fs.readFileSync(filePath, 'utf8');
                // Replace the <div class="th-ic"> <svg> </div>
                content = content.replace(/(<div class="th-ic">)\s*(<svg[\s\S]*?<\/svg>)\s*(<\/div>)/g, (match, prefix, oldSvg, suffix) => {
                    const newSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconDict[id]}</svg>`;
                    return prefix + '\n            ' + newSvg + '\n          ' + suffix;
                });
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Injected icon into ${file}`);
            }
        }
    });
}

injectIconsIntoIndex();
injectIconsIntoTools();
