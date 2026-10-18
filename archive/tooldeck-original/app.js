/* TOOLDECK — app.js */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function(id) { return document.getElementById(id); };

  // Theme
  var saved = localStorage.getItem('td-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  var themeToggle = $('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', n);
      localStorage.setItem('td-theme', n);
    });
  }

  // Dropdowns
  var items = document.querySelectorAll('.nav-item');
  var cur = null, tid = null;
  var open = function(el) { 
    clearTimeout(tid); 
    if (cur) cur.classList.remove('active'); 
    el.classList.add('active'); 
    cur = el; 
  };
  var close = function(el, d) { 
    clearTimeout(tid); 
    tid = setTimeout(function() { 
      el.classList.remove('active'); 
      if (cur === el) cur = null; 
    }, d || 100); 
  };

  items.forEach(function(el) {
    el.addEventListener('mouseenter', function() { open(el); });
    el.addEventListener('mouseleave', function() { close(el); });
    var panel = el.querySelector('.panel');
    if (panel) {
      panel.addEventListener('mouseenter', function() { clearTimeout(tid); });
      panel.addEventListener('mouseleave', function() { close(el); });
    }
    var navBtn = el.querySelector('.nav-btn');
    if (navBtn) {
      navBtn.addEventListener('click', function(e) { 
        e.stopPropagation(); 
        if (el.classList.contains('active')) { close(el, 0); } else { open(el); }
      });
    }
  });

  document.addEventListener('click', function() { 
    if (cur) cur.classList.remove('active'); 
    cur = null; 
  });
  document.addEventListener('keydown', function(e) { 
    if (e.key === 'Escape') { 
      if (cur) cur.classList.remove('active'); 
      cur = null; 
    } 
  });

  // Mobile
  var ham = $('hamburger'), mob = $('mobile-drawer');
  if (ham) {
    ham.addEventListener('click', function() { 
      var o = false;
      if (mob) { o = mob.classList.toggle('open'); }
      ham.classList.toggle('open', o); 
    });
  }

  // Search focus
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
      e.preventDefault(); 
      var searchInput = $('search-input');
      if (searchInput) searchInput.focus(); 
    }
  });

  // Search
  var tools = [
    'Merge PDF','Split PDF','Compress PDF','JPG to PDF','Word to PDF','PPT to PDF','Excel to PDF','HTML to PDF',
    'PDF to JPG','PDF to Word','PDF to PPT','PDF to Excel','PDF to PDF/A',
    'Rotate PDF','Watermark PDF','Page Numbers','Organize PDF','Crop PDF','Redact PDF',
    'Protect PDF','Unlock PDF','Sign PDF', 'OCR PDF', 'Scan to PDF', 'Repair PDF', 'Compare PDF', 'Flatten PDF',
    'Compress PNG', 'Compress JPG', 'Compress WebP', 'PNG to WebP', 'JPG to WebP', 'PNG to JPG', 'WebP to PNG',
    'SVG to PNG', 'Image to ICO', 'Crop Image', 'Resize Image', 'Rotate & Flip', 'Watermark Image', 'Remove BG',
    'Lorem Ipsum', 'Word Counter', 'Case Converter', 'Text Diff', 'MD to HTML', 'Base64 Text',
    'QR Generator', 'Password Gen', 'Hash Generator', 'Color Picker', 'UUID Generator',
    'JSON Formatter', 'Regex Tester', 'Code Minify', 'Epoch Converter', 'URL Encode'
  ];

  var getToolUrl = function(name) {
    if (name === 'Base64 Text') return 'tools/base64-encode.html';
    if (name === 'MD to HTML') return 'tools/markdown-html.html';
    if (name === 'Password Gen') return 'tools/password-gen.html';
    return 'tools/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
  };

  var inp = $('search-input'), res = $('search-results');
  if (inp) {
    inp.addEventListener('input', function() {
      var q = inp.value.trim().toLowerCase();
      if (!q) { if (res) res.classList.remove('visible'); return; }
      var m = tools.filter(function(t) { return t.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
      if (!m.length) { if (res) res.classList.remove('visible'); return; }
      if (res) {
        res.innerHTML = m.map(function(t) {
          var i = t.toLowerCase().indexOf(q);
          var h = t.slice(0, i) + '<mark style="background:rgba(91,92,244,.2);color:inherit;border-radius:2px">' + t.slice(i, i + q.length) + '</mark>' + t.slice(i + q.length);
          return '<a href="' + getToolUrl(t) + '" class="panel-link" style="padding:7px 8px"><div><b>' + h + '</b></div></a>';
        }).join('');
        res.classList.add('visible');
      }
    });
    inp.addEventListener('blur', function() { 
      setTimeout(function() { if (res) res.classList.remove('visible'); }, 140); 
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      if (a.getAttribute('href') === '#') return;
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { 
        e.preventDefault(); 
        t.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        if (mob) mob.classList.remove('open'); 
        if (ham) ham.classList.remove('open'); 
      }
    });
  });

})();
