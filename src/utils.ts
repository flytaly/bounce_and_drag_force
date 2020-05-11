export type rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const intersects = (rectA: rectangle, rectB: rectangle) => {
  return !(
    rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y
  );
};
