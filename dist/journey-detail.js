// Curated streets and planting sit outside every train and camera corridor.
export function upgradeJourneyEnvironment(w,T){
 const root=new T.Group();root.userData.dynamic=true;w.scene.add(root);w.journeyDetail=root;
 const routes=[[w.path,w.cameraCurve,w.lookCurve],[w.extensionPath,w.mentorCameraCurve,w.mentorLookCurve],[w.gamePath,w.gameCameraCurve,w.gameLookCurve],[w.restPath,w.restCameraCurve,w.restLookCurve],[w.recipePath,w.recipeCameraCurve,w.recipeLookCurve],[w.joannePath,w.joanneCameraCurve,w.joanneLookCurve],[w.finalPath,w.finalCameraCurve,w.finalLookCurve]];
 const rails=[],views=[];for(const [route,cam,aim] of routes)for(let i=0;i<=100;i++){rails.push(route.getPointAt(i/100));views.push([cam.getPoint(i/100),aim.getPoint(i/100)]);}
 for(let i=0;i<=80;i++)views.push([w.recipeInteriorCurve.getPoint(i/80),w.recipeInteriorLook.getPoint(i/80)]);
 w.scene.updateMatrixWorld(true);const existing=[];w.scene.traverse(m=>{if(m.isMesh&&m.geometry.type==='BoxGeometry'&&m.geometry.parameters.height>2.5)existing.push(new T.Box3().setFromObject(m).expandByScalar(2));});
 const safe=(center,radius,height)=>{
  if(rails.some(p=>Math.hypot(center.x-p.x,center.z-p.z)<radius+9))return false;
  const bounds=new T.Box3(new T.Vector3(center.x-radius,center.y-.5,center.z-radius),new T.Vector3(center.x+radius,center.y+height,center.z+radius));
  if(existing.some(b=>b.intersectsBox(bounds)))return false;
  const expanded=bounds.clone().expandByScalar(3);for(const [cam,aim]of views){const d=aim.clone().sub(cam),length=d.length();if(!length)continue;const hit=new T.Ray(cam,d.divideScalar(length)).intersectBox(expanded,new T.Vector3());if(hit&&hit.distanceTo(cam)<=length)return false;}
  return true;
 };
 const stone=w.mat('#d6d2be','stone'),dark=w.mat('#36524a','metal'),oak=w.mat('#9c8060','wood'),earth=w.mat('#8c9d75','earth'),leaf=w.mat('#5a8056','paint'),window=new T.MeshStandardMaterial({color:'#2e5360',metalness:.45,roughness:.22,envMapIntensity:1.1});
 let blocks=0,trees=0;
 for(let section=0;section<routes.length;section++){
  const route=routes[section][0];
  for(const u of [.26,.52,.76]){
   const at=route.getPointAt(u),dir=route.getTangentAt(u),side=new T.Vector3(dir.z,0,-dir.x),rotation=Math.atan2(dir.x,dir.z);
   let center;for(const offset of [45,62,82,102]){const p=at.clone().addScaledVector(side,offset);p.y=-.2;if(safe(p,15,12)){center=p;break;}}
   if(!center)continue;
   const g=new T.Group();g.position.copy(center);g.rotation.y=rotation;root.add(g);
   // One composed terrace, rather than scattered buildings.
   w.box(27,2.0,20,stone,g,0,-1.3,0);w.box(27,.25,20,stone,g,0,-.22,0);w.box(27,.04,3,stone,g,0,-.07,8.1);
   for(const x of [-7,7]){
    const h=6.8+(section%3)*1.2,plaster=w.mat(['#e7dec9','#d3dfd8','#e8dfd1'][section%3],'plaster');
    w.box(8,h,11,plaster,g,x,h/2,0);w.box(8.4,.45,11.4,stone,g,x,.22,0);w.box(8.7,.3,11.6,dark,g,x,h+.12,0);
    const roof=new T.Mesh(new T.CylinderGeometry(0,6.8,2.2,4,1),dark);roof.rotation.y=Math.PI/4;roof.scale.set(1,1,1.18);roof.position.set(x,h+1.35,0);g.add(roof);
    for(const z of [-5.6,5.6])for(const dx of [-2.25,0,2.25])for(const y of [2.3,h-1.6]){
     w.box(1.4,1.8,.09,window,g,x+dx,y,z);for(const ox of [-.84,.84])w.box(.14,2.02,.23,stone,g,x+dx+ox,y,z);w.box(1.85,.16,.38,stone,g,x+dx,y-.97,z);w.box(.07,1.8,.14,dark,g,x+dx,y,z);
    }
    for(const dx of [-3.85,3.85])w.box(.32,h,.38,stone,g,x+dx,h/2,5.6);
    w.box(4,.16,1.5,oak,g,x,h*.51,6.22);w.box(4,.6,.06,dark,g,x,h*.51+.4,6.9);for(let k=0;k<8;k++)w.box(.045,.65,.06,dark,g,x-1.75+k*.5,h*.51+.3,6.9);
    w.box(1.35,2.1,.15,oak,g,x,1.05,5.67);w.box(1.75,.12,.65,stone,g,x,.08,6);
    w.box(1.2,.75,1.2,stone,g,x+3,.1,7.7);for(let k=0;k<3;k++){const shrub=new T.Mesh(new T.SphereGeometry(.65,16,12),leaf);shrub.position.set(x+3+(k-1)*.28,.75,7.7);shrub.scale.y=.7;g.add(shrub);}
   }
   blocks+=2;existing.push(new T.Box3().setFromObject(g).expandByScalar(2));
   for(const offset of [-23,23])for(const along of [-10,5]){
    const p=center.clone().addScaledVector(side,offset).addScaledVector(dir,along);if(!safe(p,2.8,8))continue;
    const tree=new T.Group();tree.position.copy(p);root.add(tree);w.cyl(.15,.24,4,oak,tree,0,1.7,0,16);
    for(let k=0;k<4;k++){const crown=new T.Mesh(new T.SphereGeometry(1,20,14),k%2?leaf:w.palette.lightLeaf);crown.position.set(Math.sin(k*2.4)*.8,4.4+k*.45,Math.cos(k*2.4)*.8);crown.scale.set(1.75,1.35,1.75);crown.castShadow=crown.receiveShadow=true;tree.add(crown);}trees++;
   }
   // Planted retaining edge and a pair of modest terrace lamps.
   w.box(27,.65,.35,stone,g,0,.1,-9.3);for(const x of [-12,12]){w.cyl(.08,.12,3.9,dark,g,x,1.85,7.7,16);w.box(.55,.5,.55,new T.MeshStandardMaterial({color:'#ebd5a7',emissive:'#edbd79',emissiveIntensity:.18}),g,x,3.75,7.7);}
  }
 }
 // Finer architectural finish on existing village houses, without moving them.
 const houses=[];w.scene.traverse(g=>{if(g.userData.house)houses.push(g);});
 for(const g of houses){const {width:a,height:h}=g.userData.house;w.box(a+.3,.3,a*1.3+.3,stone,g,0,.16,0);for(const x of [-a/2+.25,a/2-.25])w.box(.22,h,.3,stone,g,x,h/2,a*.66);w.box(a+.7,.16,a*1.3+.8,oak,g,0,h-.1,0);for(const x of [-a*.26,a*.26]){w.box(1.1,1.3,.08,window,g,x,h*.56,a*.655);w.box(1.35,.12,.32,stone,g,x,h*.56-.72,a*.70);for(const dx of [-.68,.68]){w.box(.18,1.4,.12,dark,g,x+dx,h*.56,a*.67);for(let j=0;j<5;j++)w.box(.22,.04,.04,oak,g,x+dx,h*.56-.5+j*.25,a*.74);}}}
 // Cornice edging and recessed roof vents finish the existing civic architecture.
 const facades=[];w.scene.traverse(g=>{if(g.userData.facade)facades.push(g);});
 for(const g of facades){const {width:a,depth:d,height:h}=g.userData.facade;w.box(a+.4,.08,d+.4,oak,g,0,h+.81,0);for(const x of [-a*.24,a*.24]){w.box(a*.27,.55,1.6,dark,g,x,h+.62,-d*.21);for(let j=0;j<5;j++)w.box(a*.24,.035,.10,stone,g,x,h+.91,-d*.21-.6+j*.3);}for(const z of [-d/2,d/2])w.box(a-.8,.08,.12,stone,g,0,1.25,z+.06*Math.sign(z));}
 w.batchStatic(root);w.batchStatic(w.finalStation);w.host.dataset.journeyTerraces=String(blocks);w.host.dataset.journeyTrees=String(trees);
}
