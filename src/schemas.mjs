export const schemaWithCoordinate = {
  type: 'array',
  items: {
    type: 'number',
    minimum: -180,
    maximum: 180,
  },
  minItems: 2,
  maxItems: 2,
};

export const schemaWithLineStringOrMultiPoint = {
  type: 'array',
  items: schemaWithCoordinate,
  minItems: 1,
};

export const schemaWithPolygon = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'array',
    minItems: 1,
    items: schemaWithCoordinate,
  },
};
