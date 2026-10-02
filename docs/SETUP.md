# Amara Scents --- Setup

Manual configuration only. The application code is complete; these are the
dashboard and console steps that need your own accounts and keys.

No secret values belong in this repository. `.env` and `.env.*` are ignored by
git; only `.env.example` is committed.

---

## 1. Supabase project

1. Create a project at <https://supabase.com/dashboard>.
2. **SQL Editor** → paste and run
   `supabase/migrations/20261002000001_initial_schema.sql`.
   This creates `products`, `profiles`, `orders`, `order_items`, their indexes,
   Row Level Security policies and the nine-product seed.
3. **Project Settings → API** → copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` / `publishable` key → `VITE_SUPABASE_ANON_KEY`

   Never put the `service_role` key in a `VITE_` variable. Anything prefixed
   `VITE_` is shipped to the browser.

---

## 2. Google OAuth

### Google Cloud Console

1. <https://console.cloud.google.com> → create or select a project.
2. Enable **Google People API** (optional but recommended for profile details).
3. **OAuth consent screen**:
   - Type: External
   - Add your app name, support email and developer email.
   - Scopes: `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
   - While testing, add your own Gmail address under **Test users**.
4. **Credentials → Create Credentials → OAuth client ID → Web application**.
   - Name: `Amara Scents`
   - **Authorised redirect URIs** — add all of:

     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     http://localhost:5173/checkout
     https://YOUR_VERIFIED_DOMAIN/checkout
     ```

   The Supabase callback URL is the critical one. The localhost entry is for
   local development.

5. Copy the **Client ID** and **Client Secret**.

### Supabase Google provider

1. **Authentication → Sign In / Providers → Google** → enable.
2. Paste the Client ID and Client Secret.
3. Leave **Skip nonce check** disabled unless Google asks otherwise.

---

## 3. Redirect URLs in Supabase

**Authentication → URL Configuration**:

- **Site URL** — production origin, e.g. `https://your-app.vercel.app`
- **Redirect URLs** — add:

  ```
  http://localhost:5173/**
  https://your-app.vercel.app/**
  ```

The app redirects back to `/checkout` after Google sign-in, so keep the
wildcard entries rather than listing `/checkout` alone.

---

## 4. Resend

1. Create an account at <https://resend.com> and add a sending domain.
2. Verify the domain (DNS records), or use the onboarding sandbox address for
   a first test.
3. Copy the API key (`re_...`).

The key is only ever used inside the Edge Function, never in the browser.

**Testing without a domain.** While `RESEND_FROM_EMAIL` is
`onboarding@resend.dev`, the function automatically delivers to
`delivered@resend.dev`, because Resend rejects that sender for any other
recipient. This is logged as a warning on every send. Move to a verified
`"Amara Scents <orders@your-domain.com>"` address before launch, otherwise real
customers receive nothing.

---

## 5. Edge Function secrets

From the repository root:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF

npx supabase secrets set \
  RESEND_API_KEY=re_your_key \
  RESEND_FROM_EMAIL="Amara Scents <orders@your-verified-domain.com>"
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are
injected by the platform and must not be set manually.

Deploy the function (required once, and again after any change):

```bash
npx supabase functions deploy send-order-confirmation --no-verify-jwt
```

`--no-verify-jwt` is used because the function verifies the caller's session
itself and returns a safe 401, rather than relying on the gateway.

Without `RESEND_API_KEY` the order is still saved successfully and the
confirmation screen reports that the email is pending. The order is never lost
because of an email failure.

---

## 6. Local development

```bash
npm install
cp .env.example .env.local     # then fill in the two VITE_ variables
npm run dev                    # http://localhost:5173
npm run lint
npm run build
```

To test the full order flow locally, run the Supabase stack:

```bash
npx supabase start             # local database, applies the migration
npx supabase functions serve send-order-confirmation --env-file supabase/functions/.env
```

Note that Google sign-in against a local Supabase stack requires the redirect
URI `http://127.0.0.1:54321/auth/v1/callback` to be registered.

---

## 7. Production environment variables

| Variable | Where it goes | Value |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | host build env | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | host build env | anon / publishable key |
| `RESEND_API_KEY` | Supabase Edge Function secrets | `re_...` |
| `RESEND_FROM_EMAIL` | Supabase Edge Function secrets | verified sender |

If deploying to Vercel, add the two `VITE_` variables under
**Project → Settings → Environment Variables** for Production, Preview and
Development, then redeploy so the build picks them up.

Because this is a client-side routed SPA, add a rewrite so deep links resolve.
`vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 8. Manual journey test

1. `npm run dev`, open `http://localhost:5173/shop`.
2. Choose a mood on the homepage and add a fragrance to your bag.
3. Go to `/checkout` — you should be prompted to sign in.
4. Sign in with Google, confirm you return to `/checkout` with the bag intact.
5. Submit the form empty to see validation, then place the order.
6. Confirm the order reference screen, check `orders` and `order_items` in the
   Supabase table editor, and check that the confirmation email arrives.
7. Refresh the page and confirm the bag is now empty (it clears only after a
   successful order).