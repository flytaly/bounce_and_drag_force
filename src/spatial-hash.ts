import p5 from 'p5';
import { Bounds } from './types';

interface ObjWithBounds {
  getBounds(): Bounds;
}

export class SpatialHash<T extends ObjWithBounds> {
  CELL_SIZE: number;
  hash: Record<string, Set<T>>;

  constructor(cellSize: number) {
    this.CELL_SIZE = cellSize;
    this.hash = {};
  }

  getCellsId(bounds: Bounds) {
    const { x, y, width, height } = bounds;
    const edges = [
      [x, y], //
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ];
    return edges.map((e) => {
      const cellX = Math.floor(e[0] / this.CELL_SIZE);
      const cellY = Math.floor(e[1] / this.CELL_SIZE);
      return cellX + ',' + cellY;
    });
  }

  getNeighbors(obj: ObjWithBounds) {
    const keys = this.getCellsId(obj.getBounds());
    const neighbors = new Set<T>();
    keys.forEach((key) => {
      this.hash[key]?.forEach((o) => obj !== o && neighbors.add(o));
    });
    return neighbors;
  }

  add(obj: T) {
    const keys = this.getCellsId(obj.getBounds());
    keys.forEach((key) => {
      if (!this.hash[key]) this.hash[key] = new Set();
      this.hash[key].add(obj);
    });
  }

  update(prevBounds: Bounds, obj: T) {
    const prevKeys = this.getCellsId(prevBounds);
    const newKeys = this.getCellsId(obj.getBounds());
    prevKeys.forEach((key) => {
      this.hash[key]?.delete(obj);
    });
    newKeys.forEach((key) => {
      if (!this.hash[key]) this.hash[key] = new Set();
      this.hash[key].add(obj);
    });
  }

  drawCells(p: p5) {
    p.push();
    p.strokeWeight(1);
    p.stroke(150);
    for (let i = this.CELL_SIZE; i < p.width; i += this.CELL_SIZE) {
      p.line(i, 0, i, p.height);
      p.line(0, i, p.width, i);
    }
    p.fill(100, 150, 100, 60);
    Object.keys(this.hash).forEach((k) => {
      if (this.hash[k].size) {
        const [x, y] = k.split(',');
        p.rect(+x * this.CELL_SIZE, +y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
      }
    });
    p.pop();
  }
}
