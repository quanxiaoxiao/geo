import { loadImage } from '@napi-rs/canvas';
import {
  calcLngAtTileX,
  calcLatAtTileY,
} from '../utils/index.mjs';
import generateTiles from '../utils/generateTiles.mjs';
import fetchTile from '../utils/fetchTile.mjs';

export default async ({
  ctx,
  center,
  zoom,
}) => {
  const { width, height } = ctx.canvas;
  const tileAtCenterX = calcLngAtTileX(center[0], zoom);
  const tileAtCenterY = calcLatAtTileY(center[1], zoom);
  const x1 = Math.floor(tileAtCenterX - width * 0.5 / 256);
  const y1 = Math.floor(tileAtCenterY - height * 0.5 / 256);
  const x2 = x1 + Math.ceil(width / 256) + 1;
  const y2 = y1 + Math.ceil(height / 256) + 1;

  const tileList = generateTiles({
    zoom,
    x1,
    y1,
    x2,
    y2,
  });

  const transform = [
    width / 2 - (tileAtCenterX - x1) * 256,
    height / 2 - (tileAtCenterY - y1) * 256,
  ];

  await tileList.reduce(async (acc, cur) => {
    await acc;
    const imageBuf = await fetchTile(cur.x, cur.y, cur.z);
    const image = await loadImage(imageBuf);
    const offsetX = (cur.x - tileList[0].x) * 256 + transform[0];
    const offsetY = (cur.y - tileList[0].y) * 256 + transform[1];
    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      256,
      256,
    );
  }, Promise.resolve);
};
