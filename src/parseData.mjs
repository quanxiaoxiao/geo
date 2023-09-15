import Ajv from 'ajv';

const valid = (data) => {
  const ajv = new Ajv();
  return (schema) => ajv.compile(schema)(data);
};

const schemaWithCoordinate = {
  type: 'array',
  items: {
    type: 'number',
  },
  minItems: 2,
  maxItems: 2,
};

export default (data) => {
  const validate = valid(data);
  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      if (Array.isArray(data[0][0])) {
        if (!validate({
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            minItems: 1,
            items: schemaWithCoordinate,
          },
        })) {
          return null;
        }
        return {
          type: 'Polygon',
          coordinates: data,
        };
      }
      if (!validate({
        type: 'array',
        items: schemaWithCoordinate,
        minItems: 1,
      })) {
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
  return false;
};
