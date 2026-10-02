import { createContext, useContext } from 'react'
import type { Product, ProductSize } from '../data/products'
import type { CartItem } from './types'

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, size: ProductSize, quantity?: number) => void
  increaseQuantity: (lineId: string) => void
  decreaseQuantity: (lineId: string) => void
  removeItem: (lineId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const value = useContext(CartContext)

  if (!value) {
    throw new Error('useCart must be used inside a CartProvider')
  }

  return value
}
