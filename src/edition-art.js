/* Original, self-contained vector bande-dessinee assets. No external image service. */
(function(){
'use strict';
const ink='#182f48',cream='#fff1cd',blue='#376f9b',red='#b74a42',gold='#d5a349';
const uri=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const path=(d,fill=cream,stroke=ink,w=4)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
const rect=(x,y,w,h,fill,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
const circle=(x,y,r,fill,sw=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/>`;
function gear(x,y,r,fill=gold){return `<g transform="translate(${x} ${y})">`+Array.from({length:12},(_,i)=>`<g transform="rotate(${i*30})">${rect(-r*.14,-r*1.14,r*.28,r*.4,fill,2)}</g>`).join('')+circle(0,0,r*.85,fill)+circle(0,0,r*.35,cream)+'</g>';}
function emblem(i){if(i===0)return path('M20 53H160L139 76H108V100H57V77H37Z',blue)+path('M73 16L86 10L123 56L111 65Z',gold)+path('M62 13L84 0L112 26L91 43Z',ink);if(i===1)return gear(92,54,43);if(i===2)return path('M89 3L148 25V64Q145 105 89 125Q34 105 31 64V25Z',blue)+path('M89 18V103M47 42H131','none',cream,8);if(i===3)return path('M31 10H143V34H57V108H31Z',gold)+path('M76 51L90 36L155 99L141 113Z',blue);if(i===4)return gear(91,58,45,blue)+path('M65 57L85 76L119 36','none',cream,9);return circle(78,46,34,cream)+path('M101 74L141 113','none',red,16)+path('M59 45L75 58L98 29','none',blue,6);}
function person(i,x,y,s=1){const coats=[blue,'#536f78',red,'#426d70','#a86e39','#695875',ink],skin=['#e4ad7c','#edc399','#c89576','#d8aa86','#efc699','#b67f60','#dba97e'][i],beard=[true,false,false,true,false,false,true][i],hair=['#61402f','#3b302c','#563927','#9a958a','#593a2a','#242e35','#d3cdc2'][i];
return `<g transform="translate(${x} ${y}) scale(${s})">`+
path('M42 292L51 198H141L160 292Z',ink)+path('M28 144Q47 118 77 120H111Q143 120 167 144L153 238H42Z',coats[i])+
path('M54 130L72 126L79 166H112L121 128L140 138L144 247H51Z',i%2?cream:'#aa774f')+
path('M41 143Q18 148 13 178L28 218L50 207L40 176L56 155Z',coats[i])+path('M151 145Q170 148 177 177L154 216L136 201L150 172L139 154Z',coats[i])+
path('M28 214Q27 190 44 193L70 204L63 219Z',skin)+path('M155 211Q166 190 150 189L126 201L131 216Z',skin)+
rect(80,102,28,29,skin,7)+path('M58 54Q59 16 95 16Q135 16 137 56L127 96Q111 125 86 113L64 90Z',skin)+
path('M56 66Q39 13 84 6Q130 -3 142 34L134 68L120 41Q87 57 65 39L65 72Z',hair)+
(i===2||i===5?path('M63 35Q70 15 104 22Q130 28 131 42L127 4Q91 -13 56 16Z',i===2?cream:blue):path('M51 29Q61 2 99 0Q133 5 142 33L56 45Z',coats[i])+path('M53 36Q86 22 145 36L157 43L59 50Z',coats[i]))+
path('M77 64L87 62M109 62L119 65','none',ink,3)+circle(83,69,2.7,ink,1)+circle(113,69,2.7,ink,1)+path('M98 71L93 87H102','none',ink,2)+
(beard?path('M65 84L81 91L97 89L113 93L129 82L121 111L98 124L78 111Z',hair)+path('M87 99Q100 105 111 98','none',ink,2):path('M86 98Q101 107 113 96','none',ink,2))+
(i===1||i===5||i===6?circle(82,70,12,'none',2)+circle(113,70,12,'none',2)+path('M94 69H101','none',ink,2):'')+
`<g transform="translate(39 176) scale(.61)">${emblem(i%6)}</g>`+path('M55 249L67 249M138 249L146 249','none',cream,3)+'</g>';}
function houses(){return '<g>'+rect(0,268,1200,292,'#d8c9a4')+Array.from({length:7},(_,i)=>{const x=i*180-20,h=120+(i%3)*26;return rect(x,220-h,155,h+230,cream)+path(`M${x-9} ${220-h}L${x+76} ${138-h}L${x+164} ${220-h}Z`,i%2?red:blue)+path(`M${x+12} ${226-h}V443M${x+77} ${224-h}V443M${x+141} ${224-h}V443M${x+8} ${308-h}H${x+146}M${x+8} ${397-h}H${x+146}M${x+12} ${226-h}L${x+141} ${397-h}M${x+141} ${226-h}L${x+12} ${397-h}`,'none','#67533e',7)+rect(x+48,253-h,35,45,blue)+rect(x+95,345-h,30,41,blue);}).join('')+'</g>';}
function sky(){return rect(0,0,1200,800,'#e9d7b1')+rect(0,0,1200,460,'#add2dc')+circle(936,116,64,cream,0)+path('M0 130Q95 83 154 130T321 135Q380 87 453 130M670 67Q708 41 776 68','none',cream,14)+houses();}
function frame(w,h){return `<rect x="9" y="9" width="${w-18}" height="${h-18}" fill="none" stroke="${ink}" stroke-width="15"/><path d="M18 25H${w-25}M25 ${h-25}H${w-25}" stroke="${cream}" stroke-width="3"/>`;}
function svg(w,h,body){return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${ink}" opacity=".12"/></pattern></defs>${body}${frame(w,h)}</svg>`);}
function guardian(){return '<g transform="translate(475 115)">'+
path('M38 510L54 397H112L117 510Z',blue)+path('M152 510L162 397H220L237 510Z',blue)+rect(30,504,93,37,ink,8)+rect(149,504,96,37,ink,8)+
path('M30 209L73 183H197L241 209L216 392L179 422H92L57 393Z',blue)+path('M63 201L134 230L207 201L211 360L137 402L65 360Z',cream)+gear(137,303,44)+
rect(82,119,108,80,blue,22)+path('M72 122L82 105H192L202 122Z',gold)+path('M135 106V63L160 97','none',red,9)+rect(99,144,24,12,cream,3)+rect(150,144,24,12,cream,3)+path('M116 178H158','none',ink,4)+
circle(31,224,32,gold)+circle(240,224,32,gold)+path('M3 250L-17 346L23 359L60 263Z',blue)+path('M218 263L251 358L291 345L268 248Z',blue)+gear(5,365,23)+gear(273,365,23)+
path('M75 395H202','none',gold,13)+'</g>';}
const workshop=sky()+path('M0 0H1200V60H0Z',ink)+path('M72 0V571H114V0M1080 0V571H1120V0',ink)+path('M75 82L587 17L1120 82','none',ink,18)+gear(242,226,80)+gear(915,250,68,blue)+guardian()+person(0,106,339,1.13)+person(1,897,323,1.19)+rect(35,648,1130,90,'#b08351')+path('M61 684H1132','none',cream,5)+rect(74,733,28,67,ink)+rect(1086,733,28,67,ink)+`<g transform="translate(190 633) scale(.85)">${emblem(0)}</g>`+gear(980,677,41)+path('M366 87L393 110M349 117L372 121M789 123L815 95','none',gold,6);
const ledger=sky()+path('M0 432Q390 366 1200 432V800H0Z',blue)+path('M0 497Q250 461 462 506T921 498T1200 511M0 562Q330 527 570 562T1200 570','none','#afcdd2',6)+path('M0 434H1200V496H0Z','#c9ba91')+Array.from({length:8},(_,i)=>path(`M${i*161-10} 493V537Q${i*161+61} 459 ${i*161+127} 537V493Z`,cream)).join('')+person(1,175,296,1.14)+person(5,816,286,1.19)+rect(127,565,940,137,'#ad754e')+rect(158,705,35,95,ink)+rect(1001,705,35,95,ink)+path('M396 591L609 567L812 593L767 685L579 668L411 690Z',cream)+path('M609 571L579 668M441 614L561 600M437 637L556 623M661 609L766 618M650 637L747 645','none',blue,4)+Array.from({length:6},(_,i)=>circle(302+i*17,642+(i%2)*13,17,gold)).join('')+path('M872 578V658M837 658H912M839 584H909M841 584L826 626H859ZM906 584L889 626H922Z','none',ink,5)+rect(38,620,65,80,red)+rect(1089,608,75,93,blue);
const council=rect(0,0,1200,800,'#c9b38d')+Array.from({length:5},(_,i)=>{const x=45+i*238;return path(`M${x} 403V144Q${x+83} 9 ${x+164} 144V403Z`,blue)+path(`M${x+82} 91V398M${x+7} 207H${x+157}M${x+7} 297H${x+157}`,'none',cream,9)+circle(x+82,150,27,gold)+path(`M${x-16} 74V531M${x+178} 74V531`,'none',ink,11);}).join('')+person(0,4,322,.97)+person(1,196,317,.97)+person(2,388,315,.97)+person(3,580,315,.97)+person(4,772,317,.97)+person(5,964,322,.97)+path('M84 583L1117 583L1191 773H12Z','#ae764d')+path('M362 622L635 599L889 663L595 726Z',cream)+path('M434 647L615 632L803 667L592 699Z','none',blue,4)+gear(591,661,28)+Array.from({length:6},(_,i)=>`<g transform="translate(${114+i*169} 561) scale(.39)">${emblem(i)}</g>`).join('');
const files=['ember','gear','arcane','anvil','titan','gaze'];const fr={
 'assets/ironhold-comic.webp':svg(1200,800,workshop),
 'assets/ironhold-ledger.webp':svg(1200,800,ledger),
 'assets/ironhold-council.webp':svg(1200,800,council)
};
files.forEach((name,i)=>{const bg=[gold,'#aacbd6','#dbaba0','#b4c8b1','#d0ae82','#bbb1c8'][i];fr['assets/guild-'+name+'.webp']=svg(480,480,rect(0,0,480,480,bg)+`<rect width="480" height="480" fill="url(#dots)"/>`+path('M46 431V145Q240 -56 434 145V431Z',cream)+path('M61 432V151Q239 -22 419 151V432','none',ink,3)+`<g transform="translate(166 38) scale(.8)">${emblem(i)}</g>`+person(i,77,138,1.65));});
fr['assets/game-master.webp']=svg(480,480,rect(0,0,480,480,blue)+path('M29 444V141Q240 -73 452 141V444Z',cream)+circle(242,117,77,gold)+person(6,76,145,1.7)+path('M60 410L218 390L400 410L379 468H87Z',cream)+path('M218 398V465M95 429H189M259 429H356','none',ink,4));
window.IronholdEditionArt={kz:{...(window.IronholdArt||{})},fr};
})();
