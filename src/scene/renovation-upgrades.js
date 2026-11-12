import * as THREE from 'three';

// Adds visible improvements to the photo's existing room, preserving its footprint.
export function addRenovationUpgrades({referenceId,upgrades,features,root,box,cylinder,material,addCabinet,cabinets}) {
  if(!upgrades)return;
  for(const object of features.clutter||[])if(upgrades.clearCounters)object.visible=false;
  for(const object of features.rack||[])if(upgrades.pendants)object.visible=false;
  for(const object of features.shelves||[])if(upgrades.closedStorage)object.visible=false;
  for(const object of features.ceiling||[])if(upgrades.cleanCeiling)object.visible=false;
  if(features.wallMaterial&&upgrades.wallColor)features.wallMaterial.color.set(upgrades.wallColor);
  if(features.trimMaterial)features.trimMaterial.color.set('#d3c5ae');
  if(features.applianceMaterial&&upgrades.applianceColor)features.applianceMaterial.color.set(upgrades.applianceColor);
  cabinets.forEach(c=>{
    c.faces[0].material=c.doorMat;c.modernHardware=true;c.drawerFronts=upgrades.drawers&&c.type==='lower';
    if(c.glassFront&&upgrades.solidDoors)c.door.material=c.doorMat;
  });
  if(upgrades.closedStorage&&referenceId==='rustic-test'){
    for(const z of [-1.6,-.48,.64,1.76])addCabinet({x:3.12,y:1.94,z,w:1.1,h:.8,d:.45,rotation:-Math.PI/2,type:'upper',name:'Almacenamiento renovado'}).modernHardware=true;
  }
  if(upgrades.closedStorage&&referenceId==='compact-test'){
    for(const x of [-2.02,2.02])for(const z of [.45,1.25])addCabinet({x,y:1.91,z,w:.78,h:.8,d:.43,rotation:x<0?Math.PI/2:-Math.PI/2,type:'upper',name:'Almacenamiento vertical'}).modernHardware=true;
  }
  const glow=material('#fff0cf',.25);glow.emissive.set('#ffe3aa');glow.emissiveIntensity=1.5;
  function strip(parent,w,x,y,z){box(parent,w,.018,.045,x,y,z,glow,false);}
  if(upgrades.lighting){
    for(const c of cabinets.filter(item=>item.type==='upper'))strip(c.group,c.w*.9,0,-.02,c.d/2-.04);
    if(referenceId==='rustic-test'&&!upgrades.closedStorage)for(const y of [1.91,2.67])box(root,.035,.02,4.3,2.9,y,-.25,glow,false);
    const fill=new THREE.PointLight(0xffdfad,1.7,7);fill.position.set(referenceId==='classic-test'?0:1.5,1.9,referenceId==='classic-test'?-1.8:0);root.add(fill);
  }
  if(upgrades.pendants){
    const metal=material('#393e37',.4,.5);
    for(const x of [-1.2,.05]){
      cylinder(root,.012,.012,.7,x,3.24,.6,metal);
      cylinder(root,.1,.25,.21,x,2.79,.6,metal);
      cylinder(root,.22,.22,.015,x,2.68,.6,glow);
      const light=new THREE.PointLight(0xffe0aa,.8,4);light.position.set(x,2.55,.6);root.add(light);
    }
  }
}
