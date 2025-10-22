import { calcPixelWidthByDistance } from '../utils/index.mjs';
import mercator from '../utils/mercator.mjs';

const SCALE_DISTANCE_MAP = {
  10: 10000,
  11: 5000,
  12: 3000,
  13: 1000,
  14: 500,
  15: 300,
  16: 200,
  17: 100,
  18: 50,
};

const DEFAULT_CONFIG = {
  fontSize: 14,
  background: 'rgba(255, 255, 255, 0.2)',
  strokeColor: '#000',
  textColor: '#000',
  padding: 32,
  tickHeight: 4,
  barPadding: 2,
};

export default ({
  ctx,
  center,
  zoom,
  fontSize = DEFAULT_CONFIG.fontSize,
  background = DEFAULT_CONFIG.background,
  strokeColor = DEFAULT_CONFIG.strokeColor,
  textColor = DEFAULT_CONFIG.textColor,
}) => {
  const distance = SCALE_DISTANCE_MAP[zoom];
  if (!distance) {
    return;
  }
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const pointX = DEFAULT_CONFIG.padding;
  const pointY = height - DEFAULT_CONFIG.padding;
  const coordinate = projection.invert([pointX, pointY]);
  const barHeight = fontSize * 2;
  const scaleWidth = calcPixelWidthByDistance(distance, zoom, coordinate[1]);

  ctx.save();
  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.fillRect(
    pointX - DEFAULT_CONFIG.barPadding,
    pointY - barHeight + 8,
    scaleWidth + 4,
    barHeight,
  );

  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(pointX, pointY - 4);
  ctx.lineTo(pointX, pointY + 4);
  ctx.moveTo(pointX, pointY);
  ctx.lineTo(pointX + scaleWidth, pointY);
  ctx.moveTo(pointX + scaleWidth, pointY - 4);
  ctx.lineTo(pointX + scaleWidth, pointY + 4);
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px serif`;
  ctx.beginPath();
  const text = distance >= 1000 ? `${distance / 1000}km` : `${distance}m`;
  const metrics = ctx.measureText(text);
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  ctx.fillText(text, pointX + scaleWidth * 0.5 - metrics.width * 0.5, pointY - textHeight * 0.4);
  ctx.restore();
};
