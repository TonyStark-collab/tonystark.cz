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
  const video = document.querySelector('.network-media video');
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) video.pause();
    }).observe(video);
  }
})();
