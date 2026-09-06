# ☕ Family Coffee & Tea Bar

A tiny, beautiful coffee-and-tea-ordering app for family gatherings. Guests
(or one person walking around the table) place orders from their phone, and
they show up on the right maker's screen in the order they arrive — coffee on
the barista screen, tea on the tea lady's — no apps, no accounts, no sign-ups,
no cost.

Built for the free tier of **Cloudflare Pages + Workers (Pages Functions) +
D1**. There is no server to run, nothing to self-host, and the free limits are
so far above what a few family coffee sessions use that you will never pay.

---

## The four pages

| Page          | URL          | Who uses it                                                        |
| ------------- | ------------ | ------------------------------------------------------------------ |
| **Order page** | `/`          | Guests. Pick a coffee **or a tea** → live confirmation that follows the order. |
| **Waiter mode** | `/waiter`   | You or your daughter walking around taking orders for other people. Name first, rapid entry, auto-resets after each order. |
| **Barista mode** | `/barista` | You at the machine. **Coffee** orders only; tap through pending → making → done. |
| **Tea lady mode** | `/tealady` | The tea maker. **Tea** orders only, same flow — because tea is made in a different part of the kitchen by a different person. |

The barista, tea lady and waiter pages are not linked anywhere on the order
page — they are just URLs you know about (`/barista`, `/tealady`, `/waiter`).
For a family lunch that is all the "security" you need.

---

## What it costs

Nothing. Cloudflare's free tier covers all three pieces:

