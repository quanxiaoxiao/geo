export default (ctx, rect, radius) => {
  const { x, y, width, height } = rect;

  ctx.beginPath();

  if (!radius) {
    ctx.rect(x, y, width, height);
  } else {
    const [tl, tr, br, bl] = Array.isArray(radius)
      ? radius
      : [radius, radius, radius, radius];

    ctx.moveTo(x + tl, y);
    ctx.arcTo(x + width, y, x + width, y + height, tr);
    ctx.arcTo(x + width, y + height, x, y + height, br);
    ctx.arcTo(x, y + height, x, y, bl);
    ctx.arcTo(x, y, x + width, y, tl);
  }

  ctx.closePath();
};
