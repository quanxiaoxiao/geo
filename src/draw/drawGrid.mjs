import chroma from 'chroma-js';
import * as scale from 'd3-scale';

import {
  makeIndex,
} from '../utils/index.mjs';
import mercator from '../utils/mercator.mjs';

export default ({
  ctx,
  center,
  zoom,
  coordinates,
  radius = 8,
  domain = [5, 128],
}) => {
  const { width, height } = ctx.canvas;
  const colorScale = scale
    .scaleSequential((t) => chroma.scale(['yellow', 'red', 'black']).domain([0, 1])(t).hex())
    .domain(domain)
    .clamp(true);
  const countX = width / (radius * 2);
  const countY = height / (radius * 2);
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const r = 1 / Math.sin(45 * Math.PI / 180) * radius;
  const arr = coordinates.map((coordinate) => projection(coordinate));
  const index = makeIndex(arr);
  const row = Math.floor(countY);
  const column = Math.floor(countX);
  const transform = [
    (width - column * (radius * 2)) / 2 + radius,
    (height - row * (radius * 2)) / 2 + radius,
  ];
  ctx.save();
  ctx.globalAlpha = 0.8;
  for (let x = 0; x < column; x++) {
    for (let y = 0; y < row; y++) {
      const p = [
        x * radius * 2 + transform[0],
        y * radius * 2 + transform[1],
      ];
      const x1 = p[0] - radius;
      const y1 = p[1] - radius;
      const x2 = p[0] + radius;
      const y2 = p[1] + radius;
      const result = index.within(p[0], p[1], r);
      const count = result.filter((i) => {
        const d = arr[i];
        return d[0] >= x1 && d[0] <= x2 && d[1] >= y1 && d[1] <= y2;
      }).length;
      if (count >= domain[0]) {
        ctx.fillStyle = colorScale(count);
        ctx.beginPath();
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fill();
      }
    }
  }
  ctx.restore();
};
