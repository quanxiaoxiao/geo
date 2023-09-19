import yargs from 'yargs';
import _ from 'lodash';
import gcoord from 'gcoord';
import { hideBin } from 'yargs/helpers';
import config from './config.mjs';
import parseData from './parseData.mjs';
import valid from './utils/valid.mjs';
import { schemaWithCoordinate } from './schemas.mjs';
import draw from './draw/index.mjs';
import generateOperationsFromConfig from './generateOperationsFromConfig.mjs';

const bufList = [];

const defaultOptions = generateOperationsFromConfig();

if (process.argv.slice(2).includes('@-')) {
  await new Promise((resolve) => {
    process.stdin.on('data', (chunk) => {
      bufList.push(chunk);
    });

    process.stdin.on('end', () => {
      resolve();
    });
  });
}

const argv = await yargs(hideBin(process.argv))
  .options({
    ...defaultOptions,
    center: {
      alias: 'c',
      type: 'string',
      default: `[${config.center.join(',')}]`,
      coerce: async (arg) => {
        try {
          const data = JSON.parse(arg);
          if (!valid(data)(schemaWithCoordinate)) {
            throw new Error('center invalid');
          }
          return data;
        } catch (error) {
          throw new Error('center invalid');
        }
      },
    },
    width: {
      alias: 'w',
      type: 'number',
      default: config.width,
      coerce: (arg) => Math.max(Math.min(8192, arg), 128),
    },
    height: {
      alias: 'h',
      type: 'number',
      default: config.height,
      coerce: (arg) => Math.max(Math.min(8192, arg), 128),
    },
    zoom: {
      alias: 'z',
      type: 'number',
      choices: _.times(16).map((n) => n + 3),
      default: config.zoom,
    },
    type: {
      alias: 't',
      type: 'string',
      choices: [
        'location',
        'hexbin',
        'heatmap',
        'cluster',
        'grid',
        'range',
      ],
    },
    data: {
      alias: 'd',
      type: 'string',
      coerce: async (arg) => {
        try {
          const data = JSON.parse(arg === '@-' ? Buffer.concat(bufList) : arg);
          const v = parseData(data);
          if (!v) {
            throw new Error('data invalid');
          }
          if (Array.isArray(data) && v.type === 'LineString') {
            return {
              data: {
                ...v,
                type: 'MultiPoint',
              },
              dataRaw: data,
            };
          }
          return {
            data: v,
            dataRaw: data,
          };
        } catch (error) {
          throw new Error('data invalid');
        }
      },
      demandOption: true,
    },
    range: {
      alias: 'r',
      type: 'number',
      coerce: async (arg) => {
        if (arg <= 0) {
          return null;
        }
        return arg;
      },
    },
  })
  .example([
    ['geo --data [121.33, 29.66]'],
    ['geo --data [121.33, 29.66] --zoom 16'],
    ['geo --data [121.33, 29.66] --zoom 16 --range 400'],
    ['geo --data [121.33, 29.66] --center [121.33, 29.66] --zoom 16 --range 400 | geo --data [121.336, 29.657] --center [121.33, 29.66] --zoom 16 --range 400 --hide-tile --layer @-'],
    ['geo --data [121.33, 29.66] --zoom 16 --width 1280 --height 640'],
    ['geo --data [121.33, 29.66] --range 500'],
    ['cat points.json | jq \'map(.coordinate)\' | geo --data @-'],
    ['cat points.json | jq \'map(.coordinate)\' | geo --data @- --type hexbin'],
  ])
  .parse();

const options = {
  ...Object
    .keys(defaultOptions)
    .reduce((acc, cur) => {
      const key = cur.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
      const v = argv[key];
      if (v == null) {
        return acc;
      }
      return {
        ...acc,
        [key]: v,
      };
    }, {}),
  center: gcoord.transform(argv.center, gcoord.WGS84, gcoord.GCJ02),
  width: argv.width,
  height: argv.height,
  zoom: argv.zoom,
  type: argv.type,
  range: argv.range,
  data: gcoord.transform(argv.data.data, gcoord.WGS84, gcoord.GCJ02),
};

if (Array.isArray(argv.data.dataRaw) && argv.data.data.type === 'Point') {
  if (argv.range) {
    options.type = 'range';
  } else {
    options.type = 'location';
  }
  if (!process.argv.slice(2).some((s) => s === '--center' || s === '-c')) {
    options.center = options.data.coordinates;
  }
}

draw(options);
