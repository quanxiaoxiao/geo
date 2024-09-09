const calcDist = (p1, p2) => {
  const x1 = p1.coordinate[0];
  const y1 = p1.coordinate[1];
  const x2 = p2.coordinate[0];
  const y2 = p2.coordinate[1];
  return Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2;
};

export default (list) => {
  const len = list.length;
  if (len === 0) {
    return null;
  }
  if (len === 1) {
    return list[0].coordinate;
  }
  const result = [];
  for (let i = 0; i < len - 1; i++) {
    const p1 = list[i];
    const x1 = p1.coordinate[0];
    const y1 = p1.coordinate[1];
    const arr = [];
    for (let j = 0; j < len; j++) {
      if (i !== j) {
        const p2 = list[j];
        const x2 = p2.coordinate[0];
        const y2 = p2.coordinate[1];
        const dist = calcDist(p1, p2);
        arr.push({
          x1,
          y1,
          x2,
          y2,
          dist,
        });
      }
    }
    result.push({
      x: x1,
      y: y1,
      dist: arr.reduce((acc, cur) => acc + cur.dist, 0) / arr.length,
    });
  }
  let index = -1;
  let min = Infinity;
  for (let i = 0; i < result.length; i++) {
    const d = result[i];
    if (d.dist < min) {
      min = d.dist;
      index = i;
    }
  }
  if (index === -1) {
    return null;
  }
  const p = result[index];
  return [p.x, p.y];
};
