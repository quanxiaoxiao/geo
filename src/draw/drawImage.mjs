import assert from 'node:assert';
import { Buffer } from 'node:buffer';

import { loadImage } from '@napi-rs/canvas';

export default async ({
  ctx,
  image,
  rect,
}) => {
  assert(Buffer.isBuffer(image));
  const { width, height } = ctx.canvas;
  const img = await loadImage(image);
  if (rect) {
    ctx.drawImage(
      img,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
    );
  } else {
    ctx.drawImage(
      img,
      0,
      0,
      width,
      height,
    );
  }
};
