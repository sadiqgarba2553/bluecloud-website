const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:\\Users\\Garba Ibrahim\\Desktop\\tool deck';
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove inline backgrounds using hex codes (e.g., style="background:#f59e0b" or style="background: #10b981;")
    // Match optional quotes if they surround it, or just match the attribute itself
    content = content.replace(/style=["']background:\s*#[0-9a-fA-F]{3,6};?["']/g, '');
    
    // Normalize SVG stroke/fill
    content = content.replace(/stroke=["']#fff(?:fff)?["']/gi, 'stroke="currentColor"');
    content = content.replace(/fill=["']#fff(?:fff)?["']/gi, 'fill="currentColor"');

    // Also strip color inside a larger style block: style="background:#...; color:white;"
    // For simplicity, just find background:#HEX and remove it inside style attributes
    content = content.replace(/background:\s*#[0-9a-fA-F]{3,6};?\s*/g, '');

    // Cleanup empty style attributes like style=""
    content = content.replace(/style=["']\s*["']/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${path.basename(filePath)}`);
}

// Process index.html
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    processFile(indexHtmlPath);
}

// Process tools/*.html
const toolFiles = fs.readdirSync(TOOLS_DIR);
toolFiles.forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(TOOLS_DIR, file));
    }
});

console.log('Cleanup complete!');
