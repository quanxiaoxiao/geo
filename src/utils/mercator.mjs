import assert from 'node:assert';

import { geoMercator } from 'd3-geo';

import calcZoomToScale from './calcZoomToScale.mjs';
import checkCoordinate from './checkCoordinate.mjs';

export default ({
  center,
  zoom,
  width,
  height,
}) => {
  assert(
    typeof width === 'number' && width > 0,
    'width must be a positive number',
  );
  assert(
    typeof height === 'number' && height > 0,
    'height must be a positive number',
  );
  assert(
    typeof zoom === 'number' && zoom > 0,
    'zoom must be a positive number',
  );

  checkCoordinate(center);

  const projection = geoMercator()
    .scale(calcZoomToScale(zoom))
    .center(center)
    .translate([width / 2, height / 2]);
  return projection;
};
