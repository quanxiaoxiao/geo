import { randomUUID } from 'node:crypto';
import {
  calcDist,
  makeIndex,
} from './index.mjs';

const PRECISION = 1000;
const EARTH_RADIUS = 6371 * 1000;

const filterSafeDistance = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (result.every((pre) => {
      const dist = calcDist(
        pre.coordinate[0],
        pre.coordinate[1],
        item.coordinate[0],
        item.coordinate[1],
      );
      return dist >= (item.radius + pre.radius);
    })) {
      result.push(item);
    }
  }
  return result;
};

const calcClusterPoints = ({
  list,
  radius,
  minSize,
  bounds,
}) => {
  const index = makeIndex(list, (d) => d.coordinate);
  const x1 = Math.floor(bounds[0][0] * PRECISION);
  const y1 = Math.ceil(bounds[0][1] * PRECISION);
  const x2 = Math.ceil(bounds[1][0] * PRECISION);
  const y2 = Math.floor(bounds[1][1] * PRECISION);
  const clusterList = [];
  const r = radius / (Math.PI * 2 * EARTH_RADIUS) * 360;
  for (let i = x1; i < x2; i++) {
    for (let j = y2; j < y1; j++) {
      const lng = i / PRECISION;
      const lat = j / PRECISION;
      const result = index.within(lng, lat, r);
      const size = result.length;
      if (size > minSize) {
        clusterList.push({
          x: i,
          y: j,
          coordinate: [lng, lat],
          size,
          list: result,
        });
      }
    }
  }
  clusterList.sort((a, b) => {
    if (a.size === b.size) {
      return 0;
    }
    if (a.size > b.size) {
      return -1;
    }
    return 1;
  });
  const clusterIndex = makeIndex(clusterList, (d) => d.coordinate);
  const excludeList = [];
  const result = [];
  for (let i = 0; i < clusterList.length; i++) {
    const clusterItem = clusterList[i];
    if (!excludeList.includes(i)) {
      result.push({
        uuid: randomUUID(),
        coordinate: clusterItem.coordinate,
        radius: Math.max(...clusterItem.list.map((n) => calcDist(
          clusterItem.coordinate[0],
          clusterItem.coordinate[1],
          list[n].coordinate[0],
          list[n].coordinate[1],
        ))),
      });
      excludeList.push(...clusterIndex.within(clusterItem.coordinate[0], clusterItem.coordinate[1], r));
    }
  }
  return filterSafeDistance(result);
};

export default calcClusterPoints;
