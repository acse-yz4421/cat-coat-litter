export type Base = 'black' | 'red' | 'tortie';
export type Pigment = 'black' | 'chocolate' | 'cinnamon';
export type Pattern = 'solid' | 'tabby' | 'classic' | 'spotted' | 'ticked';
export type Sex = 'female' | 'male';
export type Phenotype = { sex: Sex; base: Base; pigment: Pigment; dilute: boolean; pattern: Pattern; point: boolean; white: number; whiteCoat?: boolean; silver?: boolean; shaded?: boolean };
export type KitAllele = "normal" | "spot" | "white";
export type KitPair = [KitAllele,KitAllele];
export type PatternGenes = {agouti:Pair; mackerel:Pair; ticked:Pair; spotStrength:number};
export type Pair = [boolean, boolean];
export type PigmentPair = [Pigment, Pigment];
export type Parent = { phenotype: Phenotype; silverGenes: Pair; shadingStrength: number; diluteGenes: Pair; pointGenes: Pair; kitGenes: KitPair; patternGenes: PatternGenes; pigmentGenes: PigmentPair; seed: number };
export type Trace = { silver: Pair; shadingParents: [number,number]; maternalOrange: boolean; paternalOrange: boolean | null; dilute: Pair; point: Pair; pigment: PigmentPair; kit: KitPair; patternGenes: PatternGenes; whiteParents: [number, number] };
export type Kitten = { id: string; phenotype: Phenotype; trace: Trace; seed: number };
export type Litter = { parents: [Parent, Parent]; kittens: Kitten[]; seed: number };
export type Rng = () => number;
export const patterns: Pattern[] = ['solid','tabby','classic','spotted','ticked'];
export const pigments: Pigment[] = ['black','chocolate','cinnamon'];
export const pigmentNames: Record<Pigment,string> = {black:'黑色',chocolate:'暖棕色',cinnamon:'浅红棕'};
export const patternNames: Record<Pattern,string> = {solid:'纯色',tabby:'细条虎斑',classic:'经典虎斑（蝴蝶纹）',spotted:'斑点虎斑',ticked:'毛色分段'};
export const whiteNames = ['无白斑','手套胸巾','半身白','大面积白'];
export function seeded(seed: number): Rng { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hidden = (visible: boolean, chance: number, rng: Rng): Pair => visible ? [true, true] : [false, rng() < chance];
const pigmentPair = (pigment: Pigment, rng: Rng): PigmentPair => pigment==='black' ? ['black',rng()<.5?'black':rng()<.5?'chocolate':'cinnamon'] : pigment==='chocolate' ? ['chocolate',rng()<.5?'chocolate':'cinnamon'] : ['cinnamon','cinnamon'];
export function expressedPigment(pair: PigmentPair): Pigment { return pair.includes('black')?'black':pair.includes('chocolate')?'chocolate':'cinnamon'; }
// Initial hidden-state priors are simulation assumptions, not population frequencies.
function kitPair(p:Phenotype,rng:Rng):KitPair {
 if(p.whiteCoat) return p.white>0?['white','spot']:rng()<.25?['white','white']:['white','normal'];
 return p.white>0 ? rng()<.5?['spot','spot']:['spot','normal'] : ['normal','normal'];
}
const dominant=(visible:boolean,rng:Rng):Pair=>visible?[true,rng()<.5]:[false,false];
function samplePattern(p:Phenotype,rng:Rng):PatternGenes {
 const hidden=p.pattern==='solid';
 return {agouti:p.base==='red'?(rng()<.5?[false,false]:dominant(true,rng)):dominant(!hidden,rng),mackerel:dominant(hidden||p.pattern==='ticked'?rng()<.75:p.pattern!=='classic',rng),ticked:dominant(hidden?rng()<.1:p.pattern==='ticked',rng),spotStrength:p.pattern==='spotted'?1:0};
}
export function expressedPattern(g:PatternGenes,base:Base):Pattern {
 if(!g.agouti.some(Boolean)&&base!=='red')return 'solid';
 if(g.ticked.some(Boolean))return 'ticked';
 if(!g.mackerel.some(Boolean))return 'classic';
 return g.spotStrength>=.6?'spotted':'tabby';
}
function normalize(p:Phenotype):Phenotype {const base=p.sex==='male'&&p.base==='tortie'?'black':p.base;const pattern=base==='red'&&p.pattern==='solid'?'tabby':p.pattern;return {...p,base,pattern,shaded:!!p.silver&&pattern!=='solid'&&!!p.shaded};}
export function makeParent(input: Phenotype, rng: Rng = Math.random): Parent {
 const phenotype=normalize(input);
 return {phenotype,silverGenes:dominant(!!phenotype.silver,rng),shadingStrength:phenotype.shaded?1:0,kitGenes:kitPair(phenotype,rng),patternGenes:samplePattern(phenotype,rng),diluteGenes:hidden(phenotype.dilute,.5,rng),pointGenes:hidden(phenotype.point,.35,rng),pigmentGenes:pigmentPair(phenotype.pigment,rng),seed:Math.floor(rng()*1e9)};
}
export function editParent(parent: Parent, patch: Partial<Phenotype>, rng: Rng = Math.random): Parent {
 const phenotype=normalize({...parent.phenotype,...patch}),previous=parent.phenotype;
 return {...parent,phenotype,
  silverGenes:!!phenotype.silver===!!previous.silver?parent.silverGenes:dominant(!!phenotype.silver,rng),
  shadingStrength:!!phenotype.shaded===!!previous.shaded?parent.shadingStrength:phenotype.shaded?1:0,
  kitGenes:!!phenotype.whiteCoat===!!previous.whiteCoat&&((phenotype.white>0)===(previous.white>0))?parent.kitGenes:kitPair(phenotype,rng),
  patternGenes:phenotype.pattern===previous.pattern&&(phenotype.base==='red')===(previous.base==='red')?parent.patternGenes:samplePattern(phenotype,rng),
  diluteGenes:phenotype.dilute===previous.dilute?parent.diluteGenes:hidden(phenotype.dilute,.5,rng),
  pointGenes:phenotype.point===previous.point?parent.pointGenes:hidden(phenotype.point,.35,rng),
  pigmentGenes:phenotype.pigment===previous.pigment?parent.pigmentGenes:pigmentPair(phenotype.pigment,rng)};
}
const allele = <T,>(pair: [T,T], rng: Rng): T => pair[rng() < .5 ? 0 : 1];
export function breed(mother: Parent, father: Parent, seed: number): Litter {
 const rng = seeded(seed); const parents = structuredClone([mother, father]) as [Parent, Parent];
 const kittens = Array.from({length: 5}, (_, i): Kitten => {
  const sex: Sex = rng() < .5 ? 'female' : 'male';
  const maternalOrange = mother.phenotype.base === 'red' || (mother.phenotype.base === 'tortie' && rng() < .5);
  const paternalOrange = sex === 'female' ? father.phenotype.base === 'red' : null;
  const base: Base = paternalOrange !== null && paternalOrange !== maternalOrange ? 'tortie' : maternalOrange ? 'red' : 'black';
  const dilute: Pair = [allele(mother.diluteGenes,rng), allele(father.diluteGenes,rng)];
  const point: Pair = [allele(mother.pointGenes,rng), allele(father.pointGenes,rng)];
  const pigment: PigmentPair = [allele(mother.pigmentGenes,rng),allele(father.pigmentGenes,rng)];
  const mg=mother.patternGenes,fg=father.patternGenes;
  const patternGenes:PatternGenes={agouti:[allele(mg.agouti,rng),allele(fg.agouti,rng)],mackerel:[allele(mg.mackerel,rng),allele(fg.mackerel,rng)],ticked:[allele(mg.ticked,rng),allele(fg.ticked,rng)],spotStrength:(mg.spotStrength+fg.spotStrength)/2};
  const pattern=expressedPattern(patternGenes,base);
  const silver:Pair=[allele(mother.silverGenes,rng),allele(father.silverGenes,rng)];
  const shadingParents:[number,number]=[mother.shadingStrength,father.shadingStrength];
  const shaded=silver.some(Boolean)&&pattern!=="solid"&&(shadingParents[0]+shadingParents[1])/2>=.6;
  const kit:KitPair=[allele(mother.kitGenes,rng),allele(father.kitGenes,rng)];
  const whiteCoat=kit.includes('white');
  const hasSpot=kit.includes('spot');
  const avg=(mother.phenotype.white+father.phenotype.white)/2;
  // Inheritance determines presence; extent/placement remain an illustrative approximation.
  const white=hasSpot?Math.max(1,Math.min(3,Math.round(Math.max(1,avg)+(rng()-.5)*2))):0;
  return {id: `${seed}-${i}`, seed: Math.floor(rng()*1e9), phenotype: {silver:silver.some(Boolean),shaded,sex,base,pigment:expressedPigment(pigment),dilute:dilute.every(Boolean),pattern,point:point.every(Boolean),white,whiteCoat}, trace: {silver,shadingParents,maternalOrange,paternalOrange,dilute,point,pigment,kit,patternGenes,whiteParents:[mother.phenotype.white,father.phenotype.white]}};
 });
 return {parents,kittens,seed};
}
export function pigmentName(p: Pick<Phenotype,'pigment'|'dilute'>) { return p.dilute?({black:'蓝灰',chocolate:'浅暖灰',cinnamon:'浅米棕'} as const)[p.pigment]:pigmentNames[p.pigment]; }
export function baseName(p: Phenotype) {
 if(p.whiteCoat) return "纯白";
 if(p.base==='red') return p.dilute?'浅橘色':'橘色';
 if(p.base==='black') return pigmentName(p);
 const name=p.white>=2?'三花':'玳瑁';
 return p.pigment==='black' ? (p.dilute?'淡':'')+name : pigmentName(p)+name;
}
export function patternName(p: Phenotype) { if(p.whiteCoat) return "全白覆盖"; if(p.silver&&p.shaded&&p.pattern!=="solid")return p.point?"银渐层 · 重点色":"银渐层"; return (p.silver?(p.shaded&&p.pattern!=="solid"?"银渐层 · ":p.pattern==="solid"?"烟色 · ":"银色 · "):"") + (p.point ? p.pattern==='solid'?'重点色':`${patternNames[p.pattern]} · 重点色` : patternNames[p.pattern]); }
export function appearanceKey(p: Phenotype) { if(p.whiteCoat) return "white-coat"; return [p.base,p.base==='red'?'orange':p.pigment,p.dilute,p.silver&&p.shaded&&p.pattern!=='solid'?'shaded':p.pattern,p.point,p.white,!!p.silver,!!p.silver&&p.pattern!=="solid"&&!!p.shaded].join('-'); }
export function explain(k: Kitten): [string,string,string] {
 const t = k.trace, p = k.phenotype;
 const source = p.sex==='male' ? `它是小公猫，妈妈传来了${t.maternalOrange?'橘色':'非橘色'}因子。` : `妈妈传来${t.maternalOrange?'橘色':'非橘色'}，爸爸传来${t.paternalOrange?'橘色':'非橘色'}，${p.base==='tortie'?'两种相遇形成玳瑁。':`形成${p.base==='red'?'橘色':'非橘色'}系。`}`;
 const brown=p.base==='red'?'橘色遮住了黑／棕色系信息。':`黑／棕色系中，妈妈传来${pigmentNames[t.pigment[0]]}，爸爸传来${pigmentNames[t.pigment[1]]}，底色色素属于${pigmentNames[expressedPigment(t.pigment)]}系。`;
 const shade = t.dilute.every(Boolean) ? `双方都传来了浅色因子，底色色素变浅为${baseName(p)}。` : `未凑齐双方的浅色因子，底色色素保持${baseName(p)}。`;
 const g=t.patternGenes;
 const visible=g.agouti.some(Boolean)||p.base==='red';
 const structure=g.ticked.some(Boolean)?'毛色分段':!g.mackerel.some(Boolean)?'经典虎斑（蝴蝶纹）':g.spotStrength>=.6?'斑点虎斑':'细条虎斑';
 const pattern=(visible?`继承的底层纹样是${structure}。`:'双方均传来隐藏纹样的版本，因此非橘色部分表现为纯色。')+(p.base==='red'?'橘色仍会显出纹样。':'')+(visible&&g.spotStrength>0?'斑点程度使用双亲修饰倾向的平均值近似，并非已确定的单基因概率。':'')+(t.point.every(Boolean)?'双方又传来了重点色因子，颜色集中在脸、耳、四肢和尾巴。':'未凑齐重点色因子，颜色分布在全身。');
 const kitNames={normal:'无白版本',spot:'白斑版本',white:'显性全白版本'};
 const inheritance=`妈妈传来${kitNames[t.kit[0]]}，爸爸传来${kitNames[t.kit[1]]}。`;
 const white=inheritance+(p.whiteCoat?'显性全白使其他花色不显现，但这些花色信息仍可遗传。':t.kit.includes('spot')?`继承了白斑版本；画面显示${whiteNames[p.white]}。白斑面积和形状为近似表现，不能仅凭份数精确预测。`:'双方都没有传来白斑或显性全白版本，因此没有白斑。');
 const silverNote=`妈妈传来${t.silver[0]?"银色":"非银色"}版本，爸爸传来${t.silver[1]?"银色":"非银色"}版本。`+(p.silver?"银色使毛根和底毛变浅，与白斑及色素稀释不同。":"本次没有继承银色版本。")+(t.shadingParents.some(v=>v>0)?`渐层倾向按双亲平均值近似，${p.shaded?"本次表现为银渐层，弱化身体纹路":"本次未表现为银渐层"}；这不是现实中的单基因概率。`:"");
 const appearanceNote=p.base==='black'&&p.pigment==='black'&&!p.dilute&&p.pattern!=='solid'&&!p.point&&!p.silver?'黑色系有纹时，画面是棕灰底毛与深色纹路，并非整身黑毛。':p.point?'重点色的名称指端部色素，身体仍较浅。':'';
 return p.whiteCoat ? ['显性全白遮住了原本的底色。'+source+brown,'显性全白也遮住了纹样。隐藏信息：'+pattern+silverNote,white] : [source+brown+shade+appearanceNote,pattern+silverNote,white];
}
