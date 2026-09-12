/* Importance-based visual hierarchy for Chosen Finance. Loaded last. */
(function () {
  const VERSION = 'hierarchy-v1';

  function cardById(id) {
    return document.getElementById(id)?.closest('.metric-card, .lulu-stat, .overview-summary > div') || null;
  }

  function cardByLabel(root, label) {
    if (!root) return null;
    return [...root.querySelectorAll('.metric-card, .lulu-stat, .overview-summary > div, .rule-card')].find(card => {
      const text = card.querySelector('.metric-label, span')?.textContent.trim();
      return text === label;
    }) || null;
  }

  function resetCards(root) {
    if (!root) return;
    root.querySelectorAll('.metric-card, .lulu-stat, .overview-summary > div, .rule-card').forEach(card => {
      card.classList.remove('hierarchy-hero','hierarchy-medium','hierarchy-small','hierarchy-alert','hierarchy-wide');
      card.style.order = '';
    });
  }

  function mark(card, cls, order) {
    if (!card) return;
    card.classList.add(cls);
    if (order != null) card.style.order = String(order);
  }

  function relabel(card, label, foot) {
    if (!card) return;
    const labelEl = card.querySelector('.metric-label');
    const footEl = card.querySelector('.metric-foot');
    if (labelEl && label) labelEl.textContent = label;
    if (footEl && foot) footEl.textContent = foot;
  }

  function addStyles() {
    if (document.getElementById('visualHierarchyStyles')) return;
    const s = document.createElement('style');
    s.id = 'visualHierarchyStyles';
    s.textContent = `
      /* Shared hierarchy */
      .hierarchy-hero{padding:20px!important;min-height:148px!important;display:flex!important;flex-direction:column;justify-content:space-between}
      .hierarchy-hero .metric-label,.hierarchy-hero>span{font-size:11px!important;font-weight:650;letter-spacing:.01em;color:#aeb9c6!important}
      .hierarchy-hero .metric-value,.hierarchy-hero>strong{font-size:31px!important;line-height:1!important;letter-spacing:-.045em}
      .hierarchy-hero .metric-foot,.hierarchy-hero>small{font-size:10.5px!important;line-height:1.35;margin-top:10px}
      .hierarchy-medium{padding:14px 15px!important;min-height:86px!important}
      .hierarchy-medium .metric-value,.hierarchy-medium>strong{font-size:21px!important;letter-spacing:-.03em}
      .hierarchy-small{padding:11px 12px!important;min-height:68px!important}
      .hierarchy-small .metric-value,.hierarchy-small>strong{font-size:17px!important;letter-spacing:-.02em}
      .hierarchy-small .metric-foot,.hierarchy-small>small{font-size:9.5px!important;line-height:1.3}
      .hierarchy-alert{border-color:rgba(255,107,114,.48)!important;box-shadow:inset 0 2px 0 var(--danger)!important}
      .hierarchy-wide{grid-column:span 6!important}

      /* Overview: two decision cards + a stacked explanation column. */
      #overviewSummary{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;grid-auto-rows:minmax(70px,auto);gap:10px!important;align-items:stretch}
      #overviewSummary .hierarchy-hero{grid-column:span 4;grid-row:span 3}
      #overviewSummary .hierarchy-medium{grid-column:span 4;min-height:70px!important}

      /* Revenue: profit + withdrawal dominate, revenue/reserve explain them. */
      #poolRevenue .finance-kpis{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;grid-auto-rows:minmax(74px,auto);gap:10px!important}
      #poolRevenue .finance-kpis .hierarchy-hero{grid-column:span 4;grid-row:span 2}
      #poolRevenue .finance-kpis .hierarchy-medium{grid-column:span 4;min-height:74px!important}

      /* ODTO: inventory and paid cash dominate; working inventory states stack beside them. */
      #odtoPayoutView .inventory-kpis{display:grid!important;grid-template-columns:1.28fr 1.08fr .82fr!important;grid-template-rows:repeat(3,minmax(70px,auto));gap:10px!important;align-items:stretch}
      #odtoPayoutView .inventory-kpis .odto-inventory-hero{grid-column:1;grid-row:1 / 4}
      #odtoPayoutView .inventory-kpis .odto-paid-hero{grid-column:2;grid-row:1 / 4}
      #odtoPayoutView .inventory-kpis .odto-open{grid-column:3;grid-row:1}
      #odtoPayoutView .inventory-kpis .odto-reusable{grid-column:3;grid-row:2}
      #odtoPayoutView .inventory-kpis .odto-vault{grid-column:3;grid-row:3}

      /* Stocks: margin is the decision metric, flows and reserve explain it. */
      #stocksPayoutView .finance-kpis{display:grid!important;grid-template-columns:1.2fr .92fr .82fr!important;grid-template-rows:repeat(2,minmax(78px,auto));gap:10px!important;align-items:stretch}
      #stocksPayoutView .stock-margin-hero{grid-column:1;grid-row:1 / 3}
      #stocksPayoutView .stock-inflow{grid-column:2;grid-row:1}
      #stocksPayoutView .stock-outflow{grid-column:2;grid-row:2}
      #stocksPayoutView .stock-reserve{grid-column:3;grid-row:1 / 3}

      /* Credits: circulating supply dominates; emissions/exposure stack beside it. */
      #creditsCoreView>.metric-grid{display:grid!important;grid-template-columns:1.35fr .8fr!important;grid-template-rows:repeat(2,minmax(78px,auto));gap:10px!important}
      #creditsCoreView>.metric-grid .credits-supply-hero{grid-column:1;grid-row:1 / 3}
      #creditsCoreView>.metric-grid .credits-emissions{grid-column:2;grid-row:1}
      #creditsCoreView>.metric-grid .credits-exposure{grid-column:2;grid-row:2}

      /* Lulu: burned + emitted dominate; remaining/max explain capacity. */
      #lulu .lulu-hero{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;grid-auto-rows:minmax(72px,auto);gap:10px!important}
      #lulu .lulu-hero .lulu-burned-hero{grid-column:span 5;grid-row:span 2}
      #lulu .lulu-hero .lulu-emitted-hero{grid-column:span 4;grid-row:span 2}
      #lulu .lulu-hero .lulu-support{grid-column:span 3;min-height:72px!important}
      #lulu>.metric-grid.compact{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:10px}
      #lulu>.metric-grid.compact .metric-card{min-height:68px!important}

      /* Reconciliation: exceptions dominate only when there is something to fix. */
      #reconciliation .metric-grid{display:grid!important;grid-template-columns:1.35fr .85fr .85fr!important;gap:10px!important}
      #reconciliation .metric-grid .hierarchy-alert{min-height:104px!important}

      /* Rules are reference material, not headline metrics. */
      #rules .rules-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:8px!important}
      #rules .rule-card{grid-column:span 4;padding:11px 12px!important;min-height:0!important}
      #rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      #rules .rule-card strong{font-size:15px!important}
      #rules .rule-card p{font-size:10px!important;line-height:1.35!important}

      /* Detailed evidence should visually sit below decision metrics. */
      .table-panel{margin-top:14px}
      .table-panel .panel-head h3{font-size:13px}
      .table-panel .panel-head p{font-size:10px;max-width:640px}
      .finance-grid .panel{min-height:0}
      .finance-grid .panel h3{font-size:13px}

      @media(max-width:1050px){
        #overviewSummary,#poolRevenue .finance-kpis,#lulu .lulu-hero{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto}
        #overviewSummary .hierarchy-hero,#overviewSummary .hierarchy-medium,#poolRevenue .finance-kpis .hierarchy-hero,#poolRevenue .finance-kpis .hierarchy-medium,#lulu .lulu-hero .lulu-burned-hero,#lulu .lulu-hero .lulu-emitted-hero,#lulu .lulu-hero .lulu-support{grid-column:auto!important;grid-row:auto!important}
        #odtoPayoutView .inventory-kpis,#stocksPayoutView .finance-kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:auto!important}
        #odtoPayoutView .inventory-kpis>* ,#stocksPayoutView .finance-kpis>*{grid-column:auto!important;grid-row:auto!important}
        #creditsCoreView>.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:auto!important}
        #creditsCoreView>.metric-grid>*{grid-column:auto!important;grid-row:auto!important}
        #rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      }
      @media(max-width:700px){
        #overviewSummary,#poolRevenue .finance-kpis,#odtoPayoutView .inventory-kpis,#stocksPayoutView .finance-kpis,#creditsCoreView>.metric-grid,#lulu .lulu-hero,#lulu>.metric-grid.compact,#reconciliation .metric-grid,#rules .rules-grid{grid-template-columns:1fr!important}
        #overviewSummary>* ,#poolRevenue .finance-kpis>* ,#odtoPayoutView .inventory-kpis>* ,#stocksPayoutView .finance-kpis>* ,#creditsCoreView>.metric-grid>* ,#lulu .lulu-hero>* ,#rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:1!important;grid-row:auto!important}
        .hierarchy-hero{min-height:116px!important}
        .hierarchy-hero .metric-value,.hierarchy-hero>strong{font-size:27px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function applyOverview() {
    const grid = document.getElementById('overviewSummary');
    if (!grid) return;
    resetCards(grid);
    const treasury = cardByLabel(grid, 'Treasury USDC');
    const revenue = cardById('ovRevenue');
    const payouts = cardById('ovPayouts');
    const reserve = cardById('ovReserve');
    const profit = cardById('ovProfit');
    mark(treasury, 'hierarchy-hero', 1);
    mark(profit, 'hierarchy-hero', 2);
    mark(revenue, 'hierarchy-medium', 3);
    mark(reserve, 'hierarchy-medium', 4);
    mark(payouts, 'hierarchy-medium', 5);
    relabel(payouts, 'Cash payouts');
  }

  function applyRevenue() {
    const grid = document.querySelector('#poolRevenue .finance-kpis');
    if (!grid) return;
    resetCards(grid);
    const operating = cardById('rpOperatingProfit');
    const withdrawable = cardById('rpWithdrawable');
    const earned = cardById('rpEarned');
    const reserve = cardById('rpReserve');
    mark(operating, 'hierarchy-hero', 1);
    mark(withdrawable, 'hierarchy-hero', 2);
    mark(earned, 'hierarchy-medium', 3);
    mark(reserve, 'hierarchy-medium', 4);
  }

  function applyOdto() {
    const grid = document.querySelector('#odtoPayoutView .inventory-kpis');
    if (!grid) return;
    resetCards(grid);
    [...grid.children].forEach(c => c.classList.remove('odto-inventory-hero','odto-paid-hero','odto-open','odto-reusable','odto-vault'));
    const inventory = cardByLabel(grid, 'Warehouse stock at cost') || cardByLabel(grid, 'ODTO inventory value');
    const reusable = cardByLabel(grid, 'Reusable crate inventory');
    const vault = cardByLabel(grid, 'User vault custody');
    const paid = cardByLabel(grid, 'Paid to ODTO');
    const open = cardByLabel(grid, 'Inbound / open AP') || cardByLabel(grid, 'Open ODTO payable');
    relabel(inventory, 'ODTO inventory value', 'Physical stock held at acquisition cost');
    relabel(open, 'Open ODTO payable', 'Ordered inventory not yet paid / received');
    mark(inventory, 'hierarchy-hero'); inventory?.classList.add('odto-inventory-hero');
    mark(paid, 'hierarchy-hero'); paid?.classList.add('odto-paid-hero');
    mark(open, 'hierarchy-small'); open?.classList.add('odto-open');
    mark(reusable, 'hierarchy-small'); reusable?.classList.add('odto-reusable');
    mark(vault, 'hierarchy-small'); vault?.classList.add('odto-vault');
  }

  function applyStocks() {
    const grid = document.querySelector('#stocksPayoutView .finance-kpis');
    if (!grid) return;
    resetCards(grid);
    [...grid.children].forEach(c => c.classList.remove('stock-margin-hero','stock-inflow','stock-outflow','stock-reserve'));
    const margin = cardById('stockMargin');
    const inflow = cardById('stockInflow');
    const outflow = cardById('stockOutflow');
    const reserve = cardById('stockReserve');
    mark(margin, 'hierarchy-hero'); margin?.classList.add('stock-margin-hero');
    mark(inflow, 'hierarchy-medium'); inflow?.classList.add('stock-inflow');
    mark(outflow, 'hierarchy-medium'); outflow?.classList.add('stock-outflow');
    mark(reserve, 'hierarchy-medium'); reserve?.classList.add('stock-reserve');
  }

  function applyCredits() {
    const grid = document.querySelector('#creditsCoreView > .metric-grid');
    if (!grid) return;
    resetCards(grid);
    [...grid.children].forEach(c => c.classList.remove('credits-supply-hero','credits-emissions','credits-exposure'));
    const supply = cardByLabel(grid, 'Credits in circulation');
    const emissions = cardById('newEmissionMetric');
    const exposure = cardById('creditsPendingBack');
    mark(supply, 'hierarchy-hero'); supply?.classList.add('credits-supply-hero');
    mark(emissions, 'hierarchy-medium'); emissions?.classList.add('credits-emissions');
    mark(exposure, 'hierarchy-medium'); exposure?.classList.add('credits-exposure');
  }

  function applyLulu() {
    const lulu = document.getElementById('lulu');
    const hero = lulu?.querySelector('.lulu-hero');
    if (!lulu || !hero) return;

    const emitted = cardById('luluEmitted');
    if (emitted && emitted.parentElement !== hero) hero.appendChild(emitted);

    resetCards(lulu);
    [...hero.children].forEach(c => c.classList.remove('lulu-burned-hero','lulu-emitted-hero','lulu-support'));
    const burned = cardById('luluBurned');
    const remaining = cardById('luluRemaining');
    const lifetime = cardByLabel(hero, 'Lifetime max emission');
    mark(burned, 'hierarchy-hero', 1); burned?.classList.add('lulu-burned-hero');
    mark(emitted, 'hierarchy-hero', 2); emitted?.classList.add('lulu-emitted-hero');
    mark(remaining, 'hierarchy-medium', 3); remaining?.classList.add('lulu-support');
    mark(lifetime, 'hierarchy-medium', 4); lifetime?.classList.add('lulu-support');

    const support = lulu.querySelector(':scope > .metric-grid.compact');
    support?.querySelectorAll('.metric-card').forEach(c => mark(c, 'hierarchy-small'));
  }

  function applyReconciliation() {
    const grid = document.querySelector('#reconciliation .metric-grid');
    if (!grid) return;
    resetCards(grid);
    const cards = [...grid.querySelectorAll('.metric-card')];
    const mismatch = cards.find(c => c.querySelector('.metric-label')?.textContent.trim() === 'Mismatches');
    const count = Number((mismatch?.querySelector('.metric-value')?.textContent || '0').replace(/[^0-9.-]/g,'')) || 0;
    cards.forEach(c => mark(c, 'hierarchy-small'));
    if (mismatch && count > 0) {
      mismatch.classList.remove('hierarchy-small');
      mark(mismatch, 'hierarchy-medium');
      mismatch.classList.add('hierarchy-alert');
      mismatch.style.order = '1';
    }
  }

  function applyRules() {
    const grid = document.querySelector('#rules .rules-grid');
    if (!grid) return;
    resetCards(grid);
    const wide = new Set(['Revenue & Reserves','Stock Packs','Physical Sneakers']);
    [...grid.querySelectorAll('.rule-card')].forEach(card => {
      const title = card.querySelector('span')?.textContent.trim();
      mark(card, 'hierarchy-small');
      if (wide.has(title)) card.classList.add('hierarchy-wide');
    });
  }

  function applyDetailWeight() {
    document.querySelectorAll('.table-panel').forEach(panel => panel.classList.add('hierarchy-detail'));
  }

  function applyAll() {
    addStyles();
    applyOverview();
    applyRevenue();
    applyOdto();
    applyStocks();
    applyCredits();
    applyLulu();
    applyReconciliation();
    applyRules();
    applyDetailWeight();
    document.body.dataset.visualHierarchy = VERSION;
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.tab,.payout-tab,.credit-program-tab,.segment,#refreshBtn')) {
      setTimeout(applyAll, 25);
      setTimeout(applyAll, 120);
    }
  });

  const previousRenderAll = window.renderAll;
  if (typeof previousRenderAll === 'function') {
    window.renderAll = function () {
      previousRenderAll();
      setTimeout(applyAll, 0);
    };
  }

  applyAll();
  setTimeout(applyAll, 100);
})();
