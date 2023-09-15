import test from 'ava'; // eslint-disable-line import/no-unresolved
import parseData from '../src/parseData.mjs';

test('parseData point', (t) => {
  t.is(parseData([]), null);
  t.is(parseData([22.3]), null);
  t.is(parseData(['22.3', '22.5']), null);
  t.is(parseData([22.3, 44.6, 34]), null);
  t.is(parseData(['44.6', 34]), null);

  t.deepEqual(parseData([22.3, 44.6]), {
    type: 'Point',
    coordinates: [22.3, 44.6],
  });
});

test('parseData LineString', (t) => {
  t.is(parseData([[]]), null);
  t.is(parseData([[22]]), null);
  t.is(parseData([[22, 33, 44]]), null);
  t.is(parseData([['22', 33]]), null);
  t.is(parseData([[22, 33], [22, 33, 44]]), null);
  t.is(parseData([[22, 33], []]), null);
  t.is(parseData([[22, 33], [33]]), null);

  t.deepEqual(parseData([[22, 33]]), {
    type: 'LineString',
    coordinates: [[22, 33]],
  });
  t.deepEqual(parseData([[22, 33], [44, 55], [55, 66]]), {
    type: 'LineString',
    coordinates: [[22, 33], [44, 55], [55, 66]],
  });
});

test('parseData Polygon', (t) => {
  t.is(parseData([[[]]]), null);
  t.is(parseData([[[22]]]), null);
  t.is(parseData([[[22, 33, 44]]]), null);
  t.is(parseData([[[22, 33], [22]]]), null);
  t.is(parseData([[[22, 33], [22, 33, 44]]]), null);
  t.is(parseData([
    [[22, 33], [22, 33]],
    [[22, 33], [22, 33, 44]],
  ]), null);
  t.is(parseData([
    [[22, 33], [22, 33]],
    [],
  ]), null);
  t.is(parseData([
    [[22, 33], [22, 33]],
    null,
  ]), null);

  t.deepEqual(parseData([[[22, 33], [33, 44]]]), {
    type: 'Polygon',
    coordinates: [[[22, 33], [33, 44]]],
  });
  t.deepEqual(parseData([
    [[22, 33], [22, 33]],
    [[22, 33], [22, 33], [44, 66]],
  ]), {
    type: 'Polygon',
    coordinates: [
      [[22, 33], [22, 33]],
      [[22, 33], [22, 33], [44, 66]],
    ],
  });
});
