import assert from 'node:assert';

import { geoMercator } from 'd3-geo';
import KDBush from 'kdbush';

import {
  EARTH_RADIUS,
  TILE_SIZE,
} from '../constants.mjs';

const { PI } = Math;

export const calcLngAtTileX = (lng, zoom) => ((lng + 180) % 360) / 360 * (2 ** zoom);

export const calcLatAtTileY = (lat, zoom) => (1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * (2 ** zoom);

export const calcTileXAtLng = (lng, z) => lng / (2 ** z) * 360 - 180;

export const mercator = ({
  center,
  zoom,
  width,
  height,
}) => {
  const scale = (2 ** zoom) * TILE_SIZE / (Math.PI * 2);
  const projection = geoMercator()
    .scale(scale)
    .center(center)
    .translate([width / 2, height / 2]);
  return projection;
};

export const calcDist = (x1, y1, x2, y2) => {
  const diffX = Math.abs(x1 - x2);
  const diffY = Math.abs(y1 - y2);
  return Math.sqrt(diffX * diffX + diffY * diffY);
};

export const makeIndex = (list, fn) => {
  const index = new KDBush(list.length);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (fn) {
      const [x, y] = fn(item);
      index.add(x, y);
    } else {
      index.add(item[0], item[1]);
    }
  }
  return index.finish();
};

export const getNeartest = (list, coordinate) => {
  let index = -1;
  let min = Infinity;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const dist = calcDist(
      coordinate[0],
      coordinate[1],
      item.coordinate[0],
      item.coordinate[1],
    );
    if (dist < min) {
      index = i;
      min = dist;
    }
  }
  if (index === -1) {
    return null;
  }
  return list[index];
};

export const calcPixelWidthByDistance = (dist, zoom, lat = 0) => {
  const r = Math.cos(lat * PI / 180) * EARTH_RADIUS;
  const w = 2 * r * PI;
  const s = dist / w;
  return (2 ** zoom) * 256 * s;
};

export const isPointInCoordinates = (point, vs) => {
  const x = point[0];
  const y = point[1];

  assert(typeof x === 'number' && typeof y === 'number');

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};
