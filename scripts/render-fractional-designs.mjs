/** Editable, anonymous screen recreations. Run: node scripts/render-fractional-designs.mjs */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {openSync} from 'fontkit';
const root = process.cwd();
const fonts = {
 'Instrument Sans':openSync(path.join(root,'docs/fractional-redesign/fonts/InstrumentSans.ttf')).getVariation({wght:400,wdth:100}),
 'Cormorant Garamond':openSync(path.join(root,'docs/fractional-redesign/fonts/CormorantGaramond.ttf')).getVariation({wght:400}),
};
// Outline text to make both SVG and PNG independent of the host's font installation.
function outlineText(source) {
 return source.replace(/<text ([^>]+)>([^<]*)<\/text>/g, (_, attrs, encoded) => {
  const attributes=Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  const attribute=name=>attributes[name];
  const label=encoded.replaceAll('&amp;','&').replaceAll('&lt;','<');
  const font=fonts[attribute('font-family')];
  const size=Number(attribute('font-size'));
  const scale=size/font.unitsPerEm;
  const run=font.layout(label);
  const width=run.positions.reduce((total,p)=>total+p.xAdvance,0)*scale;
  let x=Number(attribute('x'))-(attribute('text-anchor')==='middle'?width/2:0);
  const y=Number(attribute('y'));
  let glyphs='';
  for(let i=0;i<run.glyphs.length;i++) {
   const p=run.positions[i];
   glyphs+=`<path d="${run.glyphs[i].path.toSVG()}" transform="translate(${x+p.xOffset*scale} ${y-p.yOffset*scale}) scale(${scale} ${-scale})"/>`;
   x+=p.xAdvance*scale;
  }
  if(attribute('text-decoration')==='underline') glyphs+=`<path d="M${x-width} ${y+2}h${width}" stroke="${attribute('fill')}" stroke-width=".6"/>`;
  return `<g aria-label="${encoded.replaceAll('"','&quot;')}" data-font-family="${attribute('font-family')}" data-font-size="${size}" fill="${attribute('fill')}">${glyphs}</g>`;
 });
}
const C={ink:'#243C38',muted:'#52665D',green:'#216A57',pale:'#EDF5EF',line:'#DCE5DE',paper:'#FCFCF8',white:'#FFFFFF'};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const rect=(x,y,w,h,fill=C.white,r=12,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
// Three sans roles (11, 13, 16), two serif roles (20, 28); never bold.
const text=(x,y,s,size=13,fill=C.ink,weight=400,serif=false)=>{
 const normalized = serif ? (size < 22 ? 20 : 28) : (size <= 11 ? 11 : size <= 14 ? 13 : 16);
 return `<text x="${x}" y="${y}" fill="${fill}" font-family="${serif?'Cormorant Garamond':'Instrument Sans'}" font-size="${normalized}" font-weight="400">${esc(s)}</text>`;
};
const lines=(x,y,ss,size=14,fill=C.muted,gap=21)=>ss.map((s,i)=>text(x,y+i*gap,s,size,fill)).join('');
const line=(x,y,x2,y2,color=C.line)=>`<path d="M${x} ${y}H${x2}" stroke="${color}"/>`;
const check=(x,y,color=C.green)=>`<path d="M${x-4} ${y}l3 3 6-7" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
const circle=(x,y,r,fill,stroke='none')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
const pill=(x,y,w,label,active=false)=>{
 const checked=label.startsWith('✓');
 return rect(x,y,w,21,active?C.pale:'#F0F2ED',10)+(checked?check(x+12,y+10):'')+(checked?text(x+24,y+14,label.replace(/^✓\s*/,''),11,active?C.green:C.muted):text(x+w/2,y+14,label,11,active?C.green:C.muted).replace('<text ', '<text text-anchor="middle" '));
};
const button=(y,label,disabled=false,x=24,w=312)=>rect(x,y,w,46,disabled?'#E8ECE5':C.green,11)+`<text x="${x+w/2}" y="${y+28}" text-anchor="middle" fill="${disabled?C.muted:'#FFFFFF'}" font-family="Instrument Sans" font-size="13" font-weight="400">${esc(label)}</text>`;
const help=y=>`<text x="180" y="${y}" text-anchor="middle" fill="${C.muted}" font-family="Instrument Sans" font-size="13" text-decoration="underline">Need help?</text>`;
const progress=(y,f=.2)=>rect(24,y,312,4,'#E2E9DF',2)+rect(24,y,312*f,4,C.green,2);
const frame=body=>rect(0,0,360,740,C.paper,23,C.line)+body;
const icon=(x,y,kind)=>`<g transform="translate(${x},${y})" fill="none" stroke="${C.green}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${kind==='heart'?'<path d="M0 5C-8-2-13 8-6 14l6 5 6-5C13 8 8-2 0 5Z"/>':kind==='doc'?'<rect x="-8" y="0" width="16" height="21" rx="3"/><path d="M-4 6h8m-8 4h8m-8 4h5"/>':'<circle cx="-4" cy="5" r="4"/><circle cx="6" cy="7" r="3"/><path d="M-12 21c0-12 16-12 16 0m0-9c6-3 11 2 11 9"/>'}</g>`;
function intake(){
 let s=progress(38)+text(24,92,'How can we help',27,C.ink,400,true)+text(24,124,'your family?',27,C.ink,400,true)+text(24,155,'Choose the option that fits best.',14,C.muted);
 const options=[['Find therapy',['Our child is looking for','therapy support.'],'heart'],['Get an evaluation',['We think our child may benefit','from an evaluation.'],'doc'],['Both',['We want an evaluation and','therapy support.'],'people']];
 options.forEach(([title,copy,kind],i)=>{const y=188+i*112;s+=rect(24,y,312,96,i===0?C.pale:C.white,14,i===0?C.green:C.line)+icon(57,y+26,kind)+text(89,y+31,title,16,C.ink,600)+lines(89,y+53,copy,12,C.muted,18)+circle(314,y+29,8,C.white,i===0?C.green:'#BFCBC1')+(i===0?circle(314,y+29,4,C.green):'');});
 return frame(s+button(548,'Continue')+help(624));
}
function insurance(state){
 let s=progress(38,.76)+text(24,87,state===2?'We’ll use Jordan’s':'How will care',25,C.ink,400,true)+text(24,117,state===2?'Medicaid':'be covered?',25,C.ink,400,true);
 if(state===0){s+=lines(24,149,['Pick your insurer below. We’ll collect card','details later.'],12)+text(24,219,'AVAILABLE IN OREGON',10,C.muted,600)+rect(24,235,312,240,C.white,12,C.line);
 ['Aetna','Blue Cross Blue Shield','Cigna','UnitedHealthcare / Optum','Medicaid'].forEach((name,i)=>{let y=235+i*48;s+=text(40,y+29,name,13)+circle(317,y+24,6,C.white,'#C6D1C7')+(i?line(24,y,336,y):'');});s+=search(487)+rect(24,546,312,46,C.pale,11,C.line)+text(38,574,'Add secondary insurance (optional)',12,C.green,600)+text(312,575,'+',19,C.green)+help(630);
 }else if(state===1){s+=text(24,166,'Primary insurance carrier',12,C.muted,600)+rect(24,181,312,48,C.pale,11,'#9ABAA5')+check(43,205)+text(60,210,'Cigna',14,C.green,600)+text(24,266,'Secondary insurance carrier',12,C.muted,600)+text(325,267,'×',17,C.muted)+rect(24,283,312,96,C.white,12,C.line)+text(40,312,'Medicaid',13)+line(24,331,336,331)+text(40,360,'Tricare',13)+search(391)+button(460,'Get your match')+help(539);
 }else{s+=lines(24,151,['We’re not in-network with Kaiser, but','Medicaid covers care with us, so nothing','changes for you.'],12,C.muted,20)+rect(24,235,312,148,C.white,13,C.line)+text(40,261,'PRIMARY',9,C.muted,600)+text(40,288,'Kaiser Permanente',13)+pill(248,253,78,'Not billed')+rect(25,308,310,74,C.pale,12)+text(40,334,'SECONDARY',9,C.green,600)+text(40,361,'Medicaid',14,C.green,600)+pill(219,332,105,'✓  We’ll bill this',true)+rect(24,400,312,76,'#F0F3EB',12)+circle(44,424,7,C.white,'#90A28F')+text(42.5,428,'i',10,C.green,600)+lines(60,423,['Keep both on file. If we go in-network','with Kaiser later, we’ll tell you and you','can choose.'],11,C.muted,18)+button(499,'Get your match');}
 return frame(s);
}
function search(y){return rect(24,y,312,44,C.white,10,C.line)+circle(42,y+20,5,'none','#9AAA9E')+`<path d="M46 ${y+24}l4 4" stroke="#9AAA9E"/>`+text(59,y+27,'Search all insurers',12,C.muted);}
function portal(evaluation=false){
 let s=text(24,49,'Welcome, Jordan.',26,C.ink,400,true)+lines(24,76,['There are just a few steps left until Sam can','start therapy.'],12,C.muted,18);
 s+='<g transform="translate(0 -12)">'+rect(24,123,312,evaluation?168:117,C.white,14,C.line)+circle(59,158,20,'#E8EEE0')+text(49,163,'JD',13,C.green,600)+circle(74,172,7,C.green)+check(74,172,'white')+text(91,148,evaluation?'SAM’S EVALUATOR':'SAM’S CLINICIAN',9,C.muted,600)+text(91,171,evaluation?'Jane Doe, PsyD':'Jane Doe',16,C.ink,600)+pill(267,143,61,'Matched',true);
 if(evaluation)s+=lines(40,204,['An evaluation helps determine the care and','support your child may need. When the report is','ready, we’ll help you understand next steps.'],11,C.muted,16);
 const py=evaluation?261:210;
 s+=line(40,py-16,320,py-16)+text(40,py,evaluation?'Sam’s path to the evaluation':'Sam’s path to the first session',10,C.muted)+text(265,py,evaluation?'Step 2 of 3':'Step 2 of 4',10,C.ink,600);
 const n=evaluation?3:4;for(let i=0;i<n;i++)s+=rect(40+i*284/n,py+10,284/n-5,4,i===0?C.green:i===1?'#B6CBB5':'#E7ECE2',2);
 s+='</g>';
 const top=evaluation?326:265;
 s+=text(24,top-12,'NOW',10,C.green,600)+rect(24,top,312,evaluation?286:400,C.white,14,'#A5BCA8')+rect(25,top+1,310,81,C.pale,13)+text(40,top+29,evaluation?'Get to your evaluation':'Prepare for your consultation',18,C.ink,400,true)+lines(40,top+50,[evaluation?'Two things, in this order. Only the paperwork below can':'Three things, in this order. Only the paperwork below can','wait.'],10.5,C.muted,16);
 s+=`<path d="M47 ${top+111}V${top+(evaluation?209:293)}" stroke="${C.line}" stroke-width="2"/>`+circle(47,top+111,10,'#E5EEE2')+check(47,top+111)+text(66,top+108,'Verify your insurance',12,C.muted,600)+pill(266,top+94,54,'DONE');
 s+=lines(66,top+129,evaluation?['Coverage verified · estimated $40 for the','evaluation · Member ID on file']:['Coverage verified · estimated $35 per visit ·','Member ID on file'],10.5,C.muted,16);
 s+=circle(47,top+173,10,C.green)+text(43.5,top+177,'2',11,'#FFFFFF',600)+text(66,top+174,evaluation?'Meet with Jane':'Confirm Sam’s diagnosis',12,C.ink,600)+pill(266,top+160,54,'NOW',true);
 s+=lines(66,top+196,evaluation?['The evaluation appointment itself. Your estimate','is above.']:['Most plans will not approve care without a','diagnosis, so we ask before you pick a time.'],10.5,C.muted,16);
 s+=button(top+228,evaluation?'Book the evaluation':'Upload the report',false,66,254);
 if(!evaluation){s+=circle(47,top+290,10,'#EBEFE7')+text(43.5,top+294,'3',11,C.muted,600)+text(66,top+291,'Meet with Jane',12,C.ink,600)+lines(66,top+311,['Opens as soon as the diagnosis is on file. A free','video visit to confirm the fit before care begins.'],10.5,C.muted,16)+button(top+340,'Schedule free consultation',true,66,254);}
 // The treatment source crops the paperwork card; keep its existing visible copy.
 const ay=evaluation?640:685;
 s+=text(24,ay,'ANYTIME',10,C.muted,600)+rect(24,ay+13,312,evaluation?79:40,C.white,12,C.line)+text(38,ay+37,'Confirm details & sign paperwork',12,C.ink,600);
 if(evaluation)s+=lines(38,ay+56,['4 documents. Optional until Sam’s','evaluation is scheduled.'],10,C.muted,15);
 s+=rect(evaluation?268:274,ay+(evaluation?27:18),54,32,C.white,8,C.line)+text(evaluation?278:284,ay+(evaluation?47:38),'Review',10,C.ink,600);
 return frame(s);
}
const defs='';
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`;
const group=(content,x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${content}</g>`;
const single=content=>svg(720,1480,rect(0,0,720,1480,'#EAF0E7',0)+group(content,24,24,672/360));
const three=()=>svg(1262,873,rect(0,0,1262,873,'#EAF0E7',0)+[0,1,2].map((n)=>group(insurance(n),36+n*408,38,1.04)).join(''));
const assets={'intake-1':single(intake()),'intake-2':three(),'portal-1':single(portal()),'portal-2':single(portal(true)),'intake-card':svg(1260,945,rect(0,0,1260,945,'#EAF0E7',0)+[0,1,2].map(n=>group(insurance(n),28+n*413,70,1.05)).join('')),'portal-card':svg(1260,945,rect(0,0,1260,945,'#EAF0E7',0)+group(portal(),164,28,1.2)+group(portal(true),664,28,1.2))};
for(const [name,source] of Object.entries(assets)){
 const outlined=outlineText(source);
 await fs.writeFile(path.join(root,'docs/fractional-redesign',name+'.svg'),outlined);
 await sharp(Buffer.from(outlined)).png().toFile(path.join(root,'public/case-studies',name+'-review.png'));
}
console.log('Rendered six anonymous case-study assets.');
