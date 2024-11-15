import p5 from 'p5';

import { Ball } from './ball';
import { Aquarium } from './aquarium';
import { Line } from './line';
import { intersects } from './utils';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const balls: Ball[] = [];
let dragC = 0.2;
let frictionMag = 0.2;
let lines: Line[];
let aquarium: Aquarium;
let floor: Line[];
let windLines = [];

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(Math.min(window.innerWidth, 800), window.innerHeight - 10, undefined, canvas);
        let offset = 0;
        for (let i = 0; i < 25; i++) {
            const mass = Math.random() * 5 + 3;
            offset = offset + p.sqrt(mass) * 20 + 80;
            const row = Math.floor(offset / p.width);
            const b = new Ball(p, offset % p.width, -row * 200, mass);
            b.vel.set(Math.random() * 2 - 1, Math.random());
            balls.push(b);
        }

        const l1 = new Line(p, 0, p.height / 2 - 250, 200);
        l1.rotation = (30 * Math.PI) / 180;
        const l2 = new Line(p, p.width, p.height / 2 - 250, 200);
        l2.rotation = (150 * Math.PI) / 180;
        lines = [l1, l2];

        floor = [
            new Line(p, 0, p.height - 8, p.width / 2 - 80),
            new Line(p, p.width / 2 + 80, p.height - 8, p.width / 2 - 80),
        ];

        balls.forEach((obj) => obj.show());
        aquarium = new Aquarium({ p, width: p.width * 0.5, height: p.height / 3, y: p.height - p.height / 3 - 90 });
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
        floor.forEach((line) => line.draw());

        let gravity = p.createVector(0, 0.15);
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            let weight = p5.Vector.mult(gravity, ball.mass);
            ball.applyForce(weight);

            if (intersects(ball.getBounds(), aquarium.getBounds())) {
                ball.drag(dragC);
                ball.opacity -= 0.008;
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

            ball.friction(frictionMag);
            ball.update();
            ball.edges();
            for (let j = i + 1; j < balls.length; j++) {
                const ball1 = balls[j];
                ball.checkCollusion(ball1);
            }
            aquarium.bounce(ball);
            if (ball.opacity <= 0 || ball.pos.y > p.height) {
                ball.opacity = 1;
                ball.pos.set(Math.random() * p.width, -50 * i);
            }

            ball.show();
        }
    };
};

const P5 = new p5(sketch);
