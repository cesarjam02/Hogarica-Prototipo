import {Reflector} from 'three/addons/objects/Reflector.js';
import * as THREE from 'three';

// Complete alternative furniture plans. The original photo scenes remain untouched.
import {getRemodelingPlan} from '../data/remodeling-plans.js';

export function buildRemodeledKitchen({referenceId,proposal,root,box,cylinder,material,addCabinet,matTop,matFloor,matBack}) {
  const layout=getRemodelingPlan(referenceId,proposal.id)?.layout;
  if(!layout)throw new Error('Distribución de remodelación no disponible');
  root.userData.layout=layout;
  const compact=referenceId==='compact-test', rustic=referenceId==='rustic-test';
  const W=compact?4.6:8, back=compact?-3:-3.25, height=compact?3.3:3.8;
  const white=material('#eeeae0',.65), metal=material('#393d3a',.32,.65), steel=material('#9ca8a7',.25,.7);
  const timber=material('#b68e5c',.75), dark=material('#202e30',.32), fabric=material('#bcb8a7',.95);
  const glow=material('#fff0d7',.2);glow.emissive.set('#ffd19a');glow.emissiveIntensity=3;
  const glass=new THREE.MeshPhysicalMaterial({color:'#bed2cd',transparent:true,opacity:.23,roughness:.09,metalness:.12});
  const woodCanvas=document.createElement('canvas');woodCanvas.width=woodCanvas.height=128;
  const ctx=woodCanvas.getContext('2d');ctx.fillStyle='#f7ead2';ctx.fillRect(0,0,128,128);
  for(let i=0;i<75;i++){ctx.strokeStyle='#79542c33';ctx.beginPath();ctx.moveTo(i*1.8,0);ctx.bezierCurveTo(i*1.8+4,40,i*1.8-5,90,i*1.8,128);ctx.stroke();}
  timber.map=new THREE.CanvasTexture(woodCanvas);timber.map.colorSpace=THREE.SRGBColorSpace;

  function led(parent,w,x,y,z,rotation=0){const m=box(parent,w,.022,.035,x,y,z,glow,false);m.rotation.y=rotation;return m;}
  function spot(x,y,z,tx,ty,tz,power=9){
    const light=new THREE.SpotLight(0xffdfb6,power,9,.65,.75,1.5);
    light.position.set(x,y,z);light.target.position.set(tx,ty,tz);root.add(light,light.target);
  }
  function pendant(x,y,z,kind='globe'){
    cylinder(root,.012,.012,height-y-.1,x,(height+y)/2,z,metal);
    cylinder(root,.07,.07,.045,x,height-.04,z,metal);
    if(kind==='globe'){
      const sphere=new THREE.Mesh(new THREE.SphereGeometry(.17,20,16),glow);sphere.position.set(x,y,z);root.add(sphere);
      cylinder(root,.06,.06,.08,x,y+.17,z,metal);
    }else if(kind==='cone'){
      cylinder(root,.065,.27,.24,x,y,z,metal);cylinder(root,.245,.245,.012,x,y-.126,z,glow);
    }else{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.25,.022,8,36),glow);ring.rotation.x=Math.PI/2;ring.position.set(x,y,z);root.add(ring);
    }
    spot(x,y-.18,z,x,1,z,8);
  }
  function linearLamp(x,z,w,y=2.75,rotation=0){
    const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rotation;root.add(group);
    box(group,w,.055,.07,0,0,0,metal);led(group,w-.04,0,-.033,0);box(group,w-.08,.024,.012,0,0,.041,glow,false);
    for(const dx of [-w*.36,w*.36])cylinder(group,.008,.008,height-y,dx,(height-y)/2,0,metal);
    spot(x,y-.08,z,x,.9,z,13);
  }
  function track(z,length=5){
    box(root,length,.045,.05,0,height-.17,z,metal);
    for(const x of [-length*.36,0,length*.36]){
      cylinder(root,.065,.065,.15,x,height-.27,z,metal);cylinder(root,.053,.053,.012,x,height-.35,z,glow);
      spot(x,height-.38,z,x,1,z-1.2,7);
    }
  }
  function stool(x,z,rotation=0){
    cylinder(root,.23,.23,.1,x,.7,z,fabric);
    for(const dx of [-.14,.14])for(const dz of [-.14,.14])cylinder(root,.018,.018,.65,x+dx,.33,z+dz,metal);
    const foot=new THREE.Mesh(new THREE.TorusGeometry(.18,.012,6,24),metal);foot.rotation.x=Math.PI/2;foot.position.set(x,.3,z);root.add(foot);
    const rest=box(root,.42,.22,.05,x,.87,z+.19,fabric);rest.rotation.y=rotation;
  }
  function plant(x,y,z,size=.2){
    cylinder(root,size*.65,size*.5,size,x,y+size/2,z,white);
    const leafMat=material('#607c58',.85);
    for(let i=0;i<6;i++){
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(size*.48,10,8),leafMat);leaf.scale.set(.55,2.1,.65);
      leaf.position.set(x+Math.sin(i*2.4)*size*.5,y+size*1.8+(i%2)*size*.4,z+Math.cos(i*2.4)*size*.4);leaf.rotation.z=Math.sin(i)*.5;root.add(leaf);
    }
  }
  function cabinet(x,z,w=1,type='lower',rotation=0,opts={}){
    const upper=type==='upper',h=opts.h||(upper?.8:1.02),y=opts.y??(upper?2.02:0),d=opts.d||(upper?.4:.74);
    const c=addCabinet({x,y,z,w,h,d,type,rotation,name:opts.name||'Mueble de remodelación'});
    c.modernHardware=true;c.drawerFronts=!upper&&!opts.tall;c.faces[0].material=c.doorMat;
    if(!upper&&!opts.tall)box(c.group,w+.035,.075,d+.15,0,h+.045,0,matTop);
    if(upper){led(c.group,w*.92,0,-.02,d/2-.04);}
    else if(!opts.tall)led(c.group,w*.88,0,.055,d/2+.02);
    return c;
  }
  function tower(x,z,w=.9,rotation=0,oven=true){
    const c=cabinet(x,z,w,'lower',rotation,{h:2.94,d:.78,tall:true,name:oven?'Torre de hornos':'Despensa de suelo a techo'});
    if(oven){
      box(c.group,w-.09,.66,.045,0,1.3,.44,dark);
      box(c.group,w-.19,.4,.02,0,1.27,.47,glass);
      box(c.group,w-.23,.026,.055,0,1.55,.49,steel);
      box(c.group,w-.09,.39,.045,0,2,.44,dark);
      box(c.group,w-.19,.22,.02,0,1.99,.47,glass);
    }
    return c;
  }
  function shelf(x,y,z,w,rotation=0){
    const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rotation;root.add(group);
    box(group,w,.065,.28,0,0,0,timber);led(group,w-.08,0,-.045,.08);
    plant(x,y+.04,z,.12);
    for(const dx of [-w*.27,w*.27])cylinder(group,.07,.06,.16,dx,.12,0,white);
  }
  function sink(c){
    const y=c.h+.095;
    box(c.group,c.w*.7,.018,c.d*.65,0,y,0,steel);
    box(c.group,c.w*.57,.025,c.d*.49,0,y+.012,0,dark);
    cylinder(c.group,.02,.02,.35,.25,y+.18,-.22,metal);
    cylinder(c.group,.02,.02,.23,.25,y+.35,-.12,metal,Math.PI/2);
  }
  function hob(c){
    c.noHandle=true;c.drawerFronts=false;
    box(c.group,c.w-.12,.6,.04,0,.45,c.d/2+.055,dark);
    box(c.group,c.w-.24,.37,.016,0,.44,c.d/2+.084,glass);
    box(c.group,c.w-.3,.027,.055,0,.73,c.d/2+.11,steel);
    box(c.group,Math.min(c.w-.1,.86),.025,.55,0,c.h+.105,0,dark);
    for(const x of [-.2,.2])for(const z of [-.15,.15]){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.09,.005,6,24),steel);ring.rotation.x=Math.PI/2;ring.position.set(x,c.h+.122,z);c.group.add(ring);
    }
  }
  function fridge(x,z,w=.98){
    box(root,w,2.7,.88,x,1.35,z,steel);
    box(root,w-.035,1.1,.035,x,.57,z+.46,white);
    box(root,w-.035,1.53,.035,x,1.94,z+.46,white);
    box(root,.03,.59,.06,x-w*.36,1.7,z+.5,metal);
  }
  function display(x,y,z,w=1,rotation=0){
    const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rotation;root.add(group);
    box(group,w,.045,.38,0,0,0,timber);box(group,w,.045,.38,0,1.35,0,timber);
    for(const dx of [-w/2,w/2]){box(group,.035,1.35,.38,dx,.675,0,metal);led(group,1.23,dx,.67,.18).rotation.z=Math.PI/2;}
    box(group,w,1.3,.018,0,.67,.21,glass);
    for(const h of [.4,.83]){
      box(group,w-.05,.025,.34,0,h,0,timber);
      for(const dx of [-w*.25,0,w*.25])cylinder(group,.075,.04,.16,dx,h+.09,0,white);
    }
  }
  function breakfast(x,z,w=1.7,rotation=0){
    const group=new THREE.Group();group.position.set(x,1.09,z);group.rotation.y=rotation;root.add(group);
    box(group,w,.08,.72,0,0,0,timber);
    for(const dx of [-w*.4,w*.4])box(group,.055,1.08,.5,dx,-.55,0,metal);
  }
  function slats(parent,w,y,z){for(let x=-w/2+.04;x<w/2;x+=.09)box(parent,.035,.88,.035,x,y,z,timber);}
  // Same envelope and openings as the source; furniture and lights are redesigned.
  box(root,W,.12,compact?6:7.4,0,-.07,0,matFloor,false);
  for(let x=-W/2;x<W/2;x+=.7)box(root,.008,.002,compact?6:7.4,x,.001,0,white,false);
  for(let z=-3;z<3.7;z+=.9)box(root,W,.002,.008,0,.002,z,white,false);
  if(compact){
    box(root,.1,height,5.8,-2.3,height/2,-.1,matBack,false);box(root,.1,height,5.8,2.3,height/2,-.1,matBack,false);
    box(root,1.04,height,.1,-1.78,height/2,back,matBack,false);box(root,1.98,height,.1,1.3,height/2,back,matBack,false);
    box(root,1.54,.7,.1,-.47,2.95,back,matBack,false);
    for(const x of [-1.24,.3])box(root,.065,2.6,.14,x,1.3,back+.06,timber);
    box(root,1.61,.07,.14,-.47,2.6,back+.06,timber);
    box(root,1.5,2.7,.1,-.47,1.35,back-1.2,timber,false);
    box(root,1.45,.025,1.2,-.47,0,back-.6,timber,false);
    fridge(1.25,-2.1,1.25);
  }else if(rustic){
    box(root,1.1,height,.12,-3.45,height/2,back,matBack,false);
    box(root,4.16,height,.12,1.54,height/2,back,matBack,false);
    box(root,2.4,1.08,.12,-1.72,.54,back,matBack,false);box(root,2.4,.35,.12,-1.72,3.63,back,matBack,false);
    box(root,2.35,2.2,.025,-1.72,2.2,back-.03,material('#b4d0c0',.4));
    for(const x of [-2.9,-1.72,-.54])box(root,.06,2.35,.1,x,2.22,back+.07,white);
    for(const y of [1.05,2.2,3.43])box(root,2.42,.06,.1,-1.72,y,back+.07,white);
    box(root,.1,height,6.6,3.65,height/2,-.05,matBack,false);
  }else{
    box(root,W,height,.13,0,height/2,back,matBack,false);
    box(root,.1,height,2,-4,height/2,back+1,white,false);
  }
  // Visible cove lighting gives every remodel a layered evening presentation.
  led(root,W-.2,0,height-.17,back+.11);
  if(compact){for(const x of [-2.2,2.2]){led(root,5.5,x,height-.17,-.1,Math.PI/2);}}
  const ambient=new THREE.PointLight(0xffe4c3,8,9);ambient.position.set(0,2.7,back+1.4);root.add(ambient);

  if(layout==='island-breakfast'){
    for(let i=0;i<5;i++){const c=cabinet(-2.7+i*1.09,-2.72,1.06);if(i===1)sink(c);if(i===4)hob(c);}
    for(const z of [-1.55,-.46,.63])cabinet(3.1,z,1.06,'lower',-Math.PI/2);
    for(const x of [-1.35,-.3])cabinet(x,.65,1.02);
    const table=new THREE.Group();table.position.set(.7,1.09,.65);root.add(table);
    const top=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.08,48),timber);top.scale.z=1.1;table.add(top);
    cylinder(table,.13,.22,1.05,0,-.55,0,metal);stool(.9,1.55);stool(1.57,.55);
    for(const y of [1.95,2.63])shelf(3.28,y,-.35,3.4,-Math.PI/2);
    for(const x of [-1.2,-.05])pendant(x,2.6,.65,'globe');plant(2.6,1.12,-2.6);
  }
  if(layout==='peninsula-pantry'){
    for(let i=0;i<4;i++){const c=cabinet(-2.7+i*1.08,-2.72,1.05);if(i===1)sink(c);if(i===3)hob(c);}
    for(const z of [-1.55,-.45,.62])cabinet(3.1,z,1.07,'lower',-Math.PI/2);
    for(const x of [2.2,1.12,.04])cabinet(x,1.12,1.05,'lower',Math.PI);
    box(root,3.6,.085,1.02,1.15,1.1,1.12,matTop);stool(.1,2.03);stool(1.25,2.03);
    tower(3.1,-2.55,.97,-Math.PI/2,true);
    for(const z of [-1.5,-.42])cabinet(3.22,z,1.05,'upper',-Math.PI/2,{h:1.1,y:1.9});
    linearLamp(1.1,1.12,2.9);plant(-2.5,1.12,-2.6);
  }
  if(layout==='waterfall-social'){
    for(let i=0;i<4;i++){const c=cabinet(-2.65+i*1.08,-2.72,1.05);if(i===1)sink(c);}
    tower(3.05,-2.1,1.05,-Math.PI/2,true);tower(3.05,-.96,1.05,-Math.PI/2,false);
    for(const x of [-1.5,-.45,.6]){const c=cabinet(x,.65,1.02);if(x===-.45)hob(c);}
    box(root,3.55,.08,1.22,-.45,1.1,.65,matTop);
    for(const x of [-2.2,1.3])box(root,.08,1.08,1.22,x,.55,.65,matTop);
    const facing=new THREE.Group();facing.position.set(-.45,0,1.24);root.add(facing);slats(facing,3.3,.51,0);
    for(const x of [-1.5,-.4,.7]){stool(x,1.97);pendant(x,2.65,.65,'ring');}
    display(3.38,1.45,.55,1.25,-Math.PI/2);plant(-2.4,1.12,-2.6);
  }
  if(layout==='breakfast-l'){
    for(const x of [-2.1,-1.05,0,1.05,2.1]){const c=cabinet(x,-2.72,1.02);if(x===0)sink(c);if(x===2.1)hob(c);}
    tower(-3.25,-2.72,1.05,0,true);fridge(3.25,-2.72,1.05);
    cabinet(-2.7,-1.65,1.05,'lower',Math.PI/2);breakfast(-2.7,-.2,2.2,Math.PI/2);
    stool(-1.7,-.55);stool(-1.7,.45);
    for(const y of [1.95,2.62])shelf(-1.62,y,-2.85,3.4);
    pendant(-2.7,2.65,-.4,'cone');pendant(-2.7,2.65,.5,'cone');
    box(root,1.08,.14,.65,2.1,2.23,-2.65,steel);plant(.4,1.12,-2.65);
  }
  if(layout==='preparation-island'){
    for(const x of [-2.1,-1.05,0,1.05,2.1]){const c=cabinet(x,-2.72,1.02);if(x===0)hob(c);}
    for(const x of [-2.1,-1.05,2.1])cabinet(x,-2.9,1.04,'upper',0,{h:1.12,y:2.01});
    tower(-3.25,-2.72,1.05,0,true);fridge(3.25,-2.72,1.05);
    for(const x of [-.78,.3]){const c=cabinet(x,.3,1.05);if(x===-.78)sink(c);}
    box(root,2.5,.075,1.13,-.24,1.1,.3,matTop);stool(.4,1.45);
    for(const x of [-1.05,-.2,.65])pendant(x,2.65,.3,'globe');
    shelf(-.1,2.55,-2.91,1.1);plant(-2.6,1.12,-2.6);
  }
  if(layout==='display-gallery'){
    fridge(-2.95,-2.72,1.05);tower(2.95,-2.72,1.05,0,true);
    for(const x of [-1.86,-.79,.28,1.35]){const c=cabinet(x,-2.72,1.04);if(x===-.79)sink(c);if(x===1.35)hob(c);}
    display(-1.25,1.65,-2.83,1.6);display(.65,1.65,-2.83,1.6);
    breakfast(2.7,.15,1.8,Math.PI/2);stool(1.75,.15);
    const frame=new THREE.Group();frame.position.set(2.7,0,.15);root.add(frame);slats(frame,1.8,.5,.35);
    track(-.65,5.7);plant(-1.8,1.12,-2.6);
  }
  if(layout==='single-wall-ledge'){
    for(const z of [-.3,.65,1.6]){const c=cabinet(-1.85,z,.92,'lower',Math.PI/2);if(z===-.3)hob(c);if(z===1.6)sink(c);}
    for(const z of [-.2,.73,1.66])cabinet(-2.02,z,.9,'upper',Math.PI/2,{h:.82});
    // The opposing bulky units become a shallow floating breakfast shelf.
    box(root,.34,.07,1.65,2.05,1.04,.95,timber);stool(1.45,.75);
    const mirror=new Reflector(new THREE.PlaneGeometry(1.65,.72),{color:0xb7c7c5,textureWidth:512,textureHeight:512,clipBias:.003});mirror.rotation.y=-Math.PI/2;mirror.position.set(2.23,1.72,.95);root.add(mirror);
    linearLamp(0,.15,2.1,2.8,0);plant(2.04,1.1,1.6,.13);
  }
  if(layout==='galley-coffee'){
    for(const z of [-.3,.65,1.6]){const c=cabinet(-1.85,z,.92,'lower',Math.PI/2);if(z===-.3)hob(c);if(z===1.6)sink(c);}
    for(const z of [.35,1.3])cabinet(1.85,z,.92,'lower',-Math.PI/2);
    tower(1.87,-.64,.85,-Math.PI/2,false);
    cabinet(-2.03,.9,1.55,'upper',Math.PI/2,{h:1.04,y:1.96});
    box(root,.055,1.14,1.75,2.22,2.13,.85,timber);
    shelf(2.08,1.62,.85,1.72,-Math.PI/2);shelf(2.08,2.61,.85,1.72,-Math.PI/2);
    cylinder(root,.11,.11,.28,1.82,1.25,.45,metal);cylinder(root,.075,.07,.12,1.82,1.17,.8,white);
    for(const [x,z] of [[-.3,-.55],[.3,.75]])pendant(x,2.7,z,'cone');plant(1.8,1.12,1.6,.14);
  }
  if(layout==='compact-l-workshop'){
    for(const z of [.45,1.4]){const c=cabinet(-1.85,z,.92,'lower',Math.PI/2);if(z===.45)sink(c);}
    const returnUnit=cabinet(-1.85,-1.45,.85);hob(returnUnit);
    tower(-1.85,-.5,.65,Math.PI/2,true);
    cabinet(1.94,1.12,1.38,'lower',-Math.PI/2,{d:.5,name:'Aparador poco profundo'});
    display(2.13,1.58,1.12,1.38,-Math.PI/2);
    shelf(-2.08,2.03,1.2,1.35,Math.PI/2);shelf(-2.08,2.7,1.2,1.35,Math.PI/2);
    track(.3,2.7);plant(1.9,1.12,1.6,.13);
  }
  const worklight=new THREE.PointLight(0xffd6a1,5,7);worklight.position.set(compact?-1.1:0,1.8,compact?.6:-1.8);root.add(worklight);
  root.userData.planMetrics={layout,cabinets:root.children.filter(object=>object.type==='Group').length};
}
