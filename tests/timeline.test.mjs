import assert from 'node:assert/strict';
import { journeyState, experienceState, travelProgress } from '../dist/timeline.js';
// Progress can move in either direction without history, timers or hidden state.
const saved=new Map();let last=-Infinity;
for(let i=0;i<=1000;i++){const p=i/1000,s=journeyState(p);assert.ok(s.train>=last,'Train must advance monotonically');assert.ok(s.door>=0&&s.door<=1);assert.ok(s.opening>=0&&s.opening<=1);assert.ok(s.arrival>=0&&s.arrival<=1);saved.set(p,JSON.stringify(s));last=s.train}
for(let i=1000;i>=0;i--){const p=i/1000;assert.equal(JSON.stringify(journeyState(p)),saved.get(p),'Reverse must reproduce identical world state')}
assert.deepEqual(journeyState(.5),journeyState(.5));
assert.ok(Math.abs(journeyState(0).train-.18)<1e-12);
assert.ok(Math.abs(journeyState(1).train-.95)<1e-12);
assert.equal(journeyState(.02).train,journeyState(0).train,'Opening rest zone');
const settled=journeyState(.52);
for(let i=520;i<=940;i++){
 const state=journeyState(i/1000);
 assert.equal(state.train,settled.train,'Train stays parked through focus, rest and title return');
 assert.equal(state.p,settled.p,'Camera stays parked through focus, rest and title return');
 assert.equal(state.departure,0,'No departure before title returns');
}
for(let i=680;i<=820;i++){assert.equal(journeyState(i/1000).focus,1,'Generous focused rest zone')}
assert.equal(journeyState(.56).focus,0);
assert.equal(journeyState(.94).focus,0);
assert.equal(journeyState(.94).blur,0);
assert.ok(journeyState(.96).departure>0,'Departure starts only after title returns');
assert.equal(journeyState(.62).focus,journeyState(.88).focus,'Matched forward and return interpolation');
assert.equal(journeyState(-2).raw,0);assert.equal(journeyState(2).raw,1);
console.log('PASS: 1,001 reversible positions; camera and train parked through focus; title return precedes departure; rest zone and blur.');
const coverStates=new Map();
for(let i=-1000;i<=0;i++){
 const s=experienceState(i/1000);
 assert.equal(s.train,journeyState(0).train,'Train remains parked throughout cover entry');
 assert.ok(s.cover>=0&&s.cover<=1);
 coverStates.set(i,JSON.stringify(s));
}
for(let i=0;i>=-1000;i--)assert.equal(JSON.stringify(experienceState(i/1000)),coverStates.get(i));
assert.equal(experienceState(-1).cover,1);
assert.equal(experienceState(-1).opening,0);
assert.equal(experienceState(0).cover,0);
assert.equal(experienceState(0).opening,1);
for(let i=0;i<=940;i++){
 const original=journeyState(i/1000),enhanced=experienceState(i/1000);
 for(const key of Object.keys(original))assert.equal(enhanced[key],original[key],'Original journey remains unchanged: '+key);
}
console.log('PASS: reversible cover entry, stationary train, exact handoff and unchanged original journey.');
// Check complete gesture legs in both directions, including interrupted scrubbing.
for(const [start,end]of [[0,.74],[.74,0],[.74,1],[1,0],[.27,.74],[.41,0],[.89,1]]){
 let last=start;
 assert.equal(travelProgress(start,end,0),start);
 assert.equal(travelProgress(start,end,1),end);
 for(let i=1;i<=2000;i++){
  const p=travelProgress(start,end,i/2000);
  assert.ok(p>=Math.min(start,end)-1e-9&&p<=Math.max(start,end)+1e-9,'No overshoot');
  assert.ok((p-last)*Math.sign(end-start)>=-1e-9,'No direction reversal');
  assert.ok(Math.abs(experienceState(p).train-experienceState(last).train)<.001,'No sudden train displacement');
  last=p;
 }
}
const cruiseSamples=[.2,.3,.4,.5,.6].map(t=>journeyState(travelProgress(0,.74,t)).train);
const cruiseStep=cruiseSamples[1]-cruiseSamples[0];
for(let i=2;i<cruiseSamples.length;i++)assert.ok(Math.abs(cruiseSamples[i]-cruiseSamples[i-1]-cruiseStep)<1e-7,'Steady cruising speed');
assert.ok(journeyState(travelProgress(0,.74,.045)).train-.18<cruiseStep*.002,'Gentle start');
console.log('PASS: smooth forward/reverse legs, bounded displacement, gentle acceleration and steady cruising speed.');
// The old mentor stretch is now a transit corridor on the direct Ice Breaker → Game Station leg.
for(let i=1001;i<=2160;i++){const state=experienceState(i/1000),before=experienceState((i-1)/1000);assert.equal(state.game,true);assert.ok(state.train>before.train,'Train must never park at the former mentor stop');assert.equal(state.focus,0);assert.equal(state.arrival,0);assert.match(state.phase,/GAME STATION/);assert.ok(!state.mentor,'Mr Pui must not appear before Game Station');}
const mentorStop=experienceState(9.9);
assert.equal(mentorStop.train,4.85);assert.equal(mentorStop.focus,1);assert.equal(mentorStop.door,1);assert.equal(mentorStop.mentor,true);
assert.match(mentorStop.phase,/MR PUI YUH TZER/);
for(let i=9520;i<=9900;i++){const state=experienceState(i/1000);assert.equal(state.train,4.85,'Mentor remains parked before Thank You');assert.equal(state.mentorTravel,1);}
for(const [start,end]of [[8.5,9.9],[9.9,8.5]]){let previous=experienceState(start).train;for(let i=1;i<=3000;i++){const state=experienceState(travelProgress(start,end,i/3000));assert.ok((state.train-previous)*Math.sign(end-start)>=-1e-8);assert.ok(Math.abs(state.train-previous)<.003,'Relocated mentor travel is smooth');previous=state.train;}}
assert.match(experienceState(8.5).phase,/JOANNE GOH/);
assert.match(experienceState(11.3).phase,/THANK YOU/);
console.log('PASS: Mr Pui follows Joanne and precedes Thank You, with smooth reversible travel.');
const gameStop=experienceState(3.22);
assert.equal(gameStop.train,2.2);assert.equal(gameStop.focus,1);assert.equal(gameStop.door,1);assert.equal(gameStop.game,true);
for(let i=2940;i<=3220;i++)assert.equal(experienceState(i/1000).train,2.2,'Train stays parked at Game Station');
for(const boundary of [2,2.16,2.94,2.98,3.16])assert.ok(Math.abs(experienceState(boundary+1e-6).train-experienceState(boundary-1e-6).train)<1e-5,'Continuous Game Station entry');
for(const [start,end]of [[.74,3.22],[3.22,.74],[2.6,.74],[2.5,3.22]]){let previous=experienceState(start).train;for(let i=1;i<=2000;i++){const p=travelProgress(start,end,i/2000),state=experienceState(p);assert.ok((state.train-previous)*Math.sign(end-start)>=-1e-8,'No train reversal');assert.ok(Math.abs(state.train-previous)<.003,'Smooth frame displacement');previous=state.train}assert.equal(travelProgress(start,end,1),end)}
assert.equal(experienceState(2.16).focus,0,'Direct transit has no intermediate header');assert.equal(experienceState(.74).focus,1,'Returning restores Ice Breaker');
console.log('PASS: reversible Game Station journey, smooth departure, parked arrival and restored Ice Breaker scene.');
const rest=experienceState(4.3);assert.equal(rest.rest,true);assert.equal(rest.train,2.85);assert.equal(rest.focus,1);assert.equal(rest.door,1);
for(let i=4020;i<=4580;i++){const s=experienceState(i/1000);assert.equal(s.train,2.85,'Café camera and train stay parked while its title enlarges and returns');assert.equal(s.restTravel,1);}
assert.equal(experienceState(3.42).focus,0,'Game title fully returns before train departs');assert.equal(experienceState(4.58).focus,0);assert.equal(experienceState(4.58).blur,0);
for(const [start,end]of [[3.22,4.3],[4.3,3.22],[3.7,3.22]]){let previous=experienceState(start).train;for(let i=1;i<=2000;i++){const p=travelProgress(start,end,i/2000),s=experienceState(p);assert.ok((s.train-previous)*Math.sign(end-start)>=-1e-8);assert.ok(Math.abs(s.train-previous)<.003,'No sudden displacement on café journey');previous=s.train;}}
console.log('PASS: reversible café journey, parked focus and title return before departure.');
// The new station has separate approach, title, entrance and gallery phases.
const recipeStop=experienceState(5.47);assert.equal(recipeStop.recipe,true);assert.equal(recipeStop.train,3.45);assert.equal(recipeStop.focus,1);assert.equal(recipeStop.interior,0);
for(let i=5180;i<=6600;i++){const s=experienceState(i/1000);assert.equal(s.train,3.45,'The train stays outside throughout the bakery entrance and gallery');if(i<=5760)assert.equal(s.interior,0,'No entrance movement until the title has fully returned');}
assert.equal(experienceState(5.76).focus,0);assert.equal(experienceState(5.76).blur,0);assert.equal(experienceState(6.48).interior,1);
const recipeStates=new Map();for(let i=4581;i<=6600;i++)recipeStates.set(i,JSON.stringify(experienceState(i/1000)));for(let i=6600;i>=4581;i--)assert.equal(JSON.stringify(experienceState(i/1000)),recipeStates.get(i),'All bakery phases reverse exactly');
console.log('PASS: parked Team Recipe title, title return before entry, static gallery and fully reversible progress.');

