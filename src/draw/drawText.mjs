export default ({
  ctx,
  name,
  textColor = '#000',
  fontSize = 16,
  fontFamily,
  bold,
  x,
  y,
}) => {
  const { width } = ctx.canvas;
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px`;
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
    position.y = fontSize * 2 + position.y;
  } else {
    position.y = y + position.y;
  }
  if (x != null) {
    position.x = x;
  }
  ctx.fillText(name, position.x, position.y);
};
