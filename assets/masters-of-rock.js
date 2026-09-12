(() => {
  'use strict';
  const scene = document.querySelector('.mor-story .story-concert');
  const video = scene?.querySelector('video');
  if (!video) return;
  const copy = scene.querySelector('.story-copy-concert');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let attempt = 0;
  let replayTimer = null;
  let finished = false;
  function allowed() {
    let enabled = true;
    try { enabled = localStorage.getItem('tonystark-concert-motion') !== 'paused'; } catch {}
    return visible && enabled && !reduced.matches && !document.hidden && copy.getAttribute('aria-hidden') !== 'true';
  }
  function sync() {
    const token = ++attempt;
    if (!allowed()) {
      clearTimeout(replayTimer);
      replayTimer = null;
      video.pause();
      return;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    if (finished) {
      if (replayTimer === null) replayTimer = setTimeout(() => {
        replayTimer = null;
        if (!allowed()) return;
        finished = false;
        video.currentTime = 0;
        sync();
      }, 10000);
      return;
    }
    video.play()?.then(() => {
      if (token !== attempt && !allowed()) video.pause();
    }).catch(() => { /* The completed logo poster remains the fallback. */ });
  }
  video.addEventListener('ended', () => { finished = true; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .3;
      sync();
    }, {threshold:[0,.3]}).observe(scene);
  }
  new MutationObserver(sync).observe(copy, {attributes:true,attributeFilter:['aria-hidden']});
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pageshow',sync);
  window.addEventListener('storage',event => { if (event.key === 'tonystark-concert-motion') sync(); });
  document.querySelectorAll('[data-concert-toggle]').forEach(button => button.addEventListener('click',() => queueMicrotask(sync)));
})();
(() => {
'use strict';
const scene=document.querySelector('.mor-diary');
if(!scene)return;
const video=scene.querySelector('video');
const button=scene.querySelector('.mor-diary-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let visible=false, paused=false, timer=null, finished=false;
button.hidden=false;
function allowed(){return visible&&!paused&&!reduced.matches&&!document.hidden;}
function sync(){
 clearTimeout(timer);timer=null;
 if(!allowed()){video.pause();return;}
 if(finished){timer=setTimeout(()=>{finished=false;video.currentTime=0;sync();},10000);return;}
 if(!video.src)video.src=video.dataset.src;
 const playing=video.play();if(playing)playing.catch(()=>{});
}
button.addEventListener('click',()=>{
 paused=!paused;button.setAttribute('aria-pressed',String(paused));
 button.textContent=paused?'Přehrávat logo':'Pozastavit logo';sync();
});
video.addEventListener('ended',()=>{finished=true;sync();});
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(video);
reduced.addEventListener('change',sync);
document.addEventListener('visibilitychange',sync);
})();
