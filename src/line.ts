import p5 from 'p5';
import { Ball } from './ball';
import { intersects } from './utils';

export class Line {
  p: p5;
  pos: p5.Vector;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rotation: number;
  scale: p5.Vector;
  lineWidth: number;

  constructor(p: p5, x, y, width, rotation = 0) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = width;
    this.y2 = 0;
    this.rotation = rotation;
    this.scale = p.createVector(1, 1);
    this.lineWidth = 2;
  }

  draw() {
    this.p.push();
    this.p.translate(this.pos);
    this.p.rotate(this.rotation);
    this.p.scale(this.scale);
    this.p.strokeWeight(this.lineWidth);
    this.p.line(this.x1, this.y1, this.x2, this.y2);
    this.p.pop();
  }

  getBounds() {
    if (this.rotation === 0) {
      const minX = Math.min(this.x1, this.x2),
        minY = Math.min(this.y1, this.y2),
        maxX = Math.max(this.x1, this.x2),
        maxY = Math.max(this.y1, this.y2);
      return {
        x: this.pos.x + minX,
        y: this.pos.y + minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    } else {
      const sin = Math.sin(this.rotation),
        cos = Math.cos(this.rotation),
        x1r = cos * this.x1 + sin * this.y1,
        x2r = cos * this.x2 + sin * this.y2,
        y1r = cos * this.y1 + sin * this.x1,
        y2r = cos * this.y2 + sin * this.x2;
      return {
        x: this.pos.x + Math.min(x1r, x2r),
        y: this.pos.y + Math.min(y1r, y2r),
        width: Math.max(x1r, x2r) - Math.min(x1r, x2r),
        height: Math.max(y1r, y2r) - Math.min(y1r, y2r),
      };
    }
  }
  bounce(ball: Ball) {
    const lineBounds = this.getBounds();
    if (intersects(lineBounds, ball.getBounds())) {
      // position relative to line origin
      const relativePos = p5.Vector.sub(ball.pos, this.pos);

      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);
      // rotate y so line is horizontal now
      let y2 = relativePos.dot(-sin, cos);
      if (Math.abs(y2) < ball.r) {
        //rotate coordinates
        let x2 = relativePos.dot(cos, sin);
        //rotate velocity
        let vx1 = ball.vel.dot(cos, sin);
        let vy1 = ball.vel.dot(-sin, cos);
        vy1 *= -0.95;
        y2 = vx1 !== 0 ? Math.sign(vy1) * ball.r : -ball.r;

        // rotate everything back
        relativePos.x = cos * x2 - sin * y2;
        relativePos.y = sin * x2 + cos * y2;
        ball.vel.x = cos * vx1 - sin * vy1;
        ball.vel.y = sin * vx1 + cos * vy1;

        ball.pos = p5.Vector.add(this.pos, relativePos);
      }
    }
  }
}
