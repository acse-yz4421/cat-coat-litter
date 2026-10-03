import { type Phenotype } from './genetics';
export const challenges = [
 {title:'银白底上的蝴蝶纹',hint:'试试「两只银虎斑」，找一只有清楚蝴蝶纹的银色小猫。',matches:(p:Phenotype)=>!p.whiteCoat&&!!p.silver&&!p.shaded&&!p.point&&p.base==='black'&&p.pattern==='classic'&&p.white<3},
 {title:'柔柔的银渐层',hint:'试试「两只银渐层」，看看谁继承了浅底毛和深色毛尖。',matches:(p:Phenotype)=>!p.whiteCoat&&!!p.silver&&!!p.shaded&&p.pattern!=='solid'&&!p.point&&p.white<3},
 {title:'浅橘配白毛',hint:'试试「浅橘白一家」，找一只浅橘色与白毛相间的小猫。',matches:(p:Phenotype)=>!p.whiteCoat&&p.base==='red'&&p.dilute&&p.white>0&&!p.silver&&!p.point},
 {title:'带条纹的小面具',hint:'试试「带条纹的重点色」，观察脸和尾巴上的纹路。',matches:(p:Phenotype)=>!p.whiteCoat&&p.point&&['tabby','classic'].includes(p.pattern)&&!p.shaded&&p.white<2},
];
