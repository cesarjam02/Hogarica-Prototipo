import * as THREE from 'three';

// Hand-built approximation of test2.jpg: a single wall, no island.
export function buildClassicKitchen({root, box, cylinder, material, addCabinet, matTop, matFloor, matBack}) {
  const wall = material('#eee9dc', .92);
  const white = material('#eeeeea', .45);
  const dark = material('#252b28', .45);
  const steel = material('#a4aaa7', .25, .6);
  const gold = material('#bea56b', .3, .65);
  const oak = material('#684323', .72);

  function texture(draw, repeatX = 1, repeatY = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    draw(canvas.getContext('2d'));
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    return map;
  }
  const grain = texture(ctx => {
    ctx.fillStyle = '#f5e8cf'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 160; i++) {
      ctx.strokeStyle = `rgba(60,37,13,${.05 + (i % 6) * .015})`;
      ctx.beginPath(); ctx.moveTo(i * 1.7, 0);
      ctx.bezierCurveTo(i * 1.7 + 6, 90, i * 1.7 - 8, 170, i * 1.7, 256); ctx.stroke();
    }
  });
  const mosaic = texture(ctx => {
    const shades = ['#c5a573', '#e3d5b7', '#bca985', '#eee4ca', '#c7c6b4'];
    for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) {
      ctx.fillStyle = shades[(x * 3 + y * 7) % shades.length];
      ctx.fillRect(x * 64, y * 64, 64, 64);
      ctx.strokeStyle = '#a49b80'; ctx.lineWidth = 2; ctx.strokeRect(x * 64, y * 64, 64, 64);
    }
  }, 6, 1);
  matBack.map = mosaic; matBack.needsUpdate = true;
  matFloor.map = texture(ctx => {
    ctx.fillStyle = '#dfc9a9'; ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 4; y++) {
      ctx.fillStyle = ['#dac4a5', '#f1ddbf', '#d2bb99', '#ead5b6'][y];
      ctx.fillRect(0, y * 64, 256, 64);
      ctx.strokeStyle = '#af9878'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y * 64); ctx.lineTo(256, y * 64); ctx.stroke();
      ctx.strokeRect((y % 2) * 128, y * 64, 128, 64);
      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = '#bfa98955'; ctx.beginPath(); ctx.moveTo(0, y * 64 + i * 5);
        ctx.lineTo(256, y * 64 + i * 5 + 3); ctx.stroke();
      }
    }
  }, 4, 5);
  matFloor.needsUpdate = true;
  box(root, 8.2, .12, 6, 0, -.07, -.1, matFloor, false);
  box(root, 8.2, 3.8, .16, 0, 1.9, -2.8, wall, false);
  box(root, .13, 3.8, 2.1, -4.08, 1.9, -1.8, wall, false);
  box(root, 8, .1, .13, 0, 3.64, -2.67, white);
  box(root, 6.4, .93, .035, -.34, 1.6, -2.696, matBack, false);
  box(root, 6.4, .08, .05, -.34, .1, -2.66, oak);

  function cabinet(options, counter = false) {
    const c = addCabinet(options);
    c.doorMat.map = grain; c.doorMat.needsUpdate = true;
    c.trimMat = dark;
    c.faces[0].material = oak;
    if (counter) box(c.group, c.w + .025, .07, c.d + .16, 0, c.h + .045, 0, matTop);
    return c;
  }
  // Four lower doors to the left, drawer cupboard and wide door to the right.
  for (let i = 0; i < 4; i++) cabinet({x: -2.7 + i * .72, y: 0, z: -2.2, w: .7, h: 1.03, d: .83}, true);
  cabinet({x: 1.02, y: 0, z: -2.2, w: .62, h: 1.03, d: .83}, true);
  cabinet({x: 1.98, y: 0, z: -2.2, w: 1.26, h: 1.03, d: .83}, true);
  // Upper doors follow the same interrupted run around the central hood.
  for (let i = 0; i < 4; i++) {
    const c = cabinet({x: -2.7 + i * .72, y: 2.05, z: -2.39, w: .7, h: 1.27, d: .45, type: 'upper'});
    if (i >= 2) {
      c.glassFront = true;
      c.faces[0].visible = false;
      // Hollow casing lets the shelves remain visible through the glass.
      box(c.group,.035,c.h,c.d,-c.w/2+.017,c.h/2,0,oak);
      box(c.group,.035,c.h,c.d,c.w/2-.017,c.h/2,0,oak);
      box(c.group,c.w,.035,c.d,0,.017,0,oak);
      box(c.group,c.w,.035,c.d,0,c.h-.017,0,oak);
      box(c.group,c.w,c.h,.025,0,c.h/2,-c.d/2,oak);
      c.glassMat = new THREE.MeshPhysicalMaterial({color: '#a6c0b4', transparent: true, opacity: .38, roughness: .13, metalness: .08});
      c.door.material = c.glassMat;
      const interior = new THREE.Group(); interior.position.set(0, .13, .08); c.group.add(interior);
      for (const y of [.24, .65]) {
        box(interior, .61, .025, .27, 0, y, 0, oak);
        for (const x of [-.17, 0, .17]) cylinder(interior, .055, .035, .14, x, y + .085, 0, material(x ? '#c4cbaa' : '#728b94', .3));
      }
    }
  }
  for (const [x, w] of [[1.14, .83], [2.08, 1.02]]) cabinet({x, y: 2.05, z: -2.39, w, h: 1.27, d: .45, type: 'upper'});

  // White freestanding range centred in the gap.
  box(root, .86, 1.06, .94, .29, .53, -2.14, white);
  box(root, .71, .66, .025, .29, .47, -1.653, dark);
  box(root, .58, .44, .018, .29, .45, -1.63, material('#455454', .18, .3));
  box(root, .63, .035, .07, .29, .81, -1.605, steel);
  box(root, .32, .075, .025, .29, .97, -1.647, dark);
  for (const x of [-.03, .1, .48, .61]) cylinder(root, .031, .031, .035, x, .97, -1.61, steel, Math.PI / 2);
  for (const x of [.05, .52]) for (const z of [-2.4, -1.97]) {
    cylinder(root, .105, .105, .02, x, 1.083, z, dark);
    box(root, .31, .018, .025, x, 1.103, z, dark);
    box(root, .025, .018, .29, x, 1.103, z, dark);
  }
  // Cream hood and a tall, narrow chimney.
  box(root, 1.07, .15, .69, .29, 2.1, -2.34, white);
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(.26, .56, .25, 4), white);
  canopy.rotation.y = Math.PI / 4; canopy.scale.z = .64; canopy.position.set(.29, 2.29, -2.4); root.add(canopy);
  box(root, .34, 1.05, .31, .29, 2.91, -2.58, white);

  // Full-height white fridge at the right edge of the photograph.
  box(root, 1.04, 2.92, 1.05, 3.22, 1.46, -2.15, white);
  box(root, 1.01, 1.05, .04, 3.22, .56, -1.605, white);
  box(root, 1.01, 1.78, .04, 3.22, 2.02, -1.605, white);
  box(root, .82, .035, .07, 3.22, 1.12, -1.55, white);
  box(root, .82, .035, .07, 3.22, 1.25, -1.55, white);
  // Microwave, small appliances and cutting board.
  box(root, .88, .42, .42, 1.91, 1.73, -2.35, steel);
  box(root, .59, .29, .025, 1.82, 1.73, -2.126, dark);
  box(root, .07, .24, .04, 2.22, 1.73, -2.1, white);
  box(root, .95, .04, .49, 1.91, 1.49, -2.34, steel);
  const clutterStart=root.children.length;
  box(root, .47, .59, .035, -2.18, 1.39, -2.62, material('#bda36d'));
  for (const x of [-.73, 1.21, 2.43]) {
    cylinder(root, .12, .1, .26, x, 1.24, -2.35, steel);
    cylinder(root, .125, .125, .035, x, 1.385, -2.35, dark);
  }
  for (let i = 0; i < 3; i++) cylinder(root, .04, .04, .19, -2.86 + i * .1, 1.18, -2.28, material(['#ae4625', '#d0a534', '#e2d3b1'][i]));
  cylinder(root, .2, .16, .2, 3.2, 3.02, -2.2, white);
  for (let i = 0; i < 9; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), material('#64884b'));
    leaf.scale.set(.6, 1.8, .5); leaf.rotation.z = Math.sin(i) * .7;
    leaf.position.set(3.2 + Math.sin(i * 2.4) * .24, 3.25 + (i % 3) * .08, -2.2 + Math.cos(i * 2.4) * .2); root.add(leaf);
  }
  return {clutter:root.children.slice(clutterStart),wallMaterial:wall,trimMaterial:oak};
}
