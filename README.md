# Chosen Treasury Demo

Static Vercel-ready admin dashboard for Chosen treasury operations.

## Accounting model in this demo

### USDC activity
USDC is treated as company cash flow and is kept in its own activity log:
- **Crate Purchase** — USDC inflow.
- **Cashback** — USDC outflow for eligible instant-sell/cashback settlement (demo rate: 80%).
- **Shipping** — USDC collected for fulfillment; shown separately because it may be pass-through rather than profit.
- **Marketplace Fee** — only the platform fee is company revenue. The marketplace sale principal is not counted as revenue (demo fee: 1%).

### Credits activity
Credits are an internal platform liability and have a separate activity log.

New Credit emissions are separated by source:
- **Credit Back** — 5 Credits per $100 of crate value (5%), emitted every time a crate is opened whether the crate was paid with USDC or Credits.
- **Lulu Emission** — 100 Credits for one Lulu burn; 333 Credits for each complete group of three.
- **Promotional Run** — targeted promotional Credit grants.

Credit spending and settlements can also appear in the Credits activity log, but are not counted as new issuance.

## Lulu cap
3,333 Lulus produce a theoretical lifetime maximum of **369,963 Credits**:

`floor(3333 / 3) × 333 + (3333 mod 3) × 100`

For any remaining Lulu supply `n`:

`floor(n / 3) × 333 + (n mod 3) × 100`

Example: 5 remaining = 333 + 200 = 533 Credits.

## Real-time integration
The current project uses a lightweight demo event generator every 15 seconds. Replace that generator with your backend event stream (WebSocket/SSE) or API polling. Keep USDC events and Credit events as separate data models so reporting and reconciliation stay clean.

## CSV exports
Each section can export its currently filtered view. In Activity, the export follows the selected USDC or Credits sub-tab, making quarterly archives clean and separate.

## Deploy
This is a static project and can be imported directly into Vercel with no build command.
