import './build-locales.mjs';
import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const read=path=>fs.readFile(new URL(path,root),'utf8');
let html=await read('src/index.html');
const css=(await read('src/style.css'))+'\n'+await read('src/editions.css');
const engine=await read('src/engine.js');
const teaching=await read('src/teaching.js');
const ui=await read('src/ui.js');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+css+'\n</style>');
html=html.replace('<script src="engine.js"></script><script src="teaching.js"></script><script src="ui.js"></script>',()=>'<script>\n'+engine+'\n</script>\n<script>\n'+teaching+'\n</script>\n<script>\n'+ui+'\n</script>');
const locales=await read('src/locales.js');
html=html.replace('<script src="locales.js"></script>',()=>'<script>\n'+locales+'\n</script>');
const artwork={};
for(const file of await fs.readdir(new URL('assets/',root))){
 if(!file.endsWith('.webp'))continue;
 const path='assets/'+file;
 artwork[path]='data:image/webp;base64,'+(await fs.readFile(new URL(path,root))).toString('base64');
}
html=html.replace(/src="(assets\/[a-z-]+\.webp)"/g,'data-art="$1"');
const artSetup='<script>window.IronholdArt='+JSON.stringify(artwork)+';const scenes={play:"comic",ledger:"ledger",rules:"council"};for(const [tab,name] of Object.entries(scenes)){document.documentElement.style.setProperty("--scene-"+tab,"url("+window.IronholdArt["assets/ironhold-"+name+".webp"]+")");}</script>';
const editionArt=await read('src/edition-art.js');
html=html.replace('<script>\n'+engine,()=>artSetup+'<script>\n'+editionArt+'\n</script><script>\n'+engine);
html=html.replace('</body>',()=>'<script>document.querySelectorAll("img[data-art]").forEach(img=>{img.src=window.IronholdArt[img.dataset.art];});</script></body>');
await fs.writeFile(new URL('index.html',root),html);
console.log('Built standalone index.html with France/Kazakhstan settings and English/Russian/French/Kazakh languages');
