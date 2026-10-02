// Amara Scents --- order creation and Brevo confirmation.
//
// Runs as a Supabase Edge Function using the service role, so it can write
// orders that the browser's RLS policies deliberately forbid. Prices and
// totals are resolved from the products table; nothing the client sends about
// money is trusted.
//
// Required secrets (set with `supabase secrets set`):
//   BREVO_API_KEY       (Brevo -> SMTP & API -> API Keys)
//   BREVO_SENDER_EMAIL  (must be a sender verified in Brevo)
//   BREVO_SENDER_NAME   (optional, defaults to "Amara Scents")
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
// by the platform.

import { createClient } from 'npm:@supabase/supabase-js@2'

const ALLOWED_SIZES = ['50ml', '100ml'] as const
type Size = (typeof ALLOWED_SIZES)[number]
const MAX_QUANTITY_PER_LINE = 10

type OrderItemRequest = {
  product_id?: unknown
  size?: unknown
  quantity?: unknown
}

type OrderRequest = {
  customer?: Record<string, unknown>
  items?: OrderItemRequest[]
}

type ResolvedItem = {
  productId: string
  productName: string
  size: Size
  unitPrice: number
  quantity: number
  lineTotal: number
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) return null
  return trimmed
}

function readEmail(value: unknown): string | null {
  const text = readText(value, 254)
  if (!text) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text : null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

type ConfirmationEmailInput = {
  to: string
  fullName: string
  orderReference: string
  items: ResolvedItem[]
  subtotal: number
  shipping: number
  total: number
  address: string[]
}

function buildConfirmationEmail(input: ConfirmationEmailInput): string {
  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #F3C6C8;">
            <div style="font-family:Georgia,serif;font-size:16px;color:#251713;">${escapeHtml(
              item.productName,
            )}</div>
            <div style="font-size:13px;color:#6A554E;padding-top:2px;">
              ${item.size === '50ml' ? '50 ml' : '100 ml'} &middot; Qty ${item.quantity}
            </div>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #F3C6C8;color:#251713;font-size:14px;">
            ${escapeHtml(formatZAR(item.lineTotal))}
          </td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en-ZA">
  <body style="margin:0;padding:0;background-color:#FFF4DF;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#251713;padding:32px 16px;">
      <tr>
        <td align="center">
          <div style="font-family:Georgia,serif;font-size:22px;color:#FFF4DF;letter-spacing:2px;">
            AMARA <span style="color:#E9684A;">SCENTS</span>
          </div>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td style="font-family:Georgia,serif;font-size:26px;color:#251713;line-height:1.25;">
                Thank you, ${escapeHtml(input.fullName)}.
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;font-size:15px;color:#251713;line-height:1.7;">
                Your order is confirmed. We are preparing your fragrances now, and
                they will be on their way shortly.
              </td>
            </tr>
            <tr>
              <td style="padding-top:28px;font-size:13px;color:#6A554E;letter-spacing:1px;text-transform:uppercase;">
                Order reference
              </td>
            </tr>
            <tr>
              <td style="font-size:20px;color:#251713;font-weight:bold;">${escapeHtml(
                input.orderReference,
              )}</td>
            </tr>
            <tr>
              <td style="padding-top:28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:14px;color:#6A554E;">Subtotal</td>
                    <td align="right" style="font-size:14px;color:#251713;">${escapeHtml(
                      formatZAR(input.subtotal),
                    )}</td>
                  </tr>
                  <tr>
                    <td style="padding-top:6px;font-size:14px;color:#6A554E;">Shipping</td>
                    <td align="right" style="padding-top:6px;font-size:14px;color:#251713;">${escapeHtml(
                      formatZAR(input.shipping),
                    )}</td>
                  </tr>
                  <tr>
                    <td style="padding-top:10px;font-size:16px;color:#251713;font-weight:bold;border-top:1px solid #C9A66B;">
                      Total
                    </td>
                    <td align="right" style="padding-top:10px;font-size:16px;color:#251713;font-weight:bold;border-top:1px solid #C9A66B;">
                      ${escapeHtml(formatZAR(input.total))}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;font-size:13px;color:#6A554E;line-height:1.7;">
                Delivering to<br />
                ${escapeHtml(input.address.join(', '))}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 16px;font-size:12px;color:#6A554E;">
          Amara Scents &middot; Premium South African fragrance
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// Brevo only accepts mail from a sender that has been verified in the Brevo
// dashboard, so the sender address is configuration rather than something we
// can invent here.
function resolveSender(): { name: string; email: string } | null {
  const email = (
    Deno.env.get('BREVO_SENDER_EMAIL') ?? Deno.env.get('RESEND_FROM_EMAIL') ?? ''
  ).trim()
  const name = (Deno.env.get('BREVO_SENDER_NAME') ?? '').trim() || 'Amara Scents'

  if (!email) {
    return null
  }

  return { name, email }
}

async function sendConfirmationEmail(
  email: ConfirmationEmailInput,
): Promise<boolean> {
  const apiKey = Deno.env.get('BREVO_API_KEY')
  const sender = resolveSender()

  if (!apiKey) {
    console.error('Brevo is not configured: BREVO_API_KEY is missing.')
    return false
  }

  if (!sender) {
    console.error(
      'Brevo is not configured: BREVO_SENDER_EMAIL is missing. The sender must be verified in Brevo.',
    )
    return false
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: sender.name, email: sender.email },
      to: [{ email: email.to, name: email.fullName }],
      subject: `Your Amara Scents order ${email.orderReference}`,
      htmlContent: buildConfirmationEmail(email),
      textContent: `Thank you, ${email.fullName}. Your Amara Scents order ${email.orderReference} is confirmed. Total: ${formatZAR(email.total)}.`,
    }),
  })

  if (!response.ok) {
    let detail = ''
    try {
      detail = await response.text()
    } catch {
      detail = '<response body could not be read>'
    }
    // Server-side only. The browser receives a generic message so that no
    // provider detail or stack trace is ever exposed.
    console.error(
      `Brevo rejected the confirmation email (status ${response.status}): ${detail}`,
    )
    return false
  }

  return true
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Server is not configured' }, 500)
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    // 1. Validate the session.
    const authorization = request.headers.get('Authorization') ?? ''
    const accessToken = authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length).trim()
      : ''

    if (!accessToken) {
      return jsonResponse({ error: 'You must be signed in to order.' }, 401)
    }

    const { data: userData, error: userError } =
      await admin.auth.getUser(accessToken)

    if (userError || !userData.user?.email) {
      return jsonResponse({ error: 'Your session has expired. Please sign in again.' }, 401)
    }

    const user = userData.user

    // 2. Validate the request payload.
    let payload: OrderRequest
    try {
      payload = (await request.json()) as OrderRequest
    } catch {
      return jsonResponse({ error: 'Invalid request body.' }, 400)
    }

    const customer = payload.customer ?? {}
    const email = readEmail(user.email) ?? readEmail(customer.email)
    const fullName = readText(customer.full_name, 120)
    const phone = readText(customer.phone, 32)
    const address = readText(customer.address, 200)
    const city = readText(customer.city, 100)
    const province = readText(customer.province, 100)
    const postalCode = readText(customer.postal_code, 12)
    const country = readText(customer.country, 80) ?? 'South Africa'

    if (
      !email ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !province ||
      !postalCode
    ) {
      return jsonResponse({ error: 'Please complete all delivery details.' }, 400)
    }

    const requestedItems = Array.isArray(payload.items) ? payload.items : []
    if (requestedItems.length === 0) {
      return jsonResponse({ error: 'Your bag is empty.' }, 400)
    }

    const requested = requestedItems.map((item) => {
      const productId = readText(item.product_id, 64)
      const size = readText(item.size, 8)
      const quantity = Number(item.quantity)

      if (
        !productId ||
        !size ||
        !ALLOWED_SIZES.includes(size as Size) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY_PER_LINE
      ) {
        return null
      }

      return { productId, size: size as Size, quantity }
    })

    if (requested.some((item) => item === null)) {
      return jsonResponse({ error: 'Your bag contains an invalid item.' }, 400)
    }

    const validItems = requested as {
      productId: string
      size: Size
      quantity: number
    }[]

    // 3. Resolve prices from trusted product data.
    const productIds = [...new Set(validItems.map((item) => item.productId))]
    const { data: products, error: productsError } = await admin
      .from('products')
      .select('id, name, price_50ml, price_100ml, is_active')
      .in('id', productIds)
      .eq('is_active', true)

    if (productsError) {
      return jsonResponse({ error: 'We could not verify your bag. Please try again.' }, 500)
    }

    const priceById = new Map(
      (products ?? []).map((product) => [
        product.id as string,
        {
          name: product.name as string,
          price50: Number(product.price_50ml),
          price100: Number(product.price_100ml),
        },
      ]),
    )

    const resolved: ResolvedItem[] = []

    for (const item of validItems) {
      const product = priceById.get(item.productId)

      if (!product) {
        return jsonResponse({ error: 'A fragrance in your bag is unavailable.' }, 400)
      }

      const unitPrice = item.size === '50ml' ? product.price50 : product.price100

      resolved.push({
        productId: item.productId,
        productName: product.name,
        size: item.size,
        unitPrice,
        quantity: item.quantity,
        lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
      })
    }

    // 4. Calculate totals.
    const subtotal =
      Math.round(
        resolved.reduce((total, item) => total + item.lineTotal, 0) * 100,
      ) / 100
    const shipping = 0
    const total = Math.round((subtotal + shipping) * 100) / 100

    // 5. Create the order.
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        email,
        full_name: fullName,
        phone,
        address,
        city,
        province,
        postal_code: postalCode,
        country,
        subtotal,
        shipping,
        total,
        status: 'confirmed',
      })
      .select('id, order_reference, total')
      .single()

    if (orderError || !order) {
      return jsonResponse(
        { error: 'We could not save your order. Please try again.' },
        500,
      )
    }

    // 6. Create order items.
    const { error: itemsError } = await admin.from('order_items').insert(
      resolved.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name_snapshot: item.productName,
        selected_size: item.size,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        line_total: item.lineTotal,
      })),
    )

    if (itemsError) {
      // Do not leave a partial order behind.
      await admin.from('orders').delete().eq('id', order.id)
      return jsonResponse(
        { error: 'We could not save your order items. Please try again.' },
        500,
      )
    }

    // 7. Trigger Brevo only after successful persistence.
    const emailSent = await sendConfirmationEmail({
      to: email,
      fullName,
      orderReference: order.order_reference,
      items: resolved,
      subtotal,
      shipping,
      total,
      address: [address, city, province, postalCode, country],
    })

    // 8. Return a safe response.
    return jsonResponse(
      {
        orderId: order.id,
        orderReference: order.order_reference,
        total,
        emailSent,
      },
      201,
    )
  } catch {
    // Never leak stack traces or provider detail to the browser.
    return jsonResponse({ error: 'Something went wrong. Please try again.' }, 500)
  }
})