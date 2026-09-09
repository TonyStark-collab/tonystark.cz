(() => {
  'use strict';
  const story = document.querySelector('[data-scroll-story]');
  const hero = document.querySelector('.home-hero');
  const art = document.querySelector('.hero-art');
  const guides = document.querySelector('.home-guides');
  if (!story || !hero || !art || !guides) return;

  const concertCopy = story.querySelector('.story-copy-concert');
  const pcbCopy = story.querySelector('.story-copy-pcb');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  let active = false;
  let frame = 0;
  let pageHeight = window.innerHeight;
  let sceneIsPcb = false;

  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = (start, end, value) => {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  // Individual DOM properties preserve the existing strict CSP.
  const set = (element, key, value) => element.style.setProperty(key, value);

  function copyState(isPcb) {
    if (isPcb === sceneIsPcb) return;
    sceneIsPcb = isPcb;
    concertCopy.inert = isPcb;
    pcbCopy.inert = !isPcb;
    concertCopy.setAttribute('aria-hidden', String(isPcb));
    pcbCopy.setAttribute('aria-hidden', String(!isPcb));
  }

  function render() {
    frame = 0;
    if (!active || document.hidden) return;
    // Read geometry before writing any style; no scroll interception or timer loop.
    const scene = story.getBoundingClientRect();
    const artwork = art.getBoundingClientRect();
    const guideBox = guides.getBoundingClientRect();
    const stickyTop = pageHeight * (compact.matches ? .12 : .10);
    const travel = compact.matches ? 220 : 350;
    const p = clamp((stickyTop - scene.top) / travel);
    let mix = ease(.05, .90, p);
    // Keep a keyboard-focused link readable until focus leaves its scene.
    if (concertCopy.contains(document.activeElement)) mix = 0;
    if (pcbCopy.contains(document.activeElement)) mix = 1;
    const opening = ease(0, 1, (pageHeight * .85 - scene.top) / (pageHeight * .65));
    const heroProgress = clamp(-artwork.top / Math.max(artwork.height, 1));
    const amount = compact.matches ? 15 : 34;

    set(story, '--scene-inset', `${((1 - opening) * (compact.matches ? 5 : 12)).toFixed(2)}%`);
    set(story, '--scene-zoom', (1.16 - opening * .12 + mix * .025).toFixed(4));
    set(story, '--scene-shift', `${((opening - .5) * -12).toFixed(2)}px`);
    set(story, '--scene-mix', mix.toFixed(4));
    set(story, '--scene-light', (.35 + opening * .45).toFixed(3));
    set(story, '--concert-copy-opacity', (1 - ease(0, .5, mix)).toFixed(3));
    set(story, '--pcb-copy-opacity', ease(.5, 1, mix).toFixed(3));
    set(story, '--pcb-light-x', `${(-90 + ease(.05, 1, p) * 180).toFixed(2)}%`);
    set(hero, '--keyboard-shift', `${(-heroProgress * amount).toFixed(2)}px`);
    set(hero, '--note-shift', `${(heroProgress * amount * .6).toFixed(2)}px`);
    set(hero, '--note-turn', `${(heroProgress * -3).toFixed(2)}deg`);
    set(hero, '--art-shift', `${(heroProgress * -8).toFixed(2)}px`);
    set(guides, '--guides-shift', `${(clamp((pageHeight - guideBox.top) / pageHeight) * -24).toFixed(2)}px`);
    copyState(mix >= .5);
  }

  function schedule() {
    if (active && !frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function syncMotion() {
    let enabled = true;
    try { enabled = localStorage.getItem('tonystark-concert-motion') !== 'paused'; } catch {}
    active = enabled && !motion.matches;
    document.body.classList.toggle('home-scroll-ready', active);
    if (!active) {
      cancelAnimationFrame(frame);
      frame = 0;
      // Clear only this module's properties, without replacing the style attribute.
      for (const element of [story, hero, guides]) {
        for (const property of Array.from(element.style)) {
          if (/^--(scene-|concert-copy-|pcb-|keyboard-|note-|art-|guides-shift)/.test(property)) {
            element.style.removeProperty(property);
          }
        }
      }
      copyState(false);
    } else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    pageHeight = window.innerHeight;
    schedule();
  }, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('storage', event => {
    if (event.key === 'tonystark-concert-motion' || event.key === null) syncMotion();
  });
  motion.addEventListener('change', syncMotion);
  compact.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  story.addEventListener('focusin', schedule);
  story.addEventListener('focusout', schedule);
  document.querySelectorAll('[data-concert-toggle]').forEach(button => {
    button.addEventListener('click', () => queueMicrotask(syncMotion));
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(story);
  }
  document.fonts?.ready.then(schedule);
  syncMotion();
})();
