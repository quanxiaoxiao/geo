import { EARTH_RADIUS } from '../constants.mjs';

const angle2Radian = (angle) => angle * Math.PI / 180;

export default (coordinate1, coordinate2) => {
  const dLat = angle2Radian(coordinate2[1] - coordinate1[1]);
  const dLon = angle2Radian(coordinate2[0] - coordinate1[0]);
  const lat1 = angle2Radian(coordinate1[1]);
  const lat2 = angle2Radian(coordinate2[1]);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};

