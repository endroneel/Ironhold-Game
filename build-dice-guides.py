#!/usr/bin/env python3
"""Expand rulebooks without changing gameplay or artwork. Run before node build.mjs."""
from __future__ import annotations
import base64, hashlib, html, io, json, re
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'src/dice-guide-data.json').read_text(encoding='utf-8'))
OUT=ROOT/'documents'
OUT.mkdir(exist_ok=True)
def assignment(text,name):
    start=text.index('window.'+name+'=')+len('window.'+name+'=')
    obj,count=json.JSONDecoder().raw_decode(text[start:])
    return obj,start,start+count
def replace_assignment(text,name,value):
    _,start,end=assignment(text,name)
    encoded=json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    return text[:start]+encoded+text[end:]
def runtime_digest(text):
    for name in ['IronholdGuideData','IronholdGuidePDFs']:
        text=replace_assignment(text,name,{})
    return hashlib.sha256(text.encode('utf-8')).hexdigest()
def ascii_text(value):
    return value.translate(str.maketrans({'\u2013':'-','\u2014':' - ','\u2212':'-','\u2192':' -> ','\u2019':"'",'\u2018':"'",'\u201c':'"','\u201d':'"','\u2022':' / ','\u00b7':' / ','\u2265':'>=','\u2264':'<='}))
def pdf_bytes(title,subtitle,groups,guide=None,legacy=False):
    stream=io.BytesIO()
    ink=colors.HexColor('#183340');teal=colors.HexColor('#086a67');pale=colors.HexColor('#edf4f3')
    style=ParagraphStyle('Body',fontName='Helvetica',fontSize=9.3,leading=12.6,textColor=ink,spaceAfter=6)
    head=ParagraphStyle('Heading',parent=style,fontName='Helvetica-Bold',fontSize=11,leading=14,spaceBefore=8,spaceAfter=5,textColor=teal,keepWithNext=True)
    big=ParagraphStyle('Title',parent=style,fontName='Helvetica-Bold',fontSize=21,leading=25,spaceAfter=9)
    tiny=ParagraphStyle('Small',parent=style,fontSize=8,leading=10)
    def para(s,sty=style):return Paragraph(html.escape(ascii_text(s)),sty)
    def table(rows,widths):
        t=Table([[para(cell,tiny) for cell in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),pale),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,pale]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,0),.4,teal)]))
        return t
    flow=[]
    for page,blocks in enumerate(groups):
        if page:flow.append(PageBreak())
        flow.append(para('IRONHOLD / '+('OLDER 15-ROUND EDITION' if legacy else 'RULES 4.1')+' / 28 SEPTEMBER 2026',tiny))
        flow.append(para(title if page==0 else title+' / reference',big))
        flow.append(para(subtitle if page==0 else ('Dice and production: use the rules for the version you are playing.' if page>=2 or legacy else 'Follow the displayed action. Keep at least 1 gold after every payment.')))
        flow.append(Spacer(1,5))
        for b in blocks:
            flow.append(para(b['title']['en'],head));kind=b.get('kind','text')
            if kind=='directory':
                rows=[['Guild / turn','Input -> output']]+[[str(i+1)+'. '+guide['roles'][i]['en'],j['en']] for i,j in enumerate(guide['jobs'])]
                flow.append(table(rows,[140,367]));flow.append(Spacer(1,5))
            elif kind=='remedies':
                rows=[guide['remedyHeaders']['en'].split('|')]+[[c['en'] for c in row] for row in guide['remedyRows']]
                flow.append(table(rows,[103,90,314]));flow.append(Spacer(1,5))
            elif isinstance(b.get('body'),list):
                flow.extend(para(item['en']) for item in b['body'])
            else:flow.append(para(b['body']['en']))
    total=len(groups)
    def decorate(c,doc):
        c.saveState();c.setStrokeColor(colors.HexColor('#d4e2e0'));c.line(44,39,A4[0]-44,39)
        c.setFont('Helvetica',7);c.setFillColor(ink)
        c.drawString(44,27,'IRONHOLD / Indranil BISWAS / '+('Legacy rules' if legacy else 'France and Kazakhstan'))
        c.drawRightString(A4[0]-44,27,f'{doc.page} / {total}');c.restoreState()
    SimpleDocTemplate(stream,pagesize=A4,rightMargin=44,leftMargin=44,topMargin=37,bottomMargin=52,title=title,author='Indranil BISWAS').build(flow,onFirstPage=decorate,onLaterPages=decorate)
    result=stream.getvalue();actual=len(PdfReader(io.BytesIO(result)).pages)
    if actual!=total:raise RuntimeError(f'{title}: expected {total} logical pages, got {actual}; inspect pagination')
    return result
