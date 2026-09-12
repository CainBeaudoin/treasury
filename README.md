# Chosen Treasury Demo

A dependency-free static admin dashboard for Chosen's treasury.

## Accounting model used in the demo

USDC and Credits are deliberately separated in **Activity**.

### USDC activity
- **Crate Purchase** — USDC inflow.
- **Cashback** — USDC outflow when a USDC-funded crate is cashed out. Demo rate: 80%.
- **Shipping** — USDC collected for fulfillment; tracked separately from operating revenue.
- **Marketplace Fee** — only Chosen's fee is recorded as revenue. Demo rate: 1%.

### Credits activity
- **Credit Spend** — Credits used to buy a crate.
- **Credit Back** — Credits returned when a Credits-funded crate is cashed out. Demo rate: 80%. This is tracked separately from new emissions.
- **Crate Bonus** — new Credits emitted at 5% of crate value on every crate, whether the crate was paid with USDC or Credits. Examples: $250 → 12.5 Credits; $1,000 → 50 Credits.
- **Lulu Emission** — Credits created by Lulu burns.
- **Promotional Run** — Credits granted through campaigns.

This means **Cashback**, **Credit Back**, and **Crate Bonus** are three distinct treasury metrics.

## Lulu
- 1 Lulu = 100 Credits
- 3 Lulus = 333 Credits
- Supply cap = 3,333
- Maximum lifetime emission = 369,963 Credits
- Remaining maximum = `floor(n / 3) * 333 + (n % 3) * 100`

## Demo behavior
- CSV export per section.
- Filters for the activity and audit tables.
- Simulated live activity every 15 seconds.
- Compact Rules cards to avoid unnecessary vertical whitespace.

## Real-time integration
Replace the in-memory demo arrays in `app.js` with API responses and WebSocket/SSE events from the Chosen backend. Preserve separate event categories for `cashback`, `credit_back`, and `crate_bonus` so they cannot be combined in reporting.

## Deploy
This repo is static and can be imported directly into Vercel with no build command.
