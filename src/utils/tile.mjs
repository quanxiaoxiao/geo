const { PI } = Math;

export const calcLngAtTileX = (lng, zoom) => ((lng + 180) % 360) / 360 * (2 ** zoom);

export const calcLatAtTileY = (lat, zoom) => (1 - Math.log(Math.tan(lat * PI / 180) + 1 / Math.cos(lat * PI / 180)) / PI) / 2 * (2 ** zoom);

export const calcTileXAtLng = (lng, z) => lng / (2 ** z) * 360 - 180;

export const calcTileYAtLat = (lat, z) => {
  const n = PI - 2 * PI * lat / (2 ** z);
  return (180 / PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
};
