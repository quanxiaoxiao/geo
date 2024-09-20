import mercator from '../utils/mercator.mjs';

export default ({
  ctx,
  center,
  zoom,
  coordinate,
  fill = '#f00',
  radius = 5,
  strokeColor,
  strokeWidth,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const [x, y] = projection(coordinate);
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
  ctx.beginPath();
  if (strokeWidth) {
    ctx.strokeStyle = strokeColor || '#000';
    ctx.strokeWidth = strokeWidth;
  } else if (strokeColor) {
    ctx.strokeWidth = 1;
    ctx.strokeStyle = strokeColor;
  }
  if (strokeWidth || strokeColor) {
    ctx.arc(x, y, radius  - strokeWidth, 0, 2 * Math.PI);
    ctx.stroke();
  }
};
