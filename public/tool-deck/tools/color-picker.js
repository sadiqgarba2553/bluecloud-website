document.addEventListener('DOMContentLoaded', () => {
  const cpInput = document.getElementById('cp-input');
  const cpDisplay = document.getElementById('cp-display');
  const valHex = document.getElementById('val-hex');
  const valRgb = document.getElementById('val-rgb');
  const valHsl = document.getElementById('val-hsl');

  function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function updateColor(hex) {
    cpDisplay.style.backgroundColor = hex;
    cpInput.value = hex;
    valHex.value = hex.toUpperCase();

    const rgb = hexToRgb(hex);
    if (rgb) {
      valRgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      valHsl.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
  }

  cpInput.addEventListener('input', (e) => {
    updateColor(e.target.value);
  });

  // Init
  updateColor(cpInput.value);

  window.copyColor = async function(id) {
    const el = document.getElementById(id);
    const text = el.value;
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        const btn = el.nextElementSibling;
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => btn.innerHTML = orig, 1000);
      } catch (e) {
        alert('Failed to copy');
      }
    }
  };

  // Basic input handlers to parse external changes
  valHex.addEventListener('change', (e) => {
    let hex = e.target.value;
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      updateColor(hex);
    }
  });
});
