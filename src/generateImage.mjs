import fs from 'node:fs';
import path from 'node:path';
import { loadImage, createCanvas } from '@napi-rs/canvas';
import shelljs from 'shelljs';
import { fetchData } from '@quanxiaoxiao/about-http';
import gcoord from 'gcoord';
import {
  mercator,
  calcLngAtTileX,
  calcLatAtTileY,
} from './utils/index.mjs';
import calcClusterPoints from './utils/calcClusterPoints.mjs';

const createPaletten = () => {
  const canvas = createCanvas(256, 1);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);
  gradient.addColorStop(0.25, 'rgb(0, 0, 255)');
  gradient.addColorStop(0.55, 'rgb(0, 255, 0)');
  gradient.addColorStop(0.85, 'yellow');
  gradient.addColorStop(1, 'rgb(255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
};

const fetchTile = async (x, y, z) => {
  const basedir = path.resolve(process.cwd(), 'tiles', `${z}`, `${x}`);
  if (!shelljs.test('-d', basedir)) {
    shelljs.mkdir('-p', basedir);
  }
  const pathname = path.join(basedir, `${y}.png`);
  if (shelljs.test('-f', pathname)) {
    return fs.readFileSync(pathname);
  }
  const buf = await fetchData({
    url: `http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
    headers: {
      host: 'webrd02.is.autonavi.com',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    },
    match: (statusCode) => statusCode === 200,
  });
  fs.writeFileSync(pathname, buf);
  return buf;
};

const addMapLayer = async ({
  list,
  ctx,
}) => {
  await list.reduce(async (acc, cur) => {
    await acc;
    const imageBuf = await fetchTile(cur.x, cur.y, cur.z);
    const image = await loadImage(imageBuf);
    const offsetX = (cur.x - list[0].x) * 256;
    const offsetY = (cur.y - list[0].y) * 256;
    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      256,
      256,
    );
  }, Promise.resolve);
};

const generateDesityImg = ({
  list,
  width,
  height,
  projection,
}) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const opacity = 0.03;
  const r = 5.2;
  ctx.globalAlpha = opacity;
  for (let i = 0; i < list.length; i++) {
    const pointItem = list[i];
    const [x, y] = projection(gcoord.transform(pointItem.coordinate, gcoord.WGS84, gcoord.GCJ02));
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  return ctx.getImageData(0, 0, width, height);
};

const drawHeatmap = ({
  list,
  projection,
  ctx,
}) => {
  const paletten = createPaletten();
  const { width, height } = ctx.canvas;
  const img = generateDesityImg({
    list,
    projection,
    width,
    height,
  });
  const imgData = img.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4;
      const alpha = imgData[pos + 3];
      if (alpha !== 0) {
        const offset = alpha * 4;
        ctx.fillStyle = `rgba(${paletten[offset]}, ${paletten[offset + 1]}, ${paletten[offset + 2]}, ${imgData[pos + 3] / 255})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
};

const drawRange = ({
  list,
  radius,
  ctx,
  projection,
}) => {
  ctx.strokeStyle = '#f00';
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const [x, y] = projection(gcoord.transform(item.coordinate, gcoord.WGS84, gcoord.GCJ02));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
};

const generateTileList = ({
  zoom,
  x1,
  y1,
  x2,
  y2,
}) => {
  const result = [];

  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      result.push({
        x,
        y,
        z: zoom,
      });
    }
  }
  return result;
};

const generateImage = async ({
  list,
  minSize = 30,
  range = 300,
  bounds = [
    [
      120.86293362278802,
      30.491992107226118,
    ],
    [
      122.27497998416108,
      28.856232883655174,
    ],
  ],
  zoom = 11,
}) => {
  const x1 = Math.floor(calcLngAtTileX(bounds[0][0], zoom));
  const y1 = Math.floor(calcLatAtTileY(bounds[0][1], zoom));
  const x2 = Math.ceil(calcLngAtTileX(bounds[1][0], zoom));
  const y2 = Math.ceil(calcLatAtTileY(bounds[1][1], zoom));
  const width = (x2 - x1) * 256;
  const height = (y2 - y1) * 256;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const bg = '#F4F4F4';
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);
  const tileList = generateTileList({
    zoom,
    x1,
    y1,
    x2,
    y2,
  });
  const projection = mercator(zoom, [x1, y1]);

  await addMapLayer({
    list: tileList,
    ctx,
    x: x1,
    y: y1,
  });

  drawHeatmap({
    list,
    projection,
    ctx,
  });

  const clusterList = calcClusterPoints({
    list,
    bounds,
    minSize,
    radius: range,
  });

  drawRange({
    list: clusterList,
    radius: 6,
    ctx,
    projection,
  });

  return canvas.toBuffer('image/png');
};

export default generateImage;
