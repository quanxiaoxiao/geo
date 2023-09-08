import fs from 'node:fs';
import path from 'node:path';
import generateImage from './generateImage.mjs';

const pointList = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'points.json')));

const buf = await generateImage({
  list: pointList,
});

fs.writeFileSync(path.resolve(process.cwd(), 'cqq.png'), buf);
