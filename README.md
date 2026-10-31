# CARESA — Jewellery E-commerce (Frontend)

React 18 + Vite + React Router. Frontend only — all data is demo data stored in the browser (localStorage), ready for the backend team to replace with APIs.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## What's included

**Store (user side)**
- First-visit opening animation (logo draws in, curtain reveal; once per session, skippable)
- Home: hero slider with Ken Burns zoom, trust strip, categories, bestsellers, bridal editorial, new arrivals, gifting banner, craft story, testimonials, Instagram grid
- Scroll-reveal animations site-wide, hover image-swap on product cards
- Shop: category pills, metal / price / collection filters, sort, search (`/shop?q=`)
- Product page: gallery with hover zoom, metal swatches, ring/bangle sizes, free engraving, pincode delivery check, accordions, reviews, related products, mobile sticky add-to-bag
- Cart drawer + cart page, free-shipping meter, coupons (`CARESA10`, `FIRSTLOVE`)
- 3-step checkout (address with validation → delivery & gift wrap → payment), order success
- Order tracking (`/track`, demo IDs `CRS10248`, `CRS10247`) with live timeline, courier + AWB
- Login / signup / mobile OTP, My Account (overview, orders + order detail tracking, wishlist, addresses, profile)
- Wishlist, About, Gifting, Contact, Policies, 404

**Admin panel** (`/admin`) — sign in with any email starting with `admin` (e.g. `admin@caresa.in`), or open `/admin` directly in the demo
- Dashboard: KPIs, 12-month sales chart, top categories, recent orders
- Orders: tabs (new / in transit / delivered), order detail with status update (reflects instantly on customer tracking), AWB entry
- Products: search, filter, add / edit modal, visibility toggle, delete confirmation
- Inventory with low-stock flags, Customers, Coupons (create), Store settings

## Folder structure

```
src/
  context/StoreContext.jsx   ← cart, wishlist, auth, orders (swap these functions for API calls)
  data/products.js           ← catalogue, categories, coupons, image helper
  data/demo.js               ← demo orders, customers, sales, coupons for admin
  components/                ← Logo/Icons/Reveal (Common), Header/Footer/CartDrawer (Layout), Intro, ProductCard
  pages/                     ← store pages
  admin/AdminApp.jsx         ← full admin panel
  index.css                  ← design system (colours, type, all styles)
```

## Suggested API contract for the backend team

| Frontend function / screen | Endpoint |
|---|---|
| Shop, Product | `GET /api/products?category=&metal=&min=&max=&sort=&q=` · `GET /api/products/:id` |
| `addToCart / updateQty / removeFromCart` | `GET/POST/PATCH/DELETE /api/cart` |
| `toggleWish` | `POST/DELETE /api/wishlist/:productId` |
| `applyCoupon` | `POST /api/coupons/validate` |
| `login` (email / OTP) | `POST /api/auth/login` · `POST /api/auth/otp/send` · `POST /api/auth/otp/verify` · `POST /api/auth/register` |
| `placeOrder` | `POST /api/orders` → then payment gateway (Razorpay / Cashfree) |
| Track page | `GET /api/orders/:id/track` |
| Account | `GET /api/me`, `GET /api/me/orders`, `GET/POST/DELETE /api/me/addresses` |
| Pincode check | `GET /api/delivery/pincode/:pin` |
| Admin | `/api/admin/orders`, `PATCH /api/admin/orders/:id/status`, `/api/admin/products` (CRUD + image upload), `/api/admin/inventory`, `/api/admin/customers`, `/api/admin/coupons`, `/api/admin/stats` |

## Images

Product and lifestyle photos load from the Unsplash CDN as placeholders (`img()` helper in `data/products.js`). Replace the photo IDs with your own product shoot URLs. If any photo fails to load, a branded beige fallback is shown.

## Brand

- Colours: white, ivory `#faf7f2`, beige `#f1e9dd`, black `#12100e`, charcoal `#2a2724`, brown `#6b4a32`, muted gold `#a9834f`
- Fonts: Fraunces (headings / logo), Jost (body), Pinyon Script (small accents)
- Logo: bow mark + lowercase "caresa" wordmark (`<Logo />` in `components/Common.jsx`)
