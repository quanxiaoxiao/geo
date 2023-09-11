import gcoord from 'gcoord';
import {
  calcLngAtTileX,
  calcLatAtTileY,
} from './utils/index.mjs';
import generateTiles from './utils/generateTiles.mjs';
import addMapLayer from './draw/addMapLayer.mjs';
import createCanvas from './createCanvas.mjs';

const drawPoint = ({
  ctx,
  width,
  height,
}) => {
  const x = width * 0.5;
  const y = height * 0.5;
  const r = 12;
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.restore();
  ctx.fillStyle = '#0f89f5';
  ctx.beginPath();
  ctx.arc(x, y, r - 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

export default async ({
  coordinate,
  width = 1680,
  height = 1680,
  zoom = 18,
}) => {
  const ctx = createCanvas(width, height);

  const center = gcoord.transform(coordinate, gcoord.WGS84, gcoord.GCJ02);

  const tileX = calcLngAtTileX(center[0], zoom);
  const tileY = calcLatAtTileY(center[1], zoom);

  const x1 = Math.floor(tileX - width * 0.5 / 256);
  const y1 = Math.floor(tileY - height * 0.5 / 256);
  const x2 = x1 + Math.ceil(width / 256) + 1;
  const y2 = y1 + Math.ceil(height / 256) + 1;

  const tileList = generateTiles({
    zoom,
    x1,
    y1,
    x2,
    y2,
  });

  await addMapLayer({
    list: tileList,
    ctx,
    transform: [
      (tileX - width * 0.5 / 256 - x1) * -256,
      (tileY - height * 0.5 / 256 - y1) * -256,
    ],
  });

  drawPoint({
    ctx,
    width,
    height,
  });

  return ctx.canvas.toBuffer('image/png');
};
