import gcoord from 'gcoord';

import drawImage from '../src/draw/drawImage.mjs';
import drawRectPath from '../src/draw/drawRectPath.mjs';
import { createCanvas, drawTiles } from '../src/index.mjs';
import mercator from '../src/utils/mercator.mjs';

const getCircleTangents = (circle, point) => {
  const { r, point: [x0, y0] } = circle;
  const [x1, y1] = point;

  const dx = x1 - x0;
  const dy = y1 - y0;
  const d = Math.hypot(dx, dy);

  if (d < r) {
    return null;
  }

  const angleToPoint = Math.atan2(dy, dx);
  const theta = Math.acos(r / d);

  const angle1 = angleToPoint + theta;
  const angle2 = angleToPoint - theta;

  return [
    [x0 + r * Math.cos(angle1), y0 + r * Math.sin(angle1)],
    [x0 + r * Math.cos(angle2), y0 + r * Math.sin(angle2)],
  ];
};

const drawShadowTriangle = (ctx, center, tangents) => {
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.moveTo(center[0], center[1]);
  ctx.lineTo(tangents[0][0], tangents[0][1]);
  ctx.lineTo(tangents[1][0], tangents[1][1]);
  ctx.closePath();
  ctx.fill();
};

const drawMagnifierCircle = (ctx, center, radius) => {
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
  ctx.fill();
};

const createMagnifierCanvas = async (size, zoom, center) => {
  const canvas = createCanvas({
    width: size,
    height: size,
    background: '#f4f4f4',
  });

  const ctx = canvas.getContext('2d');
  await drawTiles({ ctx, zoom, center });

  return canvas;
};

const drawClippedMagnifier = async (ctx, sourceCanvas, position, radius) => {
  ctx.save();

  drawRectPath(ctx, {
    x: position[0] - radius,
    y: position[1] - radius,
    width: radius * 2,
    height: radius * 2,
  }, radius);

  ctx.clip();

  await drawImage({
    ctx,
    image: sourceCanvas.toBuffer('image/png'),
    rect: {
      x: position[0] - radius,
      y: position[1] - radius,
      width: radius * 2,
      height: radius * 2,
    },
  });

  ctx.restore();
};

export default async ({
  coordinate,
  width = 960,
  height = 720,
  zoom = {
    base: 14,
    magnifier: 18,
  },
  magnifier = {
    sizeRatio: 0.18,
    padding: 8,
    offset: [0.1, 0.1],
  },
}) => {
  const center = gcoord.transform(coordinate, gcoord.WGS84, gcoord.GCJ02);

  const size = Math.min(width, height);
  const outerRadius = Math.floor(size * magnifier.sizeRatio);
  const innerRadius = outerRadius - magnifier.padding;
  const offsetX = width * magnifier.offset[0];
  const offsetY = height * magnifier.offset[1];

  const tempProjection = mercator({ zoom: zoom.base, center, width, height });
  const adjustedCenter = tempProjection.invert([
    width * 0.5 + offsetX,
    height * 0.5 - offsetY,
  ]);

  const projection = mercator({
    zoom: zoom.base,
    center: adjustedCenter,
    width,
    height,
  });

  const centerPoint = projection(center);
  const magnifierCenter = [
    centerPoint[0] + innerRadius + offsetX,
    centerPoint[1] - innerRadius - offsetY,
  ];

  const mainCanvas = createCanvas({ width, height, background: '#f4f4f4' });
  const ctx = mainCanvas.getContext('2d');
  await drawTiles({ ctx, zoom: zoom.base, center: adjustedCenter });

  const tangents = getCircleTangents(
    { r: outerRadius, point: magnifierCenter },
    centerPoint,
  );
  drawShadowTriangle(ctx, centerPoint, tangents);

  drawMagnifierCircle(ctx, magnifierCenter, outerRadius);

  const magnifierCanvas = await createMagnifierCanvas(
    innerRadius * 2,
    zoom.magnifier,
    center,
  );

  await drawClippedMagnifier(ctx, magnifierCanvas, magnifierCenter, innerRadius);

  const buf = ctx.canvas.toBuffer('image/png');
  return buf;
};
