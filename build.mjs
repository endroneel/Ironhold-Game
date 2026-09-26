import fs from 'node:fs/promises';
const root=new URL('./',import.meta.url);
let html=await fs.readFile(new URL('src/index.html',root),'utf8');
const css=await fs.readFile(new URL('src/style.css',root),'utf8');
const engine=await fs.readFile(new URL('src/engine.js',root),'utf8');
const ui=await fs.readFile(new URL('src/ui.js',root),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+css+'\n</style>');
html=html.replace('<script src="engine.js"></script><script src="ui.js"></script>',()=>'<script>\n'+engine+'\n</script>\n<script>\n'+ui+'\n</script>');
// Embed each unique artwork once, then share its data URL across matching images.
const artwork={};
for(const name of ['comic','ledger','council']){
 const path='assets/ironhold-'+name+'.webp';
 artwork[path]='data:image/webp;base64,'+(await fs.readFile(new URL(path,root))).toString('base64');
}
html=html.replace(/src="(assets\/ironhold-[a-z]+\.webp)"/g,'data-art="$1"');
html=html.replace('</body>',()=>'<script>const embeddedArt='+JSON.stringify(artwork)+';document.querySelectorAll("img[data-art]").forEach(img=>{img.src=embeddedArt[img.dataset.art];});</script></body>');
await fs.writeFile(new URL('index.html',root),html);
console.log('Built standalone index.html');
