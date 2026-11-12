import {initPhotoFlow} from './ui/photo-flow.js';
const photoFlow=initPhotoFlow();
import {$} from './ui/dom.js';

try {
  const [{init},{wire}]=await Promise.all([import('./scene/kitchen.js'),import('./ui/configurator.js')]);

  init();

  wire();
  photoFlow.ready();

} catch(error) {
  photoFlow.error();
  console.error('No se pudo iniciar Hogarica Studio:',error);

  $('error').classList.remove('hidden');

}
