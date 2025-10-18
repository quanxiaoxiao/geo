import assert from 'node:assert';
import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';

export default (buf) => {
  assert(Buffer.isBuffer(buf));
  const dataImage = `data:image/png;base64,${buf.toString('base64')}`;
  spawn('open', ['-a', 'Google Chrome', dataImage]);
};
