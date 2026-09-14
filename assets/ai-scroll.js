(() => {
  'use strict';
  const video = document.querySelector('#ai-background-video');
  const button = document.querySelector('[data-ai-toggle]');
  const scenes = [...document.querySelectorAll('[data-story-start]')].map(element => ({
    element, paper:element.querySelector('.scene-paper'),
    start:Number(element.dataset.storyStart), end:Number(element.dataset.storyEnd)
  }));
  if (!video || !button || !scenes.length || scenes.some(scene => !scene.paper)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const progress = document.querySelector('.story-progress');
  const era = document.querySelector('[data-story-era]');
  const label = button.querySelector('[data-motion-label]');
  let enabled = false, failed = false, frame = 0, needsMeasure = true;
  let wantedTime = 0, seeking = false, lastEra = '';
  const clamp = (value, min=0, max=1) => Math.max(min, Math.min(max, value));
  const smooth = value => { const x = clamp(value); return x*x*(3-2*x); };
  video.muted = true;
  video.pause();

  // At most one decoder seek at a time. A rapid swipe replaces the target;
  // finishing an old seek immediately catches up to the most recent position.
  function seek() {
    if (!enabled || failed || document.hidden || seeking || video.readyState < 1) return;
    const target = clamp(wantedTime, 0, Math.max(0, video.duration - .06));
    if (!Number.isFinite(target) || Math.abs(video.currentTime-target) < .035) return;
    seeking = true;
    try { video.currentTime = target; } catch { seeking = false; }
  }
  video.addEventListener('seeked', () => { seeking = false; seek(); });
  video.addEventListener('loadedmetadata', seek);
  video.addEventListener('loadeddata', seek);
  video.addEventListener('error', () => {
    failed = true; setEnabled(false); button.hidden = true;
    video.removeAttribute('src'); video.load();
  });

  function measure() {
    const viewport = document.documentElement.clientHeight;
    for (const scene of scenes) {
      const height = scene.paper.offsetHeight;
      scene.element.style.setProperty('--sheet-height', `${height}px`);
      // A long expanded paper first scrolls naturally until its bottom is visible.
      // No inner scroll area and no clipping, even on a short phone screen.
      scene.paper.style.setProperty('--pin-top', `${Math.min(viewport*.16, viewport-height-88)}px`);
    }
    needsMeasure = false;
  }
  function render() {
    frame = 0;
    if (!enabled || document.hidden) return;
    if (needsMeasure) measure();
    const viewport = document.documentElement.clientHeight;
    const focusLine = viewport * .5;
    const bounds = scenes.map(scene => scene.element.getBoundingClientRect());
    wantedTime = scenes[0].start;
    for (let i=0;i<scenes.length;i++) {
      const scene = scenes[i], box = bounds[i];
      // The first scene starts at the top of the page; other scenes take over
      // at the same focus line. Expanding a paper only stretches its own chapter.
      const start = i === 0 ? box.top + window.scrollY : focusLine;
      const fraction = clamp((start-box.top) / Math.max(1, box.height-(i===0 ? focusLine-start : 0)));
      if (i===0 || box.top <= focusLine) wantedTime = scene.start + fraction*(scene.end-scene.start);
      const paper = scene.paper.getBoundingClientRect();
      const arrival = smooth((viewport-paper.top)/(viewport*.45));
      const departure = smooth((viewport*.35-box.bottom)/(viewport*.35));
      const strength = Math.min(arrival, 1-departure);
      const focused = scene.paper.contains(document.activeElement);
      scene.paper.style.setProperty('--paper-opacity', focused ? '1' : String(.2+.8*strength));
      scene.paper.style.setProperty('--paper-scale', focused ? '1' : String(.96+.04*strength));
      scene.paper.style.setProperty('--paper-shift', focused ? '0px' : `${(1-strength)*(i%2 ? 24 : -24)}px`);
    }
    const total = scenes[scenes.length-1].end;
    progress?.style.setProperty('--story-progress', String(clamp(wantedTime/total)));
    const caption = wantedTime < 4.5 ? '1960 · Počátky učení strojů' : wantedTime < 8.5 ? '60. léta · Éra prvních chatbotů' : wantedTime < 12.75 ? '2016 · AlphaGo' : 'Dnes · Hvězdná abstrakce';
    if (era && caption !== lastEra) { era.textContent = caption; lastEra = caption; }
    seek();
  }
  function schedule() {
    if (enabled && !frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function resize() { needsMeasure = true; schedule(); }
  function setEnabled(value) {
    enabled = value && !failed;
    document.body.classList.toggle('story-enabled', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', `${enabled ? 'Vypnout' : 'Zapnout'} animace při posouvání`);
    button.dataset.paused = String(!enabled);
    if (label) label.textContent = enabled ? 'Pohyb zapnutý' : 'Pohyb vypnutý';
    video.pause();
    if (enabled) {
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      needsMeasure = true; schedule();
    } else {
      cancelAnimationFrame(frame); frame = 0;
    }
  }
  button.hidden = false;
  button.addEventListener('click', () => setEnabled(!enabled));
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', resize);
  window.addEventListener('pageshow', resize);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  for (const details of document.querySelectorAll('details')) details.addEventListener('toggle', resize);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    scenes.forEach(scene => observer.observe(scene.paper));
  }
  document.fonts?.ready.then(resize);
  const preferences = () => setEnabled(!reduced.matches && !connection?.saveData);
  reduced.addEventListener('change', preferences);
  connection?.addEventListener('change', preferences);
  preferences();
})();
