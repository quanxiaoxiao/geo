import yargs from 'yargs';
import _ from 'lodash';
import gcoord from 'gcoord';
import { hideBin } from 'yargs/helpers';
import parseData from './parseData.mjs';
import valid from './utils/valid.mjs';
import { schemaWithCoordinate } from './schemas.mjs';
import draw from './draw/index.mjs';

const argv = yargs(hideBin(process.argv))
  .options({
    center: {
      alias: 'c',
      default: '[121.52895, 29.89411]',
      coerce: (arg) => {
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
      type: 'string',
    },
    width: {
      alias: 'w',
      type: 'number',
      default: 1680,
      coerce: (arg) => Math.max(Math.min(8192, arg), 128),
    },
    height: {
      alias: 'h',
      type: 'number',
      default: 1680,
      coerce: (arg) => Math.max(Math.min(8192, arg), 128),
    },
    zoom: {
      alias: 'z',
      type: 'number',
      choices: _.times(16).map((n) => n + 3),
      default: 12,
    },
    type: {
      alias: 't',
      type: 'string',
      choices: [
        'location',
        'range',
      ],
    },
    data: {
      alias: 'd',
      type: 'string',
      coerce: (arg) => {
        try {
          const data = JSON.parse(arg);
          const v = parseData(data);
          if (!v) {
            throw new Error('data invalid');
          }
          return v;
        } catch (error) {
          throw new Error('data invalid');
        }
      },
      demandOption: true,
    },
    range: {
      alias: 'r',
      type: 'number',
    },
    'hide-tile': {
      type: 'boolean',
      default: false,
    },
  })
  .example([
    ['geo --data [121.33, 29.66]'],
    ['geo --data [121.33, 29.66] --zoom 16'],
    ['geo --data [121.33, 29.66] --zoom 16 --range 400'],
    ['geo --data [121.33, 29.66] --zoom 16 --width 1280 --height 640'],
  ])
  .parse();

// geo --data [121.33, 29.66] --zoom 16
// geo --data [121.33, 29.66] --hide-tile
// geo --data [121.33, 29.66]
// geo --data [121.33, 29.66]  --range 300
// geo --data { type: 'MultiPoint', coordinates: [] }
// geo --data [[121.33, 29.66], [121.33, 29.66]] --type grid

const options = {
  tileShow: !argv.hideTile,
  center: gcoord.transform(argv.center, gcoord.WGS84, gcoord.GCJ02),
  width: argv.width,
  height: argv.height,
  zoom: argv.zoom,
  data: argv.data,
};

draw(options);
