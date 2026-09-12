(() => {
  'use strict';
  const videos = Array.from(document.querySelectorAll('.memory video'));
  // Start only through native controls; keep one memory playing.
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
  });
})();
