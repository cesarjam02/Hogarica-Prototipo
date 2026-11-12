import * as THREE from 'three';

// Approximate, editable geometry authored from src/images/test.jpg.
// No image recognition, backend, external models or reconstruction service.
export function buildRusticKitchen({root, box, cylinder, material, addCabinet, matTop, matFloor, matBack}) {
  const plaster = material('#eee8d7', .92);
  const wood = material('#e4dfcc', .85);
  const iron = material('#353126', .5, .5);
  const ceramic = material('#f4eedc', .4);
  const steel = material('#93958c', .28, .65);
  const glass = material('#b6d5c0', .25);
  const foliage = material('#56744a', .95);
  const terracotta = material('#a78659', .9);
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = tileCanvas.height = 256;
  const ctx = tileCanvas.getContext('2d');
  for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) {
    ctx.fillStyle = (x + y) % 2 ? '#b4a68a' : '#f7f2e6';
    ctx.fillRect(x * 128, y * 128, 128, 128);
    ctx.strokeStyle = '#928978'; ctx.lineWidth = 2; ctx.strokeRect(x * 128, y * 128, 128, 128);
    if ((x + y) % 2 === 0) {
      const cx = x * 128 + 64, cy = y * 128 + 64;
      ctx.fillStyle = '#b6b19b';
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        ctx.beginPath(); ctx.ellipse(cx + Math.cos(angle) * 23, cy + Math.sin(angle) * 23, 17, 10, angle, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#c88769'; ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fill();
    }
  }
  const tileTexture = new THREE.CanvasTexture(tileCanvas);
  tileTexture.colorSpace = THREE.SRGBColorSpace;
  tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.repeat.set(6, 6);
  matFloor.map = tileTexture; matFloor.needsUpdate = true;
  box(root, 7.6, .12, 7.8, 0, -.07, 0, matFloor, false);
  // Rear wall with a real opening around the tall window.
  box(root, 1, 3.8, .16, -3.3, 1.9, -3.25, plaster, false);
  box(root, 3.4, 3.8, .16, 1.7, 1.9, -3.25, plaster, false);
  box(root, 2.3, 1.08, .16, -1.65, .54, -3.25, plaster, false);
  box(root, 2.3, .4, .16, -1.65, 3.6, -3.25, plaster, false);
  box(root, .16, 3.8, 6.8, 3.48, 1.9, .05, plaster, false);
  box(root, 2.27, 2.3, .035, -1.65, 2.23, -3.3, glass, false);
  for (const x of [-2.83, -1.65, -.47]) box(root, .065, 2.4, .15, x, 2.23, -3.14, wood);
  for (const y of [1.04, 2.2, 3.42]) box(root, 2.43, .065, .15, -1.65, y, -3.14, wood);
  box(root, 2.7, .09, .45, -1.65, 1.04, -3.02, ceramic);
  // Light painted timber beams, kept above the camera's main view.
  for (const z of [-2.9, -1.5, -.1, 1.3, 2.7]) box(root, 7, .17, .13, 0, 3.84, z, wood);

  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = grainCanvas.height = 128;
  const grain = grainCanvas.getContext('2d');
  grain.fillStyle = '#ffffff'; grain.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 100; i++) {
    grain.strokeStyle = `rgba(90,75,50,${.04 + (i % 5) * .012})`;
    grain.beginPath(); grain.moveTo(i * 1.37, 0); grain.bezierCurveTo(i * 1.37 + 5, 40, i * 1.37 - 4, 85, i * 1.37, 128); grain.stroke();
  }
  const grainTexture = new THREE.CanvasTexture(grainCanvas);
  grainTexture.colorSpace = THREE.SRGBColorSpace;
  function cabinet(options, counter = true) {
    const c = addCabinet(options);
    c.doorMat.map = grainTexture; c.doorMat.needsUpdate = true;
    c.faces[0].material = wood;
    if (counter) box(c.group, c.w + .06, .085, c.d + .16, 0, c.h + .055, 0, matTop);
    return c;
  }
  // Run beneath the window, return along the right wall, and a separate island.
  for (let i = 0; i < 5; i++) cabinet({x: -2.7 + i * 1.12, y: 0, z: -2.74, w: 1.1, h: 1, d: .8});
  for (const z of [-1.62, .62, 1.74]) cabinet({x: 2.95, y: 0, z, w: 1.1, h: 1, d: .8, rotation: -Math.PI / 2});
  for (const x of [-1.15, -.03]) cabinet({x, y: 0, z: .6, w: 1.1, h: 1.06, d: 1.08, name: 'Isla central'});
  // Oven on the right return, oriented toward the centre of the room.
  box(root, .82, 1, 1.08, 2.95, .5, -.5, ceramic);
  box(root, .035, .7, .85, 2.515, .52, -.5, iron);
  box(root, .025, .42, .62, 2.49, .46, -.5, material('#696e65', .25, .25));
  box(root, .07, .035, .68, 2.45, .76, -.5, steel);
  for (const z of [-.75, -.5, -.25]) cylinder(root, .035, .035, .04, 2.46, .91, z, iron).rotation.z = Math.PI / 2;
  box(root, .96, .085, 1.12, 2.95, 1.055, -.5, matTop);
  // Hob on the island, sink below the window.
  box(root, 1.35, .025, .63, -.6, 1.16, .5, steel);
  for (const x of [-.97, -.29]) for (const z of [.31, .7]) {
    cylinder(root, .12, .12, .02, x, 1.185, z, iron);
    box(root, .35, .018, .022, x, 1.2, z, iron);
    box(root, .022, .018, .32, x, 1.2, z, iron);
  }
  box(root, .75, .018, .48, -1.7, 1.105, -2.7, steel);
  box(root, .64, .02, .36, -1.7, 1.12, -2.7, material('#666e68'));
  cylinder(root, .025, .025, .42, -1.3, 1.32, -2.98, steel);
  cylinder(root, .025, .025, .24, -1.3, 1.53, -2.87, steel, Math.PI / 2);
  box(root,.025,.7,5.8,3.385,1.5,-.1,matBack,false);
  const shelvesStart=root.children.length;
  // Open shelves instead of wall cabinets, a defining feature of the source.
  for (const y of [1.96, 2.72]) {
    box(root, .49, .075, 4.4, 3.12, y, -.25, wood);
    box(root, .025, .12, 4.4, 2.865, y - .055, -.25, ceramic);
    for (let i = 0; i < 8; i++) {
      const z = -2.15 + i * .49;
      cylinder(root, .07, .055, .18, 3.04, y + .13, z, i % 3 ? ceramic : terracotta);
    }
  }
  const shelfParts=root.children.slice(shelvesStart);
  const rackStart=root.children.length;
  // A suspended iron rack with utensils over the island.
  for (const x of [-1.45, .3]) for (const z of [.18, 1]) cylinder(root, .012, .012, 1.2, x, 3.05, z, iron);
  for (const z of [.18, 1]) box(root, 1.84, .035, .035, -.58, 2.46, z, iron);
  for (const x of [-1.48, .34]) box(root, .035, .035, .86, x, 2.46, .59, iron);
  for (let i = 0; i < 5; i++) {
    const x = -1.35 + i * .34;
    cylinder(root, .012, .012, .36, x, 2.25, .99, iron);
    const spoon = new THREE.Mesh(new THREE.SphereGeometry(.075, 12, 8), iron);
    spoon.scale.set(1, 1.5, .25); spoon.position.set(x, 2.02, .99); root.add(spoon);
  }
  const rackParts=root.children.slice(rackStart);
  const clutterStart=root.children.length;
  // Plants and baskets give scale without obscuring the editable furniture.
  for (const [x, z] of [[.8, -2.7], [2.95, 1.6]]) {
    cylinder(root, .19, .16, .23, x, 1.24, z, terracotta);
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(.15, 10, 8), foliage);
      leaf.scale.set(.75, 1.5, .75); leaf.position.set(x + Math.sin(i * 2.4) * .13, 1.48 + (i % 2) * .1, z + Math.cos(i * 2.4) * .12); root.add(leaf);
    }
  }
  box(root, .45, .23, .38, 3.03, 2.88, -.3, terracotta);
  return {shelves:shelfParts,rack:rackParts,clutter:root.children.slice(clutterStart),wallMaterial:plaster,trimMaterial:wood};
}
