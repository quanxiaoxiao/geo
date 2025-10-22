export default (bbox, projection) => {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const p1 = projection([minLon, minLat]);
  const p2 = projection([maxLon, maxLat]);
  const width = Math.abs(p2[0] - p1[0]);
  const height = Math.abs(p2[1] - p1[1]);
  return width / height;
};
