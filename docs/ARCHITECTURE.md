# Architecture --- Amara Scents

## Stack

React, TypeScript, Vite, Supabase, Supabase Auth, Google OAuth, Vercel,
Vercel Serverless Functions, Resend and GitHub.

## High-level flow

Browser → React application → Supabase for application
data/authentication → server-side order/email flow where privileged
operations are required → Resend.

## Principles

-   Keep secrets server-side.
-   Never put Resend API keys in browser code.
-   Treat Supabase as persistent source of truth.
-   Validate order totals server-side.
-   Separate UI, data access and server-side integration
    responsibilities.
-   Avoid unnecessary architectural complexity.
