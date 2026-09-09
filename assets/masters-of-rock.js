(() => {
  'use strict';
  const scene = document.querySelector('.mor-story .story-concert');
  const video = scene?.querySelector('video');
  if (!video) return;
  const copy = scene.querySelector('.story-copy-concert');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let attempt = 0;
  function allowed() {
    let enabled = true;
    try { enabled = localStorage.getItem('tonystark-concert-motion') !== 'paused'; } catch {}
    return visible && enabled && !reduced.matches && !document.hidden && copy.getAttribute('aria-hidden') !== 'true';
  }
  function sync() {
    const token = ++attempt;
    if (!allowed()) { video.pause(); return; }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    if (video.ended) return;
    video.play()?.then(() => {
      if (token !== attempt && !allowed()) video.pause();
    }).catch(() => { /* The completed logo poster remains the fallback. */ });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .3;
      sync();
    }, {threshold:[0,.3]}).observe(scene);
  }
  new MutationObserver(sync).observe(copy, {attributes:true,attributeFilter:['aria-hidden']});
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pageshow',sync);
  window.addEventListener('storage',event => { if (event.key === 'tonystark-concert-motion') sync(); });
  document.querySelectorAll('[data-concert-toggle]').forEach(button => button.addEventListener('click',() => queueMicrotask(sync)));
})();
