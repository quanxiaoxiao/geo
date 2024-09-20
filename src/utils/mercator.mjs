import { geoMercator } from 'd3-geo';
import calcZoomToScale from './calcZoomToScale.mjs';

export default ({
  center,
  zoom,
  width,
  height,
}) => {
  const projection = geoMercator()
    .scale(calcZoomToScale(zoom))
    .center(center)
    .translate([width / 2, height / 2]);
  return projection;
};
