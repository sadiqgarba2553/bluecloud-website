const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. UI Redesign: Replace Design Tokens
const oldTokens = `    /* ── DESIGN TOKENS ─────────────────────── */
    :root {
      --bg:          #141418;
      --bg-sidebar:  #0F0F13;
      --bg-panel:    #1C1C22;
      --bg-input:    #252530;
      --bg-hover:    #2A2A36;
      --bg-active:   #20202C;

      --border:      #2C2C3A;
      --border-md:   #38384A;

      --text:        #DDDDF0;
      --text-muted:  #6A6A88;
      --text-dim:    #3A3A52;

      --accent:      #5E6AD2;
      --accent-h:    #4F5BC4;
      --accent-dim:  rgba(94,106,210,0.12);
      --accent-dim2: rgba(94,106,210,0.22);

      --green:       #22C55E;
      --green-dim:   rgba(34,197,94,0.12);
      --red:         #EF4444;
      --red-dim:     rgba(239,68,68,0.12);
      --yellow:      #F59E0B;

      --radius:      5px;
      --radius-md:   8px;
      --sidebar-w:   204px;
      --header-h:    46px;
    }`;

const newTokens = `    /* ── DESIGN TOKENS ─────────────────────── */
    :root {
      --bg:          #1E1E1E;
      --bg-sidebar:  #2C2C2C;
      --bg-panel:    #252526;
      --bg-input:    #333333;
      --bg-hover:    #2A2D2E;
      --bg-active:   #37373D;

      --border:      #444444;
      --border-md:   #555555;

      --text:        #CCCCCC;
      --text-muted:  #969696;
      --text-dim:    #757575;

      --accent:      #0D99FF;
      --accent-h:    #007BE5;
      --accent-dim:  rgba(13,153,255,0.15);
      --accent-dim2: rgba(13,153,255,0.25);

      --green:       #4CAF50;
      --green-dim:   rgba(76,175,80,0.12);
      --red:         #F44336;
      --red-dim:     rgba(244,67,54,0.12);
      --yellow:      #FFC107;

      --radius:      3px;
      --radius-md:   5px;
      --sidebar-w:   220px;
      --header-h:    40px;
    }`;
html = html.replace(oldTokens, newTokens);

// 2. Add Navigation Items
const oldNav = `      <div class="nav-section">AI</div>
      <div class="nav-item" id="n-ai" onclick="go('ai')">
        <i data-lucide="bot"></i> AI Assistant
      </div>
    </nav>`;
const newNav = `      <div class="nav-section">New Tools</div>
      <div class="nav-item" id="n-blob" onclick="go('blob')">
        <i data-lucide="shapes"></i> Blob Generator
      </div>
      <div class="nav-item" id="n-anim" onclick="go('anim')">
        <i data-lucide="film"></i> Animation Builder
      </div>
      <div class="nav-item" id="n-icon" onclick="go('icon')">
        <i data-lucide="library"></i> Icon Manager
      </div>
      <div class="nav-item" id="n-grid" onclick="go('grid')">
        <i data-lucide="layout-grid"></i> Layout Playground
      </div>
      <div class="nav-item" id="n-opt" onclick="go('opt')">
        <i data-lucide="image-minus"></i> Image Optimizer
      </div>
      <div class="nav-item" id="n-sys" onclick="go('sys')">
        <i data-lucide="package-export"></i> Design System Exporter
      </div>

      <div class="nav-section">AI</div>
      <div class="nav-item" id="n-ai" onclick="go('ai')">
        <i data-lucide="bot"></i> AI Assistant
      </div>
    </nav>`;
html = html.replace(oldNav, newNav);

// 3. TOOL_META Update
const oldToolMeta = `  fonts:     { title: 'Font Pairing Studio',  badge: 'Typography' },
  typescale: { title: 'Type Scale Generator', badge: 'Typography' },
  ai:        { title: 'AI Design Assistant',  badge: 'AI' },`;
const newToolMeta = `  fonts:     { title: 'Font Pairing Studio',  badge: 'Typography' },
  typescale: { title: 'Type Scale Generator', badge: 'Typography' },
  blob:      { title: 'SVG Blob Generator',   badge: 'Tool' },
  anim:      { title: 'CSS Animation Builder',badge: 'Tool' },
  icon:      { title: 'Unified Icon Manager', badge: 'Tool' },
  grid:      { title: 'Layout Playground',    badge: 'Tool' },
  opt:       { title: 'Image Optimizer',      badge: 'Tool' },
  sys:       { title: 'Design System Exporter',badge: 'Export' },
  ai:        { title: 'AI Design Assistant',  badge: 'AI' },`;
