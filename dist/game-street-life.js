// Connect the landmark districts with streets, planting and everyday city life.
export function buildGameStreetLife(w,g,T){
 const root=new T.Group();g.add(root);w.gameStreetLife=root;g.updateWorldMatrix(true,false);const inverse=g.matrixWorld.clone().invert();
 const occupied=[];for(const child of g.children){if(child.userData.audienceFacing||child.userData.cityBlock){const b=new T.Box3().setFromObject(child).applyMatrix4(inverse);occupied.push(b);}}
 for(const [x,z,a,b]of [[-24,16,22,22],[43,20,17,26],[97,-37,17,19],[69,-14,18,16],[30,-52,5,8],[50,-15,5,8],[50,12,5,8],[77,-73,5,8],[79,5,5,8],[63,63,5,8],[38,-92,5,8],[-9,20,6,6],[18,34,6,6],[121,-16,2.4,4.4],[55,46,2.4,4.4]])occupied.push(new T.Box3(new T.Vector3(x-a/2,-2,z-b/2),new T.Vector3(x+a/2,12,z+b/2)));
 const rails=Array.from({length:240},(_,i)=>w.frameAt(1.43+(w.gameStart+w.gameSpan-1.43)*i/239).p.applyMatrix4(inverse));
 const views=Array.from({length:120},(_,i)=>[w.gameCameraCurve.getPointAt(i/119).applyMatrix4(inverse),w.frameAt(1.45+.75*i/119).p.applyMatrix4(inverse)]);
 const safe=(x,z,a,b,h,margin=.35)=>{
  const bounds=new T.Box3(new T.Vector3(x-a/2-margin,-1.15,z-b/2-margin),new T.Vector3(x+a/2+margin,h-1.0,z+b/2+margin));
  if(occupied.some(box=>box.intersectsBox(bounds)))return false;
  if(rails.some(p=>Math.abs(p.x-x)<a/2+5&&Math.abs(p.z-z)<b/2+5))return false;
  for(const [cam,train]of views){const d=train.clone().sub(cam),distance=d.length(),ray=new T.Ray(cam,d.divideScalar(distance)),hit=ray.intersectBox(bounds.clone().expandByScalar(1.1),new T.Vector3());if(hit&&hit.distanceTo(cam)<distance)return false;}
  return true;
 };
 const box=(a,b,c,m,x,y,z,parent=root)=>w.box(a,b,c,m,parent,x,y,z),mat=(color,kind='paint')=>w.mat(color,kind),asphalt=mat('#52615f','stone'),paving=mat('#c6caba','stone'),cream=mat('#ece5ce'),green=mat('#62815a'),soil=mat('#576c49','earth'),metal=mat('#344c47','metal'),skin=mat('#dfb28f'),hair=mat('#4b3d34'),tyre=mat('#26302e'),glass=new T.MeshStandardMaterial({color:'#1b333c',metalness:.48,roughness:.19});
 const counts={road:0,gardens:0,flowers:0,people:0,vehicles:0,buses:0};w.gameStreetSites=[];
 // Short blocks create side streets, leaving landmark forecourts uninterrupted.
 const segment=(x,z,horizontal)=>{const a=horizontal?6:7,b=horizontal?7:6;if(!safe(x,z,a,b,.2))return;box(horizontal?6:4.5,.045,horizontal?4.5:6,asphalt,x,-1.04,z);for(const sign of [-1,1]){box(horizontal?6:1.15,.05,horizontal?1.15:6,paving,x+(horizontal?0:sign*2.85),-1.015,z+(horizontal?sign*2.85:0));box(horizontal?6:.15,.15,horizontal?.15:6,cream,x+(horizontal?0:sign*2.23),-1.045,z+(horizontal?sign*2.23:0));}box(horizontal?2.1:.09,.012,horizontal?.09:2.1,cream,x,-1.009,z);counts.road++;};
 for(const z of [-58,-3,86])for(let x=22;x<=118;x+=6)segment(x,z,true);
 for(const x of [34,91])for(let z=-94;z<=94;z+=6)segment(x,z,false);
 // Zebra crossings at existing boulevard junctions.
 for(const [x,z]of [[18,-28],[55,-28],[121,-28],[18,62],[55,62],[121,62]])if(safe(x,z,4.5,4.5,.2,0)){for(let j=-2;j<=2;j++)box(3.9,.013,.38,cream,x,-1.001,z+j*.75);}
 // Repeated low flower beds bind the blocks together instead of filling them with tall clutter.
 const flowerMats=['#c78b75','#e4c18b','#a999b7','#e8dec6'].map(c=>mat(c));
 for(const [x,z]of [[29,-91],[36,-68],[29,-47],[33,-16],[31,8],[34,42],[33,75],[43,94],[63,-102],[73,-65],[73,13],[86,-7],[86,58],[85,84],[107,-96],[108,-71],[107,-15],[109,55],[107,100],[59,17],[68,74],[115,2],[115,70]]){
  if(!safe(x,z,4.2,3.3,1.35))continue;
  box(4.2,.26,3.3,paving,x,-.98,z);box(3.85,.07,2.95,soil,x,-.815,z);
  const bush=new T.Mesh(new T.SphereGeometry(1,16,12),green);bush.position.set(x,-.47,z);bush.scale.set(1.6,.36,1.15);root.add(bush);
  for(let j=0;j<18;j++){const dx=Math.sin(j*2.4)*Math.sqrt((j+.5)/18)*1.5,dz=Math.cos(j*2.4)*Math.sqrt((j+.5)/18)*1.06;w.cyl(.018,.025,.33,green,root,x+dx,-.43,z+dz,6);const bloom=new T.Mesh(new T.SphereGeometry(.095,8,6),flowerMats[j%4]);bloom.position.set(x+dx,-.22+(j%3)*.045,z+dz);bloom.scale.set(1,.6,1);root.add(bloom);counts.flowers++;}
  counts.gardens++;w.gameStreetSites.push({kind:'garden',x,z,width:4.2,depth:3.3,height:1.35});
 }
 const clothes=['#e2d2b9','#526b81','#6e8f78','#b8846c','#a99a7d'].map(c=>mat(c));
 const pedestrian=(x,z,i,angle=0)=>{
  if(!safe(x,z,.9,.9,1.9))return;const person=new T.Group();person.position.set(x,-.99,z);person.rotation.y=angle;root.add(person);
  const part=(geometry,material,px,py,pz)=>{const m=new T.Mesh(geometry,material);m.position.set(px,py,pz);m.castShadow=m.receiveShadow=true;person.add(m);return m;};
  part(new T.CapsuleGeometry(.17,.37,5,12),clothes[i%5],0,1.02,0);part(new T.SphereGeometry(.17,16,12),skin,0,1.56,0);const cap=part(new T.SphereGeometry(.174,16,12),hair,0,1.605,-.035);cap.scale.set(1,.73,.93);
  for(const sign of [-1,1]){const leg=part(new T.CapsuleGeometry(.058,.40,4,10),i%2?metal:clothes[(i+1)%5],sign*.09,.37,0);leg.rotation.x=sign*(i%3? .17:0);part(new T.BoxGeometry(.13,.07,.23),tyre,sign*.09,.065,sign*.06+.025);const arm=part(new T.CapsuleGeometry(.05,.31,4,10),clothes[i%5],sign*.23,1.0,0);arm.rotation.x=-sign*.18;arm.rotation.z=sign*.09;part(new T.SphereGeometry(.06,10,8),skin,sign*.255,.77,sign*.025);}
  if(i%4===0){const bag=part(new T.BoxGeometry(.17,.23,.08),clothes[(i+2)%5],.31,.85,-.025);bag.rotation.z=.08;}
  counts.people++;w.gameStreetSites.push({kind:'person',x,z,width:.9,depth:.9,height:1.9});
 };
 let personIndex=0;for(const x of [14.5,21.5,51.5,58.5,117.5,124.5])for(const z of [-73,-39,-12,18,43,76])pedestrian(x,z,personIndex++,personIndex%2?Math.PI:0);
 for(const z of [-31.5,-24.5,58.5,65.5])for(const x of [29,47,73,107])pedestrian(x,z,personIndex++,Math.PI/2);
 const paint=['#d8ddd4','#6b8690','#a47861','#52776b','#c9b89d'].map(c=>new T.MeshPhysicalMaterial({color:c,metalness:.24,roughness:.28,clearcoat:.55}));
 const car=(x,z,i,angle=0,bus=false)=>{
  const length=bus?5.8:3.8,width=1.7,horizontal=Math.abs(Math.sin(angle))>.5,a=horizontal?length:width,b=horizontal?width:length;if(!safe(x,z,a+.25,b+.25,2.05))return;
  const vehicle=new T.Group();vehicle.position.set(x,-1.0,z);vehicle.rotation.y=angle;root.add(vehicle);const body=paint[i%paint.length],cabLength=bus?4.7:1.85;
  box(1.72,.50,length,body,0,.47,0,vehicle);box(1.45,.64,cabLength,glass,0,.99,bus?0:-.10,vehicle);box(1.56,.10,cabLength+.12,body,0,1.36,bus?0:-.10,vehicle);
  for(const sign of [-1,1]){box(.045,.055,length-.3,cream,sign*.87,.41,0,vehicle);box(.12,.10,.27,body,sign*.90,1.02,.6,vehicle);for(const dz of [-length*.31,length*.31]){const wheel=w.cyl(.30,.30,.21,tyre,vehicle,sign*.84,.28,dz,20);wheel.rotation.z=Math.PI/2;}}
  const white=new T.MeshStandardMaterial({color:'#efe5c7',emissive:'#ffe3ac',emissiveIntensity:.25}),red=new T.MeshStandardMaterial({color:'#ac6658',emissive:'#ba594c',emissiveIntensity:.15});
  for(const px of [-.55,.55]){box(.31,.13,.045,white,px,.55,length/2+.024,vehicle);box(.29,.12,.045,red,px,.54,-length/2-.024,vehicle);}
  if(bus)for(let k=-2;k<=2;k++)for(const sign of [-1,1])box(.025,.59,.06,cream,sign*.736,.98,k*.85,vehicle);
  counts.vehicles++;if(bus)counts.buses++;w.gameStreetSites.push({kind:'vehicle',x,z,width:a+.25,depth:b+.25,height:2.05});occupied.push(new T.Box3(new T.Vector3(x-a/2-.4,-1.1,z-b/2-1.2),new T.Vector3(x+a/2+.4,1.3,z+b/2+1.2)));
 };
 let carIndex=0;const placeTraffic=(x,z,angle)=>{const before=counts.vehicles;if(!counts.buses)car(x,z,carIndex,angle,true);if(counts.vehicles===before)car(x,z,carIndex,angle,false);carIndex++;};
 for(const [x,z]of [[16.9,-39],[19.1,-10],[16.9,17],[19.1,52],[53.9,-19],[56.1,2],[53.9,33],[56.1,48],[119.9,-76],[122.1,-48],[119.9,-8],[122.1,24],[119.9,52],[122.1,86]])placeTraffic(x,z,carIndex%2?Math.PI:0);
 for(const [x,z]of [[29,-29.1],[48,-26.9],[78,-29.1],[104,-26.9],[27,60.9],[47,63.1],[74,60.9],[98,63.1],[116,60.9]])placeTraffic(x,z,Math.PI/2);
 w.gameCityLifeStats=counts;for(const [key,value]of Object.entries(counts))w.host.dataset['gameStreet'+key[0].toUpperCase()+key.slice(1)]=String(value);
}
