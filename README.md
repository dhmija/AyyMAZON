# AyyMAZON

I built a full-stack, responsive Amazon-like e-commerce application using **Next.js 14, TypeScript, Tailwind CSS**, and a **Node.js/Express** backend powered by **Prisma** and **SQLite**; shortlisted among the top submissions out of 100+ candidates in a competitive SDE internship evaluation.

The project aims to replicate the core Amazon shopping experience, from browsing rich product catalogs to a complete checkout flow and mock order confirmation emails.

**NOTE: All requested bonus point assignment tasks are also completed:**
- Order confirmation mail (via Nodemailer and Ethereal)
- Wishlist functionality (add/remove/move to cart)
- Responsive design (mobile, tablet, desktop)
- Email notification on order placement
- Order history routing and tracking

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A basic understanding of starting two separate local servers (Frontend and Backend)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd amazon-clone
```

### 2. Backend Setup

The backend is an independent Express.js API server that manages products, orders, cart items, wishlists, and mock emails.

```bash
cd backend
npm install
```

Configure backend environment variables by creating a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
FRONTEND_URL="http://localhost:3000"
```

Seed the database and start the server. This fetches around 194 real products from DummyJSON/FakeStoreAPI and populates your local SQLite database.

```bash
npm run db:push
npm run seed
npm run dev
```

The backend API should now be running on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal window to start the Next.js frontend.

```bash
cd frontend
npm install
```

Configure frontend environment variables by creating a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Backend API | Node.js, Express.js |
| Database ORM | Prisma ORM |
| Database | SQLite (local `dev.db`) |
| Email Service | Nodemailer (mocked via Ethereal Mail) |
| Validation | Zod |

## Optimizations and Design Implementations

### Search Debouncing and Live Suggestions

I wrote a custom `useDebounce` hook with a 300 ms delay and applied it to the search input. This prevents an API request from firing on every keystroke. It only triggers a fetch once the user pauses typing, and then populates live Amazon-style suggestions via backend search querying.

### Server vs Client Component Split

I kept data-fetching pages (`/`, `/products`, `/products/[id]`) as React Server Components. They fetch data at render time on the server with zero client-side JS overhead. I only added `"use client"` where interactivity was actually needed (`AddToCartButton`, `SearchBar`, `Sidebar`).

This eliminates client-side data-loading waterfalls and reduces the JavaScript bundle sent to the browser.

### Parallel Data Fetching with Promise.all

Wherever I needed multiple independent API calls, I ran them concurrently with `Promise.all()` instead of sequentially. This cuts total wait time down to the slowest single request:

```tsx
const [electronics, laptops, fashion] = await Promise.all([
	fetchProducts({ category: "smartphones" }),
	fetchProducts({ category: "laptops" }),
	fetchProducts({ category: "mens-shirts" }),
]);
```

### Next.js Image Optimization

I used the `next/image` component configured with whitelisted remote domains in `next.config.js` (`m.media-amazon.com`, `dummyjson.com`). This enables automatic WebP/AVIF sizing optimization and helps prevent LCP delays on hero images and grid product cards.

### Error Boundaries and Loading Skeletons

I added co-located `loading.tsx` skeletons and an `error.tsx` boundary fallback for route segments. Users always see meaningful UI while data loads or if a request fails, rather than a blank or broken screen.

### Component-Based Architecture

I decomposed the UI into small, single-responsibility components (`GridCard`, `HeroCarousel`, `SearchBar`). Each component owns its own functional state where applicable to prevent heavy cascading re-renders across the larger e-commerce layout.

### Complete Order Placement and Webhook Emulation

Instead of dummy checkouts, placing an order physically:

- Validates quantities mathematically in the backend
- Removes purchased items from the active cart via a Prisma database transaction
- Spawns an automated Nodemailer request sending a mock order confirmation email with itemized receipt details accessible through an Ethereal terminal link
