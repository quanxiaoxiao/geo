import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import shelljs from 'shelljs';
import { Semaphore } from '@quanxiaoxiao/utils';
import mercator from '../utils/mercator.mjs';
import {
  calcLngAtTileX,
  calcLatAtTileY,
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
  background = '#f4f4f4',
  debug,
}) => {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);

  const tileList = generateTiles({
    zoom,
    center,
    width,
    height,
  });

  if (tileList.length > 0) {
    await new Promise((resolve) => {
      const sem = new Semaphore(32, () => {
        resolve();
      });

      tileList.forEach((tileItem) => {
        sem.acquire(async () => {
          const tilesDir = path.resolve(process.cwd(), 'tiles');
          const tileBasedir = path.join(tilesDir, `${tileItem.data[2]}`, `${tileItem.data[1]}`);
          const tilePathname = path.join(tileBasedir, `${tileItem.data[0]}.png`);
          const willTileStore = shelljs.test('-d', tilesDir);
          let imageBuf;
          if (willTileStore && shelljs.test('-f', tilePathname)) {
            imageBuf = fs.readFileSync(tilePathname);
          }
          if (!imageBuf) {
            imageBuf = await fetchTile(tileItem.data[0], tileItem.data[1], tileItem.data[2]);
            if (willTileStore) {
              if (!shelljs.test('-d', tileBasedir)) {
                shelljs.mkdir('-p', tileBasedir);
              }
              fs.writeFileSync(tilePathname, imageBuf);
            }
          }
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
  }


  if (debug) {
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
