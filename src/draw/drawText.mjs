export default ({
  ctx,
  name,
  textColor = '#000',
  fontSize,
  fontFamily,
  bold,
  x,
  y,
}) => {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = textColor;
  let size = fontSize;
  if (!size) {
    const len = name.length;
    size = Math.max(width * 0.8 / len, 12);
  }
  ctx.font = `${size}px`;
  if (bold) {
    ctx.font = `bold ${ctx.font}`;
  }
  if (fontFamily) {
    ctx.font = `${ctx.font} ${fontFamily}`;
  }
  ctx.beginPath();
  const metrics = ctx.measureText(name);
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const position = {
    x: width * 0.5 - metrics.width * 0.5,
    y: textHeight,
  };
  if (y == null) {
    position.y = height * 0.02 + position.y;
  } else {
    position.y = y + position.y;
  }
  if (x != null) {
    position.x = x;
  }
  ctx.fillText(name, position.x, position.y);
};
