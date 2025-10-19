import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { loadImage } from '@napi-rs/canvas';
import { Semaphore } from '@quanxiaoxiao/utils';
import shelljs from 'shelljs';

import { TILE_SIZE } from '../constants.mjs';
import fetchTile from '../utils/fetchTile.mjs';
import mercator from '../utils/mercator.mjs';
import {
  calcLatAtTileY,
  calcLngAtTileX,
} from '../utils/tile.mjs';

const drawDebugInfo = (ctx, tileList) => {
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  ctx.font = 'bold 24px serif';

  for (const tile of tileList) {
    ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

    const text = `${tile.data[0]}, ${tile.data[1]}`;
    const metrics = ctx.measureText(text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    ctx.fillText(
      text,
      tile.x + (tile.width - metrics.width) * 0.5,
      tile.y + (tile.height + textHeight) * 0.5,
    );
  }
};

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
  const maxX = width + TILE_SIZE;
  const maxY = height + TILE_SIZE;

  for (let y = 0; y < maxY; y += TILE_SIZE) {
    for (let x = 0; x < maxX; x += TILE_SIZE) {
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

const fileExists = async (filepath) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};

const loadTile = async (tileItem, tilesDir) => {
  const [x, y, z] = tileItem.data;
  const tileBasedir = path.join(tilesDir, `${z}`, `${y}`);
  const tilePathname = path.join(tileBasedir, `${x}.png`);
  const willTileStore = shelljs.test('-d', tilesDir);

  if (willTileStore && await fileExists(tilePathname)) {
    try {
      return await fs.readFile(tilePathname);
    } catch (err) {
      console.warn(`读取缓存瓦片失败: ${tilePathname}`, err);
    }
  }

  try {
    const imageBuf = await fetchTile(x, y, z);
    if (willTileStore && imageBuf) {
      try {
        if (!shelljs.test('-d', tileBasedir)) {
          shelljs.mkdir('-p', tileBasedir);
        }
        await fs.writeFile(tilePathname, imageBuf);
      } catch (err) {
        console.warn(`保存瓦片缓存失败: ${tilePathname}`, err);
      }
    }

    return imageBuf;
  } catch (err) {
    console.error(`获取瓦片失败 [${x}, ${y}, ${z}]:`, err);
    return null;
  }
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

  if (tileList.length === 0) {
    return;
  }

  const tilesDir = path.resolve(process.cwd(), 'tiles');

  await new Promise((resolve) => {
    const sem = new Semaphore(32, resolve);

    tileList.forEach((tileItem) => {
      sem.acquire(async () => {
        try {
          const imageBuf = await loadTile(tileItem, tilesDir);

          if (imageBuf) {
            const image = await loadImage(imageBuf);
            ctx.drawImage(
              image,
              tileItem.x,
              tileItem.y,
              tileItem.width,
              tileItem.height,
            );
          }
        } catch (err) {
          console.error('渲染瓦片失败:', err);
        } finally {
          sem.release();
        }
      });
    });
  });

  if (debug) {
    drawDebugInfo(ctx, tileList);
  }
};
