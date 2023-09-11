import fs from 'node:fs';
import path from 'node:path';
import drawPoint from './drawPoint.mjs';
// import generateImage from './generateImage.mjs';

/*
const pointList = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'points.json')));

const buf = await generateImage({
  list: pointList,
  minSize: 50,
  range: 100,
});
*/
const buf = await drawPoint({
  coordinate: [121.548766, 29.869589],
});

fs.writeFileSync(path.resolve(process.cwd(), 'cqq.png'), buf);
