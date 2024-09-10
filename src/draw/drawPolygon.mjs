import { geoPath } from 'd3-geo';
import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  fill = 'rgba(255, 255, 0, 0.3)',
  strokeWidth,
  strokeColor,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    zoom,
    center,
    width,
    height,
  });
  ctx.fillStyle = fill;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  geoPath()
    .projection(projection)
    .context(ctx)({
      type: 'Polygon',
      coordinates,
    });
  ctx.closePath();
  ctx.fill();
  if (strokeWidth) {
    ctx.strokeStyle = strokeColor || '#000';
    ctx.lineWidth = strokeWidth;
  } else if (strokeColor) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor;
  }
  if (strokeWidth || strokeColor) {
    ctx.stroke();
  }
};
