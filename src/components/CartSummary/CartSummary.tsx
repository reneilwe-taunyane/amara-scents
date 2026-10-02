import { formatPrice } from '../../lib/formatCurrency'
import { Button } from '../Button/Button'
import './CartSummary.css'

type CartSummaryProps = {
  subtotal: number
  itemCount: number
  onContinueShopping: () => void
  showCheckoutButton?: boolean
}

export function CartSummary({
  subtotal,
  itemCount,
  onContinueShopping,
  showCheckoutButton = true,
}: CartSummaryProps) {
  return (
    <aside className="cart-summary" aria-label="Order summary">
      <h2 className="cart-summary__title">Summary</h2>
      <dl className="cart-summary__rows">
        <div className="cart-summary__row"><dt>Items</dt><dd>{itemCount}</dd></div>
        <div className="cart-summary__row"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
        <div className="cart-summary__row cart-summary__row--total"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
      </dl>
      <div className="cart-summary__actions">
        {showCheckoutButton && (
          <Button to="/checkout" variant="primary" fullWidth>
            Proceed to Checkout
          </Button>
        )}
        <Button variant="quiet" onClick={onContinueShopping} fullWidth>
          Continue Shopping
        </Button>
      </div>
    </aside>
  )
}
