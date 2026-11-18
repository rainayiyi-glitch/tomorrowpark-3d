import test from 'node:test';import assert from 'node:assert/strict';import {WalkGrid} from '../src/navigation.ts';
test('routes around building without cutting through it',()=>{const g=new WalkGrid();g.addBox(0,0,4,4);const p=g.path([-7,0],[7,0]);assert.ok(p.length>1);let prev=[-7,0];for(const q of p){assert.ok(g.line(prev,q));prev=q;}assert.ok(Math.hypot(prev[0]-7,prev[1])<.6);});
test('unreachable destination returns no route',()=>{const g=new WalkGrid();assert.deepEqual(g.path([0,0],[100,100]),[]);});
test('temporary blockers restored after pathAvoid',()=>{const g=new WalkGrid();const before=g.blocked.slice();g.pathAvoid([-5,0],[5,0],[[0,0]]);assert.deepEqual(g.blocked,before);});
test('sliding cannot cross wall or boundary',()=>{const g=new WalkGrid();g.addBox(0,0,4,4);assert.deepEqual(g.slide([-3,0],[6,0]),[-3,0]);assert.deepEqual(g.slide([10,0],[10,0]),[10,0]);});
