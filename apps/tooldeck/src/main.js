import { PDFDocument, degrees } from 'pdf-lib';
import QRCode from 'qrcode';
import { tools, parsePages, encode64, decode64, generatePassword, colorValues } from './core.js';
import './style.css';
const $ = id => document.getElementById(id);
let current, job = 0, urls = [];
const text = (label = 'Your text', placeholder = 'Type or paste here…') => `<label for="input">${label}</label><textarea id="input" placeholder="${placeholder}" spellcheck="false"></textarea>`;
const select = (options, label = 'Action') => `<label for="mode">${label}</label><select id="mode">${options.map(([v, name]) => `<option value="${v}">${name}</option>`).join('')}</select>`;
const number = (id, label, value, min, max) => `<label for="${id}">${label}</label><input type="number" id="${id}" value="${value}" min="${min}" max="${max}" required>`;
const file = (accept, multiple = false) => `<label class="drop-zone" for="files"><strong>Choose ${multiple ? 'files' : 'a file'}</strong><span>${multiple ? 'Select files in the desired order. ' : ''}Files stay on this device.</span><input type="file" id="files" accept="${accept}" ${multiple ? 'multiple' : ''} required></label><div id="file-names"></div>`;
const layouts = {
  json: () => text('JSON', '{ "hello": "BlueCloud" }') + select([['format','Format JSON'],['minify','Minify JSON']]),
  base64: () => text() + select([['encode','Encode'],['decode','Decode']]),
  url: () => text() + select([['encode','Encode component'],['decode','Decode component']]),
  text: () => text() + select([['count','Count words and characters'],['upper','UPPERCASE'],['lower','lowercase'],['title','Title Case'],['trim','Trim each line'],['dedupe','Remove duplicate lines']]),
  password: () => number('length','Password length',20,8,256),
  uuid: () => number('count','Number of identifiers',1,1,100),
  hash: () => file('*'),
  qr: () => text('Text or URL','https://bluecloudai.online') + number('size','Image width (pixels)',512,128,2048),
  merge: () => file('.pdf',true),
  extract: () => file('.pdf') + '<label for="pages">Page selection</label><input id="pages" placeholder="1, 3-5" required>',
  rotate: () => file('.pdf') + select([['90','90° clockwise'],['180','180°'],['270','90° counterclockwise']],'Rotation'),
  'images-pdf': () => file('.png,.jpg,.jpeg',true),
  image: () => file('.png,.jpg,.jpeg,.webp') + '<div class="input-grid">' + number('width','Maximum width (pixels)',1920,1,12000) + number('quality','JPEG / WebP quality (%)',85,1,100) + '</div>' + select([['image/webp','WebP'],['image/jpeg','JPEG'],['image/png','PNG']],'Output format') + '<p class="hint">Aspect ratio is preserved. Smaller images are not enlarged. JPEG uses a white background; PNG is lossless and ignores quality.</p>',
  color: () => '<label for="input">Hex color</label><input id="input" value="#85dfbb" required>',
  epoch: () => '<label for="input">Unix timestamp</label><input id="input" value="0" required>' + select([['seconds','Seconds'],['milliseconds','Milliseconds']],'Unit'),
};
function cleanup() { urls.forEach(u => URL.revokeObjectURL(u)); urls = []; $('preview').replaceChildren(); $('downloads').replaceChildren(); $('output').value = ''; $('output').hidden = true; $('copy').hidden = true; $('result').hidden = true; }
function choose(id) {
  job++; cleanup(); $('status').textContent = ''; $('run').disabled = false; $('cancel').hidden = true;
  current = tools.find(t => t[0] === id) || tools[0];
  $('title').textContent = current[1]; $('description').textContent = current[3]; $('category').textContent = current[2].toUpperCase() + ' / TOOLDECK'; $('counter').textContent = `${String(tools.indexOf(current)+1).padStart(2,'0')} / YOUR EVERYDAY TOOLKIT`;
  $('controls').innerHTML = layouts[current[0]]();
  $('files')?.addEventListener('change', () => { $('file-names').textContent = [...$('files').files].map(f => `${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`).join(' · '); });
  document.querySelectorAll('#tools button').forEach(b => { const active = b.dataset.id === current[0]; b.classList.toggle('active', active); if (active) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
  history.replaceState(null,'',`#${current[0]}`);
}
function renderNav() { const q = $('search').value.toLowerCase(); $('tools').replaceChildren(); for (const [id,name,group] of tools.filter(t => t.slice(1).join(' ').toLowerCase().includes(q))) { const b = document.createElement('button'); b.type = 'button'; b.dataset.id = id; b.textContent = name; b.title = group; b.classList.toggle('active',current?.[0]===id); b.addEventListener('click',() => choose(id)); $('tools').append(b); } }
function output(value) { $('result').hidden = false; $('output').hidden = false; $('output').value = value; $('copy').hidden = false; }
function download(data, name, type) { const blob = data instanceof Blob ? data : new Blob([data],{type}); const url = URL.createObjectURL(blob); urls.push(url); const a = document.createElement('a'); a.href=url; a.download=name; a.textContent=`↓ Download ${name}`; a.className='download'; $('downloads').append(a); $('result').hidden=false; return url; }
function numeric(id,min,max) { const value=Number($(id).value); if (!Number.isInteger(value)||value<min||value>max) throw Error(`Enter a whole number between ${min} and ${max}.`); return value; }
function checkedFiles() { const files=[...($('files')?.files||[])]; if(!files.length) throw Error('Choose a file first.'); if(files.some(f=>f.size>100*1024*1024)||files.reduce((n,f)=>n+f.size,0)>200*1024*1024) throw Error('Use files below 100 MB each and 200 MB in total for this alpha.'); return files; }
function tick() { return new Promise(resolve=>setTimeout(resolve,0)); }
$('form').addEventListener('submit',async event => {
  event.preventDefault(); const token=++job; const id=current[0]; cleanup(); $('run').disabled=true; $('cancel').hidden=false; $('status').textContent='Working locally…';
  const ensure=()=>{if(token!==job) throw Error('Cancelled');};
  try {
    const value=$('input')?.value||'', mode=$('mode')?.value;
    if(id==='json') output(JSON.stringify(JSON.parse(value),null,mode==='format'?2:0));
    else if(id==='base64') output(mode==='encode'?encode64(value):decode64(value));
    else if(id==='url') output(mode==='encode'?encodeURIComponent(value):decodeURIComponent(value));
    else if(id==='text') { const changes={count:()=>`Words: ${(value.trim().match(/\S+/gu)||[]).length}\nCharacters: ${[...value].length}\nLines: ${value ? value.split(/\r?\n/).length : 0}`,upper:()=>value.toUpperCase(),lower:()=>value.toLowerCase(),title:()=>value.toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase()),trim:()=>value.split(/\r?\n/).map(l=>l.trim()).join('\n'),dedupe:()=>[...new Set(value.split(/\r?\n/))].join('\n')}; output(changes[mode]()); }
    else if(id==='password') output(generatePassword(numeric('length',8,256)));
    else if(id==='uuid') output(Array.from({length:numeric('count',1,100)},()=>crypto.randomUUID()).join('\n'));
    else if(id==='color') output(colorValues(value));
    else if(id==='epoch') { if(!/^-?\d+$/.test(value.trim())) throw Error('Enter an integer timestamp.'); const n=Number(value)*(mode==='seconds'?1000:1); const date=new Date(n); if(!Number.isSafeInteger(n)||!Number.isFinite(date.getTime())) throw Error('Timestamp is outside the supported date range.'); output(`UTC: ${date.toISOString()}\nLocal: ${date.toString()}\nUnix seconds: ${Math.floor(n/1000)}`); }
    else if(id==='hash') { const [f]=checkedFiles(); const bytes=await f.arrayBuffer(); ensure(); const hash=await crypto.subtle.digest('SHA-256',bytes); ensure(); output(`${f.name}\nSHA-256\n${Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}`); }
    else if(id==='qr') { if(!value.trim()) throw Error('Enter some text or a URL.'); const url=await QRCode.toDataURL(value,{width:numeric('size',128,2048),margin:3,errorCorrectionLevel:'M'}); ensure(); const response=await fetch(url); const blob=await response.blob(); ensure(); const img=document.createElement('img'); img.alt='Generated QR code'; img.src=download(blob,'tooldeck-qr.png'); $('preview').append(img); }
    else if(id==='image') { const [f]=checkedFiles(); const width=numeric('width',1,12000), quality=numeric('quality',1,100)/100; const bitmap=await createImageBitmap(f); try { ensure(); if(bitmap.width*bitmap.height>50000000) throw Error('Use an image below 50 megapixels.'); const scale=Math.min(1,width/bitmap.width); const canvas=document.createElement('canvas'); canvas.width=Math.max(1,Math.round(bitmap.width*scale)); canvas.height=Math.max(1,Math.round(bitmap.height*scale)); const ctx=canvas.getContext('2d'); if(mode==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);} ctx.drawImage(bitmap,0,0,canvas.width,canvas.height); const blob=await new Promise(r=>canvas.toBlob(r,mode,quality)); ensure(); if(!blob) throw Error('This image format is unavailable.'); const extension=blob.type.split('/')[1].replace('jpeg','jpg'); const url=download(blob,`${f.name.replace(/\.[^.]+$/,'')}-${canvas.width}.${extension}`); const img=document.createElement('img');img.alt='Converted image';img.src=url;$('preview').append(img); output(`${bitmap.width} × ${bitmap.height} → ${canvas.width} × ${canvas.height}\n${(f.size/1024).toFixed(1)} KB → ${(blob.size/1024).toFixed(1)} KB`); } finally {bitmap.close();} }
    else {
      const files=checkedFiles(); if(id==='merge'&&files.length<2) throw Error('Select at least two PDFs.'); const result=await PDFDocument.create();
      for(let i=0;i<files.length;i++) { ensure(); $('status').textContent=`Processing file ${i+1} of ${files.length}…`; await tick(); const bytes=await files[i].arrayBuffer();ensure();
        if(id==='images-pdf') { const isPng=bytes.byteLength>4&&new Uint8Array(bytes)[0]===137; const image=await (isPng?result.embedPng(bytes):result.embedJpg(bytes)); const page=result.addPage([image.width,image.height]);page.drawImage(image,{x:0,y:0,width:image.width,height:image.height}); }
        else { const doc=await PDFDocument.load(bytes);ensure(); if(doc.getPageCount()>2000) throw Error('This alpha supports up to 2,000 pages per PDF.'); const indices=id==='extract'?parsePages($('pages').value,doc.getPageCount()):doc.getPageIndices(); const pages=await result.copyPages(doc,indices); for(const page of pages) { if(id==='rotate') page.setRotation(degrees((page.getRotation().angle+Number(mode))%360));result.addPage(page); } }
      }
      const bytes=await result.save();ensure();download(bytes,`tooldeck-${id}.pdf`,'application/pdf');output(`${result.getPageCount()} pages · ${(bytes.length/1024).toFixed(1)} KB\nPDF created locally. Interactive forms, bookmarks and digital signatures may not be preserved when copying pages.`);
    }
    ensure(); $('status').textContent='Done. Your files stayed on this device.';
  } catch(error) {if(token===job){cleanup();$('status').textContent=error.message||'Could not process this file.';}}
  finally {if(token===job){$('run').disabled=false;$('cancel').hidden=true;}}
});
$('search').addEventListener('input',renderNav);
$('cancel').addEventListener('click',()=>{job++;cleanup();$('status').textContent='Cancelled. No result was saved.';$('run').disabled=false;$('cancel').hidden=true;});
$('reset').addEventListener('click',()=>choose(current[0]));
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('output').value);$('status').textContent='Copied.';}catch{$('status').textContent='Select the result and copy it with your keyboard.';}});
renderNav();choose(location.hash.slice(1)||'json');
