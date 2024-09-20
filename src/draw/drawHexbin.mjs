import * as scale from 'd3-scale';
import chroma from 'chroma-js';
import mercator from '../utils/mercator.mjs';
import {
  makeIndex,
  calcPixelWidthByDistance,
} from '../utils/index.mjs';

const thirdPi = Math.PI / 3;

const angles = [
  0,
  thirdPi,
  thirdPi * 2,
  thirdPi * 3,
  thirdPi * 4,
  thirdPi * 5,
];

const drawHexagon = ({
  radius,
  x,
  y,
  ctx,
  color,
}) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
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
  const hexbinRadius = calcPixelWidthByDistance(radius, zoom, center[1]);
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const colorScale = scale
    .scaleSequential((t) => chroma.scale(colors).domain([0, 1])(t).hex())
    .domain(domain)
    .clamp(true);
  const arr = coordinates.map((coordinate) => projection(coordinate));
  const index = makeIndex(arr);
  const w = Math.sin(angles[1]) * hexbinRadius * 2;
  const h = hexbinRadius * 2 - Math.cos(angles[1]) * hexbinRadius;
  let y = h * 0.5;
  let i = 0;
  ctx.save();
  ctx.globalAlpha = opacity;
  while (y < height + hexbinRadius) {
    y = i * h;
    let x = w * 0.5;
    let j = 0;
    while (x < width + hexbinRadius) {
      x = j * w;
      const p = [
        (i & 1) ? x + w * 0.5 : x,
        y,
      ];
      const count = index
        .within(p[0], p[1], hexbinRadius)
        .length;
      if (count >= domain[0]) {
        drawHexagon({
          ctx,
          radius: hexbinRadius,
          x: p[0],
          y: p[1],
          color: colorScale(count),
        });
      }
      j++;
    }
    i++;
  }
  ctx.restore();
};
