import { MAX_QUANTITY_PER_LINE } from '../data/products'
import type { CartItem, CartState } from './types'

export type CartAction =
  | { type: 'addItem'; item: CartItem }
  | { type: 'increaseQuantity'; lineId: string }
  | { type: 'decreaseQuantity'; lineId: string }
  | { type: 'removeItem'; lineId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

function clampQuantity(quantity: number): number {
  return Math.min(Math.max(quantity, 1), MAX_QUANTITY_PER_LINE)
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'addItem': {
      const existingLine = state.items.find(
        (item) => item.lineId === action.item.lineId,
      )

      if (!existingLine) {
        return { items: [...state.items, action.item] }
      }

      return {
        items: state.items.map((item) =>
          item.lineId === action.item.lineId
            ? {
                ...item,
                quantity: clampQuantity(item.quantity + action.item.quantity),
              }
            : item,
        ),
      }
    }

    case 'increaseQuantity':
      return {
        items: state.items.map((item) =>
          item.lineId === action.lineId
            ? { ...item, quantity: clampQuantity(item.quantity + 1) }
            : item,
        ),
      }

    case 'decreaseQuantity':
      return {
        items: state.items.map((item) =>
          item.lineId === action.lineId
            ? { ...item, quantity: clampQuantity(item.quantity - 1) }
            : item,
        ),
      }

    case 'removeItem':
      return {
        items: state.items.filter((item) => item.lineId !== action.lineId),
      }

    case 'clear':
      return { items: [] }

    case 'hydrate':
      return { items: action.items }
  }
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
}
