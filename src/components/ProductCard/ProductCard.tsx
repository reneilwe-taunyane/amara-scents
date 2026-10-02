import { useEffect, useState } from 'react'
import { useCart } from '../../cart/CartContext'
import { getPriceForSize } from '../../data/products'
import type { Product, ProductSize } from '../../data/products'
import { formatPrice } from '../../lib/formatCurrency'
import { productPath } from '../../router/routes'
import { Link } from '../../router/Link'
import { ProductImage } from '../ProductImage/ProductImage'
import { SizeSelector } from '../SizeSelector/SizeSelector'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<ProductSize>('50ml')
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!isAdded) {
      return
    }

    const timer = window.setTimeout(() => setIsAdded(false), 2500)
    return () => window.clearTimeout(timer)
  }, [isAdded])

  function handleAddToBag() {
    addItem(product, selectedSize, 1)
    setIsAdded(true)
  }

  return (
    <article className="product-card">
      <Link
        to={productPath(product.slug)}
        className="product-card__media-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.imageAlt}
          priority={priority}
          sizes="(min-width: 1440px) 24rem, (min-width: 768px) 40vw, 90vw"
        />
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={productPath(product.slug)} className="product-card__link">
            {product.name}
          </Link>
        </h3>

        <p className="product-card__notes">{product.notes.join(' · ')}</p>
        <p className="product-card__mood">{product.mood.join(' · ')}</p>

        <p className="product-card__price">
          {formatPrice(getPriceForSize(selectedSize))}
        </p>

        <SizeSelector
          legend={`Size for ${product.name}`}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />

        <div className="product-card__actions">
          <button
            type="button"
            className="product-card__add"
            onClick={handleAddToBag}
          >
            Add to Bag
          </button>
          <p className="product-card__status" role="status">
            {isAdded ? 'Added to your bag' : ''}
          </p>
        </div>
      </div>
    </article>
  )
}
