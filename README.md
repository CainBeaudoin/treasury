# Chosen Treasury Demo

Static treasury/admin demo for Chosen. The dashboard separates real USDC cash movement from the Credits economy, tracks when theoretical prize value becomes a real cash cost, and now includes dedicated views for Pool Revenue and Supplier Payouts.

## Core accounting model

- Credits are platform units and are not assigned a direct USD cash value in treasury reporting.
- Every crate emits a **Crate Bonus** equal to 5% of the crate entry value, whether the crate was purchased with USDC or Credits.
- A Credits-funded crate immediately removes the entry Credits from the user balance.
- **Credit Back** is a separate settlement category: 80% of the prize's FMV returned in Credits. It is based on the outcome value, not the crate entry price.
  - Spend 100 Credits, hit an $80 prize → 64 Credit Back + 5 Crate Bonus → net -31 Credits.
  - Spend 100 Credits, hit a $1,000 prize → 800 Credit Back + 5 Crate Bonus → net +705 Credits.
- USDC-funded prize cashouts settle as **USDC Cashback** at 80% of prize FMV.
- If a user keeps a prize in the vault, no immediate settlement is issued and no USDC leaves the treasury yet. The item becomes a pending exposure with:
  - initial prize FMV
  - current live FMV
  - a 365-day liquidation option at `70% × min(initial prize FMV, current live FMV)`
  - expected physical fulfillment cost basis
  - days remaining in the 365-day claim window
- The liquidation formula is market-protected: if the market rises above the original reveal value, the original FMV remains the ceiling; if the market falls, the lower live FMV is used.
- During the 365-day window, the user can list the item, physically redeem it, or use the liquidation option.
- If the user physically redeems the item, Chosen records the **actual item cost basis** as USDC outflow. This is the point where theoretical value becomes a real cash expense.
- If the item is still unresolved when the 365-day window ends, the user no longer has a choice. The item is removed from the vault and Chosen executes an **Auto Credit Back** in Credits.
- **Auto Credit Back** is always paid in Credits, even if the original crate was purchased with USDC. The amount is `70% × min(initial prize FMV, live FMV at expiry)`. The settlement is written into Credits Activity so an inactive user can return later and find the Credits in their account.
- Auto Credit Back is a settlement event, not a USDC payout. This avoids creating a forced liquidity drain after the user had a full year to list, redeem, or liquidate the item.
- Shipping is split into shipping collected (inflow) and carrier/handling cost (outflow).
- Marketplace sales do not count as company revenue; only Chosen's fee is recorded as revenue.

## Treasury tabs

- **Overview** — USDC position, obligations, Credits, pending prize exposure, and recent activity.
- **Activity** — separate USDC and Credits logs.
- **Reconciliation** — internal records versus wallets and other sources of truth.
- **Credits** — Credit Spend, Credit Back, Crate Bonus, promotions, Lulu emissions, Auto Credit Back, and pending item exposure.
- **Lulu** — burn supply and maximum Credit emissions.
- **Pool Revenue** — gross source volume versus actual revenue allocated to the company pool, with source filters and CSV export.
- **Supplier Payouts** — supplier-level cost basis, paid/pending/awaiting-invoice amounts, due dates, claim references, and CSV export.
- **Rules** — compact operating rules and rule-change history.

## Supplier accounting

When a physical prize is redeemed, the prize's actual acquisition cost can be tied to a supplier payout. Supplier Payouts are real USDC costs and should reconcile to fulfillment-related USDC outflows rather than the prize's displayed FMV.

## Pool Revenue accounting

Pool Revenue should represent Chosen's actual allocated revenue, not the gross transaction value that generated it. For example, on a marketplace sale, the sale value is shown as source volume while only Chosen's fee share is counted as Pool Revenue.

## Lulu program

- Supply: 3,333 Lulus
- 1 Lulu = 100 Credits
- Every 3 Lulus = 333 Credits
- Lifetime maximum emission: 369,963 Credits
- Remaining maximum: `floor(n / 3) * 333 + (n % 3) * 100`

## Demo behavior

The page uses in-memory demo data and simulates new activity every 15 seconds. `policy-overrides.js` applies the current pending-item, Auto Credit Back, Pool Revenue, and Supplier Payout policies on top of the demo state. Replace the in-memory arrays with production API responses and use WebSocket/SSE events for live updates.

## Deploy

The project is Vercel-ready. The root route injects the current treasury policy override into the static dashboard so the latest rules, tabs, and calculations are reflected without mixing USDC and Credits.
