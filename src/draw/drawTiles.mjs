import { loadImage } from '@napi-rs/canvas';
import { geoMercator } from 'd3-geo';
import {
  calcLngAtTileX,
  calcLatAtTileY,
} from '../utils/index.mjs';
import fetchTile from '../utils/fetchTile.mjs';

const TILE_SIZE = 256;

const generateTiles = ({
  zoom,
  center,
  width,
  height,
}) => {
  const tileList = [];
  const scale = (2 ** zoom) * TILE_SIZE / Math.PI / 2;
  const projection = geoMercator()
    .scale(scale)
    .center(center)
    .translate([width / 2, height / 2]);
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
  debug,
}) => {
  const { width, height } = ctx.canvas;

  const tileList = generateTiles({
    zoom,
    center,
    width,
    height,
  });

  await tileList.reduce(async (acc, cur) => {
    await acc;
    const imageBuf = await fetchTile(cur.data[0], cur.data[1], cur.data[2]);
    const image = await loadImage(imageBuf);
    ctx.drawImage(
      image,
      cur.x,
      cur.y,
      cur.width,
      cur.height,
    );
  }, Promise.resolve);
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
