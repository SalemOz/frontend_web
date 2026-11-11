// ============================================================
// Carta real del negocio (transcrita de las 2 caras del menú impreso).
// Precios en pesos colombianos (COP), enteros.
// Precios confirmados: los del menú impreso están en miles ("$12" = $12.000).
// Fotos: image es null hasta tener fotos reales de cada producto.
// ============================================================

export const categories = [
  { id: 'hamburguesas', name: 'Hamburguesas', description: 'Jugosas y con todo el sabor', image: null },
  { id: 'perros', name: 'Perros calientes', description: 'El clásico que nunca falla', image: null },
  { id: 'papas', name: 'Salchipapas y choripapas', description: 'Papas a la francesa con todo', image: null },
  { id: 'patacolos', name: 'Patacolos', description: 'Patacón con relleno al gusto', image: null },
  { id: 'mexicana', name: 'Comida mexicana', description: 'Tacos, burros y flautas', image: null },
  { id: 'especiales', name: 'Platos especiales', description: 'A la parrilla y al carbón', image: null },
  { id: 'bebidas', name: 'Bebidas', description: 'Jugos, gaseosas, malteadas y más', image: null },
];

export const modifierGroups = [
  {
    id: 'pan-o-platano',
    name: 'Pan o plátano',
    type: 'single',
    required: true,
    options: [
      { id: 'pan', name: 'En pan', price: 0 },
      { id: 'platano', name: 'En plátano', price: 0 },
    ],
  },
  {
    id: 'sabor-jugo',
    name: 'Sabor',
    type: 'single',
    required: true,
    options: [
      { id: 'maracuya', name: 'Maracuyá', price: 0 },
      { id: 'chulupa', name: 'Chulupa', price: 0 },
      { id: 'mora', name: 'Mora', price: 0 },
      { id: 'limonada', name: 'Limonada', price: 0 },
      { id: 'lulo', name: 'Lulo', price: 0 },
      { id: 'batido', name: 'Batido', price: 0 },
    ],
  },
  {
    // Adicionales habituales del negocio. La lista puede crecer más adelante.
    id: 'adicionales',
    name: 'Adicionales',
    type: 'multiple',
    required: false,
    options: [
      { id: 'porcion-papa', name: 'Porción de papa', price: 4000 },
      { id: 'porcion-papa-criolla', name: 'Porción de papa criolla', price: 4000 },
    ],
  },
];

