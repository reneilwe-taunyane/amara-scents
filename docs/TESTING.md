# Testing Checklist --- Amara Scents

## Storefront

-   [ ] Homepage loads
-   [ ] All 9 products render
-   [ ] Product images render
-   [ ] Product detail works
-   [ ] Correct descriptions/notes/moods
-   [ ] 50 ml = R250
-   [ ] 100 ml = R500

## Cart

-   [ ] Add to bag
-   [ ] Bag count updates
-   [ ] Increase/decrease quantity
-   [ ] Remove
-   [ ] Selected size persists
-   [ ] Totals correct
-   [ ] Empty cart works

## Authentication

-   [ ] Google sign-in works
-   [ ] OAuth completes
-   [ ] Session persists
-   [ ] Checkout handles authentication

## Checkout

-   [ ] Form validation
-   [ ] Correct order summary
-   [ ] Place order works
-   [ ] Order saved in Supabase
-   [ ] Confirmation screen appears

## Resend

-   [ ] Email triggered after successful order
-   [ ] Email delivered
-   [ ] Useful order information included
-   [ ] Credentials not exposed

## Security

-   [ ] RLS configured
-   [ ] Users cannot access another user's private orders
-   [ ] No secrets committed
-   [ ] Production environment variables configured

## Responsive

-   [ ] 390px
-   [ ] 768px
-   [ ] 1024px
-   [ ] 1440px
-   [ ] No horizontal overflow

## Technical

-   [ ] Lint passes
-   [ ] Type-check passes
-   [ ] Production build passes
-   [ ] No major console errors
-   [ ] Deployment succeeds

## Final journey

Home → Shop → Product → Select size → Add to Bag → Cart → Google Auth →
Checkout → Place Order → Supabase → Confirmation → Resend email.
