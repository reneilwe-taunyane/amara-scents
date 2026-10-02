# Security --- Amara Scents

## Secrets

Never commit `.env`, `.env.local`, Resend API keys, Google OAuth
secrets or privileged Supabase credentials.

## Client/server separation

Resend credentials must remain server-side. Privileged operations must
not be exposed directly to the browser.

## Authentication

Use Supabase Auth for session management and Google OAuth.

## Database

Enable appropriate RLS policies so users can only access authorised
private records.

## Order integrity

Do not trust browser-supplied prices or totals. Resolve trusted prices
and calculate totals server-side.

## Validation

Validate email, names, phone, address, postal code, product IDs, sizes
and quantities.

## Errors

Do not expose secrets or stack traces.
