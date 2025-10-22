import chroma from 'chroma-js';
import * as scale from 'd3-scale';
import KDBush from 'kdbush';

import mercator from '../utils/mercator.mjs';

const EARTH_RADIUS = 6378137.0;
const { PI } = Math;

const THIRD_PI = PI / 3;
const SIN_THIRD_PI = Math.sin(THIRD_PI);
const COS_THIRD_PI = Math.cos(THIRD_PI);
const HEXAGON_ANGLES = Array.from({ length: 6 }, (_, i) => i * THIRD_PI);

const buildSpatialIndex = (points) => {
  const index = new KDBush(points.length);
  for (let i = 0; i < points.length; i++) {
    index.add(points[i][0], points[i][1]);
  }
  return index.finish();
};

const distanceToPixels = (dist, zoom, lat = 0) => {
  const latRadius = Math.cos(lat * PI / 180) * EARTH_RADIUS;
  const circumference = 2 * latRadius * PI;
  const ratio = dist / circumference;
  return (2 ** zoom) * 256 * ratio;
};

const createColorScale = (colors, domain) => {
  const chromaScale = chroma.scale(colors).domain([0, 1]);
  return scale
    .scaleSequential((t) => chromaScale(t).hex())
    .domain(domain)
    .clamp(true);
};

const drawHexagon = ({
  ctx,
  radius,
  x,
  y,
  color,
}) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = HEXAGON_ANGLES[i];
    const dx = x + Math.sin(angle) * radius;
    const dy = y + Math.cos(angle) * radius;

    if (i === 0) {
      ctx.moveTo(dx, dy);
    } else {
      ctx.lineTo(dx, dy);
    }
  }
  ctx.closePath();
  ctx.fill();
};

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  radius = 600,
  opacity = 0.8,
  domain = [5, 120],
  colors = ['yellow', 'red', 'black'],
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const hexRadius = distanceToPixels(radius, zoom, center[1]);
  const colorScale = createColorScale(colors, domain);
  const projectedPoints = coordinates.map((coordinate) => projection(coordinate));
  const spatialIndex = buildSpatialIndex(projectedPoints);
  const hexWidth = SIN_THIRD_PI * hexRadius * 2;
  const hexHeight = hexRadius * (2 - COS_THIRD_PI);

  const numRows = Math.ceil((height + hexRadius) / hexHeight) + 1;
  const numCols = Math.ceil((width + hexRadius) / hexWidth) + 1;
  const [minCount] = domain;

  ctx.save();
  ctx.globalAlpha = opacity;

  for (let row = 0; row < numRows; row++) {
    const y = row * hexHeight;
    const isOddRow = row & 1;

    for (let col = 0; col < numCols; col++) {
      const x = col * hexWidth + (isOddRow ? hexWidth * 0.5 : 0);

      if (x < -hexRadius || y < -hexRadius) {
        continue;
      }

      const pointCount = spatialIndex.within(x, y, hexRadius).length;

      if (pointCount >= minCount) {
        drawHexagon({
          ctx,
          x,
          y,
          radius: hexRadius,
          color: colorScale(pointCount),
        });
      }
    }
  }
  ctx.restore();
};
