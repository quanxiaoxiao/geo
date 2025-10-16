import assert from 'node:assert';

export default (coordinate) => {
  assert(coordinate[0] >= -180 && coordinate[0] <= 180);
  assert(coordinate[1] >= -180 && coordinate[1] <= 180);
};
