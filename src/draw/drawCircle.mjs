import circleToPolygon from 'circle-to-polygon';
import mercator from '../utils/mercator.mjs';

export default ({
  ctx,
  center,
  coordinate,
  zoom,
  radius,
  fill,
  strokeWidth,
  strokeColor,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const { coordinates: [coordinates] } = circleToPolygon(coordinate, radius, {
    numberOfEdges: 128,
  });
  if (fill) {
    ctx.fillStyle = fill;
  }
  if (strokeWidth) {
    ctx.strokeStyle = strokeColor || '#000';
    ctx.lineWidth = strokeWidth;
  } else if (strokeColor) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor;
  }
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < coordinates.length; i++) {
    const [x, y] = projection(coordinates[i]);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (strokeWidth || strokeColor) {
    ctx.stroke();
  }
  ctx.restore();
};
