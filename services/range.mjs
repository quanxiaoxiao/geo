import assert from 'node:assert';

import * as turf from '@turf/turf';
import gcoord from 'gcoord';

import {
  createCanvas,
  drawCircle,
  drawScale,
  drawTiles,
} from '../src/index.mjs';
import checkCoordinate from '../src/utils/checkCoordinate.mjs';
import mercator from '../src/utils/mercator.mjs';

const degToRad = (deg) => (deg * Math.PI) / 180;

const calculateCharPositions = (chars, charWidths, degStart, textRadius, perimeter, gap, center) => {
  const positions = [];
  let degOffset = 0;

  for (let i = 0; i < chars.length; i++) {
    const angle = degStart + degOffset;
    const angleRad = degToRad(angle);

    positions.push({
      x: center[0] + Math.cos(angleRad) * textRadius,
      y: center[1] - Math.sin(angleRad) * textRadius,
      angle,
      char: chars[i],
    });

    if (i < chars.length - 1) {
      degOffset += ((charWidths[i] + gap) / perimeter) * 360;
    } else {
      degOffset += ((charWidths[i] + gap) / perimeter) * 360;
    }
  }

  return positions;
};

const drawArcBackground = (ctx, center, radius, textRadius, degStart, charWidths, perimeter, fontSize, color, charPositions) => {
  const pad = fontSize * 0.3;
  const innerRadius = radius - (radius - textRadius) * 2;

  const startAngle = degStart - ((charWidths[0] * 0.5 + pad) / perimeter) * 360;
  const lastCharWidth = charWidths[charWidths.length - 1];
  const totalDegOffset = charPositions.length > 0
    ? charPositions[charPositions.length - 1].angle - degStart
    : 0;
  const endAngle = degStart + totalDegOffset + ((lastCharWidth * 0.5 + pad) / perimeter) * 360;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.arc(
    center[0],
    center[1],
    radius,
    degToRad(-startAngle),
    degToRad(-endAngle - (lastCharWidth * 0.5 / perimeter) * 360),
    true,
  );

  ctx.lineTo(
    center[0] + Math.cos(degToRad(endAngle)) * innerRadius,
    center[1] - Math.sin(degToRad(endAngle)) * innerRadius,
  );

  ctx.arc(
    center[0],
    center[1],
    innerRadius,
    degToRad(-endAngle),
    degToRad(-startAngle),
    false,
  );

  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};

const drawCharacters = (ctx, charPositions, textColor) => {
  ctx.fillStyle = textColor;

  for (const pos of charPositions) {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(degToRad(270 - pos.angle));
    ctx.fillText(pos.char, 0, 0);
    ctx.restore();
  }
};

const drawTextAlong = ({
  name,
  radius,
  degStart,
  fontSize,
  fontFamily = 'SimSun',
  ctx,
  color = '#666',
  center,
  gap = 0,
  textColor = '#fff',
}) => {
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = name.split('');
  const charWidths = chars.map((char) => ctx.measureText(char).width);

  const textRadius = radius - fontSize * 0.75;
  const perimeter = Math.PI * 2 * textRadius;

  const charPositions = calculateCharPositions(
    chars,
    charWidths,
    degStart,
    textRadius,
    perimeter,
    gap,
    center,
  );

  drawArcBackground(
    ctx,
    center,
    radius,
    textRadius,
    degStart,
    charWidths,
    perimeter,
    fontSize,
    color,
    charPositions,
  );

  drawCharacters(ctx, charPositions, textColor);
};

export default async ({
  zoom = 17,
  width = 960,
  height = 960,
  center = 400,
  range = 400,
  color = '#666',
  rangeName,
}) => {
  checkCoordinate(center);
  assert(range > 0);
  const coordinate = gcoord.transform(
    center,
    gcoord.WGS84,
    gcoord.GCJ02,
  );
  const canvas = createCanvas({
    width,
    height,
  });

  const ctx = canvas.getContext('2d');

  await drawTiles({
    ctx,
    zoom,
    center: coordinate,
  });

  drawScale({
    ctx,
    zoom,
    center: coordinate,
  });

  drawCircle({
    ctx,
    center: coordinate,
    zoom,
    fill: 'rgba(0, 0, 0, 0)',
    radius: range,
    strokeColor: color,
    strokeWidth: 2,
    strokeDashArray: [6, 2],
  });

  const projection = mercator({
    zoom,
    center: coordinate,
    width,
    height,
  });

  const fontSize = width * 0.015;

  const degStart = 180 + 45;
  const infoName = rangeName ? rangeName : `${range}米步行圈`;

  const destination = turf.destination(coordinate, range , degStart, { units: 'meters' });

  const p0 = projection(coordinate);
  const p1 = projection(destination.geometry.coordinates);

  const r = Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2);

  drawTextAlong({
    ctx,
    name: infoName,
    fontSize,
    radius: r,
    degStart,
    center: p0,
    color,
  });

  const buf = ctx.canvas.toBuffer('image/png');
  return buf;
};
