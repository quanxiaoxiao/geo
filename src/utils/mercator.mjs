import assert from 'node:assert';
import { geoMercator } from 'd3-geo';
import calcZoomToScale from './calcZoomToScale.mjs';

export default ({
  center,
  zoom,
  width,
  height,
}) => {
  assert(typeof width === 'number');
  assert(typeof height === 'number');
  assert(width > 0 && height > 0);
  const projection = geoMercator()
    .scale(calcZoomToScale(zoom))
    .center(center)
    .translate([width / 2, height / 2]);
  return projection;
};
