import circleToPolygon from 'circle-to-polygon';
import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  center,
  coordinate,
  zoom,
  radius,
  options,
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
  ctx.fillStyle = options.circleFillColor;
  if (options.circleStrokeWidth) {
    ctx.strokeStyle = options.circleStrokeColor;
    ctx.lineWidth = options.circleStrokeWidth;
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
  ctx.fill();
  if (options.circleStrokeWidth) {
    ctx.stroke();
  }
  ctx.restore();
  if (options.circlePointRadius) {
    ctx.fillStyle = options.circlePointFillColor;
    const [x, y] = projection(center);
    ctx.beginPath();
    ctx.arc(x, y, options.circlePointRadius, 0, Math.PI * 2);
    ctx.fill();
  }
};
