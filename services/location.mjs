import gcoord from 'gcoord';

import {
  createCanvas,
  drawLocation,
  drawScale,
  drawText,
  drawTiles,
} from '../src/index.mjs';
import checkCoordinate from '../src/utils/checkCoordinate.mjs';
import fetchActions from './fetchActions.mjs';

export default async ({
  zoom = 17,
  width = 960,
  height = 960,
  coordinate,
}) => {
  checkCoordinate(coordinate);
  const center = gcoord.transform(
    coordinate,
    gcoord.WGS84,
    gcoord.GCJ02,
  );

  const canvas = createCanvas({
    width,
    height,
    background: '#f4f4f4',
  });

  const ctx = canvas.getContext('2d');

  await drawTiles({
    ctx,
    zoom,
    center,
  });

  drawScale({
    ctx,
    zoom,
    center,
  });

  drawLocation({
    ctx,
    center,
    zoom,
  });

  const { name: locationName } = await fetchActions.geocoder({
    lng: coordinate[0],
    lat: coordinate[1],
  });

  const fontSize = width * 0.02;

  drawText({
    ctx,
    fontFamily: 'SimSun',
    name: coordinate.join(','),
    fontSize,
    textAlign: 'right',
    y: height - fontSize * 3.2,
    x: width - fontSize * 1.2,
  });

  drawText({
    ctx,
    fontFamily: 'SimSun',
    name: locationName,
    fontSize,
    textAlign: 'right',
    y: height - fontSize * 2.2,
    x: width - fontSize * 1.2,
  });

  const buf = ctx.canvas.toBuffer('image/png');
  return buf;
};
