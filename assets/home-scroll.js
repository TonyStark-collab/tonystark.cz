(() => {
  'use strict';
  const story = document.querySelector('[data-scroll-story]');
  if (!story) return;
  const viewport = story.querySelector('.story-viewport');
  const concert = story.querySelector('.story-concert');
  const pcb = story.querySelector('.story-pcb');
  const concertCopy = story.querySelector('.story-copy-concert');
  const pcbCopy = story.querySelector('.story-copy-pcb');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  let active = false;
  let frame = 0;

  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = (start, end, value) => {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  // Do not repeatedly invalidate painting once a scene reaches either end.
  const values = new Map();
  const set = (key, value) => {
    if (values.get(key) === value) return;
    values.set(key, value);
    story.style.setProperty(key, value);
  };
  function availability(element, available) {
    if (element.getAttribute('aria-hidden') === String(!available) && element.inert === !available) return;
    element.inert = !available;
    element.setAttribute('aria-hidden', String(!available));
  }

  function render() {
    frame = 0;
    if (!active || document.hidden) return;
    // Use the actual CSS sticky inset and layout heights, including small viewport
    // units. Android's expanding address bar must not introduce a second timeline.
    const top = story.getBoundingClientRect().top;
    const inset = parseFloat(getComputedStyle(viewport).top) || 0;
    const travel = Math.max(1, story.offsetHeight - viewport.offsetHeight);
    const p = clamp((inset - top) / travel);
    const opening = ease(0, .34, p);
    let paper = ease(.52, .88, p);
    // Only keyboard focus can hold a scene. A tap must never latch the animation.
    if (concertCopy.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) paper = 0;
    if (pcbCopy && pcbCopy.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) paper = 1;
    const initialWidth = compact.matches ? 88 : 76;
    set('--frame-width', `${(initialWidth + (100 - initialWidth) * opening).toFixed(3)}%`);
    set('--concert-zoom', (1.32 - ease(0, .5, p) * .32).toFixed(4));
    set('--paper-y', `${((1 - paper) * 102).toFixed(3)}%`);
    set('--scene-light', (.45 + ease(.1, .46, p) * .45).toFixed(3));
    // Neither caption fades. The incoming opaque paper physically covers the
    // concert; remove only covered links from focus and the accessibility tree.
    availability(concertCopy, !pcb || paper < .23);
    if (pcb) availability(pcb, paper > .72);
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
      for (const property of ['--frame-width', '--concert-zoom', '--paper-y', '--scene-light']) story.style.removeProperty(property);
      values.clear();
      availability(concertCopy, true);
      if (pcb) availability(pcb, true);
    } else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
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
    observer.observe(story);
    observer.observe(viewport);
  }
  document.fonts?.ready.then(schedule);
  syncMotion();
})();
