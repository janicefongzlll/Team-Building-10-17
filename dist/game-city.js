// Environment-only art direction. All camera splines and presentation states remain in world/timeline.
export function buildGameCity(w,g,THREE){
 const V=THREE.Vector3,C=THREE.Color,box=(...a)=>w.box(...a),mat=(c,k='stone')=>w.mat(c,k);
 let seed=81937;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const hash=(x,z)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453123;return n-Math.floor(n)};
 const noise=(x,z)=>{const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);return (hash(a,b)*(1-u)+hash(a+1,b)*u)*(1-v)+(hash(a,b+1)*(1-u)+hash(a+1,b+1)*u)*v};
 const fbm=(x,z)=>noise(x,z)*.55+noise(x*2.07,z*2.07)*.27+noise(x*4.13,z*4.13)*.13+noise(x*8.31,z*8.31)*.05;
 const inverse=g.matrixWorld.clone().invert();g.updateWorldMatrix(true,false);inverse.copy(g.matrixWorld).invert();
 const rail=Array.from({length:240},(_,i)=>w.frameAt(1.43+(w.gameStart+w.gameSpan-1.43)*i/239).p.applyMatrix4(inverse));
 const views=Array.from({length:90},(_,i)=>[w.gameCameraCurve.getPoint(i/89).applyMatrix4(inverse),w.frameAt(1.45+.75*i/89).p.applyMatrix4(inverse)]);
 const clear=(x,z,width,depth,height=1)=>{const inside=(p,margin)=>Math.abs(p.x-x)<width/2+margin&&Math.abs(p.z-z)<depth/2+margin;
  if(rail.some(p=>inside(p,5)))return false;
  return !views.some(([a,b])=>{for(let j=0;j<=36;j++){const p=a.clone().lerp(b,j/36);if(p.y<height+3&&inside(p,2))return true}return false});};
 const paving=mat('#bac8c4'),kerb=mat('#d6d9cc'),road=mat('#657878'),slate=mat('#42606a','roof'),stone=mat('#e2e2d4'),glass=w.windowGlass.clone(),trim=w.limestone,coral=mat('#bd7962','paint');
 glass.color.set('#ffe4af');glass.emissive.set('#ffbf70');glass.emissiveIntensity=0;w.gameWindowGlass=glass;
 const furniture=new THREE.Group();furniture.position.y=-1.78;g.add(furniture);const bench=(x,z)=>w.bench(furniture,x,z);
 const streetFurniture=new THREE.Group();streetFurniture.position.y=-1.1;g.add(streetFurniture);
 const tree=(x,z,size=1.7)=>{if(!clear(x,z,size*3,size*3,size*5))return;const p=w.at(w.gameT,x,0,z);w.treeXY(p.x,p.z,size,random()>.7?2:0)};
 const hedge=(x,z,width=2)=>{if(!clear(x,z,width,2,1.8))return;box(width,.35,1.7,kerb,g,x,-.86,z);for(let i=0;i<Math.ceil(width/1.3);i++)w.shrub(g,x-width/2+.7+i*1.3,-.65,z,.65,false)};
 // Boulevards divide actual districts; cream pedestrian crossings continue the paving.
 const street=(x,z,width,depth)=>{box(width,.045,depth,road,g,x,-1.06,z);for(const side of [-1,1]){if(depth>width){box(.22,.16,depth,kerb,g,x+side*(width/2+.1),-1.05,z);box(1.8,.06,depth,paving,g,x+side*(width/2+1.1),-1.075,z)}else{box(width,.16,.22,kerb,g,x,-1.05,z+side*(depth/2+.1));box(width,.06,1.8,paving,g,x,-1.075,z+side*(depth/2+1.1))}}
  if(depth>width)for(let zz=z-depth/2+2;zz<z+depth/2;zz+=7)box(.1,.015,2,stone,g,x,-1.025,zz);else for(let xx=x-width/2+2;xx<x+width/2;xx+=7)box(2,.015,.1,stone,g,xx,-1.025,z);};
 street(55,20,4.3,112);street(18,8,4.3,110);
 street(70,-28,110,4.3);street(72,62,108,4.3);street(121,4,4.3,190);
 // Foreground cafés share a promenade and pocket gardens rather than isolated grass plots.
 box(3,.05,93,paving,g,-15,-1.075,-20);box(31,.05,2.5,paving,g,-29,-1.065,-43);box(23,.05,2.5,paving,g,-25,-1.065,-1);box(16,.05,2.5,paving,g,-23,-1.065,27);
 for(const [x,z]of [[55,-28],[55,62],[121,-28],[121,62]])for(let i=-2;i<=2;i++){box(.4,.015,3.6,stone,g,x+i*.7,-1.005,z);box(3.6,.015,.4,stone,g,x,-1.005,z+6+i*.7)}
 // European perimeter buildings: masonry reveals, cornices, shopfronts and mansard roofs.
 let buildings=0;
 const building=(x,z,width,depth,height,variant=0)=>{if(!clear(x,z,width,depth,height))return;const b=new THREE.Group();b.userData.cityBlock=true;b.position.set(x,-1.09,z);g.add(b);buildings++;const wall=mat(['#d8dfd3','#cfbda6','#e4e2d4','#b1c3c3','#c5cfbe'][variant%5],'plaster');
  box(width,height,depth,wall,b,0,height/2);box(width+.35,.3,depth+.35,trim,b,0,.15);const floors=Math.max(2,Math.round(height/3)),dy=height/floors;
  for(let level=0;level<floors;level++){const y=dy*(level+.5);box(width+.28,.12,depth+.28,trim,b,0,(level+1)*dy);for(const side of [-1,1]){
   for(let xx=-width/2+1.15;xx<width/2-.65;xx+=2.3){const h=level?dy*.58:dy*.76;box(1.45,h,.14,w.charcoal,b,xx,y,side*(depth/2+.02));box(1.19,h-.15,.08,glass,b,xx,y,side*(depth/2+.11));box(1.7,.14,.45,trim,b,xx,y-h/2,side*(depth/2+.17));for(const dx of [-.7,.7])box(.12,h+.14,.19,trim,b,xx+dx,y,side*(depth/2+.15));box(.055,h,.13,w.steel,b,xx,y,side*(depth/2+.18));
    if(level===0){box(1.9,.1,1.15,variant%2?coral:slate,b,xx,dy-.25,side*(depth/2+.5));box(1.9,.25,.11,variant%2?coral:slate,b,xx,dy-.37,side*(depth/2+1.05))}else if(variant%3===0){box(1.75,.11,.7,w.granite,b,xx,y-h/2-.12,side*(depth/2+.3));box(1.65,.55,.035,w.steel,b,xx,y-h/2+.2,side*(depth/2+.62));for(let k=-2;k<=2;k++)box(.035,.55,.05,w.steel,b,xx+k*.29,y-h/2+.2,side*(depth/2+.63))}}
   for(let zz=-depth/2+1.1;zz<depth/2-.65;zz+=2.35){box(.12,dy*.62,1.45,w.charcoal,b,side*(width/2+.02),y,zz);box(.1,dy*.53,1.2,glass,b,side*(width/2+.1),y,zz);box(.35,.13,1.6,trim,b,side*(width/2+.16),y-dy*.3,zz)}}}
  for(const side of [-1,1])box(.34,height,.34,trim,b,side*(width/2-.1),height/2,depth/2+.06);
  box(width+.55,.3,depth+.55,trim,b,0,height+.05);
  if(variant%2){for(const side of [-1,1]){const r=box(width/2+.45,.19,depth+.5,slate,b,side*width/4,height+width*.13);r.rotation.z=-side*.44}box(.22,.25,depth+.5,slate,b,0,height+width*.25);for(const xx of [-width*.25,width*.25]){box(1.15,1.6,1.1,wall,b,xx,height+1,depth*.27);box(.78,1,.1,glass,b,xx,height+1.1,depth*.27+.57);box(1.45,.15,1.5,slate,b,xx,height+1.83,depth*.27)}}else{box(width-.55,.2,depth-.55,slate,b,0,height+.28);for(const side of [-1,1])box(.15,.65,depth+.2,wall,b,side*width/2,height+.45)}
  box(.8,1.4,.8,stone,b,-width*.22,height+1.25,-depth*.23);
  if(height<9){const sign=w.text(['CAFÉ','ATELIER','BOOKS','MARKET'][variant%4],width*.72,.7,'#fff3dc','#365853');sign.position.set(0,dy-.7,depth/2+.2);b.add(sign)}
 };
 const blocks=[[104,-91,10,9,8,1],[122,-64,10,8,9,3],[130,-20,10,9,8,2],[131,31,10,9,9,1],[117,83,11,8,8,3],[42,-108,12,8,6,1],[-35,-36,12,9,6,1],[-38,5,10,8,5,1]];
 blocks.forEach(a=>building(...a));
 // Additional centrepieces complete the cultural and financial districts.
 const extra=[['colosseum',88,-87,19],['taipei-101',129,-52,16],['sagrada-familia',111,38,17],['acropolis',71,102,18]];
 for(const [name,x,z,size]of extra){w.placeLandmark(name,x,z,size,g);box(size+4,.07,size*.85+4,paving,g,x,-1.1,z);}
 // Foreground promenade and pocket parks, with the train's sightline kept open.
 const park=(x,z,width,depth)=>{box(width,.1,depth,paving,g,x,-1.13,z);box(width-1.8,.12,depth-1.8,mat('#71956c','earth'),g,x,-1.09,z);box(width,.05,1.7,kerb,g,x,-.99,z);box(1.7,.05,depth,kerb,g,x,-.98,z);
  for(const side of [-1,1]){hedge(x+side*(width/2-1.2),z,1.4);tree(x+side*(width/2-2),z-depth/2+2,1.5);tree(x+side*(width/2-2),z+depth/2-2,1.8)}if(clear(x,z,3,2,3))bench(x,z+depth*.25);};
 park(-24,16,22,22);park(43,20,17,26);park(97,-37,17,19);
 // A raised civic square adds a second ground level without becoming a pedestal gallery.
 box(18,.55,16,kerb,g,69,-1.07,-14);box(17.5,.06,15.5,paving,g,69,-.79,-14);
 w.fountain(g,69,-14,2.7);for(const x of [63,75])bench(x,-10);
 for(const [x,z]of [[-18,-43],[-15,-3],[25,-29],[40,-28],[68,-28],[91,-28],[40,10],[69,10],[100,10],[34,62],[66,62],[99,62],[118,35]]){if(!clear(x,z,1,1,6))continue;w.lamp(streetFurniture,x,z);hedge(x+2,z+3,3)}
 for(const [x,z]of [[28,-21],[34,57],[48,68],[62,-39],[97,28],[111,52],[-34,33],[-41,-20],[138,-82],[139,-14],[137,65]])tree(x,z,1.5+random()*.7);
 // Physically mounted Chance information kiosk, property edge tiles and rental bikes.
 if(clear(28,26,2,2,3)){box(1.8,2.9,.65,slate,g,28,.36,26);const chance=w.text('?',1.2,1.6,'#f7ecd4','#c48268');chance.position.set(28,.8,26.34);g.add(chance)}
 for(let i=0;i<4;i++)w.bicycle(furniture,25+i*1.5,-9,['#527b77','#b47860','#667c91','#859a73'][i]);
 for(const [x,z]of [[-30,-44],[-25,-22],[31,5],[72,5]]){if(!clear(x,z,4,4,3))continue;w.cyl(.85,.85,.12,stone,g,x,.05,z,24);w.cyl(.06,.15,1.1,w.steel,g,x,-.56,z,10);for(const side of [-1,1]){box(.7,.1,.7,mat('#8f785f','wood'),g,x+side*1.3,-.45,z);box(.7,.8,.1,w.steel,g,x+side*1.3,-.05,z+.3);for(const dx of [-.26,.26])box(.05,.6,.05,w.steel,g,x+side*1.3+dx,-.79,z)}w.cyl(.055,.055,2.3,w.steel,g,x,.15,z,12);const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.8,.65,24),mat('#e1d7bf','paint'));canopy.position.set(x,1.45,z);g.add(canopy)}
 for(const [x,z,c]of [[121,-16,'#e6ddd0'],[55,46,'#70868f']]){if(!clear(x,z,2.2,4,2))continue;const car=new THREE.Group();car.position.set(x,-.85,z);g.add(car);box(1.9,.55,3.6,mat(c,'metal'),car,0,.37);box(1.55,.65,1.9,glass,car,0,.92,-.1);box(1.65,.1,2,mat(c,'metal'),car,0,1.27,-.1);for(const side of [-1,1])for(const zz of [-1.05,1.05]){const tyre=w.cyl(.33,.33,.22,w.palette.black,car,side*.99,.26,zz,16);tyre.rotation.z=Math.PI/2}for(const xx of [-.63,.63])box(.35,.16,.03,stone,car,xx,.5,1.82)}
 for(const [x,z,colour]of [[43,-36,'#64a6b2'],[70,-5,'#c98c71'],[43,61,'#bea86c'],[68,44,'#6d9c89'],[81,-36,'#9697aa'],[95,26,'#65a2af']])for(let i=0;i<4;i++)box(1.1,.045,1.6,mat(colour,'paint'),g,x+i*1.25,-1.01,z);
 // Alpine scenery is true terrain geometry, with fractal gullies, snow lines and distant layers.
 const alpine=new THREE.Group();alpine.userData.dynamic=true;alpine.visible=false;w.scene.add(alpine);w.gameAlpine=alpine;const center=w.frameAt(w.gameT).p;
 const terrainGeo=new THREE.PlaneGeometry(1200,1150,100,100);terrainGeo.rotateX(-Math.PI/2);const tp=terrainGeo.attributes.position;for(let i=0;i<tp.count;i++){const x=tp.getX(i),z=tp.getZ(i),r=Math.hypot(x,z);tp.setY(i,-1+smooth((r-150)/130)*(fbm(x*.025,z*.025)*19-3))}terrainGeo.computeVertexNormals();const landMaterial=mat('#719469','earth').clone();landMaterial.map=landMaterial.map.clone();landMaterial.map.repeat.set(72,70);landMaterial.transparent=true;const land=new THREE.Mesh(terrainGeo,landMaterial);land.position.set(center.x,-.12,center.z);land.receiveShadow=true;alpine.add(land);
 const mountainMaterials=[];for(let layer=0;layer<3;layer++){const positions=[],colours=[],indices=[],segments=360,rows=45;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;const peaks=[[.18,95,.26],[1.18,135,.22],[2.42,108,.3],[3.4,142,.24],[4.5,125,.29],[5.6,110,.23]];const massif=Math.max(...peaks.map(([angle,height,width])=>{let d=Math.abs(a-angle-layer*.15);d=Math.min(d,Math.PI*2-d);return height*Math.exp(-d*d/(width*width))}));const peak=38+layer*15+massif+noise(i*.047,layer*17)*15;for(let j=0;j<=rows;j++){const t=j/rows,r=395+layer*135+t*185,xx=Math.sin(a)*r,zz=Math.cos(a)*r;
   const ridge=Math.pow(Math.sin(t*Math.PI),1.05),fold=fbm(xx*.04,zz*.04),gully=Math.abs(noise(xx*.11,zz*.11)-.5),h=4+ridge*peak*(.63+.5*fold)+gully*ridge*23;
   positions.push(center.x+xx,h-4,center.z+zz);const c=new C(layer===0?'#59785f':layer===1?'#849ba9':'#a6bac7');c.lerp(new C('#71828b'),smooth((h-22)/45));const snow=smooth((h-(72+noise(xx*.035,zz*.035)*25))/10);c.lerp(new C('#eef3ef'),snow);c.multiplyScalar(.85+fold*.3);c.lerp(new C('#b4cbd5'),layer*.12);colours.push(c.r,c.g,c.b);if(i<segments&&j<rows){const n=i*(rows+1)+j;indices.push(n,n+1,n+rows+1,n+1,n+rows+2,n+rows+1)}}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));geo.setIndex(indices);geo.computeVertexNormals();const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide,transparent:true,opacity:1,depthWrite:true});mountainMaterials.push(m);const mesh=new THREE.Mesh(geo,m);mesh.receiveShadow=true;alpine.add(mesh)}
 // Soft, irregular cloud banks use a textured volume impression rather than repeated spheres.
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=320;const ctx=canvas.getContext('2d');for(let pass=0;pass<3;pass++)for(let i=0;i<75;i++){const x=100+random()*560,y=125+(random()-.5)*75,r=22+random()*65;const gradient=ctx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,pass===0?'rgba(137,164,181,.14)':'rgba(252,253,247,.24)');gradient.addColorStop(.62,pass===0?'rgba(147,171,187,.12)':'rgba(252,253,247,.17)');gradient.addColorStop(1,'rgba(250,253,250,0)');ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,r*2,r*2)}const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const cloudMaterials=[];for(let i=0;i<5;i++){const m=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,fog:true}),cloud=new THREE.Sprite(m),a=i/5*Math.PI*2;cloud.position.set(center.x+Math.sin(a)*330,142+(i%3)*18,center.z+Math.cos(a)*330);cloud.scale.set(110+i%3*19,47+i%2*9,1);alpine.add(cloud);cloudMaterials.push(m)}
 w.gameAlpineMaterials=[landMaterial,...mountainMaterials,...cloudMaterials];w.host.dataset.gameLandmarks='12';w.host.dataset.gameDistrictBuildings=String(buildings);
}
