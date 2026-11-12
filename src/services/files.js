import {getRenovation} from '../data/renovations.js';
import {state} from '../state/store.js';

import {countertops,floors,backs,handles} from '../data/catalog.js';

import {$,toast} from '../ui/dom.js';

function download(filename,text,type){const blob=new Blob([text],{type});
const a=document.createElement('a');
const url=URL.createObjectURL(blob);
a.href=url;
a.download=filename;
document.body.appendChild(a);
a.click();
a.remove();
setTimeout(()=>URL.revokeObjectURL(url),1500)}
export function downloadData(){const data={version:'Hogarica Studio 3D – Demo',fecha:new Date().toISOString(),...state};
download('Hogarica_diseno_3D.json',JSON.stringify(data,null,2),'application/json;charset=utf-8');
try{localStorage.setItem('hogarica_3d',JSON.stringify(data))}catch(e){}toast('Diseño exportado como JSON.');
}
export function quote(){const name=$('customer').value.trim()||'Sin especificar',contact=$('contact').value.trim()||'Sin especificar',notes=$('comments').value.trim()||'Sin comentarios';
const rows=[`HOGARICA – SOLICITUD DE COTIZACIÓN (DEMOSTRACIÓN)`,`Fecha: ${new Date().toLocaleString('es')}`,`Proyecto: ${state.project}`,`Cliente: ${name}`,`Contacto: ${contact}`,`Comentarios: ${notes}`,'',`Propuesta de remodelación: ${getRenovation(state.referenceId,state.renovationId)?.name||'Diseño original'}`,`Fotografía de prueba: ${state.referenceId||'Modelo general'}`,`Distribución de referencia: ${state.layout}`,`Módulos adicionales: ${state.extra}`,`Gabinetes retirados: ${state.hidden.join(', ')||'Ninguno'}`,`Posiciones ajustadas: ${JSON.stringify(state.positions)}`,`Modelo de puerta general: ${state.style}`,`Gabinetes superiores: ${state.upper}`,`Gabinetes inferiores: ${state.lower}`,`Gabinetes individuales: ${JSON.stringify(state.custom)}`,`Encimera: ${countertops[state.top].name}`,`Piso: ${floors[state.floor].name}`,`Salpicadero: ${backs[state.back].name}`,`Tiradores: ${handles[state.handle].name}`,'','NOTA: Esta demostración no calcula precios ni envía información a Hogarica.'];
download('Hogarica_solicitud_cotizacion.txt',rows.join('\n'),'text/plain;charset=utf-8');
$('modal').classList.add('hidden');
toast('Solicitud descargada correctamente.');
}
