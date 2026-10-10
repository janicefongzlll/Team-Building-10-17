// The last stop reprises MJM Central, with a complete terminal track.
export function buildFinalStation(w,T){
 const V=T.Vector3,g=w.buildStation(w.finalT,'MJM CENTRAL',false,'08');g.userData.dynamic=true;g.visible=false;w.finalStation=g;
 const forest=w.mat('#244d44','paint'),stone=w.mat('#91a47e','earth');
 w.box(210,.4,210,stone,g,20,-1.8,0);
 const rail=new T.Group();rail.userData.dynamic=true;rail.visible=false;w.scene.add(rail);w.finalRail=rail;
 const start=w.frameAt(w.finalStart),length=w.finalPath.getLength(),end=length+48,track=w.groupAt(w.finalStart);rail.add(track);
 const box=(a,b,c,m,x,y,z)=>w.box(a,b,c,m,track,x,y,z);
 // Ballast sits below the sleepers instead of concealing the running rails.
 box(7.2,1.35,end+1,stone,0,-1.125,(end-1)/2);
 box(5.9,.2,end+1,w.palette.gravel,0,-.35,(end-1)/2);
 const railParts=[];
 for(const side of [-1.32,1.32]){
  railParts.push(box(.23,.045,end+1,w.palette.rail,side,-.10,(end-1)/2));
  railParts.push(box(.055,.105,end+1,w.palette.rail,side,-.025,(end-1)/2));
  railParts.push(box(.145,.075,end+1,w.palette.rail,side,.06,(end-1)/2));
 }
 // Sleepers and fasteners continue through the platform and beyond the parked train.
 const pitch=1.05,n=Math.floor(end/pitch)+1,dummy=new T.Object3D(),ties=new T.InstancedMesh(new T.BoxGeometry(4.6,.20,.28),w.palette.darkWood,n),clips=new T.InstancedMesh(new T.BoxGeometry(.23,.07,.17),forest,n*4);
 for(let i=0;i<n;i++){
  dummy.position.set(0,-.23,i*pitch);dummy.rotation.set(0,0,0);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);
  for(let j=0;j<4;j++){dummy.position.set((j<2?-1.32:1.32)+(j%2? .14:-.14),-.075,i*pitch);dummy.updateMatrix();clips.setMatrixAt(i*4+j,dummy.matrix);}
 }
 ties.castShadow=ties.receiveShadow=clips.castShadow=clips.receiveShadow=true;track.add(ties,clips);
 // Complete the first overhead span from Joanne; then continue into the terminal.
 const wirePoints=[w.at(w.finalStart,0,8.4)];
 for(let distance=28;distance<end;distance+=28){
  const p=start.p.clone().addScaledVector(start.tangent,distance),post=new T.Mesh(new T.CylinderGeometry(.12,.17,9.5,24),forest);post.position.copy(p).addScaledVector(start.side,5.8).add(new V(0,3.9,0));rail.add(post);
  const cross=w.box(8,.15,.15,forest,rail);cross.position.copy(p).addScaledVector(start.side,2.2).add(new V(0,8.65,0));cross.rotation.y=start.angle;
  for(const x of [-.8,.8]){const insulator=w.cyl(.18,.18,.22,w.palette.cream,rail,0,0,0,16);insulator.position.copy(p).addScaledVector(start.side,x).add(new V(0,8.5,0));}
  wirePoints.push(p.clone().add(new V(0,8.4,0)));
 }
 wirePoints.push(start.p.clone().addScaledVector(start.tangent,end).add(new V(0,8.4,0)));
 for(let i=1;i<wirePoints.length;i++){const a=wirePoints[i-1],b=wirePoints[i],mid=a.clone().lerp(b,.5);mid.y-=.22;rail.add(new T.Mesh(new T.TubeGeometry(new T.QuadraticBezierCurve3(a,mid,b),24,.022,8,false),forest));}
 // A proper buffer stop finishes the line well beyond the train's front.
 const stop=length+46,red=w.mat('#a85d4b','paint'),cream=w.mat('#eee6d2','paint');
 for(const x of [-1.32,1.32]){box(.24,1.1,.25,forest,x,.34,stop);w.beam(new V(x,-.12,stop-1.7),new V(x,.81,stop),.12,forest,track);}
 box(3.5,.38,.30,red,0,.85,stop);for(const x of [-1.2,0,1.2])box(.45,.39,.035,cream,x,.85,stop-.17);
 const verge=w.groupAt((w.finalStart+w.finalT)/2);rail.add(verge);w.box(120,.4,length+108,stone,verge,0,-1.8,48);
 w.finalTrackInfo={length,end,start:start.p.clone(),tangent:start.tangent.clone(),side:start.side.clone(),railParts,sleeperPitch:pitch,sleeperCount:n,bufferDistance:stop,wirePoints};
 w.batchStatic(g);w.batchStatic(rail);w.host.dataset.finalTrack='Continuous rails, sleepers, fasteners, ballast, catenary and terminal buffer';
}
