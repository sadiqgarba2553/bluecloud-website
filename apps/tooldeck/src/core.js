export const tools = [
  ['json','JSON formatter','Developer','Format, validate or minify JSON.'],
  ['base64','Base64 text','Developer','Encode or decode UTF-8 text.'],
  ['url','URL encoder','Developer','Encode or decode a URL component.'],
  ['text','Text utilities','Text','Count words and characters, change case or trim lines.'],
  ['password','Password generator','Security','Generate random passwords with your device’s cryptographic random source.'],
  ['uuid','UUID generator','Developer','Generate UUID v4 identifiers locally.'],
  ['hash','File hash','Security','Calculate a SHA-256 fingerprint of a local file.'],
  ['qr','QR code','Utilities','Create a downloadable PNG QR code for text or a link.'],
  ['merge','Merge PDFs','PDF','Combine PDF files in the order you select them.'],
  ['extract','Extract PDF pages','PDF','Save a selection of PDF pages into a new file.'],
  ['rotate','Rotate PDF','PDF','Rotate all pages in a PDF.'],
  ['images-pdf','Images to PDF','PDF','Place each PNG or JPEG on its own PDF page.'],
  ['image','Image studio','Image','Resize, convert and compress PNG, JPEG or WebP images.'],
  ['color','Color converter','Developer','Convert a hexadecimal color to RGB and HSL.'],
  ['epoch','Timestamp converter','Developer','Convert Unix seconds or milliseconds into a readable date.'],
];
export function parsePages(input, total) {
  if (!Number.isInteger(total) || total < 1) throw Error('This PDF has no pages.');
  if (!input.trim()) throw Error('Enter pages, for example 1, 3-5.');
  const pages = [];
  for (const part of input.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw Error('Use page numbers and ranges such as 1, 3-5.');
    const first = Number(match[1]), last = Number(match[2] || first);
    if (first < 1 || last > total || first > last) throw Error(`Pages must be between 1 and ${total}, in ascending ranges.`);
    for (let i = first; i <= last; i++) if (!pages.includes(i - 1)) pages.push(i - 1);
  }
  return pages;
}
export function encode64(text) { return btoa(Array.from(new TextEncoder().encode(text), n => String.fromCharCode(n)).join('')); }
export function decode64(text) { return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(text.trim()), c => c.charCodeAt(0))); }
export function generatePassword(length, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*-_=+') {
  if (!Number.isInteger(length) || length < 8 || length > 256) throw Error('Choose a password length between 8 and 256.');
  let result = ''; const max = 256 - (256 % alphabet.length);
  while (result.length < length) { const bytes = crypto.getRandomValues(new Uint8Array(length * 2)); for (const n of bytes) if (n < max && result.length < length) result += alphabet[n % alphabet.length]; }
  return result;
}
export function colorValues(input) {
  let hex = input.trim().replace(/^#/, '');
  if (/^[a-f\d]{3}$/i.test(hex)) hex = [...hex].map(c => c + c).join('');
  if (!/^[a-f\d]{6}$/i.test(hex)) throw Error('Enter a three- or six-digit hex color.');
  const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  const [r, g, b] = rgb.map(v => v / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min, light = (max + min) / 2;
  let hue = delta === 0 ? 0 : max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  hue = (Math.round(hue * 60) + 360) % 360;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
  return `#${hex.toUpperCase()}\nrgb(${rgb.join(', ')})\nhsl(${hue}, ${Math.round(saturation * 100)}%, ${Math.round(light * 100)}%)`;
}
