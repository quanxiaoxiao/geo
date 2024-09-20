import assert from 'node:assert';

export default (bbox) => {
  assert(Array.isArray(bbox));
  assert(bbox.length === 2);
  assert(bbox[0].length === 2 && bbox[1].length === 2);
  const x1 = bbox[0][0];
  const y1 = bbox[0][1];
  const x2 = bbox[1][0];
  const y2 = bbox[1][1];
  assert(typeof x1 === 'number');
  assert(typeof x2 === 'number');
  assert(typeof y1 === 'number');
  assert(typeof y2 === 'number');
  assert(x1 <= x2);
  assert(y1 <= y2);
};
