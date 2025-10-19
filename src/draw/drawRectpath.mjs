export default (ctx, rect, radius) => {
  if (radius) {
    const { x, y, width, height } = rect;
    const radiusList = Array.isArray(radius) ? radius : [radius, radius, radius, radius];
    ctx.beginPath();
    ctx.moveTo(x + radiusList[0], y);
    ctx.lineTo(x + width - radiusList[1], y);
    ctx.arc(x + width - radiusList[1], y + radiusList[1], radiusList[1], -Math.PI / 2, 0);
    ctx.lineTo(x + width, y + height - radiusList[2]);
    ctx.arc(x + width - radiusList[2], y + height - radiusList[2], radiusList[2], 0, Math.PI / 2);
    ctx.lineTo(x + radiusList[3], y + height);
    ctx.arc(x + radiusList[3], y + height - radiusList[3], radiusList[3], Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + radiusList[0]);
    ctx.arc(x + radiusList[0], y + radiusList[0], radiusList[0], Math.PI, 1.5 * Math.PI);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.moveTo(rect.x, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
    ctx.lineTo(rect.x, rect.y + rect.height);
    ctx.closePath();
  }
};
