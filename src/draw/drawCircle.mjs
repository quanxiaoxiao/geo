import assert from 'node:assert';

import rewind from '@turf/rewind';
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
  strokeDashArray,
}) => {
  checkCoordinate(center);
  assert(typeof radius === 'number' && radius > 0, 'radius 必须是大于 0 的数字');
  if (coordinate) {
    checkCoordinate(coordinate);
  }
  const circleCenter = coordinate || center;
  const circle = turf.circle(
    circleCenter,
    radius,
    { units: 'meters', steps: 840 },
  );
  drawPolygon({
    ctx,
    center,
    zoom,
    coordinates: rewind(circle, { reverse: true }).geometry.coordinates,
    fill,
    strokeWidth,
    strokeColor,
    strokeDashArray,
  });
};
