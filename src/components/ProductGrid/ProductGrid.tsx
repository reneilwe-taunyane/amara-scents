import type { Product } from '../../data/products'
import { ProductCard } from '../ProductCard/ProductCard'
import './ProductGrid.css'

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="product-grid">
      {products.map((product, index) => (
        <li key={product.id} className="product-grid__item">
          <ProductCard product={product} priority={index < 3} />
        </li>
      ))}
    </ul>
  )
}
