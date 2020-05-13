import p5 from 'p5';
import { Line } from './line';
import { Ball } from './ball';
import { intersects } from './utils';
import { Bounds } from './types';

export class Aquarium {
  p: p5;
  width: number;
  height: number;
  x: number;
  y: number;
  borderWidth: number;
  borderLines: Line[];
  constructor(p, width = p.width, height = p.height / 2) {
    this.borderWidth = 2;
    this.p = p;
    this.width = width;
    this.height = height;
    this.x = (p.width - width) / 2;
    this.y = p.height - height - this.borderWidth;
    const left = new Line(p, this.x - this.borderWidth, this.y, this.height);
    left.rotation = (90 * Math.PI) / 180;
    left.lineWidth = this.borderWidth;
    const right = new Line(p, this.x + this.width + this.borderWidth, this.y, this.height);
    right.rotation = (90 * Math.PI) / 180;
    right.lineWidth = this.borderWidth;
    const bottom = new Line(p, this.x, this.y + this.height + this.borderWidth, this.width);
    bottom.lineWidth = this.borderWidth;
    this.borderLines = [left, right, bottom];
  }
  draw() {
    this.p.push();
    this.p.noStroke();
    this.p.fill(100, 255);
    this.p.rect(this.x, this.y, this.width, this.height);
    this.p.pop();
    this.borderLines.forEach((l) => l.draw());
  }
  getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
  bounce(ball: Ball) {
    const ballBounds = ball.getBounds();
    const [left, right, bottom] = this.borderLines;
    [left, right].forEach((vertLine) => {
      if (intersects(ballBounds, vertLine.getBounds())) {
        if (ball.pos.x === vertLine.pos.x) {
          if (Math.abs(ball.vel.y) < 0.1 && Math.abs(ball.vel.x) < 0.1) {
            ball.vel.x = Math.random() * 0.02 - 0.01;
          }
          ball.vel.y *= -0.9;
          ball.pos.y = vertLine.pos.y - ball.r;
        } else {
          ball.vel.x *= -0.9;
          const posRight = Math.sign(ball.pos.x - vertLine.pos.x);
          ball.pos.x = vertLine.pos.x + posRight * ball.r;
        }
      }
    });
  }
}
