// Every station state is a pure, reversible function of scroll progress.
export const clamp01 = x => Math.max(0, Math.min(1, x));
export const smooth = x => {x=clamp01(x);return clamp01(x*x*x*(x*(x*6-15)+10))};
// Integrate a cosine acceleration ramp: steady cruise, zero speed at both ends.
const cruiseEase=t=>{t=clamp01(t);const ramp=.18;if(t<ramp){const u=t/ramp;return ramp*(2.5*u**4-3*u**5+u**6)/(1-ramp)}if(t>1-ramp)return 1-cruiseEase(1-t);return (t-ramp*.5)/(1-ramp)};
const inverseSmooth=value=>{value=clamp01(value);if(value===0||value===1)return value;let low=0,high=1;for(let i=0;i<28;i++){const mid=(low+high)/2;if(smooth(mid)<value)low=mid;else high=mid}return (low+high)/2};
export function travelProgress(start,target,time){
 if(time<=0)return start;if(time>=1)return target;if(start===target)return start;
 const direction=Math.sign(target-start),zones=[[0,.035,.04],[.035,.52,.74],[.52,.94,.42],[.94,2.94,1.4],[2.94,3.22,.25],[3.22,3.42,.18],[3.42,4.02,.72],[4.02,4.58,.35],[4.58,5.18,.76],[5.18,5.56,.3],[5.56,5.76,.2],[5.76,6.48,.9],[6.48,6.6,.06],[6.6,7.32,.9],[7.32,8.12,1],[8.12,8.5,.30],[8.5,8.72,.22],[8.72,9.52,1],[9.52,9.9,.3],[9.9,10.12,.22],[10.12,10.92,1],[10.92,11.3,.3]],stops=[start,...zones.slice(0,-1).map(z=>z[1]).filter(x=>direction>0?x>start&&x<target:x<start&&x>target).sort((a,b)=>direction*(a-b)),target];
 const legs=stops.slice(0,-1).map((a,i)=>{const b=stops[i+1],mid=(a+b)/2,zone=zones.find(z=>mid>=z[0]&&mid<=z[1])||[0,1,1];return {a,b,zone,weight:Math.abs(b-a)/(zone[1]-zone[0])*zone[2]}}),total=legs.reduce((n,l)=>n+l.weight,0);let elapsed=clamp01(time)*total;
 const cruiseStarts=new Set([.035,.94,3.42,4.58,5.76,6.6,7.32,8.72,10.12]);
 for(const leg of legs){if(elapsed>leg.weight){elapsed-=leg.weight;continue}const {a,b,zone}=leg,u=clamp01(elapsed/leg.weight);if(cruiseStarts.has(zone[0])){const base=zone[0],span=zone[1]-zone[0],from=smooth((a-base)/span),to=smooth((b-base)/span);return base+span*inverseSmooth(from+(to-from)*cruiseEase(u))}return a+(b-a)*smooth(u)}return target;
}
export function journeyState(scroll) {
 const raw=clamp01(scroll),p=smooth((raw-.035)/.485);
 const departure=smooth((raw-.94)/.06);
 const focus=smooth((raw-.56)/.12)*(1-smooth((raw-.82)/.12));
 const train=.18+.72*p+.05*departure;
 const arrival=smooth((raw-.46)/.06);
 const phase=raw<.035?'MJM CENTRAL':raw<.22?'LEAVING MJM CENTRAL':raw<.29?'RAILWAY CROSSING':raw<.36?'STREAM BRIDGE':raw<.44?'WOODLAND':raw<.52?'APPROACHING ICE BREAKER':raw<.56?'ICE BREAKER':raw<.68?'ARRIVAL FOCUS':raw<=.82?'ICE BREAKER — PRESENTATION':raw<.94?'TITLE RETURN':'DEPARTING ICE BREAKER';
 return {raw,p,train,departure,focus,blur:focus*9,door:clamp01(1-smooth(p/.055)+smooth((p-.955)/.045)*(1-departure)),opening:1-smooth(raw/.13),arrival,phase};
}
// The cover occupies a new range before zero; the original journey mapping is unchanged.
export function experienceState(scroll){
 const raw=Math.max(-1,Math.min(11.3,scroll)),state=journeyState(raw);
 if(raw>9.9){const finalTravel=smooth((raw-10.12)/.8),finalTitle=raw>=10.12,focus=finalTitle?smooth((raw-10.96)/.22):1-smooth((raw-9.9)/.22);return {...state,raw,final:true,finalTitle,finalTravel,mentor:!finalTitle,mentorLast:true,mentorTravel:1,joanneTravel:1,recipeTravel:1,restTravel:1,gameTravel:1,train:4.85+.75*finalTravel,focus,blur:focus*4,arrival:finalTitle?smooth((raw-10.86)/.06):1,door:1-smooth(finalTravel/.04)+smooth((finalTravel-.96)/.04),cover:0,coverTitle:0,opening:0,phase:raw<10.12?'MENTOR EXPRESS — DEPARTURE':raw<10.92?'NEXT STOP — MJM CENTRAL':'THANK YOU'};}
 if(raw>8.5){const mentorTravel=smooth((raw-8.72)/.8),mentor=raw>=8.72,focus=mentor?smooth((raw-9.56)/.22):1-smooth((raw-8.5)/.22);return {...state,raw,mentorLast:true,mentor,mentorTravel,joanne:!mentor,joanneTravel:1,recipeTravel:1,restTravel:1,gameTravel:1,train:4.1+.75*mentorTravel,focus,blur:focus*4,arrival:mentor?smooth((raw-9.46)/.06):1,door:1-smooth(mentorTravel/.04)+smooth((mentorTravel-.96)/.04),cover:0,coverTitle:0,opening:0,phase:raw<8.72?'LEADERSHIP LINE — DEPARTURE':raw<9.52?'NEXT STOP — MENTOR EXPRESS':'MENTOR SHARING — MR PUI YUH TZER'};}
 if(raw>6.6){const exit=smooth((raw-6.6)/.72),joanneTravel=smooth((raw-7.32)/.8),focus=smooth((raw-8.16)/.22),arrival=smooth((raw-8.04)/.08);return {...state,raw,joanne:true,joanneTravel,recipe:raw<=7.32,recipeTravel:1,interior:1-exit,restTravel:1,gameTravel:1,mentor:false,game:false,rest:false,train:3.45+.65*joanneTravel,focus,blur:focus*4,arrival,door:1-smooth(joanneTravel/.04)+smooth((joanneTravel-.96)/.04),cover:0,coverTitle:0,opening:0,phase:raw<7.32?'LEAVING THE CULINARY ATELIER':raw<8.04?'NEXT STOP — LEADERSHIP LINE':raw<8.16?'LEADERSHIP LINE — ARRIVAL':'MENTOR SHARING — JOANNE GOH'};}
 if(raw>4.58){const recipeTravel=smooth((raw-4.58)/.6),focus=smooth((raw-5.22)/.18)*(1-smooth((raw-5.56)/.2)),arrival=smooth((raw-5.12)/.06)*(1-smooth((raw-5.76)/.06)),interior=smooth((raw-5.76)/.72);return {...state,raw,recipe:true,recipeTravel,interior,restTravel:1,gameTravel:1,rest:false,game:false,mentor:false,train:2.85+.6*recipeTravel,focus,blur:focus*7,arrival,door:1-smooth(recipeTravel/.04)+smooth((recipeTravel-.96)/.04),cover:0,coverTitle:0,opening:0,phase:raw<5.12?'NEXT STOP — TEAM RECIPE':raw<5.22?'TEAM RECIPE — ARRIVAL':raw<5.56?'TEAM RECIPE — WHAT MAKES A GREAT TEAM?':raw<5.76?'TEAM RECIPE — TITLE RETURN':raw<6.48?'ENTERING THE CULINARY ATELIER':'TEAM INGREDIENTS GALLERY'};}
 if(raw>3.42){const restTravel=smooth((raw-3.42)/.6),focus=smooth((raw-4.06)/.18)*(1-smooth((raw-4.42)/.16)),arrival=smooth((raw-3.96)/.06);return {...state,raw,rest:true,restTravel,gameTravel:1,game:false,mentor:false,train:2.2+.65*restTravel,focus,blur:focus*7,arrival,door:1-smooth(restTravel/.04)+smooth((restTravel-.96)/.04),cover:0,coverTitle:0,opening:0,phase:raw<3.96?'NEXT STOP — REST STATION':raw<4.06?'REST STATION':raw<4.42?'REST STATION — TIME TO RECHARGE':'REST STATION — TITLE RETURN'};}
 // One continuous departure and arrival; the former mentor layover is gone.
 if(raw>.94){const gameRun=smooth((raw-.94)/2),train=.9+1.3*gameRun,gameTravel=clamp01((train-1.45)/.75),focus=smooth((raw-2.98)/.18)*(1-smooth((raw-3.22)/.2)),arrival=smooth((raw-2.88)/.06);return {...state,raw,game:true,gameRun,gameTravel,mentor:false,train,departure:0,focus,blur:0,arrival,door:1-smooth(gameRun/.035)+smooth((gameRun-.965)/.035),cover:0,coverTitle:0,opening:0,phase:raw<2.88?'NEXT STOP — GAME STATION':raw<2.98?'GAME STATION':'GAME STATION — MONOPOLY'};}
 const entry=clamp01(raw+1),cover=1-smooth(entry);
 return {...state,raw,cover,coverTitle:1-smooth(entry/.68),opening:state.opening*smooth((raw+.30)/.30),phase:raw<0?'PUI GROUPS — OPENING':state.phase};
}
