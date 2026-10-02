# API / Integration Contract --- Amara Scents

## Products

Production product data should come from Supabase rather than remain
permanently hardcoded in the frontend.

## Authentication

Use Supabase Auth with Google provider.

## Order creation

The trusted order flow should: 1. Validate the session/user as required.
2. Validate products, sizes and quantities. 3. Resolve prices from
trusted product data. 4. Calculate totals. 5. Create the order. 6.
Create order items. 7. Trigger Resend only after successful
persistence. 8. Return a safe success/error response.

## Resend

Keep credentials server-side. Send confirmation after successful order
persistence.

## Errors

Do not expose API keys, database credentials, provider secrets or stack
traces.
