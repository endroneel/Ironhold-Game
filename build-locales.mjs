import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url);
const read=path=>fs.readFile(new URL(path,root),'utf8');
const lines=(await read('src/locale-phrases.tsv')).trim().split('\n').map(l=>l.split('\t'));
for(const row of lines)if(row.length!==3||row.some(x=>!x.trim()))throw Error('Invalid locale row: '+row[0]);
// Russian rows have stable sequence IDs. Refuse a build if source keys drift.
const sourceHash=createHash('sha256').update(lines.map(r=>r[0]).join('\n')).digest('hex');
if(sourceHash!=='d5f1cb470e195360c7c2dcc3b7e347abdc659f052a577bfc621b10a21e05f9d3')throw Error('English locale keys changed: review Russian sequence mapping before building.');
const russian=(await read('src/locale-ru.txt')).trim().split('\n').map(l=>l.split('\t'));
if(russian.length!==lines.length)throw Error('Russian coverage count mismatch');
russian.forEach(([id,value],i)=>{if(Number(id)!==i+1||!value?.trim())throw Error('Invalid Russian translation at '+(i+1));lines[i].push(value);});
const patterns=(await read('src/locale-patterns.tsv')).trim().split('\n').map(l=>l.split('\t'));
const ruPatterns=['Раунд $1 начинается.','Раунд $1 завершён','Передать выпуск этапа $1','Этап $1 из $2','$1 бросков записано · Последний завершённый бросок','В этом раунде отгружено $1 Титанов. Одобрено всего: $2.','Всего отгружено $1 Титанов. У всех гильдий $2 золотых.','Введите целое число от 1 до $1.','$1 ч, срок Р$2','$1 ч, срок — раунд $2','D10 завершён','Кость с $1 гранями'];
if(patterns.length!==ruPatterns.length)throw Error('Russian dynamic-pattern count mismatch');
patterns.forEach((p,i)=>p.push(ruPatterns[i]));
const rules={fr:await read('src/locales/rules-fr.html'),kk:await read('src/locales/rules-kk.html'),ru:await read('src/locales/rules-ru.html')};
await fs.writeFile(new URL('src/locales.js',root),(await read('src/editions.js'))+'\nwindow.IronholdLocalePatterns='+JSON.stringify(patterns)+';\nwindow.IronholdLocaleData='+JSON.stringify(lines)+';\nwindow.IronholdRuleLocales='+JSON.stringify(rules)+';\n'+await read('src/locales-runtime.js'));
console.log('Built '+lines.length+' phrases in English/French/Kazakh/Russian, three translated rulebooks and two independent country editions');
