import { loadImage } from '@napi-rs/canvas';
import { Semaphore } from '@quanxiaoxiao/utils';
import {
  calcLngAtTileX,
  calcLatAtTileY,
  mercator,
} from '../utils/index.mjs';
import fetchTile from '../utils/fetchTile.mjs';
import { TILE_SIZE } from '../constants.mjs';

const generateTiles = ({
  zoom,
  center,
  width,
  height,
}) => {
  const tileList = [];
  const projection = mercator({
    zoom,
    center,
    width,
    height,
  });
  const bounds = [
    projection.invert([0, 0]),
    projection.invert([width, height]),
  ];
  const tileStartAtX = calcLngAtTileX(bounds[0][0], zoom);
  const tileStartAtY = calcLatAtTileY(bounds[0][1], zoom);
  const maxSize = 2 ** zoom;
  const transform = [
    (tileStartAtX - Math.floor(tileStartAtX)) * TILE_SIZE,
    (tileStartAtY - Math.floor(tileStartAtY)) * TILE_SIZE,
  ];
  for (let y = 0; y < height + TILE_SIZE; y += TILE_SIZE) {
    for (let x = 0; x < width + TILE_SIZE; x += TILE_SIZE) {
      const coordinate = projection.invert([x, y]);
      const tileX = calcLngAtTileX(coordinate[0], zoom);
      const tileY = calcLatAtTileY(coordinate[1], zoom);
      if (tileY >= 0 && tileY <= maxSize) {
        tileList.push({
          data: [
            Math.floor(tileX),
            Math.floor(tileY),
            zoom,
          ],
          width: TILE_SIZE,
          height: TILE_SIZE,
          x: x - transform[0],
          y: y - transform[1],
        });
      }
    }
  }
  return tileList;
};

export default async ({
  ctx,
  center,
  zoom,
  options,
}) => {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = options.tileBackground;
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);

  const tileList = generateTiles({
    zoom,
    center,
    width,
    height,
  });

  await new Promise((resolve) => {
    const sem = new Semaphore(32, () => {
      resolve();
    });

    tileList.forEach((tileItem) => {
      sem.acquire(async () => {
        const imageBuf = await fetchTile(tileItem.data[0], tileItem.data[1], tileItem.data[2]);
        const image = await loadImage(imageBuf);
        ctx.drawImage(
          image,
          tileItem.x,
          tileItem.y,
          tileItem.width,
          tileItem.height,
        );
        sem.release();
      });
    });
  });

  if (options.tileDebug) {
    for (let i = 0; i < tileList.length; i++) {
      const tileItem = tileList[i];
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.strokeRect(tileItem.x, tileItem.y, tileItem.width, tileItem.height);
      ctx.stroke();
      ctx.font = 'bold 24px serif';
      ctx.fillStyle = '#000';
      ctx.beginPath();
      const text = `${tileItem.data[0]}, ${tileItem.data[1]}`;
      const metrics = ctx.measureText(text);
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(
        text,
        tileItem.x + tileItem.width * 0.5 - metrics.width * 0.5,
        tileItem.y + tileItem.height * 0.5 + textHeight * 0.5,
      );
    }
  }
};
