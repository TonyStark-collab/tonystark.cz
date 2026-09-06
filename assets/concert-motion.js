(() => {
  'use strict';

  const layers = [...document.querySelectorAll('[data-concert-scene]')];
  const controls = [...document.querySelectorAll('[data-concert-toggle]')];
  if (!layers.length || !controls.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileLayout = window.matchMedia('(max-width: 600px)');
  const preferenceKey = 'tonystark-concert-motion';
  let enabled = true;
  try { enabled = localStorage.getItem(preferenceKey) !== 'paused'; } catch {}

  const scenes = {
    hero: {
      width: 1000, height: 1000,
      clip: 'M1000 314L951 325 899 338 847 350 796 362 744 374 692 386 640 398 586 410 602 501 617 593 633 684 657 793 691 785 719 778 722 769 772 757 824 745 876 733 930 718 1000 701Z',
      beams: [[720,438,305,48],[763,471,270,32,'cool'],[841,422,325,55],[909,450,290,35,'cool'],[955,407,310,46]],
      haze: [[760,558,140,46],[917,604,150,40],[824,668,165,35]],
      glow: [865,550,200,145],
    },
    band: {
      width: 2048, height: 682,
      clip: 'M1240 70H2048V650H1140L1200 375Z',
      beams: [[1442,185,380,65],[1566,182,390,55,'cool'],[1667,195,370,62],[1754,175,390,52,'cool'],[1859,193,370,60]],
      haze: [[1500,340,230,60],[1820,382,265,54],[1660,450,290,42]],
      glow: [1700,320,390,190],
    },
  };

  // SVG coordinates match each original photograph; viewBox follows its cover crop.
  const render = (name, scene) => {
    const id = `concert-${name}`;
    const [gx,gy,grx,gry] = scene.glow;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${scene.width} ${scene.height}" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="${id}-clip"><path d="${scene.clip}"/></clipPath>
        <linearGradient id="${id}-beam" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#fff8ef"/><stop offset=".4" stop-color="#ffe1b0" stop-opacity=".95"/><stop offset=".75" stop-color="#ff814f" stop-opacity=".4"/><stop offset="1" stop-color="#ff442b" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${id}-beam-cool" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#fff"/><stop offset=".35" stop-color="#d4eeff" stop-opacity=".95"/><stop offset=".7" stop-color="#709aff" stop-opacity=".5"/><stop offset="1" stop-color="#514aff" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="${id}-haze"><stop stop-color="#ffd5bf" stop-opacity=".85"/><stop offset=".45" stop-color="#ff9774" stop-opacity=".5"/><stop offset="1" stop-color="#ff6348" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-haze-cool"><stop stop-color="#e5eaff" stop-opacity=".85"/><stop offset=".45" stop-color="#a7acff" stop-opacity=".5"/><stop offset="1" stop-color="#7068e8" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-glow"><stop stop-color="#ffb17e" stop-opacity=".7"/><stop offset="1" stop-color="#ff342c" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-wash"><stop stop-color="#ff4b14"/><stop offset=".5" stop-color="#f52020" stop-opacity=".7"/><stop offset="1" stop-color="#f52020" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-wash-cool"><stop stop-color="#6488ff"/><stop offset=".5" stop-color="#6359ef" stop-opacity=".7"/><stop offset="1" stop-color="#6359ef" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-flare"><stop stop-color="#fff"/><stop offset=".18" stop-color="#fff7e4" stop-opacity=".95"/><stop offset="1" stop-color="#ffb18a" stop-opacity="0"/></radialGradient>
        <filter id="${id}-soft" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <g clip-path="url(#${id}-clip)">
        <ellipse class="stage-effect stage-wash" cx="${gx-40}" cy="${gy-30}" rx="${grx*1.25}" ry="${gry*1.2}" fill="url(#${id}-wash)"/>
        <ellipse class="stage-effect stage-wash stage-wash--cool" cx="${gx+grx*.2}" cy="${gy-20}" rx="${grx}" ry="${gry*1.15}" fill="url(#${id}-wash-cool)"/>
        <ellipse class="stage-effect stage-glow" cx="${gx}" cy="${gy}" rx="${grx}" ry="${gry}" fill="url(#${id}-glow)"/>
        ${scene.beams.map(([x,y,length,spread,tone],i) => `<g class="stage-effect stage-beam" style="transform-origin:${x}px ${y}px;--duration:${2.6+i*.45}s;--delay:-${1.3+i*.9}s;--direction:${i%2 ? 'alternate-reverse' : 'alternate'}"><path d="M${x-3} ${y}L${x-spread} ${y+length}Q${x} ${y+length+25} ${x+spread} ${y+length}L${x+3} ${y}Z" fill="url(#${id}-beam${tone==='cool' ? '-cool' : ''})" filter="url(#${id}-soft)"/></g>`).join('')}
        ${scene.haze.map(([x,y,rx,ry],i) => `<g class="stage-effect stage-haze" style="--duration:${4.8+i*1.4}s;--delay:-${2+i*2.3}s" fill="url(#${id}-haze${i===1 ? '-cool' : ''})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><ellipse cx="${x-rx*.35}" cy="${y-ry*.7}" rx="${rx*.65}" ry="${ry*.8}" opacity=".55"/><ellipse cx="${x+rx*.5}" cy="${y+ry*.45}" rx="${rx*.55}" ry="${ry*.7}" opacity=".45"/></g>`).join('')}
        ${scene.beams.map(([x,y],i) => `<circle class="stage-effect stage-flare" cx="${x}" cy="${y}" r="${name==='hero' ? 16 : 22}" fill="url(#${id}-flare)" style="--delay:-${i*.6}s"/>`).join('')}
      </g>
    </svg>`;
  };

  const visibleLayers = new Set();
  for (const layer of layers) {
    const name = layer.dataset.concertScene;
    const scene = scenes[name];
    if (!scene) continue;
    layer.innerHTML = render(name, scene);
    layer.dataset.playing = 'false';
  }

  function fitScene(layer) {
    const scene = scenes[layer.dataset.concertScene];
    const svg = layer.querySelector('svg');
    if (!scene || !svg) return;
    const {width,height} = layer.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.max(width/scene.width, height/scene.height);
    const w = width/scale;
    const h = height/scale;
    const yPosition = layer.dataset.concertScene === 'hero' ? (mobileLayout.matches ? .62 : .5) : .6;
    svg.setAttribute('viewBox', `${(scene.width-w)*.5} ${(scene.height-h)*yPosition} ${w} ${h}`);
  }

  function syncPlayback() {
    const allowed = enabled && !reducedMotion.matches && !document.hidden;
    for (const layer of layers) layer.dataset.playing = String(allowed && visibleLayers.has(layer));
    for (const control of controls) {
      control.hidden = reducedMotion.matches;
      control.querySelector('[data-concert-label]').textContent = enabled ? 'Pozastavit pohyb' : 'Spustit pohyb';
      control.querySelector('path').setAttribute('d', enabled ? 'M3 2h3v12H3zM10 2h3v12h-3z' : 'M4 2l10 6-10 6z');
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleLayers.add(entry.target);
        else visibleLayers.delete(entry.target);
      }
      syncPlayback();
    }, {threshold:0});
    layers.forEach(layer => observer.observe(layer));
  } else {
    layers.forEach(layer => visibleLayers.add(layer));
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(entries => entries.forEach(entry => fitScene(entry.target)));
    layers.forEach(layer => observer.observe(layer));
  } else {
    window.addEventListener('resize', () => layers.forEach(fitScene), {passive:true});
  }

  for (const control of controls) control.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem(preferenceKey, enabled ? 'playing' : 'paused'); } catch {}
    syncPlayback();
  });
  reducedMotion.addEventListener('change', syncPlayback);
  mobileLayout.addEventListener('change', () => layers.forEach(fitScene));
  document.addEventListener('visibilitychange', syncPlayback);
  layers.forEach(fitScene);
  syncPlayback();
  document.body.classList.add('concert-motion-ready');
})();
