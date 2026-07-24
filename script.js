// =====================================================
// Vebhav Sharma — Portfolio interactions
// Vanilla JS only, no dependencies.
// =====================================================

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------
   Mobile nav toggle
--------------------------------------------------- */
(function navToggle(){
  const btn = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  if(!btn || !list) return;

  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      list.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---------------------------------------------------
   Hero terminal — typewriter effect
--------------------------------------------------- */
(function terminalTyper(){
  const el = document.getElementById('terminalCode');
  const cursor = document.getElementById('terminalCursor');
  if(!el) return;

  const lines = [
    { text: '$ curl -s https://api.vebhav.dev/v1/profile | jq', cls: 'cmd', pause: 400 },
    { text: '', cls: '', pause: 150 },
    { text: '{', cls: 'muted', pause: 60 },
    { text: '  "name": "Vebhav Sharma",', cls: '', pause: 40 },
    { text: '  "role": "Backend Developer, AI Engineer",', cls: '', pause: 40 },
    { text: '  "location": "Greater Noida, IN",', cls: '', pause: 40 },
    { text: '  "stack": ["FastAPI","Django","PostgreSQL","LangChain"],', cls: '', pause: 40 },
    { text: '  "leetcode_solved": 300,', cls: '', pause: 40 },
    { text: '  "status": 200', cls: '', pause: 40 },
    { text: '}', cls: 'muted', pause: 0 },
  ];

  // Build colorized HTML for a JSON-ish line
  function colorize(raw){
    if(raw.startsWith('$')){
      return `<span class="cmd">${escapeHtml(raw)}</span>`;
    }
    if(raw === '{' || raw === '}'){
      return `<span class="muted">${raw}</span>`;
    }
    const m = raw.match(/^(\s*)"(.+?)":\s*(.+?)(,?)$/);
    if(m){
      const [, indent, key, val, comma] = m;
      return `${indent}<span class="k">"${escapeHtml(key)}"</span><span class="muted">: </span><span class="${valClass(val)}">${escapeHtml(val)}</span><span class="muted">${comma}</span>`;
    }
    return escapeHtml(raw);
  }

  function valClass(val){
    if(/^\d/.test(val)) return 'n';
    if(val.startsWith('"') || val.startsWith('[')) return 's';
    return '';
  }

  function escapeHtml(str){
    return str.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  if(reduceMotion){
    el.innerHTML = lines.map(l => colorize(l.text)).join('\n');
    return;
  }

  let li = 0, ci = 0;
  let buffer = [];

  function typeNext(){
    if(li >= lines.length){
      // finished — blink cursor at end (default CSS animation), then loop after a long pause
      setTimeout(() => {
        buffer = [];
        li = 0; ci = 0;
        el.innerHTML = '';
        typeNext();
      }, 5000);
      return;
    }

    const line = lines[li];
    if(ci === 0) buffer.push('');

    if(ci <= line.text.length){
      buffer[li] = line.text.slice(0, ci);
      el.innerHTML = buffer.map(colorize).join('\n');
      ci++;
      setTimeout(typeNext, line.text.startsWith('$') ? 22 : 10);
    } else {
      li++; ci = 0;
      setTimeout(typeNext, line.pause);
    }
  }

  typeNext();
})();

/* ---------------------------------------------------
   Background node graph (subtle, canvas)
--------------------------------------------------- */
(function nodeGraph(){
  const canvas = document.getElementById('net-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, nodes = [];
  const DENSITY = 22000; // px^2 per node
  const LINK_DIST = 150;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((w * h) / DENSITY));
    nodes = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));
  }

  function step(){
    ctx.clearRect(0, 0, w, h);

    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }

    for(let i = 0; i < nodes.length; i++){
      for(let j = i + 1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < LINK_DIST){
          ctx.strokeStyle = `rgba(87, 232, 207, ${0.10 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for(const n of nodes){
      ctx.fillStyle = 'rgba(87, 232, 207, 0.45)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if(!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);

  if(reduceMotion){
    step(); // draw a single static frame
  } else {
    requestAnimationFrame(step);
  }
})();

/* ---------------------------------------------------
   Copy email to clipboard
--------------------------------------------------- */
(function copyEmail(){
  const btn = document.getElementById('copyEmail');
  if(!btn) return;
  const hint = btn.querySelector('.copy-hint');

  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    try{
      await navigator.clipboard.writeText(email);
      if(hint){
        const original = hint.textContent;
        hint.textContent = 'copied!';
        hint.style.opacity = '1';
        setTimeout(() => {
          hint.textContent = original;
          hint.style.opacity = '';
        }, 1800);
      }
    }catch(err){
      window.location.href = `mailto:${email}`;
    }
  });
})();

/* ---------------------------------------------------
   Contact form — AJAX submit with graceful fallback
--------------------------------------------------- */
(function contactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending…';
    note.textContent = '';

    const data = new FormData(form);

    try{
      const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });
      if(!res.ok) throw new Error('Request failed');
      note.textContent = '200 OK — message sent. I\'ll reply soon.';
      form.reset();
    }catch(err){
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const message = data.get('message') || '';
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:vebhavsharma2006@gmail.com?subject=${subject}&body=${body}`;
      note.textContent = 'Opening your email client instead…';
    }finally{
      btn.disabled = false;
      btn.innerHTML = original;
    }
  });
})();
