import type { Product } from '@mercado/contracts';

export const ALL_CATEGORIES = 'Todos';

export function filterProducts(
  products: Product[],
  search: string,
  category: string,
): Product[] {
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
    const matchesCategory = category === ALL_CATEGORIES || product.category === category;

    return matchesSearch && matchesCategory;
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}
