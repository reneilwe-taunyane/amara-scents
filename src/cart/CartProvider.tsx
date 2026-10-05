import { useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { getPriceForSize } from '../data/products'
import type { Product, ProductSize } from '../data/products'
import { cartReducer, getCartItemCount, getCartSubtotal } from './cartReducer'
import { loadCartItems, saveCartItems, loadSupabaseCartItems, saveSupabaseCartItems } from './cartStorage'
import { CartContext } from './CartContext'
import { createLineId } from './types'
import { useAuth } from '../auth/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

type CartProviderProps = {
  children: ReactNode
}

function createInitialState() {
  return { items: loadCartItems() }
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, undefined, createInitialState)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      if (user && isSupabaseConfigured) {
        const items = await loadSupabaseCartItems()
        if (!cancelled) {
          dispatch({ type: 'hydrate', items })
        }
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  useEffect(() => {
    saveCartItems(state.items)

    if (user && isSupabaseConfigured) {
      void saveSupabaseCartItems(state.items)
    }
  }, [state.items, user?.id])

  const value = useMemo(
    () => ({
      items: state.items,
      itemCount: getCartItemCount(state.items),
      subtotal: getCartSubtotal(state.items),
      addItem: (product: Product, size: ProductSize, quantity = 1) => {
        dispatch({
          type: 'addItem',
          item: {
            lineId: createLineId(product.id, size),
            productId: product.id,
            name: product.name,
            slug: product.slug,
            size,
            unitPrice: getPriceForSize(size),
            quantity,
            imageUrl: product.imageUrl,
            imageAlt: product.imageAlt,
          },
        })
      },
      increaseQuantity: (lineId: string) =>
        dispatch({ type: 'increaseQuantity', lineId }),
      decreaseQuantity: (lineId: string) =>
        dispatch({ type: 'decreaseQuantity', lineId }),
      removeItem: (lineId: string) => dispatch({ type: 'removeItem', lineId }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
