/* =========================================================
   Vebhav Sharma — Portfolio
   Design concept: "API console" — the site presents itself
   as a live backend service: routes, JSON responses, status
   codes. Grounded in the subject's actual profession.
   ========================================================= */

:root{
  /* --- color tokens --- */
  --bg:        #0A0E15;
  --bg-alt:    #0D131C;
  --surface:   #121826;
  --surface-2: #161E2E;
  --border:    #232C3D;
  --border-soft: #1A2231;

  --text:       #E9EEF5;
  --text-dim:   #8A96AB;
  --text-dimmer:#54607A;

  --accent:     #57E8CF;   /* cyan/teal — primary */
  --accent-dim: #2E7A6E;
  --accent-2:   #FFB454;   /* amber — secondary / warn */
  --accent-3:   #C7A6FF;   /* violet — POST / keys */
  --accent-4:   #FF8A80;   /* soft red — PUT/alt method */
  --ok:         #4ADE80;

  /* --- type tokens --- */
  --font-display: 'Space Grotesk', 'Segoe UI', sans-serif;
  --font-body:    'Inter', 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;

  --radius: 10px;
  --radius-sm: 6px;

  --wrap: 1120px;
}

*, *::before, *::after{ box-sizing: border-box; }

html{
  scroll-behavior: smooth;
  scrollbar-color: var(--border) var(--bg);
}
@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior: auto; }
  *, *::before, *::after{
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

body{
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

::selection{ background: var(--accent); color: #05100E; }

a{ color: inherit; text-decoration: none; }

.sr-only{
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

.skip-link{
  position: absolute; left: 12px; top: -60px;
  background: var(--accent); color: #05100E;
  padding: 10px 16px; border-radius: var(--radius-sm);
  font-family: var(--font-mono); font-size: 13px; font-weight: 600;
  z-index: 999; transition: top .2s ease;
}
.skip-link:focus{ top: 12px; }

:focus-visible{
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 3px;
}

.wrap{
  max-width: var(--wrap);
  margin: 0 auto;
  padding: 0 28px;
}

/* --- background canvas (subtle node graph) --- */
#net-bg{
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  z-index: 0;
  opacity: .5;
  pointer-events: none;
}

header, main, footer{ position: relative; z-index: 1; }

/* =========================================================
   Reusable bits: routes, methods, status, buttons, chips
   ========================================================= */

.method{
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
}
.method-get{ color: var(--accent); background: rgba(87,232,207,.10); }
.method-post{ color: var(--accent-3); background: rgba(199,166,255,.10); }
.method-put{ color: var(--accent-2); background: rgba(255,180,84,.10); }

.route{
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-dim);
  display: flex; align-items: center; gap: 10px;
  margin: 0 0 14px;
  flex-wrap: wrap;
}
.route .path{ color: var(--text); }
.route .http-ver{ color: var(--text-dimmer); }
.http-status{
  margin-left: auto;
  color: var(--ok);
  font-size: 12px;
}

.section-title{
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.01em;
  margin: 0 0 40px;
}

.btn{
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 14px; font-weight: 500;
  padding: 12px 22px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, color .15s ease;
}
.btn:hover{ transform: translateY(-2px); }
.btn-solid{
  background: var(--accent); color: #05100E; font-weight: 600;
}
.btn-solid:hover{ background: #78F0DC; }
.btn-outline{
  border-color: var(--border); color: var(--text);
}
.btn-outline:hover{ border-color: var(--accent); color: var(--accent); }
.btn-ghost{
  border-color: var(--border-soft); color: var(--text-dim);
  font-size: 13px; padding: 9px 16px;
}
.btn-ghost:hover{ border-color: var(--accent); color: var(--accent); }
.btn-wide{ width: 100%; justify-content: center; }

.status-dot{
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ok);
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(74,222,128,.15);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse{
  0%,100%{ box-shadow: 0 0 0 3px rgba(74,222,128,.15); }
  50%{ box-shadow: 0 0 0 6px rgba(74,222,128,.06); }
}

/* =========================================================
   Header / Nav
   ========================================================= */
.site-header{
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(10,14,21,.72);
  border-bottom: 1px solid var(--border-soft);
}
.header-inner{
  display: flex; align-items: center; justify-content: space-between;
  height: 68px;
}
.logo{
  font-family: var(--font-mono);
  font-size: 17px; font-weight: 600;
  color: var(--text);
  display: flex; align-items: center;
}
.logo-bracket{ color: var(--accent); }
.logo-blink{
  color: var(--accent);
  animation: blink 1.1s step-end infinite;
}
@keyframes blink{ 50%{ opacity: 0; } }

.nav-list{
  list-style: none;
  display: flex; gap: 30px;
  margin: 0; padding: 0;
  font-family: var(--font-mono);
  font-size: 14px;
}
.nav-list a{
  color: var(--text-dim);
  transition: color .15s ease;
}
.nav-list a:hover{ color: var(--accent); }
.nav-dim{ color: var(--text-dimmer); margin-right: 3px; }

.nav-toggle{
  display: none;
  flex-direction: column; justify-content: center; gap: 5px;
  width: 34px; height: 34px;
  background: none; border: 1px solid var(--border); border-radius: 6px;
  cursor: pointer;
}
.nav-toggle span{
  width: 16px; height: 2px; background: var(--text-dim); margin: 0 auto;
  transition: transform .2s ease, opacity .2s ease;
}

.header-cta{ white-space: nowrap; }

/* =========================================================
   Hero
   ========================================================= */
.hero{
  padding: 76px 0 60px;
  min-height: calc(100vh - 68px);
  display: flex; flex-direction: column; justify-content: center;
}
.hero-grid{
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 64px;
  align-items: center;
}

.eyebrow{
  font-family: var(--font-mono);
  font-size: 13px; color: var(--text-dim);
  display: flex; align-items: center; gap: 9px;
  margin: 0 0 22px;
}

.hero-title{
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(46px, 7vw, 84px);
  line-height: .98;
  letter-spacing: -0.02em;
  margin: 0 0 18px;
}

.hero-role{
  font-family: var(--font-mono);
  font-size: clamp(15px, 1.6vw, 18px);
  color: var(--accent);
  margin: 0 0 22px;
}
.dot-sep{ color: var(--text-dimmer); margin: 0 2px; }

.hero-desc{
  color: var(--text-dim);
  font-size: 16px;
  max-width: 46ch;
  margin: 0 0 34px;
}

.hero-actions{
  display: flex; gap: 14px; flex-wrap: wrap;
  margin-bottom: 40px;
}

.hero-social{
  list-style: none; display: flex; gap: 22px;
  margin: 0; padding: 0;
  font-family: var(--font-mono); font-size: 13px;
}
.hero-social a{ color: var(--text-dim); border-bottom: 1px solid transparent; padding-bottom: 2px; }
.hero-social a:hover{ color: var(--accent); border-color: var(--accent); }

/* --- terminal --- */
.hero-terminal{ position: relative; }
.terminal-window{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 30px 80px -30px rgba(0,0,0,.6);
  position: relative; z-index: 1;
}
.terminal-bar{
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.dot{ width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-r{ background: #FF6159; }
.dot-y{ background: #FFBD2E; }
.dot-g{ background: #28C840; }
.terminal-title{
  margin-left: 8px;
  font-family: var(--font-mono); font-size: 12px; color: var(--text-dimmer);
}
.terminal-body{
  margin: 0;
  padding: 22px 20px 26px;
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-dim);
  min-height: 300px;
  white-space: pre-wrap;
  word-break: break-word;
}
.terminal-body .k{ color: var(--accent-3); }
.terminal-body .s{ color: var(--accent); }
.terminal-body .n{ color: var(--accent-2); }
.terminal-body .cmd{ color: var(--text); }
.terminal-body .muted{ color: var(--text-dimmer); }
.cursor{
  color: var(--accent);
  animation: blink 1s step-end infinite;
}
.terminal-glow{
  position: absolute; inset: -40px;
  background: radial-gradient(circle at 60% 30%, rgba(87,232,207,.14), transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.scroll-cue{
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  margin: 40px auto 0;
  font-family: var(--font-mono); font-size: 11px; color: var(--text-dimmer);
  letter-spacing: .1em; text-transform: uppercase;
}
.scroll-line{
  width: 1px; height: 34px;
  background: linear-gradient(var(--accent), transparent);
}

/* =========================================================
   Sections (generic)
   ========================================================= */
.section{ padding: 110px 0; border-top: 1px solid var(--border-soft); }
.section-alt{ background: var(--bg-alt); }

/* --- about --- */
.about-grid{
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 56px;
  align-items: start;
}
.about-text{
  font-size: 18px;
  color: var(--text-dim);
  max-width: 62ch;
}
.about-text strong{ color: var(--text); font-weight: 600; }

.about-stats{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin: 0;
}
.stat{
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  background: var(--surface);
}
.stat dt{
  font-family: var(--font-mono);
  font-size: 11.5px; color: var(--text-dimmer);
  text-transform: uppercase; letter-spacing: .06em;
  margin-bottom: 8px;
}
.stat dd{
  margin: 0;
  font-family: var(--font-display);
  font-size: 30px; font-weight: 600; color: var(--accent);
}
.stat-plus{ color: var(--accent-2); }

/* --- skills --- */
.skills-panel{
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}
.skills-panel-head{
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.skills-body{ padding: 26px 26px 10px; }

.skill-row{
  display: grid;
  grid-template-columns: 150px 12px 1fr;
  gap: 4px;
  padding: 14px 0;
  border-bottom: 1px dashed var(--border-soft);
  align-items: baseline;
}
.skill-row:last-child{ border-bottom: none; }
.skill-key{
  font-family: var(--font-mono); font-size: 13.5px; color: var(--accent-3);
}
.skill-colon{ color: var(--text-dimmer); }

.chip-list{ display: flex; flex-wrap: wrap; gap: 8px; }
.chip{
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-dim);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 5px 12px;
  white-space: nowrap;
}
.chip-accent{
  color: var(--accent);
  border-color: var(--accent-dim);
  background: rgba(87,232,207,.06);
}

/* --- projects --- */
.project-list{
  display: grid;
  gap: 22px;
}
.project-card{
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 30px 32px;
  transition: border-color .2s ease, transform .2s ease;
}
.project-card:hover{ border-color: var(--accent-dim); transform: translateY(-3px); }

.project-head{
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-bottom: 16px;
}
.project-endpoint{
  font-family: var(--font-mono); font-size: 13px; color: var(--text-dim);
}
.project-status{
  margin-left: auto;
  font-family: var(--font-mono); font-size: 11px;
  color: var(--ok);
  border: 1px solid rgba(74,222,128,.3);
  background: rgba(74,222,128,.08);
  padding: 3px 10px;
  border-radius: 20px;
}
.project-status-live{
  color: var(--accent-2);
  border-color: rgba(255,180,84,.3);
  background: rgba(255,180,84,.08);
}

.project-title{
  font-family: var(--font-display);
  font-size: 22px; font-weight: 600;
  margin: 0 0 6px;
}
.project-role{
  font-family: var(--font-mono);
  font-size: 12.5px; color: var(--text-dimmer);
  margin: 0 0 18px;
}
.project-points{
  margin: 0 0 20px; padding-left: 20px;
  color: var(--text-dim);
  font-size: 15px;
}
.project-points li{ margin-bottom: 8px; }
.project-points li::marker{ color: var(--accent); }

.project-tags{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.tag{
  font-family: var(--font-mono); font-size: 11.5px;
  color: var(--accent-3);
  background: rgba(199,166,255,.08);
  border: 1px solid rgba(199,166,255,.2);
  padding: 4px 10px; border-radius: 4px;
}

.project-link{
  font-family: var(--font-mono); font-size: 13.5px;
  color: var(--accent);
  border-bottom: 1px solid var(--accent-dim);
  padding-bottom: 2px;
}
.project-link:hover{ border-color: var(--accent); }

/* --- credentials --- */
.credentials-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}
.cred-heading{
  font-family: var(--font-mono);
  font-size: 13px; text-transform: uppercase; letter-spacing: .08em;
  color: var(--text-dimmer);
  margin: 0 0 22px;
}
.log-list{ list-style: none; margin: 0; padding: 0; }
.log-row{
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0;
  border-bottom: 1px dashed var(--border-soft);
  font-size: 15px; color: var(--text-dim);
}
.log-row:last-child{ border-bottom: none; }
.log-tag{
  font-family: var(--font-mono); font-size: 10.5px;
  color: var(--accent-2);
  border: 1px solid rgba(255,180,84,.3);
  padding: 3px 8px; border-radius: 4px;
  white-space: nowrap;
  min-width: 76px; text-align: center;
}
.log-text{ color: var(--text); }

.edu-card{
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 20px 22px;
  margin-bottom: 18px;
}
.edu-school{ font-family: var(--font-display); font-weight: 600; font-size: 17px; margin: 0 0 4px; }
.edu-degree{ color: var(--text-dim); font-size: 14px; margin: 0 0 14px; }
.edu-meta{
  display: flex; gap: 20px; flex-wrap: wrap;
  font-family: var(--font-mono); font-size: 12.5px; color: var(--text-dimmer);
}
.edu-meta strong{ color: var(--accent); font-weight: 600; }

/* --- contact --- */
.contact-lead{
  color: var(--text-dim); font-size: 17px;
  max-width: 58ch; margin: -20px 0 46px;
}
.contact-grid{
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 50px;
}
.contact-form{
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 30px;
}
.field{ margin-bottom: 20px; }
.field label{
  display: block;
  font-family: var(--font-mono); font-size: 12.5px; color: var(--accent-3);
  margin-bottom: 8px;
}
.field input, .field textarea{
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 14.5px;
  padding: 12px 14px;
  resize: vertical;
  transition: border-color .15s ease;
}
.field input:focus, .field textarea:focus{
  border-color: var(--accent);
  outline: none;
}
.field input::placeholder, .field textarea::placeholder{ color: var(--text-dimmer); }

.form-note{
  font-family: var(--font-mono); font-size: 12.5px;
  color: var(--accent); margin: 14px 0 0; min-height: 16px;
}

.contact-info{ display: flex; flex-direction: column; gap: 0; }
.info-row{
  padding: 18px 0;
  border-bottom: 1px dashed var(--border-soft);
  display: flex; flex-direction: column; gap: 6px;
}
.info-label{
  font-family: var(--font-mono); font-size: 11.5px;
  color: var(--text-dimmer); text-transform: uppercase; letter-spacing: .08em;
}
.info-value{ font-size: 15.5px; color: var(--text); }
.info-copy{
  background: none; border: none; color: var(--text);
  font-family: var(--font-body); font-size: 15.5px;
  text-align: left; cursor: pointer; padding: 0;
  display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
}
.copy-hint{
  font-family: var(--font-mono); font-size: 11px; color: var(--accent);
  opacity: .0; transition: opacity .15s ease;
}
.info-copy:hover .copy-hint{ opacity: 1; }
.link-stack{ display: flex; flex-direction: column; gap: 6px; }
.link-stack a{ color: var(--accent); font-family: var(--font-mono); font-size: 13.5px; }
.link-stack a:hover{ text-decoration: underline; }

.status-block{
  margin-top: 24px;
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-mono); font-size: 13px; color: var(--text-dim);
}

/* =========================================================
   Footer
   ========================================================= */
.site-footer{
  border-top: 1px solid var(--border-soft);
  padding: 30px 0 44px;
}
.footer-inner{
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 10px;
  font-family: var(--font-mono); font-size: 12.5px; color: var(--text-dimmer);
}
.footer-status .method{ margin-right: 4px; }
.footer-status .http-status{ margin-left: 6px; color: var(--ok); }

/* =========================================================
   Responsive
   ========================================================= */
@media (max-width: 980px){
  .hero-grid{ grid-template-columns: 1fr; gap: 48px; }
  .hero{ padding-top: 56px; }
  .about-grid{ grid-template-columns: 1fr; }
  .about-stats{ grid-template-columns: repeat(4,1fr); }
  .credentials-grid{ grid-template-columns: 1fr; gap: 46px; }
  .contact-grid{ grid-template-columns: 1fr; }
}

@media (max-width: 760px){
  .nav-toggle{ display: flex; }
  .nav-list{
    position: absolute; top: 68px; left: 0; right: 0;
    flex-direction: column; gap: 0;
    background: var(--bg-alt);
    border-bottom: 1px solid var(--border-soft);
    max-height: 0; overflow: hidden;
    transition: max-height .25s ease;
  }
  .nav-list.open{ max-height: 320px; }
  .nav-list li{ border-top: 1px solid var(--border-soft); }
  .nav-list a{ display: block; padding: 16px 28px; }
  .header-cta{ display: none; }
  .about-stats{ grid-template-columns: 1fr 1fr; }
  .section{ padding: 76px 0; }
}

@media (max-width: 560px){
  .wrap{ padding: 0 20px; }
  .hero-title{ font-size: 15vw; }
  .skill-row{ grid-template-columns: 1fr; }
  .skill-colon{ display: none; }
  .project-card{ padding: 24px 22px; }
  .terminal-body{ font-size: 12.5px; min-height: 260px; }
}
