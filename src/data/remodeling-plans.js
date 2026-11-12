// Geometric concept identities and presentation framing, independent of finishes.
export const remodelingPlans={
 'rustic-test':{
  natural:{layout:'island-breakfast',label:'Isla + desayunador circular',camera:[-6.7,4.5,8.9],target:[0,1.35,-.4],blocks:[[12,8,68,12],[80,20,12,40],[32,48,30,16]],circles:[[70,56,11]],lights:[[38,54],[52,54]]},
  sand:{layout:'peninsula-pantry',label:'Península + despensa alta',camera:[-6.8,4.6,9],target:[.3,1.4,-.4],blocks:[[12,8,62,12],[79,8,12,62],[32,57,47,13]],circles:[],lights:[[40,61],[58,61],[73,61]]},
  navy:{layout:'waterfall-social',label:'Isla social + vitrina',camera:[-6.6,4.4,9.2],target:[0,1.4,-.4],blocks:[[12,8,60,12],[79,8,12,33],[25,47,49,20]],circles:[],lights:[[34,55],[49,55],[64,55]]}
 },
 'classic-test':{
  nordic:{layout:'breakfast-l',label:'Cocina en L + barra lateral',camera:[-5.8,4.4,8.2],target:[0,1.4,-.8],blocks:[[10,9,78,13],[10,22,13,47]],circles:[],lights:[[16,42],[16,59]]},
  sage:{layout:'preparation-island',label:'Isla de preparación + fregadero',camera:[5.9,4.2,8.1],target:[0,1.4,-.7],blocks:[[10,9,78,13],[31,49,37,18]],circles:[],lights:[[36,56],[49,56],[62,56]]},
  graphite:{layout:'display-gallery',label:'Galería de vitrinas + barra',camera:[-5.8,4,8.2],target:[0,1.4,-.8],blocks:[[10,9,78,13],[77,44,12,30]],circles:[],lights:[[24,34],[49,34],[74,34]]}
 },
 'compact-test':{
  bright:{layout:'single-wall-ledge',label:'Un frente + barra flotante',camera:[.2,2.65,6.8],target:[0,1.45,-.4],blocks:[[10,10,15,64],[75,14,17,22],[82,49,7,25]],circles:[],lights:[[50,30],[50,55]]},
  sage:{layout:'galley-coffee',label:'Dos frentes + rincón de café',camera:[0,2.65,6.9],target:[0,1.45,-.4],blocks:[[10,10,15,64],[75,14,17,22],[77,44,15,30]],circles:[],lights:[[50,30],[50,56]]},
  contrast:{layout:'compact-l-workshop',label:'Estación en L + aparador',camera:[.3,2.75,7],target:[0,1.45,-.4],blocks:[[10,35,15,39],[10,21,26,14],[75,14,17,22],[82,54,10,20]],circles:[],lights:[[34,45],[50,45],[66,45]]}
 }
};
export function getRemodelingPlan(referenceId,proposalId){return remodelingPlans[referenceId]?.[proposalId];}
