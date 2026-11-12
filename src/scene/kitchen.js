import {getRenovation} from '../data/renovations.js';
import {buildRemodeledKitchen} from './remodeled-kitchen.js';
import {getRemodelingPlan} from '../data/remodeling-plans.js';
import {buildCompactKitchen} from './compact-kitchen.js';
import {buildClassicKitchen} from './classic-kitchen.js';
import {getPhotoPreset} from '../data/photo-presets.js';
import {buildRusticKitchen} from './rustic-kitchen.js';
import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import {colors,countertops,floors,backs,handles} from '../data/catalog.js';

import {state} from '../state/store.js';

import {$,toast} from '../ui/dom.js';

const wingParts=[];
export let baseCount=15;
let activeRenovation,activeReference,referenceFloorMap=null,referenceBackMap=null;
let onSelection=()=>{};

export function onCabinetSelection(callback){onSelection=callback;
}
export let cabinets=[],floorTiles=[],backTiles=[],handleMeshes=[],doorPanels=[],renderer,scene,camera,controls,root,raycaster,pointer,animId;

const material=(c,rough=.58,metal=0)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});

const wallMat=material('#eae9e4');
let matTop=material(countertops[0].hex,.24),matHandle=material(handles[0].hex,.24,.72),matFloor=material(floors[0].hex,.85),matBack=material(backs[0].hex,.32);

function box(parent,w,h,d,x,y,z,mat,cast=true){let mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
mesh.position.set(x,y,z);
mesh.castShadow=cast;
mesh.receiveShadow=true;
parent.add(mesh);
return mesh}
function cylinder(parent,r1,r2,h,x,y,z,mat,rotX=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,20),mat);
m.position.set(x,y,z);
m.rotation.x=rotX;
m.castShadow=true;
parent.add(m);
return m}
export function init(){const stage=$('stage');
scene=new THREE.Scene();
scene.background=new THREE.Color('#dfdfdc');
camera=new THREE.PerspectiveCamera(45,stage.clientWidth/stage.clientHeight,.1,100);
renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(stage.clientWidth,stage.clientHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
stage.prepend(renderer.domElement);
controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=.07;
controls.minDistance=4.2;
controls.maxDistance=19;
controls.maxPolarAngle=Math.PI/2.08;
controls.target.set(0,1.4,-1.4);
controls.enablePan=true;
raycaster=new THREE.Raycaster();
pointer=new THREE.Vector2();
const ambient=new THREE.HemisphereLight(0xffffff,0xc0b5a4,2.1);ambient.name='ambient';scene.add(ambient);
const sun=new THREE.DirectionalLight(0xfff1df,2.4);
sun.name='daylight';sun.position.set(2,9,6);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-10;
sun.shadow.camera.right=10;
sun.shadow.camera.top=10;
sun.shadow.camera.bottom=-10;
sun.shadow.bias=-.0005;
scene.add(sun);
const fill=new THREE.DirectionalLight(0xd8e7ff,1.1);
fill.name='fill';fill.position.set(-6,5,-2);
scene.add(fill);
root=new THREE.Group();
scene.add(root);
rebuildScene();
applyAll();
preset('front');
const ro=new ResizeObserver(()=>{let w=stage.clientWidth,h=stage.clientHeight;
if(!w||!h)return;
camera.aspect=w/h;
camera.updateProjectionMatrix();
renderer.setSize(w,h)});
ro.observe(stage);
let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;
const bounds=renderer.domElement.getBoundingClientRect();
pointer.x=((e.clientX-bounds.left)/bounds.width)*2-1;
pointer.y=-((e.clientY-bounds.top)/bounds.height)*2+1;
raycaster.setFromCamera(pointer,camera);
const hits=raycaster.intersectObjects(cabinets.filter(c=>c.group.visible).flatMap(c=>c.clickable),false);
if(hits.length){const id=hits[0].object.userData.cabinetId;
state.selected=id;
state.scope='selected';
onSelection();
applyAll();
toast('Gabinete '+id+' seleccionado. Puedes modificarlo por separado.')}});
function tick(){animId=requestAnimationFrame(tick);
controls.update();
renderer.render(scene,camera)}tick()}
function buildRoom(){const m=material('#eeeae5');
box(root,12,.13,10,0,-.07,-.4,m,false);
box(root,11,4.8,.15,0,2.35,-4.13,wallMat,false);
box(root,.13,4.8,8,-5.95,2.35,-.2,wallMat,false);
box(root,11,.12,.14,0,.12,-4.02,material('#dad4cb'),false);
box(root,.12,.12,8,-5.89,.12,-.1,material('#dad4cb'),false);
 // window on left wall
const frame=material('#545c63',.32,.25),glass=new THREE.MeshPhysicalMaterial({color:'#a1cad9',transparent:true,opacity:.35,metalness:.1,roughness:.1});
box(root,.08,1.62,2.2,-5.86,2.1,-1.6,glass,false);
box(root,.1,.07,2.35,-5.81,2.95,-1.6,frame);
box(root,.1,.07,2.35,-5.81,1.28,-1.6,frame);
box(root,.1,1.7,.07,-5.81,2.1,-2.78,frame);
box(root,.1,1.7,.07,-5.81,2.1,-.42,frame);
box(root,.1,1.7,.05,-5.80,2.1,-1.62,frame);
 // flooring grid
for(let x=-5.65;
x<5.8;
x+=.8)for(let z=-3.96;
z<4.5;
z+=.8){const tile=box(root,.785,.014,.785,x+.37,.015,z+.37,matFloor,false);
floorTiles.push(tile)} // backsplash, back wall
for(let x=-4.5;
x<4.9;
x+=.58){for(let y=1.07;
y<2.32;
y+=.3){const tile=box(root,.571,.292,.025,x+.285,y+.146,-4.022,matBack,false);
backTiles.push(tile)}}
// crown, ceiling lighting decorative
for(let x of [-3,-.5,2.1]){const puck=cylinder(root,.11,.11,.032,x,4.55,-2.9,material('#fff6da',.25));
puck.rotation.z=Math.PI/2;
const glow=new THREE.PointLight(0xffddb5,.65,4);
glow.position.set(x,3.1,-3.2);
root.add(glow)} }
let cabCount=0;

