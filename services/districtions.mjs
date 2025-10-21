import geoViewport from '@mapbox/geo-viewport';
import * as turf from '@turf/turf';
import gcoord from 'gcoord';

import {
  createCanvas,
  drawPolygon,
  drawTiles,
} from '../src/index.mjs';

export default async ({
  coordinates,
  width,
  height,
}) => {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates,
    },
  };
  const bbox = turf.bbox(geojson);
  const viewport = geoViewport.viewport(bbox, [width, height]);
  const center = gcoord.transform(
    viewport.center,
    gcoord.WGS84,
    gcoord.GCJ02,
  );
  const canvas = createCanvas({
    width,
    height,
  });
  const ctx = canvas.getContext('2d');

  await drawTiles({
    ctx,
    zoom: viewport.zoom,
    center,
  });

  drawPolygon({
    ctx,
    center,
    zoom: viewport.zoom,
    type: 'MultiPolygon',
    strokeWidth: 1,
    coordinates: gcoord.transform(geojson, gcoord.WGS84, gcoord.GCJ02).geometry.coordinates,
  });
  const buf = ctx.canvas.toBuffer('image/png');

  return buf;
};
