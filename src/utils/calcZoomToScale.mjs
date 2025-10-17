const TILE_SIZE = 256;

export default (zoom) => (2 ** zoom) * TILE_SIZE / (Math.PI * 2);
