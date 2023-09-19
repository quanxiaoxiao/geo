import _ from 'lodash';
import config from './config.mjs';

const convertNameToSnameStyle = (str) => str.replace(/[A-Z]/g, (a, b) => {
  if (b === 0) {
    return `${a.toLowerCase()}`;
  }
  return `-${a.toLowerCase()}`;
});

const walk = (obj, prefix) => {
  if (!_.isPlainObject(obj)) {
    return {};
  }
  const keys = Object.keys(obj);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (value == null) {
      continue;
    }
    const type = typeof value;
    const keyName = prefix
      ? `${prefix}-${convertNameToSnameStyle(key)}`
      : convertNameToSnameStyle(key);
    if (['string', 'boolean', 'number'].includes(type)) {
      result[keyName] = {
        type,
        default: value,
      };
    } else if (Array.isArray(value)) {
      result[keyName] = {
        type: 'array',
        default: value,
      };
    } else {
      const ret = walk(value, keyName);
      Object.assign(result, ret);
    }
  }
  return result;
};

export default () => walk(_.omit(config, [
  'width',
  'height',
  'center',
  'zoom',
]));
