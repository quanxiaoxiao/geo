export default (coordinate1, coordinate2) => {
  const [x1, y1] = coordinate1;
  const [x2, y2] = coordinate2;
  const diffX = Math.abs(x1 - x2);
  const diffY = Math.abs(y1 - y2);
  return Math.sqrt(diffX * diffX + diffY * diffY);
};