export const products = [
  // ---------- Hamburguesas ----------
  { id: 'hamb-clasica', categoryId: 'hamburguesas', name: 'Hamburguesa Clásica', price: 10000, image: null,
    description: 'Carne de res, cebolla, tomate, lechuga, queso y salsas de la casa, en pan o plátano.',
    modifierGroupIds: ['pan-o-platano', 'adicionales'] },
  { id: 'hamb-tentadora', categoryId: 'hamburguesas', name: 'Hamburguesa Tentadora', price: 15000, image: null,
    description: 'Carne de res, pollo apanado, cebolla, tomate, lechuga, salsas de la casa y queso.',
    modifierGroupIds: ['adicionales'] },
  { id: 'hamb-salvaje', categoryId: 'hamburguesas', name: 'Hamburguesa Salvaje', price: 18000, image: null,
    description: 'Doble carne, tocineta, maíz tierno, cebolla, tomate, lechuga, queso fundido, salsa de tocineta y salsas de la casa.',
    modifierGroupIds: ['adicionales'] },
  { id: 'hamb-master', categoryId: 'hamburguesas', name: 'Hamburguesa Master', price: 18000, image: null,
    description: 'Carne de res, chorizo, tocineta, huevo frito, maíz tierno, tomate, cebolla, lechuga y queso.',
    modifierGroupIds: ['adicionales'] },
  { id: 'hamb-mexicana', categoryId: 'hamburguesas', name: 'Hamburguesa Mexicana', price: 18000, image: null,
    description: 'Carne de res, tocineta, chorizo, cebolla, tomate, guacamole, jalapeños y queso.',
    modifierGroupIds: ['adicionales'] },

  // ---------- Perros calientes ----------
  { id: 'perro-americano', categoryId: 'perros', name: 'Perro Americano', price: 12000, image: null,
    description: 'Salchicha, queso, papas ripio, salsas, tocineta, maíz tierno y cebolla grille.',
    modifierGroupIds: ['adicionales'] },
  { id: 'perro-super', categoryId: 'perros', name: 'Super Perro', price: 15000, image: null,
    description: 'Salchicha, carne desmechada, pico de gallo, queso, cebolla, lechuga, papas ripio y salsas de la casa.',
    modifierGroupIds: ['adicionales'] },
  { id: 'perro-sencillo', categoryId: 'perros', name: 'Perro Sencillo', price: 7000, image: null,
    description: 'Salchicha, queso, cebolla grille, papas ripio y salsas de la casa.',
    modifierGroupIds: ['adicionales'] },

  // ---------- Salchipapas y choripapas ----------
  { id: 'salchipapa-sencilla', categoryId: 'papas', subcategory: 'Salchipapas', name: 'Salchipapa Sencilla', price: 10000, image: null,
    description: 'Papas a la francesa, salchicha, queso, papas ripio y salsas de la casa.' },
  { id: 'salchipapa-suiza', categoryId: 'papas', subcategory: 'Salchipapas', name: 'Salchipapa Suiza', price: 15000, image: null,
    description: 'Papas a la francesa, salchicha suiza, queso, tocineta, maíz tierno, lechuga y salsas de la casa.' },
  { id: 'salchipapa-bandida', categoryId: 'papas', subcategory: 'Salchipapas', name: 'Salchipapa Bandida', price: 28000, image: null,
    description: 'Papas a la francesa, salchicha clásica, salchicha suiza, cerdo, pechuga, maíz tierno, queso, lechuga picada, cebolla, papas ripio y carne desmechada.' },
  { id: 'choripapa-clasica', categoryId: 'papas', subcategory: 'Choripapas', name: 'Choripapa Clásica', price: 12000, image: null,
    description: 'Papas a la francesa, chorizo, tomate, cebolla, lechuga, queso y salsas de la casa.' },
  { id: 'choripapa-de-la-casa', categoryId: 'papas', subcategory: 'Choripapas', name: 'Choripapa De la Casa', price: 18000, image: null,
    description: 'Chorizo, butifarra, salchicha suiza, cerdo, pollo, papas a la francesa, maíz tierno, carne desmechada, cebolla y queso.' },
  { id: 'choripapa-paro-cardiaco', categoryId: 'papas', subcategory: 'Choripapas', name: 'Choripapa Paro Cardíaco', price: 28000, image: null,
    description: 'Papas a la francesa, pollo, cerdo, carne desmechada, maíz tierno, chorizo, salchicha, butifarra, queso, cebolla grille y papas ripio.' },

  // ---------- Patacolos ----------
  { id: 'patacolo-pollo-camarones', categoryId: 'patacolos', name: 'Patacolo de Pollo con Camarones', price: 22000, image: null,
    description: 'Pollo desmechado, camarones, cebolla, queso y maíz tierno.',
    modifierGroupIds: ['adicionales'] },
  { id: 'patacolo-solo-pollo', categoryId: 'patacolos', name: 'Patacolo de Solo Pollo', price: 16000, image: null,
    description: 'Pollo desmechado, cebolla, queso y maíz tierno.',
    modifierGroupIds: ['adicionales'] },
  { id: 'patacolo-mixto', categoryId: 'patacolos', name: 'Patacolo Mixto', price: 14000, image: null,
    description: 'Carne desmechada, pollo desmechado, queso, cebolla y maíz tierno.',
    modifierGroupIds: ['adicionales'] },
  { id: 'patacon-con-todo', categoryId: 'patacolos', name: 'Patacón con Todo', price: 25000, image: null,
    description: 'Pollo y cerdo en cubos, carne desmechada, chorizo, tocineta, maíz tierno, cebolla y queso.',
    modifierGroupIds: ['adicionales'] },
  { id: 'sandwich-pollo', categoryId: 'patacolos', name: 'Sándwich de Pollo', price: 8000, image: null,
    description: 'Pollo desmechado en salsa de la casa, tomate, lechuga y queso.',
    modifierGroupIds: ['adicionales'] },
  { id: 'mazorca-mixta', categoryId: 'especiales', name: 'Mazorca Mixta', price: 16000, image: null,
    description: 'Carne desmechada, pollo y cerdo en trozos bañados en salsa de la casa, maíz desgranado, chorizo, papas a la francesa, papas ripio, lechuga y queso.' },
  { id: 'ensalada-cesar', categoryId: 'especiales', name: 'Ensalada César', price: 18000, image: null,
    description: 'Filetes de pollo a la parrilla, lechuga, tomate, maíz tierno, queso parmesano y aderezos.',
    modifierGroupIds: ['adicionales'] },

  // ---------- Comida mexicana ----------
  { id: 'taco-mixto', categoryId: 'mexicana', name: 'Taco Mixto', price: 15000, image: null, tag: 'Picante',
    description: 'Carne desmechada, pollo desmechado, salsa picante, cebolla y queso fundido.',
    modifierGroupIds: ['adicionales'] },
  { id: 'burro', categoryId: 'mexicana', name: 'Burro', price: 20000, image: null,
    description: 'Carne desmechada, pollo desmechado, cebolla, lechuga, pico de gallo, salsa picante, acompañado de papas a la francesa.' },
  { id: 'flauta', categoryId: 'mexicana', name: 'Flauta', price: 10000, image: null,
    description: 'Pollo desmechado, jamón, queso y piña melada.',
    modifierGroupIds: ['adicionales'] },

  // ---------- Platos especiales ----------
  { id: 'pechuga-parrilla', categoryId: 'especiales', name: 'Pechuga a la Parrilla', price: 22000, image: null,
    description: '300 gramos de pechuga acompañada de ensalada, papas a la francesa y salsa de ajo.' },
  { id: 'papas-locas', categoryId: 'especiales', name: 'Papas Locas', price: 26000, image: null,
    description: 'Papas margarita acompañadas de carne desmechada, pollo desmechado, chorizo, salchicha, tocineta, queso gratinado y salsas de la casa.' },
  { id: 'picada-mixta', categoryId: 'especiales', name: 'Picada Mixta', price: 25000, image: null,
    description: 'Pollo, cerdo, chorizo, papas a la francesa, papa criolla y patacón.' },
  { id: 'lomo-cerdo', categoryId: 'especiales', name: 'Lomo de Cerdo', price: 25000, image: null,
    description: 'Acompañado de papas a la francesa, papas criollas y ensalada.' },
  { id: 'costillas-bbq', categoryId: 'especiales', name: 'Costillas a la BBQ', price: 25000, image: null,
    description: 'Acompañadas de papas a la francesa, papas criollas y ensalada.' },

  // ---------- Bebidas ----------
  { id: 'gaseosa-cocacola-15', categoryId: 'bebidas', name: 'Gaseosa Coca-Cola 1.5 L', price: 8000, image: null, description: 'Botella de 1.5 litros.' },
  { id: 'gaseosa-postobon-15', categoryId: 'bebidas', name: 'Gaseosa Postobón 1.5 L', price: 7000, image: null, description: 'Botella de 1.5 litros.' },
  { id: 'gaseosa-3l', categoryId: 'bebidas', name: 'Gaseosa 3 litros', price: 10000, image: null, description: 'Botella de 3 litros.' },
  { id: 'agua-botella', categoryId: 'bebidas', name: 'Agua en botella', price: 2000, image: null, description: 'Agua en botella.' },
  { id: 'hit-litro', categoryId: 'bebidas', name: 'Hit litro', price: 6000, image: null, description: 'Jugo Hit de 1 litro.' },
  { id: 'hit-personal', categoryId: 'bebidas', name: 'Hit personal', price: 3500, image: null, description: 'Jugo Hit personal.' },
  { id: 'jugo-agua-vaso', categoryId: 'bebidas', name: 'Jugo natural en agua (vaso)', price: 5000, image: null,
    description: 'Jugo natural preparado en agua.', modifierGroupIds: ['sabor-jugo'] },
  { id: 'jugo-leche-vaso', categoryId: 'bebidas', name: 'Jugo natural en leche (vaso)', price: 6000, image: null,
    description: 'Jugo natural preparado en leche.', modifierGroupIds: ['sabor-jugo'] },
  { id: 'jugo-jarra', categoryId: 'bebidas', name: 'Jugo natural en jarra', price: 12000, image: null,
    description: 'Jugo natural en jarra para compartir.', modifierGroupIds: ['sabor-jugo'] },
  { id: 'limonada-cerezada', categoryId: 'bebidas', name: 'Limonada cerezada', price: 6000, image: null, description: 'Limonada con cereza.' },
  { id: 'copa-frutas-helado', categoryId: 'bebidas', name: 'Copa de frutas con helado', price: 12000, image: null, description: 'Copa de frutas con helado.' },
  { id: 'michelada', categoryId: 'bebidas', name: 'Michelada', price: 5000, image: null, description: 'Michelada.', ageRestricted: true },
  { id: 'cerveza-aguila', categoryId: 'bebidas', name: 'Cerveza Águila', price: 4000, image: null, description: 'Cerveza Águila.', ageRestricted: true },
];

export const formatPrice = (price) =>
  price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
