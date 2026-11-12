import { modifierGroups } from '../data/menu.js';

/**
 * Grupos de opciones de un producto, en el orden de modifierGroupIds.
 * Un id que no exista en modifierGroups se ignora.
 * @param {{ modifierGroupIds?: string[] }} product
 */
export const getProductGroups = (product) =>
  (product.modifierGroupIds ?? [])
    .map((groupId) => modifierGroups.find((group) => group.id === groupId))
    .filter(Boolean);
