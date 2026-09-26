const fs=require('node:fs'),assert=require('node:assert/strict'),{JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const tick=()=>new Promise(r=>setImmediate(r));
function open(url='https://example.test/',setup){const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(html,{runScripts:'dangerously',url,virtualConsole:vc,beforeParse(w){w.confirm=()=>true;if(setup)setup(w);}});return {dom,w:dom.window,errors};}
(async()=>{
 const {dom,w,errors}=open(),d=w.document,$=id=>d.getElementById(id),locale=w.IronholdLocale;
 assert(locale,'locale runtime initialized');assert.equal(locale.setting,'kz');assert.equal(locale.language,'en');
 assert.equal(d.querySelectorAll('button[data-setting]').length,2);assert.equal(d.querySelectorAll('button[data-language]').length,4);
 assert.equal(w.IronholdLocaleData.length,486);assert(w.IronholdLocaleData.every(r=>r.length===4&&r[3].trim()));
 const originals=w.Ironhold.TEAMS.map(t=>t.name),kzArt={...w.IronholdArt};
 const keys=Object.keys(w.IronholdEditionArt.fr);assert.equal(keys.length,10);assert.equal(new Set(Object.values(w.IronholdEditionArt.fr)).size,10);
 d.querySelector('[data-setting=fr]').click();assert.equal(locale.setting,'fr');assert.equal(locale.language,'en');
 assert(d.querySelector('h1').textContent.includes('Guilds of France'));assert($('role-options').textContent.includes('Forges de Normandie'));assert(!$('role-options').textContent.includes('Saryarqa'));
 for(const lang of ['en','ru','fr','kk']){
  locale.setLanguage(lang);assert.equal(locale.setting,'fr');assert.equal(d.documentElement.lang,lang);
  assert.equal($('setting-controls').querySelector('[data-setting=fr]').getAttribute('aria-pressed'),'true');
  for(const path of keys)assert.notEqual(w.IronholdArt[path],kzArt[path]);
  d.querySelectorAll('img[data-art]').forEach(img=>assert.equal(img.getAttribute('src'),w.IronholdArt[img.dataset.art]));
  assert(d.querySelector('#rules-view .rules').textContent.includes(w.IronholdEditions.fr.guilds[0][lang]));
  assert(!d.querySelector('#rules-view .rules').textContent.includes('Saryarqa'));
  assert.equal(d.querySelector('.credit').textContent,'designed and deployed by Indranil BISWAS');
 }
 locale.setLanguage('ru');assert($('role-entry').textContent.includes('Выберите свою роль'));assert($('rules-view').textContent.includes('32 ч / 7 золотых'));assert($('rules-view').textContent.includes('96')===false);
 d.querySelector('[data-role=gm]').click();$('starting-gold').value='30';$('setup-form').dispatchEvent(new w.Event('submit',{cancelable:true}));await tick();
 assert($('action').textContent.includes('Бросок производства'));
 let save=w.localStorage.getItem('ironhold-standalone-3.0.0');assert(save);
 for(const country of ['kz','fr'])for(const lang of ['en','ru','fr','kk']){
  locale.setSetting(country);locale.setLanguage(lang);await tick();
  assert.equal(w.localStorage.getItem('ironhold-standalone-3.0.0'),save);
  assert.equal(JSON.stringify(w.Ironhold.TEAMS.map(t=>t.name)),JSON.stringify(originals));
  assert($('action').textContent.includes(w.IronholdEditions[country].guilds[0][lang]));
 }
 locale.setSetting('fr');locale.setLanguage('ru');$('manual-die').value=2;$('record-die').click();await tick();assert($('roll-summary').textContent.includes('Требуется D10'));
 $('continue-roll').click();await tick();assert($('action').textContent.includes('Бросок события закупок'));$('manual-die').value=2;$('record-die').click();await tick();$('continue-roll').click();await tick();assert($('action').textContent.includes('Как вы отреагируете'));
 d.querySelector('[data-signal=Red]').click();await tick();$('manual-die').value=1;$('record-die').click();await tick();
 assert($('ledger').textContent.includes('Практикум закупок'));assert($('ledger').textContent.includes('Доступная мощность'));assert($('ledger').textContent.includes('Начальное золото + чистые переводы'));
 save=w.localStorage.getItem('ironhold-standalone-3.0.0');const state=w.Ironhold.deserialize(save);assert.equal(state.teams[0].gold,29);
 $('switch-role').click();d.querySelector('[data-role="1"]').click();await tick();assert($('guild-workspace').textContent.includes('Бросить кости'));assert($('guild-workspace').textContent.includes('Цель и подготовка'));
 locale.setSetting('kz');assert.equal(locale.language,'ru');assert($('guild-workspace').textContent.includes('Механики Алтая'));assert($('guild-workspace').textContent.includes('Сарыарка'));assert.equal(w.localStorage.getItem('ironhold-standalone-3.0.0'),save);
 for(const [path,src] of Object.entries(kzArt))assert.equal(w.IronholdArt[path],src);
 locale.setLanguage('en');locale.setSetting('fr');assert.equal(w.localStorage.getItem('ironhold-setting'),'fr');assert.equal(new URL(w.location.href).searchParams.get('setting'),'fr');
 locale.setSetting('invalid');locale.setLanguage('invalid');assert.equal(locale.setting,'fr');assert.equal(locale.language,'en');
 assert.equal(errors.length,0,errors.join('\n'));dom.window.close();
 const direct=open('https://example.test/?setting=fr&lang=ru');assert.equal(direct.w.IronholdLocale.setting,'fr');assert.equal(direct.w.IronholdLocale.language,'ru');assert(direct.w.document.querySelector('h1').textContent.includes('Гильдии Франции'));assert.equal(direct.errors.length,0);direct.dom.window.close();
 const saved=open('https://example.test/',w=>{w.localStorage.setItem('ironhold-setting','fr');w.localStorage.setItem('ironhold-language','ru');});assert.equal(saved.w.IronholdLocale.setting,'fr');assert.equal(saved.w.IronholdLocale.language,'ru');saved.dom.window.close();
 const invalid=open('https://example.test/?setting=bad&lang=xx',w=>{w.localStorage.setItem('ironhold-setting','invalid');w.localStorage.setItem('ironhold-language','invalid');});assert.equal(invalid.w.IronholdLocale.setting,'kz');assert.equal(invalid.w.IronholdLocale.language,'en');invalid.dom.window.close();
 console.log('PASS 2 country x 4 language combinations; 10 distinct French assets; localized rules, roles, dice, calculations; unchanged engine and saves; deep links and persisted preferences');
})().catch(err=>{console.error(err);process.exitCode=1;});
