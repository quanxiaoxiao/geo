import assert from 'node:assert';
import circleToPolygon from 'circle-to-polygon';
import drawPolygon from './drawPolygon.mjs';

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
  assert(typeof radius === 'number');
  assert(radius > 0);
  const { coordinates: [coordinates] } = circleToPolygon(coordinate, radius, {
    numberOfEdges: 128,
  });
  drawPolygon({
    ctx,
    center,
    zoom,
    coordinates: [coordinates.reverse()],
    fill,
    strokeWidth,
    strokeColor,
  });
};
