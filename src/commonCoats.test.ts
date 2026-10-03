import {it,expect} from 'vitest';
import {commonCoat,commonPresets,presetCoat,presetPage} from './commonCoats';
import {makeParent,breed,seeded,editParent,explain,appearanceKey,type Phenotype} from './genetics';
const p:Phenotype={sex:'female',base:'black',pigment:'black',dilute:false,pattern:'solid',point:false,white:0};
it('预设不重复且银色名称可识别',()=>{const keys=commonPresets.map(c=>appearanceKey(presetCoat(p,c.patch)));expect(new Set(keys).size).toBe(keys.length);for(const name of ['美短银虎斑','英短银渐层']){const c=commonPresets.find(c=>c.name===name)!;expect(commonCoat(presetCoat(p,c.patch)).name).toContain('银');}});
it('全白遮盖外观及发现键，不丢失底层色素',()=>{const m=makeParent({...p,whiteCoat:true},seeded(3));expect(appearanceKey(m.phenotype)).toBe(appearanceKey({...p,base:'red',whiteCoat:true}));const edited=editParent(m,{whiteCoat:false});expect(edited.pigmentGenes).toEqual(m.pigmentGenes);expect(edited.kitGenes).toEqual(['normal','normal']);});
it('全白独立传递，非白亲本不产生全白，解释读取记录',()=>{const m=makeParent({...p,whiteCoat:true},seeded(5)),f=makeParent({...p,sex:'male'},seeded(6));m.kitGenes=['white','normal'];const kittens=Array.from({length:100},(_,s)=>breed(m,f,s).kittens).flat();const n=kittens.filter(k=>k.phenotype.whiteCoat).length;expect(n).toBeGreaterThan(200);expect(n).toBeLessThan(300);for(const k of kittens.filter(k=>k.phenotype.whiteCoat))expect(explain(k)[2]).toContain('妈妈');expect(breed(editParent(m,{whiteCoat:false}),f,5).kittens.every(k=>!k.phenotype.whiteCoat)).toBe(true);});

it('分组可遍历全部预设且爸爸不出现玳瑁或三花',()=>{for(const sex of ['female','male'] as const){const first=presetPage(sex,0);const all=Array.from({length:first.total},(_,i)=>presetPage(sex,i).items).flat();expect(new Set(all.map(p=>p.name)).size).toBe(all.length);expect(all.length).toBe(commonPresets.filter(p=>sex==='female'||p.patch.base!=='tortie').length);expect(presetPage(sex,first.total)).toEqual(first);if(sex==='male')expect(all.some(p=>p.patch.base==='tortie')).toBe(false);}});

it('纯色与虎斑重点色在名字和描述中区分，其他纹样不误称细条虎斑',()=>{const solid=commonCoat({...p,point:true});const tabby=commonCoat({...p,point:true,pattern:'tabby'});expect(solid.name).toBe('黑色纯色重点色猫');expect(tabby.name).toBe('黑色虎斑重点色猫');expect(solid.description).toContain('没有明显条纹');expect(tabby.description).toContain('细条虎斑');expect(commonCoat({...p,point:true,pattern:'spotted'}).name).toContain('斑点虎斑');});

it('品种入口只应用毛色，显示名称不标成品种',()=>{for(const entry of commonPresets.slice(0,6)){const coat=presetCoat(p,entry.patch);expect(commonCoat(coat).name).not.toContain(entry.name);expect(coat.sex).toBe(p.sex);}});

it('银色逐亲传递，全白遮盖但保留银色信息，渐层不冒充单基因',()=>{
 const m=makeParent({...p,silver:true,shaded:true,pattern:'ticked'},seeded(1));
 const f=makeParent({...p,sex:'male',silver:true,shaded:true,pattern:'ticked'},seeded(2));
 m.silverGenes=[true,true];f.silverGenes=[false,false];
 const litter=breed(m,f,19);
 for(const k of litter.kittens){expect(k.trace.silver).toEqual([true,false]);expect(k.phenotype.silver).toBe(true);expect(k.phenotype.shaded).toBe(k.phenotype.pattern!=='solid');expect(explain(k)[1]).toContain('不是现实中的单基因概率');}
 const plain=editParent(m,{silver:false});expect(breed(plain,f,3).kittens.every(k=>!k.phenotype.silver&&!k.phenotype.shaded)).toBe(true);
 const white=editParent(m,{whiteCoat:true});white.kitGenes=['white','white'];
 for(const k of breed(white,f,5).kittens){expect(commonCoat(k.phenotype).name).toBe('白猫');expect(k.phenotype.silver).toBe(true);expect(explain(k)[1]).toContain('银色');}
 const unchanged=editParent(m,{white:2});expect(unchanged.silverGenes).toEqual(m.silverGenes);expect(unchanged.shadingStrength).toBe(1);
 expect(presetCoat(m.phenotype,{}).silver).toBe(false);expect(presetCoat(m.phenotype,{}).shaded).toBe(false);
});
