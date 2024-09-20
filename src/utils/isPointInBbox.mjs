import checkBbox from './checkBbox.mjs';

export default (coordinate, bbox) => {
  checkBbox(bbox);
  const [lng, lat] = coordinate;
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
