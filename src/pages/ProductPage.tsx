import { useEffect, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { Button } from '../components/Button/Button'
import { ProductGallery } from '../components/ProductGallery/ProductGallery'
import { QuantitySelector } from '../components/QuantitySelector/QuantitySelector'
import { SizeSelector } from '../components/SizeSelector/SizeSelector'
import {
  MAX_QUANTITY_PER_LINE,
  getPriceForSize,
  getProductBySlug,
  getSizeLabel,
} from '../data/products'
import type { Product, ProductSize } from '../data/products'
import { formatPrice } from '../lib/formatCurrency'
import { Link } from '../router/Link'
import { ROUTE_PATHS } from '../router/routes'
import './product-page.css'

type ProductPageProps = {
  slug: string
}

type ProductDetailProps = {
  product: Product
}

function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<ProductSize>('50ml')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!isAdded) {
      return
    }

    const timer = window.setTimeout(() => setIsAdded(false), 2500)
    return () => window.clearTimeout(timer)
  }, [isAdded])

  const unitPrice = getPriceForSize(selectedSize)

  return (
    <div className="page product-page">
      <nav className="product-page__breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to={ROUTE_PATHS.shop}>Shop</Link>
          </li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="product-page__layout">
        <ProductGallery
          name={product.name}
          images={[{ src: product.imageUrl, alt: product.imageAlt }]}
        />

        <div className="product-page__info">
          <p className="page__eyebrow">Eau de parfum</p>
          <h1 className="product-page__name">{product.name}</h1>

          <p className="product-page__description">{product.description}</p>

          <dl className="product-page__facts">
            <div>
              <dt>Scent notes</dt>
              <dd>{product.notes.join(' · ')}</dd>
            </div>
            <div>
              <dt>Mood</dt>
              <dd>{product.mood.join(' · ')}</dd>
            </div>
          </dl>

          <p className="product-page__price">
            {formatPrice(unitPrice)}{' '}
            <span className="product-page__price-size">
              / {getSizeLabel(selectedSize)}
            </span>
          </p>

          <SizeSelector
            legend="Choose a size"
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          <div className="product-page__quantity">
            <QuantitySelector
              label="Quantity"
              value={quantity}
              onIncrease={() =>
                setQuantity((current) =>
                  Math.min(current + 1, MAX_QUANTITY_PER_LINE),
                )
              }
              onDecrease={() => setQuantity((current) => Math.max(current - 1, 1))}
            />
          </div>

          <div className="product-page__actions">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                addItem(product, selectedSize, quantity)
                setIsAdded(true)
              }}
            >
              Add to Bag &middot; {formatPrice(unitPrice * quantity)}
            </Button>
            <p className="product-page__status" role="status">
              {isAdded ? `${quantity} × ${product.name} added to your bag.` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductPage({ slug }: ProductPageProps) {
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="page">
        <p className="page__eyebrow">Not found</p>
        <h1 className="page__title">Fragrance not found</h1>
        <p className="page__lede">
          We could not find a fragrance called &ldquo;{slug}&rdquo;.
        </p>
        <p className="product-page__back">
          <Button to={ROUTE_PATHS.shop} variant="primary">
            Back to the collection
          </Button>
        </p>
      </div>
    )
  }

  return <ProductDetail product={product} />
}
