import checkBbox from './checkBbox.mjs';

export default (bbox) => {
  checkBbox(bbox);
  const diffX = bbox[1][0] - bbox[0][0];
  const diffY = bbox[1][1] - bbox[0][1];
  return [
    bbox[0][0] + diffX * 0.5,
    bbox[0][1] + diffY * 0.5,
  ];
};