html = html.replace(oldToolMeta, newToolMeta);

// 4. Add HTML Panels
const newPanels = `
      <!-- ░░ BLOB GENERATOR ░░ -->
      <div class="panel" id="p-blob">
        <div class="page-head">
          <h1>SVG Blob Generator</h1>
          <p>Generate organic shapes for backgrounds and illustrations.</p>
        </div>
        <div class="g2">
          <div class="card">
            <div class="card-label">Settings</div>
            <div class="field">
              <label>Color</label>
              <input type="color" id="blob-col" value="#0D99FF" oninput="drawBlob()">
            </div>
            <div class="slider-row">
              <div class="slider-lbl"><span>Complexity</span><span id="blob-cv">5</span></div>
              <input type="range" id="blob-comp" min="3" max="12" value="5" oninput="document.getElementById('blob-cv').textContent=this.value;drawBlob()">
            </div>
            <div class="slider-row">
              <div class="slider-lbl"><span>Contrast (Randomness)</span><span id="blob-rv">5</span></div>
              <input type="range" id="blob-rand" min="1" max="10" value="5" oninput="document.getElementById('blob-rv').textContent=this.value;drawBlob()">
            </div>
            <button class="btn btn-secondary w100 mt2" onclick="drawBlob()">Shuffle Shape</button>
            <button class="btn btn-primary w100 mt2" onclick="cp('blob-code')">Copy SVG</button>
          </div>
          <div>
            <div class="card mb2" style="display:flex;align-items:center;justify-content:center;height:240px;background:var(--bg-input)">
              <div id="blob-prev" style="width:200px;height:200px"></div>
            </div>
            <div class="card code" id="blob-code" style="max-height:120px;overflow-y:auto"></div>
          </div>
        </div>
      </div>

      <!-- ░░ ANIMATION BUILDER ░░ -->
      <div class="panel" id="p-anim">
        <div class="page-head">
          <h1>CSS Animation Builder</h1>
          <p>Create keyframe animations and export CSS.</p>
        </div>
        <div class="g2">
          <div class="card">
            <div class="card-label">Settings</div>
            <div class="field">
              <label>Animation Preset</label>
              <select id="anim-type" onchange="updAnim()">
                <option value="bounce">Bounce</option>
                <option value="pulse">Pulse</option>
                <option value="spin">Spin</option>
                <option value="shake">Shake</option>
                <option value="fade-in">Fade In</option>
              </select>
            </div>
            <div class="slider-row">
              <div class="slider-lbl"><span>Duration</span><span id="anim-dv">1.0s</span></div>
              <input type="range" id="anim-dur" min="0.1" max="5.0" step="0.1" value="1.0" oninput="document.getElementById('anim-dv').textContent=this.value+'s';updAnim()">
            </div>
            <div class="field">
              <label>Easing</label>
              <select id="anim-ease" onchange="updAnim()">
                <option value="ease">ease</option>
                <option value="linear">linear</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
              </select>
            </div>
            <div class="field mt2">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" id="anim-inf" checked onchange="updAnim()"> Infinite Loop</label>
            </div>
            <button class="btn btn-secondary w100 mt2" onclick="playAnim()">Replay Animation</button>
            <button class="btn btn-primary w100 mt2" onclick="cp('anim-code')">Copy CSS</button>
          </div>
          <div>
            <div class="card mb2" style="display:flex;align-items:center;justify-content:center;height:240px;background:var(--bg-input)">
              <div id="anim-box" style="width:80px;height:80px;background:var(--accent);border-radius:var(--radius-md)"></div>
            </div>
            <div class="card code" id="anim-code" style="max-height:160px;overflow-y:auto"></div>
          </div>
        </div>
      </div>

      <!-- ░░ ICON MANAGER ░░ -->
      <div class="panel" id="p-icon">
        <div class="page-head">
          <h1>Unified Icon Manager</h1>
          <p>Search and copy Lucide icons directly to your clipboard.</p>
        </div>
        <div class="card">
          <div class="field mb3">
            <input type="text" id="icon-search" placeholder="Search icons (e.g., user, home, heart)..." oninput="searchIcons()">
          </div>
          <div id="icon-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:10px;max-height:400px;overflow-y:auto"></div>
        </div>
      </div>

      <!-- ░░ LAYOUT PLAYGROUND ░░ -->
      <div class="panel" id="p-grid">
        <div class="page-head">
          <h1>Layout Playground</h1>
          <p>Visual builder for Flexbox and CSS Grid.</p>
        </div>
        <div class="g2">
          <div class="card">
            <div class="card-label">Container Settings</div>
            <div class="field">
              <label>Display</label>
              <select id="lay-disp" onchange="updLayout()">
                <option value="flex">Flexbox</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div class="field" id="lay-dir-f">
              <label>Flex Direction</label>
              <select id="lay-dir" onchange="updLayout()">
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            <div class="field" id="lay-col-f" style="display:none">
              <label>Grid Columns</label>
              <input type="text" id="lay-col" value="repeat(3, 1fr)" oninput="updLayout()">
            </div>
            <div class="field">
              <label>Justify Content</label>
              <select id="lay-jc" onchange="updLayout()">
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
              </select>
            </div>
            <div class="field">
              <label>Align Items</label>
              <select id="lay-ai" onchange="updLayout()">
                <option value="stretch">stretch</option>
                <option value="center">center</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
              </select>
            </div>
            <div class="slider-row">
              <div class="slider-lbl"><span>Gap</span><span id="lay-gv">16px</span></div>
              <input type="range" id="lay-gap" min="0" max="64" value="16" oninput="document.getElementById('lay-gv').textContent=this.value+'px';updLayout()">
            </div>
            <button class="btn btn-secondary w100 mt2" onclick="addLayItem()">Add Item</button>
            <button class="btn btn-primary w100 mt2" onclick="cp('lay-code')">Copy CSS</button>
          </div>
          <div>
            <div class="card mb2" id="lay-stage" style="min-height:300px;background:var(--bg-input);padding:10px;resize:both;overflow:auto">
              <div class="lay-item" style="padding:15px;background:var(--accent);color:#fff;border-radius:4px;text-align:center">1</div>
              <div class="lay-item" style="padding:15px;background:var(--accent);color:#fff;border-radius:4px;text-align:center">2</div>
              <div class="lay-item" style="padding:15px;background:var(--accent);color:#fff;border-radius:4px;text-align:center">3</div>
            </div>
            <div class="card code" id="lay-code"></div>
          </div>
        </div>
      </div>

      <!-- ░░ IMAGE OPTIMIZER ░░ -->
      <div class="panel" id="p-opt">
        <div class="page-head">
          <h1>Image Optimizer</h1>
          <p>Compress images locally into WebP format.</p>
        </div>
        <div class="g2">
          <div>
            <div class="upload" id="opt-upload" onclick="document.getElementById('opt-file').click()">
              <input type="file" id="opt-file" accept="image/png,image/jpeg,image/webp" style="display:none" onchange="onOptUpload(event)">
              <div class="upload-icon"><i data-lucide="image" style="width:100%;height:100%"></i></div>
              <p><strong>Click to upload</strong> or drag and drop<br>PNG, JPG</p>
            </div>
            <div class="card mt2" id="opt-controls" style="display:none">
              <div class="slider-row">
                <div class="slider-lbl"><span>Quality</span><span id="opt-qv">80%</span></div>
                <input type="range" id="opt-qual" min="10" max="100" value="80" oninput="document.getElementById('opt-qv').textContent=this.value+'%';optImage()">
              </div>
              <div style="font-size:12px;color:var(--text-muted);margin:10px 0" id="opt-stats"></div>
              <button class="btn btn-primary w100" onclick="dlOpt()">Download WebP</button>
            </div>
          </div>
          <div class="card" style="display:flex;align-items:center;justify-content:center;background:var(--bg-input);overflow:hidden">
            <img id="opt-prev" style="max-width:100%;max-height:300px;border-radius:var(--radius)">
          </div>
        </div>
      </div>

      <!-- ░░ DESIGN SYSTEM EXPORTER ░░ -->
      <div class="panel" id="p-sys">
        <div class="page-head">
          <h1>Design System Exporter</h1>
          <p>Generate a complete configuration file.</p>
        </div>
        <div class="card mb2">
          <div class="flex gap2">
            <button class="btn btn-secondary" onclick="genSys('css')">Export as CSS Variables</button>
            <button class="btn btn-secondary" onclick="genSys('tailwind')">Export for Tailwind config</button>
          </div>
        </div>
        <div class="card code" id="sys-code" style="height:400px;overflow-y:auto;white-space:pre">Click an export option above.</div>
      </div>
`;
html = html.replace('    </div><!-- /content -->', newPanels + '\n    </div><!-- /content -->');

