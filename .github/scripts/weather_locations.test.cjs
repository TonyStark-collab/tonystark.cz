const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../../assets/daily-overview.js'), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

class Element {
  constructor() { this.textContent = ''; this.value = ''; this.children = []; this.events = {}; this.dataset = {}; this.disabled = false; }
  addEventListener(name, fn) { this.events[name] = fn; }
  emit(name, extra = {}) { return this.events[name]?.({ preventDefault() {}, ...extra }); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute() {}
  removeAttribute() {}
  getContext() { return null; }
  querySelector() { return new Element(); }
  focus() {}
  set innerHTML(_) { throw new Error('HTML injection sink used'); }
}
function app({ saved, blockedStorage = false } = {}) {
  const elements = new Map();
  const el = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  el('location-country').value = 'CZ';
  let stored = saved ?? null;
  const requests = [];
  const positions = [];
  const context = vm.createContext({
    document: { getElementById: el, createElement: () => new Element(), fonts: { ready: Promise.resolve() } },
    navigator: { geolocation: { getCurrentPosition: (success, failure) => positions.push({ success, failure }) } },
    localStorage: {
      getItem() { if (blockedStorage) throw Error('blocked'); return stored; },
      setItem(_, value) { if (blockedStorage) throw Error('blocked'); stored = value; }
    },
    fetch: (url, options) => new Promise((resolve, reject) => requests.push({ url: String(url), options,
      resolve: body => resolve({ ok: true, json: async () => body }), reject })),
    window: { addEventListener() {} }, Image: class {}, URL, URLSearchParams, AbortController,
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {}, Intl, Date
  });
  vm.runInContext(source, context);
  return { el, requests, positions, stored: () => stored };
}
const weather = temp => ({ current: { temperature_2m: temp, weather_code: 0, wind_speed_10m: 4, is_day: 1, time: '2026-09-07T12:00' } });
const town = (name, lat, admin2) => ({ name, latitude: lat, longitude: 17.2, admin2, admin1: 'Jihomoravský', country: 'Česko' });
async function search(a, name, results) {
  a.el('location-query').value = name;
  a.el('location-query').emit('input');
  const pending = a.el('search-location').emit('click');
  a.requests.at(-1).resolve({ results });
  await pending;
}

test('same-name places show regions; choosing one updates coordinates and survives reload', async () => {
  const a = app();
  await search(a, 'Temice', [town('Těmice', 48.98, 'Hodonín'), town('Těmice', 49.3, 'Pelhřimov')]);
  const results = a.el('location-results').children;
  assert.equal(results.length, 2);
  assert.match(results[0].children[0].children[1].textContent, /Hodonín/);
  results[0].children[0].emit('click');
  assert.equal(a.el('selected-location').textContent, 'Těmice');
  assert.equal(new URL(a.requests.at(-1).url).searchParams.get('latitude'), '48.98');
  const restored = app({ saved: a.stored() });
  assert.equal(restored.el('selected-location').textContent, 'Těmice');
  assert.equal(restored.positions.length, 0);
});

test('country change cancels obsolete search results, and world search omits country filter', async () => {
  const a = app();
  a.el('location-query').value = 'Paris';
  const first = a.el('search-location').emit('click');
  const stale = a.requests.at(-1);
  assert.equal(new URL(stale.url).searchParams.get('countryCode'), 'CZ');
  a.el('location-country').value = '';
  a.el('location-country').emit('change');
  stale.resolve({ results: [town('Old result', 48, 'Old region')] });
  await first;
  assert.equal(a.el('location-results').children.length, 0);
  const latest = a.el('search-location').emit('click');
  assert.equal(new URL(a.requests.at(-1).url).searchParams.has('countryCode'), false);
  a.requests.at(-1).resolve({ results: [] });
  await latest;
  assert.match(a.el('location-status').textContent, /Žádné místo/);
  assert.equal(a.el('search-location').disabled, false);
});

test('old weather responses never overwrite a newly selected location', async () => {
  const a = app();
  const oldWeather = a.requests[0];
  await search(a, 'Bzenec', [town('Bzenec', 48.97, 'Hodonín')]);
  a.el('location-results').children[0].children[0].emit('click');
  a.requests.at(-1).resolve(weather(24));
  await tick();
  oldWeather.resolve(weather(-5));
  await tick();
  assert.equal(a.el('weather-temp').textContent, '24 °C');
  assert.match(a.el('weather-status').textContent, /^Bzenec/);
});

test('search failure is recoverable and leaves selected weather location intact', async () => {
  const a = app();
  a.el('location-query').value = 'Brno';
  const pending = a.el('search-location').emit('click');
  a.requests.at(-1).reject(Error('network offline'));
  await pending;
  assert.match(a.el('location-status').textContent, /nepodařilo/);
  assert.equal(a.el('search-location').disabled, false);
  assert.equal(a.el('selected-location').textContent, 'Praha');
  await search(a, 'Brno', [town('Brno', 49.19, 'Brno-město')]);
  assert.equal(a.el('location-results').children.length, 1);
});

test('geolocation requires a click, handles denial, and rounds stored coordinates', () => {
  const a = app();
  assert.equal(a.positions.length, 0);
  a.el('use-location').emit('click');
  a.positions[0].failure({ code: 1 });
  assert.match(a.el('location-status').textContent, /není povolená/);
  assert.equal(a.el('selected-location').textContent, 'Praha');
  assert.equal(a.el('use-location').disabled, false);
  a.el('use-location').emit('click');
  a.positions[1].success({ coords: { latitude: 48.975123, longitude: 17.274987 } });
  const saved = JSON.parse(a.stored());
  assert.equal(saved.latitude, 48.98);
  assert.equal(saved.longitude, 17.27);
  assert.equal(saved.name, 'Uložená poloha');
});

test('a late geolocation callback cannot override manual selection', async () => {
  const a = app();
  a.el('use-location').emit('click');
  await search(a, 'Brno', [town('Brno', 49.19, 'Brno-město')]);
  a.el('location-results').children[0].children[0].emit('click');
  a.positions[0].success({ coords: { latitude: 50, longitude: 14 } });
  assert.equal(a.el('selected-location').textContent, 'Brno');
});

test('malformed storage and unavailable storage preserve the usable default', async () => {
  for (const saved of ['{broken', '{"latitude":999,"longitude":17,"name":"Invalid","region":""}']) {
    assert.equal(app({ saved }).el('selected-location').textContent, 'Praha');
  }
  const a = app({ blockedStorage: true });
  await search(a, 'Brno', [town('Brno', 49.19, 'Brno-město')]);
  a.el('location-results').children[0].children[0].emit('click');
  assert.equal(a.el('selected-location').textContent, 'Brno');
});

test('API labels remain literal text and invalid coordinates are rejected', async () => {
  const a = app();
  await search(a, 'test', [town('<img onerror=alert(1)>', 48, '<script>'), town('Invalid', 999, '')]);
  assert.equal(a.el('location-results').children.length, 1);
  assert.equal(a.el('location-results').children[0].children[0].children[0].textContent, '<img onerror=alert(1)>');
});
