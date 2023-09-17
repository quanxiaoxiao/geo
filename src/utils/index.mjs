import KDBush from 'kdbush';
import { geoMercator } from 'd3-geo';
import { TILE_SIZE } from '../constants.mjs';

const { PI } = Math;

export const calcLngAtTileX = (lng, zoom) => (lng + 180) / 360 * (2 ** zoom);

export const calcLatAtTileY = (lat, zoom) => (1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * (2 ** zoom);

export const calcTileXAtLng = (x, z) => x / (2 ** z) * 360 - 180;

export const calcTileYAtLat = (y, z) => {
  const n = PI - 2 * PI * y / 2 ** z;
  return (180 / PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
};

export const mercator = ({
  center,
  zoom,
  width,
  height,
}) => {
  const scale = (2 ** zoom) * TILE_SIZE / Math.PI / 2;
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
