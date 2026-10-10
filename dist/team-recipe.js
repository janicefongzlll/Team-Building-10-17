import { finishBakery } from './bakery-finish.js';
import { buildRecipeGallery } from './recipe-gallery.js';
import { buildArtisanBakery } from './artisan-bakery.js';
export const TEAM_QUALITIES=[
 ['Trust','Believe in each other'],['Respect','Value different opinions'],['Communication','Speak clearly and listen well'],['Accountability','Take responsibility for your actions'],['Empathy','Understand others’ perspectives'],['Initiative','Take action without always being asked'],['Inclusiveness','Make everyone feel valued'],['Support','Help each other when needed'],['Positive Attitude','Stay constructive and optimistic'],['Problem-Solving','Focus on solutions, not blame'],['Speak Up','Feel comfortable sharing ideas'],['Appreciation','Recognize others’ contribution'],['Adaptability','Embrace change and challenges'],['Growth Mindset','Learn and improve together'],['Shared Goals','Work toward a common purpose']
];
export function buildTeamRecipe(w,THREE){
 const root=w.groupAt(w.recipeT);root.userData.dynamic=true;root.visible=false;w.recipeStation=root;
 const V=THREE.Vector3,box=(a,b,c,m,p=root,x=0,y=0,z=0)=>w.box(a,b,c,m,p,x,y,z),cyl=(a,b,h,m,p=root,x=0,y=0,z=0,n=32)=>w.cyl(a,b,h,m,p,x,y,z,n);
 const cream=w.mat('#eee7d8','stone'),white=w.mat('#f3f3e9','plaster'),oak=w.mat('#ae8964','wood'),navy=w.mat('#275954','paint'),steel=w.mat('#536768','metal'),brass=new THREE.MeshStandardMaterial({color:'#b79b64',metalness:.65,roughness:.3}),glass=new THREE.MeshStandardMaterial({color:'#a7d5e1',transparent:true,opacity:.16,roughness:.12,metalness:.18,envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide});
 const marbleCanvas=document.createElement('canvas');marbleCanvas.width=marbleCanvas.height=1024;const mc=marbleCanvas.getContext('2d');mc.fillStyle='#f1eee6';mc.fillRect(0,0,1024,1024);for(let i=0;i<26;i++){mc.beginPath();mc.moveTo(-50,i*47);mc.bezierCurveTo(240,i*47-80,510,i*47+140,1080,i*47+200);mc.strokeStyle=i%3?'#929c9b20':'#ae96853b';mc.lineWidth=i%3?1.2:2.6;mc.stroke();}const marbleMap=new THREE.CanvasTexture(marbleCanvas);marbleMap.colorSpace=THREE.SRGBColorSpace;const marble=new THREE.MeshPhysicalMaterial({color:'#fffdf7',map:marbleMap,roughness:.29,metalness:.05,clearcoat:.25,clearcoatRoughness:.25});
 const china=new THREE.MeshStandardMaterial({color:'#fffaf0',roughness:.3}),bread=new THREE.MeshStandardMaterial({color:'#ce8d3e',roughness:.75}),blue=w.mat('#3d729c','paint'),red=w.mat('#c53f4e','paint'),gold=w.mat('#dcaa43','paint'),leaf=w.mat('#548861','paint');
 const sphere=(r,m,p,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;p.add(o);return o;};
 const ring=(r,t,m,p,x,y,z,rx=0)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,40),m);o.position.set(x,y,z);o.rotation.x=rx;p.add(o);return o;};
 const sign=(s,a,b,x,y,z)=>{const o=w.text(s,a,b,'#275954','#fff5df');o.position.set(x,y,z);root.add(o);return o;};
 w.plaza(root,28,-5,66,96);box(190,.35,175,w.mat('#799c84','earth'),root,12,-1.65,0);box(8,1.1,65,cream,root,7,.2,-5);box(.35,.05,64,w.palette.gold,root,3.3,.79,-5);
 // A separate glass-vaulted station canopy, beside an open railway corridor.
 for(const z of [-31,-15,1,17]){for(const x of [4,11])cyl(.13,.19,7.3,steel,root,x,4,z);box(10,.15,15,glass,root,7.5,7.7,z);box(10,.12,.14,brass,root,7.5,7.85,z-7.3);}
 // Bakery perimeter leaves a ten-metre central entrance and a generous interior aisle.
 box(44,.5,60,cream,root,28,-.92,-10);box(43,.12,59,oak,root,28,-.59,-10);
 box(45,23,.5,white,root,28,10.8,-40);for(const x of [6,50]){for(const z of [-37,-25,-13,-1,11,20]){box(.45,23,.5,cream,root,x,10.8,z);box(.8,.35,.8,cream,root,x,-.3,z);}
  box(.055,20,59,glass,root,x,10.7,-10).castShadow=false;for(const y of [5,11,17,22])box(.18,.16,60,steel,root,x,y,-10);}
 for(const x of [7,15,22,34,41,49]){box(.5,18,.6,cream,root,x,8.4,20);box(.72,.3,.85,brass,root,x,17.4,20);}
 for(const x of [11,18.5,37.5,45]){box(6.3,13,.06,glass,root,x,6,20).castShadow=false;box(6.4,.13,.2,oak,root,x,6,20.1);}
 // The two glass doors are held open, away from the camera's walking path.
 for(const side of [-1,1]){const door=new THREE.Group();door.position.set(28+side*5.6,-.3,20);door.rotation.y=side*1.4;root.add(door);box(4.7,7.5,.06,glass,door,side*2.35,3.75);for(const y of [.1,7.4])box(4.7,.13,.12,brass,door,side*2.35,y);box(.13,7.5,.12,brass,door,side*4.65,3.75);box(.06,1.1,.09,steel,door,side*4.2,3.8,.12);}
 box(45,2.2,1.2,navy,root,28,15.7,20);w.recipeSign=sign('TEAM RECIPE',30,1.6,28,15.7,20.63);w.recipeSign.material.transparent=true;
 sign('BAKERY & CULINARY ATELIER',23,.65,28,13.75,20.7);
 box(46,.4,2,cream,root,28,17.7,20);box(46,.4,2,cream,root,28,14.3,20);
 for(const z of [-40,-28,-16,-4,8,20]){const curve=new THREE.CatmullRomCurve3(Array.from({length:41},(_,i)=>new V(6+i*1.1,22.6+Math.sin(i/40*Math.PI)*5.2,z)));root.add(new THREE.Mesh(new THREE.TubeGeometry(curve,56,.13,10,false),steel));}
 for(let i=0;i<40;i++){const x=6+(i+.5)*1.1,y=22.6+Math.sin((i+.5)/40*Math.PI)*5.2,p=box(1.12,.055,60,glass,root,x,y,-10);p.rotation.z=Math.atan(Math.cos((i+.5)/40*Math.PI)*5.2*Math.PI/44);p.castShadow=false;}
 for(const x of [6,17,28,39,50])box(.1,.15,60,steel,root,x,22.6+Math.sin((x-6)/44*Math.PI)*5.2,-10);
 // Side counters and bakery shelving frame a clear central route through the atelier.
 for(const [x,z,width]of [[13,6,10],[42,-1,10],[12,-21,9]]){box(width,1.8,3.6,oak,root,x,.3,z);box(width+.45,.22,4,marble,root,x,1.31,z);box(width-.3,.55,.08,navy,root,x,.25,z+1.85);box(width-.2,1.4,.045,glass,root,x,2.15,z+1.7).castShadow=false;box(width,.05,3.4,glass,root,x,2.87,z);}
 box(3,1.15,1.2,steel,root,13,1.99,6);box(3.15,.16,1.4,china,root,13,2.62,6);for(const x of [12,13,14]){cyl(.08,.08,.35,brass,root,x,1.8,6.7);cyl(.14,.12,.24,china,root,x,1.59,6.7);}
 for(const [x,z,width]of [[13,6,10],[42,-1,10],[12,-21,9]]){for(let j=0;j<4;j++){const xx=x-width/2+width*(j+.5)/4;box(width/4-.18,1.2,.09,oak,root,xx,.3,z+1.83);box(.22,.035,.1,brass,root,xx,.62,z+1.94);}for(const side of [-1,1])box(.07,1.7,3.5,brass,root,x+side*(width/2-.08),2.08,z);box(width,.07,.07,brass,root,x,2.86,z+1.72);box(width,.07,.07,brass,root,x,2.86,z-1.72);}
 const croissant=(p,x,y,z)=>{for(let j=0;j<9;j++){const a=j/8*Math.PI-Math.PI/2,r=.065+.07*Math.cos(a);const m=sphere(r,j%2?bread:gold,p,x+Math.sin(a)*.28,y+.08,z+Math.cos(a)*.16,1,.8,1.2);m.rotation.y=-a;}};
 for(const z of [-15,-9,-3,3]){box(4.5,.2,2,oak,root,8.8,3,z);box(4.5,.2,2,oak,root,8.8,5,z);}
 for(const x of [10,46])for(const z of [-27,-14,0,13]){cyl(.045,.045,3.5,steel,root,x,16,z);const lampshade=new THREE.Mesh(new THREE.ConeGeometry(.95,.8,40),navy);lampshade.position.set(x,14.2,z);root.add(lampshade);cyl(.7,.7,.06,new THREE.MeshStandardMaterial({color:'#fff4d5',emissive:'#fff0cf',emissiveIntensity:.6}),root,x,13.8,z);}
 for(const [x,z]of [[15,31],[43,32],[44,10]]){cyl(1.45,1.45,.12,oak,root,x,.7,z);cyl(.1,.27,1.7,steel,root,x,-.2,z);for(const side of [-1,1]){box(.85,.12,.8,oak,root,x+side*2,-.1,z);box(.85,.8,.1,oak,root,x+side*2,.24,z-.35);for(const dx of [-.3,.3])for(const dz of [-.28,.28])box(.07,.9,.07,steel,root,x+side*2+dx,-.58,z+dz);cyl(.25,.25,.035,china,root,x+side*.7,.8,z);cyl(.13,.1,.24,china,root,x+side*.7,.93,z);ring(.085,.025,china,root,x+side*.7+.16,.92,z);croissant(root,x+side*.5,.81,z+.5);}}
 for(const [x,z]of [[8,25],[48,25],[19,14],[38,-17],[46,-29]]){box(1.7,.8,1.7,cream,root,x,-.64,z);for(let j=0;j<4;j++)w.shrub(root,x+(j%2-.5)*.6,-.2,z+(Math.floor(j/2)-.5)*.6,.7,false);}
 buildArtisanBakery(w,root,THREE,{oak,marble,china,brass,navy});
 finishBakery(w,root,THREE,{oak,marble,brass,navy});
 buildRecipeGallery(w,root,THREE,TEAM_QUALITIES,{oak,brass});
 for(const x of [8.2,47.8]){box(1.4,.8,1.4,oak,root,x,-.65,-32);for(let j=0;j<4;j++)w.shrub(root,x+(j%2-.5)*.4,-.13,-32+(Math.floor(j/2)-.5)*.4,.7,false);for(let j=0;j<18;j++){const y=18.7-j*.14,leafMesh=sphere(.13,leaf,root,x+Math.sin(j*.8)*.18,y,-36.1,.6,1.2,.22);leafMesh.rotation.z=j%2?.5:-.5;}}
 const fill=new THREE.PointLight('#edf7ff',60,60,1.5);fill.position.set(28,16,-25);root.add(fill);
 w.host.dataset.recipeQualities='15';w.host.dataset.recipeDescriptions=TEAM_QUALITIES.map(([a,b])=>a+': '+b).join('|');
 // The extension and its electrical lines share the same continuous track frame.
 const rail=new THREE.Group();rail.userData.dynamic=true;rail.visible=false;w.scene.add(rail);w.recipeRail=rail;const pts=Array.from({length:90},(_,i)=>w.recipePath.getPointAt(i/89));const bed=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),90,2.7,6,false),w.palette.gravel);bed.scale.y=.1;bed.position.y=1.26;rail.add(bed);
 for(const side of [-1.32,1.32]){const curve=new THREE.CatmullRomCurve3(Array.from({length:90},(_,i)=>w.at(w.recipeStart+(w.recipeT-w.recipeStart)*i/89,side,.04)));rail.add(new THREE.Mesh(new THREE.TubeGeometry(curve,90,.09,8,false),w.palette.rail));}
 const n=Math.ceil(w.recipePath.getLength()/1.25),ties=new THREE.InstancedMesh(new THREE.BoxGeometry(4.6,.2,.3),w.palette.darkWood,n),dummy=new THREE.Object3D();for(let i=0;i<n;i++){const f=w.frameAt(w.recipeStart+(w.recipeT-w.recipeStart)*i/(n-1));dummy.position.copy(f.p);dummy.position.y=1.17;dummy.rotation.set(0,f.angle,0);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}ties.castShadow=ties.receiveShadow=true;rail.add(ties);
 for(let i=1;i<=6;i++){const t=w.recipeStart+(w.recipeT-w.recipeStart)*i/6,p=new THREE.Group();p.position.copy(w.at(t,5.8));p.rotation.y=w.frameAt(t).angle;rail.add(p);cyl(.13,.18,9.5,steel,p,0,3.9);box(8,.15,.15,steel,p,-3.6,8.65);if(i<6){const a=w.at(t,0,8.4),b=w.at(w.recipeStart+(w.recipeT-w.recipeStart)*(i+1)/6,0,8.4),mid=a.clone().lerp(b,.5);mid.y-=.2;rail.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a,mid,b),16,.018,6,false),steel));}}
 w.batchStatic(root);w.batchStatic(rail);
}
