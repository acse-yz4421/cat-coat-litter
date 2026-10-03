import { baseName, patternName, type Phenotype } from './genetics';
export function commonCoat(p: Phenotype): {name:string;description:string} {
 if(p.whiteCoat)return {name:'白猫',description:'全身白毛，覆盖原本的颜色和纹样。'};
 if(p.silver){const kind=p.pattern==='solid'?'烟色':p.shaded?'银渐层':`银色${patternName({...p,silver:false,point:false})}`;return {name:`${baseName({...p,whiteCoat:false})}${kind}${p.point?'重点色':''}${p.white?'加白':''}猫`,description:(p.pattern==='solid'?'外层深色、毛根浅白，呈烟色效果。':p.shaded?'银白底毛，头顶、背侧与尾部有柔和深色毛尖，胸腹较浅。':p.pattern==='ticked'?'毛根浅、毛尖深，远看是细腻混色，没有大片条纹。':'银白底毛上有清楚的深色纹路。')+(p.point?'颜色仍集中于端部。':'')};}
 if(p.point){const kind=p.pattern==='solid'?'纯色重点色':p.pattern==='tabby'?'虎斑重点色':patternName(p).replace(' · ','');return {name:`${baseName(p)}${kind}猫`,description:p.pattern==='solid'?'身体浅，脸、耳、脚和尾巴呈较均匀的深色，没有明显条纹；这是毛色，不代表品种。':`身体浅，脸、耳、脚和尾巴集中着色，并带有${p.pattern==='tabby'?'细条虎斑':patternName({...p,point:false})}纹样；这是毛色，不代表品种。`};}
 if(p.base==='tortie')return {name:p.pigment==='black'&&p.dilute?(p.white>=2?'浅色三花猫':'浅色玳瑁猫'):baseName(p)+(p.white>=2?'猫':''),description:p.dilute?(p.white>=2?p.pigment==='black'?'蓝灰、浅橘和白色相间，也叫淡三花。':'浅棕、浅橘和白色相间。':p.pigment==='black'?'蓝灰和浅橘色块交错，也叫淡玳瑁。':'浅棕和浅橘色块交错。'):p.white>=2?'橘色、深色色块与白毛相间，呈三花外观。':'橘色与深色色块交错；增加白斑可呈三花外观。'};
 if(p.base==='red')return {name:p.dilute?(p.white?'浅橘白猫':'浅橘猫'):(p.white?'橘白猫':'橘猫'),description:p.dilute?(p.white?'浅橘色毛与白毛相间；浅橘色也叫奶油色，并非全身白色。':'比普通橘色更浅、更柔和，也叫奶油色，仍属于橘色系。'):p.white?'橘色毛与白色区域相间。':'暖橘色系的毛色，条纹明显程度可调。'};
 if(p.pigment==='black'&&p.pattern==='solid') {
  if(p.white>=2)return {name:p.dilute?'蓝白猫':'奶牛猫',description:p.dilute?'蓝灰色与大片白毛相间。':'大片白毛上分布黑色色块；此入口用于和少量白斑的黑猫区分，“奶牛”是花色昵称。'};
  if(p.white===1)return {name:p.dilute?'蓝白猫':'黑猫白手套',description:p.dilute?'以蓝灰色毛为主，胸前和脚上有少量白毛。':'以黑毛为主，胸前有白胸巾、爪子像戴白手套；与大片白底的奶牛猫同属黑白花色。'};
  return {name:p.dilute?'蓝猫':'黑猫',description:p.dilute?'整体蓝灰色；此处只表示毛色，不代表英短品种。':'整体深黑色，没有明显纹样和白斑。'};
 }
 if(p.pigment==='black'&&!p.dilute&&p.pattern==='tabby')return {name:p.white?'狸花白猫':'狸花猫',description:'棕灰底毛上有深色细条纹，脸部和尾巴也带纹路。'};
 return {name:`${baseName(p)}${p.pattern==='solid'?'猫':patternName(p)+'猫'}`,description:`${baseName(p)}毛色，${patternName(p)}${p.white?'，带白斑':''}。花色名称不代表品种。`};
}
export const commonPresets: {name:string;patch:Partial<Phenotype>}[] = [
 {name:'美短银虎斑',patch:{pattern:'classic',silver:true}},
 {name:'英短银渐层',patch:{pattern:'classic',silver:true,shaded:true}},
 {name:'美短',patch:{pattern:'classic'}},
 {name:'缅因',patch:{pattern:'tabby',white:1}},
 {name:'暹罗（纯色重点色）',patch:{point:true}},
 {name:'阿比西尼亚',patch:{pattern:'ticked'}},
 {name:'孟加拉猫',patch:{pattern:'spotted'}},
 {name:'英短（蓝猫）',patch:{dilute:true}},
 {name:'橘猫',patch:{base:'red',pattern:'tabby'}},
 {name:'狸花',patch:{base:'black',pattern:'tabby'}},
 {name:'三花',patch:{base:'tortie',white:2}},
 {name:'奶牛猫（大片白）',patch:{base:'black',white:3}},
 {name:'白猫',patch:{whiteCoat:true}},
 {name:'橘白',patch:{base:'red',pattern:'tabby',white:2}},
 {name:'狸花白',patch:{pattern:'tabby',white:2}},
 {name:'黑猫',patch:{}},
 {name:'黑猫白手套',patch:{white:1}},
 {name:'蓝白',patch:{dilute:true,white:2}},
 {name:'玳瑁',patch:{base:'tortie'}},
 {name:'浅色三花',patch:{base:'tortie',dilute:true,white:2}},
 {name:'浅色玳瑁',patch:{base:'tortie',dilute:true}},
 {name:'浅橘猫',patch:{base:'red',dilute:true,pattern:'tabby'}},
 {name:'浅橘白',patch:{base:'red',dilute:true,pattern:'tabby',white:2}},
 {name:'虎斑重点色',patch:{point:true,pattern:'tabby'}},
];
export function presetCoat(p:Phenotype,patch:Partial<Phenotype>):Phenotype {return {...p,base:'black',pigment:'black',dilute:false,pattern:'solid',point:false,white:0,whiteCoat:false,silver:false,shaded:false,...patch};}

