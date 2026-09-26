(function(){
'use strict';
const editions=window.IronholdEditions,labels=window.IronholdEditionLabels;
const languages=['en','ru','fr','kk'],settings=['kz','fr'];
let language='en',setting='kz';
try{const lang=localStorage.getItem('ironhold-language'),country=localStorage.getItem('ironhold-setting');if(languages.includes(lang))language=lang;if(settings.includes(country))setting=country;}catch{}
try{const params=new URL(location.href).searchParams;if(languages.includes(params.get('lang')))language=params.get('lang');if(settings.includes(params.get('setting')))setting=params.get('setting');}catch{}
const pick=(values,lang=language)=>values[lang]||values.en;
const entries=window.IronholdLocaleData,rules=window.IronholdRuleLocales;
const table=new Map(entries.map(([en,fr,kk,ru])=>[en,{en,fr,kk,ru}]));
const escaped=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}])(?:'+[...table.keys()].sort((a,b)=>b.length-a.length).map(escaped).join('|')+')(?![\\p{L}])','gu');
const dynamic=window.IronholdLocalePatterns.map(([re,fr,kk,ru])=>({re:new RegExp(re,'g'),fr,kk,ru}));
const intro='The Iron Tyrant is approaching. Frames, engines and enchanted armor must move through the factory to become battle-ready Titans. Each local decision can help—or hold back—the whole city.';
const originalNames=window.Ironhold.TEAMS.map(t=>t.name);
const contextual=new Map([['Ironhold · Steppe Guilds',lang=>pick(editions[setting].title,lang)],[intro,lang=>pick(editions[setting].story,lang)],...originalNames.map((name,i)=>[name,lang=>pick(editions[setting].guilds[i],lang)])]);
const contextPattern=new RegExp([...contextual.keys()].sort((a,b)=>b.length-a.length).map(escaped).join('|'),'g');
function text(value,lang=language){
 value=String(value??'');if(value.trim()==='designed and deployed by Indranil BISWAS')return value;
 if(!languages.includes(lang))lang='en';
 const held=[],hold=s=>{const token='\uE000'+held.length+'\uE001';held.push(s);return token;};
 let out=value.replace(contextPattern,key=>hold(contextual.get(key)(lang)));
 if(lang!=='en'){
  for(const p of dynamic)if(p[lang])out=out.replace(p.re,(...args)=>hold(p[lang].replace(/\$(\d+)/g,(_,n)=>args[Number(n)])));
  out=out.replace(pattern,key=>table.get(key)?.[lang]||key);
 }
 return out.replace(/\uE000(\d+)\uE001/g,(_,n)=>held[n]??'');
}
const controls=document.querySelector('.language-switch');
controls.className='language-switch edition-controls';controls.setAttribute('translate','no');
controls.innerHTML='<div class="edition-control-row"><div class="edition-control-group" role="group" id="setting-controls"><span class="edition-control-label" data-edition-label="setting"></span><button type="button" data-setting="fr" lang="fr">🇫🇷 France · Français</button><button type="button" data-setting="kz" lang="kk">🇰🇿 Kazakhstan · Қазақша</button></div><div class="edition-control-group" role="group" id="language-controls"><span class="edition-control-label" data-edition-label="language"></span><button type="button" data-language="en" lang="en">English</button><button type="button" data-language="ru" lang="ru">Русский</button><button type="button" data-language="fr" lang="fr">Français</button><button type="button" data-language="kk" lang="kk">Қазақша</button></div></div><p class="edition-hint" data-edition-label="independent"></p>';
const banner=document.createElement('section');banner.id='edition-banner';banner.setAttribute('translate','no');
banner.innerHTML='<img data-art="assets/ironhold-comic.webp" width="1200" height="800" alt=""><div class="edition-banner-copy"><p class="eyebrow" data-edition-field="place"></p><h3 data-edition-field="title"></h3><p data-edition-field="summary"></p><small data-edition-label="fiction"></small></div>';
document.getElementById('role-options').before(banner);
const source=new WeakMap(),attributes=new WeakMap();
const skip=el=>!el||el.closest('script,style,textarea,input,[translate="no"],[data-rules-localized]');
const ruleRoot=document.querySelector('#rules-view .rules');rules.en=ruleRoot.innerHTML;
function setRules(el){
 const key=setting+':'+language;if(el.dataset.rulesLocalized===key)return;
 const states=[...el.querySelectorAll('details')].map(d=>d.open);
 el.innerHTML=rules[language]||rules.en;
 let story=el.querySelector('[data-edition-story]');
 if(!story){const paras=[...el.children].filter(n=>n.tagName==='P'&&!n.classList.contains('eyebrow'));story=language==='en'?paras.find(n=>n.textContent.startsWith('In this fictional')):paras[0];}
 if(story){story.textContent=pick(editions[setting].story);story.dataset.editionStory='';}
 const eyebrow=el.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent=pick(editions[setting].place);
 el.querySelectorAll('details').forEach((d,i)=>{if(i<states.length)d.open=states[i];});
 el.dataset.rulesLocalized=key;
}
// Track logical assets, not the current data URL, so fresh UI renders and existing
// images both switch correctly. The engine and saved action history stay canonical.
const artSets=window.IronholdEditionArt||{kz:window.IronholdArt||{},fr:{}};
const pathBySource=new Map();for(const art of Object.values(artSets))for(const [path,src] of Object.entries(art)){pathBySource.set(src,path);pathBySource.set(path,path);}
const portraitNames=['ember','gear','arcane','anvil','titan','gaze'];
function applyArtwork(){
 const art=artSets[setting];window.IronholdArt=art;
 for(const [tab,name] of Object.entries({play:'comic',ledger:'ledger',rules:'council'})){
  const value=art['assets/ironhold-'+name+'.webp'];if(value)document.documentElement.style.setProperty('--scene-'+tab,'url("'+value+'")');
 }
 document.querySelectorAll('img').forEach(img=>{
  const path=img.dataset.art||pathBySource.get(img.getAttribute('src'));
  if(!path||!art[path])return;img.dataset.art=path;
  if(img.getAttribute('src')!==art[path])img.src=art[path];
  if(img.getAttribute('aria-hidden')==='true'||img.closest('[aria-hidden="true"]'))return;
  const index=portraitNames.findIndex(name=>path==='assets/guild-'+name+'.webp');
  img.alt=index>=0?pick(editions[setting].guilds[index])+' — '+text(window.Ironhold.TEAMS[index].role)+' · '+text('comic portrait'):pick(editions[setting].artAlt);
 });
}
let observer;
function apply(){
 observer?.disconnect();document.documentElement.lang=language;document.documentElement.dataset.setting=setting;
 setRules(ruleRoot);
 const common=document.querySelector('#guild-workspace>details');if(common){let content=common.querySelector('[data-rules-localized]');if(!content){const summary=common.querySelector('summary');common.replaceChildren(summary);content=document.createElement('div');common.append(content);}setRules(content);}
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){
  if(skip(node.parentElement)||!node.nodeValue.trim())continue;
  const old=source.get(node),raw=old&&old.last===node.nodeValue?old.raw:node.nodeValue,out=text(raw);
  if(node.nodeValue!==out)node.nodeValue=out;source.set(node,{raw,last:out});
 }
 document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
  if(el.closest('script,style,[translate="no"],[data-rules-localized]'))return;
  const saved=attributes.get(el)||{};
  for(const key of ['placeholder','title','aria-label']){if(!el.hasAttribute(key))continue;const current=el.getAttribute(key),old=saved[key],raw=old&&old.last===current?old.raw:current,out=text(raw);if(out!==current)el.setAttribute(key,out);saved[key]={raw,last:out};}
  attributes.set(el,saved);
 });
 document.querySelectorAll('[data-edition-label]').forEach(el=>{const value=pick(labels[el.dataset.editionLabel]);if(el.textContent!==value)el.textContent=value;});
 document.querySelectorAll('[data-edition-field]').forEach(el=>{const value=pick(editions[setting][el.dataset.editionField]);if(el.textContent!==value)el.textContent=value;});
 document.getElementById('setting-controls').setAttribute('aria-label',pick(labels.setting));
 document.getElementById('language-controls').setAttribute('aria-label',pick(labels.language));
 controls.setAttribute('aria-label',pick(labels.setting)+' · '+pick(labels.language));
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
 document.querySelectorAll('[data-setting]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.setting===setting));});
 applyArtwork();document.title=pick(editions[setting].title);
 observer?.observe(document.body,{subtree:true,childList:true,characterData:true});
}
observer=new MutationObserver(apply);
function persistPreferences(){try{localStorage.setItem('ironhold-language',language);localStorage.setItem('ironhold-setting',setting);}catch{}try{const url=new URL(location.href);url.searchParams.set('setting',setting);url.searchParams.set('lang',language);history.replaceState(history.state,'',url.href);}catch{}}
function setLanguage(lang){if(!languages.includes(lang))return;language=lang;persistPreferences();apply();}
function setSetting(country){if(!settings.includes(country))return;setting=country;persistPreferences();apply();}
controls.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>setLanguage(b.dataset.language));
controls.querySelectorAll('[data-setting]').forEach(b=>b.onclick=()=>setSetting(b.dataset.setting));
window.IronholdLocale={text,setLanguage,setSetting,apply,get language(){return language;},get setting(){return setting;}};
window.IronholdEdition={setSetting,get setting(){return setting;}};
const originalConfirm=window.confirm.bind(window);window.confirm=message=>originalConfirm(text(message));
apply();
})();
