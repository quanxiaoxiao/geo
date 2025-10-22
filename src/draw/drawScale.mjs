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

const drawScaleTicks = (ctx, x, y, scaleWidth, tickHeight) => {
  ctx.beginPath();
  ctx.moveTo(x, y - tickHeight);
  ctx.lineTo(x, y + tickHeight);
  ctx.moveTo(x, y);
  ctx.lineTo(x + scaleWidth, y);
  ctx.moveTo(x + scaleWidth, y - tickHeight);
  ctx.lineTo(x + scaleWidth, y + tickHeight);
  ctx.stroke();
};

const formatDistance = (distance) => {
  return distance >= 1000 ? `${distance / 1000}km` : `${distance}m`;
};

const drawScaleText = (ctx, text, x, y, scaleWidth) => {
  const metrics = ctx.measureText(text);
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const textX = x + (scaleWidth - metrics.width) / 2;
  const textY = y - textHeight * 0.4;

  ctx.fillText(text, textX, textY);
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
  drawScaleTicks(ctx, pointX, pointY, scaleWidth, DEFAULT_CONFIG.tickHeight);

  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px serif`;
  const text = formatDistance(distance);
  drawScaleText(ctx, text, pointX, pointY, scaleWidth);
  ctx.restore();
};