function addCabinet({x,y,z,w=.88,h=.9,d=.68,type='lower',rotation=0,name}){const id=String(++cabCount).padStart(2,'0');
const group=new THREE.Group();
group.position.set(x,y,z);
group.rotation.y=rotation;
root.add(group);
const shell=material('#c6bfb1');
const faces=[];
const frame=box(group,w,h,d,0,h/2,0,shell);
frame.userData.cabinetId=id;
faces.push(frame);
const doorMat=material(state[type],.38);
let width=w-.07;
const door=box(group,width,h-.09,.055,0,h/2,d/2+.025,doorMat);
door.userData.cabinetId=id;
faces.push(door);
const detail=new THREE.Group();
group.add(detail);
const handleGroup=new THREE.Group();
group.add(handleGroup);
const c={id,name:name||((type==='upper'?'Superior ':'Inferior ')+id),type,group,w,h,d,faces,door,doorMat,detail,handleGroup,clickable:faces,rotation};
cabinets.push(c);
makeDoor(c);
return c}
function makeDoor(c){while(c.detail.children.length){const o=c.detail.children.pop();
o.geometry?.dispose();
if(o.material && o.material!==c.doorMat && o.material!==matHandle && o.material!==c.trimMat)o.material.dispose()}while(c.handleGroup.children.length){const o=c.handleGroup.children.pop();
o.geometry?.dispose();
if(o.material && o.material!==c.doorMat && o.material!==matHandle && o.material!==c.trimMat)o.material.dispose()}const style=state.style;
const d=c.d/2+.06,w=c.w-.07,h=c.h-.09;
const localStyle=state.custom[c.id]?.style||style;
if(localStyle==='Shaker'||localStyle==='Clásico'){const trim=localStyle==='Clásico'?.063:.075;
const dm=c.modernHardware?c.doorMat:(c.trimMat||c.doorMat);
box(c.detail,w-.04,trim,.023,0,c.h/2+h/2-trim/2-.02,d,dm);
box(c.detail,w-.04,trim,.023,0,c.h/2-h/2+trim/2+.02,d,dm);
box(c.detail,trim,h-.04,.023,-w/2+trim/2+.02,c.h/2,d,dm);
box(c.detail,trim,h-.04,.023,w/2-trim/2-.02,c.h/2,d,dm);
if(localStyle==='Clásico'){const inset=material('#9a9a9a',.8);
box(c.detail,w-.2,.018,.008,0,c.h/2+h/2-.13,d+.016,inset);
box(c.detail,w-.2,.018,.008,0,c.h/2-h/2+.13,d+.016,inset)}}if(localStyle==='Rústico'){for(let x=-w/2+.1;
x<w/2;
x+=.16)box(c.detail,.018,h-.04,.018,x,c.h/2,d,c.doorMat)}const hx=c.w/2-.14;
const hy=c.type==='upper'?c.h*.22:c.h*.72;
const hm=matHandle;
if(c.noHandle){}else if(c.modernHardware){
 box(c.handleGroup,.23,.025,.04,0,c.type==='upper'?.12:c.h*.77,d+.06,hm);
 if(c.drawerFronts){
  for(const y of [c.h*.33,c.h*.66])box(c.detail,c.w-.09,.012,.009,0,y,d+.004,c.doorMat);
  for(const y of [c.h*.18,c.h*.48])box(c.handleGroup,.23,.025,.04,0,y,d+.06,hm);
 }
}else box(c.handleGroup,.035,.18,.04,hx,hy,d+.06,hm);
c.clickable=[...c.faces,...c.detail.children,...c.handleGroup.children];
c.clickable.forEach(o=>o.userData.cabinetId=c.id)}
function buildCabinets(){// Rear wall cabinets facing positive Z
for(let i=0;
i<7;
i++){let x=-3.9+i*1.05;
if(i===4)continue;
addCabinet({x,y:0,z:-3.55,w:1.03,h:.88,d:.68,type:'lower'})}
for(let i=0;
i<7;
i++){if(i===4)continue;
let x=-3.9+i*1.05;
addCabinet({x,y:2.04,z:-3.68,w:1.03,h:1.12,d:.43,type:'upper'})}
// Left wing cabinets: side orientation outward facing +X
for(let i=0;
i<3;
i++){let z=-2.95+i*1.05;
addCabinet({x:-5.13,y:0,z,w:1.02,h:.88,d:.67,type:'lower',rotation:Math.PI/2})}
// counter segments
for(let i=0;
i<7;
i++){const x=-3.9+i*1.05;
box(root,1.052,.075,.9,x,.93,-3.46,matTop)}for(let i=0;
i<3;
i++){const z=-2.95+i*1.05;
wingParts.push(box(root,.87,.075,1.04,-5.01,.93,z,matTop))} }
function buildAppliances(){const steel=material('#8e969d',.25,.7),dark=material('#171d25',.14,.3),black=material('#252b32',.35),burner=material('#22242b');
 // hood and stove in cabinet gap i4
const xx=-3.9+4*1.05;
box(root,.96,.88,.72,xx,.44,-3.5,steel);
box(root,.88,.55,.058,xx,.54,-3.104,dark);
box(root,.96,.12,.76,xx,.92,-3.5,steel);
box(root,.93,.025,.74,xx,1.0,-3.5,black);
for(let dx of [-.24,.24])for(let dz of [-.2,.2]){cylinder(root,.12,.12,.014,xx+dx,1.019,-3.52+dz,burner)}box(root,.14,.75,.14,xx,2.9,-3.78,steel);
const hood=box(root,1.14,.15,.79,xx,2.42,-3.62,steel);
hood.rotation.z=0;
 // fridge right
box(root,1.15,3.1,.86,5.18,1.55,-3.55,steel);
box(root,1.08,1.61,.055,5.18,2.26,-3.095,steel);
box(root,1.08,1.38,.055,5.18,.74,-3.095,steel);
box(root,.045,.82,.07,5.6,2.23,-3.04,black);
box(root,.045,.55,.07,5.6,.72,-3.04,black);

// sink
const sinkStart=root.children.length;
box(root,.65,.015,.41,-5.0,.983,-2.03,steel);
box(root,.53,.02,.3,-5.0,.985,-2.03,dark);
cylinder(root,.024,.027,.6,-4.77,1.26,-2.26,steel);
cylinder(root,.025,.025,.33,-4.77,1.57,-2.13,steel,Math.PI/2);

wingParts.push(...root.children.slice(sinkStart));
// Decor
box(root,.31,.04,.17,1.5,1.04,-3.54,material('#9c774f'));
for(let i=0;
i<3;
i++)cylinder(root,.045,.045,.18,1.35+i*.09,1.14,-3.5,material(i%2?'#e0cead':'#c6a977'));
const pot=material('#e6ddcc');
cylinder(root,.15,.12,.23,-2.2,1.1,-3.52,pot);
const leaf=material('#5d8065');
for(let i=0;
i<7;
i++){const stem=box(root,.035,.31,.025,-2.2+(i-3)*.037,1.36,-3.52,leaf);
stem.rotation.z=(i-3)*.19} }
function buildDetails(){// under cabinet lights
for(let c of cabinets.filter(c=>c.type==='upper')){box(c.group,c.w*.8,.02,.05,0,.02,c.d/2,material('#ffdbac',.2))} }
function rebuildScene() {
  const shared = new Set([matTop,matFloor,matBack,matHandle,wallMat]);
  const materials = new Set(), textures = new Set();
  root.traverse(object => {
    object.geometry?.dispose();
    if(typeof object.getRenderTarget==='function')object.getRenderTarget().dispose();
    const list = Array.isArray(object.material) ? object.material : [object.material];
    for (const mat of list) if(mat && !shared.has(mat)) materials.add(mat);
  });
  for(const c of cabinets)if(c.glassMat)materials.add(c.glassMat);
  for(const mat of materials) {if(mat.map)textures.add(mat.map);mat.dispose();}
  if(referenceFloorMap)textures.add(referenceFloorMap);
  if(referenceBackMap)textures.add(referenceBackMap);
  textures.forEach(texture=>texture.dispose());
  matFloor.map=null;matFloor.needsUpdate=true;referenceFloorMap=null;
  matBack.map=null;matBack.needsUpdate=true;referenceBackMap=null;
  root.clear();cabinets=[];cabCount=0;wingParts.length=0;floorTiles=[];backTiles=[];
  activeReference=state.referenceId;activeRenovation=state.renovationId;
  const builder={'rustic-test':buildRusticKitchen,'classic-test':buildClassicKitchen,'compact-test':buildCompactKitchen}[state.referenceId];
  if(builder) {
    const proposal=getRenovation(state.referenceId,state.renovationId);
    const helpers={root,box,cylinder,material,addCabinet,matTop,matFloor,matBack};
    if(proposal)buildRemodeledKitchen({...helpers,referenceId:state.referenceId,proposal});
    else builder(helpers);
    referenceFloorMap=matFloor.map;
    referenceBackMap=matBack.map;
  } else {buildRoom();buildCabinets();buildAppliances();buildDetails();}
  const remodeled=!!state.renovationId;
  scene.getObjectByName('ambient').intensity=remodeled?.85:2.1;
  scene.getObjectByName('daylight').intensity=remodeled?1.45:2.4;
  scene.getObjectByName('fill').intensity=remodeled?.5:1.1;
  renderer.toneMappingExposure=remodeled?1.08:1.25;
  baseCount=cabinets.length;
}
export function applyAll(){
if(activeReference!==state.referenceId||activeRenovation!==state.renovationId){rebuildScene();preset('front');}
while(cabinets.length<baseCount+state.extra){
 const n=cabinets.length-baseCount;
 const c=addCabinet({x:state.referenceId?1.25:3.6,y:0,z:(state.referenceId?-1.3:-2.4)+n*1.05,w:1.02,h:.88,d:.68,rotation:-Math.PI/2,name:'Módulo añadido '+(n+1)});
 box(c.group,1.06,.075,.84,0,.93,0,matTop);
}
wingParts.forEach(part=>part.visible=state.layout!=='line');
cabinets.forEach((c,index)=>{
 c.group.visible=!state.hidden.includes(c.id)&&(index<baseCount||index<baseCount+state.extra)&&(state.referenceId||state.layout!=='line'||index<12||index>=baseCount);
 if(!c.home)c.home={x:c.group.position.x,z:c.group.position.z};
 const position=state.positions[c.id]||c.home;
 c.group.position.x=position.x;c.group.position.z=position.z;
const hex=state.custom[c.id]?.color||(c.type==='upper'?state.upper:state.lower);
c.doorMat.color.set(hex);
makeDoor(c);
const selected=state.selected===c.id;
c.doorMat.emissive.set(selected?'#37200e':'#000000');
c.doorMat.emissiveIntensity=selected?.15:0});
matTop.color.set(countertops[state.top].hex);
matFloor.color.set(floors[state.floor].hex);
const floorMap=state.referenceId && state.floor===getPhotoPreset(state.referenceId)?.design.floor?referenceFloorMap:null;
if(matFloor.map!==floorMap){matFloor.map=floorMap;matFloor.needsUpdate=true;}
matBack.color.set(backs[state.back].hex);
const backMap=state.referenceId && state.back===getPhotoPreset(state.referenceId)?.design.back?referenceBackMap:null;
if(matBack.map!==backMap){matBack.map=backMap;matBack.needsUpdate=true;}
matHandle.color.set(handles[state.handle].hex);
$('selectedNotice').classList.toggle('hidden',!state.selected);
$('selectedNotice').textContent=state.selected?'✓ Seleccionado: '+cabinets.find(c=>c.id===state.selected)?.name:'';
$('summaryCab').textContent=colors.find(c=>c.hex===state.lower)?.name||state.lower;
$('miniCab').style.background=state.lower;
$('summaryTop').textContent=countertops[state.top].name;
$('miniTop').style.background=countertops[state.top].hex;
$('summaryFloor').textContent=floors[state.floor].name;
$('miniFloor').style.background=floors[state.floor].hex;
$('summaryHandle').textContent=handles[state.handle].name;
$('miniHandle').style.background=handles[state.handle].hex;
const proposal=getRenovation(state.referenceId,state.renovationId);
const badge=document.querySelector('.demo-badge');if(badge)badge.textContent=proposal?'Remodelación · '+proposal.name:'Diseño original · Demo';
document.dispatchEvent(new CustomEvent('hogarica:reference',{detail:state.referenceId}));}

