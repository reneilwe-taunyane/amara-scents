# Implementation Plan --- Amara Scents

## Phase 0 --- Foundation

React + TypeScript + Vite, lint/type-check, structure, `.gitignore`,
`.env.example`, build validation.

## Phase 1 --- Storefront

Brand identity, navigation, homepage, shop, product cards, product
detail, real product images and responsive UI.

## Phase 2 --- Cart

Add to bag, selected size, quantity changes, removal, totals and empty
state.

## Phase 3 --- Supabase

Create project, schema, product data, connection, RLS and persistence
tests.

## Phase 4 --- Google Authentication

Google Cloud OAuth configuration, Supabase Google provider, login and
session handling.

## Phase 5 --- Checkout

Customer/delivery form, order summary, trusted validation and order
persistence.

## Phase 6 --- Resend

Resend configuration, server-side email integration and confirmation
email.

## Phase 7 --- Optional polish

Welcome discount popup, improved filtering and additional visual polish
only if time permits.

## Phase 8 --- Deployment and validation

Production build, responsive tests, auth, cart, checkout, Supabase,
Resend, Vercel deployment and live end-to-end test.

## Deadline rule

Required functionality always takes priority over secondary design
features.
