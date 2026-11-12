// No deja pasar fotos rotas: cada image de la carta debe existir en public/ y llamarse <id>.webp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { products } from './menu.js';

const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));

const withImage = products.filter((product) => product.image !== null);

test('hay productos con foto', () => {
  assert.ok(withImage.length > 0);
});

for (const product of withImage) {
  test(`${product.id}: la foto se llama ${product.id}.webp y existe en public/`, () => {
    assert.equal(product.image, `/productos/${product.id}.webp`);
    assert.ok(
      existsSync(`${PUBLIC_DIR}${product.image.slice(1)}`),
      `Falta el archivo public${product.image}`,
    );
  });
}
