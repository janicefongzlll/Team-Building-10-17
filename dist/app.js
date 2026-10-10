import { RailwayWorld } from './world.js';
import { travelProgress } from './timeline.js';
import { TEAM_QUALITIES } from './team-recipe.js';
(()=>{'use strict';
const $=id=>document.getElementById(id);let world,progress=-1,scheduled=false,lastPhase='',drag=null,sound=false,audio,gain,lastState=null,returnFrame=0,wheelQuietUntil=0;
try{world=new RailwayWorld($('world'))}catch(error){$('failure').hidden=false;console.error(error);return}
$('gallery-accessible').innerHTML=TEAM_QUALITIES.map(([title,description],i)=>`<p>${String(i+1).padStart(2,'0')} ${title}: ${description}</p>`).join('');
function apply(){scheduled=false;const state=world.setProgress(progress);lastState=state;updateTitle(state);$('cover').style.opacity=String(state.coverTitle);$('cover').style.transform='translate(-50%,-50%)';$('cover').hidden=state.coverTitle===0;$('journey').classList.toggle('is-cover',progress<0);$('journey').classList.toggle('is-central',progress>=0&&state.opening>.5);$('central-veil').style.opacity=String(state.opening);$('opening').style.opacity=state.opening;$('opening').hidden=state.opening===0;$('journey').classList.toggle('is-mentor',!!state.mentor);$('journey').classList.toggle('is-game',!!state.game);$('journey').classList.toggle('is-rest',!!state.rest);$('journey').classList.toggle('is-recipe',!!state.recipe);$('journey').classList.toggle('is-joanne',!!state.joanne&&!state.finalTitle);$('journey').classList.toggle('is-final',!!state.finalTitle);$('route-final').classList.toggle('completed',progress>=9.52);$('route-joanne').classList.toggle('completed',progress>=8.12);$('route-recipe').classList.toggle('completed',progress>=5.18);$('gallery-accessible').hidden=!(state.recipe&&state.interior===1);$('route-rest').classList.toggle('completed',progress>=4.02);$('travel-label').textContent=state.final&&state.raw<9.52?state.phase:state.joanne&&state.raw<8.12?state.phase:state.recipe&&state.raw<5.18?state.phase:state.rest&&state.raw<4.02?state.phase:state.game&&state.raw<2.94?state.phase:state.mentor&&state.raw<1.58?state.phase:state.raw>.13&&state.raw<.52?state.phase:'';$('progress').value=String(Math.round(progress*1000));$('progress').setAttribute('aria-valuetext',`${Math.round(Math.max(0,progress)/9.9*100)} percent, ${state.phase.toLowerCase()}`);$('percent').textContent=Math.round(Math.max(0,progress)/9.9*100)+'%';$('route-ice').classList.toggle('completed',progress>=.52);$('route-mentor').classList.toggle('completed',progress>=1.58);$('route-game').classList.toggle('completed',progress>=2.94);$('back').disabled=progress===-1;$('forward').disabled=progress>=9.9;if(state.phase!==lastPhase){lastPhase=state.phase;$('status').textContent=state.phase}}
function set(value){progress=Math.max(-1,Math.min(9.9,value));if(Math.abs(progress)<1e-9)progress=0;if(!scheduled){scheduled=true;requestAnimationFrame(apply)}}
function soundMotion(level){if(!sound||!audio||!gain)return;const now=audio.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setTargetAtTime(level,now,.08);gain.gain.setTargetAtTime(0,now+.18,.25)}
function updateTitle(state){
 const title=$('station-title'),f=state.focus,mentor=!!state.mentor;const station=state.finalTitle?'final':state.joanne?'joanne':state.recipe?'recipe':state.rest?'rest':state.game?'game':mentor?'mentor':'ice';if(title.dataset.station!==station){title.dataset.station=station;title.children[0].textContent=state.finalTitle?'THANK':state.joanne?'MENTOR':state.recipe?'TEAM':state.rest?'REST':state.game?'GAME':mentor?'MENTOR':'ICE';title.children[1].innerHTML=(state.finalTitle?'YOU':state.joanne?'SHARING':state.recipe?'RECIPE':state.rest||state.game?'STATION':mentor?'SHARING':'BREAKER')+(state.finalTitle?'':'<span class="title-period">.</span>');$('focus-kicker').innerHTML=state.joanne?'LEADERSHIP LINE <span>/ 06</span>':state.recipe?'NEXT STOP <span>/ 05</span>':state.rest?'NEXT STOP <span>/ 04</span>':state.game?'NEXT STOP <span>/ 03</span>':mentor?'MENTOR EXPRESS <span>/ 02</span>':'NEXT STOP <span>/ 01</span>';if(state.game){const link=document.createElement('a');link.textContent='MONOPOLY';link.href='https://janicefongzlll.github.io/PUI-MONOPOLY/';link.target='_blank';link.rel='noopener noreferrer';$('focus-copy').replaceChildren(link)}else $('focus-copy').textContent=state.joanne?'JOANNE GOH':state.recipe?'WHAT MAKES A GREAT TEAM?':state.rest?'TIME TO RECHARGE.':mentor?'MR PUI YUH TZER':'FIND YOUR TEAMMATES.';}
 const reveal=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const support=reveal((f-.60)/.40)*(mentor||state.game||state.rest||state.recipe||state.joanne?1:1-reveal((state.raw-.82)/.035));
 $('arrival-support').style.opacity=String(state.arrival*support);
 $('arrival-support').style.transform=`translateY(${(1-support)*12}px)`;
 $('arrival-support').hidden=state.arrival===0||!!state.finalTitle;$('arrival-support').inert=state.arrival*support<.95;
 $('focus-veil').style.background=state.game?'#142745':'#eff8ff';
 title.style.transform=state.game?'translate(0,-50%)':`translate(-50%,-50%) scale(${(state.rest||state.recipe)? .88+.12*reveal(f):1})`;title.style.left='';title.style.top='';
 title.style.opacity=String(state.arrival*(state.rest||state.recipe?reveal(f/.15):reveal(f/.65)));
 title.style.color='#f7fbff';
 $('arrival-label').style.opacity='0';
 const atmosphere=Math.max(f,state.coverTitle,state.opening);
 $('world').style.filter=`blur(${Math.max(state.blur,state.coverTitle*6,state.opening*6)}px) saturate(${1-atmosphere*.08}) contrast(${1-atmosphere*.03})`;
 $('focus-veil').style.opacity=String(atmosphere*.12);
 $('journey').dataset.focus=String(f);
 $('journey').dataset.stage=state.phase;
}
function cancelReturn(){if(returnFrame)cancelAnimationFrame(returnFrame);returnFrame=0;$('journey').removeAttribute('aria-busy')}
function travel(target){cancelReturn();set(target);soundMotion(.025)}
function animateJourney(target){
 if(returnFrame||Math.abs(progress-target)<.0001)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){travel(target);return}
 const start=progress,started=performance.now(),duration=12500+Math.abs(target-start)*5500;
 $('journey').setAttribute('aria-busy','true');
 let elapsed=0,previousTime=started;const frameSamples=[];
 const frame=now=>{
  const frameMs=Math.max(0,now-previousTime);frameSamples.push(frameMs);elapsed+=Math.min(40,frameMs);previousTime=now;
  const t=Math.min(1,elapsed/duration);
  set(travelProgress(start,target,t));soundMotion(.025);
  if(t<1)returnFrame=requestAnimationFrame(frame);
  else{frameSamples.sort((a,b)=>a-b);$('journey').dataset.travelMedianMs=frameSamples[Math.floor(frameSamples.length*.5)].toFixed(1);$('journey').dataset.travelP95Ms=frameSamples[Math.floor(frameSamples.length*.95)].toFixed(1);returnFrame=0;set(target);wheelQuietUntil=now+700;$('journey').removeAttribute('aria-busy')}
 };
 returnFrame=requestAnimationFrame(frame);
}
function returnToCentral(){if(progress>8.5){animateJourney(8.5);return}if(progress>6.6){animateJourney(6.6);return}if(progress>5.76){animateJourney(5.47);return}if(progress>=4.58){animateJourney(4.3);return}if(progress<=0){travel(Math.max(-1,progress-.1));return}animateJourney(progress>3.42?3.22:progress>2.16?1.84:progress>.94?.74:0)}
function advanceJourney(){if(progress>=8.4){animateJourney(9.9);return}if(progress>=6.5){animateJourney(8.5);return}if(progress>=4.24){animateJourney(progress<5.4?5.47:6.6);return}if(progress<0){travel(Math.min(0,progress+.1));return}animateJourney(progress<.68?.74:progress<1.78?1.84:progress<3.16?3.22:progress<4.24?4.3:4.58)}
// Each gesture completes one journey leg; focus remains parked until the next gesture.
$('journey').addEventListener('wheel',e=>{
 if(e.ctrlKey)return;e.preventDefault();
 if(returnFrame||performance.now()<wheelQuietUntil)return;
 const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(progress<0||(progress===0&&pixels<0)){
  const next=Math.max(-1,Math.min(0,progress+Math.max(-160,Math.min(160,pixels))/2200));
  if(progress<0&&next===0)wheelQuietUntil=performance.now()+550;
  travel(next);return;
 }
 if(pixels<-2){returnToCentral();return}
 if(pixels>2)advanceJourney();
},{passive:false});
$('journey').addEventListener('pointerdown',e=>{if(e.target.closest('button,input,a'))return;drag={id:e.pointerId,y:e.clientY,x:e.clientX,startY:e.clientY,startX:e.clientX,moved:false};$('journey').setPointerCapture(e.pointerId)});
$('journey').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>8){drag.moved=true;travel(progress+(drag.y-e.clientY)/($('journey').clientHeight*3.5))}drag.y=e.clientY;drag.x=e.clientX});
function release(e){if(!drag||drag.id!==e.pointerId)return;if(!drag.moved&&lastState?.arrival>.8&&lastState.focus<.2){const i=world.pick(e.clientX,e.clientY);if(i>=0)select(i)}drag=null}
$('journey').addEventListener('pointerup',release);$('journey').addEventListener('pointercancel',()=>drag=null);
$('progress').addEventListener('input',e=>{travel(Number(e.target.value)/1000)});$('back').onclick=returnToCentral;$('forward').onclick=advanceJourney;
function select(i){world.selectTeam(i);document.querySelectorAll('[data-team]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.team===i)));$('status').textContent=['Frog','Monkey','Wolf','Horse'][i]+' team selected'}document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>select(+b.dataset.team));
async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await $('journey').requestFullscreen()}catch{$('status').textContent='Use your browser’s full-screen command.'}}$('fullscreen').onclick=full;
document.addEventListener('keydown',e=>{if(e.target.matches('input'))return;if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();advanceJourney()}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();returnToCentral()}else if(e.key==='Home'){e.preventDefault();travel(-1)}else if(e.key==='End'){e.preventDefault();travel(9.9)}else if(e.key.toLowerCase()==='f')full()});
$('sound').onclick=async()=>{sound=!sound;try{if(sound){audio||=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();if(!gain){const buffer=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate),data=buffer.getChannelData(0);let v=0;for(let i=0;i<data.length;i++){v=(v+.03*(Math.random()*2-1))/1.03;data[i]=v}const src=audio.createBufferSource();src.buffer=buffer;src.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=380;gain=audio.createGain();gain.gain.value=0;src.connect(filter);filter.connect(gain);gain.connect(audio.destination);src.start()}}else if(audio)await audio.suspend()}catch{sound=false}$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');$('sound').innerHTML=`♫ <span>${sound?'ON':'OFF'}</span>`};
addEventListener('resize',()=>set(progress));apply();
})();
