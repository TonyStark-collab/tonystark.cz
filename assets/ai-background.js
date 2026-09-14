(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  document.querySelectorAll('[data-ai-motion]').forEach(video => {
    const button = document.querySelector(`[data-ai-toggle][aria-controls="${video.id}"]`);
    if (!button) return;
    let wanted = !reduced.matches && !connection?.saveData;
    let visible = !video.hasAttribute('data-viewport-play');
    let failed = false;
    const noun = video.dataset.aiMotion;
    video.muted = true;
    button.hidden = false;
    function reflect() {
      const paused = video.paused;
      button.dataset.paused = String(paused);
      const label = `${paused ? 'Spustit' : 'Pozastavit'} ${noun}`;
      button.setAttribute('aria-label', label);
      button.title = label;
      const text = button.querySelector('[data-motion-label]');
      if (text) text.textContent = paused ? 'Přehrát' : 'Pozastavit';
    }
    async function sync() {
      if (failed || !wanted || !visible || document.hidden) {
        video.pause(); reflect(); return;
      }
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      try {
        await video.play();
        if (!wanted || !visible || document.hidden) video.pause();
      } catch { /* Explicit play stays available when autoplay is blocked. */ }
      reflect();
    }
    button.addEventListener('click', () => {
      wanted = video.paused;
      sync();
    });
    video.addEventListener('play', reflect);
    video.addEventListener('pause', reflect);
    video.addEventListener('error', () => {
      failed = true; video.pause(); video.removeAttribute('src'); video.load();
      button.hidden = true;
    });
    document.addEventListener('visibilitychange', sync);
    function preferenceChanged() {
      wanted = !reduced.matches && !connection?.saveData;
      sync();
    }
    reduced.addEventListener('change', preferenceChanged);
    connection?.addEventListener('change', preferenceChanged);
    if (video.hasAttribute('data-viewport-play')) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          visible = entries.some(entry => entry.isIntersecting);
          sync();
        }, { threshold:0.05 });
        observer.observe(video);
      } else { visible = true; }
    }
    reflect(); sync();
  });
})();
