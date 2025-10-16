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
  ctx.save();
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const [x, y] = projection(coordinate);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  if (strokeWidth) {
    ctx.strokeStyle = strokeColor || '#000';
    ctx.strokeWidth = strokeWidth;
  } else if (strokeColor) {
    ctx.strokeWidth = 1;
    ctx.strokeStyle = strokeColor;
  }
  if (strokeWidth || strokeColor) {
    ctx.arc(x, y, radius - strokeWidth, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
};
