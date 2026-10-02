import { useCart } from '../cart/CartContext'
import { Button } from '../components/Button/Button'
import { CartLineItem } from '../components/CartLineItem/CartLineItem'
import { CartSummary } from '../components/CartSummary/CartSummary'
import { EmptyState } from '../components/EmptyState/EmptyState'
import { formatPrice } from '../lib/formatCurrency'
import { useRouter } from '../router/RouterContext'
import { ROUTE_PATHS } from '../router/routes'
import './page.css'

export function CartPage() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const { navigate } = useRouter()

  function handleContinueShopping() {
    navigate(ROUTE_PATHS.shop)
  }

  return (
    <div className="page">
      <p className="page__eyebrow">Bag</p>
      <h1 className="page__title">Your bag</h1>
      <p className="page__lede">
        {items.length === 0
          ? 'Your bag is waiting.'
          : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} · ${formatPrice(subtotal)}`}
      </p>

      <section className="page__section cart-page">
        {items.length === 0 ? (
          <EmptyState
            title="Your bag is empty"
            description="Browse the collection and add a fragrance to get started."
          >
            <Button to={ROUTE_PATHS.shop} variant="primary">
              Continue shopping
            </Button>
          </EmptyState>
        ) : (
          <>
            <ul className="cart-page__lines">
              {items.map((item) => (
                <CartLineItem key={item.lineId} item={item} />
              ))}
            </ul>

            <div className="cart-page__panel">
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                onContinueShopping={handleContinueShopping}
              />
              <button
                type="button"
                className="cart-page__clear"
                onClick={clearCart}
              >
                Clear bag
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
