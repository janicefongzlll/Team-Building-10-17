import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../dist/vendor/three.module.min.js';
import { RailwayWorld } from '../dist/world.js';
import { buildPremiumTrain } from '../dist/train-upgrade.js';
import { upgradeJourneyEnvironment } from '../dist/journey-detail.js';
import { smooth } from '../dist/timeline.js';
const w=Object.create(RailwayWorld.prototype),source=fs.readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
new Function('THREE','V','smooth',source.slice(source.indexOf('  this.path='),source.indexOf('  this.buildReflections'))).call(w,T,T.Vector3,smooth);
w.scene=new T.Scene();w.host={dataset:{}};w.cars=[];w.doors=[];w.wheels=[];w.lamps=[];w.materialCache=new Map();
w.mat=(color,kind='paint')=>{const key=color+kind;if(!w.materialCache.has(key))w.materialCache.set(key,new T.MeshStandardMaterial({color}));return w.materialCache.get(key)};
w.palette=Object.fromEntries(['grass','leaf','lightLeaf','wood','darkWood','cream','roof','rail','gravel','gold','mint','glass','black'].map(k=>[k,w.mat('#607060')]));
for(const k of ['granite','charcoal','limestone','steel','archGlass','windowGlass'])w[k]=w.mat('#81979b');
w.text=(text,width,height)=>new T.Mesh(new T.PlaneGeometry(width,height),w.mat('#ffffff'));w.treeXY=()=>{};w.shrub=()=>{};
w.batchStatic=()=>{};
w.buildStation(.18,'MJM CENTRAL',false);w.buildStation(.9,'ICE BREAKER',false);w.buildStation(w.mentorT,'MENTOR EXPRESS',false,'07');w.buildStation(w.finalT,'MJM CENTRAL',false,'08');
buildPremiumTrain(w,T);upgradeJourneyEnvironment(w,T);
assert.equal(w.cars.length,2);assert.equal(w.doors.length,16);assert.equal(w.wheels.length,16);
assert.equal(w.trainGlass.transparent,false,'Black glazing encloses the carriage');assert.ok(w.trainGlass.color.getHex()<0x303030);assert.ok(w.trainGlass.clearcoat>.9);
assert.ok(Number(w.host.dataset.journeyTerraces)>=12,'Organized terraces enrich multiple route sections');assert.ok(Number(w.host.dataset.journeyTrees)>=12,'Structured planting accompanies the terraces');
w.scene.updateMatrixWorld(true);let count=0;for(const root of [...w.cars,w.journeyDetail])root.traverse(m=>{if(!m.isMesh)return;for(const n of m.geometry.attributes.position.array)assert.ok(Number.isFinite(n),'Premium geometry is finite');assert.ok(m.position.toArray().every(Number.isFinite));count++;});
const landscape=[];w.journeyDetail.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingBox();landscape.push({box:m.geometry.boundingBox.clone().expandByScalar(.5),inverse:m.matrixWorld.clone().invert()});}});
for(const curve of [w.cameraCurve,w.mentorCameraCurve,w.gameApproachCamera,w.gameCameraCurve,w.restCameraCurve,w.recipeCameraCurve,w.recipeInteriorCurve,w.joanneCameraCurve,w.mentorLastCameraCurve,w.finalCameraCurve])for(let i=0;i<=200;i++){const p=curve.getPointAt(i/200);for(const {box,inverse}of landscape)assert.equal(box.containsPoint(p.clone().applyMatrix4(inverse)),false,'Scenery clears the camera');}
for(const [a,b]of w.routeSegments())for(let i=0;i<=100;i++){const t=a+(b-a)*i/100,d=w.distanceAt(t),p=w.frameAt(t).p;assert.ok(w.frameAtDistance(d).p.distanceTo(p)<1e-6,'Arc-length mapping preserves train endpoints');if(d>20){const q=w.frameAtDistance(d-15.5).p;assert.ok(p.distanceTo(q)>14&&p.distanceTo(q)<=15.6,'Car spacing stays constant at '+t+' distance '+p.distanceTo(q));}}
console.log(`PASS: enclosed black panoramic glazing, fixed physical car spacing, ${w.host.dataset.journeyTerraces} terrace buildings, ${w.host.dataset.journeyTrees} trees and camera clearance (${count} meshes).`);

assert.ok(w.gameApproachCamera.getPoint(0).distanceTo(w.cameraCurve.getPoint(1))<1e-8,'Direct game journey begins at Ice Breaker');
assert.ok(w.gameApproachCamera.getPoint(1).distanceTo(w.gameCameraCurve.getPoint(1))<1e-8,'Direct journey retains the Monopoly arrival view');
for(let i=1;i<300;i++)assert.ok(w.gameApproachCamera.getPoint(i/300).distanceTo(w.gameApproachCamera.getPoint((i-1)/300))>.01,'Camera never parks along the direct approach');
console.log('PASS: continuous direct game camera, unchanged station views and clear camera corridor.');
