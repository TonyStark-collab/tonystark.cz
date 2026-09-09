/* One brief entrance; restore plain text to avoid lingering compositor layers. */
(() => {
  'use strict';
  const paragraph = document.querySelector('.home .hero-copy .intro');
  if (!paragraph || !Element.prototype.animate) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'tony-intro-landed-v1';
  if (reduced.matches || document.visibilityState !== 'visible') return;
  try { if (sessionStorage.getItem(key)) return; } catch { /* Storage is optional. */ }
  const text = paragraph.textContent;
  let animations = [];
  let done = false;
  let timer;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    animations = [];
    paragraph.textContent = text;
    window.removeEventListener('scroll', finish);
    window.removeEventListener('resize', finish);
    window.removeEventListener('pagehide', finish);
    document.removeEventListener('visibilitychange', finish);
    reduced.removeEventListener('change', finish);
  }
  async function start() {
    if (document.fonts) {
      let deadline;
      try {
        await Promise.race([
          document.fonts.load('400 25px Kalam', text),
          new Promise(resolve => { deadline = setTimeout(resolve, 700); })
        ]);
      } catch { return; } finally { clearTimeout(deadline); }
      if (!document.fonts.check('400 25px Kalam', text)) return;
    }
    if (reduced.matches || document.visibilityState !== 'visible' || window.scrollY > 40) return;
    const bounds = paragraph.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    try { sessionStorage.setItem(key, '1'); } catch { /* Animation still works. */ }
    const accessible = document.createElement('span');
    accessible.className = 'intro-accessible';
    accessible.textContent = text;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const letters = [];
    text.split(' ').forEach((word, index) => {
      if (index) visual.append(document.createTextNode(' '));
      const wrapper = document.createElement('span');
      wrapper.className = 'intro-word';
      Array.from(word).forEach(character => {
        const letter = document.createElement('span');
        letter.className = 'intro-letter';
        letter.textContent = character;
        wrapper.append(letter);
        letters.push(letter);
      });
      visual.append(wrapper);
    });
    paragraph.replaceChildren(accessible, visual);
    window.addEventListener('scroll', finish, { passive:true });
    window.addEventListener('resize', finish, { passive:true });
    window.addEventListener('pagehide', finish);
    document.addEventListener('visibilitychange', finish);
    reduced.addEventListener('change', finish);
    timer = setTimeout(finish, 3200);
    try {
      animations = letters.map((letter, index) => letter.animate([
        { opacity:0, transform:`translateY(-12px) rotate(${index % 2 ? 3 : -3}deg)` },
        { opacity:1, transform:'translateY(0) rotate(0deg)' }
      ], {
        duration:560,
        delay:250 + index * 28,
        easing:'cubic-bezier(.18,.72,.25,1)',
        fill:'backwards'
      }));
      Promise.all(animations.map(animation => animation.finished)).then(finish, finish);
    } catch { finish(); }
  }
  start();
})();
