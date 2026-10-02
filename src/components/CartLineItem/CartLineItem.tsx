import { useCart } from '../../cart/CartContext'
import type { CartItem } from '../../cart/types'
import { getSizeLabel } from '../../data/products'
import { formatPrice } from '../../lib/formatCurrency'
import { Link } from '../../router/Link'
import { productPath } from '../../router/routes'
import { ProductImage } from '../ProductImage/ProductImage'
import { QuantitySelector } from '../QuantitySelector/QuantitySelector'
import './CartLineItem.css'

type CartLineItemProps = {
  item: CartItem
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart()

  return (
    <li className="cart-line">
      <Link
        to={productPath(item.slug)}
        className="cart-line__media"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage src={item.imageUrl} alt={item.imageAlt} />
      </Link>

      <div className="cart-line__details">
        <h3 className="cart-line__name">
          <Link to={productPath(item.slug)} className="cart-line__link">
            {item.name}
          </Link>
        </h3>
        <p className="cart-line__size">{getSizeLabel(item.size)}</p>
        <p className="cart-line__unit-price">
          {formatPrice(item.unitPrice)} each
        </p>
      </div>

      <div className="cart-line__controls">
        <QuantitySelector
          label={`Quantity of ${item.name}`}
          value={item.quantity}
          onIncrease={() => increaseQuantity(item.lineId)}
          onDecrease={() => decreaseQuantity(item.lineId)}
        />
        <button
          type="button"
          className="cart-line__remove"
          onClick={() => removeItem(item.lineId)}
        >
          Remove
        </button>
      </div>

      <p className="cart-line__total">
        {formatPrice(item.unitPrice * item.quantity)}
      </p>
    </li>
  )
}
