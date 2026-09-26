(function(){
'use strict';
const entries=window.IronholdLocaleData, rules=window.IronholdRuleLocales;
const table=new Map(entries.map(([en,fr,kk])=>[en,{fr,kk}]));
const escaped=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}])(?:'+[...table.keys()].sort((a,b)=>b.length-a.length).map(escaped).join('|')+')(?![\\p{L}])','gu');
let language='en';try{const saved=localStorage.getItem('ironhold-language');if(['en','fr','kk'].includes(saved))language=saved;}catch{}
const source=new WeakMap(),attributes=new WeakMap();
const dynamic=window.IronholdLocalePatterns.map(([re,fr,kk])=>({re:new RegExp(re,'g'),fr,kk}));
function text(value,lang=language){if(lang==='en')return value;const held=[];let out=value;for(const p of dynamic)out=out.replace(p.re,(...args)=>{const translated=p[lang].replace(/\$(\d+)/g,(_,n)=>args[Number(n)]);const token='\uE000'+held.length+'\uE001';held.push(translated);return token;});out=out.replace(pattern,key=>table.get(key)?.[lang]||key);return out.replace(/\uE000(\d+)\uE001/g,(_,n)=>held[n]);}
const skip=el=>!el||el.closest('script,style,textarea,input,[translate="no"],[data-rules-localized]');
const ruleRoot=document.querySelector('#rules-view .rules');rules.en=ruleRoot.innerHTML;
function setRules(el){if(el.dataset.rulesLocalized!==language){el.innerHTML=rules[language];el.dataset.rulesLocalized=language;}}
function apply(){observer.disconnect();document.documentElement.lang=language;
 setRules(ruleRoot);
 const common=document.querySelector('#guild-workspace>details');if(common){let content=common.querySelector('[data-rules-localized]');if(!content){const summary=common.querySelector('summary');common.replaceChildren(summary);content=document.createElement('div');common.append(content);}setRules(content);}
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){if(skip(node.parentElement)||!node.nodeValue.trim())continue;const old=source.get(node),raw=old&&old.last===node.nodeValue?old.raw:node.nodeValue,out=text(raw);if(node.nodeValue!==out)node.nodeValue=out;source.set(node,{raw,last:out});}
 document.querySelectorAll('[placeholder],[title],[aria-label],img[alt]').forEach(el=>{if(skip(el))return;let saved=attributes.get(el)||{};for(const key of ['placeholder','title','aria-label','alt']){if(!el.hasAttribute(key))continue;const current=el.getAttribute(key),old=saved[key],raw=old&&old.last===current?old.raw:current,out=text(raw);if(out!==current)el.setAttribute(key,out);saved[key]={raw,last:out};}attributes.set(el,saved);});
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
 document.title=text('Ironhold · Steppe Guilds');observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}
const observer=new MutationObserver(apply);
function setLanguage(lang){if(!['en','kk','fr'].includes(lang))return;language=lang;try{localStorage.setItem('ironhold-language',lang);}catch{}apply();}
document.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>setLanguage(b.dataset.language));
window.IronholdLocale={text,setLanguage,apply,get language(){return language;}};
const originalConfirm=window.confirm.bind(window);window.confirm=message=>originalConfirm(text(message));
apply();
})();
