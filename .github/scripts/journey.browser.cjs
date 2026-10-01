const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const results=[];
const base=process.env.STORY_BASE_URL || 'http://127.0.0.1:4173';
for(const [width,height] of [[1440,1000],[390,844],[320,720],[844,390]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon'))errors.push(m.text())});
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('main>.scene').count(),15);
 for(const id of await page.locator('main>.scene').evaluateAll(es=>es.map(e=>e.id))){
  await page.evaluate(id=>document.getElementById(id).scrollIntoView(),id);await page.waitForTimeout(30);
  const state=await page.locator('#'+id).evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth,text:[...el.querySelectorAll('h1,h2,p,a')].every(e=>getComputedStyle(e).opacity==='1'),broken:[...el.querySelectorAll('img')].some(i=>i.complete&&i.naturalWidth===0)}));
  assert(!state.overflow,`${width} overflow ${id}`);assert(state.text,`${width} faded ${id}`);assert(!state.broken,`${width} image ${id}`);
 }
 // Every menu anchor lands on a readable scene without another scroll.
 for(const hash of await page.locator('.menu a[href^="#"]').evaluateAll(es=>es.map(e=>e.hash))){
  await page.locator('.menu summary').click();
  await page.locator('.menu a[href="'+hash+'"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.id),hash.slice(1));
  assert.equal(await page.locator(hash+' h2').evaluate(e=>getComputedStyle(e).opacity),'1');
 }
 // Menu arrival must be fully readable without a follow-up scroll.
 await page.locator('.menu summary').click();await page.getByRole('link',{name:'Rok 2023',exact:true}).click();
 assert.equal(await page.locator('.menu').getAttribute('open'),null);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'svatba');
 assert.equal(await page.locator('.vow').evaluate(e=>getComputedStyle(e).opacity),'1');
 const before=await page.evaluate(()=>({y:scrollY,top:document.querySelector('#svatba').getBoundingClientRect().top,height:document.documentElement.scrollHeight}));
 // Click viewport coordinates: locator.click scrolls sticky controls into the root scroll-padding.
 const button=await page.locator('.motion-toggle').boundingBox();
 for(let i=0;i<6;i++)await page.mouse.click(button.x+30,button.y+20);
 const after=await page.evaluate(()=>({y:scrollY,top:document.querySelector('#svatba').getBoundingClientRect().top,height:document.documentElement.scrollHeight}));
 assert.deepEqual(after,before,'toggle must preserve position and geometry');
 await page.locator('.motion-toggle').evaluate(e=>e.focus({preventScroll:true}));
 await page.keyboard.press('Space');await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>scrollY),before.y);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.motion-toggle').disabled);assert(await page.locator('.motion-toggle').isDisabled());assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');
 assert.equal(await page.evaluate(()=>scrollY),before.y);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!document.querySelector('.motion-toggle').disabled);
 await page.locator('.motion-toggle').click();await page.reload();assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');await page.locator('.motion-toggle').click();
 await page.goto(base+'/#svatba');await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('.vow').evaluate(e=>getComputedStyle(e).opacity),'1');
 await page.locator('.menu summary').focus();await page.keyboard.press('Enter');assert(await page.locator('.menu').evaluate(e=>e.open));await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
 await page.goto(base+'/vzpominky/');await page.evaluate(()=>document.fonts.ready);
 assert(await page.getByText('Malá propojka, velké ambice',{exact:true}).count());
 assert.equal(await page.locator('.players-entry').count(),5);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'memories overflow');
 assert.equal(errors.length,0,JSON.stringify(errors));
 results.push({viewport:`${width}x${height}`,scenes:15,menu:'pass',anchors:'pass',motionToggles:6,systemReduced:'pass',keyboard:'pass',overflow:'none',console:errors});
 await page.close();
}
const nojs=await browser.newPage({viewport:{width:320,height:720},javaScriptEnabled:false});await nojs.goto(base+'/#svatba');assert(await nojs.locator('.vow').isVisible());assert.equal(await nojs.locator('.vow').evaluate(e=>getComputedStyle(e).opacity),'1');assert(await nojs.locator('.motion-toggle').isHidden());await nojs.close();
console.log(JSON.stringify({results,noJavaScript:'pass'},null,2));await browser.close();
})();
