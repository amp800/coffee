# ☕ Coffee Orders

A modern coffee ordering app for family gatherings. Guests place orders on their phone, and you see them appear in real-time on the barista dashboard.

## Features

- **Clean Modern Design**: Inspired by BaristaUp - minimal, beautiful, mobile-first
- **Layer-Composition Illustrations**: Flat SVG illustrations showing what's in each drink
- **Live Order Status**: Guests can track their order status after submitting
- **Real-time Updates**: Orders appear instantly on the barista dashboard
- **Simple & Fun**: Easy for anyone to use, no login required

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Cloudflare Workers (Pages Functions)
- **Database**: Cloudflare D1 (SQLite on the edge)
- **Hosting**: Cloudflare Pages

## Cloudflare Setup

### Prerequisites
- Cloudflare account (free tier works)
- Node.js installed
- Wrangler CLI installed

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Create D1 Database

```bash
wrangler d1 create coffee-orders
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "coffee-orders"
database_id = "YOUR_DATABASE_ID_HERE"
```

### Step 4: Initialize Database

```bash
npm run db:init
```

### Step 5: Deploy to Cloudflare Pages

```bash
npm run build
npm run deploy
```

Or connect your GitHub repo to Cloudflare Pages for automatic deployments.

## Usage

### For Guests (Order Page)

1. Open your app URL on your phone
2. Choose your coffee from the illustrated cards
3. Select milk type (if applicable)
4. Choose sugar level
5. Enter your name
6. Add any notes (optional)
7. Tap "Place Order"
8. **Track your order status** on the confirmation screen!

### For the Barista

1. Open `{your-url}/barista` on your device
2. See orders appear in real-time
3. Tap "Start Making" when you begin making a coffee
4. Tap "Done" when it's ready
5. Use "Clear All" to reset after the session

## Coffee Types

| Coffee | Description | Has Milk |
|--------|-------------|----------|
| Cappuccino | Espresso + steamed milk + thick foam | Yes |
| Café Latte | Espresso + lots of steamed milk + thin foam | Yes |
| Espresso | Pure double shot | No |
| Piccolo | Ristretto + steamed milk (small & intense) | Yes |
| Macchiato | Espresso + dash of milk foam | Yes |
| Flat White | Double ristretto + velvety steamed milk | Yes |
| Long Black | Espresso poured over hot water | No |

## Customization

### Adding New Coffee Types

Edit `src/data/coffees.js` to add new coffee types with SVG illustrations.

### Changing Colors

Edit `tailwind.config.js` to customize the color palette.

## License

MIT
