import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  coordinate,
  center,
  zoom,
  options,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const [x, y] = projection(coordinate);
  const r = options.locationRadius;
  ctx.save();
  ctx.shadowBlur = options.locationShadowBlur;
  ctx.fillStyle = options.locationStrokeColor;
  ctx.shadowColor = options.locationShadowColor;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
  ctx.fillStyle = options.locationFillColor;
  ctx.beginPath();
  ctx.arc(x, y, r - options.locationStrokeWidth, 0, 2 * Math.PI);
  ctx.fill();
};
