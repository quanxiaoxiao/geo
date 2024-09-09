import test from 'node:test';
import assert from 'node:assert';
import parseData from './parseData.mjs';

test('parseData coordinate', () => {
  assert.equal(parseData([]), null);
  assert.equal(parseData([22.3]), null);
  assert.equal(parseData(['22.3', '22.5']), null);
  assert.equal(parseData([22.3, 44.6, 34]), null);
  assert.equal(parseData(['44.6', 34]), null);
  assert.equal(parseData([188, 99]), null);
  assert.equal(parseData([-181, 99]), null);

  assert.deepEqual(parseData([22.3, 44.6]), {
    type: 'Point',
    coordinates: [22.3, 44.6],
  });
  assert.deepEqual(parseData([0, 180]), {
    type: 'Point',
    coordinates: [0, 180],
  });
  assert.deepEqual(parseData([-180, 180]), {
    type: 'Point',
    coordinates: [-180, 180],
  });
});

test('parseData LineString', () => {
  assert.equal(parseData([[]]), null);
  assert.equal(parseData([[22]]), null);
  assert.equal(parseData([[22, 33, 44]]), null);
  assert.equal(parseData([['22', 33]]), null);
  assert.equal(parseData([[22, 33], [22, 33, 44]]), null);
  assert.equal(parseData([[22, 33], []]), null);
  assert.equal(parseData([[22, 33], [33]]), null);
  assert.equal(parseData([
    [22, 33],
    [[22, 33]],
  ]), null);

  assert.deepEqual(parseData([[22, 33]]), {
    type: 'LineString',
    coordinates: [[22, 33]],
  });
  assert.deepEqual(parseData([[22, 33], [44, 55], [55, 66]]), {
    type: 'LineString',
    coordinates: [[22, 33], [44, 55], [55, 66]],
  });
});

test('parseData Polygon', () => {
  assert.equal(parseData([[[]]]), null);
  assert.equal(parseData([[[22]]]), null);
  assert.equal(parseData([[[22, 33, 44]]]), null);
  assert.equal(parseData([[[22, 33], [22]]]), null);
  assert.equal(parseData([[[22, 33], [22, 33, 44]]]), null);
  assert.equal(parseData([
    [[22, 33], [22, 33]],
    [[22, 33], [22, 33, 44]],
  ]), null);
  assert.equal(parseData([
    [[22, 33], [22, 33]],
    [],
  ]), null);
  assert.equal(parseData([
    [[22, 33], [22, 33]],
    null,
  ]), null);

  assert.equal(parseData([
    [[22, 33], [33, 44]],
    [22, 33],
  ]), null);

  assert.deepEqual(parseData([[[22, 33], [33, 44]]]), {
    type: 'Polygon',
    coordinates: [[[22, 33], [33, 44]]],
  });
  assert.deepEqual(parseData([
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

test('parseData geoJSON Point', () => {
  assert.equal(parseData({}), null);
  assert.equal(parseData({
    type: 'Point',
  }), null);
  assert.equal(parseData({
    type: 'Point',
    coordinates: [],
  }), null);
  assert.equal(parseData({
    type: 'Point',
    coordinates: [22, 44, 55],
  }), null);
  assert.equal(parseData({
    type: 'Point',
    coordinates: [[22, 44]],
  }), null);
  assert.equal(parseData({
    type: 'Point',
    coordinates: [181, 33],
  }), null);

  assert.deepEqual(parseData({
    type: 'Point',
    coordinates: [22, 44],
  }), {
    type: 'Point',
    coordinates: [22, 44],
  });
});

test('parseData geoJSON LineString', () => {
  assert.equal(parseData({
    type: 'LineString',
    coordinates: [22, 44],
  }), null);
  assert.equal(parseData({
    type: 'LineString',
    coordinates: [[[22, 33], [33, 44]]],
  }), null);

  assert.deepEqual(parseData({
    type: 'LineString',
    coordinates: [[22, 44]],
  }), {
    type: 'LineString',
    coordinates: [[22, 44]],
  });
});

test('parseData geoJSON MultiPoint', () => {
  assert.equal(parseData({
    type: 'MultiPoint',
    coordinates: [22, 44],
  }), null);
  assert.equal(parseData({
    type: 'MultiPoint',
    coordinates: [[[22, 33], [33, 44]]],
  }), null);
  assert.equal(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44], [[22, 33]]],
  }), null);

  assert.deepEqual(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44]],
  }), {
    type: 'MultiPoint',
    coordinates: [[22, 44]],
  });
  assert.deepEqual(parseData({
    type: 'MultiPoint',
    coordinates: [[22, 44], [22, 33]],
  }), {
    type: 'MultiPoint',
    coordinates: [[22, 44], [22, 33]],
  });
});

test('parseData geoJSON GeometryCollection', () => {
  assert.equal(parseData({
    type: 'GeometryCollection',
  }), null);
  assert.equal(parseData({
    type: 'GeometryCollection',
    geometries: [],
  }), null);

  assert.equal(parseData({
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [22, 33, 44],
      },
    ],
  }), null);

  assert.deepEqual(parseData({
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
  assert.equal(parseData({
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

  assert.deepEqual(parseData({
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
  assert.equal(parseData({
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
