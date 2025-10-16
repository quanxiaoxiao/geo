import * as turf from '@turf/turf';

const polygon = turf.bboxPolygon([
  73.6753792663,
  18.197700914,
  135.026311477,
  53.4588044297,
]);

export default (coordinate) => {
  const point = turf.point(coordinate);
  return turf.booleanPointInPolygon(point, polygon);
};
