const { PI } = Math;

export const calcLngAtTileX = (lng, zoom) => ((lng + 180) % 360) / 360 * (2 ** zoom);

export const calcLatAtTileY = (lat, zoom) => (1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * (2 ** zoom);

export const calcTileXAtLng = (lng, zoom) => lng / (2 ** zoom) * 360 - 180;

export const calcTileYAtLat = (lat, zoom) => {
  const n = PI - 2 * PI * lat / (2 ** zoom);
  return (180 / PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
};
