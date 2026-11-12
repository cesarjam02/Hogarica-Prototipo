import {getRenovation} from '../data/renovations.js';
import {getPhotoPreset} from '../data/photo-presets.js';
import {colors,countertops,floors,backs,handles} from '../data/catalog.js';

const styles=['Shaker','Plano','Clásico','Rústico'];

const categories=['ideas','layout','cabinets','counter','floor','back','handles','views','info'];

const color=value=>colors.some(item=>item.hex===value);

export function validateDesign(data){
  const fail=()=>{throw new Error('Configuración de diseño no válida')};

  if(!data || typeof data!=='object' || Array.isArray(data))fail();

  if(!categories.includes(data.category) || !styles.includes(data.style))fail();

  if(!color(data.upper)||!color(data.lower))fail();

  for(const [key,list] of Object.entries({top:countertops,floor:floors,back:backs,handle:handles})){
    if(!Number.isInteger(data[key]) || data[key]<0 || data[key]>=list.length)fail();

  }
  if(typeof data.project!=='string'||!data.project.trim()||data.project.length>120)fail();

  if(!data.custom || typeof data.custom!=='object'||Array.isArray(data.custom))fail();

  const custom={};

  for(const [id,value] of Object.entries(data.custom)){
    if(!/^(0[1-9]|1[0-9])$/.test(id)||!value||typeof value!=='object'||Array.isArray(value))fail();

    if(value.color!==undefined&&!color(value.color))fail();

    if(value.style!==undefined&&!styles.includes(value.style))fail();

    custom[id]={...(value.color?{color:value.color}:{}),...(value.style?{style:value.style}:{})};

  }
  const layout=data.layout??'l',extra=data.extra??0,hidden=data.hidden??[],positions=data.positions??{};
  const validId=id=>/^(0[1-9]|1[0-9])$/.test(id);
  if(!['line','l','u'].includes(layout)||!Number.isInteger(extra)||extra<0||extra>4)fail();
  if(!Array.isArray(hidden)||!hidden.every(validId))fail();
  if(!positions||typeof positions!=='object'||Array.isArray(positions))fail();
  const cleanPositions={};
  for(const [id,point] of Object.entries(positions)){
    if(!validId(id)||!point||!Number.isFinite(point.x)||!Number.isFinite(point.z)||Math.abs(point.x)>5.2||point.z< -3.6||point.z>3.5)fail();
    cleanPositions[id]={x:point.x,z:point.z};
  }
  const referenceId=data.referenceId??null;
  if(referenceId!==null&&!getPhotoPreset(referenceId))fail();
  const renovationId=data.renovationId??null;
  if(renovationId!==null&&!getRenovation(referenceId,renovationId))fail();
  return {renovationId,referenceId,layout,extra,hidden:[...hidden],positions:cleanPositions,category:data.category,tab:data.tab==='color'?'color':'modelo',scope:'all',selected:null,style:data.style,upper:data.upper,lower:data.lower,custom,top:data.top,floor:data.floor,back:data.back,handle:data.handle,project:data.project.trim()};

}
