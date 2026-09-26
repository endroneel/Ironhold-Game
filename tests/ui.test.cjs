// Optional UI test: install jsdom separately for development; not needed to play.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const dom=new JSDOM(html,{url:'https://example.test/ironhold/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.confirm=()=>true;w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};}});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
function click(id){assert($(id),'Missing control '+id);$(id).click();}
function die(n){$('manual-die').value=n;click('record-die');if($('continue-roll')){assert($('roll-result'));assert(!$('roll')&&!$('roll-d10'),'Dice must wait for result acknowledgement');click('continue-roll');}}
function saved(){return JSON.parse(w.localStorage.getItem('ironhold-standalone-3.0.0'));}
assert(!$('setup').hidden);assert.equal(d.querySelectorAll('#guild-directory svg').length,6);assert($('guild-directory').textContent.includes('Emberborn Smiths (Shop 1)'));assert(!/andon|jidoka/i.test(d.body.textContent));click('read-before');assert(!$('rules-view').hidden);
click('new-game');$('session-name').value='<img src=x onerror=alert(1)>';
$('setup-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert($('setup').hidden);assert(!$('game').hidden);assert.equal(d.querySelectorAll('#metrics img').length,0);
die(0);assert($('message').classList.contains('error'));assert.equal(saved().actions.length,0);
die(1);assert($('roll-result').textContent.includes('D10 required'));assert($('roll-d10'));assert(!$('roll'));die(3);assert($('roll-result').textContent.includes('Roll D10 again'));assert($('roll-d10'));die(8);click('submit-vote');assert($('message').textContent.includes('each'));
$('vote-0').value='change';$('vote-1').value='change';$('vote-2').value='keep';click('submit-vote');assert.equal(saved().actions.length,4);assert($('team-cards').textContent.includes('8 gold'));assert($('vendor-info').textContent.includes('round 6'));
die(6);assert($('roll-result').textContent.includes('No D10 required'));assert(!$('roll-d10'));click('release');die(6);die(6);click('release');die(6);click('release');die(6);click('release');assert($('action').textContent.includes('Round 1 complete'));click('next');assert($('action').textContent.includes('Release stage 1'));assert($('team-cards').textContent.includes('8 repair hours served'));
const checkpoint=saved();click('new-game');assert(!$('resume').hidden);click('resume');assert.equal(JSON.stringify(saved()),JSON.stringify(checkpoint));assert($('action').textContent.includes('Release stage 1'));
d.querySelector('[data-tab="ledger"]').click();assert(!$('ledger-view').hidden);assert($('ledger').textContent.includes('Voluntary vendor change'));
click('undo');assert.equal(saved().actions.length,checkpoint.actions.length-1);assert($('action').textContent.includes('Round 1 complete'));
d.querySelector('[data-tab="rules"]').click();assert(!$('rules-view').hidden);
assert.deepEqual(errors,[]);dom.window.close();console.log('PASS UI: standalone execution, setup, escaped names, invalid die, vendor vote, all four stages, repair queues, autosave/resume, ledger, undo and navigation.');
