import {getPhotoPreset} from './photo-presets.js';

// Design concepts, not construction plans or price estimates.
export const renovations = {
  'rustic-test': [
    {id:'natural', name:'Natural luminoso', mood:'Madera + salvia', description:'Una isla de trabajo con desayunador circular y estantes ligeros.', benefits:['Desayunador circular y dos asientos junto a la isla','Dos lámparas esféricas sobre la zona de trabajo','Estantes abiertos con LED y luz bajo los muebles'], design:{style:'Plano',upper:'#eceae2',lower:'#849489',top:0,floor:1,back:1,handle:2,custom:{'09':{color:'#916237'},'10':{color:'#916237'}}}},
    {id:'sand', name:'Arena minimal', mood:'Arena + blanco', description:'La isla se sustituye por una península conectada con desayunador.', benefits:['Península en U abierta con dos asientos','Torre de hornos y despensa en lugar de la estantería','Luminaria lineal suspendida y zócalos iluminados'], design:{style:'Plano',upper:'#b4a28f',lower:'#b4a28f',top:0,floor:2,back:0,handle:1,custom:{}}},
    {id:'navy', name:'Azul sofisticado', mood:'Azul profundo + latón', description:'Una isla social con encimera en cascada y vitrina iluminada.', benefits:['Isla ampliada con laterales en cascada y tres taburetes','Torre de hornos y vitrina de vidrio con luz','Tres lámparas de aro y panel de listones de madera'], design:{style:'Shaker',upper:'#eceae2',lower:'#293e58',top:0,floor:0,back:1,handle:0,custom:{}}}
  ],
  'classic-test': [
    {id:'nordic', name:'Nórdica cálida', mood:'Blanco + roble', description:'La cocina lineal se abre hacia una barra lateral en L.', benefits:['Barra lateral con dos asientos y torre de hornos','Estantes flotantes en lugar de la fila de muebles altos','Dos colgantes cónicos y luz sobre los estantes'], design:{style:'Plano',upper:'#eceae2',lower:'#916237',top:0,floor:1,back:1,handle:2,custom:{}}},
    {id:'sage', name:'Verde urbano', mood:'Salvia + blanco', description:'Una isla de preparación cambia la distribución y añade un fregadero central.', benefits:['Isla independiente con fregadero y zona de preparación','Torre de hornos y gabinetes altos divididos','Tres globos luminosos sobre la isla y LED de trabajo'], design:{style:'Shaker',upper:'#eceae2',lower:'#849489',top:0,floor:2,back:0,handle:0,custom:{}}},
    {id:'graphite', name:'Grafito elegante', mood:'Grafito + acero', description:'Una galería con vitrinas y barra lateral para café.', benefits:['Dos vitrinas grandes retroiluminadas entre torres altas','Barra de café lateral con panel de listones','Riel de tres focos y luz ambiental en los muebles'], design:{style:'Plano',upper:'#eceae2',lower:'#414b57',top:1,floor:0,back:1,handle:2,custom:{}}}
  ],
  'compact-test': [
    {id:'bright', name:'Compacta luminosa', mood:'Blanco + roble', description:'Un único frente de trabajo libera el paso y deja una barra ligera enfrente.', benefits:['Mobiliario concentrado en un frente con fregadero','Mueble opuesto sustituido por barra flotante y espejo','Lámpara lineal sobre el pasillo y LED bajo los gabinetes'], design:{style:'Plano',upper:'#eceae2',lower:'#eceae2',top:0,floor:1,back:1,handle:2,custom:{}}},
    {id:'sage', name:'Salvia funcional', mood:'Salvia + arena', description:'Dos frentes con despensa vertical y un rincón de café abierto.', benefits:['Despensa alta y nuevo módulo superior en el frente izquierdo','Nicho de café con dos estantes iluminados a la derecha','Dos lámparas cónicas y luz continua de zócalo'], design:{style:'Shaker',upper:'#eceae2',lower:'#849489',top:4,floor:2,back:0,handle:0,custom:{}}},
    {id:'contrast', name:'Contraste moderno', mood:'Grafito + blanco', description:'Una estación de trabajo en L con torre de hornos y aparador poco profundo.', benefits:['Cocción en el retorno en L y horno en torre vertical','Aparador delgado con vitrina iluminada en el frente opuesto','Estantes de trabajo y riel de tres focos dirigidos'], design:{style:'Plano',upper:'#eceae2',lower:'#414b57',top:0,floor:0,back:1,handle:2,custom:{}}}
  ]
};
export function getRenovation(referenceId, id) {
  return renovations[referenceId]?.find(item=>item.id===id);
}
export function createRenovationDesign(referenceId, id) {
  const photo=getPhotoPreset(referenceId), proposal=getRenovation(referenceId,id);
  if(!photo||!proposal)throw new Error('Propuesta no disponible para esta cocina');
  return {...structuredClone(photo.design),...structuredClone(proposal.design),renovationId:id,positions:{},hidden:[],extra:0,selected:null,scope:'all',category:'ideas'};
}
export function createOriginalDesign(referenceId) {
  const photo=getPhotoPreset(referenceId);
  if(!photo)throw new Error('Fotografía no disponible');
  return {...structuredClone(photo.design),custom:structuredClone(photo.design.custom||{}),renovationId:null,positions:{},hidden:[],extra:0,selected:null,scope:'all',category:'ideas'};
}
