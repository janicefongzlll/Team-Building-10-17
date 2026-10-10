// Interior finishes and architectural lighting, kept outside the existing camera corridor.
export function finishBakery(w,root,T,{oak,marble,brass,navy}){
 const g=new T.Group();g.name='Bakery architectural finishes';root.add(g);
 const box=(a,b,c,m,x,y,z)=>w.box(a,b,c,m,g,x,y,z);
 let seed=17031;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const parchment=new T.MeshStandardMaterial({color:'#eae2cf',roughness:.73}),enamel=new T.MeshPhysicalMaterial({color:'#244b40',roughness:.32,clearcoat:.3,clearcoatRoughness:.38}),bronze=new T.MeshStandardMaterial({color:'#bb9458',metalness:.73,roughness:.29});
 const glow=new T.MeshStandardMaterial({color:'#fff1cc',emissive:'#ffdba0',emissiveIntensity:.65,roughness:.4});
 // Oak parquet has individual boards, tight joints and subtle grain rather than broad stripes.
 const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d');ctx.fillStyle='#87735b';ctx.fillRect(0,0,1024,1024);
 for(let row=0;row<16;row++)for(let col=-1;col<5;col++){const x=col*256+(row%3)*85,y=row*64,t=rand();ctx.fillStyle=`rgb(${155+t*23|0},${126+t*19|0},${88+t*16|0})`;ctx.fillRect(x+1,y+1,254,62);for(let j=0;j<26;j++){ctx.beginPath();ctx.moveTo(x,y+2+j*2.25);ctx.bezierCurveTo(x+85,y+j*2.25+rand()*5,x+160,y+j*2.25-rand()*5,x+256,y+j*2.25);ctx.strokeStyle=j%3?'rgba(65,41,20,.075)':'rgba(253,229,185,.15)';ctx.lineWidth=.5+rand();ctx.stroke();}}
 const woodMap=new T.CanvasTexture(c);woodMap.colorSpace=T.SRGBColorSpace;woodMap.wrapS=woodMap.wrapT=T.RepeatWrapping;woodMap.repeat.set(3,4);woodMap.anisotropy=8;
 const floor=new T.MeshPhysicalMaterial({map:woodMap,bumpMap:woodMap,bumpScale:.018,roughness:.46,metalness:.025,clearcoat:.2,clearcoatRoughness:.42});
 const ground=new T.Mesh(new T.PlaneGeometry(42.5,58.5),floor);ground.rotation.x=-Math.PI/2;ground.position.set(28,-.516,-10);ground.receiveShadow=true;g.add(ground);
 for(const x of [7.4,48.6]){box(.20,.035,57,bronze,x,-.49,-10);box(.65,.04,57,oak,x+(x<28?.52:-.52),-.48,-10);}
 for(const z of [-38.3,18.3])box(41,.035,.17,bronze,28,-.49,z);
 // Fluted timber pilasters and limestone plinths articulate the glass hall.
 for(const x of [6.5,49.5])for(const z of [-37,-25,-13,-1,11]){
  box(.8,1.25,.9,parchment,x,.05,z);box(.94,.16,1.04,marble,x,.73,z);
  box(.45,20,.54,oak,x,11,z);for(const dz of [-.20,0,.20])box(.065,19,.035,bronze,x+(x<28?.245:-.245),11,z+dz);
  box(1.0,.22,1.1,oak,x,20.95,z);box(.87,.12,.9,bronze,x,21.12,z);
 }
 for(const x of [6.65,49.35]){box(.28,.85,58,enamel,x,-.02,-10);box(.32,.08,58,bronze,x,.47,-10);box(.26,.35,58,oak,x,20.8,-10);box(.08,.07,57,glow,x+(x<28?.2:-.2),20.55,-10);}
 // Rounded cornice and warm hidden light behind the display wall.
 for(const y of [21.6,21.92]){box(43,.26,.7,oak,28,y,-39.1);box(42.9,.05,.1,bronze,28,y-.15,-38.73);}
 box(42,.07,.07,glow,28,21.3,-38.72);
 for(const x of [7.2,48.8]){box(.7,21,.65,oak,x,10,-38.9);box(.09,20.6,.08,bronze,x+(x<28?.36:-.36),10,-38.48);}
 // The pastry bench gets brass reveals and fluted cabinet fronts.
 for(let i=0;i<42;i++)box(.085,1.29,.055,oak,13.88+i*.25,.45,-.435);
 for(const y of [-.11,1.25])box(10.42,.045,.07,bronze,19,y,-.41);
 box(10.5,.035,.04,bronze,19,1.40,-.34);
 // Low display lighting sits underneath shelves and inside the glass cake cabinets.
 for(const z of [-15,-9,-3,3])for(const y of [3,5])box(4.28,.035,.06,glow,8.8,y-.14,z+.8);
 for(const [x,z,width]of [[13,6,10],[42,-1,10],[12,-21,9]]){box(width-.4,.045,.06,glow,x,2.78,z-1.55);box(width-.3,.04,.08,bronze,x,1.20,z+2.03);}
 // Pool lights complement daylight; they do not require extra shadow-map passes.
 for(const [x,z,color,intensity]of [[18,-5,'#fff0d6',65],[42,-6,'#e8f4ff',45],[28,-34,'#fff3df',65]]){const light=new T.PointLight(color,intensity,30,1.7);light.position.set(x,13,z);g.add(light);}
 w.host.dataset.bakeryFinish='Oak parquet, fluted joinery, brass reveals, enamel and warm display lighting';
}
