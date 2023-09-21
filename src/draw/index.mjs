import createCanvas from '../createCanvas.mjs';
import drawTiles from './drawTiles.mjs';
import drawFromGeoJson from './drawFromGeoJson.mjs';
import drawLocation from './drawLocation.mjs';
import drawCircle from './drawCircle.mjs';
import drawHeatmap from './drawHeatmap.mjs';
import drawCluster from './drawCluster.mjs';
import drawHexbin from './drawHexbin.mjs';
import drawGrid from './drawGrid.mjs';
import drawScale from './drawScale.mjs';

export default async ({
  width,
  height,
  center,
  zoom,
  data,
  ...options
}) => {
  const ctx = createCanvas(width, height);
  if (!options.hideTile) {
    await drawTiles({
      ctx,
      zoom,
      center,
    });
  }
  switch (options.type) {
    case 'location':
      drawLocation({
        ctx,
        zoom,
        coordinate: data.coordinates,
        center,
        options,
      });
      break;
    case 'range':
      drawCircle({
        ctx,
        zoom,
        center,
        coordinate: data.coordinates,
        radius: options.range,
      });
      break;
    case 'heatmap': {
      if (data.type === 'MultiPoint') {
        drawHeatmap({
          ctx,
          center,
          zoom,
          coordinates: data.coordinates,
          options,
        });
      }
      break;
    }
    case 'hexbin': {
      if (data.type === 'MultiPoint') {
        drawHexbin({
          ctx,
          center,
          zoom,
          coordinates: data.coordinates,
          options,
        });
      }
      break;
    }
    case 'grid': {
      if (data.type === 'MultiPoint') {
        drawGrid({
          ctx,
          center,
          zoom,
          radius: 8,
          coordinates: data.coordinates,
        });
      }
      break;
    }
    case 'cluster': {
      if (data.type === 'MultiPoint') {
        drawCluster({
          ctx,
          center,
          zoom,
          coordinates: data.coordinates,
          options,
        });
      }
      break;
    }
    default:
      drawFromGeoJson({
        ctx,
        zoom,
        data,
        center,
        options,
      });
  }
  drawScale({
    ctx,
    zoom,
    center,
  });
  const buf = ctx.canvas.toBuffer('image/png');

  process.stdout.write(buf);
};
