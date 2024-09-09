import assert from 'node:assert';
import KDBush from 'kdbush';
import { geoMercator } from 'd3-geo';
import {
  TILE_SIZE,
  EARTH_RADIUS,
} from '../constants.mjs';

const { PI } = Math;

export const calcLngAtTileX = (lng, zoom) => ((lng + 180) % 360) / 360 * (2 ** zoom);

export const calcLatAtTileY = (lat, zoom) => (1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * (2 ** zoom);

export const calcTileXAtLng = (lng, z) => lng / (2 ** z) * 360 - 180;

export const isPointInChina = (coordinate) => {
  const [lng, lat] = coordinate;
  assert(typeof lng === 'number' && typeof lat === 'number');
  const bbox = [
    [73.6753792663, 18.197700914],
    [135.026311477, 53.4588044297],
  ];
  if (lng < bbox[0][0]) {
    return false;
  }
  if (lng > bbox[1][0]) {
    return false;
  }
  if (lat < bbox[0][1]) {
    return false;
  }
  if (lat > bbox[1][1]) {
    return false;
  }
  return true;
};


export const calcTileYAtLat = (lat, z) => {
  const n = PI - 2 * PI * lat / (2 ** z);
  return (180 / PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
};

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


export const getBoundsByPolygon = (polygon) => {
  let x1 = -Infinity;
  let y1 = -Infinity;
  let x2 = Infinity;
  let y2 = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const coordinates = polygon[i];
    for (let j = 0; j < coordinates.length; j++) {
      const coordinate = coordinates[j];
      const [lng, lat] = coordinate;
      if (lng > x1) {
        x1 = lng;
      }
      if (lng < x2) {
        x2 = lng;
      }
      if (lat > y1) {
        y1 = lat;
      }
      if (lat < y2) {
        y2 = lat;
      }
    }
  }
  assert(x1 !== -Infinity && x2 !== Infinity && y1 !== -Infinity && y2 !== Infinity);
  return [[x1, y2], [x2, y1]];
};

