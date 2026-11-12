import {renderRenovationsPanel} from './renovations-panel.js';
import {createRenovationDesign,createOriginalDesign} from '../data/renovations.js';
import {getPhotoPreset} from '../data/photo-presets.js';
import {renderLayoutPanel} from './layout-panel.js';
import {state} from '../state/store.js';

import {colors,countertops,floors,backs,handles} from '../data/catalog.js';

import {cabinets,applyAll,preset,capture,onCabinetSelection,zoom} from '../scene/kitchen.js';

import {downloadData,quote} from '../services/files.js';

import {validateDesign} from '../state/validation.js';

import {$,toast} from './dom.js';

let history=[],redo=[];
const comparisonDrafts=new Map();

function remember(){history.push(JSON.stringify(state));
if(history.length>80)history.shift();
redo=[]}
function refresh(){applyAll();
renderPanel();
$('projectName').textContent=state.project;
$('undo').disabled=!history.length;
$('redo').disabled=!redo.length}
function setState(fn){remember();
fn();
refresh()}
const categories=[['ideas','✦','Remodelar mi cocina'],['layout','⊞','Distribución'],['cabinets','▤','Gabinetes'],['counter','▱','Encimera'],['floor','▦','Piso'],['back','▧','Pared / Salpicadero'],['handles','⌁','Tiradores'],['views','⬡','Vistas y cámara'],['info','ⓘ','Sobre el prototipo']];

