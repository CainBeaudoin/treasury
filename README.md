# Chosen Treasury Demo

A dependency-free treasury/admin dashboard for Chosen. It deliberately separates real USDC cash movement from the Credits economy and tracks the exact point where a theoretical prize can become a real company cash cost.

## Core model

- Credits are platform units and are not assigned a direct USD cash value in treasury reporting.
- Every crate emits a **Crate Bonus** equal to 5% of the crate entry, whether paid with USDC or Credits.
- A Credits-funded crate removes its entry Credits immediately.
- **Credit Back** is separate from Crate Bonus and is calculated from the prize outcome: `80% × prize FMV`.
  - Spend 100 Credits, hit an $80 prize → 64 Credit Back + 5 Crate Bonus → net `-31 Credits`.
  - Spend 100 Credits, hit a $1,000 prize → 800 Credit Back + 5 Crate Bonus → net `+705 Credits`.
- A USDC-funded prize cashout returns **USDC Cashback** at `80% × prize FMV`.
- If a user keeps an item in the vault, no fallback is issued and no USDC leaves treasury yet. The item is tracked as pending exposure with FMV, potential fallback, expected cost basis and days remaining.
- If the user physically redeems the item, the theoretical prize becomes a real cash event: Chosen records the **actual acquisition cost basis** as USDC outflow.
- Shipping is split into user shipping payment (inflow) and carrier/handling expense (outflow).
- At 365 days, an unredeemed item is modeled as auto-settling at 80% of live FMV in its original funding asset.
- Marketplace transaction value is not company revenue; only Chosen's fee is recorded as revenue.

## Lulu

- Supply: 3,333 Lulus
- 1 Lulu = 100 Credits
- 3 Lulus = 333 Credits
- Lifetime maximum emission: 369,963 Credits
- Remaining maximum: `floor(n / 3) * 333 + (n % 3) * 100`

## Demo behavior

The dashboard uses in-memory demo data and simulates activity every 15 seconds. Replace the arrays in `app.js` with production API responses and use WebSocket/SSE events for real-time updates.

## Deploy

The project is static and can be imported directly into Vercel with no build command.
