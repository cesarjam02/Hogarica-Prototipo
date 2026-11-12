import {getRemodelingPlan} from '../data/remodeling-plans.js';
import {getPhotoPreset} from '../data/photo-presets.js';
import {state} from '../state/store.js';
import {cabinets,baseCount} from '../scene/kitchen.js';

export function renderLayoutPanel(panel,commit){
  const selected=cabinets.find(c=>c.id===state.selected&&c.group.visible);
  panel.innerHTML=`<div class="group"><h3>Distribución de referencia</h3>${state.referenceId?`<p class="sub">${getRemodelingPlan(state.referenceId,state.renovationId)?.label||getPhotoPreset(state.referenceId)?.layoutDescription||''}</p>`:'<p class="sub">Elige una distribución de ejemplo.</p>'}<div class="layout-choices ${state.referenceId?'hidden':''}">${[['line','━','Lineal'],['l','┗','En L'],['u','⊔','En U']].map(([id,icon,name])=>`<button class="choice ${state.layout===id?'active':''}" data-layout="${id}"><span class="plan-icon">${icon}</span>${name}</button>`).join('')}</div></div>
  <div class="group"><h3>Módulos de gabinete</h3><p class="sub">Añade hasta 4 módulos inferiores para explorar tu distribución.</p><button class="primary" id="addModule" ${state.extra>=4?'disabled':''}>＋ Añadir gabinete</button></div>
  <div class="group"><h3>${selected?'Gabinete '+selected.id:'Selecciona un gabinete'}</h3>${selected?`<label class="position-label" for="moduleX">Posición horizontal</label><input id="moduleX" type="range" min="-5.2" max="5.2" step="0.1" value="${selected.group.position.x}"><label class="position-label" for="moduleZ">Profundidad</label><input id="moduleZ" type="range" min="-3.6" max="3.5" step="0.1" value="${selected.group.position.z}"><button class="outline" id="removeModule">Retirar de la propuesta</button>`:'<p class="sub">Haz clic en un gabinete de la escena para moverlo o retirarlo.</p>'}</div>
  ${state.hidden.length?'<button class="outline" id="restoreModules">Restaurar gabinetes retirados</button>':''}
  <div class="hint">Distribución conceptual. Los módulos se mueven libremente; las medidas y los encuentros se validarían en la aplicación final.</div>`;
  panel.querySelectorAll('[data-layout]').forEach(button=>button.onclick=()=>document.dispatchEvent(new CustomEvent('hogarica:template',{detail:button.dataset.layout})));
  panel.querySelector('#addModule').onclick=()=>commit(()=>{state.extra++;state.selected=String(baseCount+state.extra).padStart(2,'0');state.hidden=state.hidden.filter(id=>id!==state.selected)});
  if(selected){
    for(const [id,key] of [['moduleX','x'],['moduleZ','z']]){
      panel.querySelector('#'+id).onchange=event=>{const value=Number(event.target.value);commit(()=>{state.positions[selected.id]={x:selected.group.position.x,z:selected.group.position.z,[key]:value}})};
    }
    panel.querySelector('#removeModule').onclick=()=>commit(()=>{state.hidden.push(selected.id);state.selected=null;state.scope='all'});
  }
  const restore=panel.querySelector('#restoreModules');
  if(restore)restore.onclick=()=>commit(()=>state.hidden=[]);
}
