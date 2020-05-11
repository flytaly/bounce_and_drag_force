import p5 from 'p5';

export class Ball {
  p: p5;
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
    this.r = p.sqrt(this.mass) * 10;
    this.d = this.r * 2;
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
    this.p.stroke(255);
    this.p.strokeWeight(2);
    this.p.fill(255, 100);
    this.p.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  getBounds() {
    return {
      x: this.pos.x - this.r,
      y: this.pos.y - this.r,
      width: this.d,
      height: this.d,
    };
  }
}
