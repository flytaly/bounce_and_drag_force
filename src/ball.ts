import p5 from 'p5';
import { Bounds } from './types';
import { rotate } from './utils';

export class Ball {
  p: p5;
  opacity: number;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  r: number;
  d: number;
  mass: number;
  constructor(p: p5, x: number, y: number, mass: number) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.mass = mass;
    this.r = p.sqrt(mass) * 10;
    this.d = this.r * 2;
    this.opacity = 1;
  }

  friction(magnitude: number) {
    let friction = this.vel.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(magnitude);
    this.applyForce(friction);
  }

  drag(c: number) {
    // Direction of Drag
    let drag = this.vel.copy();
    drag.normalize();
    drag.mult(-1);
    let speedSq = this.vel.magSq();
    drag.setMag(c * speedSq);

    this.applyForce(drag);
  }

  applyForce(force: p5.Vector) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  edges() {
    const bounce = -0.98;
    if (this.pos.y >= this.p.height - this.r) {
      this.pos.y = this.p.height - this.r;
      this.vel.y *= bounce;
    }

    if (this.pos.x >= this.p.width - this.r) {
      this.pos.x = this.p.width - this.r;
      this.vel.x *= bounce;
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= bounce;
    }
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    this.p.stroke(255, 255 * this.opacity);
    this.p.strokeWeight(2);
    this.p.fill(255, 100 * this.opacity);
    this.p.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  getBounds(): Bounds {
    return {
      x: this.pos.x - this.r,
      y: this.pos.y - this.r,
      width: this.d,
      height: this.d,
    };
  }

  checkCollusion(neighbor: Ball) {
    const diff = p5.Vector.sub(neighbor.pos, this.pos);
    const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    if (dist < this.r + neighbor.r) {
      const angle = Math.atan2(diff.y, diff.x);
      // const sin = Math.sin(angle);
      // const cos = Math.cos(angle);
      const pos0 = this.p.createVector(0, 0);
      const pos1 = diff.rotate(-angle);
      const vel0 = this.vel.rotate(-angle);
      const vel1 = neighbor.vel.rotate(-angle);
      const vxTotal = vel0.x - vel1.x;
      vel0.x = ((this.mass - neighbor.mass) * vel0.x + 2 * neighbor.mass * vel1.x) / (this.mass + neighbor.mass);
      vel1.x = vxTotal + vel0.x;

      // update position - to avoid objects becoming stuck together
      const absV = Math.abs(vel0.x) + Math.abs(vel1.x);
      const overlap = this.r + neighbor.r - Math.abs(pos0.x - pos1.x);
      pos0.x += (vel0.x / absV) * overlap;
      pos1.x += (vel1.x / absV) * overlap;

      //rotate positions back
      const pos0F = pos0.rotate(angle);
      const pos1F = pos1.rotate(angle);
      //adjust positions to actual screen positions
      neighbor.pos.x = this.pos.x + pos1F.x;
      neighbor.pos.y = this.pos.y + pos1F.y;
      this.pos.x = this.pos.x + pos0F.x;
      this.pos.y = this.pos.y + pos0F.y;
      //rotate velocities back
      this.vel = vel0.rotate(angle);
      neighbor.vel = vel1.rotate(angle);
    }
  }
}
