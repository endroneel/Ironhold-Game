'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM,VirtualConsole}=require('jsdom');
const data=JSON.parse(fs.readFileSync(__dirname+'/../src/dice-guide-data.json','utf8'));
function open(country,lang){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(__dirname+'/../'+country+'.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.test/'+country+'.html?lang='+lang+'#guide-guild-rules',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.confirm=()=>true;}});
 return {dom,w:dom.window,errors};
}
for(const country of ['france','kazakhstan'])for(const lang of (country==='france'?['en','fr','ru']:['en','kk','ru']))test(country+' rulebook in '+lang,()=>{
 const {dom,w,errors}=open(country,lang);
 try{
  assert.equal(w.IronholdV4.VERSION,'4.1.0');assert.equal(w.IronholdGuideData.guideRevision,data.revision);
  for(const id of ['guild-rules','gm-rules']){
   const rendered=w.IronholdHandbook.render(lang,country==='france'?'fr':'kz',id,true);
   const box=w.document.createElement('div');box.innerHTML=rendered;
   assert.equal(box.querySelectorAll('.guide-print-page').length,4);
   for(const key of Object.keys(data.blocks))assert.equal(box.querySelector('[data-guide-block="'+key+'"] h3').textContent,data.blocks[key].title[lang]);
   assert(w.IronholdGuidePDFs[id].base64.startsWith('JVBER'));
  }
  assert.equal(w.document.querySelector('[data-guide-document]').getAttribute('data-guide-document'),'guild-rules');
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
test('documented current D6 and D10 outcomes match engine',()=>{
 const {dom,w}=open('france','en'),E=w.IronholdV4;
 function fault(u){
  let s=E.newGame({startingGold:30,seed:'dice-guide-test'});
  s.overrides['1:-1:supplier:0']=.9;s.overrides['1:0:machine:0']=u;s.overrides['1:0:machineCause:0']=.1;
  s=E.dispatch(s,{type:'source',votes:['standard','standard','standard'],reason:'Test supply'});
  return E.dispatch(s,{type:'plan',team:0,prediction:{output:2,cost:0,risk:20},reason:'Test prediction'});
 }
 try{
  for(let n=1;n<=6;n++){
   let s=fault(.15);assert.equal(s.phase,'remedy');assert.equal(E.row(s).initialOutput,1);
   s=E.dispatch(s,{type:'remedy',action:'corrective',reason:'Test correction'});
   s=E.dispatch(s,{type:'roll',value:n});assert.equal(E.row(s).verified,n>=2);assert.equal(E.forecast(s),1);assert.equal(E.row(s).repairHours,4);
   assert.equal(s.teams[0].prevention.drive||0,n>=2?4:0);
  }
  for(let n=0;n<=10;n++){
   let s=fault(.05);assert.equal(s.phase,'diagnosticRoll');assert.equal(E.row(s).initialOutput,0);
   const gold=s.teams[0].gold;s=E.dispatch(s,{type:'roll',value:n});
   assert.equal(E.row(s).diagnostic.value,n===0?10:n);assert.equal(E.row(s).diagnosed,n===0||n>=6);assert.equal(s.teams[0].gold,gold);assert.equal(s.phase,'remedy');
   assert.throws(()=>E.dispatch(s,{type:'roll',value:8}));
  }
  let s=fault(.9);assert.equal(s.phase,'production');assert.equal(E.forecast(s),2);
 }finally{dom.window.close();}
});
test('legacy production 0, 1 and 2 examples match original engine',()=>{
 const E=require('../src/engine.js');
 function after(first,signal,solution){
  let s=E.newGame({startingGold:30});s=E.dispatch(s,{type:'die',value:first});
  if(first<=3){s=E.dispatch(s,{type:'die',value:2});s=E.dispatch(s,{type:'signal',value:signal});s=E.dispatch(s,{type:'die',value:solution});}
  s=E.dispatch(s,{type:'die',value:6});s=E.dispatch(s,{type:'release'});return s.rows.find(r=>r.round===1&&r.team===0).output;
 }
 assert.equal(after(2,'Red',1),0);assert.equal(after(2,'Red',3),1);assert.equal(after(5),2);
 const html=fs.readFileSync(__dirname+'/../index.html','utf8');assert(html.includes('data-dice-guide="legacy"'));assert(html.includes('no production die'));
});
