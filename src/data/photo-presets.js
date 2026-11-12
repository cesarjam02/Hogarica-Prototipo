// Register each approved demo photograph with its hand-built 3D scene.
// Each entry owns its scene metadata, finishes and camera framing.
export const photoPresets = [
  {
    id: 'rustic-test',
    image: './src/images/test.jpg',
    name: 'Cocina rústica con isla',
    description: 'Muebles blancos, estantes abiertos, ventana alta y piso decorado.',
    layoutDescription: 'Muebles en L, isla central y estantes abiertos.',
    features: ['Isla central', 'Ventana alta', 'Estantes abiertos', 'Piso decorado'],
    design: {referenceId: 'rustic-test', project: 'Cocina rústica · Mi propuesta', layout: 'l', extra: 0, style: 'Shaker', upper: '#eceae2', lower: '#eceae2', top: 4, floor: 4, back: 0, handle: 1}
  },
  {
    id: 'classic-test',
    image: './src/images/test2.jpg',
    name: 'Cocina clásica de madera',
    description: 'Gabinetes oscuros, puertas de vidrio, mosaico ocre y estufa blanca.',
    layoutDescription: 'Cocina lineal con gabinetes superiores, estufa central y refrigerador a la derecha.',
    features: ['Muebles de madera', 'Puertas de vidrio', 'Estufa central', 'Mosaico ocre'],
    views: {front: [0, 2.35, 7.6], side: [-6.2, 3.1, 2.3], top: [.01, 10, -1.3], iso: [-5.2, 4.1, 6]},
    target: [0, 1.6, -2.05],
    design: {referenceId: 'classic-test', project: 'Cocina clásica · Mi propuesta', layout: 'line', extra: 0, style: 'Clásico', upper: '#684323', lower: '#684323', top: 4, floor: 1, back: 4, handle: 0}
  },
  {
    id: 'compact-test',
    image: './src/images/test3.jfif',
    name: 'Cocina compacta de madera',
    description: 'Muebles enfrentados, paredes de madera, estufa blanca y refrigerador oscuro.',
    layoutDescription: 'Cocina estrecha con dos frentes, estufa a la izquierda, mueble blanco a la derecha y puerta al fondo.',
    features: ['Muebles enfrentados', 'Paredes de madera', 'Estufa lateral', 'Refrigerador oscuro'],
    views: {front: [0, 2.35, 6.8], side: [3.7, 3.4, 5.2], top: [.01, 10, -.1], iso: [-3.7, 4.3, 6.5]},
    target: [0, 1.45, -.5],
    design: {referenceId: 'compact-test', project: 'Cocina compacta · Mi propuesta', layout: 'line', extra: 0, style: 'Shaker', upper: '#916237', lower: '#916237', top: 4, floor: 2, back: 5, handle: 2, custom: {'03': {color: '#eceae2'}, '04': {color: '#eceae2'}}}
  }
];
export function getPhotoPreset(id) {
  return photoPresets.find(preset => preset.id === id);
}
