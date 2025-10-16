import assert from 'node:assert';

import * as turf from '@turf/turf';

import checkCoordinateValidate from '../utils/checkCoordinateValidate.mjs';
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
  checkCoordinateValidate(center);
  assert(typeof radius === 'number');
  assert(radius > 0);
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
