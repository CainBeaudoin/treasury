/* Authoritative finance + treasury rule baseline. Loaded last. */
(function () {
  const VERSION = 'rules-baseline-v1';

  const groups = [
    {
      name: 'Payment rails & ledger boundary',
      rules: [
        ['USDC and Credits are separate economies', 'Cash movement and Credit movement must stay in separate ledgers. A Credit event cannot be treated as a USDC event, and a USDC event cannot silently alter Credit supply.'],
        ['Credits are non-cash units', 'Credits have no guaranteed USD value in finance reporting. Track them in units only. A later redemption or settlement can create a real company cash obligation, but the Credits themselves are not cash.'],
        ['Credits open collectible crates only', 'Credits may be used for sneaker / collectible crates. Credits may never be used to open stock packs.'],
        ['Stock packs are cash / USDC only', 'Stock packs are funded only with cash / USDC. They do not accept Credits, do not generate the collectible Crate Bonus, and do not create a cashback entitlement.']
      ]
    },
    {
      name: 'Credits & collectible crates',
      rules: [
        ['Credit Spend happens immediately', 'When a Credits-funded crate is opened, the crate entry is removed from the user balance immediately.'],
        ['Crate Bonus is 5% of collectible crate entry', 'Every collectible crate creates a separate Crate Bonus equal to 5 Credits per $100 of crate entry, whether the crate was funded with USDC or Credits. This rule does not apply to stock packs.'],
        ['Immediate Credit Back is based on prize FMV', 'For a Credits-funded prize settled immediately, Credit Back = 80% × prize FMV. It is based on the outcome value, not the crate entry.'],
        ['Immediate USDC cashback stays in USDC', 'For a USDC-funded collectible prize settled immediately, cashback = 80% × prize FMV and is paid in USDC. Immediate USDC cashback is never converted into Credits.'],
        ['Credit Back and Crate Bonus are separate', 'A user can receive Credit Back from the prize outcome and the Crate Bonus from opening the collectible crate. Do not combine the two into one accounting category.'],
        ['Net Credit Change is all Credit inflows minus Credit Spend', 'Net Credit Change = Credit Back + Auto Credit Back + Crate Bonus + Lulu emissions + promotional emissions + any other valid Credit inflow − Credit Spend.'],
        ['New emissions are tracked separately from settlement', 'Crate Bonus, Lulu emissions and promotional runs are deliberate new Credit emissions. Credit Back and Auto Credit Back are settlement events and should not be classified as deliberate new emissions.']
      ]
    },
    {
      name: 'Vault lifecycle & settlement',
      rules: [
        ['Vaulting defers settlement', 'If a user keeps a collectible prize in their vault, there is no immediate Credit Back and no immediate USDC cashback. The item becomes pending exposure instead.'],
        ['Every vaulted prize keeps its original accounting facts', 'Track initial prize FMV, current / live FMV, original funding asset, expected Chosen acquisition / fulfillment cost basis, status and remaining days in the 365-day window.'],
        ['During the 365-day window the user still has choices', 'A vaulted item can be listed, physically redeemed / shipped, or liquidated during the active 365-day window.'],
        ['Within-window liquidation uses the protected 70% formula', 'Pending liquidation amount = 70% × min(initial prize FMV, current live FMV). If the market rises, settlement is capped at reveal / initial FMV. If the market falls, settlement follows the market down.'],
        ['Within-window liquidation preserves the original funding asset', 'A Credits-funded prize liquidated within the 365-day window settles in Credits. A USDC-funded prize liquidated within the window settles in USDC.'],
        ['Day 365 forces Auto Credit Back', 'If the item is still unresolved at day 365, it is removed from the vault, the physical claim closes, and it automatically settles in Credits at 70% × min(initial FMV, live FMV at expiry).'],
        ['Day-365 settlement is always Credits', 'Auto Credit Back at expiry is always paid in Credits regardless of whether the original crate was funded with Credits or USDC.'],
        ['Auto Credit Back remains available until used', 'If the user is inactive after expiry, the Auto Credit Back remains in their Credit balance and can be used later.'],
        ['Physical redemption uses actual acquisition cost', 'When an item is physically redeemed, remove its pending exposure and record Chosen’s actual acquisition / supplier cost as the real USDC outflow. Do not expense retail FMV.']
      ]
    },
    {
      name: 'ODTO inventory & supplier accounting',
      rules: [
        ['Buying from ODTO creates inventory first', 'A payment to ODTO purchases physical inventory. It does not automatically mean the full payment becomes current-period expense.'],
        ['Inventory is valued at acquisition cost', 'Physical sneaker inventory is carried at Chosen’s acquisition cost, not retail FMV, resale FMV or crate outcome value.'],
        ['Reusable inventory can recycle through crates', 'An item can continue to sit in the reusable crate pool until a user keeps it in a personal vault or physically redeems it. Merely appearing as a possible crate outcome does not consume the item.'],
        ['User-vault allocation removes stock from the reusable pool', 'Once an item is assigned to a user’s personal vault, it is no longer reusable crate inventory. In the current finance model, user-vault allocation and physical redemption both move acquisition cost into allocated inventory cost.'],
        ['Replenishment follows allocation / redemption', 'When reusable inventory is consumed by user allocation or redemption, new stock can be ordered from ODTO or another supplier to refill the crate inventory pool.'],
        ['Current ODTO cost basis is modeled at 70% of listed CAD', 'For the current demo / operating model, supplier cost = 70% × ODTO listed CAD price. This is a configurable commercial assumption, not a permanent market law.'],
        ['FX belongs at settlement', 'Convert CAD supplier cost into USDC / USD using the applicable settlement FX. The dashboard’s 1 CAD = 0.72 USD rate is a demo snapshot, not a permanent treasury rule.'],
        ['Paid supplier rows are realized cash outflow', 'ODTO rows marked Paid represent actual USDC cash outflow. Pending or Awaiting Invoice rows are open accounts payable / reserve exposure and must not be treated as already-paid cash.'],
        ['Pending fulfillment reserve is a planning reserve', 'Expected fulfillment cost for unresolved vaulted items is reserved for liquidity planning, but it is not a realized USDC outflow until the company actually acquires / fulfills the item.']
      ]
    },
    {
      name: 'Stock packs',
      rules: [
        ['Current stock-pack entry is $50 cash / USDC', 'A $50 stock pack creates a $50 cash / USDC inflow when opened. The pack price is a configurable product parameter.'],
        ['Stock outcomes are weighted toward the lower end', 'The outcome distribution is random / weighted, with most wins concentrated toward lower-value positions and rare outcomes reaching the high end. Treasury uses the realized outcome, not an assumed average, for each execution.'],
        ['The winning stock position is bought immediately', 'When the stock outcome is revealed, Chosen immediately acquires the corresponding position at the actual real-time execution value from the supported trading venue / DEX.'],
        ['Stock acquisition value is the payout cost', 'The actual stock position purchased is a real USDC outflow and belongs in Payouts → Robinhood Stocks.'],
        ['There is no stock-pack cashback', 'The user already receives a liquid stock position, so the stock-pack model does not add a separate cashback payment.'],
        ['Per-pack P&L is entry minus acquisition cost', 'Pack P&L = stock-pack cash inflow − real-time stock acquisition outflow. A $50 pack with a $28 position earns $22; a $50 pack with a $1,000 position loses $950 on that individual pack.'],
        ['Aggregate stock margin is measured across the pool', 'Stock-pack margin = total stock-pack inflows − total stock acquisition outflows. Individual packs may be negative while the broader pool remains profitable.'],
        ['A stock liquidity reserve must cover tail outcomes', 'Maintain dedicated liquidity for rare high-value wins. The current demo reserve is $10,000, equivalent to ten simultaneous $1,000 top-tier outcomes. The reserve is liquidity protection, not revenue or expense.']
      ]
    },
    {
      name: 'Revenue, profit & treasury',
      rules: [
        ['Revenue Pool contains company earnings, not pass-through principal', 'Only amounts economically earned by Chosen belong in earned revenue. User principal or asset value that merely passes through the platform is not company revenue.'],
        ['Stock packs contribute net margin, not gross pack sales', 'The Revenue Pool should include stock-pack net margin after stock acquisition cost. Do not add gross stock-pack inflow and then subtract the same stock acquisition cost again elsewhere.'],
        ['ODTO inventory purchases are not expensed immediately', 'Cash paid to ODTO becomes inventory. Operating earnings are reduced when acquisition cost becomes allocated to a user vault or redeemed item under the current inventory model.'],
        ['Operating profit uses allocated inventory cost', 'Operating Profit = earned revenue − allocated inventory cost. Stock acquisition cost is already embedded in stock-pack net margin and must not be double-counted.'],
        ['Required reserve is the sum of protected liquidity buckets', 'Required Reserve = cashback liquidity reserve + open ODTO AP + pending fulfillment reserve + stock liquidity reserve + operating buffer.'],
        ['Current fixed reserve parameters are explicit', 'Current demo parameters are $8,000 cashback liquidity reserve, $10,000 stock liquidity reserve and $2,500 operating buffer, plus live open ODTO AP and pending fulfillment reserve.'],
        ['Hard obligations and reserves are different', 'Hard USDC obligations are already-realized company liabilities. Reserves are protected liquidity for expected or tail-risk obligations. Keep them separate so cash is not double-counted.'],
        ['Liquidity surplus measures cash available above protections', 'Liquidity Surplus = Treasury USDC − Hard USDC Obligations − Required Reserve.'],
        ['Safe withdrawal is capped by both profit and liquidity', 'Safe Withdrawal = max(0, min(Operating Profit, Liquidity Surplus)). Profit cannot be distributed if treasury liquidity is not available, and excess liquidity is not automatically profit.'],
        ['Do not duplicate identical profit metrics', 'If Operating Profit and Safe Withdrawal are equal because liquidity is sufficient, show one primary withdrawable-profit number and use the supporting space for liquidity cushion or another distinct metric.']
      ]
    },
    {
      name: 'Marketplace & shipping',
      rules: [
        ['Marketplace sale principal is not Chosen revenue', 'The seller’s sale principal is pass-through value. Only Chosen’s marketplace fee is company revenue. The current demo marketplace fee is 1%.'],
        ['Shipping inflow and shipping cost stay separate', 'User shipping payment is USDC inflow. Carrier, handling and fulfillment charges are USDC outflow. Track both so the shipping margin is visible.'],
        ['Only shipping net contributes to earnings', 'Shipping contribution = shipping collected − carrier / handling / fulfillment cost. Gross shipping collected is not profit.']
      ]
    },
    {
      name: 'Lulu',
      rules: [
        ['Lulu maximum supply is 3,333', 'The burn program begins from a capped 3,333 Lulu supply.'],
        ['Lulu burn formula is transaction-aware', 'For a burn transaction of n Lulus: Credits = floor(n ÷ 3) × 333 + (n mod 3) × 100. This allows singles, pairs, triples and larger mixed holdings without pretending every holder owns exactly three.'],
        ['Lulu burn eligibility does not expire', 'Unburned Lulus remain eligible to burn later. There is no forced burn deadline in the treasury model.'],
        ['Only actual Lulu burns create Credit emissions', 'Do not put burn forecasts into circulating Credit supply. Lulu emissions enter the Credit ledger only when the corresponding burn has actually occurred.'],
        ['Current demo baseline starts at 1,300 burned', 'The current treasury snapshot begins with roughly 1,300 Lulus burned. Emissions are generated from a mixed burn-size history rather than assuming all 1,300 were burned in perfect groups of three.'],
        ['Lifetime maximum Lulu emission is 369,963 Credits', 'If the full 3,333 supply is burned in the most Credit-efficient grouping, the lifetime maximum is 369,963 Credits. Lulu emissions are non-cash new Credit supply.']
      ]
    }
  ];

  const h = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function styles() {
    document.getElementById('rulesBaselineStyles')?.remove();
    const style = document.createElement('style');
    style.id = 'rulesBaselineStyles';
    style.textContent = `
      #rules .rules-grid,#rules .rule-note{display:none!important}
      .rules-baseline{margin-top:4px;border-top:1px solid var(--border)}
      .rules-group{margin:0;padding:0}
      .rules-group-title{margin:0;padding:24px 0 9px;font-size:11px;line-height:1.2;text-transform:uppercase;letter-spacing:.09em;color:var(--info);font-weight:800;border-bottom:1px solid var(--border)}
      .rules-list{list-style:none;margin:0;padding:0}
      .baseline-rule{display:grid;grid-template-columns:44px minmax(190px,.72fr) minmax(0,1.45fr);gap:16px;align-items:start;padding:15px 0;border-bottom:1px solid var(--border);background:transparent!important;border-radius:0!important;min-height:0!important}
      .baseline-rule-number{font-size:11px;color:#647180;font-variant-numeric:tabular-nums;padding-top:2px}
      .baseline-rule-title{font-size:13px;line-height:1.35;color:var(--text);font-weight:760}
      .baseline-rule-body{font-size:11.5px;line-height:1.55;color:var(--muted);max-width:900px}
      .rules-baseline-meta{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:10px 0 2px;color:var(--muted);font-size:10px}
      .rules-audit-panel{margin-top:28px}
      @media(max-width:800px){.baseline-rule{grid-template-columns:32px 1fr;gap:7px 11px}.baseline-rule-body{grid-column:2}.rules-baseline-meta{align-items:flex-start;flex-direction:column}}
      @media(max-width:520px){.baseline-rule{grid-template-columns:26px 1fr;padding:13px 0}.baseline-rule-title{font-size:12px}.baseline-rule-body{font-size:11px}.rules-group-title{padding-top:20px}}
    `;
    document.head.appendChild(style);
  }

  function render() {
    const root = document.getElementById('rules');
    if (!root) return;
    styles();

    let index = 0;
    const listHtml = groups.map(group => {
      const rows = group.rules.map(([title, body]) => {
        index += 1;
        return `<li class="baseline-rule"><div class="baseline-rule-number">${String(index).padStart(2,'0')}</div><div class="baseline-rule-title">${h(title)}</div><div class="baseline-rule-body">${h(body)}</div></li>`;
      }).join('');
      return `<section class="rules-group"><h3 class="rules-group-title">${h(group.name)}</h3><ol class="rules-list">${rows}</ol></section>`;
    }).join('');

    root.innerHTML = `
      <div class="section-intro">
        <div><h2>Rules</h2><p>Authoritative operating baseline for the math, reserves, payouts, inventory and Credit supply.</p></div>
        <button class="export-btn" data-export="rules">Export CSV</button>
      </div>
      <div class="rules-baseline" id="rulesBaseline">${listHtml}</div>
      <div class="rules-baseline-meta"><span>${index} baseline rules</span><span>Policy rules and current model parameters are labeled directly in the rule text.</span></div>
      <article class="panel table-panel rules-audit-panel">
        <div class="panel-head"><div><h3>Policy Audit Log</h3><p>Material rule changes only.</p></div></div>
        <div class="table-wrap"><table><thead><tr><th>Time</th><th>Rule</th><th>Old</th><th>New</th><th>Changed by</th><th>Reason</th></tr></thead><tbody id="rulesTable"></tbody></table></div>
      </article>`;

    if (typeof renderRules === 'function') renderRules();
    document.body.dataset.rulesBaseline = VERSION;
  }

  const previousRenderAll = window.renderAll;
  if (typeof previousRenderAll === 'function') {
    window.renderAll = function () {
      previousRenderAll();
      setTimeout(render, 0);
    };
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.tab,#refreshBtn')) {
      setTimeout(render, 30);
      setTimeout(render, 150);
    }
  });

  render();
  setTimeout(render, 180);
})();
