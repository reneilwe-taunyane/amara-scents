import { ProductGrid } from '../components/ProductGrid/ProductGrid'
import { PRODUCTS } from '../data/products'
import './page.css'

export function ShopPage() {
  return (
    <div className="page">
      <p className="page__eyebrow">Shop</p>
      <h1 className="page__title">All fragrances</h1>
      <p className="page__lede">
        Nine signatures, each available in 50 ml and 100 ml. Choose a size, then
        add it to your bag.
      </p>

      <section className="page__section">
        <ProductGrid products={PRODUCTS} />
      </section>
    </div>
  )
}