export function presetPage(sex:Phenotype['sex'],page:number,size=6) {
 const available=commonPresets.filter(c=>sex==='female'||c.patch.base!=='tortie');
 const total=Math.ceil(available.length/size);
 return {items:available.slice((page%total)*size,(page%total+1)*size),total};
}

// Shared by the parent description and the coat guide.
export const coatReferences:Record<string,string>={
 美短:'棕灰底毛，配宽大的蝴蝶纹。',
 美短银虎斑:'银白底毛，配清楚的深色蝴蝶纹。',
 英短银渐层:'整体银白，头顶、背侧和尾巴有柔和的深色毛尖。',
 缅因:'棕灰色虎斑，胸前和爪子带白毛。这里只参考毛色。',
 '暹罗（纯色重点色）':'身体浅，脸、耳、脚和尾巴深，没有明显条纹。',
 阿比西尼亚:'每根毛有深浅色带，远看细腻混色，没有大片条纹。',
 孟加拉猫:'浅底毛上分布深色实心斑点，暂不表现环状玫瑰斑。',
 '英短（蓝猫）':'全身均匀的蓝灰色，来自黑色的稀释。',
};
export const coatDescription=(name:string,p:Phenotype)=>coatReferences[name]??commonCoat(p).description;
export const inspirationPairs:{name:string;mother:string;father:string}[]=[
 {name:'黑妈妈 × 橘爸爸',mother:'黑猫',father:'橘猫'},
 {name:'两只银虎斑',mother:'美短银虎斑',father:'美短银虎斑'},
 {name:'两只银渐层',mother:'英短银渐层',father:'英短银渐层'},
 {name:'浅橘白一家',mother:'浅橘白',father:'浅橘白'},
 {name:'带条纹的重点色',mother:'虎斑重点色',father:'虎斑重点色'},
];
export function inspirationCoats(index:number):[Phenotype,Phenotype]{
 const pair=inspirationPairs[index];
 return [pair.mother,pair.father].map((name,i)=>presetCoat({sex:i===0?'female':'male'} as Phenotype,commonPresets.find(c=>c.name===name)!.patch)) as [Phenotype,Phenotype];
}
