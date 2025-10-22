import chroma from 'chroma-js';
import KDBush from 'kdbush';

import colorSchemes from '../colorSchemes.mjs';
import mercator from '../utils/mercator.mjs';

const createColorScale = (minValue, maxValue, scaleType, selectedScheme) => {
  const scheme = colorSchemes[selectedScheme];
  if (scaleType === 'log') {
    const logMin = Math.log(minValue);
    const logMax = Math.log(maxValue);
    const chromaScale = chroma.scale(scheme.colors).domain([0, 1]);

    return (value) => {
      const logValue = Math.log(Math.max(value, minValue));
      const normalized = (logValue - logMin) / (logMax - logMin);
      return chromaScale(normalized).hex();
    };
  } else if (scaleType === 'sqrt') {
    const sqrtMin = Math.sqrt(minValue);
    const sqrtMax = Math.sqrt(maxValue);
    const chromaScale = chroma.scale(scheme.colors).domain([0, 1]);

    return (value) => {
      const sqrtValue = Math.sqrt(Math.max(value, minValue));
      const normalized = (sqrtValue - sqrtMin) / (sqrtMax - sqrtMin);
      return chromaScale(normalized).hex();
    };
  }
  return chroma.scale(scheme.colors).domain([minValue, maxValue]);

};

const EARTH_RADIUS = 6378137.0;
const { PI, sin, cos, abs, ceil } = Math;
const THIRD_PI = PI / 3;
const SIN_THIRD_PI = sin(THIRD_PI);
const COS_THIRD_PI = cos(THIRD_PI);
const TWO_SIN_THIRD_PI = 2 * SIN_THIRD_PI;

const HEXAGON_ANGLES = new Float32Array(6);
for (let i = 0; i < 6; i++) {
  HEXAGON_ANGLES[i] = i * THIRD_PI;
}

const buildSpatialIndex = (points) => {
  const len = points.length;
  const index = new KDBush(len);
  for (let i = 0; i < len; i++) {
    index.add(points[i][0], points[i][1]);
  }
  return index.finish();
};

const distanceToPixels = (dist, zoom, lat = 0) => {
  const latRadius = cos(lat * PI / 180) * EARTH_RADIUS;
  const circumference = 2 * latRadius * PI;
  return (1 << zoom) * 256 * (dist / circumference);
};

/*
const createColorScale = (colors, domain) => {
  const chromaScale = chroma.scale(colors).domain([0, 1]);
  return scale
    .scaleSequential((t) => chromaScale(t).hex())
    .domain(domain)
    .clamp(true);
};
*/

const drawHexagon = (ctx, radius, x, y, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x + sin(HEXAGON_ANGLES[0]) * radius, y + cos(HEXAGON_ANGLES[0]) * radius);

  for (let i = 1; i < 6; i++) {
    const angle = HEXAGON_ANGLES[i];
    ctx.lineTo(x + sin(angle) * radius, y + cos(angle) * radius);
  }

  ctx.closePath();
  ctx.fill();
};

const isPointInHexagon = (px, py, radius) => {
  const x = abs(px);
  const y = abs(py);

  if (x > SIN_THIRD_PI * radius || y > radius) {
    return false;
  }

  return y <= radius * TWO_SIN_THIRD_PI - x * TWO_SIN_THIRD_PI;
};

const getRangePoints = ({
  width,
  height,
  center,
  zoom,
  radius,
  coordinates,
}) => {
  const projection = mercator({ width, height, center, zoom });
  const hexRadius = distanceToPixels(radius, zoom, center[1]);
  const hexWidth = TWO_SIN_THIRD_PI * hexRadius;
  const hexHeight = hexRadius * (2 - COS_THIRD_PI);
  const halfHexWidth = hexWidth * 0.5;

  const numRows = ceil((height + hexRadius) / hexHeight) + 1;
  const numCols = ceil((width + hexRadius) / hexWidth) + 1;

  const projectedPoints = new Array(coordinates.length);
  for (let i = 0; i < coordinates.length; i++) {
    projectedPoints[i] = projection(coordinates[i]);
  }

  const spatialIndex = buildSpatialIndex(projectedPoints);
  const result = [];

  for (let row = 0; row < numRows; row++) {
    const y = row * hexHeight;
    const isOddRow = row & 1;

    for (let col = 0; col < numCols; col++) {
      const x = col * hexWidth + (isOddRow ? halfHexWidth : 0);
      const nearbyIndices = spatialIndex.within(x, y, hexRadius);

      if (nearbyIndices.length === 0) continue;

      const validIndices = [];
      for (let i = 0; i < nearbyIndices.length; i++) {
        const idx = nearbyIndices[i];
        const [px, py] = projectedPoints[idx];
        if (isPointInHexagon(px - x, py - y, hexRadius)) {
          validIndices.push(idx);
        }
      }

      if (validIndices.length > 0) {
        result.push({
          x,
          y,
          radius: hexRadius,
          count: validIndices.length,
          points: validIndices.map((idx) => coordinates[idx]),
        });
      }
    }
  }

  return result;
};

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  radius = 600,
  opacity = 0.8,
  minCount = 5,
}) => {
  const { width, height } = ctx.canvas;

  ctx.save();
  ctx.globalAlpha = opacity;

  const hexagons = getRangePoints({
    width,
    height,
    center,
    zoom,
    radius,
    coordinates,
  });

  const domain = [minCount, Math.max(...hexagons.map((d) => d.count))];
  const colorScale = createColorScale(domain[0], domain[1], 'sqrt', 'redblue');

  for (let i = 0; i < hexagons.length; i++) {
    const hex = hexagons[i];
    if (hex.count >= minCount) {
      drawHexagon(
        ctx,
        hex.radius,
        hex.x,
        hex.y,
        colorScale(hex.count),
      );
    }
  }

  ctx.restore();
};
