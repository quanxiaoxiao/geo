import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  coordinate,
  center,
  zoom,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const [x, y] = projection(coordinate);
  const r = 12;
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
  ctx.fillStyle = '#0f89f5';
  ctx.beginPath();
  ctx.arc(x, y, r - 2, 0, 2 * Math.PI);
  ctx.fill();
};
