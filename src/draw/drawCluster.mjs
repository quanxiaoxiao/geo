import _ from 'lodash';
import Supercluster from 'supercluster';
import * as scale from 'd3-scale';
import { mercator } from '../utils/index.mjs';

export default ({
  ctx,
  coordinates,
  center,
  zoom,
  textColor = '#fff',
  fill = '#f00',
  fontSize = 14,
  radius = 120,
  range = [30, 60],
  domain = [4, 200],
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    width,
    height,
    center,
    zoom,
  });
  const radiusScale = scale
    .scaleSqrt()
    .range(range)
    .domain(domain)
    .clamp(true);
  const clusterIndex = new Supercluster({
    radius,
    minPoints: domain[0],
    extent: 256,
    minZoom: zoom,
    maxZoom: zoom,
  });
  clusterIndex.load(coordinates.map((coordinate) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coordinate,
    },
  })));
  const arr = clusterIndex.getClusters([-180, -85, 180, 85], zoom);
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const coordinate = item.geometry.coordinates;
    const [x, y] = projection(coordinate);
    if (_.get(item, 'properties.point_count') != null) {
      const count = item.properties.point_count;
      ctx.fillStyle = fill;
      ctx.beginPath();
      const r = radiusScale(count);
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `bold ${fontSize}px serif`;
      ctx.fillStyle = textColor;
      ctx.beginPath();
      const text = `${count}`;
      const metrics = ctx.measureText(text);
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillText(text, x - metrics.width * 0.5, y + textHeight * 0.5);
    }
  }
};
