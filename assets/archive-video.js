(() => {
  'use strict';
  const video = document.querySelector('#farcry-video');
  if (!video) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let userPaused = false;
  let automaticPause = false;
  const pause = () => {
    if (!video.paused) { automaticPause = true; video.pause(); }
  };
  const sync = () => {
    if (!visible || document.hidden) { pause(); return; }
    if (!userPaused && !reduce.matches) video.play().catch(() => {});
  };
  video.addEventListener('pause', () => {
    if (automaticPause) automaticPause = false;
    else userPaused = true;
  });
  video.addEventListener('play', () => { userPaused = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.35 }).observe(video);
  }
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', () => { if (reduce.matches) pause(); else sync(); });
})();
