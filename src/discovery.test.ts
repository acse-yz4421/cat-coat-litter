import {it,expect} from 'vitest';
import {challenges} from './discoveries';
import {inspirationPairs,inspirationCoats,commonPresets} from './commonCoats';
import {makeParent,breed,seeded,appearanceKey,type Phenotype} from './genetics';
it('每个新挑战都能通过对应灵感搭配获得',()=>{
 challenges.forEach((challenge,index)=>{
  const [m,f]=inspirationCoats(index+1);
  const mother=makeParent(m,seeded(23)),father=makeParent(f,seeded(24));
  const kittens=Array.from({length:50},(_,i)=>breed(mother,father,i).kittens).flat();
  expect(kittens.some(k=>challenge.matches(k.phenotype)),challenge.title).toBe(true);
  for(const k of kittens)expect(challenge.matches({...k.phenotype,whiteCoat:true})).toBe(false);
 });
 for(const pair of inspirationPairs)for(const name of [pair.mother,pair.father])expect(commonPresets.some(c=>c.name===name)).toBe(true);
});
it('银渐层遮住的纹样只算一种发现，隐藏纹样不能完成虎斑挑战',()=>{
 const p:Phenotype={sex:'female',base:'black',pigment:'black',dilute:false,white:0,point:false,silver:true,shaded:true,pattern:'classic'};
 expect(appearanceKey(p)).toBe(appearanceKey({...p,pattern:'tabby'}));
 expect(challenges[0].matches(p)).toBe(false);expect(challenges[1].matches(p)).toBe(true);
 expect(challenges[3].matches({...p,point:true})).toBe(false);
});
