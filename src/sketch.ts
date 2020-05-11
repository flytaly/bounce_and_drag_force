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
      if (intersects(ball.getBounds(), aquarium.getBounds())) {
        ball.drag(dragC);
      } else {
        if (p.mouseIsPressed) {
          let wind = p.createVector(0.9, 0);
          ball.applyForce(wind);
        }
      }
      lines.forEach((line) => line.bounce(ball));
      aquarium.bounce(ball);
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
