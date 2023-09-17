import path from 'node:path';
import fs from 'node:fs';
import createCanvas from '../createCanvas.mjs';
import drawTiles from './drawTiles.mjs';

export default async (options) => {
  const ctx = createCanvas(options.width, options.height);
  if (options.tileShow) {
    await drawTiles({
      ctx,
      zoom: options.zoom,
      center: options.center,
      debug: true,
    });
  }
  const buf = ctx.canvas.toBuffer('image/png');

  fs.writeFileSync(path.resolve(process.cwd(), 'cqq.png'), buf);
};
