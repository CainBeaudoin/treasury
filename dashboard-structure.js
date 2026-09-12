/* Final information architecture + executive overview layer. Loaded after finance-live-data.js. */
(function () {
  const TAB_ORDER = [
    ['overview', 'Overview'],
    ['activity', 'Activity'],
    ['poolRevenue', 'Revenue Pool'],
    ['supplierPayouts', 'Supplier Payouts'],
    ['credits', 'Credits'],
    ['reconciliation', 'Reconciliation'],
    ['lulu', 'Lulu'],
    ['rules', 'Rules']
  ];

  function moneyText(value) {
    return '$' + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function supplierTotals() {
    const rows = state.supplierPayouts || [];
    const paid = rows.filter(r => r[6] === 'Paid').reduce((sum, r) => sum + Number(r[4] || 0), 0);
    const pending = rows.filter(r => r[6] === 'Pending').reduce((sum, r) => sum + Number(r[4] || 0), 0);
    const awaiting = rows.filter(r => r[6] === 'Awaiting Invoice').reduce((sum, r) => sum + Number(r[4] || 0), 0);
    return { paid, open: pending + awaiting, committed: paid + pending + awaiting };
  }

  function syncNavigation() {
    const nav = document.querySelector('.tabs');
    if (!nav) return;

    TAB_ORDER.forEach(([id, label]) => {
      const button = [...nav.querySelectorAll('.tab')].find(b => b.dataset.tab === id);
      if (!button) return;
      button.textContent = label;
      nav.appendChild(button);
    });
  }

  function addStyles() {
    if (document.getElementById('dashboardStructureStyles')) return;
    const style = document.createElement('style');
    style.id = 'dashboardStructureStyles';
    style.textContent = `
      #overviewProfitStrip.executive-summary{grid-template-columns:repeat(6,minmax(0,1fr));margin:14px 0 20px}
      #overviewProfitStrip.executive-summary>div{min-width:0}
      #overviewProfitStrip.executive-summary strong{font-size:18px;letter-spacing:-.02em}
      #overviewProfitStrip.executive-summary .primary{box-shadow:inset 0 2px 0 var(--blue)}
      #overviewProfitStrip.executive-summary .profit strong{color:var(--blue)}
      .overview-summary-kicker{margin:4px 0 10px;font-size:11px;color:var(--muted);line-height:1.45}
      @media(max-width:1250px){#overviewProfitStrip.executive-summary{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:760px){#overviewProfitStrip.executive-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:520px){#overviewProfitStrip.executive-summary{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function syncOverview() {
    const overview = document.getElementById('overview');
    if (!overview) return;

    const intro = overview.querySelector('.section-intro p');
    if (intro) intro.textContent = 'Executive view of treasury cash, quarterly revenue, supplier obligations, reserves, and distributable profit.';

    const metrics = overview.querySelector('.overview-metrics');
    if (!metrics) return;

    let strip = document.getElementById('overviewProfitStrip');
    const oldRevenue = document.getElementById('overviewPoolRevenue')?.textContent || document.getElementById('poolEarnedRevenue')?.textContent || '$0.00';
    const oldPaid = document.getElementById('overviewSupplierPaid')?.textContent || document.getElementById('supplierPaidModel')?.textContent || '$0.00';
    const oldReserve = document.getElementById('overviewReserveHeld')?.textContent || document.getElementById('poolRequiredReserve')?.textContent || '$0.00';
    const oldWithdrawable = document.getElementById('overviewWithdrawableProfit')?.textContent || document.getElementById('poolWithdrawable')?.textContent || '$0.00';

    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'overviewProfitStrip';
      metrics.insertAdjacentElement('afterend', strip);
    }

    if (!strip.dataset.executiveSummary) {
      strip.dataset.executiveSummary = 'true';
      strip.className = 'overview-profit-strip executive-summary';
      strip.innerHTML = `
        <div class="primary"><span>Q3 earned revenue</span><strong id="overviewPoolRevenue">${oldRevenue}</strong></div>
        <div><span>Supplier paid</span><strong id="overviewSupplierPaid">${oldPaid}</strong></div>
        <div><span>Supplier open AP</span><strong id="overviewSupplierOpen">$0.00</strong></div>
        <div><span>Total supplier committed</span><strong id="overviewSupplierCommitted">$0.00</strong></div>
        <div><span>Required reserve</span><strong id="overviewReserveHeld">${oldReserve}</strong></div>
        <div class="primary profit"><span>Withdrawable Q3 profit</span><strong id="overviewWithdrawableProfit">${oldWithdrawable}</strong></div>`;
    }

    const supplier = supplierTotals();
    setText('overviewSupplierPaid', moneyText(supplier.paid));
    setText('overviewSupplierOpen', moneyText(supplier.open));
    setText('overviewSupplierCommitted', moneyText(supplier.committed));

    const revenue = document.getElementById('poolEarnedRevenue')?.textContent;
    const reserve = document.getElementById('poolRequiredReserve')?.textContent;
    const withdrawable = document.getElementById('poolWithdrawable')?.textContent;
    if (revenue) setText('overviewPoolRevenue', revenue);
    if (reserve) setText('overviewReserveHeld', reserve);
    if (withdrawable) setText('overviewWithdrawableProfit', withdrawable);
  }

  function syncPageNames() {
    const poolPanel = document.getElementById('poolRevenue');
    if (poolPanel) {
      const h2 = poolPanel.querySelector('.section-intro h2');
      const p = poolPanel.querySelector('.section-intro p');
      if (h2) h2.textContent = 'Revenue Pool';
      if (p) p.textContent = 'Quarterly earned revenue, required reserves, supplier obligations, and the amount that can safely be distributed as profit.';
    }

    document.querySelectorAll('#rules .rule-card').forEach(card => {
      const label = card.querySelector('span');
      if (label?.textContent.trim() === 'Pool Revenue') label.textContent = 'Revenue Pool';
    });
  }

  function syncStructure() {
    addStyles();
    syncNavigation();
    syncPageNames();
    syncOverview();
  }

  const previousRenderAll = renderAll;
  renderAll = function () {
    previousRenderAll();
    syncStructure();
  };

  syncStructure();
})();
