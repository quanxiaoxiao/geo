import fs from 'node:fs';
import path from 'node:path';
import shelljs from 'shelljs';
import { fetchData } from '@quanxiaoxiao/about-http';

export default async (x, y, z) => {
  const basedir = path.resolve(process.cwd(), 'tiles', `${z}`, `${x}`);
  if (!shelljs.test('-d', basedir)) {
    shelljs.mkdir('-p', basedir);
  }
  const pathname = path.join(basedir, `${y}.png`);
  if (shelljs.test('-f', pathname)) {
    return fs.readFileSync(pathname);
  }
  const buf = await fetchData({
    url: `http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
    headers: {
      host: 'webrd02.is.autonavi.com',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    },
    match: (statusCode) => statusCode === 200,
  });
  fs.writeFileSync(pathname, buf);
  return buf;
};
