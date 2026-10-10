// Dimensional bakery joinery and lighting around the supplied fifteen-card artwork.
export function buildRecipeGallery(w,root,T,qualities,{oak,brass}){
 const g=new T.Group();g.position.set(28,.85,-37.5);g.scale.setScalar(.92);root.add(g);w.recipeGallery=g;
 const V=T.Vector3;
 const mat=(color,roughness=.48,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const green=new T.MeshPhysicalMaterial({color:'#19483b',roughness:.34,metalness:.08,clearcoat:.36,clearcoatRoughness:.3}),ivory=mat('#f6ead3',.72),gold=mat('#c8a257',.3,.65),edge=mat('#79582e',.6),tile=mat('#e9e4d7',.85),grout=mat('#c8c2b4'),navy=mat('#143446'),blue=mat('#2872b1',.35),red=mat('#d7413f',.37),yellow=mat('#eebd37',.36),leaf=mat('#44733b',.72),lightLeaf=mat('#739744',.65),skin=mat('#ebbb86',.55),white=mat('#fff9e8',.5),dark=mat('#263737'),black=mat('#172020'),warm=new T.MeshStandardMaterial({color:'#fff4cb',emissive:'#ffd48a',emissiveIntensity:.8});
 // Fine paint and oak grain prevent large surfaces from reading as flat colour.
 let seed=31137;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const grainCanvas=document.createElement('canvas');grainCanvas.width=512;grainCanvas.height=1024;const grain=grainCanvas.getContext('2d');grain.fillStyle='#ba9061';grain.fillRect(0,0,512,1024);
 for(let j=0;j<450;j++){const x=rand()*512;grain.beginPath();grain.moveTo(x,0);grain.bezierCurveTo(x+Math.sin(j)*13,340,x+Math.cos(j)*18,700,x,1024);grain.strokeStyle=j%4?'rgba(66,37,14,.13)':'rgba(255,223,158,.2)';grain.lineWidth=.35+rand()*1.5;grain.stroke();}
 const grainMap=new T.CanvasTexture(grainCanvas);grainMap.colorSpace=T.SRGBColorSpace;grainMap.anisotropy=8;
 const carvedOak=new T.MeshPhysicalMaterial({map:grainMap,bumpMap:grainMap,bumpScale:.028,roughness:.46,clearcoat:.18,clearcoatRoughness:.42});
 const enamelCanvas=document.createElement('canvas');enamelCanvas.width=enamelCanvas.height=512;const ec=enamelCanvas.getContext('2d');ec.fillStyle='#a5b4a8';ec.fillRect(0,0,512,512);for(let j=0;j<3500;j++){ec.fillStyle=j%2?'#899c921a':'#faffee13';ec.fillRect(rand()*512,rand()*512,1+rand()*5,1);}
 const enamelMap=new T.CanvasTexture(enamelCanvas);enamelMap.colorSpace=T.SRGBColorSpace;green.map=enamelMap;green.bumpMap=enamelMap;green.bumpScale=.014;
 gold.color.set('#d5ad62');gold.roughness=.26;gold.envMapIntensity=1.35;
 const mesh=(geo,m,p,x=0,y=0,z=0)=>{const a=new T.Mesh(geo,m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;p.add(a);return a;};
 const box=(a,b,c,m,p,x=0,y=0,z=0)=>mesh(new T.BoxGeometry(a,b,c),m,p,x,y,z);
 const ball=(r,m,p,x,y,z,sx=1,sy=1,sz=1)=>{const a=mesh(new T.SphereGeometry(r,24,16),m,p,x,y,z);a.scale.set(sx,sy,sz);return a;};
 const cyl=(a,b,h,m,p,x,y,z)=>mesh(new T.CylinderGeometry(a,b,h,28),m,p,x,y,z);
 const tube=(points,r,m,p)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new V(...a))),Math.max(24,points.length*5),r,8,false),m,p);
 const link=(a,b,r,m,p)=>{const av=new V(...a),bv=new V(...b),o=cyl(r,r,av.distanceTo(bv),m,p,...av.clone().lerp(bv,.5).toArray());o.quaternion.setFromUnitVectors(new V(0,1,0),bv.sub(av).normalize());return o;};
 const rounded=(width,height,r=.18)=>{const s=new T.Shape(),x=-width/2,y=-height/2;s.moveTo(x+r,y);s.lineTo(x+width-r,y);s.quadraticCurveTo(x+width,y,x+width,y+r);s.lineTo(x+width,y+height-r);s.quadraticCurveTo(x+width,y+height,x+width-r,y+height);s.lineTo(x+r,y+height);s.quadraticCurveTo(x,y+height,x,y+height-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;};
 const relief=(shape,depth,m,p,x=0,y=0,z=0,bevel=.04)=>mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:24,steps:1}),m,p,x,y,z);
 const panel=(a,b,d,m,p,x,y,z)=>relief(rounded(a,b,.16),d,m,p,x,y,z);
 const textPlane=(width,height,draw,p,x,y,z)=>{const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=Math.round(1536*height/width);draw(canvas.getContext('2d'),canvas.width,canvas.height);const tx=new T.CanvasTexture(canvas);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=8;const o=mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,toneMapped:false}),p,x,y,z);o.castShadow=false;return o;};
 // Individually coursed limestone tiles and substantial timber casing.
 box(38.5,19.4,.55,grout,g,0,10.6,0);
 for(let row=0;row<12;row++)for(let col=0;col<8;col++){const x=-18.8+col*5.35+(row%2?2.67:0);if(x>18.6)continue;box(Math.max(.2,Math.min(5.28,37.4-Math.abs(x)*2)),1.48,.09,tile,g,x,1.65+row*1.56,.31);}
 for(const x of [-19.15,19.15]){box(.65,20.3,.85,carvedOak,g,x,10.55,.5);box(.16,20,.24,gold,g,x-Math.sign(x)*.29,10.55,1.02);box(.18,19.8,.3,edge,g,x+Math.sign(x)*.2,10.55,1);}
 for(const y of [.65,19.55]){box(39,.7,.95,carvedOak,g,0,y,.57);box(38,.1,.22,gold,g,0,y+(y<10?.35:-.35),1.06);}
 // Curved crest, stepped shoulders and double gold moulding, built as layered extrusions.
 const crest=()=>{const s=new T.Shape();s.moveTo(-10.8,-1.3);s.lineTo(10.8,-1.3);s.quadraticCurveTo(11.35,-1.3,11.35,-.8);s.lineTo(11.35,.7);s.quadraticCurveTo(10.5,.7,10.15,1.25);s.lineTo(5.1,1.25);s.quadraticCurveTo(4.5,2,3.3,2);s.lineTo(2.45,2);s.bezierCurveTo(2.05,4.0,-2.05,4.0,-2.45,2);s.lineTo(-3.3,2);s.quadraticCurveTo(-4.5,2,-5.1,1.25);s.lineTo(-10.15,1.25);s.quadraticCurveTo(-10.5,.7,-11.35,.7);s.lineTo(-11.35,-.8);s.quadraticCurveTo(-11.35,-1.3,-10.8,-1.3);return s;};
 const sign=new T.Group();sign.position.set(0,19.35,.85);g.add(sign);
 for(const [scale,z,material]of [[1.025,0,edge],[1,.13,gold],[.976,.25,green],[.954,.3,gold],[.941,.36,green]]){const m=relief(crest(),.12,material,sign,0,0,z,.05);m.scale.set(scale,scale,1);}
 textPlane(20,1.6,(c,W,H)=>{c.textAlign='center';c.textBaseline='middle';c.font=`600 ${H*.77}px Georgia`;c.fillStyle='#0d2821';c.fillText('TEAM RECIPE',W/2+2,H*.52+3);c.fillStyle='#edd29a';c.fillText('TEAM RECIPE',W/2,H*.52);},sign,0,.45,.59);
 textPlane(17,.7,(c,W,H)=>{c.fillStyle='#fff4df';c.textAlign='center';c.textBaseline='middle';c.font=`600 ${H*.60}px Georgia`;c.fillText('W H A T  M A K E S  A  G R E A T  T E A M ?',W/2,H*.5);},sign,0,-.63,.59);
 for(const side of [-1,1]){link([side*8.2,-.65,.62],[side*10,-.65,.62],.022,gold,sign);ball(.07,gold,sign,side*8.1,-.65,.62);}
 // Chef's toque and crossed bakery utensils on the crest.
 panel(1.12,.52,.13,white,sign,0,2.08,.57);for(const [x,y,r]of [[-.45,2.65,.38],[0,2.87,.46],[.45,2.65,.38]])ball(r,white,sign,x,y,.67,1,1,.45);
 for(const x of [-.3,0,.3])link([x,2.07,.79],[x,2.64,.8],.016,ivory,sign);
 link([-.75,1.54,.68],[.68,2.0,.68],.045,gold,sign);link([.75,1.54,.7],[-.65,2.0,.7],.045,gold,sign);ball(.16,gold,sign,.77,2.02,.68,1.4,.7,.22);
 for(let i=0;i<3;i++)link([-.68+i*.08,1.96,.71],[-.79+i*.08,2.17,.71],.021,gold,sign);
 // Carved wooden scrolls sit behind the sign's shoulders.
 for(const side of [-1,1]){const pts=[];for(let i=0;i<=48;i++){const t=i/48*Math.PI*3,r=.55*(1-i/65);pts.push([side*(6+Math.cos(t)*r),21.2+Math.sin(t)*r,.85]);}tube(pts,.085,carvedOak,g);}
 // Keep the exact supplied fifteen-card artwork inside the dimensional architecture.
 // UV cropping isolates the cards without resampling or modifying the original image.
 const artworkTexture=new T.TextureLoader().load(typeof ANIMAL_TEXTURES==='undefined'?'assets/team-qualities.png':ANIMAL_TEXTURES['team-qualities'],()=>w.draw?.());
 artworkTexture.colorSpace=T.SRGBColorSpace;artworkTexture.anisotropy=8;
 artworkTexture.repeat.set(1393/1669,651/942);artworkTexture.offset.set(144/1669,79/942);
 const artworkWidth=36.2,artworkHeight=artworkWidth*651/1393;
 panel(artworkWidth+.21,artworkHeight+.21,.10,gold,g,0,9.8,.50);
 const artwork=mesh(new T.PlaneGeometry(artworkWidth,artworkHeight),new T.MeshBasicMaterial({map:artworkTexture,toneMapped:false}),g,0,9.8,.68);artwork.castShadow=false;
 // Cupped, tapered ivy leaves have varied angles, sizes and warm new growth.
 const leafPositions=[],leafIndices=[];for(let row=0;row<=12;row++){const t=row/12,half=Math.pow(Math.sin(t*Math.PI),.7)*.32;for(let col=0;col<=4;col++){const q=col/2-1;leafPositions.push(q*half,t-.5,.09*Math.sin(t*Math.PI)*(1-Math.abs(q))+.08*t*t);if(row<12&&col<4){const k=row*5+col;leafIndices.push(k,k+1,k+5,k+1,k+6,k+5);}}}
 const leafGeo=new T.BufferGeometry();leafGeo.setAttribute('position',new T.Float32BufferAttribute(leafPositions,3));leafGeo.setIndex(leafIndices);leafGeo.computeVertexNormals();
 const leafMaterials=['#2b5428','#4b7733','#7e9944','#b0a758'].map(color=>new T.MeshStandardMaterial({color,roughness:.63,side:T.DoubleSide}));
 const ivyLeaf=(x,y,z,size,angle)=>{const o=mesh(leafGeo,leafMaterials[Math.min(3,Math.floor(rand()*3.6))],g,x,y,z);o.scale.setScalar(size);o.rotation.set((rand()-.5)*.7,(rand()-.5)*.9,angle);};
 for(const side of [-1,1])for(let strand=0;strand<4;strand++){
  const count=18+Math.floor(rand()*19),pts=[];const start=19.5+rand()*.65;
  for(let j=0;j<count;j++){const y=start-j*.50,x=side*(18.9+strand*.12+Math.sin(j*.43+strand)*.32),z=1.22+Math.sin(j*.5)*.1;pts.push([x,y,z]);for(const k of [-1,1])if(rand()>.15)ivyLeaf(x+k*.23,y-.1-rand()*.1,z+.13,.46+rand()*.38,k*.65+rand()*.45);}
  tube(pts,.02,leaf,g);
 }
 for(const side of [-1,1]){const pts=[];for(let j=0;j<43;j++){const x=side*(11.5+j*.175),y=19.96+Math.sin(j*.52)*.14;pts.push([x,y,1.12]);ivyLeaf(x,y+.12,1.23,.48+rand()*.3,rand()*2-1);if(j%3===0)ivyLeaf(x,y-.2,1.3,.5+rand()*.24,2+rand());}tube(pts,.022,leaf,g);}
 // Double mouldings, warm inset strips and carved corner rosettes complete the surround.
 for(const x of [-19.4,19.4]){box(.09,19.8,.10,gold,g,x,10.55,1.05);box(.07,18.9,.045,warm,g,x-Math.sign(x)*.88,10.5,.70);}
 for(const y of [.88,19.27])box(37.7,.07,.12,gold,g,0,y,1.05);
 for(const x of [-18.75,18.75])for(const y of [1.05,19.6]){for(let j=0;j<8;j++){const a=j*Math.PI/4,o=ball(.12,gold,g,x+Math.sin(a)*.17,y+Math.cos(a)*.17,1.14,.62,1.5,.4);o.rotation.z=-a;}ball(.10,edge,g,x,y,1.18,1,1,.3);}
 // Two enamel pendants and their warm diffusers frame the sign.
 for(const x of [-15,15]){cyl(.055,.055,2.3,dark,g,x,22.1,2.1);const pts=[new T.Vector2(.15,0),new T.Vector2(.32,-.15),new T.Vector2(.64,-.36),new T.Vector2(1.08,-.87),new T.Vector2(1.15,-1.02)];mesh(new T.LatheGeometry(pts,48),green,g,x,21.3,2.1);cyl(1.14,1.14,.055,gold,g,x,20.28,2.1);ball(.35,warm,g,x,20.18,2.1,1,.65,1);const light=new T.PointLight('#ffe8c3',30,13,1.8);light.position.set(x,19.9,3);g.add(light);}
 w.host.dataset.recipeGalleryArtwork='supplied-fifteen-card-image';w.host.dataset.recipeReliefs='0';
 return g;
}
