import checkBbox from './checkBbox.mjs';

export default (bbox) => {
  checkBbox(bbox);
  const minX = bbox[0][0];
  const minY = bbox[0][1];
  const maxX = bbox[1][0];
  const maxY = bbox[1][1];
  return [
    [
      [minX, maxY],
      [maxX, maxY],
      [maxX, minY],
      [minX, minY],
      [minX, maxY],
    ],
  ];
};
