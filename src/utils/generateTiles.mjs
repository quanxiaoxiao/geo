export default ({
  zoom,
  x1,
  y1,
  x2,
  y2,
}) => {
  const result = [];

  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      result.push({
        x,
        y,
        z: zoom,
      });
    }
  }
  return result;
};
