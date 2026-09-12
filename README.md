# Chosen Treasury Demo

A dependency-free static admin dashboard for Chosen's treasury. It is designed to make USDC, Credits, Lulu emissions, reconciliation and rule changes easy to understand at a glance.

## Included

- Overview with USDC assets, liabilities, Credits outstanding, health checks and recent movements.
- Universal Treasury Ledger with asset/type/status/search filters.
- Hard visual distinction between USDC and Credits.
- Reconciliation view for internal-vs-observed mismatches.
- Credits issuance/spend ledger with source tracking.
- Lulu emission dashboard using:
  - 1 Lulu = 100 Credits
  - 3 Lulus = 333 Credits
  - supply cap = 3,333
  - lifetime max = 369,963 Credits
  - remaining max = `floor(n / 3) * 333 + (n % 3) * 100`
- Treasury Rules with human-readable percentages and audit history.
- CSV exports for each section.
- Simulated live event feed every 15 seconds for demo purposes.
- Responsive layout with no external dependencies.

## Real-time integration

The demo state lives in `app.js`. Replace the in-memory arrays with API responses and a WebSocket/SSE feed from the Chosen backend.

Backend invariant to enforce (not just UI validation):

- `paid_asset = USDC` => `cashback_asset = USDC`
- `paid_asset = Credits` => `cashback_asset = Credits`

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This repo is static and can be imported directly into Vercel with no build command.
