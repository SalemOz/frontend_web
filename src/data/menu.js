// Datos base de Burger Zone.
// Los precios son enteros en pesos colombianos (COP); nunca se usan decimales.
// Cualquier dato que falte de la carta real queda marcado con "TODO: carta real".

export const categories = [
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    description: 'Jugosas y con todo el sabor',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85',
    // Decorativo: la sección actual de categorías lo muestra junto al nombre.
    icon: '☰',
  },
  {
    id: 'perros',
    name: 'Perros calientes',
    description: 'El clásico que nunca falla',
    image:
      'https://images.unsplash.com/photo-1768250708131-23da8d1cb5ad?auto=format&fit=crop&w=700&q=85',
    icon: '↝',
  },
  {
    id: 'salchipapas',
    name: 'Salchipapas',
    description: 'Papas, salchicha y mucho más',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85',
    icon: '♨',
  },
  {
    id: 'fritos',
    name: 'Fritos',
    description: 'Crujientes y deliciosos',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85',
    icon: '✦',
  },
  {
    id: 'combos',
    name: 'Combos',
    description: 'Más sabor, más comida y todo lo que te gusta',
    // TODO: carta real — falta una imagen propia para la categoría Combos.
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85',
    icon: '★',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    description: 'Refrescantes y llenas de sabor',
    // TODO: carta real — falta una imagen propia para la categoría Bebidas.
    image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=85',
    icon: '✳',
  },
];

export const modifierGroups = [
  {
    id: 'adicionales',
    name: 'Adicionales',
    type: 'multiple',
    required: false,
    // TODO: carta real — el negocio definirá los adicionales y sus precios.
    // Estas opciones son solo de prueba para validar el carrito.
    options: [
      { id: 'adicional-queso', name: 'Queso extra (prueba)', price: 2000 },
      { id: 'adicional-tocineta', name: 'Tocineta (prueba)', price: 3000 },
      { id: 'adicional-carne', name: 'Porción de carne (prueba)', price: 4500 },
    ],
  },
];

export const products = [
  {
    id: 'producto-1',
    categoryId: 'hamburguesas',
    name: 'Hamburguesa Clásica',
    description: 'Carne de res, queso, lechuga, tomate, cebolla y salsa de la casa',
    price: 12000,
    image: categories[0].image,
    modifierGroupIds: ['adicionales'],
  },
  {
    id: 'producto-2',
    categoryId: 'salchipapas',
    name: 'Salchipapa Especial',
    description: 'Papas fritas, salchicha, queso y salsa de la casa',
    price: 15000,
    image: categories[2].image,
    // TODO: carta real — definir si la salchipapa admite adicionales.
  },

  // ---------------------------------------------------------------------------
  // Bebidas: antes eran solo tarjetas informativas en la sección de bebidas.
  // Ahora son productos normales para que el menú pueda listarlas.
  // ---------------------------------------------------------------------------
  {
    id: 'bebida-jugos-naturales',
    categoryId: 'bebidas',
    name: 'Jugos naturales',
    description: 'Refrescantes y llenos de sabor',
    // TODO: carta real — precio pendiente.
    price: 0,
    image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'bebida-gaseosas',
    categoryId: 'bebidas',
    name: 'Gaseosas',
    description: 'Postobon, Coca-Cola, Pepsi y más',
    // TODO: carta real — precio pendiente.
    price: 0,
    image:
      'https://images.unsplash.com/photo-1544241907-f3f1f5ded15a?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'bebida-limonadas',
    categoryId: 'bebidas',
    name: 'Limonadas',
    description: 'Natural, de coco, cerezada y más',
    // TODO: carta real — precio pendiente.
    price: 0,
    image:
      'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=700&q=85',
  },

  // ---------------------------------------------------------------------------
  // Combos: antes vivían en su propio arreglo; ahora son productos con categoría.
  // ---------------------------------------------------------------------------
  {
    id: 'combo-1',
    categoryId: 'combos',
    name: 'Combo clásico',
    description: 'Hamburguesa + papas fritas + gaseosa',
    price: 16900,
    image: categories[0].image,
    // TODO: carta real — definir los adicionales permitidos en cada combo.
  },
  {
    id: 'combo-2',
    categoryId: 'combos',
    name: 'Combo salchipapa',
    description: 'Salchipapa especial + gaseosa',
    price: 13900,
    image: categories[2].image,
  },
  {
    id: 'combo-3',
    categoryId: 'combos',
    name: 'Combo perro',
    description: 'Perro americano + papas + gaseosa',
    price: 14900,
    image: categories[1].image,
  },
  {
    id: 'combo-4',
    categoryId: 'combos',
    name: 'Combo dúo',
    description: 'Dos hamburguesas + papas para compartir',
    price: 29900,
    image: categories[0].image,
  },

  // TODO: carta real — faltan los productos de las categorías "perros" y "fritos".
];

export const formatPrice = (price) =>
  price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
