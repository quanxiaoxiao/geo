import assert from 'node:assert';

import request from '@quanxiaoxiao/http-request';
import { fileTypeFromBuffer } from 'file-type';
import _ from 'lodash';
import UserAgent from 'user-agents';

const userAgent = new UserAgent({ platform: 'Win32' });

export default async (x, y, z) => {
  assert(_.isNumber(x) && _.isNumber(y) && _.isNumber(z));
  assert(x >= 0 && y >= 0 && z >= 0);
  const hostname = `webrd${['01', '02', '03', '04'][_.random([0, 3])]}.is.autonavi.com`;
  try {

    const ret = await request(
      {
        path: `/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
        headers: {
          Host: hostname,
          Accept: '*/*',
          'user-agent': userAgent.random().data.userAgent,
        },
      },
      {
        hostname,
        port: 443,
        rejectUnauthorized: false,
        protocol: 'https:',
      },
    );
    if (ret.statusCode !== 200 || !ret.body) {
      return null;
    }

    const mime = await fileTypeFromBuffer(ret.body);
    if (!mime) {
      return null;
    }
    if (!/^image\//.test(mime.mime)) {
      return null;
    }
    return ret.body;
  } catch (error) {
    console.error(error);
    return null;
  }
};