// 5. Add JS Functions
const newJS = `

// ── BLOB GENERATOR ───────────────────────────────────
function drawBlob() {
  const col = document.getElementById('blob-col').value;
  const comp = parseInt(document.getElementById('blob-comp').value);
  const rand = parseInt(document.getElementById('blob-rand').value);
  
  const points = [];
  const radius = 80;
  const cx = 100, cy = 100;
  const angleStep = (Math.PI * 2) / comp;
  
  for(let i=0; i<comp; i++) {
    const r = radius - (Math.random() * (rand * 5));
    const a = angleStep * i;
    points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  
  // Create smooth SVG path
  let path = \`M \${points[0].x} \${points[0].y}\`;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    path += \` Q \${p1.x} \${p1.y} \${mx} \${my}\`;
  }
  
  const svg = \`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\\n  <path fill="\${col}" d="\${path}" />\\n</svg>\`;
  document.getElementById('blob-prev').innerHTML = svg;
  document.getElementById('blob-code').textContent = svg;
}

// ── ANIMATION BUILDER ────────────────────────────────
function updAnim() {
  const type = document.getElementById('anim-type').value;
  const dur = document.getElementById('anim-dur').value;
  const ease = document.getElementById('anim-ease').value;
  const inf = document.getElementById('anim-inf').checked ? 'infinite' : 'forwards';
  
  let keyframes = '';
  if(type === 'bounce') keyframes = \`@keyframes bounce {\\n  0%, 100% { transform: translateY(0); }\\n  50% { transform: translateY(-20px); }\\n}\`;
  if(type === 'pulse') keyframes = \`@keyframes pulse {\\n  0%, 100% { transform: scale(1); }\\n  50% { transform: scale(1.1); }\\n}\`;
  if(type === 'spin') keyframes = \`@keyframes spin {\\n  100% { transform: rotate(360deg); }\\n}\`;
  if(type === 'shake') keyframes = \`@keyframes shake {\\n  0%, 100% { transform: translateX(0); }\\n  25% { transform: translateX(-10px); }\\n  75% { transform: translateX(10px); }\\n}\`;
  if(type === 'fade-in') keyframes = \`@keyframes fade-in {\\n  0% { opacity: 0; }\\n  100% { opacity: 1; }\\n}\`;
  
  const css = \`\${keyframes}\\n\\n.anim-element {\\n  animation: \${type} \${dur}s \${ease} \${inf};\\n}\`;
  document.getElementById('anim-code').textContent = css;
  
  let style = document.getElementById('dyn-anim');
  if(!style) { style = document.createElement('style'); style.id='dyn-anim'; document.head.appendChild(style); }
  style.textContent = css;
  playAnim();
}
function playAnim() {
  const box = document.getElementById('anim-box');
  const type = document.getElementById('anim-type').value;
  const dur = document.getElementById('anim-dur').value;
  const ease = document.getElementById('anim-ease').value;
  const inf = document.getElementById('anim-inf').checked ? 'infinite' : 'forwards';
  
  box.style.animation = 'none';
  void box.offsetWidth;
  box.style.animation = \`\${type} \${dur}s \${ease} \${inf}\`;
}

// ── ICON MANAGER ─────────────────────────────────────
const iconList = Object.keys(lucide.icons);
function searchIcons() {
  const q = document.getElementById('icon-search').value.toLowerCase();
  const res = iconList.filter(i => i.includes(q)).slice(0, 100);
  document.getElementById('icon-grid').innerHTML = res.map(i => \`
    <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:4px;padding:12px;display:flex;flex-direction:column;align-items:center;cursor:pointer;gap:6px" onclick="cpIcon('\${i}')" title="\${i}">
      <i data-lucide="\${i}"></i>
      <span style="font-size:9px;color:var(--text-muted);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:100%;text-align:center">\${i}</span>
    </div>\`).join('');
  lucide.createIcons();
}
function cpIcon(name) {
  const svg = document.querySelector(\`[data-lucide="\${name}"]\`).outerHTML;
  navigator.clipboard.writeText(svg).then(() => toast('Copied ' + name + ' SVG'));
}

// ── LAYOUT PLAYGROUND ────────────────────────────────
function updLayout() {
  const disp = document.getElementById('lay-disp').value;
  const dir = document.getElementById('lay-dir').value;
  const jc = document.getElementById('lay-jc').value;
  const ai = document.getElementById('lay-ai').value;
  const gap = document.getElementById('lay-gap').value;
  const cols = document.getElementById('lay-col').value;
  
  document.getElementById('lay-dir-f').style.display = disp === 'flex' ? 'block' : 'none';
  document.getElementById('lay-col-f').style.display = disp === 'grid' ? 'block' : 'none';
  
  const stage = document.getElementById('lay-stage');
  stage.style.display = disp;
  stage.style.gap = gap + 'px';
  stage.style.justifyContent = jc;
  stage.style.alignItems = ai;
  
  let css = \`.container {\\n  display: \${disp};\\n  gap: \${gap}px;\\n  justify-content: \${jc};\\n  align-items: \${ai};\\n\`;
  
  if (disp === 'flex') {
    stage.style.flexDirection = dir;
    css += \`  flex-direction: \${dir};\\n\`;
    stage.style.gridTemplateColumns = '';
  } else {
    stage.style.flexDirection = '';
    stage.style.gridTemplateColumns = cols;
    css += \`  grid-template-columns: \${cols};\\n\`;
  }
  css += \`}\`;
  document.getElementById('lay-code').textContent = css;
}
function addLayItem() {
  const stage = document.getElementById('lay-stage');
  const cnt = stage.children.length + 1;
  const d = document.createElement('div');
  d.className = 'lay-item';
  d.style.cssText = 'padding:15px;background:var(--accent);color:#fff;border-radius:4px;text-align:center';
  d.textContent = cnt;
  stage.appendChild(d);
}

// ── IMAGE OPTIMIZER ──────────────────────────────────
let optCanvas = document.createElement('canvas');
let optOriginal = null;
let optOriginalSize = 0;
function onOptUpload(e) {
  const file = e.target.files[0];
  if(!file) return;
  optOriginalSize = file.size;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      optOriginal = img;
      document.getElementById('opt-controls').style.display = 'block';
      optImage();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function optImage() {
  if(!optOriginal) return;
  optCanvas.width = optOriginal.width;
  optCanvas.height = optOriginal.height;
  const ctx = optCanvas.getContext('2d');
  ctx.drawImage(optOriginal, 0, 0);
  const q = document.getElementById('opt-qual').value / 100;
  const data = optCanvas.toDataURL('image/webp', q);
  document.getElementById('opt-prev').src = data;
  const newSize = Math.round((data.length * 3 / 4) / 1024);
  const oldSize = Math.round(optOriginalSize / 1024);
  document.getElementById('opt-stats').textContent = \`Original: \${oldSize}KB | Optimized (WebP): \${newSize}KB\`;
}
function dlOpt() {
  const q = document.getElementById('opt-qual').value / 100;
  const data = optCanvas.toDataURL('image/webp', q);
  const a = document.createElement('a');
  a.download = 'optimized.webp';
  a.href = data;
  a.click();
}

// ── DESIGN SYSTEM EXPORTER ───────────────────────────
function genSys(format) {
  const cols = [
    {n: 'bg', v: '#1E1E1E'}, {n: 'accent', v: '#0D99FF'}, {n: 'text', v: '#CCCCCC'}
  ];
  const fonts = [
    {n: 'sm', v: '0.875rem'}, {n: 'base', v: '1rem'}, {n: 'lg', v: '1.125rem'}, {n: 'xl', v: '1.25rem'}
  ];
  
  if(format === 'css') {
    let css = ':root {\\n  /* Colors */\\n';
    cols.forEach(c => css += \`  --color-\${c.n}: \${c.v};\\n\`);
    css += '\\n  /* Typography */\\n';
    fonts.forEach(f => css += \`  --text-\${f.n}: \${f.v};\\n\`);
    css += '}';
    document.getElementById('sys-code').textContent = css;
  } else {
    let tw = 'module.exports = {\\n  theme: {\\n    extend: {\\n      colors: {\\n';
    cols.forEach(c => tw += \`        \${c.n}: '\${c.v}',\\n\`);
    tw += '      },\\n      fontSize: {\\n';
    fonts.forEach(f => tw += \`        \${f.n}: '\${f.v}',\\n\`);
    tw += '      }\\n    }\\n  }\\n}';
    document.getElementById('sys-code').textContent = tw;
  }
}

// ── INIT ─────────────────────────────────────────────`;
html = html.replace('// ── INIT ─────────────────────────────────────────────', newJS);

const oldInitFuncs = `genScale();`;
const newInitFuncs = `genScale();
drawBlob();
updAnim();
searchIcons();
updLayout();`;
html = html.replace(oldInitFuncs, newInitFuncs);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully patched index.html');
