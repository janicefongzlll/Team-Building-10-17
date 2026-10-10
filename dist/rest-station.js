// A complete hospitality destination, built in railway-local coordinates.
export function buildRestStation(w,THREE){
 const V=THREE.Vector3,root=w.groupAt(w.restT),g=new THREE.Group();g.position.x=12;root.add(g);w.restStation=root;root.userData.dynamic=true;root.visible=false;
 const box=(a,b,c,m,p=g,x=0,y=0,z=0)=>w.box(a,b,c,m,p,x,y,z),cyl=(a,b,h,m,p=g,x=0,y=0,z=0,n=32)=>w.cyl(a,b,h,m,p,x,y,z,n);
 const stone=w.mat('#dedbd1','stone'),ivory=w.mat('#f2f1e9','plaster'),oak=w.mat('#ad8660','wood'),darkOak=w.mat('#785c43','wood'),green=w.mat('#365f52','paint'),metal=w.mat('#485a5b','metal'),linen=w.mat('#eee7d9','paint'),terra=w.mat('#b97660','paint');
 const glass=new THREE.MeshStandardMaterial({color:'#bfd8da',roughness:.08,metalness:.12,transparent:true,opacity:.18,depthWrite:false,envMapIntensity:1.6});
 const china=new THREE.MeshStandardMaterial({color:'#faf8ef',roughness:.22}),coffee=new THREE.MeshStandardMaterial({color:'#51331d',roughness:.33}),foam=new THREE.MeshStandardMaterial({color:'#e9ccb0',roughness:.6}),bread=new THREE.MeshStandardMaterial({color:'#bc752e',roughness:.82}),golden=new THREE.MeshStandardMaterial({color:'#e0a34d',roughness:.73}),juice=new THREE.MeshStandardMaterial({color:'#eeae44',roughness:.25,transparent:true,opacity:.83}),berry=w.mat('#ae3a4d','paint');
 const sphere=(r,m,p,x,y,z,sx=1,sy=1,sz=1)=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=mesh.receiveShadow=true;p.add(mesh);return mesh};
 const torus=(r,t,m,p,x,y,z,rx=0)=>{const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,40),m);mesh.position.set(x,y,z);mesh.rotation.x=rx;mesh.castShadow=mesh.receiveShadow=true;p.add(mesh);return mesh};
 const label=(s,width,height,x,y,z,fg='#fff6e9',bg='#365f52')=>{const mesh=w.text(s,width,height,bg,fg);mesh.position.set(x,y,z);g.add(mesh);return mesh};
 w.plaza(g,24,4,62,74);box(150,.3,125,w.mat('#789481','earth'),g,23,-1.55,4);box(8,.12,76,w.granite,root,7,-1.06,2);box(.22,.06,72,w.palette.gold,root,3.25,-.98,2);
 // Stone portico, oak mullions and open interior. No solid wall behind the glass frontage.
 box(37,.4,19,stone,g,27,-.91,-12);box(37,.25,19,oak,g,27,-.57,-12);
 box(37,9.7,.55,ivory,g,27,4.2,-21.1);for(const x of [8.5,45.5])box(.55,9.7,19,stone,g,x,4.2,-12);
 box(39,.55,21,stone,g,27,9.35,-12);box(37,.18,19,w.mat('#566b69','roof'),g,27,9.73,-12);
 for(const x of [9,15,21,27,33,39,45]){box(.3,8.4,.35,oak,g,x,3.95,-2.7);box(.6,.2,.6,stone,g,x,-.36,-2.7);box(.6,.18,.6,stone,g,x,8.25,-2.7);}
 for(const x of [12,18,24,30,36,42]){if(x===30)continue;box(5.65,6.2,.055,glass,g,x,3.05,-2.72).castShadow=false;box(5.7,.12,.18,oak,g,x,2.2,-2.65);}
 box(36,1.35,.65,green,g,27,7.35,-2.5);label('REST STATION',27,1.1,27,7.35,-2.14);
 box(39,.18,4.4,linen,g,27,6.25,-.55);for(let i=0;i<18;i++)box(1,.035,4.35,i%2?linen:green,g,9.3+i*2.05,6.35,-.55);box(39,.42,.12,linen,g,27,6.1,1.65);
 for(const x of [9,45])box(.2,6.4,.2,oak,g,x,2.7,1.5);
 // An arched upper gallery and restrained mansard roof give the café a civic scale.
 box(37,4.7,18,ivory,g,27,12,-12);box(38,.22,19,stone,g,27,9.95,-12);
 for(const x of [12,18,24,30,36,42]){
  const shape=new THREE.Shape();shape.moveTo(-1.6,0);shape.lineTo(1.6,0);shape.lineTo(1.6,1.95);shape.absarc(0,1.95,1.6,0,Math.PI,false);shape.lineTo(-1.6,0);
  const window=new THREE.Mesh(new THREE.ShapeGeometry(shape,24),new THREE.MeshStandardMaterial({color:'#718b8b',roughness:.15,metalness:.25,envMapIntensity:1.5}));window.position.set(x,10.3,-2.94);g.add(window);
  const points=[new V(x-1.65,10.25,-2.82),new V(x-1.65,12.25,-2.82),...Array.from({length:25},(_,i)=>new V(x+Math.cos(Math.PI-i/24*Math.PI)*1.65,12.25+Math.sin(i/24*Math.PI)*1.65,-2.82)),new V(x+1.65,10.25,-2.82)];
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),56,.1,8,false),stone));box(.1,3.5,.14,oak,g,x,12,-2.78);box(3.3,.1,.14,oak,g,x,12.2,-2.77);box(3.65,.16,.55,stone,g,x,10.25,-2.7);
 }
 box(39,.38,20,stone,g,27,14.5,-12);const roofMat=w.mat('#4f656c','roof');
 for(const side of [-1,1]){const roof=box(39,.2,5.9,roofMat,g,27,16,-12+side*7);roof.rotation.x=side*.54;}
 box(39,.18,9.6,roofMat,g,27,17.45,-12);for(const side of [-1,1])for(let x=9;x<46;x+=1.3){const seam=box(.045,.035,5.9,metal,g,x,16.13,-12+side*7);seam.rotation.x=side*.54;}
 for(const x of [9,45]){box(.32,5.1,.28,stone,g,x,12,-2.8);box(.58,.2,.6,stone,g,x,14.6,-2.8);}
 // Frontage lamps, entry mat and terrace balustrade are deliberately low and open.
 for(const x of [15,27,39]){box(.16,.7,.14,metal,g,x,5.5,-2.2);cyl(.22,.28,.2,metal,g,x,5.92,-1.98);cyl(.16,.16,.08,china,g,x,5.78,-1.98);}
 box(4.6,.03,2.1,green,g,30,-.395,-1.6);
 for(const x of [9.5,46])for(const z of [8,15,22,29]){box(.08,1.15,.08,metal,g,x,-.46,z);box(.08,.065,7,oak,g,x,.15,z+3.4);}
 // Illuminated hospitality interior, counter, espresso machine and bakery case.
 box(23,1.5,2.5,oak,g,25,.4,-16.5);box(24,.16,3.1,stone,g,25,1.23,-16.5);box(23,.55,.04,green,g,25,.45,-15.22);
 box(3.6,1.25,1.2,metal,g,16,1.9,-16.4);box(3.7,.12,1.4,china,g,16,2.58,-16.4);for(const x of [14.9,16,17.1]){cyl(.13,.13,.55,metal,g,x,1.65,-15.75);box(.6,.055,.65,metal,g,x,1.29,-15.7);torus(.14,.025,metal,g,x,2.1,-15.77);}
 for(const x of [20,26,32]){box(5.4,.1,1.8,oak,g,x,1.45,-16.4);box(5.4,1.6,.05,glass,g,x,2.25,-15.49).castShadow=false;box(5.5,.05,1.85,glass,g,x,3.06,-16.4);for(const y of [1.54,2.2])box(5.3,.04,1.6,china,g,x,y,-16.4);}
 for(const x of [12,20,28,36,43]){cyl(.04,.04,1.2,metal,g,x,7.55,-11);const shade=new THREE.Mesh(new THREE.ConeGeometry(.68,.65,32),linen);shade.position.set(x,6.7,-11);g.add(shade);cyl(.46,.46,.05,new THREE.MeshStandardMaterial({color:'#fff0cf',emissive:'#ffd8a1',emissiveIntensity:.5}),g,x,6.39,-11);}
 const fill=new THREE.PointLight('#fff0d7',45,35,1.6);fill.position.set(27,5,-12);g.add(fill);
 // Food uses actual cup walls, handles, saucers, latte foam and layered pastry geometry.
 const cup=(p,x,y,z,tea=false)=>{cyl(.27,.23,.04,china,p,x,y,z);cyl(.155,.13,.24,china,p,x,y+.13,z);cyl(.139,.139,.014,tea?coffee:foam,p,x,y+.255,z);torus(.151,.017,china,p,x,y+.264,z,Math.PI/2);torus(.084,.022,china,p,x+.186,y+.14,z);if(!tea){for(let i=0;i<3;i++){const f=sphere(.04,china,p,x,y+.269,z-.06+i*.048,1.6,.09,1);f.rotation.y=i*.3;}}};
 const croissant=(p,x,y,z,scale=1)=>{const pastry=new THREE.Group();pastry.position.set(x,y,z);pastry.scale.setScalar(scale);p.add(pastry);for(let i=0;i<9;i++){const t=i/8*Math.PI,a=t-.5*Math.PI;const r=.1+.09*Math.sin(t);const roll=sphere(r,i%2?golden:bread,pastry,Math.sin(a)*.3,.08,Math.cos(a)*.19,1, .68,1.1);roll.rotation.y=-a;}return pastry};
 const plate=(p,x,y,z)=>{cyl(.39,.37,.035,china,p,x,y,z);torus(.35,.026,china,p,x,y+.019,z,Math.PI/2);};
 const breakfast=(p,x,y,z,type)=>{plate(p,x,y,z);if(type%3===0){croissant(p,x-.08,y+.05,z);sphere(.1,berry,p,x+.19,y+.1,z+.13,1,.6,1);}
 else if(type%3===1){box(.42,.065,.3,bread,p,x,y+.05,z);box(.4,.04,.3,golden,p,x,y+.105,z);box(.39,.035,.32,w.palette.leaf,p,x,y+.14,z);box(.41,.065,.3,golden,p,x,y+.19,z);}
 else {sphere(.22,china,p,x,y+.06,z,1,.13,.8);sphere(.085,golden,p,x+.02,y+.1,z,1,.28,1);box(.3,.04,.12,bread,p,x-.06,y+.07,z+.22);}
 box(.016,.015,.46,metal,p,x+.48,y+.03,z);box(.025,.014,.43,metal,p,x-.49,y+.03,z);for(let i=-1;i<=1;i++)box(.007,.013,.09,metal,p,x-.49+i*.015,y+.03,z-.22);
 };
 const chair=(p,x,z,angle=0)=>{const c=new THREE.Group();c.position.set(x,0,z);c.rotation.y=angle;p.add(c);box(.76,.1,.75,oak,c,0,-.18,0);box(.77,.16,.68,linen,c,0,-.07,0);for(const a of [-1,1])for(const b of [-1,1])box(.055,.78,.055,metal,c,a*.3,-.59,b*.29);box(.77,.68,.1,oak,c,0,.2,-.33);box(.62,.42,.055,linen,c,0,.25,-.27);};
 let tableCount=0;
 const dining=(x,z,indoor=false,variant=0)=>{const t=new THREE.Group();t.position.set(x,0,z);g.add(t);const y=.67;box(2.65,.16,1.65,oak,t,0,y,0);for(const a of [-1,1])for(const b of [-1,1])box(.09,1.7,.09,metal,t,a*1.08,-.23,b*.55);for(const a of [-1,1]){chair(t,a*1.9,0,a>0?-Math.PI/2:Math.PI/2);breakfast(t,a*.69,y+.105,0,variant+(a>0?1:0));cup(t,a*.7,y+.105,-.53,variant%2===0);cyl(.105,.085,.38,glass,t,a*.99,y+.3,.5);cyl(.084,.08,.24,juice,t,a*.99,y+.25,.5);box(.25,.016,.34,linen,t,a*1.1,y+.1,-.35);}
 cyl(.11,.09,.3,china,t,0,y+.24,0);for(let i=0;i<3;i++){cyl(.008,.008,.3,w.palette.leaf,t,(i-1)*.04,y+.48,0,6);sphere(.055,i%2?linen:terra,t,(i-1)*.05,y+.63,0,1,.6,1);}tableCount++;
 if(!indoor&&variant%2===0){cyl(.035,.045,4.65,metal,t,0,1.25,-1.35);const umbrella=new THREE.Mesh(new THREE.ConeGeometry(2.25,.65,48),linen);umbrella.position.set(0,3.5,-1.35);t.add(umbrella);torus(2.17,.026,terra,t,0,3.19,-1.35,Math.PI/2);}
 };
 for(const [x,z,i]of [[14,7,0],[24,7,1],[35,7,2],[43,12,3],[14,19,4],[25,19,5],[36,22,1],[43,25,2],[27,27,1]])dining(x,z,false,i);
 for(const [x,z,i]of [[13,-8,1],[22,-8,2],[34,-8,0],[41,-10,1]])dining(x,z,true,i);
 for(let i=0;i<15;i++){croissant(g,18.4+i%5*1.1,1.63+(i>=10?.67:0),-16.5+Math.floor(i/5)%2*.45,.8);}
 for(const x of [25,27,29]){cyl(.4,.4,.08,china,g,x,2.25,-16.3);cyl(.3,.3,.4,x===27?foam:bread,g,x,2.49,-16.3);cyl(.31,.31,.055,china,g,x,2.72,-16.3);sphere(.08,berry,g,x,2.8,-16.3);}
 // Oak bakery shelving, baguettes, chalk menu and open entrance.
 for(const y of [1.4,2.4,3.4]){box(5.6,.1,1.25,oak,g,40,y,-19);for(let i=0;i<5;i++){const loaf=sphere(.16,golden,g,38.2+i*.8,y+.21,-19,1,.9,3);loaf.rotation.y=.25;}}
 label('BAKERY',5.5,.7,40,4.45,-18.7);label('COFFEE · BRUNCH',8,.75,16,4.1,-20.75);
 box(2.4,3.4,.15,darkOak,g,8.5,.7,4);label('MENU',1.9,.48,8.5,1.65,4.1);label('COFFEE',1.9,.4,8.5,1,4.1);label('BREAKFAST',1.9,.4,8.5,.4,4.1);label('PASTRIES',1.9,.4,8.5,-.2,4.1);
 const restSign=label('REST STATION',6,1.05,12,3.3,8);w.restStationSign=restSign;restSign.material.transparent=true;for(const x of [9.3,14.7])box(.09,3.9,.09,metal,g,x,.84,8);w.restTitleAnchor=new V(12,3.3,8).applyMatrix4(g.matrixWorld.clone());
 for(const [x,z]of [[10,3],[44,3],[47,19],[10,25],[30,-1]]){box(1.7,.85,1.7,stone,g,x,-.67,z);for(let i=0;i<3;i++)w.shrub(g,x+(i-1)*.35,-.17,z,.7,false);}
 // Well proportioned neighbouring façades frame the café street.
 for(const [x,z,width,height]of [[-42,-38,13,16],[56,-18,13,18],[62,20,12,13]]){
 box(width,height,18,ivory,g,x,height/2-1.1,z);for(const y of [2.1,5.7,9.3,12.9])if(y<height-1){box(width+.25,.12,18.3,stone,g,x,y-1.6,z);for(let dx=-width/2+2;dx<width/2-1;dx+=3){box(1.9,2.4,.12,oak,g,x+dx,y,z+9.04);box(1.6,2.1,.06,glass,g,x+dx,y,z+9.12);box(.07,2.12,.09,ivory,g,x+dx,y,z+9.17);box(2.1,.15,.45,stone,g,x+dx,y-1.2,z+9.16);}}
 box(width+1,.38,19,stone,g,x,height-1,z);box(width+.5,.18,18.5,metal,g,x,height-.65,z);
 }
 for(const [x,z]of [[-9,-3],[55,1],[54,32],[-10,30]]){const p=w.at(w.restT,x,0,z);w.treeXY(p.x,p.z,1.8,0);}
 // New rails start exactly at the existing route endpoint.
 const route=new THREE.Group();route.userData.dynamic=true;route.visible=false;w.scene.add(route);w.restRail=route;
 const pts=Array.from({length:100},(_,i)=>w.restPath.getPointAt(i/99));const bed=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),100,2.7,6,false),w.palette.gravel);bed.scale.y=.1;bed.position.y=1.26;route.add(bed);
 for(const side of [-1.32,1.32]){const curve=new THREE.CatmullRomCurve3(Array.from({length:100},(_,i)=>w.at(w.restStart+(w.restT-w.restStart)*i/99,side,.04)));route.add(new THREE.Mesh(new THREE.TubeGeometry(curve,100,.09,8,false),w.palette.rail));}
 const n=Math.ceil(w.restPath.getLength()/1.25),ties=new THREE.InstancedMesh(new THREE.BoxGeometry(4.6,.2,.3),w.palette.darkWood,n),dummy=new THREE.Object3D();for(let i=0;i<n;i++){const f=w.frameAt(w.restStart+(w.restT-w.restStart)*i/(n-1));dummy.position.copy(f.p);dummy.position.y=1.17;dummy.rotation.set(0,f.angle,0);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}ties.castShadow=ties.receiveShadow=true;route.add(ties);
 for(let i=1;i<=7;i++){const t=w.restStart+(w.restT-w.restStart)*i/7,f=w.frameAt(t),pole=new THREE.Group();pole.position.copy(w.at(t,5.8));pole.rotation.y=f.angle;route.add(pole);cyl(.12,.18,9.5,metal,pole,0,3.9);box(8,.16,.14,metal,pole,-3.6,8.65);if(i<7){const a=w.at(t,0,8.4),b=w.at(w.restStart+(w.restT-w.restStart)*(i+1)/7,0,8.4),mid=a.clone().lerp(b,.5);mid.y-=.25;route.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a,mid,b),16,.018,6,false),metal));}}
 w.batchStatic(root);w.batchStatic(route);w.host.dataset.restTables=String(tableCount);w.host.dataset.restDestination='Swiss Grand Café';
}
