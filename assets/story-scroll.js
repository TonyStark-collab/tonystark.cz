/* Tony's story: native page scroll, one canvas, semantic HTML chapters. */
(() => {
  'use strict';
  const canvas = document.getElementById('story-world');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  const sections = [...document.querySelectorAll('.chapter')];
  const copies = sections.map(section => section.querySelector('.copy'));
  const nav = document.querySelector('.scene-nav');
  const dots = [...nav.querySelectorAll('a')];
  const menu = document.querySelector('.chapters');
  const toggle = document.getElementById('reader-toggle');
  const progress = document.querySelector('.story-progress');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const media = {};
  const sources = {
    garden: '/assets/story/world-0.webp',
    leaf: '/assets/story/world-1.webp',
    board: '/assets/story/world-2.webp',
    crt: '/assets/story/world-3.webp',
    cpu: '/assets/archiv/cpu-full.webp',
    gpu: '/assets/archiv/geforce-full.webp',
    day: '/assets/mor-2026-day.jpg',
    night: '/assets/mor-2026-night.jpg',
    paper: '/assets/paper-texture.webp'
  };
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const phase = (a, b, x) => ease((x - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  let W = innerWidth, H = innerHeight, dpr = 1, ready = false, enabled = false;
  let bounds = [], active = -1, raf = 0, userReader = reduced.matches;
  try { const choice = localStorage.getItem('tony-story-reader'); if (choice !== null) userReader = choice === 'true'; } catch (_) { /* Storage is optional. */ }

  function image(name) {
    return new Promise(resolve => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { media[name] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = sources[name];
    });
  }
  function paper() {
    ctx.fillStyle = '#eee5d3'; ctx.fillRect(0, 0, W, H);
    if (media.paper) { ctx.save(); ctx.globalAlpha = .14; ctx.drawImage(media.paper, 0, 0, W, H); ctx.restore(); }
  }
  function cover(name, zoom = 1, fx = .5, fy = .5, angle = 0, alpha = 1) {
    const img = media[name]; if (!img || alpha <= 0) return;
    const size = Math.max(W / img.width, H / img.height) * zoom;
    const w = img.width * size, h = img.height * size;
    // Clamp the focal point so no uncovered edge is exposed on portrait screens.
    const x = Math.max(W - w, Math.min(0, W / 2 - w * fx));
    const y = Math.max(H - h, Math.min(0, H / 2 - h * fy));
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(W / 2, H / 2); ctx.rotate(angle);
    ctx.drawImage(img, x - W / 2, y - H / 2, w, h); ctx.restore();
  }
  function leaf(x, y, size, angle, alpha) {
    if (!media.leaf) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(angle); ctx.beginPath();
    ctx.moveTo(0, -size / 2); ctx.bezierCurveTo(size * .43, -size * .18, size * .4, size * .22, 0, size / 2);
    ctx.bezierCurveTo(-size * .4, size * .22, -size * .43, -size * .18, 0, -size / 2); ctx.clip();
    ctx.drawImage(media.leaf, -size / 2, -size / 2, size, size); ctx.restore();
  }
  function lens(x, y, radius, opacity) {
    if (radius < 1 || opacity <= 0) return;
    ctx.save(); ctx.globalAlpha = opacity; ctx.strokeStyle = '#27382ac9'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(x, y, radius + 5, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#c3a473'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, radius + 13, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  function iris(next, amount, x = W / 2, y = H / 2) {
    const radius = Math.hypot(W, H) * .72 * Math.pow(clamp(amount), 1.3);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, Math.max(.001, radius), 0, Math.PI * 2); ctx.clip(); next(); ctx.restore();
    lens(x, y, radius, (1 - phase(.5, 1, amount)) * .85);
  }
  function inkWords(t) {
    paper();
    const mobile = W < 701, cx = W * (mobile ? .5 : .73), cy = H * (mobile ? .22 : .37);
    const scale = Math.min(W * (mobile ? .085 : .038), 53);
    // Text is a prepared illustration, repeated semantically in the chapter copy.
    ctx.textAlign = 'center'; ctx.fillStyle = '#324d38'; ctx.font = `500 ${scale}px Fraunces, Georgia, serif`;
    ctx.fillText('Co je prompt?', cx, cy);
    const answer = 'Zadání pro AI.';
    ctx.fillStyle = '#87613e'; ctx.font = `${scale * .64}px Fraunces, Georgia, serif`;
    ctx.fillText(answer.slice(0, Math.floor(phase(.06, .40, t) * answer.length)), cx, cy + scale * 1.35);
    ctx.strokeStyle = '#7d8a6860'; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(cx - scale * 2.7, cy + scale * 1.85); ctx.lineTo(cx + scale * 2.7 * phase(.04, .40, t), cy + scale * 1.85); ctx.stroke();
    const labels = ['Vysvětli mi to.', 'Co kdyby…', 'Zkusme to jinak.'];
    labels.forEach((word, i) => {
      ctx.save(); ctx.globalAlpha = .20; ctx.fillStyle = '#3e5c40'; ctx.font = `${scale * .48}px Fraunces, Georgia, serif`;
      const x = cx + Math.sin(i * 2.1 + t) * scale * 3, y = cy - scale * (1.6 + i * .62) + t * 25;
      ctx.fillText(word, x, y); ctx.restore();
    });
  }
  function website(t) {
    paper();
    const mobile = W < 701, bw = Math.min(W * (mobile ? .87 : .43), 650), bh = bw * .62;
    const x = W * (mobile ? .5 : .73) - bw / 2, y = H * (mobile ? .10 : .23);
    const grow = phase(.05, .48, t);
    ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.rotate((1 - grow) * -.045);
    ctx.fillStyle = '#fcf7eb'; ctx.shadowColor = '#26351f30'; ctx.shadowBlur = 35; ctx.shadowOffsetY = 15;
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#c5bba4'; ctx.lineWidth = 1; ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
    ctx.textAlign = 'left'; ctx.fillStyle = '#314632'; ctx.font = `${bw * .043}px SpecialElite, Georgia, serif`;
    ctx.fillText('Tony.', -bw * .44, -bh * .32);
    if (grow > .12) {
      ctx.globalAlpha = phase(.12, .35, grow); ctx.font = `500 ${bw * .072}px Fraunces, Georgia, serif`;
      ctx.fillText('Zvědavost', -bw * .43, -bh * .02); ctx.fillText('mě neopustila.', -bw * .43, bh * .13);
      ctx.font = `${bw * .025}px Inter, Arial, sans-serif`; ctx.fillText('Jsem Tony, manžel a táta.', -bw * .43, bh * .28);
    }
    if (media.garden && grow > .28) {
      ctx.globalAlpha = phase(.28, .85, grow); ctx.drawImage(media.garden, bw * .10, -bh * .26, bw * .35, bh * .66);
    }
    ctx.restore();
    ctx.fillStyle = '#8b6240'; ctx.font = `${mobile ? 12 : 16}px SpecialElite, Georgia, serif`; ctx.textAlign = 'center';
    ctx.fillText(t < .30 ? 'Zadání.' : t < .52 ? 'Zkouším a upravuji.' : 'Z nápadu vzniká web.', x + bw / 2, y + bh + 35);
  }
  function scene(index, t) {
    const mobile = W < 701, push = phase(.47, .96, t), size = Math.min(W, H);
    ctx.fillStyle = '#eee5d3'; ctx.fillRect(0, 0, W, H);
    switch (index) {
      case 0:
        cover('garden', 1.04 + push * 1.7, lerp(.50, .66, push), lerp(.43, .26, push));
        leaf(-W * .04 - t * W * .36, H * .74, size * .75, -.5 - t, .70);
        leaf(W * 1.04 + t * W * .3, H * .13, size * .63, 1.9 + t, .70);
        // Keep the personal opening legible over the full-screen landscape.
        ctx.save(); const shade = ctx.createLinearGradient(0, H * .28, 0, H); shade.addColorStop(0, '#14201500'); shade.addColorStop(1, '#142015c2'); ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H); ctx.restore();
        break;
      case 1: {
        cover('leaf', 1.20 + phase(.10, .65, t) * 1.7, .52, .48, .07 * phase(0, .6, t));
        const reveal = phase(.26, .59, t);
        if (reveal > 0) iris(() => cover('board', 1.14 + push * 1.8, .556, .39), reveal, W * (mobile ? .50 : .68), H * (mobile ? .29 : .48));
        break;
      }
      case 2:
        paper(); cover('board', 1.2, .5, .5, 0, .17);
        if (media.cpu) {
          const photoH = H * (mobile ? 1.07 : 1.04) * (1 + t * .10), photoW = photoH * media.cpu.width / media.cpu.height;
          const x = mobile ? (W - photoW) / 2 : W * .74 - photoW / 2;
          ctx.drawImage(media.cpu, x, -photoH * (mobile ? .08 : .02), photoW, photoH);
        }
        break;
      case 3: {
        cover('crt', 1.06 + push * 1.8, mobile ? .51 : .54, .45);
        const showGPU = phase(.27, .55, t);
        if (showGPU > 0) iris(() => cover('gpu', 1.03 + t * .10, .52, mobile ? .42 : .48), showGPU, W * (mobile ? .5 : .70), H * .40);
        break;
      }
      case 4: {
        paper(); cover('board', 1.18 + t * .12, .52, .40, 0, .26);
        const x = W * (mobile ? .5 : .74), y = H * (mobile ? .20 : .42), fs = Math.min(W * (mobile ? .20 : .105), 145);
        ctx.textAlign = 'center'; ctx.fillStyle = '#2b4237'; ctx.font = `500 ${fs}px Fraunces, Georgia, serif`;
        ctx.fillText('FX', x, y); ctx.fillStyle = '#895632'; ctx.font = `${fs * .50}px SpecialElite, Georgia, serif`; ctx.fillText('6300', x, y + fs * .65);
        break;
      }
      case 5: paper(); break;
      case 6: inkWords(t); break;
      case 7: website(t); break;
      case 8:
        cover('day', 1.02 + t * .045, .50, mobile ? .43 : .51);
        cover('night', 1.02 + t * .055, .50, mobile ? .43 : .51, 0, phase(.20, .62, t));
        break;
      default:
        paper(); cover('garden', 1.03, .43, .42, 0, .14);
        break;
    }
  }
  function measure() {
    if (!enabled) return;
    W = document.documentElement.clientWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, W < 701 ? 1.5 : 1.35);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    bounds = sections.map(s => ({ top: s.offsetTop, height: s.offsetHeight }));
    copies.forEach((copy, i) => {
      const desired = i === 0 ? H * .47 : i === 5 ? H * .28 : H * (W < 701 ? .45 : .22);
      const top = Math.max(85, Math.min(desired, H - copy.offsetHeight - 30));
      copy.style.setProperty('--copy-top', `${top}px`);
    });
    schedule();
  }
  function render() {
    raf = 0; if (!enabled || !ready || document.hidden) return;
    const y = Math.max(0, scrollY); let i = 0;
    while (i < bounds.length - 1 && y >= bounds[i + 1].top - 1) i++;
    const length = i === bounds.length - 1 ? Math.max(1, bounds[i].height - H) : bounds[i].height;
    const t = clamp((y - bounds[i].top) / length);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); scene(i, t);
    const transition = i < sections.length - 1 ? phase(.74, 1, t) : 0;
    if (transition > 0) {
      if (i === 4 || i === 5 || i === 8) {
        ctx.save(); ctx.globalAlpha = transition; scene(i + 1, 0); ctx.restore();
      } else {
        iris(() => scene(i + 1, 0), transition, W * .5, H * (W < 701 ? .35 : .5));
      }
    }
    copies.forEach((copy, j) => {
      const opacity = j === i ? (i === sections.length - 1 ? 1 : 1 - phase(.65, .75, t)) : 0;
      copy.style.setProperty('--copy-opacity', opacity.toFixed(3));
      copy.style.pointerEvents = opacity > .15 ? '' : 'none';
    });
    if (active !== i) {
      active = i; document.body.dataset.scene = String(i);
      dots.forEach((dot, j) => { if (j === i) dot.setAttribute('aria-current', 'location'); else dot.removeAttribute('aria-current'); });
    }
    progress.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - H))})`;
  }
  function schedule() { if (enabled && !raf) raf = requestAnimationFrame(render); }
  function setMode(preserve = false) {
    const section = preserve ? sections[Math.max(0, active)] : null;
    enabled = ready && !userReader && innerHeight >= 540 && !!media.garden && !!media.board;
    document.body.classList.toggle('is-enhanced', enabled);
    toggle.setAttribute('aria-pressed', String(!enabled));
    toggle.textContent = enabled ? 'Klidné čtení' : 'Pohyblivý příběh';
    nav.hidden = !enabled;
    if (!enabled) {
      cancelAnimationFrame(raf); raf = 0;
      copies.forEach(copy => { copy.style.removeProperty('--copy-opacity'); copy.style.removeProperty('--copy-top'); copy.style.pointerEvents = ''; });
    } else measure();
    if (section) section.scrollIntoView({ block: 'start' });
    else if (location.hash) { const target = document.getElementById(location.hash.slice(1)); if (target && target.classList.contains('chapter')) target.scrollIntoView({ block: 'start' }); }
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    // Current chapter is also determined in the simple reading mode.
    if (!enabled) {
      active = sections.reduce((found, section, i) => section.getBoundingClientRect().top <= H * .55 ? i : found, 0);
    }
    userReader = enabled;
    try { localStorage.setItem('tony-story-reader', String(userReader)); } catch (_) { /* Optional preference. */ }
    setMode(true);
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) menu.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') menu.open = false; });
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener('focusin', event => {
    const section = event.target.closest('.chapter');
    if (enabled && section && +section.dataset.scene !== active) section.scrollIntoView({ block: 'start' });
  });
  addEventListener('scroll', schedule, { passive: true });
  let resizeFrame = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if ((innerHeight >= 540) !== enabled && ready && !userReader) setMode(true);
      else measure();
    });
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule(); });
  reduced.addEventListener('change', () => { userReader = reduced.matches; setMode(true); });
  Promise.all(Object.keys(sources).map(image)).then(() => {
    ready = true; setMode();
    if (document.fonts) document.fonts.ready.then(measure);
  });
})();
