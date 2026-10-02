# AGENTS.md --- Amara Scents

## Project

Amara Scents is a South African premium fragrance ecommerce website for
the HNG15 individual shop assignment.

## Required assignment functionality

-   Shop/storefront with products
-   Product detail
-   Cart
-   Checkout
-   Supabase persistence
-   Google authentication
-   Resend confirmation email
-   AI-assisted development
-   Deployable/live application

Actual payment processing is optional and is not required for the core
assignment.

## Pricing

-   50 ml: R250
-   100 ml: R500

## Working rules

-   Read relevant documentation before meaningful implementation.
-   Inspect existing code before modifying it.
-   Work in small, verifiable phases.
-   Use TypeScript and maintainable components.
-   Prefer minimal dependencies.
-   Do not invent requirements.
-   Do not create fake success states for required integrations.
-   Never commit secrets.
-   Keep Resend credentials server-side.
-   Use Supabase as the persistent source of truth.
-   Validate the real user journey.

## AI-agent workflow

Read docs → inspect → explain intended changes → implement → validate →
fix → report.

Stop after each phase and wait for approval unless explicitly told to
continue.

## Scope control

Prioritise required functionality over optional polish. Defer payment
gateways, admin dashboards, reviews, wishlists, coupons, advanced
analytics and unnecessary animations.

## Design

Amara is feminine, bold, playful, sensual, classy, warm, confident,
contemporary and South African. See `docs/DESIGN_SYSTEM.md`.