// Two automatic bakery legs stop at the entrance header, then the gallery.
for(const [start,end] of [[4.3,5.47],[5.47,6.6],[6.6,5.47],[5.47,4.3]]){
 let previous=start;
 for(let i=1;i<=2000;i++){
  const raw=travelProgress(start,end,i/2000),state=experienceState(raw),before=experienceState(previous);
  assert.ok((raw-previous)*Math.sign(end-start)>=-1e-9,'Each bakery leg moves monotonically');
  assert.ok(Math.abs(state.train-before.train)<.003,'Bakery approach moves smoothly');
  assert.ok(Math.abs((state.interior||0)-(before.interior||0))<.003,'Interior camera moves smoothly');
  if(state.focus>0)assert.equal(state.interior||0,0,'Focused title remains outside the bakery');
  previous=raw;
 }
 assert.equal(travelProgress(start,end,1),end);
}
console.log('PASS: two-stage bakery arrival and entry, smooth reverse and exact parked endpoints.');

const joanneStop=experienceState(8.5);assert.equal(joanneStop.joanne,true);assert.ok(Math.abs(joanneStop.train-4.1)<1e-10);assert.equal(joanneStop.focus,1);assert.equal(joanneStop.door,1);assert.match(joanneStop.phase,/JOANNE GOH/);
for(let i=6601;i<=7320;i++){const state=experienceState(i/1000);assert.equal(state.train,3.45,'Train stays parked while camera exits bakery');assert.ok(state.recipe);}
for(const [start,end]of [[6.6,8.5],[8.5,6.6]]){let last=experienceState(start);for(let i=1;i<=3000;i++){const raw=travelProgress(start,end,i/3000),state=experienceState(raw);assert.ok(Math.abs(state.train-last.train)<.003,'Smooth Joanne train travel');assert.ok(Math.abs((state.interior||0)-(last.interior||0))<.003,'Smooth bakery exit');assert.ok((state.train-last.train)*Math.sign(end-start)>=-1e-8);last=state;}assert.equal(travelProgress(start,end,1),end);}
assert.equal(experienceState(6.6).interior,1,'Reverse journey restores gallery');
console.log('PASS: Joanne mentor arrival, parked sharing, smooth reversible travel and bakery exit.');

