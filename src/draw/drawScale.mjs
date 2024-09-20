import mercator from '../utils/mercator.mjs';
import { calcPixelWidthByDistance } from '../utils/index.mjs';

const map = {
  10: 10 * 1000,
  11: 5 * 1000,
  12: 3 * 1000,
  13: 1000,
  14: 500,
  15: 300,
  16: 200,
  17: 100,
  18: 50,
};

export default ({
  ctx,
  center,
  zoom,
  fontSize = 14,
  background = 'rgba(255, 255, 255, 0.2)',
  strokeColor = '#000',
  textColor = '#000',
}) => {
  const { width, height } = ctx.canvas;
  const point = [32, height - 32];
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const dist = map[zoom];
  if (dist) {
    const coordinate = projection.invert(point);
    const scaleWidth = calcPixelWidthByDistance(dist, zoom, coordinate[1]);
    ctx.fillStyle = background;
    const h = fontSize * 2;
    ctx.beginPath();
    ctx.fillRect(point[0] - 2, point[1] - h + 8, scaleWidth + 4, h);

    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(point[0], point[1] - 4);
    ctx.lineTo(point[0], point[1] + 4);
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(point[0] + scaleWidth, point[1]);
    ctx.moveTo(point[0] + scaleWidth, point[1] - 4);
    ctx.lineTo(point[0] + scaleWidth, point[1] + 4);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px serif`;
    ctx.beginPath();
    const text = dist >= 1000 ? `${dist / 1000}km` : `${dist}m`;
    const metrics = ctx.measureText(text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    ctx.fillText(text, point[0] + scaleWidth * 0.5 - metrics.width * 0.5, point[1] - textHeight * 0.4);
  }
};
