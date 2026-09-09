const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const closeButton = nav.querySelector('.menu-close');
function setMenu(open, returnFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.inert = !open;
  nav.classList.toggle('is-open', open);
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
closeButton.addEventListener('click', () => setMenu(false, true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
});
document.addEventListener('focusin', event => {
  if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

nav.querySelectorAll('a').forEach(link => {
  if (location.pathname === link.pathname || (link.pathname === '/aplikace/' && location.pathname.startsWith('/aplikace/'))) link.setAttribute('aria-current', 'page');
});
