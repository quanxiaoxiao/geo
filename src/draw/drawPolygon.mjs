import assert from 'node:assert';

import { geoPath } from 'd3-geo';

import checkCoordinate from '../utils/checkCoordinate.mjs';
import mercator from '../utils/mercator.mjs';

const DEFAULT_FILL_COLOR = 'rgba(23, 145, 253, 0.3)';
const DEFAULT_STROKE_COLOR = 'rgba(23, 145, 253, 1)';
const DEFAULT_STROKE_WIDTH = 2;

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  fill,
  type = 'Polygon',
  strokeWidth,
  strokeDashArray,
  strokeColor,
}) => {
  assert(type === 'Polygon' || type === 'MultiPolygon');
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
    type,
    coordinates,
  });

  ctx.closePath();

  const hasStrokeConfig = strokeWidth || strokeColor;

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  } else if (!hasStrokeConfig) {
    ctx.fillStyle = DEFAULT_FILL_COLOR;
    ctx.fill();
    ctx.lineWidth = DEFAULT_STROKE_WIDTH;
    ctx.strokeStyle = DEFAULT_STROKE_COLOR;
    ctx.stroke();
  }

  if (hasStrokeConfig) {
    ctx.strokeStyle = strokeColor || DEFAULT_STROKE_COLOR;
    ctx.lineWidth = strokeWidth || DEFAULT_STROKE_WIDTH;

    if (strokeDashArray) {
      ctx.setLineDash(strokeDashArray);
    }
    ctx.stroke();
  }

  ctx.restore();
};
