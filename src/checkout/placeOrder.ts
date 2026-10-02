import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type PlaceOrderItem = {
  product_id: string
  size: string
  quantity: number
}

export type PlaceOrderRequest = {
  customer: {
    full_name: string
    phone: string
    email: string
    address: string
    city: string
    province: string
    postal_code: string
    country: string
  }
  items: PlaceOrderItem[]
}

export type PlaceOrderResult = {
  orderId: string
  orderReference: string
  total: number
  emailSent: boolean
}

export class PlaceOrderError extends Error {}

/**
 * Prices and totals are deliberately absent from the request. The Edge
 * Function resolves them from the products table.
 */
export async function placeOrder(
  request: PlaceOrderRequest,
): Promise<PlaceOrderResult> {
  if (!isSupabaseConfigured || !supabase) {
    throw new PlaceOrderError(
      'Checkout is unavailable because Supabase is not configured.',
    )
  }

  const { data, error } = await supabase.functions.invoke<PlaceOrderResult>(
    'send-order-confirmation',
    { body: request },
  )

  if (error) {
    throw new PlaceOrderError(
      error.message || 'We could not place your order. Please try again.',
    )
  }

  if (!data?.orderId) {
    throw new PlaceOrderError('We could not place your order. Please try again.')
  }

  return data
}