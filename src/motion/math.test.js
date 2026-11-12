import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flightVector, interpolate } from './math.js';

test('interpolate: extremos y punto medio redondeado', () => {
  assert.equal(interpolate(10000, 22000, 0), 10000);
  assert.equal(interpolate(10000, 22000, 1), 22000);
  assert.equal(interpolate(10000, 22000, 0.5), 16000);
  assert.equal(interpolate(0, 3, 0.5), 2);
});

test('interpolate: también hacia abajo', () => {
  assert.equal(interpolate(22000, 10000, 0.25), 19000);
});

test('interpolate: el progreso fuera de 0…1 no se pasa del valor final', () => {
  assert.equal(interpolate(100, 200, 1.4), 200);
  assert.equal(interpolate(100, 200, -0.2), 100);
});

test('flightVector: del centro del origen al centro del destino', () => {
  const from = { left: 100, top: 500, width: 88, height: 88 };
  const to = { left: 340, top: 10, width: 20, height: 20 };
  assert.deepEqual(flightVector(from, to), { startX: 144, startY: 544, dx: 206, dy: -524 });
});

test('flightVector: mismo rectángulo, desplazamiento cero', () => {
  const rect = { left: 5, top: 5, width: 10, height: 10 };
  const { dx, dy } = flightVector(rect, rect);
  assert.equal(dx, 0);
  assert.equal(dy, 0);
});
