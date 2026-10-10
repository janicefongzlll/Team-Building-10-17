import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import { RailwayWorld } from '../dist/world.js';
import { buildGameCity } from '../dist/game-city.js';
import { smooth } from '../dist/timeline.js';
import { GAME_MODELS } from '../dist/game-assets.js';

const original=['petronas-twin-towers','eiffel-tower','big-ben','taj-mahal','sydney-opera-house','neuschwanstein-castle','pyramids-of-giza','marina-bay-sands'];
assert.ok(original.every(name=>GAME_MODELS[name]),'Every original Blender landmark is retained');
assert.equal(Object.keys(GAME_MODELS).length,12);
const w=Object.create(RailwayWorld.prototype),source=fs.readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
new Function('THREE','V','smooth',source.slice(source.indexOf('  this.path='),source.indexOf('  this.buildReflections'))).call(w,THREE,THREE.Vector3,smooth);
w.scene=new THREE.Scene();w.host={dataset:{}};w.materialCache=new Map();
w.mat=(colour,kind='stone')=>{const key=colour+kind;if(!w.materialCache.has(key))w.materialCache.set(key,new THREE.MeshStandardMaterial({color:colour,map:new THREE.Texture()}));return w.materialCache.get(key)};
w.palette=Object.fromEntries(['wood','darkWood','black','grass'].map(k=>[k,w.mat('#607060')]));
for(const key of ['limestone','charcoal','steel','granite','windowGlass'])w[key]=w.mat('#81979b');
w.text=(text,width,height)=>new THREE.Mesh(new THREE.PlaneGeometry(width,height),w.mat('#ffffff'));
w.treeXY=()=>{};w.shrub=()=>{};
globalThis.document={createElement:()=>({getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})};
const g=w.groupAt(w.gameT),cameraBefore=w.gameCameraCurve.points.map(p=>p.toArray()),railBefore=w.gamePath.points.map(p=>p.toArray());
buildGameCity(w,g,THREE);
assert.equal(w.host.dataset.gameLandmarks,'12');assert.ok(Number(w.host.dataset.gameDistrictBuildings)<=8,'Perimeter buildings must leave landmark views open');
assert.deepEqual(w.gameCameraCurve.points.map(p=>p.toArray()),cameraBefore,'Environment must not alter the camera');
assert.deepEqual(w.gamePath.points.map(p=>p.toArray()),railBefore,'Environment must not alter the railway');
assert.equal(w.gameAlpine.visible,false,'Alpine terrain does not appear in the earlier stations');
for(const name of Object.keys(GAME_MODELS)){const model=w.landmark(name),bounds=new THREE.Box3().setFromObject(model);assert.ok(!bounds.isEmpty());assert.ok(bounds.getSize(new THREE.Vector3()).y>.2);assert.ok(Number.isFinite(bounds.min.x));const placed=w.placeLandmark(name,45,15,16,g),audience=w.gameCameraCurve.getPoint(1).applyMatrix4(g.matrixWorld.clone().invert()),front=new THREE.Vector3(0,0,1).applyQuaternion(placed.quaternion),direction=new THREE.Vector3(audience.x-45,0,audience.z-15).normalize();assert.ok(front.dot(direction)>.999,'Every landmark entrance faces the audience');}
const first=w.landmark('eiffel-tower'),second=w.landmark('eiffel-tower');assert.equal(first.children[0].children[0].material,second.children[0].children[0].material,'Reuse Blender materials so static city geometry can be batched');
console.log('PASS: all 12 real Blender assets, unchanged camera and rails, hidden early-scene terrain, district construction and shared materials.');
