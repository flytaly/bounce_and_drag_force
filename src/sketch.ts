import p5 from 'p5';
import { Ball } from './ball';
import { Aquarium } from './aquarium';
import { Line } from './line';
import { intersects } from './utils';

const balls: Ball[] = [];
let dragC = 0.2;
let frictionMag = 0.1;
let lines: Line[] = [];
let aquarium: Aquarium;
let windLines = [];

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    for (let i = 0; i < 50; i++) {
      balls.push(new Ball(p, Math.random() * p.width, 10, Math.random() * 6 + 2));
    }

    const l1 = new Line(p, 0, p.height / 2 - 200, 200);
    l1.rotation = (30 * Math.PI) / 180;
    lines.push(l1);
    const l2 = new Line(p, p.width, p.height / 2 - 200, 200);
    l2.rotation = (150 * Math.PI) / 180;
    lines.push(l2);

    balls.forEach((obj) => obj.show());
    aquarium = new Aquarium(p, p.width / 2, p.height / 3);
    for (let i = 0; i < 40; i++) {
      const obj = {
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        width: Math.random() * 4,
      };
      windLines.push(obj);
    }
  };

  p.draw = () => {
    p.background(20);
    aquarium.draw();

    lines.forEach((line) => line.draw());

    let gravity = p.createVector(0, 0.2);
    for (let ball of balls) {
      let weight = p5.Vector.mult(gravity, ball.mass);
      ball.applyForce(weight);
      ball.friction(frictionMag);
      aquarium.bounce(ball);
      if (intersects(ball.getBounds(), aquarium.getBounds())) {
        ball.drag(dragC);
      } else {
        if (p.mouseIsPressed) {
          let wind = p.createVector(0.9, 0);
          ball.applyForce(wind);
          p.stroke('grey');
          p.strokeWeight(1);
          windLines.forEach((element) => {
            element.x = (element.x + wind.x) % p.width;
            p.line(element.x, element.y, element.x + element.width, element.y);
          });
        }
      }
      lines.forEach((line) => line.bounce(ball));
      ball.update();
      ball.edges();
      ball.show();
      if (ball.pos.y + ball.r >= p.height && Math.abs(ball.vel.y) < 1.5) {
        ball.pos.set(Math.random() * p.width, 10);
      }
    }
  };
};

const P5 = new p5(sketch);
