import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  coordinates,
  center,
  zoom,
}) => {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = '#f00';
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    const r = 3;
    const [x, y] = projection(coordinate);
    if (x < -r || y < -r) {
      continue;
    }
    if (x > width + r) {
      continue;
    }
    if (y > height + r) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
};
