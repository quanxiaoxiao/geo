import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import shelljs from 'shelljs';

const fontsDir = path.resolve(process.cwd(), 'fonts');
if (shelljs.test('-d', fontsDir)) {
  const fileList = fs.readdirSync(fontsDir);
  for (let i = 0; i < fileList.length; i++) {
    const fileName = fileList[i];
    if (/([^.]+)\.ttf$/.test(fileName)) {
      const pathname = path.resolve(fontsDir, fileName);
      GlobalFonts.registerFromPath(pathname, RegExp.$1);
    }
  }
}


export default ({ width, height, background }) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
  }
  ctx.beginPath();
  ctx.fillRect(0, 0, width, height);
  return ctx;
};
