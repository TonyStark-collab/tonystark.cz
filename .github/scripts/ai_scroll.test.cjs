const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const code = readFileSync(require('node:path').join(__dirname, '../../assets/ai-scroll.js'), 'utf8');
function setup({reduced=false,saveData=false}={}) {
  const element = () => ({
    listeners:{}, props:{}, attrs:{}, dataset:{}, offsetHeight:400,
    style:{setProperty(k,v){this[k]=v;}},
    addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);},
    emit(k){for(const fn of this.listeners[k]??[])fn();},
    setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]??null;},removeAttribute(k){delete this.attrs[k];},
    contains(){return false;},querySelector(){return null;}
  });
  let y=0, seekCount=0, clock=0;
  const video=element(); Object.assign(video,{muted:false,paused:false,readyState:0,duration:18.5,dataset:{src:'/assets/ai-background.mp4'},pause(){this.paused=true;},load(){}});
  Object.defineProperty(video,'currentTime',{get(){return clock;},set(v){clock=v;seekCount++;}});
  Object.defineProperty(video,'src',{set(v){video.attrs.src=v;}});
  const label=element(), button=element();button.querySelector=()=>label;
  const ranges=[[0,4.5],[4.5,8.5],[8.5,13.5],[13.5,18.4]];
  const scenes=ranges.map(([start,end],i)=>{
    const scene=element(),paper=element();
    scene.top=100+i*1400;scene.height=1400;
    scene.dataset={storyStart:String(start),storyEnd:String(end)};
    scene.querySelector=()=>paper;scene.paper=paper;
    scene.getBoundingClientRect=()=>({top:scene.top-y,bottom:scene.top-y+scene.height,height:scene.height});
    paper.getBoundingClientRect=()=>({top:Math.max(160,scene.top-y+160)});
    return scene;
  });
  const progress=element(),era=element(),details=element(),doc=element();
  Object.assign(doc,{hidden:false,activeElement:{},documentElement:{clientHeight:1000},body:{classList:{toggle(k,v){doc[k]=v;}}}});
  doc.querySelector=s=>({'#ai-background-video':video,'[data-ai-toggle]':button,'.story-progress':progress,'[data-story-era]':era}[s]);
  doc.querySelectorAll=s=>s==='details'?[details]:scenes;
  const pref=element();pref.matches=reduced;
  const connection=element();connection.saveData=saveData;
  const win=element();Object.defineProperty(win,'scrollY',{get:()=>y});
  let queued=new Map(),id=0;
  vm.runInNewContext(code,{document:doc,window:win,navigator:{connection},matchMedia:()=>pref,requestAnimationFrame:fn=>{queued.set(++id,fn);return id;},cancelAnimationFrame:id=>queued.delete(id)});
  const tick=()=>{const fns=[...queued.values()];queued.clear();fns.forEach(fn=>fn());};
  const scroll=value=>{y=value;win.emit('scroll');tick();};
  const loaded=()=>{video.readyState=2;video.emit('loadedmetadata');};
  tick();
  return {video,button,label,scenes,doc,win,pref,details,tick,scroll,loaded,get seeks(){return seekCount;},get pending(){return queued.size;}};
}
test('scroll advances and reverses a paused video; resting schedules no frames',()=>{
  const s=setup();s.loaded();assert.equal(s.video.currentTime,0);assert.equal(s.video.paused,true);
  s.scroll(1800);s.video.emit('seeked');const forward=s.video.currentTime;
  assert.ok(forward>4.5 && forward<8.5);
  s.scroll(700);s.video.emit('seeked');assert.ok(s.video.currentTime<forward);
  assert.equal(s.pending,0);assert.equal(s.video.paused,true);
});
test('rapid swipes serialize seeks and settle on the latest position',()=>{
  const s=setup();s.loaded();s.scroll(500);assert.equal(s.seeks,1);
  s.scroll(2500);s.scroll(4500);assert.equal(s.seeks,1);
  s.video.emit('seeked');assert.equal(s.seeks,2);assert.ok(s.video.currentTime>13.5);
  s.video.emit('seeked');assert.equal(s.seeks,2);
});
test('page restored at its end loads the final galaxy, without wrapping to the first photo',()=>{
  const s=setup();s.scroll(10000);s.loaded();s.video.emit('seeked');
  assert.equal(s.video.currentTime,18.4);s.scroll(-50);s.video.emit('seeked');assert.equal(s.video.currentTime,0);
});
test('reduced motion and data saver keep the poster and readable static layout until explicitly enabled',()=>{
  for(const options of [{reduced:true},{saveData:true}]){
    const s=setup(options);assert.equal(s.doc['story-enabled'],false);assert.equal(s.video.getAttribute('src'),null);
    s.scroll(3000);assert.equal(s.seeks,0);s.button.emit('click');s.tick();
    assert.equal(s.doc['story-enabled'],true);assert.equal(s.video.getAttribute('src'),'/assets/ai-background.mp4');
  }
});
test('expanded long paper gets a negative sticky inset, allowing its entire text to pass through the viewport',()=>{
  const s=setup();s.scenes[1].paper.offsetHeight=1800;s.details.emit('toggle');s.tick();
  assert.equal(s.scenes[1].paper.style['--pin-top'],'-888px');
  assert.equal(s.scenes[1].style['--sheet-height'],'1800px');
});
test('pausing or hiding the page stops work; resuming catches up',()=>{
  const s=setup();s.loaded();s.button.emit('click');s.scroll(2200);assert.equal(s.seeks,0);
  s.button.emit('click');s.tick();assert.ok(s.video.currentTime>4.5);s.video.emit('seeked');
  const last=s.video.currentTime;s.doc.hidden=true;s.scroll(4500);assert.equal(s.video.currentTime,last);
  s.doc.hidden=false;s.doc.emit('visibilitychange');s.tick();assert.ok(s.video.currentTime>last);
});
test('a media error restores static readable papers and hides an unusable control',()=>{
  const s=setup();s.video.emit('error');assert.equal(s.doc['story-enabled'],false);
  assert.equal(s.video.getAttribute('src'),null);assert.equal(s.button.hidden,true);assert.equal(s.pending,0);
});
