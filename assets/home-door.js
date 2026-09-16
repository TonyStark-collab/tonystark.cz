const storyDoor = document.querySelector('.story-door');
if (storyDoor) {
  let openingTimer;
  const resetDoor = () => {
    window.clearTimeout(openingTimer);
    openingTimer = undefined;
    storyDoor.classList.remove('is-opening');
  };
  storyDoor.addEventListener('click', event => {
    // Keep native link behavior for new tabs and reduced-motion preferences.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (openingTimer !== undefined) return;
    storyDoor.classList.add('is-opening');
    openingTimer = window.setTimeout(() => window.location.assign(storyDoor.href), 700);
  });
  // Restore a closed door when returning through the browser's back cache.
  window.addEventListener('pageshow', resetDoor);
  window.addEventListener('pagehide', resetDoor);
}