// Station navigation must match the visible route in both directions.
const {readFileSync}=await import('node:fs');
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const navigation=app.slice(app.indexOf('function returnToCentral()'),app.indexOf('// Each gesture'));
const stops=[0,.74,3.22,4.3,5.47,6.6,8.5,9.9,11.3];
for(let i=1;i<stops.length-1;i++){
 let target;const run=new Function('progress','animateJourney','travel',navigation+'return {back:returnToCentral,next:advanceJourney};')(stops[i],x=>target=x,x=>target=x);
 run.next();assert.equal(target,stops[i+1],'Next reaches the next event station');
 run.back();assert.equal(target,stops[i-1],'Previous restores the prior event station');
}
for(const boundary of [1,2.16,8.5,8.72,9.52,9.9,10.12,10.92]){
 const before=experienceState(boundary-1e-7),after=experienceState(boundary+1e-7);
 assert.ok(Math.abs(before.train-after.train)<1e-5,'Continuous train at revised route boundaries');
 assert.ok(Math.abs(before.door-after.door)<1e-5,'No snapping doors at revised route boundaries');
}
console.log('PASS: event navigation skips the former mentor stop and visits Joanne → Mr Pui → Thank You in both directions.');

// A single cruising phase must span both former travel segments without braking midway.
const directSamples=[.3,.4,.5,.6,.7].map(t=>experienceState(travelProgress(.74,3.22,t)).train);
const directStep=directSamples[1]-directSamples[0];
for(let i=2;i<directSamples.length;i++)assert.ok(Math.abs(directSamples[i]-directSamples[i-1]-directStep)<1e-7,'Uniform speed through the removed layover');
console.log('PASS: no intermediate train stop and steady cruising from Ice Breaker to Monopoly.');
