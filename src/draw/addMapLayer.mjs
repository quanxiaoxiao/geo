import { loadImage } from '@napi-rs/canvas';
import fetchTile from '../utils/fetchTile.mjs';

export default async ({
  list,
  ctx,
  transform = [0, 0],
}) => {
  await list.reduce(async (acc, cur) => {
    await acc;
    const imageBuf = await fetchTile(cur.x, cur.y, cur.z);
    const image = await loadImage(imageBuf);
    const offsetX = (cur.x - list[0].x) * 256 + transform[0];
    const offsetY = (cur.y - list[0].y) * 256 + transform[1];
    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      256,
      256,
    );
  }, Promise.resolve);
};
