import fs from 'node:fs';
import path from 'node:path';
import gcoord from 'gcoord';
import createCanvas from './createCanvas.mjs';
import drawFromGeoJson from './draw/drawFromGeoJson.mjs';
import drawLocation from './draw/drawLocation.mjs';
import drawTiles from './draw/drawTiles.mjs';
import drawHeatmap from './draw/drawHeatmap.mjs';
import drawCluster from './draw/drawCluster.mjs';
import drawCircle from './draw/drawCircle.mjs';
import drawGrid from './draw/drawGrid.mjs';

const pointList = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'points.json')));
const trajectory = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'trajectory.json')));

const coordinates = [[[121.52889657301763, 29.86599910748], [121.53011132059895, 29.867578231321545], [121.53177760750184, 29.86711562532632], [121.5348040295706, 29.866034441671047], [121.53570483572582, 29.865034764808208], [121.53573800310427, 29.86418790240593], [121.53578327187168, 29.86252512428669], [121.53455668292037, 29.860936151305697], [121.53336711172156, 29.85999319025979], [121.53047496613428, 29.861396590489463], [121.52777412662499, 29.86391823255128], [121.52767274207693, 29.864627913244938], [121.52889657301763, 29.86599910748]]];

const geoJson = {
  type: 'Polygon',
  coordinates,
};

const ctx = createCanvas(3680, 3680);

const center = gcoord.transform(
  [121.52895, 29.89411],
  gcoord.WGS84,
  gcoord.GCJ02,
);
const zoom = 12;

await drawTiles({
  center,
  ctx,
  zoom,
});

/*
drawFromGeoJson({
  ctx,
  center,
  zoom,
  data: gcoord.transform(
    {
      type: 'MultiPoint',
      coordinates: pointList.map((d) => d.coordinate),
    },
    gcoord.WGS84,
    gcoord.GCJ02,
  ),
});

drawFromGeoJson({
  ctx,
  center,
  zoom,
  data: gcoord.transform(
    geoJson,
    gcoord.WGS84,
    gcoord.GCJ02,
  ),
});
*/

drawLocation({
  ctx,
  coordinate: center,
  center,
  zoom,
});

/*
drawFromGeoJson({
  ctx,
  center,
  zoom,
  data: {
    type: 'GeometryCollection',
    geometries: [
      gcoord.transform(
        {
          type: 'LineString',
          coordinates: trajectory.map((d) => d.coordinate),
        },
        gcoord.WGS84,
        gcoord.GCJ02,
      ),
    ],
  },
});

drawHeatmap({
  ctx,
  center,
  zoom,
  coordinates: gcoord.transform(
    {
      type: 'MultiPoint',
      coordinates: pointList.map((d) => d.coordinate),
    },
    gcoord.WGS84,
    gcoord.GCJ02,
  ).coordinates,
});

drawCluster({
  ctx,
  center,
  zoom,
  coordinates: gcoord.transform(
    {
      type: 'MultiPoint',
      coordinates: pointList.map((d) => d.coordinate),
    },
    gcoord.WGS84,
    gcoord.GCJ02,
  ).coordinates,
});

drawCircle({
  ctx,
  center,
  zoom,
  coordinate: center,
  radius: 2000,
});
*/

drawGrid({
  ctx,
  center,
  zoom,
  radius: 16,
  coordinates: gcoord.transform(
    {
      type: 'MultiPoint',
      coordinates: pointList.map((d) => [d.coordinate[0], d.coordinate[1]]),
    },
    gcoord.WGS84,
    gcoord.GCJ02,
  ).coordinates,
});

/*
drawFromGeoJson({
  ctx,
  center,
  zoom,
  data: gcoord.transform(
    {
      type: 'MultiPoint',
      coordinates: pointList.map((d) => [d.coordinate[0], d.coordinate[1]]),
    },
    gcoord.WGS84,
    gcoord.GCJ02,
  ),
});
*/

const buf = ctx.canvas.toBuffer('image/png');

fs.writeFileSync(path.resolve(process.cwd(), 'cqq.png'), buf);
