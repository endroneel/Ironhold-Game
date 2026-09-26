import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url);
let html=await fs.readFile(new URL('src/index.html',root),'utf8');
const css=await fs.readFile(new URL('src/style.css',root),'utf8');
const engine=await fs.readFile(new URL('src/engine.js',root),'utf8');
const teaching=await fs.readFile(new URL('src/teaching.js',root),'utf8');
const ui=await fs.readFile(new URL('src/ui.js',root),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+css+'\n</style>');
html=html.replace('<script src="engine.js"></script><script src="teaching.js"></script><script src="ui.js"></script>',()=>'<script>\n'+engine+'\n</script>\n<script>\n'+teaching+'\n</script>\n<script>\n'+ui+'\n</script>');
// Embed each artwork once; dynamic guild cards use the same shared image map.
const artwork={};
for(const file of await fs.readdir(new URL('assets/',root))){
 if(!file.endsWith('.webp'))continue;
 const path='assets/'+file;
 artwork[path]='data:image/webp;base64,'+(await fs.readFile(new URL(path,root))).toString('base64');
}
html=html.replace(/src="(assets\/[a-z-]+\.webp)"/g,'data-art="$1"');
const artSetup='<script>window.IronholdArt='+JSON.stringify(artwork)+';const scenes={play:"comic",ledger:"ledger",rules:"council"};for(const [tab,name] of Object.entries(scenes)){document.documentElement.style.setProperty("--scene-"+tab,"url("+window.IronholdArt["assets/ironhold-"+name+".webp"]+")");}</script>';
html=html.replace('<script>\n'+engine,()=>artSetup+'<script>\n'+engine);
html=html.replace('</body>',()=>'<script>document.querySelectorAll("img[data-art]").forEach(img=>{img.src=window.IronholdArt[img.dataset.art];});</script></body>');
await fs.writeFile(new URL('index.html',root),html);
console.log('Built standalone index.html');
