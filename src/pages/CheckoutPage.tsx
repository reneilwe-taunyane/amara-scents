import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'
import { SignInPanel } from '../components/auth/SignInPanel'
import { Button } from '../components/Button/Button'
import { CartSummary } from '../components/CartSummary/CartSummary'
import { EmptyState } from '../components/EmptyState/EmptyState'
import { ProductImage } from '../components/ProductImage/ProductImage'
import { placeOrder, PlaceOrderError } from '../checkout/placeOrder'
import {
  EMPTY_ORDER_FORM,
  validateOrderForm,
} from '../checkout/validateOrderForm'
import type { OrderFormErrors, OrderFormValues } from '../checkout/validateOrderForm'
import { getSizeLabel } from '../data/products'
import { formatPrice } from '../lib/formatCurrency'
import { useRouter } from '../router/RouterContext'
import { ROUTE_PATHS } from '../router/routes'
import './checkout.css'

type FieldName = keyof OrderFormValues

const TEXT_FIELDS: {
  name: FieldName
  label: string
  type: string
  autoComplete: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  wide?: boolean
}[] = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    autoComplete: 'name',
  },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', inputMode: 'email' },
  { name: 'address', label: 'Street address', type: 'text', autoComplete: 'street-address', wide: true },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { name: 'province', label: 'Province', type: 'text', autoComplete: 'address-level1' },
  {
    name: 'postalCode',
    label: 'Postal code',
    type: 'text',
    autoComplete: 'postal-code',
    inputMode: 'numeric',
  },
  { name: 'country', label: 'Country', type: 'text', autoComplete: 'country-name' },
]

export function CheckoutPage() {
  const { user, isLoading } = useAuth()
  const { items, itemCount, subtotal, clearCart } = useCart()
  const { navigate } = useRouter()

  const [formValues, setFormValues] = useState<OrderFormValues>(() => ({
    ...EMPTY_ORDER_FORM,
    email: user?.email ?? EMPTY_ORDER_FORM.email,
  }))
  const [errors, setErrors] = useState<OrderFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleFieldChange(name: FieldName, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const validationErrors = validateOrderForm(formValues)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    if (!user) {
      setSubmitError('Please sign in with Google before placing your order.')
      return
    }

    // A synchronous guard plus the disabled button prevents a double submit
    // from reaching the database.
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await placeOrder({
        customer: {
          full_name: formValues.fullName.trim(),
          phone: formValues.phone.trim(),
          email: formValues.email.trim(),
          address: formValues.address.trim(),
          city: formValues.city.trim(),
          province: formValues.province.trim(),
          postal_code: formValues.postalCode.trim(),
          country: formValues.country.trim(),
        },
        items: items.map((item) => ({
          product_id: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
      })

      // Only clear the bag once the order is safely persisted.
      clearCart()

      const params = new URLSearchParams({
        ref: result.orderReference,
        total: String(result.total),
        email: result.emailSent ? 'sent' : 'pending',
      })
      navigate(`${ROUTE_PATHS.orderConfirmation}?${params.toString()}`)
    } catch (error) {
      setSubmitError(
        error instanceof PlaceOrderError
          ? error.message
          : 'We could not place your order. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <p className="page__eyebrow">Checkout</p>
        <h1 className="page__title">Delivery details</h1>
        <section className="page__section">
          <EmptyState
            title="Nothing to check out yet"
            description="Add a fragrance to your bag before checking out."
          >
            <Button to={ROUTE_PATHS.shop} variant="primary">
              Continue shopping
            </Button>
          </EmptyState>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <p className="page__eyebrow">Checkout</p>
      <h1 className="page__title">Delivery details</h1>

      <div className="checkout">
        <div className="checkout__main">
          <SignInPanel>
            {user && (
              <p className="checkout__signed-in-note">
                Your confirmation email will go to {user.email}.
              </p>
            )}
          </SignInPanel>

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
          >
            <h2 className="checkout-form__title">Where should we send it?</h2>

            <div className="checkout-form__grid">
              {TEXT_FIELDS.map((field) => {
                const errorId = `${field.name}-error`
                const errorMessage = errors[field.name]

                return (
                  <div
                    key={field.name}
                    className={`checkout-field${
                      field.wide ? ' checkout-field--wide' : ''
                    }`}
                  >
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      inputMode={field.inputMode}
                      value={formValues[field.name]}
                      disabled={isSubmitting || isLoading}
                      aria-invalid={errorMessage ? true : undefined}
                      aria-describedby={errorMessage ? errorId : undefined}
                      onChange={(event) =>
                        handleFieldChange(field.name, event.target.value)
                      }
                    />
                    {errorMessage && (
                      <p className="checkout-field__error" id={errorId}>
                        <span aria-hidden="true">!</span> {errorMessage}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {submitError && (
              <p className="checkout-form__error" role="alert">
                <span aria-hidden="true">!</span> {submitError}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Placing your order…'
                : `Place order · ${formatPrice(subtotal)}`}
            </Button>

            <p className="checkout-form__fineprint">
              No payment is taken at checkout. We will email you to arrange
              payment and delivery.
            </p>
          </form>
        </div>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">Your order</h2>

          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.lineId} className="checkout-item">
                <ProductImage src={item.imageUrl} alt={item.imageAlt} />
                <div className="checkout-item__details">
                  <p className="checkout-item__name">{item.name}</p>
                  <p className="checkout-item__meta">
                    {getSizeLabel(item.size)} &middot; Qty {item.quantity} &middot;{' '}
                    {formatPrice(item.unitPrice)} each
                  </p>
                </div>
                <p className="checkout-item__total">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <CartSummary
            subtotal={subtotal}
            itemCount={itemCount}
            onContinueShopping={() => navigate(ROUTE_PATHS.shop)}
            showCheckoutButton={false}
          />
        </aside>
      </div>
    </div>
  )
}
