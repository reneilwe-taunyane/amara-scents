import type { ProductSize } from '../data/products'

export type CartItem = {
  lineId: string
  productId: string
  name: string
  slug: string
  size: ProductSize
  unitPrice: number
  quantity: number
  imageUrl: string
  imageAlt: string
}

export type CartState = {
  items: CartItem[]
}

export function createLineId(productId: string, size: ProductSize): string {
  return `${productId}::${size}`
}
