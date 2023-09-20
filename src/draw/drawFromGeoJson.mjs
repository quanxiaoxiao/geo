import { geoPath } from 'd3-geo';
import { mercator } from '../utils/index.mjs';

/*
const centroid = geoCentroid(geoJson);
const bounds = geoBounds(geoJson);
const scale = 1 / Math.min(
  (bounds[1][0] - bounds[0][0]) * Math.PI / 180 / width,
  (bounds[1][1] - bounds[0][1]) * Math.PI / 180 / height,
);
const zoom = Math.max(10, Math.min(Math.floor(Math.log(scale / 40.5) / Math.LN2), 18));
*/

const types = [
  'Point',
  'Polygon',
  'LineString',
];

const multipleTypes = [
  'MultiPoint',
  'MultiLineString',
  'MultiPolygon',
];

const drawPolygon = ({
  ctx,
  projection,
  coordinates,
}) => {
  ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  geoPath()
    .projection(projection)
    .context(ctx)({
      type: 'Polygon',
      coordinates,
    });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawLineString = ({
  ctx,
  projection,
  coordinates,
  options,
}) => {
  ctx.strokeStyle = options.lineStringStrokeColor;
  ctx.lineWidth = options.lineStringStrokeWidth;
  ctx.beginPath();
  geoPath()
    .projection(projection)
    .context(ctx)({
      type: 'LineString',
      coordinates,
    });
  ctx.closePath();
  ctx.stroke();
};

const drawPoint = ({
  ctx,
  projection,
  coordinate,
  options,
}) => {
  const [x, y] = projection(coordinate);
  ctx.fillStyle = options.pointFillColor;
  const r = options.pointRadius;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const drawShape = ({
  ctx,
  type,
  projection,
  coordinates,
  options,
}) => {
  switch (type) {
    case 'Point':
      drawPoint({
        ctx,
        projection,
        coordinate: coordinates,
        options,
      });
      break;
    case 'Polygon':
      drawPolygon({
        ctx,
        projection,
        coordinates,
        options,
      });
      break;
    case 'LineString':
      drawLineString({
        ctx,
        projection,
        coordinates,
        options,
      });
      break;
    default:
      break;
  }
};

const draw = ({
  ctx,
  data,
  projection,
  options,
}) => {
  if (data.type === 'GeometryCollection') {
    const { geometries } = data;
    for (let i = 0; i < geometries.length; i++) {
      const geometry = geometries[i];
      draw({
        ctx,
        data: geometry,
        projection,
        options,
      });
    }
  } else if (types.includes(data.type)) {
    drawShape({
      ctx,
      type: data.type,
      projection,
      properties: data.properties || {},
      coordinates: data.coordinates,
      options,
    });
  } else if (multipleTypes.includes(data.type)) {
    const type = data.type.match(/Multi(\w+)/)[1];
    for (let i = 0; i < data.coordinates.length; i++) {
      drawShape({
        ctx,
        type,
        projection,
        properties: data.properties || {},
        coordinates: data.coordinates[i],
        options,
      });
    }
  }
};

export default ({
  ctx,
  data,
  center,
  zoom,
  options,
}) => {
  const { width, height } = ctx.canvas;
  const projection = mercator({
    zoom,
    center,
    width,
    height,
  });

  draw({
    ctx,
    data,
    projection,
    options,
  });
};
