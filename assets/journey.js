(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  const menu = document.querySelector('.menu');
  const festival = document.querySelector('.music');
  const drifters = [...document.querySelectorAll('.drift')];
  const connection = document.querySelector('.connection');
  const storageKey = 'tonystark-journey-motion';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch { /* Private browsing still works. */ }
  let active = false;
  let frame = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  function render() {
    frame = 0;
    if (document.hidden) return;
    const view = document.documentElement.clientHeight;
    const range = document.documentElement.scrollHeight - view;
    document.documentElement.style.setProperty('--progress', String(range > 0 ? clamp(scrollY / range) : 0));
    if (!active) return;
    for (const el of drifters) {
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > view) continue;
      el.style.setProperty('--drift', `${Math.max(-14, Math.min(14, (view / 2 - box.top - box.height / 2) * .025))}px`);
    }
    const box = festival.getBoundingClientRect();
    const travel = clamp(-box.top / Math.max(1, box.height - view));
    const blend = clamp((travel - .4) / .2);
    // Only photographs blend. Text is readable at every entry position.
    festival.style.setProperty('--day', '1');
    festival.style.setProperty('--night', String(blend));
    const signal = connection.getBoundingClientRect();
    connection.style.setProperty('--signal', String(.35 + .65 * clamp((view - signal.top) / view)));
  }
  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function syncMotion() {
    active = !paused && !reduced.matches;
    // No layout classes or height changes: toggling retains the exact reading position.
    toggle.hidden = false;
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-pressed', String(!active));
    toggle.textContent = reduced.matches ? 'Pohyb omezen' : paused ? 'Zapnout pohyb' : 'Omezit pohyb';
    toggle.title = reduced.matches ? 'Podle nastavení omezeného pohybu v zařízení' : '';
    if (!active) {
      drifters.forEach(el => el.style.removeProperty('--drift'));
      connection.style.removeProperty('--signal');
      festival.style.removeProperty('--day');
      festival.style.removeProperty('--night');
    }
    render();
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'enabled'); } catch {}
    syncMotion();
  });
  reduced.addEventListener('change', syncMotion);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
      syncMotion();
    }
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule, { once: true });
  document.addEventListener('visibilitychange', schedule);
  document.fonts?.ready.then(schedule);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    menu.open = false;
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    history.pushState(null, '', link.hash);
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    render();
  }));
  window.addEventListener('hashchange', schedule);
  syncMotion();
})();
