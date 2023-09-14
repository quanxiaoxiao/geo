import {
  geoPath,
  geoMercator,
} from 'd3-geo';

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
}) => {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 3;
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
}) => {
  const [x, y] = projection(coordinate);
  ctx.fillStyle = '#f0f';
  const r = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const drawShape = ({
  ctx,
  type,
  projection,
  coordinates,
}) => {
  switch (type) {
    case 'Point':
      drawPoint({
        ctx,
        projection,
        coordinate: coordinates,
      });
      break;
    case 'Polygon':
      drawPolygon({
        ctx,
        projection,
        coordinates,
      });
      break;
    case 'LineString':
      drawLineString({
        ctx,
        projection,
        coordinates,
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
}) => {
  if (data.type === 'GeometryCollection') {
    const { geometries } = data;
    for (let i = 0; i < geometries.length; i++) {
      const geometry = geometries[i];
      draw({
        ctx,
        data: geometry,
        projection,
      });
    }
  } else if (types.includes(data.type)) {
    drawShape({
      ctx,
      type: data.type,
      projection,
      properties: data.properties || {},
      coordinates: data.coordinates,
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
      });
    }
  }
};

export default ({
  ctx,
  data,
  center,
  zoom,
}) => {
  const { width, height } = ctx.canvas;
  const projection = geoMercator()
    .scale((2 ** zoom) * 256 / Math.PI / 2)
    .center(center)
    .translate([width / 2, height / 2]);
  draw({
    ctx,
    data,
    projection,
  });
};
