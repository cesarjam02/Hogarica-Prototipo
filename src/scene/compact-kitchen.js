import * as THREE from 'three';

// Approximate editable scene prepared from test3.jfif.
export function buildCompactKitchen({root, box, cylinder, material, addCabinet, matTop, matFloor, matBack}) {
  const cream = material('#e6e5d9', .5);
  const charcoal = material('#343f40', .55, .25);
  const black = material('#252924', .5);
  const steel = material('#a9ada5', .3, .65);
  const trim = material('#62462e', .88);
  const pink = material('#dea79d', .55);
  function texture(draw, repeatX=1, repeatY=1) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    draw(canvas.getContext('2d'));
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
    map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(repeatX,repeatY);
    return map;
  }
  const panelMap=texture(ctx=>{
    const shades=['#ad8b5c','#b59462','#9f7e52','#b0956a'];
    for(let i=0;i<8;i++){
      ctx.fillStyle=shades[i%4];ctx.fillRect(i*32,0,32,256);
      ctx.strokeStyle='#5f4d32';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*32,0);ctx.lineTo(i*32,256);ctx.stroke();
      for(let j=0;j<5;j++){
        ctx.strokeStyle='#61462344';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(i*32+5+j*5,0);
        ctx.bezierCurveTo(i*32+j*5,80,i*32+12+j*5,160,i*32+5+j*5,256);ctx.stroke();
      }
      ctx.fillStyle='#6d543655';ctx.beginPath();ctx.ellipse(i*32+16,35+(i*43)%180,2.5,9,.1,0,Math.PI*2);ctx.fill();
    }
  },2,1);
  matBack.map=panelMap;matBack.needsUpdate=true;
  matFloor.map=texture(ctx=>{
    ctx.fillStyle='#e1ddc9';ctx.fillRect(0,0,256,256);
    for(let i=0;i<90;i++){
      ctx.fillStyle=['#918a6b18','#fffef32b','#ad9f7a22'][i%3];
      ctx.fillRect((i*61)%256,(i*37)%256,12+i%19,5+i%13);
    }
    ctx.strokeStyle='#aaa18b';ctx.lineWidth=2;ctx.strokeRect(0,0,256,256);
  },5,6);matFloor.needsUpdate=true;
  box(root,4.6,.12,6,0,-.07,-.1,matFloor,false);
  // Warm timber panels on both walls; leave a doorway in the back wall.
  box(root,.12,3.3,5.9,-2.3,1.65,-.15,matBack,false);
  box(root,.12,3.3,5.9,2.3,1.65,-.15,matBack,false);
  box(root,1.12,3.3,.12,-1.8,1.65,-3.04,matBack,false);
  box(root,1.96,3.3,.12,1.35,1.65,-3.04,matBack,false);
  box(root,1.54,.7,.12,-.47,2.95,-3.04,matBack,false);
  for(const x of [-1.24,.3])box(root,.09,2.6,.17,x,1.3,-2.96,trim);
  box(root,1.63,.1,.17,-.47,2.6,-2.96,trim);
  box(root,1.47,.025,1.5,-.47,0,-3.6,material('#b88b5b'),false);
  const brick=material('#a36649',.95),grout=material('#d7c1a5',.95);
  box(root,1.6,2.7,.09,-.47,1.35,-4.15,grout,false);
  for(let y=0;y<13;y++)for(let x=0;x<5;x++)box(root,.29,.18,.025,-1.12+x*.32+(y%2)*.14,.1+y*.2,-4.09,brick,false);
  box(root,.5,.35,.04,-.47,2.99,-2.95,material('#b8c8c7'));

  function cabinet(options){
    const c=addCabinet(options);
    box(c.group,c.w+.07,.08,c.d+.16,0,c.h+.05,0,matTop);
    box(c.group,c.w,.05,.035,0,.07,c.d/2+.02,trim);
    return c;
  }
  for(const z of [.55,1.35])cabinet({x:-1.8,y:0,z,w:.78,h:1.04,d:.86,rotation:Math.PI/2,name:'Mueble de madera'});
  for(const z of [.45,1.25])cabinet({x:1.8,y:0,z,w:.78,h:1.04,d:.86,rotation:-Math.PI/2,name:'Mueble blanco'});

  // Range and hood sit on the left wall, perpendicular to the doorway.
  const range=new THREE.Group();range.position.set(-1.77,0,-.9);range.rotation.y=Math.PI/2;root.add(range);
  box(range,1.22,1.07,.94,0,.535,0,cream);
  box(range,1.07,.79,.025,0,.48,.483,steel);
  box(range,.91,.6,.025,0,.49,.501,black);
  box(range,.75,.42,.018,0,.47,.519,material('#616c67',.25,.2));
  box(range,1.01,.045,.09,0,.87,.55,cream);
  box(range,1.22,.22,.08,0,1.18,-.42,cream);
  box(range,.29,.09,.025,0,1.2,-.365,black);
  box(range,.1,.035,.01,0,1.2,-.348,material('#81ac70'));
  for(const x of [-.4,-.13,.13,.4])cylinder(range,.035,.035,.03,x,1.01,.49,cream,Math.PI/2);
  for(const x of [-.31,.31])for(const z of [-.22,.23]){
    cylinder(range,.13,.13,.02,x,1.085,z,black);
    box(range,.43,.025,.025,x,1.11,z,black);box(range,.025,.025,.35,x,1.11,z,black);
  }
  // A hanging towel, visible on the original oven handle.
  box(range,.21,.48,.018,.26,.66,.6,material('#d4cab9',.95));
  box(range,1.37,.2,.83,0,2.13,-.12,cream);
  box(range,1.25,.14,.39,0,2.29,-.31,cream);
  for(let i=0;i<8;i++)box(range,.06,.025,.015,-.4+i*.11,2.29,-.105,black);

  // Tall graphite refrigerator behind the right-hand worktop.
  box(root,1.33,2.55,1.14,1.22,1.275,-2.13,charcoal);
  box(root,1.28,2.5,.045,1.22,1.275,-1.533,charcoal);
  box(root,.055,1.55,.07,.65,1.25,-1.48,steel);
  const magnet=material('#b28f6b');cylinder(root,.043,.043,.02,.92,1.69,-1.493,magnet,Math.PI/2);

  const clutterStart=root.children.length;
  // Pink coffee machine on the left, air fryer and blender on the right.
  box(root,.31,.45,.29,-1.78,1.35,.86,pink);
  box(root,.24,.05,.29,-1.78,1.16,.86,pink);
  cylinder(root,.09,.09,.19,-1.6,1.28,.86,material('#51463b',.25));
  box(root,.27,.1,.29,-1.73,1.56,.86,pink);
  cylinder(root,.24,.22,.35,1.73,1.33,1.13,black);
  cylinder(root,.24,.2,.18,1.73,1.59,1.13,steel);
  cylinder(root,.2,.24,.08,1.73,1.72,1.13,black);
  box(root,.065,.23,.08,1.45,1.36,1.13,black);
  box(root,.37,.33,.36,1.8,1.3,.47,cream);
  box(root,.22,.15,.2,1.8,1.54,.22,black);
  cylinder(root,.085,.065,.31,1.8,1.77,.22,material('#b8ccc5',.23));
  cylinder(root,.1,.1,.035,1.8,1.94,.22,black);

  const clutterParts=root.children.slice(clutterStart);
  const ceilingStart=root.children.length;
  // Light ceiling grid suggested with slim rails, leaving the room open above.
  for(const x of [-2.2,-.75,.75,2.2])box(root,.025,.025,5.8,x,3.3,-.15,trim,false);
  for(const z of [-2.9,-1.45,0,1.45,2.7])box(root,4.5,.025,.025,0,3.3,z,trim,false);
  return {clutter:clutterParts,ceiling:root.children.slice(ceilingStart),applianceMaterial:charcoal};
}
