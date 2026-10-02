import { SIZE_OPTIONS } from '../../data/products'
import type { ProductSize } from '../../data/products'
import './SizeSelector.css'

type SizeSelectorProps = {
  selectedSize: ProductSize
  onSizeChange: (size: ProductSize) => void
  legend: string
}

export function SizeSelector({
  selectedSize,
  onSizeChange,
  legend,
}: SizeSelectorProps) {
  return (
    <fieldset className="size-selector">
      <legend className="size-selector__legend">{legend}</legend>
      <div className="size-selector__options">
        {SIZE_OPTIONS.map((option) => {
          const isSelected = option.size === selectedSize

          return (
            <label
              key={option.size}
              className={`size-selector__option${
                isSelected ? ' size-selector__option--selected' : ''
              }`}
            >
              <input
                className="visually-hidden"
                type="radio"
                name="product-size"
                value={option.size}
                checked={isSelected}
                onChange={() => onSizeChange(option.size)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
