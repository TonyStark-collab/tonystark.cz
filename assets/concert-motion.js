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
      beams: [[720,438,285,42],[841,422,310,50],[955,407,300,40]],
      haze: [[807,585,165,44],[902,633,130,31]],
      glow: [865,550,200,145],
    },
    band: {
      width: 2048, height: 682,
      clip: 'M1240 70H2048V650H1140L1200 375Z',
      beams: [[1442,185,355,55],[1566,182,370,65],[1667,195,345,48],[1754,175,365,60],[1859,193,345,48]],
      haze: [[1600,343,290,48],[1840,405,265,39]],
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
          <stop stop-color="#fff5e6"/><stop offset=".35" stop-color="#ffdec9" stop-opacity=".9"/><stop offset=".7" stop-color="#ff9b73" stop-opacity=".4"/><stop offset="1" stop-color="#ff5839" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="${id}-haze"><stop stop-color="#ffd5bf" stop-opacity=".85"/><stop offset=".45" stop-color="#ff9774" stop-opacity=".5"/><stop offset="1" stop-color="#ff6348" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-glow"><stop stop-color="#ffb17e" stop-opacity=".7"/><stop offset="1" stop-color="#ff342c" stop-opacity="0"/></radialGradient>
        <filter id="${id}-soft" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <g clip-path="url(#${id}-clip)">
        <ellipse class="stage-glow" cx="${gx}" cy="${gy}" rx="${grx}" ry="${gry}" fill="url(#${id}-glow)"/>
        ${scene.beams.map(([x,y,length,spread],i) => `<g class="stage-beam" style="transform-origin:${x}px ${y}px;--duration:${3.6+i*.65}s;--delay:-${1.8+i*1.3}s"><path d="M${x-3} ${y}L${x-spread} ${y+length}Q${x} ${y+length+25} ${x+spread} ${y+length}L${x+3} ${y}Z" fill="url(#${id}-beam)" filter="url(#${id}-soft)"/></g>`).join('')}
        ${scene.haze.map(([x,y,rx,ry],i) => `<g class="stage-haze" style="--duration:${5+i*2}s;--delay:-${2+i*3}s"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id}-haze)"/></g>`).join('')}
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
