import { Buffer } from 'node:buffer';
import assert from 'node:assert';
import { loadImage } from '@napi-rs/canvas';

export default async ({
  ctx,
  image,
}) => {
  assert(Buffer.isBuffer(image));
  const { width, height } = ctx.canvas;
  const img = await loadImage(image);
  ctx.drawImage(
    img,
    0,
    0,
    width,
    height,
  );
}
