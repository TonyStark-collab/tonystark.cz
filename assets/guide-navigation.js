(() => {
  const nav = document.querySelector('.guide-sidebar nav');
  if (!nav) return;
  const entries = [...nav.querySelectorAll('a[href^="#"]')]
    .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(entry => entry.section);
  if (!entries.length) return;
  let active;
  let queued = false;
  const update = () => {
    queued = false;
    const line = Math.min(160, Math.max(80, window.innerHeight * 0.2));
    let current = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top <= line) current = entry;
    }
    if (current === active) return;
    for (const entry of entries) {
      if (entry === current) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
    active = current;
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
  document.fonts?.ready.then(schedule);
  const contents = nav.closest('details');
  if (contents && window.matchMedia('(max-width: 700px)').matches) contents.open = false;
  update();
})();
