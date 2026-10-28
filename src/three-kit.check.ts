// Chequeo de keys(): npm run check
// Con tramos lineales la velocidad de la cámara saltaba en cada par y se veía como un tirón.
import assert from 'node:assert/strict';
import { keys } from './three-kit.ts';

const ks: [number, number][] = [[0, 0], [0.5, 0.09], [0.62, 0.24], [1, 1]];
for (const [x, y] of ks) assert.ok(Math.abs(keys(x, ks) - y) < 1e-9, `pasa por (${x}, ${y})`);

const N = 1000;
let prev = keys(0, ks);
let prevSpeed = NaN;
let maxJump = 0;
for (let i = 1; i <= N; i++) {
  const v = keys(i / N, ks);
  assert.ok(v >= prev - 1e-12, `nunca retrocede (p=${i / N})`);
  const speed = (v - prev) * N;
  if (i > 1) maxJump = Math.max(maxJump, Math.abs(speed - prevSpeed));
  prevSpeed = speed;
  prev = v;
}
assert.ok(maxJump < 0.1, `la velocidad no salta entre frames (salto máx ${maxJump.toFixed(3)})`);
console.log(`keys ok · salto máx de velocidad ${maxJump.toFixed(4)}`);
