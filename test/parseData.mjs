import test from 'ava'; // eslint-disable-line import/no-unresolved
import parseData from '../src/parseData.mjs';

test('parseData coordinate', (t) => {
  t.is(parseData([]), null);
  t.is(parseData([22.3]), null);
  t.is(parseData(['22.3', '22.5']), null);
  t.is(parseData([22.3, 44.6, 34]), null);
  t.is(parseData(['44.6', 34]), null);
  t.is(parseData([188, 99]), null);
  t.is(parseData([-181, 99]), null);

  t.deepEqual(parseData([22.3, 44.6]), {
    type: 'Point',
    coordinates: [22.3, 44.6],
  });
  t.deepEqual(parseData([0, 180]), {
    type: 'Point',
    coordinates: [0, 180],
  });
  t.deepEqual(parseData([-180, 180]), {
    type: 'Point',
    coordinates: [-180, 180],
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
  t.is(parseData([
    [22, 33],
    [[22, 33]],
  ]), null);

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

  t.is(parseData([
    [[22, 33], [33, 44]],
    [22, 33],
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

test('parseData geoJSON Point', (t) => {
  t.is(parseData({}), null);
  t.is(parseData({
    type: 'Point',
  }), null);
  t.is(parseData({
    type: 'Point',
    coordinates: [],
  }), null);
  t.is(parseData({
    type: 'Point',
    coordinates: [22, 44, 55],
  }), null);
  t.is(parseData({
    type: 'Point',
    coordinates: [[22, 44]],
  }), null);
  t.is(parseData({
    type: 'Point',
    coordinates: [181, 33],
  }), null);

  t.deepEqual(parseData({
    type: 'Point',
    coordinates: [22, 44],
  }), {
    type: 'Point',
    coordinates: [22, 44],
  });
});

test('parseData geoJSON LineString', (t) => {
  t.is(parseData({
    type: 'LineString',
    coordinates: [22, 44],
  }), null);
  t.is(parseData({
    type: 'LineString',
    coordinates: [[[22, 33], [33, 44]]],
  }), null);

  t.deepEqual(parseData({
    type: 'LineString',
    coordinates: [[22, 44]],
  }), {
    type: 'LineString',
    coordinates: [[22, 44]],
  });
});

test('parseData geoJSON MultiPoint', (t) => {
  t.is(parseData({
    type: 'MultiPoint',
    coordinates: [22, 44],
  }), null);
  t.is(parseData({
    type: 'MultiPoint',
    coordinates: [[[22, 33], [33, 44]]],
  }), null);
  t.is(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44], [[22, 33]]],
  }), null);

  t.deepEqual(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44]],
  }), {
    type: 'MultiPoint',
    coordinates: [[22, 44]],
  });
  t.deepEqual(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44], [22, 33]],
  }), {
    type: 'MultiPoint',
    coordinates: [[22, 44], [22, 33]],
  });
});

test('parseData geoJSON GeometryCollection', (t) => {
  t.is(parseData({
    type: 'GeometryCollection',
  }), null);
  t.is(parseData({
    type: 'GeometryCollection',
    geometries: [],
  }), null);

  t.is(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33, 44],
      },
    ],
  }), null);

  t.deepEqual(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
    ],
  }), {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
    ],
  });
  t.is(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
      {
        type: 'LineString',
        coordinates: [22, 33],
      },
    ],
  }), null);

  t.deepEqual(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
      {
        type: 'LineString',
        coordinates: [[22, 33]],
      },
    ],
  }), {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
      {
        type: 'LineString',
        coordinates: [[22, 33]],
      },
    ],
  });
  t.is(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33],
      },
      {
        type: 'MultiPoint',
        coordinates: [[22, 33], [[22, 33]]],
      },
    ],
  }), null);
});
