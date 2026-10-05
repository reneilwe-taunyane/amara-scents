import { getPriceForSize, getProductById, MAX_QUANTITY_PER_LINE } from '../data/products'
import type { ProductSize } from '../data/products'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { createLineId } from './types'
import type { CartItem } from './types'

const CART_STORAGE_KEY = 'amara-scents-cart'
const CART_STORAGE_VERSION = 1

type StoredCartItem = {
  productId: string
  size: string
  quantity: number
}

type StoredCart = {
  version: number
  items: StoredCartItem[]
}

function isProductSize(value: unknown): value is ProductSize {
  return value === '50ml' || value === '100ml'
}

function toCartItem(entry: StoredCartItem): CartItem | null {
  const product = getProductById(entry.productId)

  if (!product || !isProductSize(entry.size)) {
    return null
  }

  const quantity = Math.min(
    Math.max(Math.trunc(entry.quantity), 1),
    MAX_QUANTITY_PER_LINE,
  )

  return {
    lineId: createLineId(product.id, entry.size),
    productId: product.id,
    name: product.name,
    slug: product.slug,
    size: entry.size,
    unitPrice: getPriceForSize(entry.size),
    quantity,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
  }
}

/**
 * Only identifiers and quantities are persisted. Prices and product copy are
 * always re-resolved from the trusted catalogue on load, so a stale or edited
 * localStorage entry can never dictate a price.
 */
export function loadCartItems(): CartItem[] {
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue) as StoredCart | null

    if (!parsed || parsed.version !== CART_STORAGE_VERSION) {
      return []
    }

    if (!Array.isArray(parsed.items)) {
      return []
    }

    return parsed.items
      .map((entry) =>
        entry && typeof entry === 'object'
          ? toCartItem(entry as StoredCartItem)
          : null,
      )
      .filter((item): item is CartItem => item !== null)
  } catch {
    return []
  }
}

export function saveCartItems(items: CartItem[]): void {
  const payload: StoredCart = {
    version: CART_STORAGE_VERSION,
    items: items.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
    })),
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // A full or unavailable storage quota must not break the shopping journey.
  }
}

export async function loadSupabaseCartItems(): Promise<CartItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const {
    data: session,
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session.session?.user?.id) {
    return []
  }

  const userId = session.session.user.id

  const { data, error } = await supabase
    .from('cart_items')
    .select('product_id, size, quantity')
    .eq('user_id', userId)

  if (error || !data) {
    return []
  }

  return data
    .map((entry) => {
      const product = getProductById(entry.product_id)

      if (!product || !isProductSize(entry.size)) {
        return null
      }

      const quantity = Math.min(
        Math.max(Math.trunc(entry.quantity), 1),
        MAX_QUANTITY_PER_LINE,
      )

      return {
        lineId: createLineId(product.id, entry.size),
        productId: product.id,
        name: product.name,
        slug: product.slug,
        size: entry.size,
        unitPrice: getPriceForSize(entry.size),
        quantity,
        imageUrl: product.imageUrl,
        imageAlt: product.imageAlt,
      }
    })
    .filter((item): item is CartItem => item !== null)
}

export async function saveSupabaseCartItems(items: CartItem[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return
  }

  const {
    data: session,
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session.session?.user?.id) {
    return
  }

  const userId = session.session.user.id

  await supabase.from('cart_items').delete().eq('user_id', userId)

  if (items.length > 0) {
    const payload = items.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      size: item.size,
      quantity: item.quantity,
    }))

    const { error } = await supabase.from('cart_items').insert(payload)

    if (error) {
      console.error('Failed to sync cart to Supabase:', error)
    }
  }
}