function showCategories(){$('categories').innerHTML=categories.map(([id,icon,label])=>`<button class="cat ${state.category===id?'active':''}" data-cat="${id}"><span class="sym">${icon}</span>${label}</button>`).join('');
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;
renderPanel();
showCategories()})}
function swatches(data,current,fn){return `<div class="swatches">${data.map((o,i)=>`<button class="swatch ${current===i?'active':''}" data-val="${i}" title="${o.name}"><i style="background:${o.hex}"></i><span>${o.name}</span></button>`).join('')}</div>`}
function bindValues(fn){$('panel').querySelectorAll('[data-val]').forEach(btn=>btn.onclick=()=>fn(+btn.dataset.val))}
function renderPanel(){const cat=state.category;
const info={ideas:['Remodelar mi cocina','Tres propuestas para transformar tu espacio.'],layout:['Distribución','Añade módulos y ajusta su posición en la propuesta.'],cabinets:['Gabinetes','Elige estilo y color; puedes personalizar un gabinete individual.'],counter:['Encimera','Cambia el acabado de las superficies en tiempo real.'],floor:['Piso','El suelo completo cambiará de material.'],back:['Pared / Salpicadero','Selecciona el revestimiento detrás de la encimera.'],handles:['Tiradores','Cambia el acabado metálico de las manijas.'],views:['Cámara y vistas','Explora libremente el modelo tridimensional.'],info:['Acerca del prototipo','Qué funciona y qué falta para la versión final.']}[cat];
$('panelTitle').textContent=info[0];
$('panelSubtitle').textContent=info[1];
showCategories();
const panel=$('panel');if(cat==='ideas'){renderRenovationsPanel(panel);return;}if(cat==='layout'){renderLayoutPanel(panel,setState);return;}
if(cat==='cabinets'){
const styles=['Shaker','Plano','Clásico','Rústico'];
const types=[['all','Todos'],['upper','Superiores'],['lower','Inferiores'],['selected','Seleccionado']];
const selection=state.selected?cabinets.find(c=>c.id===state.selected):null;
const current=state.scope==='selected'&&selection?(state.custom[selection.id]?.color||(selection.type==='upper'?state.upper:state.lower)):state.scope==='upper'?state.upper:state.lower;
panel.innerHTML=`<div class="group"><div class="tabs"><button class="tab ${state.tab==='modelo'?'active':''}" data-tab="modelo">Modelo</button><button class="tab ${state.tab==='color'?'active':''}" data-tab="color">Color</button></div></div><div class="group"><h3>Aplicar cambios a</h3><div class="scope">${types.map(([v,l])=>`<button class="scopetab ${state.scope===v?'active':''}" data-scope="${v}" ${(v==='selected'&&!selection)||(v==='upper'&&!cabinets.some(c=>c.type==='upper'))?'disabled':''}>${l}</button>`).join('')}</div></div>${selection?`<div class="hint">Gabinete seleccionado: <b>${selection.name}</b> · Haz clic en el espacio vacío para mantener esta selección o elige otro gabinete.</div>`:'<div class="hint">💡 Haz clic sobre cualquier gabinete en la escena 3D para cambiarlo individualmente.</div>'}<div class="group" id="choices"></div>`;
panel.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;
renderPanel()});
panel.querySelectorAll('[data-scope]').forEach(b=>b.onclick=()=>{state.scope=b.dataset.scope;
renderPanel()});
if(state.tab==='modelo'){const target=state.scope==='selected'&&selection?state.custom[selection.id]?.style||state.style:state.style;
$('choices').innerHTML=`<h3>Estilo de puerta</h3><div class="choices">${styles.map(s=>`<button class="choice ${target===s?'active':''}" data-style="${s}"><div class="door-preview ${s.toLowerCase().replace('ú','u')}"></div>${s}</button>`).join('')}</div><div class="hint">Los estilos se construyen con geometría 3D. El catálogo comercial final usará modelos específicos de Hogarica.</div>`;
panel.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>setState(()=>{if(state.scope==='selected'&&selection)state.custom[selection.id]={...(state.custom[selection.id]||{}),style:b.dataset.style};
else if(state.scope==='all'){state.style=b.dataset.style;
Object.values(state.custom).forEach(c=>delete c.style)}else{cabinets.filter(c=>c.type===state.scope).forEach(c=>{state.custom[c.id]={...state.custom[c.id],style:b.dataset.style}})}}))}else{$('choices').innerHTML=`<h3>Color de los gabinetes</h3>${swatches(colors,Math.max(0,colors.findIndex(c=>c.hex===current)))}`;
bindValues(i=>setState(()=>{const hex=colors[i].hex;
if(state.scope==='selected'&&selection){state.custom[selection.id]={...(state.custom[selection.id]||{}),color:hex}}else if(state.scope==='upper'){state.upper=hex;
cabinets.filter(c=>c.type==='upper').forEach(c=>{if(state.custom[c.id])delete state.custom[c.id].color})}else if(state.scope==='lower'){state.lower=hex;
cabinets.filter(c=>c.type==='lower').forEach(c=>{if(state.custom[c.id])delete state.custom[c.id].color})}else{state.upper=hex;
state.lower=hex;
Object.values(state.custom).forEach(c=>delete c.color)}}))}return}
const datasets={counter:countertops,floor:floors,back:backs,handles:handles};
if(datasets[cat]){const property={counter:'top',floor:'floor',back:'back',handles:'handle'}[cat];
panel.innerHTML=`<div class="group"><h3>Acabados disponibles</h3>${swatches(datasets[cat],state[property])}</div><div class="hint">Visualización de productos de muestra. En la versión comercial estos acabados provendrán de la base de datos de Hogarica.</div>`;
bindValues(i=>setState(()=>state[property]=i));
return}
if(cat==='views'){panel.innerHTML=`<div class="group"><h3>Ángulos de cámara</h3><div style="display:grid;gap:10px"><button class="outline" data-v="front">◧ Vista frontal</button><button class="outline" data-v="side">⬡ Vista lateral</button><button class="outline" data-v="top">▤ Vista superior</button><button class="outline" data-v="iso">◇ Vista panorámica</button></div></div><div class="group"><button class="primary" id="picPanel" style="width:100%">↓ Descargar captura PNG</button></div>`;
panel.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>preset(b.dataset.v));
$('picPanel').onclick=capture;
return}
panel.innerHTML=`<div class="group"><h3>Incluido en esta versión</h3><div class="sub" style="font-size:13px;line-height:2">✓ Modelo 3D construido con Three.js<br>✓ Rotación y zoom libres<br>✓ Selección de gabinetes por clic<br>✓ Materiales y estilos ajustables al instante<br>✓ Descarga de captura PNG<br>✓ Exportación e importación de configuración JSON<br>✓ Descarga de solicitud TXT</div></div><div class="group"><h3>Para la siguiente fase</h3><div class="sub" style="font-size:13px;line-height:1.8">Reconstrucción de la cocina a partir de la fotografía del cliente, medidas verificadas, catálogo real de Hogarica y cotización conectada al sistema administrativo.</div></div>`}
export function wire(){onCabinetSelection(renderPanel);document.addEventListener('hogarica:template',e=>setState(()=>{state.referenceId=null;state.renovationId=null;state.layout=e.detail;state.extra=e.detail==='u'?3:0;state.positions={};state.hidden=[];state.selected=null;state.category='layout'}));
document.addEventListener('hogarica:photo',e=>{const photo=getPhotoPreset(e.detail);if(!photo)return;setState(()=>Object.assign(state,createOriginalDesign(photo.id)))});
document.addEventListener('hogarica:proposal',e=>{
 if(!state.referenceId)return;
 setState(()=>Object.assign(state,createRenovationDesign(state.referenceId,e.detail)));
 comparisonDrafts.set(state.referenceId,structuredClone(state));
 toast('Propuesta aplicada. Puedes seguir personalizándola.');
 if(matchMedia('(max-width:800px)').matches)$('stage').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
});
document.addEventListener('hogarica:compare',e=>{
 if(!state.referenceId)return;
 if(e.detail==='original'){
  if(!state.renovationId)return;
  comparisonDrafts.set(state.referenceId,structuredClone(state));
  setState(()=>Object.assign(state,createOriginalDesign(state.referenceId)));
 }else{
  const draft=comparisonDrafts.get(state.referenceId);
  if(draft)setState(()=>Object.assign(state,structuredClone(draft),{category:'ideas'}));
  else{state.category='ideas';renderPanel();}
 }
});
refresh();
$('save').onclick=downloadData;
$('load').onclick=()=>$('loadFile').click();
$('loadFile').onchange=async e=>{const f=e.target.files?.[0];
if(!f)return;
try{const data=validateDesign(JSON.parse(await f.text()));
remember();
for(const k of ['renovationId','referenceId','layout','extra','positions','hidden','category','tab','scope','selected','style','upper','lower','custom','top','floor','back','handle','project']){if(Object.prototype.hasOwnProperty.call(data,k))state[k]=data[k]}state.selected=null;
state.scope='all';
$('projectName').textContent=state.project;
refresh();
toast('Diseño importado correctamente.')}catch(err){toast('No se pudo abrir el diseño JSON.')}e.target.value=''};
$('capture').onclick=capture;
$('reset').onclick=()=>preset('front');
$('quote').onclick=()=>$('modal').classList.remove('hidden');
$('cancel').onclick=()=>$('modal').classList.add('hidden');
$('downloadQuote').onclick=quote;
$('modal').onclick=e=>{if(e.target===$('modal'))$('modal').classList.add('hidden')};
$('rename').onclick=()=>{let a=prompt('Nombre del proyecto:',state.project);
if(a&&a.trim()){setState(()=>state.project=a.trim().slice(0,120))}};
$('undo').onclick=()=>{if(!history.length)return;
redo.push(JSON.stringify(state));
Object.assign(state,JSON.parse(history.pop()));
refresh()};
$('redo').onclick=()=>{if(!redo.length)return;
history.push(JSON.stringify(state));
Object.assign(state,JSON.parse(redo.pop()));
refresh()};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>preset(b.dataset.view));
$('zoomin').onclick=()=>{zoom(.8)};
$('zoomout').onclick=()=>{zoom(1.2)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('modal').classList.add('hidden');
state.selected=null;
state.scope='all';
refresh()}})}
