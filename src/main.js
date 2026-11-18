import * as T from 'three';
import {ModelViewer,disposeObject} from './viewer.js';
import {Explorer} from './explorer.js';
import {WalkGrid} from './navigation.ts';
import './style.css';
const status=document.querySelector('#status'),say=s=>status.textContent=s;
const viewer=new ModelViewer(document.querySelector('#view')),demo=new T.Group();viewer.scene.add(demo);
const grid=new WalkGrid(),pickables=[];
function block(w,h,d,color){return new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));}
const ground=block(24,.45,24,0x8e9a70);ground.position.y=-.225;demo.add(ground);
for(const [x,z,w,h,d,color]of [[0,0,4,3,3,0xe8d6af],[-6,-3,3,2,3,0xc77c57],[6,4,3,4,4,0x627c81]]){const b=block(w,h,d,color);b.position.set(x,h/2,z);demo.add(b);pickables.push(b);grid.addBox(x,z,w,d);}
// Original test robot, deliberately generic; it is not the private Raina model.
const actor=new T.Group(),body=block(.6,.65,.4,0xd77a4c),head=block(.42,.36,.4,0xf3dfb4);body.position.y=.68;head.position.y=1.2;actor.add(body,head);const legs=[];for(const x of [-.19,.19]){const leg=block(.16,.4,.2,0x254b43);leg.position.set(x,.2,0);actor.add(leg);legs.push(leg);}actor.position.set(-8,0,8);demo.add(actor);
const explorer=new Explorer({object:actor,camera:viewer.camera,controls:viewer.controls,grid,onStatus:say});
function mode(value){explorer.setMode(value);document.querySelector('#follow').setAttribute('aria-pressed',String(value==='follow'));document.querySelector('#free').setAttribute('aria-pressed',String(value==='free'));}
mode('free');
document.querySelector('#follow').onclick=()=>{viewer.transition=null;mode('follow');};document.querySelector('#free').onclick=()=>mode('free');document.querySelector('#overview').onclick=()=>{mode('free');viewer.focus(new T.Vector3(),36);};
let loading=false;
document.querySelector('#model').onchange=async e=>{const file=e.target.files[0];if(!file||loading)return;loading=true;say('读取本地GLB…');try{await viewer.loadGLB(file);demo.visible=false;explorer.enabled=false;explorer.blur();mode('free');say('本地GLB观察模式：旋转、缩放；Reset demo返回角色示例。模型未上传。');}catch(error){say('加载失败：'+error.message);}finally{loading=false;e.target.value='';}};
document.querySelector('#reset').onclick=()=>{if(loading)return;viewer.clearModel();demo.visible=true;explorer.enabled=true;explorer.path=[];explorer.blur();actor.position.set(-8,0,8);mode('free');viewer.focus(new T.Vector3(),36);say('已返回演示。点击空地寻路；点击建筑聚焦。');};
const canvas=viewer.renderer.domElement,ray=new T.Raycaster(),mouse=new T.Vector2();let down=null;
canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY,e.button];});canvas.addEventListener('pointerup',e=>{if(!down||down[2]!==0||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5){down=null;return;}down=null;if(!demo.visible)return;const box=canvas.getBoundingClientRect();mouse.set((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);ray.setFromCamera(mouse,viewer.camera);const building=ray.intersectObjects(pickables)[0];if(building){mode('free');viewer.focus(building.object.position,12);say('建筑聚焦；Overview回到全景');return;}const point=ray.intersectObject(ground)[0]?.point;if(point)explorer.route(point.x,point.z);else say('请选择模型地面内的空地');});
let previous=performance.now();viewer.renderer.setAnimationLoop(now=>{const dt=Math.max(0,Math.min(.05,(now-previous)/1000));previous=now;explorer.update(dt);legs.forEach((leg,i)=>leg.rotation.x=Math.sin(explorer.walkDistance*9+i*Math.PI)*.4);viewer.update(dt);viewer.renderer.render(viewer.scene,viewer.camera);});
addEventListener('pagehide',()=>{viewer.renderer.setAnimationLoop(null);explorer.dispose();disposeObject(demo);viewer.dispose();},{once:true});
say('示例就绪。当前为自由镜头，点击Follow character开始跟随。');
