(() => {
  'use strict';
  const story = document.querySelector('[data-network-story]');
  if (!story) return;
  const steps = [...story.querySelectorAll('[data-network-step]')];
  const map = story.querySelector('.network-map');
  let scheduled = false;
  function update() {
    scheduled = false;
    const mapBox = map.getBoundingClientRect();
    const narrow = window.matchMedia('(max-width:760px)').matches;
    const line = narrow ? Math.min(innerHeight * .82, mapBox.bottom + 100) : innerHeight * .58;
    let stage = '1';
    for (const step of steps) {
      if (step.getBoundingClientRect().top <= line) stage = step.dataset.networkStep;
    }
    story.dataset.stage = stage;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  story.classList.add('network-ready');
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  update();
  const video = document.querySelector('.network-film');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  function syncVideo() {
    if (!video) return;
    if (visible && !document.hidden && !reduced.matches && document.body.classList.contains('motion-on')) {
      video.muted = true;
      const promise = video.play();
      if (promise) promise.catch(() => { /* Keep the poster if autoplay is blocked. */ });
    } else video.pause();
  }
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncVideo();
    }, { threshold: .15 }).observe(video);
    new IntersectionObserver(entries => {
      story.classList.toggle('in-view', entries[0].isIntersecting);
    }).observe(story);
    new MutationObserver(syncVideo).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', syncVideo);
    reduced.addEventListener('change', syncVideo);
    syncVideo();
  }
})();
