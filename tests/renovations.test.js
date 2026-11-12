import test from 'node:test';
import assert from 'node:assert/strict';
import {photoPresets} from '../src/data/photo-presets.js';
import {renovations,createRenovationDesign,createOriginalDesign} from '../src/data/renovations.js';
import {validateDesign} from '../src/state/validation.js';
import {state} from '../src/state/store.js';

test('cada cocina ofrece tres remodelaciones que se pueden guardar y recuperar',()=>{
 for(const photo of photoPresets){
  assert.equal(renovations[photo.id].length,3);
  assert.equal(new Set(renovations[photo.id].map(item=>item.id)).size,3);
  for(const item of renovations[photo.id]){
   const design={...structuredClone(state),...createRenovationDesign(photo.id,item.id)};
   const restored=validateDesign(JSON.parse(JSON.stringify(design)));
   assert.equal(restored.renovationId,item.id);assert.equal(restored.referenceId,photo.id);
   assert.equal(restored.lower,item.design.lower);assert.equal(restored.category,'ideas');
  }
 }
});
test('restaurar el original recupera los muebles blancos de test3 y no muta el catálogo',()=>{
 const snapshot=JSON.stringify(photoPresets);
 const renovation=createRenovationDesign('compact-test','bright');
 renovation.custom['01']={color:'#292e34'};
 const original=createOriginalDesign('compact-test');
 assert.equal(original.renovationId,null);assert.equal(original.custom['03'].color,'#eceae2');
 assert.equal(JSON.stringify(photoPresets),snapshot);
});
test('rechaza una propuesta asociada a otra cocina y acepta diseños antiguos',()=>{
 assert.throws(()=>validateDesign({...structuredClone(state),referenceId:'rustic-test',renovationId:'graphite'}));
 const old=structuredClone(state);delete old.renovationId;
 assert.equal(validateDesign(old).renovationId,null);
});