| Service   | What it does here                    | Free allowance (vs. what you'll use) |
| --------- | ------------------------------------ | ------------------------------------ |
| Pages     | Hosts the static site                | 500 builds/month, 100 GB bandwidth   |
| Workers / Pages Functions | The tiny API (`functions/`) | 100,000 requests/day |
| D1        | The SQLite database                  | 5 GB storage, 5 M reads/day          |

No credit card, no expiry, and **no "paused after inactivity"** behaviour like
some other free databases.

---

## Deploy to Cloudflare — step by step

You need: a Cloudflare account (you have one), Node.js 18+ installed, and
this project folder. There is nothing to install globally if you use the
commands below with `npx`.

### 1. Open a terminal in this folder

```bash
npm install
```

### 2. Log in to Cloudflare

```bash
npx wrangler login
```

A browser window opens — allow access to your Cloudflare account. (Alternative:
create an API token in the Cloudflare dashboard → My Profile → API Tokens and
run `npx wrangler login` with the browser flow instead — the browser flow is
easiest.)

### 3. Create the D1 database

```bash
npx wrangler d1 create coffee-orders
```

It prints something like:

```
📋 Created 'coffee-orders' D1 database
database_id = 0a1b2c3d-0000-1111-2222-333344445555
```

### 4. Paste the database id into `wrangler.toml`

Open `wrangler.toml` and replace the placeholder:

```toml
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

with the real id from step 3 (keep the quotes).

### 5. Create the orders table (run the migration)

```bash
npm run db:migrate:remote
```

This applies every migration in `migrations/` (`0001_init.sql` creates the
orders table, `0002_add_category.sql` adds the coffee/tea routing column) to
your D1 database. You only do this once — the schema stays there forever.

### 6. Build and deploy

```bash
npm run build
npm run deploy
```

Wrangler uploads `dist/` to Cloudflare Pages and creates the project for you.
The output ends with a URL like `https://coffee-orders-abc123.pages.dev` —
that's your live app.

### 7. Visit the pages

Open the URL from step 6. You should see the order page. Then check:

- `https://<your-project>.pages.dev/waiter`
- `https://<your-project>.pages.dev/barista`
- `https://<your-project>.pages.dev/tealady`

Put a test coffee through on `/` (or `/waiter`) and it should appear on
`/barista` within a couple of seconds; order a tea and it appears on
`/tealady` instead. **Clear all** on one page only clears that maker's list,
so the two never wipe each other.

### Redeploying after changes

```bash
npm run build && npm run deploy
```

---

## Pointing `coffee.lan` (and a public domain) at it

Two separate cases:

**A public domain you own** (e.g. `coffee.yourdomain.com.au`) — the easy one.
In the Cloudflare dashboard: your Pages project → **Custom domains** → **Set up
a custom domain** → type it in. Cloudflare wires up DNS automatically.

**`coffee.lan` on your home network** — `.lan` isn't a real DNS zone, so it
can't live in Cloudflare. Keep using your existing **nginx proxy manager**:
create a Proxy Host for `coffee.lan` that forwards to
`https://<your-project>.pages.dev` (SSL on). Anyone on your Wi-Fi who visits
`coffee.lan` gets the app. Cloudflare still handles the traffic — it's just
the entry point that changes.

> Tip: the order page's own address is shown on the barista screen's share
> card, and guests never need to type it twice — see QR codes below.

---

## QR codes — no special coding needed

A QR code is just a picture of a URL. **Nothing in the app needs to change to
make one.**

- The simplest option: open any free QR generator (search "qr code
  generator"), paste in your order-page URL, save the image, and print it.
- Even easier: the **barista page has a built-in QR code** in its "Point
  guests here" card (plus a separate waiter-mode one tucked underneath). Open
  `/barista`, screenshot the card, print it or keep it on a tablet at the
  table.

Print it and put it where guests gather — phones scan straight into the order
page with no app to install.

---

## Using it on the day

1. **Before guests arrive** — open `/barista` on your phone/tablet. If last
   time's orders are still there, tap **Clear all**.
2. Guests either scan the QR code and order their own, or someone takes the
   phone around the table in **waiter mode** (`/waiter`) — name first, tap the
   drink, pick milk/sugars where offered, place. It resets itself in three
   seconds, ready for the next person. Teas sit under their own heading on
   the same page.
3. Coffee orders arrive on `/barista`, tea orders on `/tealady`, both
   oldest-first. **Start making** when you begin a drink, **Mark done** when
   it's on the bench. Done orders stay listed (dimmed) so nobody's drink gets
   forgotten.
4. After lunch, **Clear all** on each page leaves the app fresh for next time.

### Local development

```bash
npm run pages:dev        # serves the built app + API with a local D1 on :8788
# or, for hot-reload editing:
npm run dev              # vite on :5173, proxies /api to :8788
```

The first time you run `pages:dev`, apply the migration locally too:
`npm run db:migrate:local`.

---

## Project layout

```
functions/api/orders/    Pages Functions = the API (list, create, status, clear)
migrations/              D1 schema (0001 orders table, 0002 coffee/tea category)
src/                     React app (order page, waiter, barista, tea lady)
  components/MakerPage.jsx  Shared dashboard behind /barista and /tealady
  data/coffees.js        Drink + milk definitions with their SVG illustrations
public/_redirects        SPA fallback so /waiter, /barista and /tealady deep links work
wrangler.toml            Cloudflare config (D1 binding)
```

### Tweaking it

- **Drinks & milk** — `src/data/coffees.js`. Each drink is a definition plus an
  SVG illustration; add one or remove one there and the whole app follows.
  `hasMilk` shows the milk picker, `milkOptional: true` makes it a choice
  (black tea) instead of a requirement, and `hasSugar: false` hides the sugar
  counter (herbal teas).
- **Sugar limit / reset timing** — `SugarCounter.jsx` (`MAX_SUGARS`) and
  `WaiterPage.jsx` (`RESET_AFTER_MS`).
- **Look & feel** — colours and component styles live in `src/index.css`.

### Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Ordering fails on `pages.dev` | You skipped step 5 — run `npm run db:migrate:remote`. |
| Teas don't route to `/tealady` | The `category` column is missing — re-run `npm run db:migrate:remote` (migration 0002). |
| `/barista` gives a 404 on reload | `public/_redirects` handles this; redeploy after any change to it. |
| Orders appear in the wrong order | The list is oldest-first by design (first ordered = first made). |
| Someone's coffee is wrong | On the barista card, tap the small ↺ button to step it back a status. |
| You changed something and nothing updated | `npm run build && npm run deploy`. |

---

MIT — use it, change it, print it, enjoy it.
