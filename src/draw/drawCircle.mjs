import circleToPolygon from 'circle-to-polygon';
import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  center,
  coordinate,
  zoom,
  radius,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const { coordinates: [coordinates] } = circleToPolygon(coordinate, radius, {
    numberOfEdges: 124,
  });
  ctx.fillStyle = 'rgba(0, 0, 233, 0.8)';
  ctx.strokeStyle = '#000';
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
  ctx.stroke();
  ctx.fill();
};
