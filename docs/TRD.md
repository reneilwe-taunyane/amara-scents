# Technical Requirements --- Amara Scents

## Frontend

React, TypeScript, Vite, responsive CSS, accessible reusable components
and strict typing.

## Integrations

Supabase, Google OAuth via Supabase Auth, Google Cloud Console, Resend,
Vercel.

## Environment

Use local `.env` files and Vercel environment variables in production.
Never commit secrets.

## Required behaviour

Products render, cart works, size changes price, Google authentication
works, checkout persists orders, Resend sends confirmation and
production build succeeds.

## Constraints

Minimal dependencies. No payment gateway unless later required.
