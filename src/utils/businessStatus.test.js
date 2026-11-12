// Pruebas con el runner de Node (sin dependencias): npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getBusinessStatus } from './businessStatus.js';

// Fechas con el desfase de Bogotá (-05:00): el resultado no depende de la zona de la máquina.
const bogota = (hhmm) => new Date(`2026-11-12T${hhmm}:00-05:00`);

test('16:59 → cerrado, abre en 1 min', () => {
  const status = getBusinessStatus(bogota('16:59'));
  assert.equal(status.isOpen, false);
  assert.equal(status.minutesToChange, 1);
  assert.equal(status.label, 'Cerrado, abre a las 5:00 p. m. (en 1 min)');
});

test('17:00 → abierto, cierra en 6 h 0 min', () => {
  const status = getBusinessStatus(bogota('17:00'));
  assert.equal(status.isOpen, true);
  assert.equal(status.minutesToChange, 360);
  assert.equal(status.label, 'Abierto, cierra en 6 h 0 min');
});

test('22:59 → abierto, cierra en 1 min', () => {
  const status = getBusinessStatus(bogota('22:59'));
  assert.equal(status.isOpen, true);
  assert.equal(status.label, 'Abierto, cierra en 1 min');
});

test('23:00 → cerrado', () => {
  const status = getBusinessStatus(bogota('23:00'));
  assert.equal(status.isOpen, false);
  assert.equal(status.minutesToChange, 18 * 60);
});

test('03:00 → cerrado, abre en 14 h 0 min', () => {
  const status = getBusinessStatus(bogota('03:00'));
  assert.equal(status.isOpen, false);
  assert.equal(status.label, 'Cerrado, abre a las 5:00 p. m. (en 14 h 0 min)');
});

test('19:08 → abierto, cierra en 3 h 52 min', () => {
  assert.equal(getBusinessStatus(bogota('19:08')).label, 'Abierto, cierra en 3 h 52 min');
});
