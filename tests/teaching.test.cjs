const assert=require('node:assert/strict'),E=require('../src/engine.js'),T=require('../src/teaching.js');
let s=E.newGame();const act=a=>s=E.dispatch(s,a);
act({type:'transfer',from:0,to:1,amount:3,reason:'<script>support</script>'});
act({type:'exception',team:0,kind:'gold',amount:2,reason:'Recovery grant',instructor:'Instructor'});
while(s.pending.kind!=='roundEnd'){act(s.pending.kind==='release'?{type:'release'}:{type:'die',value:6});}
let d=T.roundData(s,1);assert.equal(d.shipments,2);assert.deepEqual(d.buffers,[0,0,0,0,0]);assert.equal(d.closing,62);assert.equal(d.teams[0].closing,9);assert.equal(d.teams[1].closing,13);assert.equal(d.teams[3].available,2);assert.equal(d.teams[3].capacity,2);assert(T.render(s).includes('&lt;script&gt;support&lt;/script&gt;'));assert(!T.render(s).includes('<script>'));
act({type:'next'});act({type:'die',value:1});act({type:'die',value:2});act({type:'signal',value:'Red'});act({type:'die',value:1}); // one base unit minus 4h => zero
while(s.pending.kind!=='roundEnd'){act(s.pending.kind==='release'?{type:'release'}:{type:'die',value:6});}
d=T.roundData(s,2);assert.equal(d.teams[0].capacity,0);assert.equal(d.teams[0].cost,1);assert.equal(d.teams[0].opening,9);assert.equal(d.teams[0].closing,8);assert.equal(d.shipments,0);assert.deepEqual(d.buffers,[0,2,2,0,0]);assert.equal(d.teams[3].row.signal,'Idle');assert(T.render(s).includes('undefined (no shipments)'));
// Instructor downtime costs zero; future service is not charged again.
act({type:'exception',team:1,kind:'downtime',amount:4,reason:'Transport disruption',instructor:'Instructor'});act({type:'next'});
d=T.roundData(s,3);assert.equal(d.complete,false);assert.equal(d.teams[1].cost,0);assert.deepEqual(d.openingBuffers,[0,2,2,0,0]);assert(T.render(s).includes('Output not released yet'));
// Settlement does not contaminate a completed production round.
const snapshot=JSON.stringify(T.roundData(s,2));s.tickets.push({round:2,settlement:true,team:0,cost:7});s.cashMoves.push({round:2,settlement:true,team:0,delta:5,kind:'game-master'});assert.equal(JSON.stringify(T.roundData(s,2)),snapshot);
console.log('PASS teaching: capacity, input constraints, material balances, cash reconciliation, timing, partial rounds, settlement separation and escaping');
