import {it,expect} from 'vitest';
import {makeParent,breed,editParent,seeded,type Phenotype} from './genetics';
const p:Phenotype={sex:'female',base:'black',pigment:'black',dilute:false,pattern:'solid',point:false,white:0};
const parents=()=>[makeParent(p,seeded(12)),makeParent({...p,sex:'male'},seeded(13))];
it('KIT 互斥传递：全白/白斑 × 无白 约一半全白一半白斑',()=>{const [m,f]=parents();m.kitGenes=['white','spot'];const ks=Array.from({length:500},(_,s)=>breed(m,f,s).kittens).flat();expect(ks.every(k=>k.phenotype.whiteCoat||k.phenotype.white>0)).toBe(true);const ratio=ks.filter(k=>k.phenotype.whiteCoat).length/ks.length;expect(ratio).toBeGreaterThan(.46);expect(ratio).toBeLessThan(.54);expect(ks.every(k=>k.trace.kit[1]==='normal')).toBe(true);});
it('双份显性全白全部白，双无白不能产生白，双份白斑可全部带白',()=>{const [m,f]=parents();m.kitGenes=['white','white'];expect(breed(m,f,1).kittens.every(k=>k.phenotype.whiteCoat)).toBe(true);m.kitGenes=['normal','normal'];expect(breed(m,f,1).kittens.every(k=>!k.phenotype.whiteCoat&&k.phenotype.white===0)).toBe(true);m.kitGenes=['spot','spot'];expect(breed(m,f,1).kittens.every(k=>!k.phenotype.whiteCoat&&k.phenotype.white>0)).toBe(true);});
it('黑色纯色双亲不会凭空产生可见虎斑',()=>{const [m,f]=parents();for(let s=0;s<100;s++)expect(breed(m,f,s).kittens.every(k=>k.phenotype.pattern==='solid')).toBe(true);});
it('有纹携带无纹的双亲可以生出纯色；橘色不被无纹遮住',()=>{const [m,f]=parents();m.patternGenes.agouti=f.patternGenes.agouti=[true,false];const ks=Array.from({length:300},(_,s)=>breed(m,f,s).kittens).flat();const ratio=ks.filter(k=>k.phenotype.pattern==='solid').length/ks.length;expect(ratio).toBeGreaterThan(.2);expect(ratio).toBeLessThan(.3);m.phenotype.base=f.phenotype.base='red';m.patternGenes.agouti=f.patternGenes.agouti=[false,false];expect(breed(m,f,4).kittens.every(k=>k.phenotype.pattern!=='solid')).toBe(true);});
it('编辑白斑面积不重抽 KIT；改色不重抽纹样；新白猫不固定单份',()=>{const [m]=parents();const spotted=editParent(m,{white:1});expect(editParent(spotted,{white:3}).kitGenes).toEqual(spotted.kitGenes);expect(editParent(m,{pigment:'chocolate'}).patternGenes).toEqual(m.patternGenes);const pairs=Array.from({length:100},(_,i)=>makeParent({...p,whiteCoat:true},seeded(i)).kitGenes.join('/'));expect(pairs).toContain('white/white');expect(pairs).toContain('white/normal');});

it('橘色条纹不反推出显纹基因，橘色编辑后仍与选定外观相容',()=>{
 const reds=Array.from({length:80},(_,i)=>makeParent({...p,base:'red',pattern:'tabby'},seeded(i)));
 expect(reds.some(m=>m.patternGenes.agouti.every(v=>!v))).toBe(true);
 expect(reds.some(m=>m.patternGenes.agouti.some(Boolean))).toBe(true);
 for(const red of reds){const black=editParent(red,{base:'black'},seeded(6));expect(black.patternGenes.agouti.some(Boolean)).toBe(true);expect(black.phenotype.pattern).toBe('tabby');}
});
it('毛色分段允许隐藏经典虎斑，不固定为细条纹',()=>{
 const cats=Array.from({length:80},(_,i)=>makeParent({...p,pattern:'ticked'},seeded(i)));
 expect(cats.some(m=>m.patternGenes.mackerel.every(v=>!v))).toBe(true);
 expect(cats.some(m=>m.patternGenes.mackerel.some(Boolean))).toBe(true);
});
it('关闭银色或改纯色后清除渐层状态，隐藏纹样不重复计数',()=>{
 const m=makeParent({...p,silver:true,shaded:true,pattern:'classic'},seeded(1));
 for(const patch of [{silver:false},{pattern:'solid' as const}]){const next=editParent(m,patch);expect(next.phenotype.shaded).toBe(false);expect(next.shadingStrength).toBe(0);}
});
