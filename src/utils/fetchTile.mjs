import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import shelljs from 'shelljs';
import UserAgent from 'user-agents';
import { fetchData } from '@quanxiaoxiao/about-http';

export default async (x, y, z) => {
  const userAgent = new UserAgent({ platform: 'Win32' });
  const basedir = path.resolve(process.cwd(), 'tiles', `${z}`, `${x}`);
  if (!shelljs.test('-d', basedir)) {
    shelljs.mkdir('-p', basedir);
  }
  const pathname = path.join(basedir, `${y}.png`);
  if (shelljs.test('-f', pathname)) {
    return fs.readFileSync(pathname);
  }
  const host = `webrd${['01', '02', '03', '04'][_.random([0, 3])]}.is.autonavi.com`;
  const buf = await fetchData({
    url: `http://${host}/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
    headers: {
      host,
      'user-agent': userAgent.toString(),
    },
    match: (statusCode) => statusCode === 200,
  });
  fs.writeFileSync(pathname, buf);
  return buf;
};
