import {getRemodelingPlan} from '../data/remodeling-plans.js';
import {renovations,getRenovation} from '../data/renovations.js';
import {state} from '../state/store.js';

function planPreview(referenceId,item,index){
 const plan=getRemodelingPlan(referenceId,item.id);
 return `<div class="idea-plan" style="--plan-color:${item.design.lower}"><svg viewBox="0 0 100 84" role="img" aria-label="${plan.label}"><path d="M5 78V5H95V78" fill="none" stroke="#c1c8c1" stroke-width="1.2"/>${plan.blocks.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${item.design.lower}"/>`).join('')}${plan.circles.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#bd9c70"/>`).join('')}${plan.lights.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#ffd695" stroke="#be9360" stroke-width=".6"/>`).join('')}</svg><span class="plan-number">0${index+1}</span><strong>${plan.label}</strong></div>`;
}
export function renderRenovationsPanel(panel) {
  const choices=renovations[state.referenceId];
  if(!choices){
    panel.innerHTML='<div class="hint">Elige una de tus fotografías para explorar sus tres propuestas de remodelación.</div><button class="primary ideas-open" id="ideasChoosePhoto">Elegir cocina →</button>';
    panel.querySelector('#ideasChoosePhoto').onclick=()=>document.getElementById('openPhoto').click();return;
  }
  const selected=getRenovation(state.referenceId,state.renovationId);
  panel.innerHTML=`<div class="ideas-intro"><span class="ideas-label">3 PROPUESTAS PARA TU ESPACIO</span><p>Conserva la cocina que conoces y explora cómo puede mejorar.</p><button class="outline" id="restoreOriginal">${selected?'Comparar con el original':'✓ Diseño original'}</button></div>
    <div class="idea-list">${choices.map((item,index)=>`<article class="idea-card ${state.renovationId===item.id?'active':''}">${planPreview(state.referenceId,item,index)}<div class="idea-content"><span class="idea-mood">${item.mood}</span><h3>${item.name}</h3><p>${item.description}</p><ul>${item.benefits.map(benefit=>`<li>${benefit}</li>`).join('')}</ul><button class="${state.renovationId===item.id?'outline':'primary'}" data-proposal="${item.id}">${state.renovationId===item.id?'✓ Propuesta aplicada':'Ver en mi cocina →'}</button></div></article>`).join('')}</div>
    <div class="hint">Puedes seguir cambiando acabados y gabinetes después de aplicar una propuesta. La distribución es conceptual; las medidas se confirmarían antes de una obra.</div>`;
  panel.querySelector('#restoreOriginal').onclick=()=>document.dispatchEvent(new CustomEvent('hogarica:compare',{detail:'original'}));
  panel.querySelectorAll('[data-proposal]').forEach(button=>button.onclick=()=>document.dispatchEvent(new CustomEvent('hogarica:proposal',{detail:button.dataset.proposal})));
}
