import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../dist/vendor/three.module.min.js';
import { RailwayWorld } from '../dist/world.js';
import { smooth } from '../dist/timeline.js';
const w=Object.create(RailwayWorld.prototype),source=fs.readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
new Function('THREE','V','smooth',source.slice(source.indexOf('  this.path='),source.indexOf('  this.buildReflections'))).call(w,T,T.Vector3,smooth);
w.scene=new T.Scene();w.host={dataset:{}};w.materialCache=new Map();w.lamps=[];
w.mat=(color,kind='paint')=>{const key=color+kind;if(!w.materialCache.has(key))w.materialCache.set(key,new T.MeshStandardMaterial({color,map:new T.Texture()}));return w.materialCache.get(key)};
w.palette=Object.fromEntries(['grass','leaf','lightLeaf','wood','darkWood','cream','roof','rail','gravel','gold','mint','glass','black'].map(k=>[k,w.mat('#607060')]));
for(const k of ['granite','charcoal','limestone','steel','archGlass','windowGlass'])w[k]=w.mat('#81979b');
w.text=(text,width,height)=>new T.Mesh(new T.PlaneGeometry(width,height),w.mat('#ffffff'));w.treeXY=()=>{};w.shrub=()=>{};
globalThis.document={createElement:()=>({getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})};
const camera=w.gameCameraCurve.points.map(p=>p.toArray()),route=w.gamePath.points.map(p=>p.toArray());w.buildGame();
assert.deepEqual(w.gameCameraCurve.points.map(p=>p.toArray()),camera);assert.deepEqual(w.gamePath.points.map(p=>p.toArray()),route);
console.log(w.gameCityLifeStats);
assert.ok(w.gameCityLifeStats.road>=15,'Side streets connect empty blocks');assert.ok(w.gameCityLifeStats.gardens>=6,'Flower gardens fill unused pockets');assert.ok(w.gameCityLifeStats.people>=16,'Pedestrians occupy the sidewalks');assert.ok(w.gameCityLifeStats.vehicles>=8,'Vehicles use the existing streets');assert.ok(w.gameCityLifeStats.buses>=1,'A small bus joins the boulevard');
w.scene.updateMatrixWorld(true);const inverse=w.gameStation.matrixWorld.clone().invert(),geometry=[];w.gameStreetLife.traverse(m=>{if(!m.isMesh)return;for(const x of m.geometry.attributes.position.array)assert.ok(Number.isFinite(x));m.geometry.computeBoundingBox();geometry.push({box:m.geometry.boundingBox.clone().expandByScalar(.35),inverse:m.matrixWorld.clone().invert()});});
for(let i=0;i<=300;i++){const p=i/300,cam=w.gameCameraCurve.getPointAt(p),train=w.frameAt(1.45+.75*p).p;for(const {box,inverse:inv}of geometry){assert.equal(box.containsPoint(cam.clone().applyMatrix4(inv)),false,'Street life clears the camera');assert.equal(box.containsPoint(train.clone().add(new T.Vector3(0,1.2,0)).applyMatrix4(inv)),false,'Street life clears the train');}}
for(const site of w.gameStreetSites){const box=new T.Box3(new T.Vector3(site.x-site.width/2,-1.15,site.z-site.depth/2),new T.Vector3(site.x+site.width/2,site.height-1,site.z+site.depth/2));for(const child of w.gameStation.children){if(child.userData.audienceFacing){const footprint=new T.Box3().setFromObject(child).applyMatrix4(inverse);assert.equal(box.intersectsBox(footprint),false,'City life stays outside landmark footprints');}}}
console.log('PASS: Game Station streets, flowers, people and vehicles; unchanged journey, clear camera/rails and landmark footprints.');