export function preset(name){const points={front:[6.8,4.2,10.7],side:[10,4.7,1.0],top:[.01,12,-1.38],iso:[8.2,6.1,8.5]};
const rustic={front:[-5.9,3.5,7.2],side:[-6,3.3,-.2],top:[.01,10,.2],iso:[-6.7,5.1,7.5]};
const photo=getPhotoPreset(state.referenceId);
const plan=getRemodelingPlan(state.referenceId,state.renovationId);
const p=(name==='front'&&plan?plan.camera:null)||(photo?.views||(state.referenceId?rustic:points))[name]||points.front;
camera.position.set(...p);
controls.target.set(...(plan?.target||photo?.target||[0,1.45,state.referenceId?-.4:-1.45]));
controls.update();
document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
$('zoomLabel').textContent='100%'}

export function capture(){try{renderer.render(scene,camera);
const data=renderer.domElement.toDataURL('image/png');
const a=document.createElement('a');
a.href=data;
a.download='Hogarica_cocina_3D.png';
a.click();
toast('Captura 3D descargada en PNG.')}catch(err){toast('No se pudo descargar la captura: '+err.message)}}

export function zoom(factor){camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);
controls.update();
$('zoomLabel').textContent=Math.round(1300/camera.position.distanceTo(controls.target))+'%'}
