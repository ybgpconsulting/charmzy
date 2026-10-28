# Charmzy storefront

Charmzy is a React, TypeScript, and Vite jewelry storefront deployed as a Cloudflare Worker. It includes product search and filters, a browser-persisted cart and wishlist, stock-aware quantities, automatic offers, and WhatsApp order inquiries.

## Run locally

**Requirements:** Node.js and npm

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:3000`. Run `npm run lint` for the TypeScript check and `npm run build` to create a production bundle.

## Store data and checkout

- The catalog, store contact, and promotion settings are in `src/data/initialData.ts`.
- Cart, wishlist, and catalog configuration are browser-local; they are not shared across devices.
- Checkout creates a WhatsApp order inquiry. Customers send it to the store, and the order is not confirmed until the store replies.
- Shipping charges and final totals are confirmed by the store before an order is accepted.
- The `/admin` panel requires an authenticated session. Admin credentials and sessions use D1; catalog and configuration changes remain browser-local.
- The project does not include payment processing, server-side inventory, or a cross-device order database. Add and verify these services before using the site as a transactional online store.
- Customer routes include `/shop`, `/offers`, `/cart`, `/wishlist`, `/about`, `/contact`, `/shipping`, `/returns`, `/privacy`, `/terms`, and `/faq`. Product details use `/products/<product-slug>`.
- Return and exchange terms need merchant approval before launch.

## Cloudflare Workers deployment

The storefront can be deployed as a Cloudflare Worker with static assets and SPA fallback. `wrangler.jsonc` configures the Worker and its D1/R2 bindings; verify that these resources belong to the intended Cloudflare account before deploying.

### Admin access

The admin API uses D1 tables defined in `migrations/0001_storefront_admin_auth.sql`. To run the Worker locally:

```sh
npm run cf:migrate:local
npm run cf:dev
```

Set the local one-time bootstrap password in the git-ignored `.dev.vars` file. The Worker stores a PBKDF2 password hash and uses an HttpOnly, SameSite session cookie.

Before deploying, confirm the Cloudflare account and production database. Apply the remote migration, configure the one-time `ADMIN_BOOTSTRAP_PASSWORD` secret, deploy, initialize the admin account, and then remove the bootstrap secret.

```sh
npx wrangler login
npm run cf:migrate:remote
npm run cf:dry-run
npm run cf:deploy
npx wrangler secret put ADMIN_BOOTSTRAP_PASSWORD
```

`npm run cf:dev` builds the storefront and runs it through Wrangler locally. Configure the custom domain and DNS route in Cloudflare after deployment.