def legacy_fragment(lang):
    x=DATA['legacy'];esc=html.escape
    parts=['<!-- DICE-GUIDE:START -->','<details open data-dice-guide="legacy"><summary>'+esc(x['title'][lang])+'</summary><p>'+esc(x['intro'][lang])+'</p>']
    for b in x['blocks']:
        parts.append('<h3>'+esc(b['title'][lang])+'</h3>')
        parts.extend('<p>'+esc(item[lang])+'</p>' for item in b['body'])
    return '\n'.join(parts+['</details>','<!-- DICE-GUIDE:END -->'])+'\n'
def main():
    report={'revision':DATA['revision'],'countries':{}}
    for country in ['france','kazakhstan']:
        path=ROOT/(country+'.html');old=path.read_text(encoding='utf-8')
        guide,_,_=assignment(old,'IronholdGuideData');pdfs,_,_=assignment(old,'IronholdGuidePDFs')
        if guide['version']!='4.1.0':raise RuntimeError('Review a changed country version before updating its rules')
        guide['blocks'].update(DATA['blocks']);guide['guideRevision']=DATA['revision']
        guide['ui']['revision']={'en':'Rules 4.1 / Dice guide updated 28 September 2026','fr':'Règles 4.1 / Guide des dés actualisé le 28 septembre 2026','ru':'Правила 4.1 / Кубики: обновлено 28 сентября 2026','kk':'4.1 ережесі / Текшелер нұсқаулығы: 2026 жылғы 28 қыркүйек'}
        for key in ['guild-rules','gm-rules']:
            d=guide['documents'][key]
            original=[[name for name in page if name not in DATA['blocks']] for page in d['pages']]
            d['pages']=[page for page in original if page]+DATA['pages']
            groups=[[guide['blocks'][name] for name in page] for page in d['pages']]
            binary=pdf_bytes(d['title']['en'],d['subtitle']['en'],groups,guide)
            pdfs[key]={'name':d['pdf'],'base64':base64.b64encode(binary).decode('ascii')}
            (OUT/d['pdf']).write_bytes(binary)
        new=replace_assignment(old,'IronholdGuideData',guide)
        new=replace_assignment(new,'IronholdGuidePDFs',pdfs)
        assert runtime_digest(old)==runtime_digest(new),'Runtime or artwork changed'
        path.write_text(new,encoding='utf-8')
        report['countries'][country]={'runtime_and_artwork_sha256':runtime_digest(new),'rulebook_pages':len(guide['documents']['guild-rules']['pages'])}
    for lang,rel in [('en','src/index.html'),('fr','src/locales/rules-fr.html'),('ru','src/locales/rules-ru.html'),('kk','src/locales/rules-kk.html')]:
        path=ROOT/rel;text=path.read_text(encoding='utf-8')
        text=re.sub(r'<!-- DICE-GUIDE:START -->.*?<!-- DICE-GUIDE:END -->\s*','',text,flags=re.S)
        pos=text.index('<details')
        if lang=='en':pos=text.index('<details',text.index('<article class="panel rules">'))
        text=text[:pos]+legacy_fragment(lang)+text[pos:]
        path.write_text(text,encoding='utf-8')
    x=DATA['legacy']
    binary=pdf_bytes('D6, D10 and D4: older edition',x['intro']['en'],[[b] for b in x['blocks']],legacy=True)
    (OUT/'Ironhold_Legacy_Dice_Guide.pdf').write_bytes(binary)
    (OUT/'dice-guide-validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,indent=2))
if __name__=='__main__':main()
