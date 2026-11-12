import {state} from '../state/store.js';
import {$, toast} from './dom.js';
import {photoPresets, getPhotoPreset} from '../data/photo-presets.js';

export function initPhotoFlow() {
  document.body.insertAdjacentHTML('beforeend', `
    <section class="photo-flow" id="photoFlow" aria-labelledby="photoTitle">
      <div class="photo-shell">
        <div class="photo-story">
          <span class="eyebrow">HOGARICA · CONCEPT STUDIO</span>
          <div class="concept-mark">⌂</div>
          <h1 id="photoTitle">Tu cocina.<br> Una nueva<br> <em>posibilidad.</em></h1>
          <p>Empieza con una cocina real. Explora su versión 3D y transforma sus acabados.</p>
          <ol class="journey">
            <li><b>01</b><span>Elige tu fotografía<small>Una cocina real como punto de partida.</small></span></li>
            <li><b>02</b><span>Descubre su versión 3D<small>Una escena inspirada en ese espacio.</small></span></li>
            <li><b>03</b><span>Hazla tuya<small>Prueba gabinetes, materiales y colores.</small></span></li>
          </ol>
          <span class="concept-note">Prototipo de experiencia · Propuesta de producto</span>
        </div>
        <div class="photo-form">
          <span class="eyebrow">DE LA FOTO AL DISEÑO</span>
          <h2>Tu espacio, en otra dimensión.</h2>
          <p class="sub">Selecciona una de las cocinas de prueba y descubre tres propuestas de remodelación para transformarla.</p>
          <button id="photoDrop" class="photo-drop" aria-expanded="false" aria-controls="photoLibrary">
            <img id="photoPreview" class="hidden" alt="Cocina seleccionada">
            <span id="uploadPrompt"><span class="upload-icon">▧</span><strong>Seleccionar fotografía</strong><small>Explora las cocinas disponibles para la demo</small></span>
          </button>
          <div id="photoLibrary" class="photo-library hidden" aria-label="Fotografías de prueba">
            <div class="library-heading"><strong>Cocinas disponibles</strong><small>${photoPresets.length} fotografías de prueba</small></div>
            ${photoPresets.map(photo => `<button class="photo-card" data-photo-id="${photo.id}" aria-pressed="false"><img src="${photo.image}" alt="${photo.name}"><span><strong>${photo.name}</strong><small>${photo.description}</small><b>Elegir esta cocina →</b></span></button>`).join('')}
          </div>
          <div class="photo-file" id="photoFile" aria-live="polite">Elige una foto para comenzar.</div>
          <div id="photoDetails" class="photo-details hidden"></div>
          <div class="simulation-note"><b>Experiencia de demostración</b><span>Cada foto de prueba tiene una escena 3D preparada con su distribución y sus elementos principales. Además del original, tendrás tres propuestas de mejora para cada cocina.</span></div>
          <div id="photoProgress" class="hidden" role="status"><div class="progress-track"><i id="photoProgressBar"></i></div><p id="photoProgressText"></p></div>
          <button class="primary generate-button" id="generateKitchen" disabled>Elige una fotografía</button>
          <button class="photo-skip" id="skipPhoto" disabled>Explorar modelo de ejemplo →</button>
        </div>
      </div>
    </section>`);
  $('stage').insertAdjacentHTML('beforeend', '<figure class="photo-reference hidden" id="photoReference"><img id="referenceImage" alt="Foto original de la cocina"><figcaption>Foto original <button id="changeReference" aria-label="Cambiar fotografía">▧</button></figcaption></figure><span class="demo-badge">Diseño inspirado en tu foto · Demo</span>');
  document.querySelector('.topactions').insertAdjacentHTML('afterbegin', '<button class="outline" id="openPhoto">▧ Elegir cocina</button>');
  $('stage').insertAdjacentHTML('beforeend','<div class="design-switch hidden" id="designSwitch" aria-label="Comparar diseños"><button id="compareOriginal">Original</button><button id="compareProposal">Remodelación</button></div>');
  $('compareOriginal').onclick=()=>document.dispatchEvent(new CustomEvent('hogarica:compare',{detail:'original'}));
  $('compareProposal').onclick=()=>document.dispatchEvent(new CustomEvent('hogarica:compare',{detail:'proposal'}));
  let selectedId = null, busy = false, ready = false;

  function updateButton() {
    $('generateKitchen').disabled = !ready || !selectedId || busy;
    $('generateKitchen').textContent = selectedId ? (ready ? 'Ver esta cocina en 3D →' : 'Preparando motor 3D…') : 'Elige una fotografía';
  }
  function choose(id) {
    if (busy) return;
    const photo = getPhotoPreset(id);
    if (!photo) return;
    selectedId = id;
    $('photoPreview').src = photo.image;
    $('photoPreview').alt = photo.name;
    $('photoPreview').classList.remove('hidden');
    $('uploadPrompt').classList.add('hidden');
    $('photoLibrary').classList.add('hidden');
    $('photoDrop').setAttribute('aria-expanded', 'false');
    $('photoFile').textContent = photo.name + ' · Clic en la foto para cambiarla';
    $('photoDetails').classList.remove('hidden');
    $('photoDetails').innerHTML = '<h3>Elementos de esta cocina</h3><div>' + photo.features.map(feature => `<span>${feature}</span>`).join('') + '</div>';
    document.querySelectorAll('[data-photo-id]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.photoId === id)));
    updateButton();
    $('generateKitchen').focus();
  }
  $('photoDrop').onclick = () => {
    if (busy) return;
    const hidden = $('photoLibrary').classList.toggle('hidden');
    $('photoDrop').setAttribute('aria-expanded', String(!hidden));
  };
  document.querySelectorAll('[data-photo-id]').forEach(button => button.onclick = () => choose(button.dataset.photoId));
  function open() {
    if (busy) return;
    $('photoFlow').classList.remove('hidden');
    document.body.classList.add('onboarding');
    $('photoDrop').focus();
  }
  function close() {
    $('photoFlow').classList.add('hidden');
    document.body.classList.remove('onboarding');
    document.querySelector('.step').innerHTML = '<b class="done">✓</b> Fotografía <span>→</span><b class="done">✓</b> Diseño 3D <span>→</span><b class="current">3</b> Personalización';
    busy = false;
    $('photoProgress').classList.add('hidden');
    $('photoDrop').disabled = false;
    $('skipPhoto').disabled = false;
    updateButton();
    $('openPhoto').focus();
  }
  document.addEventListener('hogarica:reference', event => {
    const photo = getPhotoPreset(event.detail);
    $('designSwitch').classList.toggle('hidden',!photo);
    for(const [id,active] of [['compareOriginal',!state.renovationId],['compareProposal',!!state.renovationId]]){
      $(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));
    }
    $('photoReference').classList.toggle('hidden', !photo);
    if (photo) { $('referenceImage').src = photo.image; $('referenceImage').alt = photo.name; }
  });
  $('generateKitchen').onclick = async () => {
    if (!ready || busy || !selectedId) return;
    busy = true; updateButton();
    $('photoDrop').disabled = true;
    $('skipPhoto').disabled = true;
    $('photoLibrary').classList.add('hidden');
    $('photoProgress').classList.remove('hidden');
    const steps = ['Abriendo la escena de esta fotografía…', 'Preparando muebles y distribución de la foto…', 'Aplicando los acabados originales…'];
    for (let i = 0; i < steps.length; i++) {
      $('photoProgressText').textContent = steps[i];
      $('photoProgressBar').style.width = (i + 1) / steps.length * 100 + '%';
      await new Promise(resolve => setTimeout(resolve, 450));
    }
    document.dispatchEvent(new CustomEvent('hogarica:photo', {detail: selectedId}));
    close();
    toast('Tu cocina de prueba está lista. Ahora puedes personalizarla.');
  };
  $('skipPhoto').onclick = () => {
    if (!ready || busy) return;
    document.dispatchEvent(new CustomEvent('hogarica:template', {detail: 'l'}));
    close();
  };
  $('openPhoto').onclick = open;
  $('changeReference').onclick = open;
  document.body.classList.add('onboarding');
  return {
    ready() { ready = true; $('skipPhoto').disabled = false; updateButton(); },
    error() { $('generateKitchen').disabled = true; $('generateKitchen').textContent = 'Motor 3D no disponible'; $('photoFile').textContent = 'No se pudo cargar el motor 3D. Revisa tu conexión y recarga la página.'; }
  };
}
