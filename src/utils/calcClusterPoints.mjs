import assert from 'node:assert';

import calcCenter from './calcCenter.mjs';
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
  bbox = [
    [120.8629336227, 28.85623288],
    [122.27497, 30.491992],
  ],
}) => {
  const index = makeIndex(list, (d) => d.coordinate);
  const x1 = Math.floor(bbox[0][0] * PRECISION);
  const y1 = Math.ceil(bbox[0][1] * PRECISION);
  const x2 = Math.ceil(bbox[1][0] * PRECISION);
  const y2 = Math.floor(bbox[1][1] * PRECISION);
  assert(x1 < x2);
  assert(y1 < y2);
  const clusterList = [];
  const r = radius / (Math.PI * 2 * EARTH_RADIUS) * 360;
  const rr = r * 0.68;
  for (let i = x1; i < x2; i++) {
    for (let j = y1; j < y2; j++) {
      const lng = i / PRECISION;
      const lat = j / PRECISION;
      const result = index.within(lng, lat, rr);
      const size = result.length;
      if (size >= minSize) {
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
        coordinate: clusterItem.coordinate,
        radius: Math.max(...clusterItem.list.map((n) => calcDist(
          clusterItem.coordinate[0],
          clusterItem.coordinate[1],
          list[n].coordinate[0],
          list[n].coordinate[1],
        ))),
      });
      excludeList.push(...clusterIndex.within(clusterItem.coordinate[0], clusterItem.coordinate[1], rr));
    }
  }
  const rangeList = filterSafeDistance(result);
  const dataList = [];
  for (let i = 0; i < rangeList.length; i++) {
    const rangeItem = rangeList[i];
    const arr = index
      .within(rangeItem.coordinate[0], rangeItem.coordinate[1], r)
      .map((n) => list[n]);
    const center = calcCenter(arr);
    if (center) {
      const pointList = index.within(center[0], center[1], r).map((n) => list[n]);
      const ii = pointList.length;
      if (ii >= minSize) {
        dataList.push({
          coordinate: center,
          r: rr,
          radius,
          list: pointList,
        });
      }
    }
  }
  return dataList;
};

export default calcClusterPoints;
