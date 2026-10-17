import { addToCart, type Category, type Product } from '@mercado/contracts';
import { products } from '@mercado/mock-data';
import { useMemo, useState } from 'react';
import { ALL_CATEGORIES, filterProducts, formatPrice } from './catalog';
import styles from './CatalogApp.module.css';

const categories: Array<Category | typeof ALL_CATEGORIES> = [
  ALL_CATEGORIES,
  'Frutas e verduras',
  'Bebidas',
  'Mercearia',
  'Padaria',
  'Limpeza',
];

export default function CatalogApp() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const visibleProducts = useMemo(
    () => filterProducts(products, search, category),
    [search, category],
  );

  function handleAdd(product: Product) {
    addToCart(product);
    setLastAdded(product.id);
    window.setTimeout(() => setLastAdded((id) => (id === product.id ? null : id)), 1400);
  }

  return (
    <section className={styles.catalog} aria-labelledby="catalog-title">
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Frescos para o seu dia</p>
          <h1 id="catalog-title">Encontre o que precisa</h1>
          <p className={styles.description}>Produtos selecionados, direto para sua cesta.</p>
        </div>
        <span className={styles.resultCount}>{visibleProducts.length} produtos</span>
      </header>

      <div className={styles.filters}>
        <label className={styles.searchLabel}>
          <span className={styles.srOnly}>Buscar produto</span>
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar no mercado"
            type="search"
          />
        </label>
        <div className={styles.categoryList} aria-label="Filtrar por categoria">
          {categories.map((item) => (
            <button
              className={item === category ? styles.categoryActive : styles.category}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visibleProducts.length > 0 ? (
        <div className={styles.grid}>
          {visibleProducts.map((product) => (
            <article className={styles.card} key={product.id}>
              <div className={styles.productImage} aria-hidden="true">{product.image}</div>
              <div className={styles.cardContent}>
                <span className={styles.productCategory}>{product.category}</span>
                <h2>{product.name}</h2>
                <p className={styles.unit}>{product.unit}</p>
                <div className={styles.cardFooter}>
                  <strong>{formatPrice(product.price)}</strong>
                  <button
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                    className={lastAdded === product.id ? styles.addedButton : styles.addButton}
                    onClick={() => handleAdd(product)}
                    type="button"
                  >
                    {lastAdded === product.id ? 'Adicionado ✓' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">🧺</span>
          <h2>Nenhum produto encontrado</h2>
          <p>Tente outra busca ou remova o filtro de categoria.</p>
        </div>
      )}
    </section>
  );
}
