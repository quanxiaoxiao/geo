import assert from 'node:assert';

import * as turf from '@turf/turf';

import checkCoordinate from '../utils/checkCoordinate.mjs';
import drawPolygon from './drawPolygon.mjs';

export default ({
  ctx,
  center,
  coordinate,
  zoom,
  radius,
  strokeWidth = 1,
  fill = 'rgba(23, 145, 253, 0.3)',
  strokeColor = 'rgba(23, 145, 253, 1)',
}) => {
  checkCoordinate(center);
  assert(typeof radius === 'number');
  assert(radius > 0);
  if (coordinate) {
    checkCoordinate(coordinate);
  }
  const circle = turf.circle(coordinate || center, radius, { units: 'meters', steps: 840 });
  drawPolygon({
    ctx,
    center,
    zoom,
    coordinates: [circle.geometry.coordinates[0].reverse()],
    fill,
    strokeWidth,
    strokeColor,
  });
};
