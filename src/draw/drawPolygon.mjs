import { geoPath } from 'd3-geo';

import checkCoordinate from '../utils/checkCoordinate.mjs';
import mercator from '../utils/mercator.mjs';

const defaultFillColor = 'rgba(23, 145, 253, 0.3)';
const defaultStrokeColor = 'rgba(23, 145, 253, 1)';

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  fill,
  strokeWidth,
  strokeColor,
}) => {
  checkCoordinate(center);

  ctx.save();

  const { width, height } = ctx.canvas;

  const projection = mercator({
    zoom,
    center,
    width,
    height,
  });

  ctx.beginPath();

  geoPath(projection, ctx)({
    type: 'Polygon',
    coordinates,
  });

  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  } else if (!strokeWidth && !strokeColor) {
    ctx.fillStyle = defaultFillColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = defaultStrokeColor;
    ctx.stroke();
  }

  if (strokeWidth) {
    ctx.strokeStyle = strokeColor || defaultStrokeColor;
    ctx.lineWidth = strokeWidth;
  } else if (strokeColor) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
  }

  if (strokeWidth || strokeColor) {
    ctx.stroke();
  }
  ctx.restore();

};
