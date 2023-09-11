import { createCanvas } from '@napi-rs/canvas';

export default (width, height) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const bg = '#F4F4F4';
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);
  ctx.closePath();
  return ctx;
};
