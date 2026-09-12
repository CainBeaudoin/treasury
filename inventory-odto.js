/* ODTO inventory roll-forward + inventory-aware finance accounting. */
(function () {
  const INVENTORY_SPLIT = {
    P1413: { available: 12, userVault: 4, redeemed: 2 },
    P2426: { available: 16, userVault: 4, redeemed: 2 },
    P879:  { available: 7,  userVault: 3, redeemed: 2 },
    P684:  { available: 7,  userVault: 2, redeemed: 1 },
    P1887: { available: 3,  userVault: 2, redeemed: 1 }
  };

  const num = v => Number(v || 0);
  const usd = v => money(num(v));

  function inventoryRows() {
    return (state.odtoCatalog || []).map(item => {
      const split = INVENTORY_SPLIT[item.itemNo] || { available: 0, userVault: 0, redeemed: 0 };
      const paid = item.status === 'Paid';
      const available = paid ? split.available : 0;
      const userVault = paid ? split.userVault : 0;
      const redeemed = paid ? split.redeemed : 0;
      const inbound = paid ? 0 : item.qty;
      const unitCost = num(item.unitCostUsdc);
      return {
        ...item,
        available,
        userVault,
        redeemed,
        inbound,
        warehouseQty: available + userVault,
        warehouseCost: (available + userVault) * unitCost,
        reusableCost: available * unitCost,
        vaultCost: userVault * unitCost,
        redeemedCost: redeemed * unitCost,
        inboundCost: inbound * unitCost
      };
    });
  }

  function inventoryTotals() {
    const rows = inventoryRows();
    const total = key => rows.reduce((sum, row) => sum + num(row[key]), 0);
    const paidPurchaseCost = rows.filter(x => x.status === 'Paid').reduce((sum, x) => sum + num(x.totalUsdc), 0);
    const paidUnits = rows.filter(x => x.status === 'Paid').reduce((sum, x) => sum + num(x.qty), 0);
    return {
      rows,
      paidPurchaseCost,
      paidUnits,
      warehouseQty: total('warehouseQty'),
      warehouseCost: total('warehouseCost'),
      availableQty: total('available'),
      reusableCost: total('reusableCost'),
      userVaultQty: total('userVault'),
      userVaultCost: total('vaultCost'),
      redeemedQty: total('redeemed'),
      redeemedCost: total('redeemedCost'),
      inboundQty: total('inbound'),
      inboundCost: total('inboundCost'),
      inventoryCogs: total('vaultCost') + total('redeemedCost')
    };
  }

  function seedOdtoCashActivity() {
    const existing = new Set(state.usdc.map(r => `${r[6]}|${r[1]}`));
    const rows = (state.supplierPayouts || [])
      .filter(r => r[6] === 'Paid')
      .map(r => [
        r[0],
        'ODTO Inventory Purchase',
        'Out',
        num(r[4]),
        `${r[2]} inventory purchase · increases ODTO stock at cost`,
        'ODTO',
        r[8],
        'Confirmed'
      ])
      .filter(r => !existing.has(`${r[6]}|${r[1]}`));
    if (rows.length) state.usdc = [...rows, ...state.usdc];

    const select = document.getElementById('usdcType');
    if (select && ![...select.options].some(o => o.value === 'ODTO Inventory Purchase')) {
      const opt = document.createElement('option');
      opt.value = 'ODTO Inventory Purchase';
      opt.textContent = 'ODTO Inventory Purchase';
      select.appendChild(opt);
    }
  }

  function addStyles() {
    if (document.getElementById('odtoInventoryStyles')) return;
    const s = document.createElement('style');
    s.id = 'odtoInventoryStyles';
    s.textContent = `
      .inventory-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}
      .inventory-kpis .metric-card{min-height:96px}
      .inventory-kpis .metric-value{font-size:21px}
      .inventory-state{display:inline-flex;align-items:center;gap:6px;font-size:10px;color:var(--muted)}
      .inventory-state:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--info)}
      .inventory-state.available:before{background:var(--success)}
      .inventory-state.vault:before{background:var(--warning)}
      .inventory-state.inbound:before{background:var(--info)}
      .inventory-state.redeemed:before{background:var(--danger)}
      .inventory-note{font-size:10px;color:var(--muted);line-height:1.4;margin-top:6px}
      @media(max-width:1250px){.inventory-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:760px){.inventory-kpis{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function setupOdtoInventory() {
    const view = document.getElementById('odtoPayoutView');
    if (!view) return;
    const t = inventoryTotals();

    const existingKpis = view.querySelector('.finance-kpis');
    if (existingKpis) {
      existingKpis.className = 'inventory-kpis';
      existingKpis.innerHTML = `
        <article class="metric-card tone-info"><div class="metric-label">Warehouse stock at cost</div><div class="metric-value">${usd(t.warehouseCost)}</div><div class="metric-foot">${t.warehouseQty} units physically held</div></article>
        <article class="metric-card tone-positive"><div class="metric-label">Reusable crate inventory</div><div class="metric-value">${usd(t.reusableCost)}</div><div class="metric-foot">${t.availableQty} units available to recycle through crates</div></article>
        <article class="metric-card tone-warning"><div class="metric-label">User vault custody</div><div class="metric-value">${usd(t.userVaultCost)}</div><div class="metric-foot">${t.userVaultQty} units allocated · no longer reusable</div></article>
        <article class="metric-card tone-negative"><div class="metric-label">Paid to ODTO</div><div class="metric-value">${usd(t.paidPurchaseCost)}</div><div class="metric-foot">Q3 inventory-purchase cash outflow</div></article>
        <article class="metric-card tone-warning"><div class="metric-label">Inbound / open AP</div><div class="metric-value">${usd(t.inboundCost)}</div><div class="metric-foot">${t.inboundQty} units ordered but not yet paid/received</div></article>`;
    }

    let panel = document.getElementById('odtoInventoryPanel');
    if (!panel) {
      panel = document.createElement('article');
      panel.id = 'odtoInventoryPanel';
      panel.className = 'panel table-panel';
      const payoutTable = view.querySelector('.panel.table-panel');
      payoutTable?.insertAdjacentElement('beforebegin', panel);
    }

    panel.innerHTML = `
      <div class="panel-head"><div><h3>Inventory Position</h3></div></div>
      <div class="table-wrap"><table><thead><tr><th>Product</th><th>Ordered</th><th>Reusable</th><th>User vault</th><th>Redeemed</th><th>Inbound</th><th>Unit cost</th><th>Physical stock value</th></tr></thead>
      <tbody>${t.rows.map(x => `<tr><td><b>${esc(x.item)}</b><small class="table-sub">${x.itemNo}</small></td><td>${x.qty}</td><td class="positive-text">${x.available}</td><td class="warning-text">${x.userVault}</td><td>${x.redeemed}</td><td>${x.inbound}</td><td>${usd(x.unitCostUsdc)}</td><td>${usd(x.warehouseCost)}</td></tr>`).join('')}</tbody></table></div>`;

    const sourceNote = view.querySelector('.supplier-source-note');
    if (sourceNote) sourceNote.innerHTML = '<b>ODTO inventory:</b> paid purchases enter reusable inventory at acquisition cost. An item can recycle through crates until it is allocated to a user vault or redeemed; that removes it from the reusable pool and creates replenishment demand.';
  }

  function correctedFinance() {
    const inv = inventoryTotals();
    const earnedRevenue = (state.poolRevenue || []).reduce((sum, r) => sum + num(r[4]), 0);
    const operatingProfit = earnedRevenue - inv.inventoryCogs;
    const reserveText = document.getElementById('rpReserve')?.textContent || '$0';
    const requiredReserve = Number(reserveText.replace(/[^0-9.-]/g, '')) || 0;
    const liquiditySurplus = Math.max(0, TREASURY_USDC - HARD_USDC_OBLIGATIONS - requiredReserve);
    const safeWithdrawal = Math.max(0, Math.min(operatingProfit, liquiditySurplus));

    setText('rpOperatingProfit', usd(operatingProfit));
    setText('rpWithdrawable', usd(safeWithdrawal));
    setText('ovProfit', usd(safeWithdrawal));
    setText('ovProfitDetail', `Operating profit ${usd(operatingProfit)} · liquidity surplus ${usd(liquiditySurplus)}`);

    const payoutDetail = document.getElementById('ovPayoutDetail');
    if (payoutDetail) payoutDetail.textContent = `ODTO cash ${usd(inv.paidPurchaseCost)} · stocks ${usd((state.stockPackExecutions || []).reduce((s,x)=>s+num(x[3]),0))} · warehouse stock ${usd(inv.warehouseCost)}`;

    const wf = document.getElementById('rpWaterfall');
    if (wf) wf.innerHTML = `
      <tr><td>Q3-to-date earned revenue</td><td class="positive-text">+${usd(earnedRevenue)}</td></tr>
      <tr><td>Inventory COGS recognized</td><td class="negative-text">−${usd(inv.inventoryCogs)}</td></tr>
      <tr><td><b>Q3 operating profit</b></td><td class="${operatingProfit>=0?'positive-text':'negative-text'}"><b>${usd(operatingProfit)}</b></td></tr>
      <tr><td>ODTO inventory purchases paid</td><td class="info-text">${usd(inv.paidPurchaseCost)} asset purchase</td></tr>
      <tr><td>Reusable inventory remaining</td><td class="info-text">${usd(inv.reusableCost)}</td></tr>
      <tr><td>Treasury USDC</td><td>${usd(TREASURY_USDC)}</td></tr>
      <tr><td>Hard USDC obligations</td><td class="warning-text">−${usd(HARD_USDC_OBLIGATIONS)}</td></tr>
      <tr><td>Required reserve</td><td class="warning-text">−${usd(requiredReserve)}</td></tr>
      <tr><td><b>Liquidity surplus</b></td><td class="${liquiditySurplus>0?'positive-text':'negative-text'}"><b>${usd(liquiditySurplus)}</b></td></tr>
      <tr><td><b>Safe withdrawal</b></td><td class="${safeWithdrawal>0?'positive-text':'negative-text'}"><b>${usd(safeWithdrawal)}</b></td></tr>`;

    const opCard = document.getElementById('rpOperatingProfit')?.closest('.metric-card');
    const opFoot = opCard?.querySelector('.metric-foot');
    if (opFoot) opFoot.textContent = 'Revenue less inventory allocated to user vaults or redeemed';

    return { ...inv, earnedRevenue, operatingProfit, requiredReserve, liquiditySurplus, safeWithdrawal };
  }

  function updateRules() {
    const card = [...document.querySelectorAll('#rules .rule-card')].find(c => c.querySelector('span')?.textContent.trim() === 'Physical Sneakers');
    if (card) card.innerHTML = '<span>Physical Sneakers</span><strong>Inventory → COGS</strong><p>ODTO purchases are USDC outflows that add inventory. Reusable stock stays in the crate pool; once allocated to a user vault or redeemed, its acquisition cost becomes fulfilled/committed COGS and replacement stock can be ordered.</p>';
  }

  function upsertInventoryQa() {
    const t = correctedFinance();
    state.recon = state.recon.filter(r => !['qa_safe_withdrawal','qa_inventory_units','qa_inventory_cost','qa_inventory_cogs'].includes(String(r[7] || '')));
    const stamp = new Date().toISOString().replace('T',' ').slice(0,19);
    const checks = [
      ['ODTO inventory units', `${t.paidUnits} units`, `${t.availableQty+t.userVaultQty+t.redeemedQty} units`, 'qa_inventory_units'],
      ['ODTO inventory cost roll-forward', usd(t.paidPurchaseCost), usd(t.reusableCost+t.userVaultCost+t.redeemedCost), 'qa_inventory_cost'],
      ['Inventory COGS', usd(t.inventoryCogs), usd(t.userVaultCost+t.redeemedCost), 'qa_inventory_cogs'],
      ['Safe withdrawal', usd(t.safeWithdrawal), usd(Math.max(0,Math.min(t.earnedRevenue-t.inventoryCogs,t.liquiditySurplus))), 'qa_safe_withdrawal']
    ];
    checks.reverse().forEach(([label, internal, observed, ref]) => {
      const matched = internal === observed;
      state.recon.unshift([stamp,label,internal,observed,matched?'0':'Check','Info',matched?'Matched':'Mismatch',ref]);
    });
    renderRecon();
    const cards = [...document.querySelectorAll('#reconciliation .metric-card')];
    const mismatches = state.recon.filter(r => r[6] === 'Mismatch').length;
    if (cards[0]) cards[0].querySelector('.metric-value').textContent = state.recon.length.toLocaleString();
    if (cards[1]) cards[1].querySelector('.metric-value').textContent = mismatches.toLocaleString();
  }

  function applyInventoryLayer() {
    addStyles();
    seedOdtoCashActivity();
    setupOdtoInventory();
    correctedFinance();
    updateRules();
    upsertInventoryQa();
    renderUsdc();
  }

  function bindReapply() {
    document.querySelectorAll('.tabs .tab').forEach(btn => {
      if (btn.dataset.inventoryBound) return;
      btn.dataset.inventoryBound = '1';
      btn.addEventListener('click', () => setTimeout(applyInventoryLayer, 0));
    });
    document.querySelectorAll('.payout-tab').forEach(btn => {
      if (btn.dataset.inventoryBound) return;
      btn.dataset.inventoryBound = '1';
      btn.addEventListener('click', () => setTimeout(applyInventoryLayer, 0));
    });
  }

  const previousRenderAll = renderAll;
  renderAll = function () {
    previousRenderAll();
    applyInventoryLayer();
    bindReapply();
  };

  applyInventoryLayer();
  bindReapply();
})();
