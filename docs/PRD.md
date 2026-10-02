# Product Requirements Document --- Amara Scents

## Product

Amara Scents is a premium South African fragrance ecommerce website.

## Required customer journey

Home → Shop → Product → Select size → Add to Bag → Cart → Google
authentication → Checkout → Place order → Supabase persistence → Resend
confirmation email.

## Required functionality

### Storefront

Display all 9 fragrances with real product imagery, names, notes,
descriptions, moods, sizes and prices.

### Pricing

-   50 ml: R250
-   100 ml: R500

### Product detail

Image/gallery, name, notes, mood, description, size selector, price,
quantity and Add to Bag.

### Cart

Add, remove, change quantity, show selected size, calculate totals and
handle empty state.

### Google authentication

Functional Google sign-in using Supabase Auth + Google OAuth configured
through Google Cloud Console.

### Checkout

Customer and delivery details, order summary, Place Order, and
persistence to Supabase.

### Resend

Send a confirmation email after a successful order is persisted.

## Product catalogue

1.  VELVET HOUR --- Vanilla · Cashmere · Musk
2.  AFTERGLOW --- Amber · Tonka · Warm Woods
3.  SAHARA --- Spiced Citrus · Saffron · Amber
4.  NOCTURNE --- Black Plum · Rose · Incense
5.  SWEET TALK --- Caramel · Jasmine · Vanilla
6.  SOLÉIL --- Bergamot · Neroli · White Musk
7.  EMBER --- Smoked Vanilla · Cedar · Amber
8.  FIG & HONEY --- Fig · Honey · Sandalwood
9.  SEA TIME --- Bergamot · Sea Salt · Cedarwood

## Optional

Welcome/discount popup and newsletter UI may be added only after
required functionality works.

## Out of scope

Real payment gateways, complex admin systems, reviews, wishlists,
coupons, advanced analytics and unrelated integrations.
