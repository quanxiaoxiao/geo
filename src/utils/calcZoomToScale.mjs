import { TILE_SIZE } from '../constants.mjs';

export default (zoom) => (2 ** zoom) * TILE_SIZE / (Math.PI * 2);
