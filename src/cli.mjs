import yargs from 'yargs';
import _ from 'lodash';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .options({
    center: {
      alias: 'c',
      default: [121.52895, 29.89411],
      type: 'array',
    },
    width: {
      alias: 'w',
      type: 'number',
      default: 1680,
    },
    height: {
      alias: 'h',
      type: 'number',
      default: 1680,
    },
    zoom: {
      alias: 'z',
      type: 'number',
      choices: _.times(18).map((n) => n + 1),
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
          return JSON.parse(arg);
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
  .parse();

// geo --data [121.33, 29.66] --zoom 16
// geo --data [121.33, 29.66] --hide-tile
// geo --data [121.33, 29.66]
// geo --data [121.33, 29.66]  --range 300
// geo --data { type: 'MultiPoint', coordinates: [] }
// geo --data [[121.33, 29.66], [121.33, 29.66]] --type grid
console.log(argv);
