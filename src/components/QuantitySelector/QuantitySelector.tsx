import { MAX_QUANTITY_PER_LINE } from '../../data/products'
import './QuantitySelector.css'

type QuantitySelectorProps = {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  label: string
  disabled?: boolean
}

export function QuantitySelector({
  value,
  onDecrease,
  onIncrease,
  label,
  disabled = false,
}: QuantitySelectorProps) {
  const canDecrease = !disabled && value > 1
  const canIncrease = !disabled && value < MAX_QUANTITY_PER_LINE

  return (
    <div className="quantity-selector">
      <span className="visually-hidden" id="quantity-label">
        {label}
      </span>
      <button
        type="button"
        className="quantity-selector__button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        &minus;
      </button>
      <output
        className="quantity-selector__value"
        aria-labelledby="quantity-label"
      >
        {value}
      </output>
      <button
        type="button"
        className="quantity-selector__button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
  )
}
