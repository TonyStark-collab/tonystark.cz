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
  const creationStage = creation.querySelector('.creation-stage');
  const preview = document.querySelector('.mini-site');
  const videoDetails = document.querySelector('.festival-video');
  const video = videoDetails.querySelector('video');
  const storageKey = 'tonystark-journey-motion';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
  let active = false;
  let frame = 0;
  let currentArchive = -1;
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
    if (desktop.matches) {
      const middle = view * .55;
      let nearest = 0;
      let distance = Infinity;
      archiveSteps.forEach((step, i) => {
        const r = step.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - middle);
        if (d < distance) { nearest = i; distance = d; }
      });
      if (nearest !== currentArchive) {
        archiveFrames.forEach((image, i) => image.classList.toggle('active', i === nearest));
        currentArchive = nearest;
      }
    }
    const rect = creation.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= view) {
      const inset = parseFloat(getComputedStyle(creationStage).top) || 0;
      const p = ease(desktop.matches ? (inset - rect.top) / Math.max(1, rect.height - creationStage.offsetHeight) : (view * .75 - rect.top) / rect.height);
      preview.style.setProperty('--preview-scale', (.88 + p * (desktop.matches ? .92 : .12)).toFixed(4));
      preview.style.setProperty('--preview-rotation', `${(-4 + p * 4).toFixed(2)}deg`);
      preview.style.setProperty('--preview-shift', desktop.matches ? `${(-p * 50).toFixed(2)}%` : '0%');
      creation.style.setProperty('--creation-copy-opacity', desktop.matches ? (1 - ease((p - .35) / .45)).toFixed(4) : '1');
    }
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
    if (!active) {
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
