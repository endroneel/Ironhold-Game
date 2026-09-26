import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const lines=(await fs.readFile(new URL('src/locale-phrases.tsv',root),'utf8')).trim().split('\n').map(l=>l.split('\t'));
for(const row of lines)if(row.length!==3||row.some(x=>!x.trim()))throw Error('Invalid locale row: '+row[0]);
const patterns=(await fs.readFile(new URL('src/locale-patterns.tsv',root),'utf8')).trim().split('\n').map(l=>l.split('\t'));
const rules={fr:await fs.readFile(new URL('src/locales/rules-fr.html',root),'utf8'),kk:await fs.readFile(new URL('src/locales/rules-kk.html',root),'utf8')};
await fs.writeFile(new URL('src/locales.js',root),'window.IronholdLocalePatterns='+JSON.stringify(patterns)+';\nwindow.IronholdLocaleData='+JSON.stringify(lines)+';\nwindow.IronholdRuleLocales='+JSON.stringify(rules)+';\n'+await fs.readFile(new URL('src/locales-runtime.js',root),'utf8'));
console.log('Built '+lines.length+' locale phrases and two translated rulebooks');
