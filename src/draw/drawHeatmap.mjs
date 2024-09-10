import { createCanvas } from '@napi-rs/canvas';
import {
  mercator,
  calcPixelWidthByDistance,
} from '../utils/index.mjs';

const createPaletten = () => {
  const canvas = createCanvas(256, 1);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 256, 1);
  gradient.addColorStop(0.25, 'rgb(0, 0, 255)');
  gradient.addColorStop(0.55, 'rgb(0, 255, 0)');
  gradient.addColorStop(0.85, 'yellow');
  gradient.addColorStop(1, 'rgb(255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
};

const generateDesityImg = ({
  coordinates,
  width,
  height,
  projection,
  center,
  zoom,
  radius,
  opacity,
}) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const r = calcPixelWidthByDistance(radius, zoom, center[1]);
  ctx.globalAlpha = opacity;
  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    const [x, y] = projection(coordinate);
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
  return ctx.getImageData(0, 0, width, height);
};

export default ({
  ctx,
  coordinates,
  center,
  zoom,
  radius = 300,
  opacity = 0.06,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const paletten = createPaletten();
  const img = generateDesityImg({
    coordinates,
    projection,
    width,
    height,
    center,
    zoom,
    radius,
    opacity,
  });
  const imgData = img.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4;
      const alpha = imgData[pos + 3];
      if (alpha !== 0) {
        const offset = alpha * 4;
        ctx.fillStyle = `rgba(${paletten[offset]}, ${paletten[offset + 1]}, ${paletten[offset + 2]}, ${imgData[pos + 3] / 255})`;
        ctx.beginPath();
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
};
