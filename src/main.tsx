import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Cat } from './Cat';
import { makeParent, editParent, breed, explain, baseName, patternName, patternNames, patterns, pigments, pigmentNames, appearanceKey, whiteNames, type Parent, type Phenotype, type Litter } from './genetics';
import './style.css';
import {commonCoat,presetPage,presetCoat,commonPresets,coatDescription,inspirationPairs,inspirationCoats} from './commonCoats';
import { challenges } from './discoveries';
const initial=(sex:'female'|'male',base:Phenotype['base'],dilute=false,pattern:Phenotype['pattern']='solid',white=0,pigment:Phenotype['pigment']='black',point=false)=>makeParent({sex,base,dilute,pattern,white,pigment,point});
function Editor({parent,onChange}:{parent:Parent;onChange:(p:Parent)=>void}) {
 const p=parent.phenotype; const mom=p.sex==='female'; const familiar=commonCoat(p);
 const [presetIndex,setPresetIndex]=useState(0); const page=presetPage(p.sex,presetIndex);
 const [chosenPreset,setChosenPreset]=useState<{name:string;parent:Parent}|null>(null);
 const selectedName=chosenPreset?.parent===parent?chosenPreset.name:null;
 const change=(patch:Partial<Phenotype>)=>{setChosenPreset(null);onChange(editParent(parent,patch));};
 const choosePreset=(name:string,patch:Partial<Phenotype>)=>{const next=editParent(parent,presetCoat(p,patch));setChosenPreset({name,parent:next});onChange(next);};
 return <article className={`parent ${mom?'mother':'father'}`}><div className="parent-top"><span className="eyebrow">{mom?'01 / MAMA':'02 / PAPA'}</span><span className="badge">{mom?'♀ 妈妈':'♂ 爸爸'}</span></div><div className="parent-body"><div className="portrait"><Cat p={p} seed={parent.seed}/><div className="coat-identity" aria-live="polite"><strong>{selectedName??familiar.name}</strong><p>{selectedName?coatDescription(selectedName,p):familiar.description}</p><span className="coat-name">{baseName(p)} · {patternName(p)}</span></div></div><div className="controls"><fieldset><legend>常见毛色 <span>选一种，再微调</span></legend><p className="preset-disclaimer">先选熟悉的外观，再调整细节。品种名只帮助联想毛色，不代表体型、毛长或血统。</p><div className="choices common-presets">{page.items.map(c=><button key={c.name} aria-pressed={selectedName===c.name} onClick={()=>choosePreset(c.name,c.patch)}>{c.name}</button>)}</div><div className="preset-pagination"><span aria-live="polite">第 {presetIndex%page.total+1} / {page.total} 组</span><button type="button" aria-label={`${mom?'妈妈':'爸爸'}常见毛色换一组`} onClick={()=>setPresetIndex(i=>(i+1)%page.total)}>↻ 换一组</button></div></fieldset>
 <fieldset><legend>显性全白</legend><div className="choices">{[false,true].map(w=><button key={String(w)} aria-pressed={!!p.whiteCoat===w} onClick={()=>change({whiteCoat:w})}>{w?"全白":"显示花色"}</button>)}</div></fieldset>{p.whiteCoat&&<p className="pattern-help">全白会遮住其他花色。下方设置的信息仍可能传给小猫，只是在这只猫身上看不见。</p>}
 <fieldset><legend>底色组合</legend><div className="choices">{(['black','red',...(mom?['tortie']:[])] as Phenotype['base'][]).map(b=><button key={b} aria-pressed={p.base===b} onClick={()=>change({base:b})}><i className={`swatch ${b}`}/>{b==='black'?'黑／棕系':b==='red'?'橘色系':'玳瑁'}</button>)}</div></fieldset>
 <p className="pattern-help">{p.base==='red'?'橘色可以变浅成浅橘色。':p.base==='tortie'?'橘色和深色色块交错，配上较多白毛就是三花。':'黑色、棕色是一组；配上纹路后，也能呈现狸花的棕灰外观。'}</p>
 {p.base!=='red'&&<fieldset><legend>{p.base==='tortie'?'玳瑁的深色部分':'黑／棕色调'}</legend><div className="choices">{pigments.map(t=><button key={t} aria-pressed={p.pigment===t} onClick={()=>change({pigment:t})}><i className={`swatch ${t}`}/>{pigmentNames[t]}</button>)}</div></fieldset>}
 {p.base!=='red'&&<p className="pattern-help">{p.pigment==='chocolate'?'像牛奶巧克力的棕色；变浅后是浅暖灰。':p.pigment==='cinnamon'?'比巧克力色更浅、偏红棕，也叫肉桂色；不属于橘色系。':'纯色时是黑猫，变浅后是蓝猫；有纹时会露出较浅的底毛。'}{p.dilute&&p.pigment==='chocolate'?' 稀释后为浅暖灰，专业名丁香色。':''}{p.dilute&&p.pigment==='cinnamon'?' 稀释后为浅米棕，专业名浅鹿色。':''}</p>}
 <fieldset><legend>深浅 <span>{baseName(p)}</span></legend><div className="choices">{[false,true].map(d=><button key={String(d)} aria-pressed={p.dilute===d} onClick={()=>change({dilute:d})}>{d?'浅浅的':'浓浓的'}</button>)}</div></fieldset>
 {p.base==='red'&&<p className="pattern-help">橘猫通常能看见深浅纹路，这里用有纹外观表示。</p>}
 <fieldset><legend>纹样</legend><div className="choices pattern-choices">{patterns.map(t=><button key={t} aria-pressed={p.pattern===t} disabled={p.base==='red'&&t==='solid'} onClick={()=>change({pattern:t})}>{patternNames[t]}</button>)}</div></fieldset>
 <p className="pattern-help">{p.silver&&p.shaded?'渐层会弱化所选纹样，主要看见柔和的深色毛尖。':({solid:p.base==='tortie'?'深色色块不显条纹；橘色块仍可能有淡纹。':'没有明显的大块纹路，主要看底色。',tabby:'一道道细条纹，像常见狸花猫身上的纹路。',classic:'宽大的回环色带，也叫蝴蝶纹。',spotted:'条纹变成分散的深色小斑点，不是环状豹纹。',ticked:'单根毛有深浅色带，远看细腻混色，不是身上长小点。'})[p.pattern]}</p>
 <fieldset><legend>银色底毛</legend><div className="choices">{[false,true].map(silver=><button key={String(silver)} aria-pressed={!!p.silver===silver} onClick={()=>change({silver})}>{silver?'银色':'普通底毛'}</button>)}</div></fieldset>
 {p.silver&&<><fieldset><legend>毛尖着色</legend><div className="choices">{[false,true].map(shaded=><button key={String(shaded)} disabled={shaded&&p.pattern==='solid'} aria-pressed={!!p.shaded===shaded} onClick={()=>change({shaded})}>{shaded?'柔和渐层':'保留纹样'}</button>)}</div></fieldset><p className="pattern-help">{p.pattern==='solid'?'纯色加银色是烟色：外层较深，毛根浅白。':'保留纹样：浅底上有深色纹路。柔和渐层：大部分毛色浅，毛尖带深色。'}</p></>}
 {!p.silver&&<p className="pattern-help">银色会让毛根和底毛变浅，和“浅浅的”、白斑是不同效果。</p>}
 <fieldset><legend>颜色分布 <span>可与纹样叠加</span></legend><div className="choices">{[false,true].map(point=><button key={String(point)} aria-pressed={p.point===point} onClick={()=>change({point})}>{point?'重点色':'全身色'}</button>)}</div></fieldset>
 <p className="pattern-help">{p.point?'身体浅，脸、耳、脚和尾巴颜色更深；也能带条纹。':'颜色遍布全身，不只集中在脸和四肢。'}</p>
 <fieldset><legend>白斑 <span>{whiteNames[p.white]}</span></legend><input aria-label={`${mom?'妈妈':'爸爸'}白斑`} type="range" min="0" max="3" step="1" value={p.white} onChange={e=>change({white:Number(e.target.value)})}/><div className="range-labels"><span>一点也没有</span><span>白白一大片</span></div></fieldset><p className="pattern-help">白斑是局部白毛：从白胸巾、白爪子，到大片白。它与显性全白不同。</p>
 </div></div></article>;
}
function App(){
 const [mother,setMother]=useState(()=>initial('female','black'));
 const [father,setFather]=useState(()=>initial('male','red'));
 const [litter,setLitter]=useState<Litter|null>(null); const [selected,setSelected]=useState(0); const [generation,setGeneration]=useState(0);
 const [discoveries,setDiscoveries]=useState<Record<string,Phenotype>>({});
 const changed=!!litter&&JSON.stringify(litter.parents)!==JSON.stringify([mother,father]);
 const kitten=litter?.kittens[selected];
 const preset=(n:number)=>{const [m,f]=inspirationCoats(n);setMother(makeParent(m));setFather(makeParent(f));};
 const randomPair=()=>{const pick=(sex:Phenotype['sex'])=>{const choices=commonPresets.filter(c=>sex==='female'||c.patch.base!=='tortie');return makeParent(presetCoat({sex} as Phenotype,choices[Math.floor(Math.random()*choices.length)].patch));};setMother(pick('female'));setFather(pick('male'));};
 const generate=()=>{const next=breed(mother,father,Math.floor(Math.random()*0xffffffff));setLitter(next);setSelected(0);setGeneration(g=>g+1);setDiscoveries(old=>{const added={...old};for(const k of next.kittens)added[appearanceKey(k.phenotype)]=k.phenotype;return added;});};
 const found=Object.values(discoveries);
 return <main><header><a className="brand" href="#"><span className="brand-icon">✿</span> 猫咪花色实验室</a><a className="about-link" href="#rules">小游戏，大好奇 ↗</a></header>
 <section className="hero"><div className="kicker"><span/> A LITTLE CAT EXPERIMENT</div><h1>两只猫，<br className="mobile-break"/>一窝<span>小惊喜。</span></h1><p>选一选爸妈的花色，看看小猫会像谁。<br/>每一种花色，都有自己的来历。</p><span className="hero-doodle" aria-hidden="true">✧</span></section>
 <section aria-label="亲本编辑"><div className="section-heading"><h2><span>01</span> 先认识猫爸妈</h2><span className="subtle">随心捏一捏，花色马上变</span></div><div className="parents"><Editor parent={mother} onChange={setMother}/><div className="plus" aria-hidden="true">＋</div><Editor parent={father} onChange={setFather}/></div>
 <div className="preset-row"><span>没有灵感？试试</span>{inspirationPairs.map((pair,i)=><button key={pair.name} onClick={()=>preset(i)}>{pair.name} <span>↗</span></button>)}<button onClick={randomPair}>随机配一对 ↻</button></div>
 <div className="action-area"><button className="primary" onClick={generate}>{litter?'再来一窝':'看看小猫'} <span>✦</span></button><p>{changed?'已修改亲本，下次生成生效。这窝仍来自上一对猫爸妈。':'每次遇见 5 只小猫，每一窝都有不同的可能。'}</p></div></section>
 <section className="discovery-section" aria-label="花色发现挑战"><div className="section-heading"><h2><span>✧</span> 花色发现挑战</h2><span className="subtle" aria-live="polite">本次已遇见 {found.length} 种组合</span></div><div className="challenges">{challenges.map(c=>{const done=found.some(p=>!p.whiteCoat&&c.matches(p));return <div className={done?'challenge done':'challenge'} key={c.title}><strong>{done?'✓':'○'} {c.title}</strong><p>{c.hint}</p><span>{done?'已发现':'等你发现'}</span></div>;})}</div><p className="discovery-hint">按提示搭配爸妈，点击「看看小猫」寻找目标。每窝不保证出现；只算看得见的花色，刷新后重新开始。</p></section>
 <section className="litter-section" aria-label="小猫结果"><div className="section-heading"><h2><span>02</span> {litter?'这一窝，刚刚好':'等一窝小小的惊喜'}</h2><span className="subtle">{litter?`第 ${generation} 窝 · 点击小猫，看看来历`:'准备好就出发吧'}</span></div>
 {!litter?<div className="empty"><div className="nest">♡</div><h3>猫窝已经准备好了</h3><p>点一下「看看小猫」，和它们打个照面。</p><div className="empty-paws" aria-hidden="true">· · ✧ · ·</div></div>:<><p className="litter-summary" aria-live="polite">这一窝有 {litter.kittens.filter(k=>k.phenotype.sex==='female').length} 只小母猫、{litter.kittens.filter(k=>k.phenotype.sex==='male').length} 只小公猫。{changed?'下方来历对应出生时的爸妈。':'哪一只最像你心里的猫？'}</p><div className="kittens" key={generation}>{litter.kittens.map((k,i)=><button className={`kitten ${i===selected?'selected':''}`} style={{animationDelay:`${i*80}ms`}} key={k.id} aria-pressed={i===selected} onClick={()=>setSelected(i)}><span className="kitten-number">0{i+1}</span><Cat p={k.phenotype} seed={k.seed} small kitten/><strong>{commonCoat(k.phenotype).name}</strong><span>{k.phenotype.sex==='female'?'♀ 小母猫':'♂ 小公猫'} · {patternName(k.phenotype)}</span>{i===selected&&<span className="selected-dot">●</span>}</button>)}</div>
 {kitten&&<article className="detail"><div className="detail-title"><span className="eyebrow">A LITTLE STORY</span><h3>它为什么长这样？</h3><p>第 {selected+1} 只 · {commonCoat(kitten.phenotype).name}</p><p>{commonCoat(kitten.phenotype).description}</p><div className="mini-parents">{litter.parents.map((p,i)=><div key={i}><Cat p={p.phenotype} seed={p.seed} small/><span>{i===0?'出生时的妈妈':'出生时的爸爸'}</span></div>)}</div></div><div className="notes">{explain(kitten).map((note,i)=><div className="note" key={i}><span className="note-icon">{['◐','≋','◒'][i]}</span><div><h4>{['底色与深浅','身上的纹样','一点点白'][i]}</h4><p>{note}</p></div></div>)}</div></article>}</>}
 </section><details id="rules"><summary>关于这个小实验 <span>＋</span></summary>
 <p>先选爸妈的外观，再看看 5 只小猫可能像谁。品种名只是毛色参考；这里不模拟血统、体型和毛长，也不能预测现实猫咪会生出什么。</p>
 <p><strong>哪些按遗传关系计算？</strong>橘色与性别有关；黑／棕色、颜色稀释、重点色、银色和显性全白等，由爸妈分别传来信息后组合。三花和玳瑁只模拟常见的母猫情况，未包含少见的公玳瑁。</p>
 <p><strong>为什么爸妈不像，小猫却有？</strong>有些信息藏在外观下面，比如深色猫也可能携带浅色信息。系统会给爸妈分配一套与外观相容的信息，连续生几窝会沿用它；重新选配或修改相关选项时可能改变。分配比例只是游戏设定，不是现实概率。橘猫有条纹，也不能据此确定它的显纹信息。</p>
 <p><strong>白猫、白斑、银色有什么不同？</strong>显性全白遮住其他花色；白斑只让局部变白；银色让毛根和底毛变浅。银色配条纹是银虎斑，配柔和毛尖可呈银渐层，配纯色可呈烟色。白猫仍可能传出被遮住的花色；这里不模拟白化等其他白毛成因。</p>
 <p><strong>哪些只是近似？</strong>白斑的面积与位置、斑点程度、渐层程度都很复杂。游戏用爸妈的外观倾向近似生成，并不代表一个简单基因或真实出生概率。银渐层预设的底层纹样也是示例设定，不能由外观唯一推断。图画简化了毛根、毛尖及玳瑁橘色块的细纹；重点色按长出颜色后的样子展示，不模拟刚出生时和随温度、年龄变化的毛色。暂未包含金渐层和玫瑰斑。</p>
 <p>每窝独立抽取，5 只小猫不一定刚好符合理论比例。发现记录只保留到本次页面关闭或刷新。</p>
 <p>资料参考：<a href="https://vgl.ucdavis.edu/test/dominant-white-cat" target="_blank" rel="noreferrer">全白与白斑</a> · <a href="https://vgl.ucdavis.edu/test/agouti-cat" target="_blank" rel="noreferrer">纹样与橘色</a> · <a href="https://vgl.ucdavis.edu/test/colorpoint-restriction" target="_blank" rel="noreferrer">重点色</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2815922/" target="_blank" rel="noreferrer">条纹与斑点</a> · <a href="https://cfa.org/coat-color-descriptions/" target="_blank" rel="noreferrer">银色与渐层外观</a>。</p></details>
 <details><summary>花色小图鉴 <span>＋</span></summary><p>这里与「常见毛色」使用同一套组合。看名字、对照外观，再回到爸妈选项试一试。品种名只作毛色参考。</p><div className="gallery">{commonPresets.map((entry,i)=>{const p=presetCoat({sex:'female'} as Phenotype,entry.patch);return <div key={entry.name}><Cat p={p} seed={i+10} small/><strong>{entry.name}</strong><p>{coatDescription(entry.name,p)}</p></div>;})}</div></details>
 <footer><span>✿ 猫咪花色实验室</span><span>一点科学，一点运气，很多可爱。</span></footer></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
