# Database --- Amara Scents

## Provider

Supabase PostgreSQL.

## Core entities

### products

id, name, slug, description, scent_notes, mood, price_50ml, price_100ml,
image_url, stock_quantity (if used), is_active, created_at, updated_at.

### profiles

id linked to authenticated user, full_name, email, phone, created_at,
updated_at.

### orders

id, user_id, email, full_name, phone, address, city, province,
postal_code, country, subtotal, shipping, total, status, created_at.

### order_items

id, order_id, product_id, product_name_snapshot, selected_size,
unit_price, quantity, line_total.

## Pricing

50 ml = R250. 100 ml = R500.

## Security

Use RLS appropriately. Users must not access another user's private
order data. Public product reads should be limited to active products.

These tables/fields are an implementation plan, not additional HNG
requirements.
