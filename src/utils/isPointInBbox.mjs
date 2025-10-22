export default (coord, bbox) => {
  const [x, y] = coord;
  const [minX, minY, maxX, maxY] = bbox;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};
