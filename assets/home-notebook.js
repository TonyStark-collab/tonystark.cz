(() => {
  'use strict';
  // Enhance once on arrival. Nothing is hidden before observation or on return.
  const entries = document.querySelectorAll('.notebook-entry');
  if (!entries.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((changes) => {
    changes.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-seen');
      observer.unobserve(target);
    });
  }, { threshold: 0.18 });
  entries.forEach((entry) => observer.observe(entry));
})();
