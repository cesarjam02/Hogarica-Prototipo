import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDesign} from '../src/state/validation.js';
import {state} from '../src/state/store.js';
test('importa el formato existente y conserva selecciones individuales',()=>{
 const input={...structuredClone(state),custom:{'01':{color:'#292e34',style:'Plano'}}};
 const result=validateDesign(input);
 assert.deepEqual(result.custom,input.custom);
 assert.equal(result.scope,'all');
});
test('rechaza índices, estilos y configuraciones individuales inválidas',()=>{
 for(const patch of [{top:99},{floor:-1},{handle:1.5},{style:'otro'},{custom:{'99':{}}},{custom:{'01':{color:'url(evil)'}}},{project:42}]){
  assert.throws(()=>validateDesign({...structuredClone(state),...patch}));
 }
});
test('descarta claves ajenas al diseño',()=>{
 assert.equal(validateDesign({...structuredClone(state),unknown:1}).unknown,undefined);
});

test('conserva distribución, módulos y posiciones al exportar e importar',()=>{
 const input={...structuredClone(state),layout:'u',extra:4,positions:{'19':{x:2.5,z:0.8}},hidden:['01'],custom:{'19':{style:'Plano'}}};
 const result=validateDesign(JSON.parse(JSON.stringify(input)));
 assert.equal(result.extra,4);
 assert.deepEqual(result.positions,input.positions);
 assert.deepEqual(result.hidden,['01']);
});
test('valida límites de colocación y permite archivos de la versión anterior',()=>{
 for(const patch of [{extra:5},{layout:'invalid'},{positions:{'01':{x:100,z:0}}},{hidden:['99']}])assert.throws(()=>validateDesign({...structuredClone(state),...patch}));
 const old=structuredClone(state);for(const key of ['extra','layout','hidden','positions'])delete old[key];
 assert.equal(validateDesign(old).layout,'l');
});

test('la fotografía de prueba conserva su escena y sus acabados al importar',async()=>{
 const {photoPresets}=await import('../src/data/photo-presets.js');
 const {existsSync}=await import('node:fs');
 for(const photo of photoPresets){
  assert.ok(existsSync(new URL('../'+photo.image,import.meta.url)));
  const result=validateDesign({...structuredClone(state),...photo.design});
  assert.equal(result.referenceId,photo.id);
  assert.equal(result.top,photo.design.top);
  assert.equal(result.floor,photo.design.floor);
 }
 assert.throws(()=>validateDesign({...structuredClone(state),referenceId:'unregistered-photo'}));
});

test('las tres cocinas conservan sus identificadores y test3 sus muebles de distinto color',async()=>{
 const {photoPresets,getPhotoPreset}=await import('../src/data/photo-presets.js');
 assert.deepEqual(photoPresets.map(photo=>photo.id),['rustic-test','classic-test','compact-test']);
 for(const id of ['rustic-test','classic-test']){
   const saved=validateDesign({...structuredClone(state),...getPhotoPreset(id).design});
   assert.equal(saved.referenceId,id);
 }
 const input={...structuredClone(state),...structuredClone(getPhotoPreset('compact-test').design)};
 const restored=validateDesign(JSON.parse(JSON.stringify(input)));
 assert.equal(restored.lower,'#916237');
 assert.deepEqual(restored.custom,{'03':{color:'#eceae2'},'04':{color:'#eceae2'}});
});
