export default ({
  ctx,
  name,
  textColor = '#000',
  fontSize,
  fontFamily,
  bold,
  textAlign = 'left',
  x,
  y,
}) => {
  ctx.save();
  const { width, height } = ctx.canvas;
  ctx.fillStyle = textColor;
  const size = fontSize ?? Math.max((width * 0.8) / name.length, 12);
  const fontParts = [];
  if (bold) {
    fontParts.push('bold');
  };
  fontParts.push(`${size}px`);
  if (fontFamily) {
    fontParts.push(fontFamily);
  }

  ctx.font = fontParts.join(' ');

  ctx.beginPath();
  const metrics = ctx.measureText(name);
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  let posX;
  if (x != null) {
    posX = x;
    if (textAlign === 'center') {
      posX -= metrics.width / 2;
    } else if (textAlign === 'right') {
      posX -= metrics.width;
    }
  } else {
    posX = (width - metrics.width) / 2;
  }
  const posY = (y ?? height * 0.02) + textHeight;
  ctx.fillText(name, posX, posY);
  ctx.restore();
};
