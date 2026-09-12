/* Chosen treasury policy overrides + finance tabs. */
(function () {
  const baseSyncPolicyCopy = syncPolicyCopy;
  const baseRenderCredits = renderCredits;
  const baseRenderAll = renderAll;
  const oldExportSection = exportSection;

  state.poolRevenue = state.poolRevenue || [
    ['2026-09-12 13:06:07','Marketplace Fee Share',1250,0.01,12.50,'USDC','mkt_81a2','Confirmed'],
    ['2026-09-12 12:42:31','Crate Margin Allocation',500,0.06,30.00,'USDC','pool_crate_71','Confirmed'],
    ['2026-09-12 12:18:45','Partner Revenue Share',820,0.025,20.50,'USDC','pool_partner_22','Confirmed'],
    ['2026-09-11 22:10:14','Marketplace Fee Share',655,0.01,6.55,'USDC','mkt_a817','Confirmed'],
    ['2026-09-11 18:04:52','Crate Margin Allocation',1000,0.06,60.00,'USDC','pool_crate_68','Confirmed'],
    ['2026-09-10 15:33:09','Partner Revenue Share',1440,0.025,36.00,'USDC','pool_partner_19','Confirmed']
  ];

  state.supplierPayouts = state.supplierPayouts || [
    ['2026-09-12 13:11:52','ODTO Supply','Jordan 1 Low','claim_8e13',280,'USDC','Paid','2026-09-12','pay_sup_101'],
    ['2026-09-12 12:52:17','Northline Supply','Jordan 4','claim_nl_41',390,'USDC','Pending','2026-09-15','pay_sup_102'],
    ['2026-09-11 20:14:09','ODTO Supply','New Balance 9060','claim_od_92',68,'USDC','Paid','2026-09-11','pay_sup_099'],
    ['2026-09-11 14:33:20','Vault Partner A','Rare sneaker grail','claim_vp_28',875,'USDC','Awaiting Invoice','2026-09-18','pay_sup_103'],
    ['2026-09-10 17:05:48','Northline Supply','Dunk Low','claim_nl_39',142,'USDC','Paid','2026-09-10','pay_sup_095']
  ];

  function autoFallbackAmount(item) {
    return pendingLiquidationAmount(item);
  }

  function projectedAutoCreditBack() {
    return state.pendingItems
      .filter(x => x.status === 'Vaulted')
      .reduce((sum, x) => sum + autoFallbackAmount(x), 0);
  }

  function addRuleHistoryOnce() {
    if (!state.rules.some(r => r[1] === '365-day Auto Credit Back')) {
      state.rules.unshift([
        '2026-09-12 13:38:00',
        '365-day Auto Credit Back',
        'Funding-asset dependent / optional fallback',
        'Credits only · automatic at expiry · 70% × min(initial FMV, live FMV)',
        'admin',
        'Close the item claim after one year without forcing a USDC liquidity event'
      ]);
    }
  }

  function seedAutoCreditBackExample() {
    if (state.creditActivity.some(r => r[1] === 'Auto Credit Back')) return;
    state.creditActivity.push([
      '2026-08-30 09:00:00','Auto Credit Back','In',210,
      '365-day expiry · originally USDC · 70% × capped $300 FMV',
      'usr_EXPIRED','auto_cb_demo','Confirmed'
    ]);
    state.credits.push([
      '2026-08-30 09:00:00','usr_EXPIRED','Auto Credit Back','+210.00','1,460.00',
      '365-day expiry · originally USDC · item closed and converted to Credits',
      'auto_cb_demo','Confirmed'
    ]);
  }

  function settleExpiredItems() {
    const now = new Date();
    const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + now.toTimeString().slice(0, 8);
    state.pendingItems.forEach(item => {
      if (item.status !== 'Vaulted' || item.daysLeft > 0) return;
      const amount = autoFallbackAmount(item);
      const ref = `auto_cb_${item.ref}`;
      const detail = `365-day expiry · originally ${item.paidWith} · item closed · 70% × lower of initial/live FMV`;
      state.creditActivity.unshift([ts, 'Auto Credit Back', 'In', amount, detail, item.user, ref, 'Confirmed']);
      state.credits.unshift([ts, item.user, 'Auto Credit Back', '+' + amount.toFixed(2), '—', detail, ref, 'Confirmed']);
      item.status = 'Settled to Credits';
    });
  }

  function ensureExtraStyles() {
    if (document.getElementById('treasuryExtraStyles')) return;
    const style = document.createElement('style');
    style.id = 'treasuryExtraStyles';
    style.textContent = `
      .finance-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:12px}
      .finance-summary .metric-card{min-height:0}
      .metric-value.tight{font-size:22px}
      @media(max-width:1000px){.finance-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:680px){.finance-summary{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function activateDynamicTab(button, panelId) {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab,.tab-panel').forEach(x => x.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(panelId)?.classList.add('active');
    });
  }

  function injectFinanceTabs() {
    if (document.getElementById('poolRevenue')) return;
    ensureExtraStyles();
    const nav = document.querySelector('.tabs');
    const rulesTab = [...nav.querySelectorAll('.tab')].find(b => b.dataset.tab === 'rules');

    const poolBtn = document.createElement('button');
    poolBtn.className = 'tab';
    poolBtn.dataset.tab = 'poolRevenue';
    poolBtn.textContent = 'Pool Revenue';

    const supplierBtn = document.createElement('button');
    supplierBtn.className = 'tab';
    supplierBtn.dataset.tab = 'supplierPayouts';
    supplierBtn.textContent = 'Supplier Payouts';

    nav.insertBefore(poolBtn, rulesTab || null);
    nav.insertBefore(supplierBtn, rulesTab || null);
    activateDynamicTab(poolBtn, 'poolRevenue');
    activateDynamicTab(supplierBtn, 'supplierPayouts');

    const rulesPanel = document.getElementById('rules');
    const poolPanel = document.createElement('section');
    poolPanel.id = 'poolRevenue';
    poolPanel.className = 'tab-panel';
    poolPanel.innerHTML = `
      <div class="section-intro">
        <div><h2>Pool Revenue</h2><p>Track revenue allocated into the company pool without mixing gross transaction value with actual Chosen revenue.</p></div>
        <button class="export-btn" id="exportPoolRevenue">Export CSV</button>
      </div>
      <div class="finance-summary">
        <article class="metric-card"><div class="metric-label">Gross source volume</div><div class="metric-value tight" id="poolGrossVolume">$0</div><div class="metric-foot">Underlying activity that generated pool revenue</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Pool revenue</div><div class="metric-value tight" id="poolRevenueTotal">$0</div><div class="metric-foot">Actual revenue allocated to the pool</div></article>
        <article class="metric-card"><div class="metric-label">Marketplace share</div><div class="metric-value tight" id="poolMarketplaceRevenue">$0</div><div class="metric-foot">Chosen fee revenue allocated to pool</div></article>
        <article class="metric-card"><div class="metric-label">Other pool revenue</div><div class="metric-value tight" id="poolOtherRevenue">$0</div><div class="metric-foot">Crate margin + partner allocations</div></article>
      </div>
      <div class="filters">
        <input id="poolSearch" class="control grow" placeholder="Search source or reference…" />
        <select id="poolSource" class="control"><option value="all">All sources</option><option>Marketplace Fee Share</option><option>Crate Margin Allocation</option><option>Partner Revenue Share</option></select>
        <select id="poolStatus" class="control"><option value="all">All statuses</option><option>Confirmed</option><option>Pending</option></select>
      </div>
      <article class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Time</th><th>Source</th><th>Gross volume</th><th>Rate</th><th>Pool revenue</th><th>Asset</th><th>Reference</th><th>Status</th></tr></thead><tbody id="poolRevenueTable"></tbody></table></div></article>
    `;

    const supplierPanel = document.createElement('section');
    supplierPanel.id = 'supplierPayouts';
    supplierPanel.className = 'tab-panel';
    supplierPanel.innerHTML = `
      <div class="section-intro">
        <div><h2>Supplier Payouts</h2><p>Track the real USDC cost of sourcing physical prizes once a user redemption creates a fulfillment obligation.</p></div>
        <button class="export-btn" id="exportSupplierPayouts">Export CSV</button>
      </div>
      <div class="finance-summary">
        <article class="metric-card"><div class="metric-label">Paid this period</div><div class="metric-value tight" id="supplierPaidTotal">$0</div><div class="metric-foot">Completed supplier payments</div></article>
        <article class="metric-card"><div class="metric-label">Pending payouts</div><div class="metric-value tight" id="supplierPendingTotal">$0</div><div class="metric-foot">Approved but not yet paid</div></article>
        <article class="metric-card"><div class="metric-label">Awaiting invoice</div><div class="metric-value tight" id="supplierInvoiceTotal">$0</div><div class="metric-foot">Expected cost not yet payable</div></article>
        <article class="metric-card"><div class="metric-label">Open suppliers</div><div class="metric-value tight" id="supplierCount">0</div><div class="metric-foot">Suppliers in the current payout log</div></article>
      </div>
      <div class="filters">
        <input id="supplierSearch" class="control grow" placeholder="Search supplier, item or claim…" />
        <select id="supplierStatus" class="control"><option value="all">All statuses</option><option>Paid</option><option>Pending</option><option>Awaiting Invoice</option></select>
      </div>
      <article class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Time</th><th>Supplier</th><th>Item</th><th>Claim</th><th>Cost basis</th><th>Asset</th><th>Status</th><th>Due</th><th>Payout ref</th></tr></thead><tbody id="supplierPayoutTable"></tbody></table></div></article>
    `;

    rulesPanel.parentNode.insertBefore(poolPanel, rulesPanel);
    rulesPanel.parentNode.insertBefore(supplierPanel, rulesPanel);

    document.getElementById('poolSearch').addEventListener('input', renderPoolRevenue);
    document.getElementById('poolSource').addEventListener('change', renderPoolRevenue);
    document.getElementById('poolStatus').addEventListener('change', renderPoolRevenue);
    document.getElementById('supplierSearch').addEventListener('input', renderSupplierPayouts);
    document.getElementById('supplierStatus').addEventListener('change', renderSupplierPayouts);
    document.getElementById('exportPoolRevenue').addEventListener('click', () => exportSection('pool-revenue'));
    document.getElementById('exportSupplierPayouts').addEventListener('click', () => exportSection('supplier-payouts'));
  }

  function renderPoolRevenue() {
    const q = (document.getElementById('poolSearch')?.value || '').toLowerCase();
    const source = document.getElementById('poolSource')?.value || 'all';
    const status = document.getElementById('poolStatus')?.value || 'all';
    const rows = state.poolRevenue.filter(r =>
      (source === 'all' || r[1] === source) &&
      (status === 'all' || r[7] === status) &&
      (!q || r.join(' ').toLowerCase().includes(q))
    );
    const gross = state.poolRevenue.reduce((a,r)=>a+Number(r[2]),0);
    const total = state.poolRevenue.reduce((a,r)=>a+Number(r[4]),0);
    const market = state.poolRevenue.filter(r=>r[1]==='Marketplace Fee Share').reduce((a,r)=>a+Number(r[4]),0);
    setText('poolGrossVolume', money(gross));
    setText('poolRevenueTotal', money(total));
    setText('poolMarketplaceRevenue', money(market));
    setText('poolOtherRevenue', money(total-market));
    const body = document.getElementById('poolRevenueTable');
    if (body) body.innerHTML = rows.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${money(r[2])}</td><td>${(r[3]*100).toFixed(r[3]*100<10?1:0)}%</td><td class="positive-text">+${money(r[4])}</td><td>${badge(r[5])}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
    return rows;
  }

  function renderSupplierPayouts() {
    const q = (document.getElementById('supplierSearch')?.value || '').toLowerCase();
    const status = document.getElementById('supplierStatus')?.value || 'all';
    const rows = state.supplierPayouts.filter(r =>
      (status === 'all' || r[6] === status) &&
      (!q || r.join(' ').toLowerCase().includes(q))
    );
    const paid = state.supplierPayouts.filter(r=>r[6]==='Paid').reduce((a,r)=>a+Number(r[4]),0);
    const pending = state.supplierPayouts.filter(r=>r[6]==='Pending').reduce((a,r)=>a+Number(r[4]),0);
    const awaiting = state.supplierPayouts.filter(r=>r[6]==='Awaiting Invoice').reduce((a,r)=>a+Number(r[4]),0);
    const suppliers = new Set(state.supplierPayouts.map(r=>r[1])).size;
    setText('supplierPaidTotal', money(paid));
    setText('supplierPendingTotal', money(pending));
    setText('supplierInvoiceTotal', money(awaiting));
    setText('supplierCount', suppliers.toLocaleString());
    const body = document.getElementById('supplierPayoutTable');
    if (body) body.innerHTML = rows.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="mono">${r[3]}</td><td class="negative-text">−${money(r[4])}</td><td>${badge(r[5])}</td><td>${badge(r[6])}</td><td class="mono">${r[7]}</td><td class="mono">${r[8]}</td></tr>`).join('');
    return rows;
  }

  syncPolicyCopy = function () {
    baseSyncPolicyCopy();
    addRuleHistoryOnce();
    injectFinanceTabs();

    const grid = document.querySelector('#rules .rules-grid');
    const findRule = label => [...document.querySelectorAll('#rules .rule-card')]
      .find(c => c.querySelector('span')?.textContent.trim() === label);

    const vaulted = findRule('Vaulted Item');
    if (vaulted) vaulted.innerHTML = '<span>Vaulted Item</span><strong>365 days</strong><p>The user can list, redeem, or liquidate the item during the claim window.</p>';

    let pending = findRule('Pending Liquidation');
    if (!pending && grid) {
      pending = document.createElement('article');
      pending.className = 'rule-card';
      pending.innerHTML = '<span>Pending Liquidation</span><strong>70% capped</strong><p>During the 365-day window: 70% × min(initial prize FMV, current live FMV).</p>';
      grid.appendChild(pending);
    } else if (pending) {
      pending.innerHTML = '<span>Pending Liquidation</span><strong>70% capped</strong><p>During the 365-day window: 70% × min(initial prize FMV, current live FMV).</p>';
    }

    let fallback = findRule('365-Day Fallback');
    if (!fallback && grid) {
      fallback = document.createElement('article');
      fallback.className = 'rule-card';
      grid.appendChild(fallback);
    }
    if (fallback) fallback.innerHTML = '<span>365-Day Fallback</span><strong>Auto Credit Back</strong><p>At expiry the item disappears from the vault and 70% × min(initial FMV, live FMV) is credited automatically in Credits.</p>';

    const windowCard = findRule('365-Day Window');
    if (windowCard) windowCard.innerHTML = '<span>365-Day Window</span><strong>Choice ends</strong><p>During the year: list, redeem, or liquidate. At expiry there is no longer a choice—the item auto-settles to Credits.</p>';

    const market = findRule('Market Protection');
    if (market) market.innerHTML = '<span>Market Protection</span><strong>Lower value wins</strong><p>Market upside is capped at the original prize FMV; market downside lowers the liquidation and Auto Credit Back basis.</p>';

    const note = document.querySelector('#rules .rule-note');
    if (note) note.innerHTML = '<b>Accounting boundary:</b> during the 365-day window, a vaulted prize may be listed, physically redeemed, or liquidated at 70% × min(initial FMV, live FMV). Physical redemption realizes actual acquisition cost as USDC outflow. If the item is still unresolved at day 365, the item claim closes automatically, disappears from the vault, and the user receives an <b>Auto Credit Back in Credits</b> on the same capped 70% basis—regardless of whether the crate originally used USDC or Credits.';

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(x => x.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'Users have 365 days to list, redeem, or liquidate a vaulted item. If they do nothing, the item is automatically closed and converted into Credits at expiry.';
    }

    const creditsMetric = document.getElementById('creditsPendingBack')?.closest('.metric-card');
    if (creditsMetric) {
      creditsMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      creditsMetric.querySelector('.metric-foot').textContent = 'Credits issued if every current vault reaches day 365';
    }

    const activityMetric = document.getElementById('pendingCreditMetric')?.closest('.metric-card');
    if (activityMetric) {
      activityMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      activityMetric.querySelector('.metric-foot').textContent = 'All vaulted items settle to Credits at expiry';
    }

    const settlePanel = [...document.querySelectorAll('#credits .panel h3')]
      .find(x => x.textContent.trim() === 'How Credits settle')?.closest('.panel');
    if (settlePanel) {
      const stack = settlePanel.querySelector('.info-stack');
      if (stack) stack.innerHTML = '<div><b>Credit Back</b><span>Immediate Credits-funded settlement at 80% of the prize\'s live FMV.</span></div><div><b>Vaulted prize</b><span>No immediate settlement. The user has 365 days to list, redeem, or liquidate.</span></div><div><b>Pending liquidation</b><span>During the claim window: 70% × the lower of initial prize FMV or current live FMV.</span></div><div><b>Physical redemption</b><span>Chosen records actual product acquisition cost as USDC outflow.</span></div><div><b>Auto Credit Back</b><span>At day 365, an unresolved item is removed from the vault and automatically converted into Credits at the capped 70% basis, regardless of original payment method.</span></div>';
    }

    const creditActivitySelect = document.getElementById('creditActivityType');
    if (creditActivitySelect) {
      [...creditActivitySelect.options].forEach(o => {
        if (o.textContent.trim() === 'Expiry Credit Back' || o.textContent.trim() === '365-Day Fallback') o.remove();
      });
      if (![...creditActivitySelect.options].some(o=>o.value==='Auto Credit Back')) {
        const option = document.createElement('option');
        option.value = 'Auto Credit Back';
        option.textContent = 'Auto Credit Back';
        creditActivitySelect.appendChild(option);
      }
    }

    const sourceSelect = document.getElementById('creditsSource');
    if (sourceSelect) {
      [...sourceSelect.options].forEach(o => { if (o.textContent.trim() === '365-Day Fallback') o.remove(); });
      if (![...sourceSelect.options].some(o => o.value === 'Auto Credit Back')) {
        const option = document.createElement('option');
        option.value = 'Auto Credit Back';
        option.textContent = 'Auto Credit Back';
        sourceSelect.appendChild(option);
      }
    }

    document.querySelectorAll('.mix-row').forEach(row => {
      const title = row.querySelector('strong')?.textContent.trim();
      if (title === 'Vaulted item') {
        const span = row.querySelector('span');
        if (span) span.textContent = 'User has 365 days to act; unresolved items automatically convert to Credits at expiry.';
      }
    });
  };

  renderPendingItems = function () {
    const active = state.pendingItems.filter(x => x.status === 'Vaulted');
    setText('pendingItemCount', active.length.toLocaleString());
    setText('pendingCreditBackExposure', credits(pendingCreditLiquidation()) + ' cr');
    setText('pendingUsdcFallback', money(pendingUsdcLiquidation()));
    setText('pendingFulfillmentReserve', money(pendingReserve()));

    const head = document.querySelector('#pendingItemsTable')?.closest('table')?.querySelector('thead tr');
    if (head) head.innerHTML = '<th>Opened</th><th>User</th><th>Item</th><th>Paid with</th><th>Entry</th><th>Initial FMV</th><th>Live FMV</th><th>70% liquidation</th><th>Auto Credit Back</th><th>Expected cost</th><th>Days left</th><th>Status</th>';

    document.getElementById('pendingItemsTable').innerHTML = active.map(x => {
      const entry = x.paidWith === 'Credits' ? `${credits(x.entry)} cr` : money(x.entry);
      const liquid = autoFallbackAmount(x);
      const liquidation = x.paidWith === 'Credits' ? `${credits(liquid)} cr` : money(liquid);
      const trend = x.marketFmv > x.initialFmv ? 'Capped at initial' : x.marketFmv < x.initialFmv ? 'Uses lower market' : 'No change';
      return `<tr><td class="mono">${x.opened}</td><td class="mono">${x.user}</td><td>${x.item}</td><td>${badge(x.paidWith)}</td><td>${entry}</td><td>${money(x.initialFmv)}</td><td>${money(x.marketFmv)}</td><td>${liquidation}<small class="table-sub">${trend}</small></td><td>${credits(liquid)} cr<small class="table-sub">Automatic at day 365</small></td><td>${money(x.expectedCost)}</td><td>${x.daysLeft}</td><td>${badge(x.status)}</td></tr>`;
    }).join('');

    return active.map(x => [x.opened, x.user, x.item, x.paidWith, x.entry, x.initialFmv, x.marketFmv, autoFallbackAmount(x), autoFallbackAmount(x), x.expectedCost, x.daysLeft, x.status, x.ref]);
  };

  renderCredits = function () {
    const rows = baseRenderCredits();
    setText('creditsPendingBack', credits(projectedAutoCreditBack()));
    return rows;
  };

  renderAll = function () {
    seedAutoCreditBackExample();
    settleExpiredItems();
    baseRenderAll();
    renderPoolRevenue();
    renderSupplierPayouts();
  };

  exportSection = function (kind) {
    if (kind === 'pending-items') {
      return downloadCsv(
        'pending-items',
        ['Opened','User','Item','Paid with','Entry','Initial FMV','Live FMV','70% liquidation','Auto Credit Back Credits','Expected cost','Days left','Status','Reference'],
        renderPendingItems()
      );
    }
    if (kind === 'pool-revenue') {
      return downloadCsv(
        'pool-revenue',
        ['Time','Source','Gross volume','Rate','Pool revenue','Asset','Reference','Status'],
        renderPoolRevenue()
      );
    }
    if (kind === 'supplier-payouts') {
      return downloadCsv(
        'supplier-payouts',
        ['Time','Supplier','Item','Claim','Cost basis','Asset','Status','Due','Payout ref'],
        renderSupplierPayouts()
      );
    }
    return oldExportSection(kind);
  };

  renderAll();
})();
