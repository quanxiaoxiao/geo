import Ajv from 'ajv';

export default (data) => {
  const ajv = new Ajv();
  return (schema) => ajv.compile(schema)(data);
};
