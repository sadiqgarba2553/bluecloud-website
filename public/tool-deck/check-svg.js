const fs = require('fs');

const html = fs.readFileSync('c:\\Users\\Garba Ibrahim\\Desktop\\tool deck\\index.html', 'utf8');

const regex = /<a href="[^"]+" class="panel-link"[^>]*>[\s\S]*?<span class="(?:ic|tic)"[^>]*>(<svg[\s\S]*?<\/svg>)<\/span>[\s\S]*?<b>([^<]+)<\/b>/g;

let match;
const icons = {};
while ((match = regex.exec(html)) !== null) {
    const svg = match[1].replace(/\s+/g, ' '); // normalize whitespace
    const title = match[2];
    if (!icons[svg]) {
        icons[svg] = [];
    }
    icons[svg].push(title);
}

for (const [svg, titles] of Object.entries(icons)) {
    if (titles.length > 1) {
        console.log(`\nDUPLICATE ICON USED FOR:`);
        console.log(titles.join(', '));
    }
}
