import _ from 'lodash';
import UserAgent from 'user-agents';
import { fetchData } from '@quanxiaoxiao/about-http';

export default async (x, y, z) => {
  const host = `webrd${['01', '02', '03', '04'][_.random([0, 3])]}.is.autonavi.com`;
  const buf = await fetchData({
    url: `http://${host}/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=${x}&y=${y}&z=${z}`,
    headers: {
      host,
      'user-agent': UserAgent.random(),
    },
    match: (statusCode) => statusCode === 200,
  });
  return buf;
};
