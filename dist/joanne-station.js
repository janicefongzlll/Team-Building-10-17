// A sunset garden terminal with a clear foreground for the mentor character.
export function buildJoanneStation(w,T){
 const g=w.groupAt(w.joanneT);g.userData.dynamic=true;g.visible=false;w.joanneStation=g;
 const V=T.Vector3,box=(a,b,c,m,x=0,y=0,z=0)=>w.box(a,b,c,m,g,x,y,z),cyl=(a,b,h,m,x,y,z)=>w.cyl(a,b,h,m,g,x,y,z,32);
 const stone=w.mat('#e8ddc9','stone'),plaster=w.mat('#f4e9d4','plaster'),oak=w.mat('#a7845c','wood'),forest=w.mat('#244d44','paint'),roof=w.mat('#425c59','roof'),metal=new T.MeshStandardMaterial({color:'#bd985c',roughness:.3,metalness:.7}),glass=new T.MeshPhysicalMaterial({color:'#c1dce5',transparent:true,opacity:.25,roughness:.13,metalness:.12,depthWrite:false,side:T.DoubleSide}),warm=new T.MeshStandardMaterial({color:'#ffe6af',emissive:'#ffc575',emissiveIntensity:.8});
 // Two platforms leave the complete running track and camera corridor open.
 box(38,1.2,75,stone,23,-.75,0);box(12,1.2,75,stone,-10,-.75,0);
 for(const x of [-3.8,4.2])box(.20,.035,73,metal,x,-.12,0);
 for(const x of [-16,41.8]){box(.25,1.2,75,stone,x,.5,0);box(.42,.15,75,plaster,x,1.18,0);for(let z=-35;z<=36;z+=3){cyl(.07,.07,1.2,metal,x,.46,z);}}
 // Refined terminal behind the platform: stone arcade, tall glass windows, folded roof.
 box(30,.6,21,stone,24,.08,-17);box(28,8.4,.6,plaster,24,4.2,-26.5);box(.6,8.4,20,plaster,10,4.2,-17);box(.6,8.4,20,plaster,38,4.2,-17);
 for(const x of [11,17.5,24,30.5,37]){box(.55,8.8,.7,stone,x,4.3,-6.7);box(.95,.2,1.05,metal,x,8.5,-6.7);box(.95,.35,1.05,stone,x,.38,-6.7);}
 for(const x of [14.25,20.75,27.25,33.75]){box(5.8,6.8,.045,glass,x,4.2,-6.8).castShadow=false;for(const dx of [-2.6,0,2.6])box(.09,6.8,.11,forest,x+dx,4.2,-6.7);box(5.8,.09,.11,forest,x,3.5,-6.7);}
 for(const side of [-1,1]){const m=box(31,.32,12.2,roof,24,10.1,-17+side*5.5);m.rotation.x=side*.22;box(31,.14,.16,metal,24,8.89,-17+side*11.5);}
 box(31,1.25,.45,forest,24,8.85,-5.9);const sign=w.text('LEADERSHIP LINE',25,1.15,'#244d44','#fff4dc');sign.position.set(24,8.85,-5.65);g.add(sign);
 const plaque=w.text('MENTOR SHARING',12,.75,'#eee3cf','#244d44');plaque.position.set(24,7.55,-6.20);g.add(plaque);
 // Canopy and luggage benches stretch along the platform, not across the view of Joanne.
 for(const z of [-31,-18,-5,8]){cyl(.09,.13,6.5,forest,6.2,3.2,z);box(7.2,.17,13,roof,8.6,6.6,z);box(7.4,.09,.14,metal,8.6,6.68,z+6.4);}
 for(const [x,z]of [[17,9],[29,9],[34,20],[-12,-10]]){for(let j=0;j<5;j++)box(4.5,.11,.15,oak,x,.7,z+j*.2);box(4.5,.8,.15,oak,x,1.25,z-.05);for(const dx of [-1.7,1.7])box(.13,.9,.55,forest,x+dx,.25,z+.35);}
 for(const [x,z]of [[18,24],[34,26],[-12,-27],[36,-32]]){box(2.5,.8,2.5,stone,x,.25,z);for(let i=0;i<6;i++)w.shrub(g,x+(i%3-1)*.6,.7,z+(Math.floor(i/3)-.5)*.7,.85,false);}
 for(const x of [-14,40])for(const z of [-28,-10,10,31]){if(x===-14&&z===10)continue;cyl(.075,.15,5.1,forest,x,2.4,z);cyl(.22,.26,.45,warm,x,4.95,z);const cap=new T.Mesh(new T.ConeGeometry(.43,.3,6),forest);cap.position.set(x,5.34,z);g.add(cap);cyl(.21,.3,.12,metal,x,4.66,z);}
 // Cypresses and a distant terraced town provide depth without obstructing the train.
 for(const x of [47,55])for(const z of [-33,-16,2,21,38]){const scale=1.2+(z+33)%3*.2;cyl(.17,.25,3,oak,x,1.25,z);const profile=[new T.Vector2(.02,0),new T.Vector2(.68,.8),new T.Vector2(.9,2),new T.Vector2(.65,4),new T.Vector2(.28,6),new T.Vector2(.02,7.3)],tree=new T.Mesh(new T.LatheGeometry(profile,28),w.palette.leaf);tree.position.set(x,.45,z);tree.scale.setScalar(scale);tree.castShadow=tree.receiveShadow=true;g.add(tree);}
 for(let row=0;row<3;row++)for(let i=0;i<8;i++){const x=65+row*19,z=-70+i*20,h=5+(i*7+row*3)%11,m=[stone,plaster,oak][(i+row)%3];box(9,h,11,m,x,-3+h/2,z);box(9.7,.35,12,roof,x,-3+h,z);for(let y=0;y<h-2;y+=2.4)for(const dz of [-3,0,3])box(.025,1.1,1.2,glass,x-4.52,y-.8,z+dz);}
 const terrain=w.mat('#8c9b70','earth');box(200,.35,215,terrain,42,-2,0);
 // Same full-body rendered character format as the first mentor, with genuine alpha.
 const tx=new T.TextureLoader().load(typeof ANIMAL_TEXTURES==='undefined'?'assets/joanne-host.png':ANIMAL_TEXTURES['joanne-host'],()=>w.draw());tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=8;
 const host=new T.Sprite(new T.SpriteMaterial({map:tx,transparent:true,alphaTest:.035,depthWrite:false}));host.center.set(.5,.035);host.position.set(-14,-.11,10);host.scale.set(4.97,7.455,1);g.add(host);w.joanneHost=host;
 const floorShadow=new T.Mesh(new T.CircleGeometry(1.12,48),new T.MeshBasicMaterial({color:'#384035',transparent:true,opacity:.16,depthWrite:false}));floorShadow.rotation.x=-Math.PI/2;floorShadow.position.set(-14,-.105,10);floorShadow.scale.set(1,.5,1);g.add(floorShadow);
 const fill=new T.PointLight('#ffe3b8',55,48,1.7);fill.position.set(-8,10,19);g.add(fill);
 // Continue the same railway to the new terminal.
 const rail=new T.Group();rail.userData.dynamic=true;rail.visible=false;w.scene.add(rail);w.joanneRail=rail;
 const pts=Array.from({length:120},(_,i)=>w.joannePath.getPointAt(i/119));const bed=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),120,2.7,6,false),w.palette.gravel);bed.scale.y=.1;bed.position.y=1.26;rail.add(bed);
 for(const side of [-1.32,1.32]){const curve=new T.CatmullRomCurve3(Array.from({length:120},(_,i)=>w.at(w.joanneStart+(w.joanneT-w.joanneStart)*i/119,side,.04)));rail.add(new T.Mesh(new T.TubeGeometry(curve,120,.09,8,false),w.palette.rail));}
 const n=Math.ceil(w.joannePath.getLength()/1.25),ties=new T.InstancedMesh(new T.BoxGeometry(4.6,.2,.3),w.palette.darkWood,n),dummy=new T.Object3D();for(let i=0;i<n;i++){const f=w.frameAt(w.joanneStart+(w.joanneT-w.joanneStart)*i/(n-1));dummy.position.copy(f.p);dummy.position.y=1.17;dummy.rotation.set(0,f.angle,0);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);}ties.castShadow=ties.receiveShadow=true;rail.add(ties);
 for(let i=1;i<=8;i++){const t=w.joanneStart+(w.joanneT-w.joanneStart)*i/8,p=w.at(t,5.8),post=new T.Mesh(new T.CylinderGeometry(.12,.17,9.5,16),forest);post.position.copy(p).add(new V(0,3.9,0));rail.add(post);const cross=w.box(8,.15,.15,forest,rail);cross.position.copy(w.at(t,2.2,8.65));cross.rotation.y=w.frameAt(t).angle;if(i<8){const a=w.at(t,0,8.4),b=w.at(w.joanneStart+(w.joanneT-w.joanneStart)*(i+1)/8,0,8.4),mid=a.clone().lerp(b,.5);mid.y-=.2;rail.add(new T.Mesh(new T.TubeGeometry(new T.QuadraticBezierCurve3(a,mid,b),16,.018,6,false),forest));}}
 w.batchStatic(g);w.batchStatic(rail);w.host.dataset.joanneStation='LEADERSHIP LINE — MENTOR SHARING — JOANNE GOH';
}
