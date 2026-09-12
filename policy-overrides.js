/* Chosen treasury policy overrides: 365-day fallback always settles in Credits. */
(function () {
  const baseSyncPolicyCopy = syncPolicyCopy;
  const baseRenderPendingItems = renderPendingItems;
  const baseRenderCredits = renderCredits;
  const baseRenderAll = renderAll;
  const baseNewCreditEmissions = newCreditEmissions;

  function projectedExpiryFallbackCredits() {
    return state.pendingItems
      .filter(x => x.status === 'Vaulted')
      .reduce((sum, x) => sum + pendingLiquidationAmount(x), 0);
  }

  function addRuleHistoryOnce() {
    if (!state.rules.some(r => r[1] === '365-day auto fallback')) {
      state.rules.unshift([
        '2026-09-12 13:34:00',
        '365-day auto fallback',
        'Funding-asset dependent / no fallback',
        'Credits only · 70% × min(initial FMV, live FMV)',
        'admin',
        'Close unresolved year-old claims without creating a USDC liquidity drain'
      ]);
    }
  }

  function settleExpiredItems() {
    const now = new Date();
    const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + now.toTimeString().slice(0, 8);
    state.pendingItems.forEach(item => {
      if (item.status !== 'Vaulted' || item.daysLeft > 0) return;
      const amount = pendingLiquidationAmount(item);
      const ref = `fallback_${item.ref}`;
      const detail = `365-day auto fallback · originally ${item.paidWith} · 70% × lower of initial/live FMV`;
      state.creditActivity.unshift([ts, '365-Day Fallback', 'In', amount, detail, item.user, ref, 'Confirmed']);
      state.credits.unshift([ts, item.user, '365-Day Fallback', '+' + amount.toFixed(2), '—', detail, ref, 'Confirmed']);
      item.status = 'Fallback Credits';
    });
  }

  newCreditEmissions = function () {
    return baseNewCreditEmissions() + sumRows(state.creditActivity, '365-Day Fallback', 'In');
  };

  syncPolicyCopy = function () {
    baseSyncPolicyCopy();
    addRuleHistoryOnce();

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
      const fallback = findRule('365-Day Fallback');
      grid.insertBefore(pending, fallback || null);
    } else if (pending) {
      pending.innerHTML = '<span>Pending Liquidation</span><strong>70% capped</strong><p>During the 365-day window: 70% × min(initial prize FMV, current live FMV).</p>';
    }

    const fallback = findRule('365-Day Fallback');
    if (fallback) fallback.innerHTML = '<span>365-Day Fallback</span><strong>Credits only</strong><p>If still unresolved at expiry, the item auto-settles in Credits at the same capped 70% basis, regardless of original funding asset.</p>';

    const windowCard = findRule('365-Day Window');
    if (windowCard) windowCard.innerHTML = '<span>365-Day Window</span><strong>Auto Credits</strong><p>At expiry the physical claim closes and the fallback is issued in Credits. No USDC fallback is created.</p>';

    const market = findRule('Market Protection');
    if (market) market.innerHTML = '<span>Market Protection</span><strong>Lower value wins</strong><p>Market upside is capped at initial prize FMV; market downside lowers the liquidation/fallback basis.</p>';

    const note = document.querySelector('#rules .rule-note');
    if (note) note.innerHTML = '<b>Accounting boundary:</b> during the 365-day window, a vaulted prize may be listed, physically redeemed, or liquidated at 70% × min(initial FMV, live FMV). Physical redemption realizes actual acquisition cost as USDC outflow. If the item is still unresolved at expiry, the item claim closes and the same capped fallback amount is issued in <b>Credits only</b>—even if the original crate was purchased with USDC.';

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(x => x.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'These prizes are still theoretical. Users have 365 days to list, redeem, or liquidate them. Unresolved items then auto-fallback into Credits.';
    }

    const creditsMetric = document.getElementById('creditsPendingBack')?.closest('.metric-card');
    if (creditsMetric) {
      creditsMetric.querySelector('.metric-label').textContent = '365-Day Credit Fallback';
      creditsMetric.querySelector('.metric-foot').textContent = 'Projected Credits if every current vault reaches expiry';
    }

    const activityMetric = document.getElementById('pendingCreditMetric')?.closest('.metric-card');
    if (activityMetric) {
      activityMetric.querySelector('.metric-label').textContent = 'Pending Credit Liquidation';
      activityMetric.querySelector('.metric-foot').textContent = 'Credits-funded items during the 365-day window';
    }

    const settlePanel = [...document.querySelectorAll('#credits .panel h3')]
      .find(x => x.textContent.trim() === 'How Credits settle')?.closest('.panel');
    if (settlePanel) {
      const stack = settlePanel.querySelector('.info-stack');
      if (stack) stack.innerHTML = '<div><b>Credit Back</b><span>Immediate Credits-funded settlement at 80% of the prize\'s live FMV.</span></div><div><b>Vaulted prize</b><span>No immediate settlement. The user has 365 days to list, redeem, or liquidate.</span></div><div><b>Pending liquidation</b><span>During the claim window: 70% × the lower of initial prize FMV or current live FMV. Upside is capped; downside follows the market.</span></div><div><b>Physical redemption</b><span>Chosen records the actual product acquisition cost as USDC outflow.</span></div><div><b>365-day fallback</b><span>If still unresolved at expiry, the claim closes and the fallback is issued in Credits—regardless of whether the crate originally used USDC or Credits.</span></div>';
    }

    document.querySelectorAll('#creditActivityType option').forEach(o => {
      if (o.textContent.trim() === 'Expiry Credit Back') {
        o.textContent = '365-Day Fallback';
        o.value = '365-Day Fallback';
      }
    });
    const sourceSelect = document.getElementById('creditsSource');
    if (sourceSelect && ![...sourceSelect.options].some(o => o.value === '365-Day Fallback')) {
      const option = document.createElement('option');
      option.value = '365-Day Fallback';
      option.textContent = '365-Day Fallback';
      sourceSelect.appendChild(option);
    }

    document.querySelectorAll('.mix-row').forEach(row => {
      const title = row.querySelector('strong')?.textContent.trim();
      if (title === 'Vaulted item') {
        const span = row.querySelector('span');
        if (span) span.textContent = 'Creates time-limited liquidation exposure; unresolved items auto-fallback into Credits after 365 days.';
      }
    });
  };

  renderPendingItems = function () {
    const active = state.pendingItems.filter(x => x.status === 'Vaulted');
    setText('pendingItemCount', active.length.toLocaleString());
    setText('pendingCreditBackExposure', credits(pendingCreditLiquidation()) + ' cr');
    setText('pendingUsdcFallback', money(pendingUsdcLiquidation()));
    setText('expiryFallbackExposure', credits(projectedExpiryFallbackCredits()) + ' cr');
    setText('pendingFulfillmentReserve', money(pendingReserve()));

    const head = document.querySelector('#pendingItemsTable')?.closest('table')?.querySelector('thead tr');
    if (head) head.innerHTML = '<th>Opened</th><th>User</th><th>Item</th><th>Paid with</th><th>Entry</th><th>Initial FMV</th><th>Live FMV</th><th>70% liquidation</th><th>365-day fallback</th><th>Expected cost</th><th>Days left</th><th>Status</th>';

    document.getElementById('pendingItemsTable').innerHTML = active.map(x => {
      const entry = x.paidWith === 'Credits' ? `${credits(x.entry)} cr` : money(x.entry);
      const liquid = pendingLiquidationAmount(x);
      const liquidation = x.paidWith === 'Credits' ? `${credits(liquid)} cr` : money(liquid);
      const trend = x.marketFmv > x.initialFmv ? 'Capped at initial' : x.marketFmv < x.initialFmv ? 'Uses lower market' : 'No change';
      return `<tr><td class="mono">${x.opened}</td><td class="mono">${x.user}</td><td>${x.item}</td><td>${badge(x.paidWith)}</td><td>${entry}</td><td>${money(x.initialFmv)}</td><td>${money(x.marketFmv)}</td><td>${liquidation}<small class="table-sub">${trend}</small></td><td>${credits(liquid)} cr<small class="table-sub">Always Credits at expiry</small></td><td>${money(x.expectedCost)}</td><td>${x.daysLeft}</td><td>${badge(x.status)}</td></tr>`;
    }).join('');

    return active.map(x => [x.opened, x.user, x.item, x.paidWith, x.entry, x.initialFmv, x.marketFmv, pendingLiquidationAmount(x), pendingLiquidationAmount(x), x.expectedCost, x.daysLeft, x.status, x.ref]);
  };

  renderCredits = function () {
    const rows = baseRenderCredits();
    setText('creditsPendingBack', credits(projectedExpiryFallbackCredits()));

    const raw = [
      ['Crate Bonus', sumRows(state.creditActivity, 'Crate Bonus', 'In')],
      ['Lulu', sumRows(state.creditActivity, 'Lulu Emission', 'In')],
      ['Promotional', sumRows(state.creditActivity, 'Promotional Run', 'In')],
      ['365-Day Fallback', sumRows(state.creditActivity, '365-Day Fallback', 'In')]
    ];
    const total = raw.reduce((a, x) => a + x[1], 0) || 1;
    const bars = document.getElementById('creditSourceBars');
    if (bars) bars.innerHTML = raw.map(([name, value]) => {
      const p = Math.round(value / total * 100);
      return `<div class="hbar-row"><div class="hbar-label"><b>${name}</b><span>${credits(value)} cr · ${p}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${p}%"></div></div></div>`;
    }).join('');
    return rows;
  };

  renderAll = function () {
    settleExpiredItems();
    baseRenderAll();
  };

  const oldExportSection = exportSection;
  exportSection = function (kind) {
    if (kind !== 'pending-items') return oldExportSection(kind);
    downloadCsv(
      'pending-items',
      ['Opened','User','Item','Paid with','Entry','Initial FMV','Live FMV','70% liquidation','365-day fallback Credits','Expected cost','Days left','Status','Reference'],
      renderPendingItems()
    );
  };

  renderAll();
})();
