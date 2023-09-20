export default {
  center: [121.52895, 29.89411],
  width: 1680,
  height: 1680,
  zoom: 12,
  hideTile: false,
  grid: {
    radius: 8,
    domain: [1, 128],
    colors: ['yellow', 'red', 'black'],
  },
  heatmap: {
    radius: 300,
    colors: [
      'rgb(0, 0, 255)',
      'rgb(0, 255, 0)',
      'yellow',
      'rgb(255, 0, 0)',
    ],
    opacity: 0.06,
  },
  cluster: {
    fillColor: '#f00',
    textColor: '#fff',
    point: {
      fillColor: '#00f',
      radius: 5,
    },
    textSize: 14,
    radius: 120,
    range: [30, 60],
    domain: [4, 200],
  },
  point: {
    fillColor: '#f00',
    radius: 6,
  },
  lineString: {
    strokeColor: '#f00',
    strokeWidth: 6,
  },
  location: {
    radius: 12,
    shadowBlur: 4,
    strokeColor: '#fff',
    strokeWidth: 2,
    fillColor: '#0f89f5',
    shadowColor: '#000',
  },
  hexbin: {
    radius: 600,
    opacity: 0.8,
    domain: [1, 128],
    colors: ['yellow', 'red', 'black'],
  },
};
