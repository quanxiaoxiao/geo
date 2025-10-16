import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import shelljs from 'shelljs';

export default ({
  ctx,
  pathname,
}) => {
  assert(/\.png$/.test(pathname));
  const buf = ctx.canvas.toBuffer('image/png');
  const dir = path.resolve(pathname, '..');
  if (!shelljs.test('-d', dir)) {
    shelljs.mkdir('-p', dir);
  }

  fs.writeFileSync(pathname, buf);
};
