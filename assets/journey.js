(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px) and (min-height: 650px)');
  const toggle = document.querySelector('.motion-toggle');
  const menu = document.querySelector('.menu');
  const archiveSteps = [...document.querySelectorAll('.archive-step')];
  const archiveFrames = [...document.querySelectorAll('.archive-image')];
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const creation = document.querySelector('.creation');
  const preview = document.querySelector('.mini-site');
  const videoDetails = document.querySelector('.festival-video');
  const video = videoDetails.querySelector('video');
  const storageKey = 'tonystark-journey-motion';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
  let active = false;
  let frame = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };

  function render() {
    frame = 0;
    if (document.hidden) return;
    const view = document.documentElement.clientHeight;
    const height = document.documentElement.scrollHeight - view;
    document.documentElement.style.setProperty('--progress', height > 0 ? clamp(scrollY / height).toFixed(4) : '0');
    if (!active) return;
    // Small bounded transforms never change document height or hijack scrolling.
    for (const element of parallax) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > view + 100) continue;
      const strength = desktop.matches ? 35 : 10;
      const p = Math.max(-1, Math.min(1, (view / 2 - (rect.top + rect.height / 2)) / view));
      element.style.setProperty('--parallax', `${(p * strength).toFixed(2)}px`);
    }
    renderChapters(view);
  }
  const stage = selector => document.querySelector(selector);
  const archiveScroll = stage('.archive-scroll');
  const aiStage = stage('.ai-stage');
  const concertScroll = stage('.concert-scroll');
  const tracks = [...document.querySelectorAll('.chapter-track span')];
  const specs = [...document.querySelectorAll('.specs>div')];
  const tall = matchMedia('(min-height: 560px)');
  function prop(el, name, value) { el.style.setProperty(name, String(value)); }
  function progress(el) {
    const rect = el.getBoundingClientRect();
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'));
    const pin = el.firstElementChild;
    return clamp((header + 12 - rect.top) / Math.max(1, rect.height - pin.offsetHeight));
  }
  function renderChapters(view) {
    if (!tall.matches) return;
    const p = progress(archiveScroll);
    const index = Math.min(2, Math.floor(p * 3));
    archiveSteps.forEach((step, i) => {
      const local = p * 3 - i;
      const alpha = i === index ? (i === 0 ? 1 : ease(local / .18)) : 0;
      step.classList.toggle('current', i === index);
      step.inert = i !== index;
      step.setAttribute('aria-hidden', String(i !== index));
      prop(step, '--frame-alpha', alpha);
      prop(step, '--text-y', `${(1 - alpha) * 45}px`);
      prop(archiveFrames[i], '--frame-alpha', alpha);
      prop(archiveFrames[i], '--frame-x', `${(1 - alpha) * -100}px`);
      prop(archiveFrames[i], '--frame-scale', 1 + clamp(local) * .08);
      tracks[i].classList.toggle('current', i === index);
    });
    const rig = stage('.rig');
    const rp = clamp((view * .8 - rig.getBoundingClientRect().top) / (view * .65));
    prop(rig, '--rig-x', `${(1 - ease(rp)) * -70}px`);
    specs.forEach((el, i) => { const a = ease((rp - i * .13) / .4); prop(el, '--spec-alpha', a); prop(el, '--spec-x', `${(1-a)*100}px`); });
    const a = progress(aiStage);
    prop(aiStage, '--chat-alpha', ease((a - .12) / .2));
    prop(aiStage, '--chat-y', `${(1 - ease((a - .12) / .2)) * 80}px`);
    prop(aiStage, '--reply-clip', `${(1 - ease((a - .38) / .35)) * 100}%`);
    prop(aiStage, '--foot-alpha', ease((a - .72) / .15));
    const c = progress(creation);
    prop(creation, '--build-scale', .8 + ease(c) * .2);
    [['brand', .08], ['title', .3], ['art', .53]].forEach(([name, start]) => {
      const v = ease((c-start)/.24); prop(creation, `--${name}-alpha`, v);
      prop(creation, `--${name}-y`, `${(1-v)*80}px`);
      prop(creation, `--${name}-x`, `${(1-v)*-70}px`);
      if(name === 'art') prop(creation, '--art-rotation', `${(1-v)*14}deg`);
    });
    prop(creation, '--notes-alpha', 1-ease((c-.8)/.2));
    prop(creation, '--prompt-alpha', 1-ease((c-.8)/.2));
    const m = progress(concertScroll); const blend = ease((m-.25)/.5);
    prop(concertScroll, '--day-caption', m < .5 ? 1 : 0);
    prop(concertScroll, '--night-caption', m >= .5 ? 1 : 0);
    prop(concertScroll, '--day-alpha', 1-blend);
    prop(concertScroll, '--night-alpha', blend);
    prop(concertScroll, '--day-scale', 1+m*.1);
    prop(concertScroll, '--night-scale', 1.1-m*.1);
  }

  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
  function syncMotion() {
    active = !paused && !reduced.matches;
    document.body.classList.toggle('motion-on', active);
    toggle.hidden = false;
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-pressed', String(!active));
    toggle.textContent = reduced.matches ? 'Pohyb omezen' : paused ? 'Zapnout pohyb' : 'Omezit pohyb';
    toggle.title = reduced.matches ? 'Podle nastavení omezeného pohybu v zařízení' : '';
    if (!active || !tall.matches) {
      archiveSteps.forEach(el => { el.inert = false; el.removeAttribute("aria-hidden"); });
      parallax.forEach(el => el.style.removeProperty('--parallax'));
      preview.style.removeProperty('--preview-scale');
      preview.style.removeProperty('--preview-rotation');
      preview.style.removeProperty('--preview-shift');
      creation.style.removeProperty('--creation-copy-opacity');
    }
    schedule();
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'enabled'); } catch {}
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  desktop.addEventListener('change', schedule);
  tall.addEventListener('change', syncMotion);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule, { once: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else schedule(); });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
      syncMotion();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.open = false;
    // A same-page destination stays reachable without focus getting hidden in the menu.
    if (link.hash && link.pathname === location.pathname) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
  }));
  videoDetails.addEventListener('toggle', () => { if (!videoDetails.open) video.pause(); });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.querySelector('main'));
  document.fonts?.ready.then(schedule);
  syncMotion();
})();
