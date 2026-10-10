import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import { RailwayWorld } from '../dist/world.js';
import { buildFinalStation } from '../dist/final-station.js';
import { buildJoanneStation } from '../dist/joanne-station.js';
import { experienceState, travelProgress, smooth } from '../dist/timeline.js';

const w=Object.create(RailwayWorld.prototype),source=fs.readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
new Function('THREE','V','smooth',source.slice(source.indexOf('  this.path='),source.indexOf('  this.buildReflections'))).call(w,THREE,THREE.Vector3,smooth);
w.scene=new THREE.Scene();w.host={dataset:{}};w.materialCache=new Map();w.lamps=[];
w.mat=(c,k='stone')=>{const key=c+k;if(!w.materialCache.has(key))w.materialCache.set(key,new THREE.MeshStandardMaterial({color:c}));return w.materialCache.get(key)};
w.palette=Object.fromEntries(['grass','leaf','lightLeaf','wood','darkWood','cream','roof','rail','gravel','gold','mint','glass','black'].map(k=>[k,w.mat('#607060')]));
for(const k of ['granite','charcoal','limestone','steel','archGlass','windowGlass'])w[k]=w.mat('#81979b');
w.text=(text,x,y)=>new THREE.Mesh(new THREE.PlaneGeometry(x,y),w.mat('#fff'));
w.treeXY=()=>{};w.shrub=()=>{};w.batchStatic=()=>{};
const load=THREE.TextureLoader.prototype.load;THREE.TextureLoader.prototype.load=()=>new THREE.Texture();
buildJoanneStation(w,THREE);buildFinalStation(w,THREE);THREE.TextureLoader.prototype.load=load;
w.scene.updateMatrixWorld(true);
const obstacles=[];
for(const root of [w.joanneStation,w.finalStation,w.finalRail])root.traverse(m=>{if(!m.isMesh)return;assert.ok(m.position.toArray().every(Number.isFinite));for(const v of m.geometry.attributes.position.array)assert.ok(Number.isFinite(v),'Finite final station geometry');m.geometry.computeBoundingBox();if(root!==w.finalRail)obstacles.push({m,b:m.geometry.boundingBox.clone().expandByScalar(.6),inverse:m.matrixWorld.clone().invert()});});
assert.ok(w.finalCameraCurve.getPoint(0).distanceTo(w.joanneCameraCurve.getPoint(1))<1e-8,'Camera handoff is continuous');
assert.ok(w.finalLookCurve.getPoint(0).distanceTo(w.joanneLookCurve.getPoint(1))<1e-8,'Look direction handoff is continuous');
for(let i=0;i<=600;i++){
 const camera=w.finalCameraCurve.getPoint(i/600),train=w.frameAt(w.finalStart+(w.finalT-w.finalStart)*i/600).p.clone().add(new THREE.Vector3(0,2,0));
 for(const {m,b,inverse}of obstacles){assert.equal(b.containsPoint(camera.clone().applyMatrix4(inverse)),false,'Final camera clears '+m.geometry.type+' '+m.position.toArray());if(m.geometry.type==='BoxGeometry'&&m.geometry.parameters.height>4)assert.equal(b.clone().expandByScalar(1.8).containsPoint(train.clone().applyMatrix4(inverse)),false,'Final train clears architecture');}
}
// The terminal track supports the complete train and visibly finishes past the platform.
const track=w.finalTrackInfo;assert.ok(track.end-track.length>=40,'Track continues beyond the parked train and platform');assert.ok(track.bufferDistance-track.length>35,'Buffer remains safely ahead of the train');assert.ok(track.wirePoints[0].distanceTo(w.at(w.joanneT,0,8.4))<1e-8,'Catenary connects to Joanne');assert.ok((track.sleeperCount-1)*track.sleeperPitch>track.bufferDistance,'Sleepers continue to the buffer');
for(const part of track.railParts){const top=part.position.y+part.geometry.parameters.height/2;if(part.geometry.parameters.height===.075)assert.ok(top>-.13,'Running rail head remains above the sleepers');}
const runningEnds=track.railParts.map(part=>{part.updateWorldMatrix(true,false);return new THREE.Vector3(0,0,-part.geometry.parameters.depth/2).applyMatrix4(part.matrixWorld)});assert.ok(runningEnds.every(p=>Math.abs(p.clone().sub(track.start).dot(track.tangent)+1)<.001),'Both rails join the prior segment with a small overlap');
for(let i=0;i<=300;i++){const camera=w.finalCameraCurve.getPointAt(i/300);w.finalRail.traverse(m=>{if(!m.isMesh||m.isInstancedMesh)return;m.geometry.computeBoundingBox();const b=m.geometry.boundingBox.clone().expandByScalar(.35);assert.equal(b.containsPoint(camera.clone().applyMatrix4(m.matrixWorld.clone().invert())),false,'Terminal track equipment clears the camera');});}
const end=experienceState(9.9);assert.equal(end.phase,'THANK YOU');assert.equal(end.focus,1);assert.equal(end.finalTravel,1);assert.ok(Math.abs(end.train-w.finalT)<1e-10);assert.deepEqual(experienceState(100),end,'End stays parked without restarting');
for(const [start,target]of [[8.5,9.9],[9.9,8.5]]){let last=experienceState(start);for(let i=1;i<=3000;i++){const state=experienceState(travelProgress(start,target,i/3000));assert.ok(Math.abs(state.train-last.train)<.003,'Smooth final train travel');assert.ok((state.train-last.train)*Math.sign(target-start)>=-1e-8,'Reversible direction');if(state.finalTitle&&state.focus>0)assert.equal(state.finalTravel,1,'Thank-you title appears after parking');last=state;}assert.equal(travelProgress(start,target,1),target);}
console.log('PASS: continuous final camera, architecture clearance, smooth reversible journey and parked Thank You ending.');
