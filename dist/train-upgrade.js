// Continuous dark glazing, pearl bodywork and restrained metal detailing.
export function buildPremiumTrain(w,T){
 const pearl=new T.MeshPhysicalMaterial({color:'#edf0e9',roughness:.28,metalness:.16,clearcoat:.48,clearcoatRoughness:.22}),ink=new T.MeshPhysicalMaterial({color:'#101a20',roughness:.14,metalness:.32,clearcoat:1,clearcoatRoughness:.11,envMapIntensity:1.35}),green=new T.MeshStandardMaterial({color:'#315952',roughness:.32,metalness:.48}),trim=new T.MeshStandardMaterial({color:'#b4beb9',roughness:.25,metalness:.8}),under=new T.MeshStandardMaterial({color:'#222c2b',roughness:.72,metalness:.4}),roof=new T.MeshStandardMaterial({color:'#344843',roughness:.37,metalness:.5});
 w.trainGlass=ink;w.trainBody=pearl;
 for(let car=0;car<2;car++){
  const g=new T.Group();g.userData.dynamic=true;w.scene.add(g);w.cars.push(g);
  const box=(a,b,c,m,x=0,y=0,z=0)=>w.box(a,b,c,m,g,x,y,z);
  box(4.25,.6,14.15,under,0,.67);box(4.35,1.44,14.05,pearl,0,1.75);box(4.39,.22,14.09,green,0,1.42);
  box(4.46,.35,14.35,roof,0,4.41);box(4.39,.15,14.12,trim,0,4.17);
  for(const side of [-1,1]){
   for(const [z,len] of [[-6.1,1.75],[0,6.45],[6.1,1.75]]){
    box(.13,1.72,len,ink,side*2.2,3.31,z);
    // Flush seams stay dark so the window belt reads as one continuous surface.
    for(let p=z-len/2+1.75;p<z+len/2-.08;p+=1.75)box(.015,1.69,.027,under,side*2.274,3.31,p);
    box(.045,.055,len,trim,side*2.26,2.43,z);
   }
   for(const z of [-4.25,4.25])for(const dir of [-1,1]){
    const panel=new T.Group();panel.userData.dynamic=true;panel.position.set(side*2.2,0,z+dir*.47);g.add(panel);
    w.box(.13,1.29,.93,pearl,panel,0,1.79);w.box(.145,1.72,.93,ink,panel,0,3.31);w.box(.16,.22,.93,green,panel,0,1.42);w.box(.17,.30,.035,trim,panel,0,2.15,-dir*.32);w.doors.push({panel,z:z+dir*.47,dir});
   }
   box(.06,.04,12.4,trim,side*2.22,1.11);box(.14,.18,2.15,under,side*2.1,.97,-4.25);box(.14,.18,2.15,under,side*2.1,.97,4.25);
  }
  for(const sign of [-1,1]){
   const vertices=[],indices=[],n=32;
   for(let i=0;i<=n;i++){const x=-2.21+4.42*i/n,z=sign*(7.19-.31*Math.pow(x/2.21,4));vertices.push(x,2.45,z,x,4.16,z);if(i<n){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const windshield=new T.Mesh(geo,ink);windshield.material.side=T.DoubleSide;g.add(windshield);
   box(4.26,1.18,.22,pearl,0,1.85,sign*7.08);box(4.29,.22,.24,green,0,1.42,sign*7.1);
   box(3.78,.075,.055,trim,0,2.39,sign*7.24);
   const lamp=new T.MeshBasicMaterial({color:car===0&&sign===1?'#fff2d0':'#bf6456'});
   for(const x of [-1.57,1.57])box(.54,.105,.065,lamp,x,2.08,sign*7.22);
   // Two small wipers sit against the full-width curved front glass.
   for(const x of [-.8,.8]){const blade=box(.045,.48,.035,under,x,2.76,sign*7.23);blade.rotation.z=.20;}
  }
  for(const z of [-4.8,4.8]){box(3.2,.55,2.8,under,0,.38,z);for(const x of [-1.62,1.62])for(const dz of [-.85,.85]){const wheel=w.cyl(.52,.52,.29,under,g,x,.28,z+dz,32);wheel.rotation.z=Math.PI/2;wheel.userData.dynamic=true;w.wheels.push(wheel);}}
  const logo=w.text('MJM LINE',2.4,.32,'#315952','#f3ead7');logo.position.set(0,1.45,7.25);g.add(logo);
  box(2.8,.15,3.2,roof,0,4.64,-1);for(let j=0;j<10;j++)box(2.4,.07,.075,under,0,4.75,-2.35+j*.28);
  // A slim pantograph and flexible coupling complete the silhouette.
  w.beam(new T.Vector3(-.65,4.65,2),new T.Vector3(0,5.38,2),.045,trim,g);w.beam(new T.Vector3(0,5.38,2),new T.Vector3(.65,4.65,2),.045,trim,g);box(1.6,.06,.2,under,0,5.4,2);
  box(2.25,2.65,.46,under,0,2.3,-7.48);for(let k=0;k<6;k++)box(2.3,.055,.10,roof,0,1.15+k*.46,-7.73);
 }
 w.train=w.cars[0];w.headlight=new T.PointLight('#ffe6b1',0,25,2);w.headlight.position.set(0,2.1,7.3);w.train.add(w.headlight);
}
