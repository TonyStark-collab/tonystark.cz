(() => {
  const video = document.querySelector('#ai-background-video');
  const button = document.querySelector('[data-ai-background-toggle]');
  if (!video || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let wanted = !reduced.matches && !connection?.saveData;
  let failed = false;
  video.muted = true;
  button.hidden = false;

  function reflect() {
    const paused = video.paused;
    button.dataset.paused = String(paused);
    const label = paused ? 'Spustit pohyb pozadí' : 'Pozastavit pohyb pozadí';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  async function sync() {
    if (failed || !wanted || document.hidden) {
      video.pause();
      reflect();
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try {
      await video.play();
      // A tab switch or pause may have happened while play() was pending.
      if (!wanted || document.hidden) video.pause();
    } catch {
      // Autoplay can be blocked; leave the explicit play button available.
    }
    reflect();
  }
  button.addEventListener('click', () => {
    wanted = video.paused;
    sync();
  });
  video.addEventListener('play', reflect);
  video.addEventListener('pause', reflect);
  video.addEventListener('error', () => {
    failed = true;
    video.pause();
    video.removeAttribute('src');
    video.load();
    button.hidden = true;
  });
  document.addEventListener('visibilitychange', sync);
  function preferenceChanged() {
    wanted = !reduced.matches && !connection?.saveData;
    sync();
  }
  reduced.addEventListener('change', preferenceChanged);
  connection?.addEventListener('change', preferenceChanged);
  reflect();
  sync();
})();
