import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  coordinate,
  center,
  zoom,
  radius = 12,
  shadowBlur = 4,
  fill = '#0f89f5',
  shadowColor = '#000',
  strokeColor = '#fff',
  strokeWidth = 2,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  let x = width / 2;
  let y = height / 2;
  if (coordinate) {
    [x, y] = projection(coordinate);
  }
  ctx.save();
  ctx.shadowBlur = shadowBlur;
  ctx.fillStyle = strokeColor;
  ctx.shadowColor = shadowColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius - strokeWidth, 0, 2 * Math.PI);
  ctx.fill();
};
