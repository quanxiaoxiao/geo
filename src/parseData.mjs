import _ from 'lodash';
import valid from './utils/valid.mjs';
import {
  schemaWithCoordinate,
  schemaWithLineStringOrMultiPoint,
  schemaWithPolygon,
} from './schemas.mjs';

const parseData = (data) => {
  const validate = valid(data);
  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      if (Array.isArray(data[0][0])) {
        if (!validate(schemaWithPolygon)) {
          return null;
        }
        return {
          type: 'Polygon',
          coordinates: data,
        };
      }
      if (!validate(schemaWithLineStringOrMultiPoint)) {
        return null;
      }
      return {
        type: 'LineString',
        coordinates: data,
      };
    }
    if (!validate(schemaWithCoordinate)) {
      return null;
    }
    return {
      type: 'Point',
      coordinates: data,
    };
  }
  if (!_.isPlainObject(data)) {
    return null;
  }
  if (!validate({
    type: 'object',
    properties: {
      type: {
        enum: [
          'Point',
          'LineString',
          'Polygon',
          'MultiPoint',
          'MultiLineString',
          'MultiPolygon',
        ],
      },
      coordinates: {
        type: 'array',
        minItems: 1,
      },
    },
    required: ['type', 'coordinates'],
  })) {
    return null;
  }
  if (['Point', 'LineString', 'Polygon'].includes(data.type)) {
    const v = parseData(data.coordinates);
    if (!v) {
      return null;
    }
    if (v.type !== data.type) {
      return null;
    }
    return {
      ...data,
      coordinates: v.coordinates,
    };
  }
  if (['MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(data.type)) {
    const result = [];
    const type = data.type.match(/^Multi(Point|LineString|Polygon)$/)[1];
    for (let i = 0; i < data.coordinates.length; i++) {
      const coordinates = data.coordinates[i];
      const v = parseData(coordinates);
      if (!v) {
        return null;
      }
      if (v.type !== type) {
        return null;
      }
      result.push(v.coordinates);
    }

    return {
      type: data.type,
      coordinates: result,
    };
  }
  return null;
};

export default (data) => {
  if (Array.isArray(data)) {
    return parseData(data);
  }
  if (!_.isPlainObject(data)) {
    return null;
  }
  if (data.type === 'GeometryCollection') {
    if (!Array.isArray(data.geometries) || _.isEmpty(data.geometries)) {
      return null;
    }
    const geometries = [];
    for (let i = 0; i < data.geometries.length; i++) {
      const geometry = data.geometries[i];
      if (!_.isPlainObject(geometry)) {
        return null;
      }
      const v = parseData(geometry);
      if (!v) {
        return null;
      }
      geometries.push(v);
    }
    return {
      type: 'GeometryCollection',
      geometries,
    };
  }
  return parseData(data);
};
