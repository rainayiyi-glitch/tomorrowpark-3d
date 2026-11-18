// Extracted from Tomorrow Park v13-navigation.ts. Park-specific asset names and terrain removed.
import * as T from 'three';
export type XZ=[number,number];
export class WalkGrid {
 readonly minX=-12; readonly minZ=-12; readonly step=.5; readonly nx=49; readonly nz=49;
 readonly blocked=new Uint8Array(this.nx*this.nz); readonly radius=.3; segments=0;
 constructor(){
  for(let z=0;z<this.nz;z++)for(let x=0;x<this.nx;x++)if(x===0||z===0||x===this.nx-1||z===this.nz-1)this.blocked[z*this.nx+x]=1;
 }
 addBox(x:number,z:number,width:number,depth:number){
  for(let zz=z-depth/2;zz<=z+depth/2;zz+=.2)this.addSegment([x-width/2,zz],[x+width/2,zz]);
 }
 cell(x:number,z:number){const ix=Math.round((x-this.minX)/this.step),iz=Math.round((z-this.minZ)/this.step);return ix<0||iz<0||ix>=this.nx||iz>=this.nz?-1:iz*this.nx+ix}
 point(i:number):XZ{return[this.minX+(i%this.nx)*this.step,this.minZ+Math.floor(i/this.nx)*this.step]}
 clear(x:number,z:number){const i=this.cell(x,z);return i>=0&&!this.blocked[i]}
 addCircle(x:number,z:number,r:number){this.addSegment([x,z],[x,z],r+this.radius)}
 addSegment(a:XZ,b:XZ,r=this.radius+.12){this.segments++;const x0=Math.max(0,Math.floor((Math.min(a[0],b[0])-r-this.minX)/this.step)),x1=Math.min(this.nx-1,Math.ceil((Math.max(a[0],b[0])+r-this.minX)/this.step)),z0=Math.max(0,Math.floor((Math.min(a[1],b[1])-r-this.minZ)/this.step)),z1=Math.min(this.nz-1,Math.ceil((Math.max(a[1],b[1])+r-this.minZ)/this.step)),dx=b[0]-a[0],dz=b[1]-a[1],den=dx*dx+dz*dz;
 for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const wx=this.minX+x*this.step,wz=this.minZ+z*this.step,t=den?T.MathUtils.clamp(((wx-a[0])*dx+(wz-a[1])*dz)/den,0,1):0;if(Math.hypot(wx-a[0]-t*dx,wz-a[1]-t*dz)<=r)this.blocked[z*this.nx+x]=1;}}
 nearest(p:XZ,max=5):XZ|null{if(this.clear(...p))return p;for(let r=.5;r<=max;r+=.5)for(let a=0;a<Math.PI*2;a+=Math.PI/16){const q:XZ=[p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r];if(this.clear(...q))return q}return null}
 line(a:XZ,b:XZ){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/.18);for(let i=0;i<=n;i++)if(!this.clear(T.MathUtils.lerp(a[0],b[0],i/(n||1)),T.MathUtils.lerp(a[1],b[1],i/(n||1))))return false;return true}
 path(from:XZ,to:XZ):XZ[]{const end=this.nearest(to,3),begin=this.nearest(from,2);if(!end||!begin)return[];if(this.line(begin,end))return [end];const s=this.cell(...begin),goal=this.cell(...end),cost=new Float32Array(this.blocked.length).fill(Infinity),came=new Int32Array(this.blocked.length).fill(-1),closed=new Uint8Array(this.blocked.length);cost[s]=0;const heap:{i:number;f:number}[]=[];const heuristic=(i:number)=>{const a=this.point(i);return Math.hypot(a[0]-end[0],a[1]-end[1])/this.step};
 const push=(v:{i:number;f:number})=>{let k=heap.length;heap.push(v);while(k>0){const parent=(k-1)>>1;if(heap[parent].f<=v.f)break;heap[k]=heap[parent];k=parent}heap[k]=v};
 const pop=()=>{const head=heap[0],tail=heap.pop()!;if(heap.length){let k=0;while(k*2+1<heap.length){let c=k*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=tail.f)break;heap[k]=heap[c];k=c}heap[k]=tail}return head};push({i:s,f:heuristic(s)});
 let found=false,iterations=0;while(heap.length&&iterations++<this.blocked.length){const {i}=pop();if(closed[i])continue;closed[i]=1;if(i===goal){found=true;break}const x=i%this.nx,z=Math.floor(i/this.nx);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=this.nx||zz>=this.nz)continue;const j=zz*this.nx+xx;if(closed[j]||this.blocked[j])continue;if(dx&&dz&&(this.blocked[z*this.nx+xx]||this.blocked[zz*this.nx+x]))continue;const c=cost[i]+(dx&&dz?Math.SQRT2:1);if(c<cost[j]){cost[j]=c;came[j]=i;push({i:j,f:c+heuristic(j)})}}}
 if(!found)return[];const rev:XZ[]=[end];for(let i=goal;i!==s&&i>=0;i=came[i])rev.push(this.point(i));rev.push(begin);rev.reverse();const smooth:XZ[]=[];let i=0;while(i<rev.length-1){let j=i+1;while(j+1<rev.length&&this.line(rev[i],rev[j+1]))j++;smooth.push(rev[j]);i=j;}return smooth;
 }
 pathAvoid(from:XZ,to:XZ,people:XZ[]){const old=this.blocked.slice();for(const q of people)if(Math.hypot(q[0]-from[0],q[1]-from[1])>1.1)this.addCircle(q[0],q[1],.65);const start=this.cell(...from);if(start>=0)this.blocked[start]=0;const result=this.path(from,to);this.blocked.set(old);return result;}
 slide(p:XZ,d:XZ):XZ{const n:XZ=[p[0]+d[0],p[1]+d[1]];if(this.line(p,n))return n;const x:XZ=[n[0],p[1]],z:XZ=[p[0],n[1]];if(this.line(p,x))return x;if(this.line(p,z))return z;return p}
}
