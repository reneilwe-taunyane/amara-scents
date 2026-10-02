import { Button } from '../components/Button/Button'
import { formatPrice } from '../lib/formatCurrency'
import { ROUTE_PATHS } from '../router/routes'
import './order-confirmation.css'

export function OrderConfirmationPage() {
  const params = new URLSearchParams(window.location.search)
  const orderReference = params.get('ref')
  const totalValue = Number(params.get('total'))
  const emailState = params.get('email')
  const total = Number.isFinite(totalValue) ? totalValue : null

  if (!orderReference) {
    return (
      <div className="page">
        <p className="page__eyebrow">Order</p>
        <h1 className="page__title">No recent order</h1>
        <p className="page__lede">
          We could not find an order confirmation on this device.
        </p>
        <p className="order-confirmation__back">
          <Button to={ROUTE_PATHS.shop} variant="primary">
            Back to the collection
          </Button>
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <section className="order-confirmation">
        <p className="page__eyebrow">Thank you</p>
        <h1 className="order-confirmation__title">
          Your order is <span className="script-accent">confirmed</span>.
        </h1>

        <p className="page__lede">
          We are preparing your fragrances now. Keep your reference handy if you
          need to get in touch.
        </p>

        <dl className="order-confirmation__facts">
          <div>
            <dt>Order reference</dt>
            <dd>{orderReference}</dd>
          </div>
          {total !== null && (
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          )}
        </dl>

        <p className="order-confirmation__email" role="status">
          {emailState === 'pending'
            ? 'Your order was saved, but the confirmation email could not be sent just now. Please contact us if it does not arrive.'
            : 'A confirmation email is on its way to your inbox.'}
        </p>

        <div className="order-confirmation__actions">
          <Button to={ROUTE_PATHS.shop} variant="primary">
            Continue shopping
          </Button>
        </div>
      </section>
    </div>
  )
}