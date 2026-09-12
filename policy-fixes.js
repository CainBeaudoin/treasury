/* Final treasury display fixes layered after policy-overrides.js. */
(function () {
  function projectedAutoCreditBack() {
    return state.pendingItems
      .filter(item => item.status === 'Vaulted')
      .reduce((sum, item) => sum + pendingLiquidationAmount(item), 0);
  }

  function bindFinanceTab(button, panelId) {
    if (!button || button.dataset.financeTabBound) return;
    button.dataset.financeTabBound = 'true';
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab,.tab-panel').forEach(x => x.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(panelId)?.classList.add('active');
      if (panelId === 'poolRevenue') renderFinancePages();
      if (panelId === 'supplierPayouts') renderFinancePages();
    });
  }

  function ensureFinanceTabsVisible() {
    const nav = document.querySelector('.tabs');
    if (!nav) return;

    const activityTab = [...nav.querySelectorAll('.tab')].find(b => b.dataset.tab === 'activity');
    const specs = [
      ['poolRevenue', 'Pool Revenue'],
      ['supplierPayouts', 'Supplier Payouts']
    ];

    const buttons = specs.map(([panelId, label]) => {
      if (!document.getElementById(panelId)) return null;
      let button = [...nav.querySelectorAll('.tab')].find(b => b.dataset.tab === panelId);
      if (!button) {
        button = document.createElement('button');
        button.className = 'tab';
        button.dataset.tab = panelId;
        button.textContent = label;
      }
      bindFinanceTab(button, panelId);
      return button;
    }).filter(Boolean);

    // Finance pages belong immediately after Overview and before Activity.
    buttons.forEach(button => nav.insertBefore(button, activityTab || null));
  }

  function ensureFinancePageStyles() {
    if (document.getElementById('financePageStyles')) return;
    const style = document.createElement('style');
    style.id = 'financePageStyles';
    style.textContent = `
      .finance-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}
      .finance-kpis .metric-card{min-height:0}
      .finance-kpis .metric-value{font-size:23px}
      .finance-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0}
      .finance-breakdown{width:100%;border-collapse:collapse;min-width:0}
      .finance-breakdown th,.finance-breakdown td{padding:10px 0;border-bottom:1px solid var(--border);font-size:11px}
      .finance-breakdown th{text-align:left;background:transparent;color:var(--muted);text-transform:none;letter-spacing:0}
      .finance-breakdown td:last-child,.finance-breakdown th:last-child{text-align:right}
      .finance-note{font-size:11px;color:var(--muted);line-height:1.45;margin-top:8px}
      @media(max-width:1100px){.finance-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.finance-grid{grid-template-columns:1fr}}
      @media(max-width:720px){.finance-kpis{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function setupPoolRevenuePage() {
    const panel = document.getElementById('poolRevenue');
    if (!panel || panel.dataset.expandedFinancePage) return;
    panel.dataset.expandedFinancePage = 'true';
    panel.innerHTML = `
      <div class="section-intro">
        <div><h2>Pool Revenue</h2><p>Quarterly revenue flowing into Chosen, where it came from, and how much remains after realized supplier payouts.</p></div>
        <button class="export-btn" id="exportPoolRevenue">Export CSV</button>
      </div>
      <div class="finance-kpis">
        <article class="metric-card accent-usdc"><div class="metric-label">Quarterly pool revenue</div><div class="metric-value" id="poolRevenueTotal">$0</div><div class="metric-foot">Actual Chosen revenue allocated this quarter</div></article>
        <article class="metric-card"><div class="metric-label">Gross source volume</div><div class="metric-value" id="poolGrossVolume">$0</div><div class="metric-foot">Underlying transaction volume</div></article>
        <article class="metric-card"><div class="metric-label">Marketplace fee revenue</div><div class="metric-value" id="poolMarketplaceRevenue">$0</div><div class="metric-foot">Chosen fee share only</div></article>
        <article class="metric-card"><div class="metric-label">Supplier cash paid</div><div class="metric-value" id="poolSupplierPaid">$0</div><div class="metric-foot">Real supplier USDC outflow this quarter</div></article>
        <article class="metric-card"><div class="metric-label">Net after supplier payouts</div><div class="metric-value" id="poolNetAfterSuppliers">$0</div><div class="metric-foot">Pool revenue less paid supplier outflow</div></article>
      </div>
      <div class="finance-grid">
        <article class="panel"><div class="panel-head"><div><h3>Quarterly revenue breakdown</h3><p>Only Chosen's earned/allocated amount counts as revenue.</p></div></div><table class="finance-breakdown"><thead><tr><th>Source</th><th>Gross volume</th><th>Revenue</th></tr></thead><tbody id="poolSourceSummary"></tbody></table><div class="finance-note">Gross marketplace sale value is not company revenue. Only Chosen's fee share is counted here.</div></article>
        <article class="panel"><div class="panel-head"><div><h3>Quarterly cash bridge</h3><p>How revenue compares with realized supplier cash outflow.</p></div></div><table class="finance-breakdown"><tbody id="poolCashBridge"></tbody></table></article>
      </div>
      <div class="filters">
        <input id="poolSearch" class="control grow" placeholder="Search source or reference…" />
        <select id="poolSource" class="control"><option value="all">All sources</option><option>Marketplace Fee Share</option><option>Crate Margin Allocation</option><option>Partner Revenue Share</option></select>
        <select id="poolStatus" class="control"><option value="all">All statuses</option><option>Confirmed</option><option>Pending</option></select>
      </div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>Revenue activity</h3><p>Audit trail backing the quarterly pool revenue total.</p></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Source</th><th>Gross volume</th><th>Rate</th><th>Pool revenue</th><th>Asset</th><th>Reference</th><th>Status</th></tr></thead><tbody id="poolRevenueTable"></tbody></table></div></article>
    `;
    document.getElementById('poolSearch')?.addEventListener('input', renderFinancePages);
    document.getElementById('poolSource')?.addEventListener('change', renderFinancePages);
    document.getElementById('poolStatus')?.addEventListener('change', renderFinancePages);
    document.getElementById('exportPoolRevenue')?.addEventListener('click', () => exportSection('pool-revenue'));
  }

  function setupSupplierPayoutPage() {
    const panel = document.getElementById('supplierPayouts');
    if (!panel || panel.dataset.expandedFinancePage) return;
    panel.dataset.expandedFinancePage = 'true';
    panel.innerHTML = `
      <div class="section-intro">
        <div><h2>Supplier Payouts</h2><p>Quarterly supplier spend, outstanding obligations, and the exact item-level cost basis behind physical fulfillment.</p></div>
        <button class="export-btn" id="exportSupplierPayouts">Export CSV</button>
      </div>
      <div class="finance-kpis">
        <article class="metric-card accent-usdc"><div class="metric-label">Paid this quarter</div><div class="metric-value" id="supplierPaidTotal">$0</div><div class="metric-foot">Completed supplier USDC outflow</div></article>
        <article class="metric-card"><div class="metric-label">Pending approved</div><div class="metric-value" id="supplierPendingTotal">$0</div><div class="metric-foot">Approved but not paid</div></article>
        <article class="metric-card"><div class="metric-label">Awaiting invoice</div><div class="metric-value" id="supplierInvoiceTotal">$0</div><div class="metric-foot">Expected AP exposure</div></article>
        <article class="metric-card"><div class="metric-label">Total committed</div><div class="metric-value" id="supplierCommittedTotal">$0</div><div class="metric-foot">Paid + pending + awaiting invoice</div></article>
        <article class="metric-card"><div class="metric-label">Active suppliers</div><div class="metric-value" id="supplierCount">0</div><div class="metric-foot">Suppliers represented this quarter</div></article>
      </div>
      <div class="finance-grid">
        <article class="panel"><div class="panel-head"><div><h3>Spend by supplier</h3><p>Cost basis grouped by supplier and payment status.</p></div></div><table class="finance-breakdown"><thead><tr><th>Supplier</th><th>Paid</th><th>Open AP</th><th>Total</th></tr></thead><tbody id="supplierSummary"></tbody></table></article>
        <article class="panel"><div class="panel-head"><div><h3>Supplier accounting</h3><p>How these amounts flow into the main dashboard.</p></div></div><div class="info-stack"><div><b>Paid</b><span>Real USDC outflow and reflected in treasury cash movement.</span></div><div><b>Pending</b><span>Approved accounts payable exposure; not yet a completed cash movement.</span></div><div><b>Awaiting invoice</b><span>Expected cost basis waiting for invoice confirmation.</span></div><div><b>Prize FMV</b><span>Not used as supplier cost. Supplier payout is based on Chosen's actual acquisition cost.</span></div></div></article>
      </div>
      <div class="filters">
        <input id="supplierSearch" class="control grow" placeholder="Search supplier, item, claim or payout ref…" />
        <select id="supplierStatus" class="control"><option value="all">All statuses</option><option>Paid</option><option>Pending</option><option>Awaiting Invoice</option></select>
      </div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>Supplier payout activity</h3><p>Item-level ledger backing supplier spend and accounts payable.</p></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Supplier</th><th>Item</th><th>Claim</th><th>Cost basis</th><th>Asset</th><th>Status</th><th>Due</th><th>Payout ref</th></tr></thead><tbody id="supplierPayoutTable"></tbody></table></div></article>
    `;
    document.getElementById('supplierSearch')?.addEventListener('input', renderFinancePages);
    document.getElementById('supplierStatus')?.addEventListener('change', renderFinancePages);
    document.getElementById('exportSupplierPayouts')?.addEventListener('click', () => exportSection('supplier-payouts'));
  }

  function renderFinancePages() {
    const poolRows = state.poolRevenue || [];
    const supplierRows = state.supplierPayouts || [];

    const poolQuery = (document.getElementById('poolSearch')?.value || '').toLowerCase();
    const poolSource = document.getElementById('poolSource')?.value || 'all';
    const poolStatus = document.getElementById('poolStatus')?.value || 'all';
    const filteredPool = poolRows.filter(r =>
      (poolSource === 'all' || r[1] === poolSource) &&
      (poolStatus === 'all' || r[7] === poolStatus) &&
      (!poolQuery || r.join(' ').toLowerCase().includes(poolQuery))
    );

    const gross = poolRows.reduce((a,r)=>a+Number(r[2] || 0),0);
    const revenue = poolRows.reduce((a,r)=>a+Number(r[4] || 0),0);
    const marketRevenue = poolRows.filter(r=>r[1]==='Marketplace Fee Share').reduce((a,r)=>a+Number(r[4] || 0),0);
    const supplierPaid = supplierRows.filter(r=>r[6]==='Paid').reduce((a,r)=>a+Number(r[4] || 0),0);
    const netAfterSuppliers = revenue - supplierPaid;

    setText('poolGrossVolume', money(gross));
    setText('poolRevenueTotal', money(revenue));
    setText('poolMarketplaceRevenue', money(marketRevenue));
    setText('poolSupplierPaid', money(supplierPaid));
    setText('poolNetAfterSuppliers', money(netAfterSuppliers));
    const netEl = document.getElementById('poolNetAfterSuppliers');
    if (netEl) netEl.className = 'metric-value ' + (netAfterSuppliers >= 0 ? 'positive-text' : 'negative-text');

    const sourceNames = [...new Set(poolRows.map(r=>r[1]))];
    const sourceSummary = document.getElementById('poolSourceSummary');
    if (sourceSummary) sourceSummary.innerHTML = sourceNames.map(name => {
      const rows = poolRows.filter(r=>r[1]===name);
      const sourceGross = rows.reduce((a,r)=>a+Number(r[2] || 0),0);
      const sourceRevenue = rows.reduce((a,r)=>a+Number(r[4] || 0),0);
      return `<tr><td>${name}</td><td>${money(sourceGross)}</td><td>${money(sourceRevenue)}</td></tr>`;
    }).join('');

    const bridge = document.getElementById('poolCashBridge');
    if (bridge) bridge.innerHTML = `
      <tr><td>Quarterly pool revenue</td><td class="positive-text">+${money(revenue)}</td></tr>
      <tr><td>Paid supplier outflow</td><td class="negative-text">−${money(supplierPaid)}</td></tr>
      <tr><td><b>Net after supplier payouts</b></td><td class="${netAfterSuppliers >= 0 ? 'positive-text' : 'negative-text'}"><b>${netAfterSuppliers >= 0 ? '+' : '−'}${money(Math.abs(netAfterSuppliers))}</b></td></tr>`;

    const poolBody = document.getElementById('poolRevenueTable');
    if (poolBody) poolBody.innerHTML = filteredPool.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${money(r[2])}</td><td>${(Number(r[3])*100).toFixed(Number(r[3])*100<10?1:0)}%</td><td class="positive-text">+${money(r[4])}</td><td>${badge(r[5])}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');

    const supplierQuery = (document.getElementById('supplierSearch')?.value || '').toLowerCase();
    const supplierStatus = document.getElementById('supplierStatus')?.value || 'all';
    const filteredSuppliers = supplierRows.filter(r =>
      (supplierStatus === 'all' || r[6] === supplierStatus) &&
      (!supplierQuery || r.join(' ').toLowerCase().includes(supplierQuery))
    );
    const paid = supplierPaid;
    const pending = supplierRows.filter(r=>r[6]==='Pending').reduce((a,r)=>a+Number(r[4] || 0),0);
    const awaiting = supplierRows.filter(r=>r[6]==='Awaiting Invoice').reduce((a,r)=>a+Number(r[4] || 0),0);
    const committed = paid + pending + awaiting;
    const supplierNames = [...new Set(supplierRows.map(r=>r[1]))];

    setText('supplierPaidTotal', money(paid));
    setText('supplierPendingTotal', money(pending));
    setText('supplierInvoiceTotal', money(awaiting));
    setText('supplierCommittedTotal', money(committed));
    setText('supplierCount', supplierNames.length.toLocaleString());

    const supplierSummary = document.getElementById('supplierSummary');
    if (supplierSummary) supplierSummary.innerHTML = supplierNames.map(name => {
      const rows = supplierRows.filter(r=>r[1]===name);
      const sPaid = rows.filter(r=>r[6]==='Paid').reduce((a,r)=>a+Number(r[4] || 0),0);
      const sOpen = rows.filter(r=>r[6]!=='Paid').reduce((a,r)=>a+Number(r[4] || 0),0);
      return `<tr><td>${name}</td><td>${money(sPaid)}</td><td>${money(sOpen)}</td><td>${money(sPaid+sOpen)}</td></tr>`;
    }).join('');

    const supplierBody = document.getElementById('supplierPayoutTable');
    if (supplierBody) supplierBody.innerHTML = filteredSuppliers.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="mono">${r[3]}</td><td class="negative-text">−${money(r[4])}</td><td>${badge(r[5])}</td><td>${badge(r[6])}</td><td class="mono">${r[7]}</td><td class="mono">${r[8]}</td></tr>`).join('');
  }

  function syncRules() {
    const grid = document.querySelector('#rules .rules-grid');
    if (!grid) return;

    const rules = [
      ['Credits','Non-cash units','Credits have no direct cash value in treasury reporting. They only affect real cash when a physical claim or other USDC settlement creates a real obligation.'],
      ['Credit Spend','Entry removed','A Credits-funded crate immediately removes the crate entry amount from the user’s Credit balance.'],
      ['Immediate Credit Back','80% of prize FMV','For a Credits-funded prize settled immediately, the user receives Credits equal to 80% of the prize FMV. It is based on outcome value, not crate entry.'],
      ['USDC Cashback','80% of prize FMV','For a USDC-funded prize settled immediately, the user receives 80% of the prize FMV in USDC. No Credits are paid for that immediate settlement.'],
      ['Crate Bonus','5% of entry','Every crate emits a separate bonus equal to 5% of crate entry value, whether the crate was funded with USDC or Credits.'],
      ['Vaulted Item','365-day claim window','A vaulted prize does not immediately trigger Credit Back or a USDC outflow. The user can list, physically redeem, or liquidate it during the 365-day window.'],
      ['Pending Liquidation','70% capped','During the 365-day window, liquidation is 70% × min(initial prize FMV, current live FMV). Upside is capped at reveal FMV; downside follows the market.'],
      ['Liquidation Asset','Original settlement asset','During the 365-day window, Credits-funded vaults liquidate to Credits and USDC-funded vaults liquidate to USDC.'],
      ['365-Day Window','Auto Credit Back','At day 365, if the item is still unresolved, the user loses the choice to redeem or liquidate. The item is removed from the vault and automatically settled into Credits.'],
      ['Auto Credit Back','70% capped · Credits','The day-365 settlement is always Credits, regardless of original payment method, using 70% × min(initial FMV, live FMV at expiry).'],
      ['After Auto Credit Back','Credits remain available','If the user is inactive, the Credits remain in the account. They can return later and use those Credits to open or reroll into another crate.'],
      ['Physical Redemption','Actual acquisition cost','When a user redeems physically, Chosen records the actual amount paid to source the item as USDC outflow—not the displayed prize FMV.'],
      ['Shipping','Separate cash flows','Shipping charged to the user is a USDC inflow. Carrier, handling, and fulfillment costs are separate USDC outflows.'],
      ['Marketplace','Only the fee is revenue','Marketplace sale principal is not Chosen revenue. Only Chosen’s marketplace fee is recorded as company revenue. Demo fee: 1%.'],
      ['Supplier Payout','Actual cost basis','Paid supplier payouts are real USDC outflows tied to fulfillment cost basis. Pending or awaiting-invoice amounts are accounts-payable exposure, not completed cash movement.'],
      ['Pool Revenue','Allocated revenue only','Pool Revenue records Chosen’s actual allocated revenue, not the gross transaction value that generated it.'],
      ['Lulu Single','100 Credits','Each Lulu burned emits 100 Credits.'],
      ['Lulu Triple','333 Credits','Every three Lulus burned emit 333 Credits total, including the 33-Credit triple bonus.']
    ];

    grid.innerHTML = rules.map((r, i) =>
      `<article class="rule-card${i === 8 || i === 9 ? ' accent-rule' : ''}"><span>${r[0]}</span><strong>${r[1]}</strong><p>${r[2]}</p></article>`
    ).join('');

    const note = document.querySelector('#rules .rule-note');
    if (note) note.innerHTML = '<b>Accounting boundary:</b> Credits are non-cash platform units. Vaulted prizes are pending exposure, not realized cash outflows. Real USDC leaves treasury for USDC cashback, physical acquisition/fulfillment, shipping costs, and paid supplier obligations. Unresolved vaults automatically close at day 365 through Auto Credit Back in Credits.';
  }

  function syncAutoCreditBackUi() {
    const projected = projectedAutoCreditBack();
    setText('pendingCreditMetric', credits(projected));
    setText('creditsPendingBack', credits(projected));

    const creditsMetric = document.getElementById('creditsPendingBack')?.closest('.metric-card');
    if (creditsMetric) {
      creditsMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      creditsMetric.querySelector('.metric-foot').textContent = 'Credits if every current vault reaches day 365 unresolved';
    }

    const activityMetric = document.getElementById('pendingCreditMetric')?.closest('.metric-card');
    if (activityMetric) {
      activityMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      activityMetric.querySelector('.metric-foot').textContent = 'All unresolved vaulted items settle to Credits at day 365';
    }

    const exposureStrip = document.querySelector('#credits .exposure-strip');
    if (exposureStrip) {
      let value = document.getElementById('autoCreditBackExposure');
      if (!value) {
        const card = document.createElement('div');
        card.innerHTML = '<span>Projected Auto Credit Back</span><strong id="autoCreditBackExposure">0 cr</strong>';
        exposureStrip.insertBefore(card, exposureStrip.lastElementChild || null);
        value = document.getElementById('autoCreditBackExposure');
      }
      setText('autoCreditBackExposure', credits(projected) + ' cr');
    }

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(el => el.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'The user has 365 days to list, redeem, or liquidate. If they do nothing, the item disappears from the vault at day 365 and Auto Credit Back deposits the capped 70% amount into Credits.';
    }

    ensureFinancePageStyles();
    ensureFinanceTabsVisible();
    setupPoolRevenuePage();
    setupSupplierPayoutPage();
    renderFinancePages();
    syncRules();
  }

  const baseRenderAll = renderAll;
  renderAll = function () {
    baseRenderAll();
    syncAutoCreditBackUi();
  };

  renderAll();
})();
