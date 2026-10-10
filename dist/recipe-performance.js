// Keep the complete bakery, but cull and shade it in small architectural zones.
export function prepareRecipeRendering(w,root,T){
 root.updateWorldMatrix(true,true);
 const inverse=root.matrixWorld.clone().invert(),zones=new Map(),meshes=[];
 root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&o!==w.recipeSign)meshes.push(o);});
 const labels=meshes.filter(o=>o.userData.bakeryLabel);
 if(labels.length){
  const columns=8,rows=Math.ceil(labels.length/columns),canvas=document.createElement('canvas');canvas.width=2048;canvas.height=rows*256;
  const ctx=canvas.getContext('2d'),texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const material=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide});
  labels.forEach((mesh,i)=>{
   const x=i%columns,y=Math.floor(i/columns);ctx.drawImage(mesh.material.map.image,x*256,y*256,256,256);
   const uv=mesh.geometry.attributes.uv;
   for(let j=0;j<uv.count;j++)uv.setXY(j,(x+uv.getX(j))/columns,(rows-1-y+uv.getY(j))/rows);
   mesh.material=material;
  });
  w.host.dataset.recipeLabelAtlas=String(labels.length);
 }
 for(const mesh of meshes){
  const m=mesh.material;if(Array.isArray(m))continue;
  if(m.transparent){m.forceSinglePass=true;mesh.castShadow=false;}
  mesh.geometry.computeBoundingSphere();
  const sphere=mesh.geometry.boundingSphere;
  const scale=mesh.getWorldScale(new T.Vector3());
  if(sphere.radius*Math.max(scale.x,scale.y,scale.z)<.24)mesh.castShadow=false;
  const p=sphere.center.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);
  const key=[p.x<28?0:1,p.z<-10?0:1].join(':');
  let zone=zones.get(key);
  if(!zone){zone=new T.Group();zone.name='Bakery render zone '+key;zone.userData.dynamic=true;root.add(zone);zone.updateWorldMatrix(true,false);zones.set(key,zone);}
  zone.attach(mesh);
 }
 // The sign is an explicit presentation anchor, so retain the original object.
 w.recipeSign.userData.dynamic=true;
 for(const zone of zones.values())w.batchStatic(zone);
 w.host.dataset.recipeRenderZones=String(zones.size);
 let triangles=0;root.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});
 w.host.dataset.recipeTriangles=String(Math.round(triangles));
}

export function warmRecipeShaders(w,T){
 const roots=[w.restStation,w.recipeStation],previous=roots.map(o=>o.visible);
 const camera=w.camera.clone();camera.position.copy(w.recipeCameraCurve.getPointAt(1));camera.lookAt(w.recipeLookCurve.getPointAt(1));
 roots.forEach(o=>o.visible=true);
 try{
  const textures=new Set();roots.forEach(root=>root.traverse(o=>{if(o.isMesh&&!Array.isArray(o.material))for(const key of ['map','normalMap','roughnessMap','bumpMap'])if(o.material[key])textures.add(o.material[key]);}));
  for(const texture of textures)if(texture.image)w.renderer.initTexture?.(texture);
  w.host.dataset.recipeShaders='warming';
  const ready=w.renderer.compileAsync(w.scene,camera);
  ready.then(()=>w.host.dataset.recipeShaders='ready').catch(()=>w.host.dataset.recipeShaders='deferred');
 }catch{w.host.dataset.recipeShaders='deferred';}
 finally{roots.forEach((o,i)=>o.visible=previous[i]);}
}
