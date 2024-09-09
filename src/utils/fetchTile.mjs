import _ from 'lodash';
import UserAgent from 'user-agents';
import request from '@quanxiaoxiao/http-request';

const userAgent = new UserAgent({ platform: 'Win32' });

export default async (x, y, z) => {
  const hostname = `webrd${['01', '02', '03', '04'][_.random([0, 3])]}.is.autonavi.com`;
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
  if (ret.statusCode !== 200) {
    throw new Error(ret.body.toString());
  }
  return ret.body;
};
