/* Compact importance-based visual hierarchy for Chosen Finance. Loaded last. */
(function () {
  const VERSION = 'hierarchy-v2-compact';

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

  function numericText(el) {
    const raw = el?.querySelector('.metric-value, strong')?.textContent || '';
    const n = Number(String(raw).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  function nearlyEqual(a, b, epsilon = 0.005) {
    return a != null && b != null && Math.abs(a - b) <= epsilon;
  }

  function resetCards(root) {
    if (!root) return;
    root.querySelectorAll('.metric-card, .lulu-stat, .overview-summary > div, .rule-card').forEach(card => {
      card.classList.remove(
        'hierarchy-hero','hierarchy-medium','hierarchy-small','hierarchy-alert','hierarchy-wide',
        'hierarchy-hidden','overview-treasury','overview-profit','overview-support',
        'revenue-profit-hero','revenue-support',
        'odto-inventory-hero','odto-paid','odto-open','odto-reusable','odto-vault',
        'stock-margin-hero','stock-inflow','stock-outflow','stock-reserve',
        'credits-supply-hero','credits-emissions','credits-exposure',
        'lulu-emitted-hero','lulu-support'
      );
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
    if (footEl && foot !== undefined) footEl.textContent = foot;
  }

  function addStyles() {
    const old = document.getElementById('visualHierarchyStyles');
    if (old) old.remove();
    const s = document.createElement('style');
    s.id = 'visualHierarchyStyles';
    s.textContent = `
      /* The large metric is wider, not taller. This keeps hierarchy without dead space. */
      .hierarchy-hero{
        padding:14px 18px!important;
        min-height:88px!important;
        display:grid!important;
        grid-template-columns:minmax(135px,.8fr) auto minmax(170px,1fr);
        align-items:center;
        column-gap:18px;
      }
      .hierarchy-hero .metric-label,.hierarchy-hero>span{
        font-size:11px!important;font-weight:650;letter-spacing:.01em;color:#aeb9c6!important;margin:0!important
      }
      .hierarchy-hero .metric-value,.hierarchy-hero>strong{
        font-size:30px!important;line-height:1!important;letter-spacing:-.045em;white-space:nowrap;margin:0!important
      }
      .hierarchy-hero .metric-foot,.hierarchy-hero>small{
        font-size:10px!important;line-height:1.35;margin:0!important;text-align:right;color:var(--muted)
      }
      .hierarchy-medium{padding:12px 14px!important;min-height:72px!important}
      .hierarchy-medium .metric-value,.hierarchy-medium>strong{font-size:20px!important;letter-spacing:-.03em}
      .hierarchy-small{padding:10px 12px!important;min-height:62px!important}
      .hierarchy-small .metric-value,.hierarchy-small>strong{font-size:17px!important;letter-spacing:-.02em}
      .hierarchy-small .metric-foot,.hierarchy-small>small{font-size:9.5px!important;line-height:1.25}
      .hierarchy-alert{border-color:rgba(255,107,114,.48)!important;box-shadow:inset 0 2px 0 var(--danger)!important}
      .hierarchy-wide{grid-column:span 6!important}
      .hierarchy-hidden{display:none!important}

      /* Overview: two compact headline decisions, then three explanatory cards. */
      #overviewSummary{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #overviewSummary .overview-treasury,#overviewSummary .overview-profit{grid-column:span 6}
      #overviewSummary .overview-support{grid-column:span 4}

      /* Revenue: one headline profit metric. Supporting numbers sit directly underneath. */
      #poolRevenue .finance-kpis{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #poolRevenue .revenue-profit-hero{grid-column:1 / -1}
      #poolRevenue .revenue-support{grid-column:span 4}
      #poolRevenue .finance-kpis .revenue-support:nth-last-child(2):first-child,
      #poolRevenue .finance-kpis .revenue-support:nth-last-child(2):first-child~.revenue-support{grid-column:span 6}

      /* ODTO: inventory is the balance-sheet headline, then payout/inventory states beneath it. */
      #odtoPayoutView .inventory-kpis{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #odtoPayoutView .odto-inventory-hero{grid-column:1 / -1}
      #odtoPayoutView .odto-paid,#odtoPayoutView .odto-open,#odtoPayoutView .odto-reusable,#odtoPayoutView .odto-vault{grid-column:span 3}

      /* Stocks: margin is the headline. Cash mechanics explain it in a single row. */
      #stocksPayoutView .finance-kpis{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #stocksPayoutView .stock-margin-hero{grid-column:1 / -1}
      #stocksPayoutView .stock-inflow,#stocksPayoutView .stock-outflow,#stocksPayoutView .stock-reserve{grid-column:span 4}

      /* Credits: circulating supply is the headline; emission/exposure explain movement. */
      #creditsCoreView>.metric-grid{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #creditsCoreView>.metric-grid .credits-supply-hero{grid-column:1 / -1}
      #creditsCoreView>.metric-grid .credits-emissions,#creditsCoreView>.metric-grid .credits-exposure{grid-column:span 6}

      /* Lulu: emitted Credits is the headline; burn/capacity stats sit underneath. */
      #lulu .lulu-hero{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:10px!important;
        align-items:stretch
      }
      #lulu .lulu-hero .lulu-emitted-hero{grid-column:1 / -1}
      #lulu .lulu-hero .lulu-support{grid-column:span 4}
      #lulu>.metric-grid.compact{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:10px}
      #lulu>.metric-grid.compact .metric-card{min-height:62px!important}

      /* Reconciliation remains compact; exceptions get stronger styling, not excess height. */
      #reconciliation .metric-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
      #reconciliation .metric-grid .hierarchy-alert{min-height:72px!important}

      /* Rules are reference material, not headline metrics. */
      #rules .rules-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:8px!important}
      #rules .rule-card{grid-column:span 4;padding:10px 12px!important;min-height:0!important}
      #rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      #rules .rule-card strong{font-size:15px!important}
      #rules .rule-card p{font-size:10px!important;line-height:1.35!important}

      /* Evidence stays visually below the decision metrics. */
      .table-panel{margin-top:14px}
      .table-panel .panel-head h3{font-size:13px}
      .table-panel .panel-head p{font-size:10px;max-width:640px}
      .finance-grid .panel{min-height:0}
      .finance-grid .panel h3{font-size:13px}

      @media(max-width:1050px){
        #overviewSummary .overview-treasury,#overviewSummary .overview-profit{grid-column:span 6}
        #overviewSummary .overview-support{grid-column:span 6}
        #poolRevenue .revenue-support{grid-column:span 6}
        #odtoPayoutView .odto-paid,#odtoPayoutView .odto-open,#odtoPayoutView .odto-reusable,#odtoPayoutView .odto-vault{grid-column:span 6}
        #stocksPayoutView .stock-inflow,#stocksPayoutView .stock-outflow,#stocksPayoutView .stock-reserve{grid-column:span 6}
        #lulu .lulu-hero .lulu-support{grid-column:span 6}
        #rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      }
      @media(max-width:700px){
        #overviewSummary,#poolRevenue .finance-kpis,#odtoPayoutView .inventory-kpis,#stocksPayoutView .finance-kpis,#creditsCoreView>.metric-grid,#lulu .lulu-hero,#lulu>.metric-grid.compact,#reconciliation .metric-grid,#rules .rules-grid{grid-template-columns:1fr!important}
        #overviewSummary>* ,#poolRevenue .finance-kpis>* ,#odtoPayoutView .inventory-kpis>* ,#stocksPayoutView .finance-kpis>* ,#creditsCoreView>.metric-grid>* ,#lulu .lulu-hero>* ,#rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:1!important;grid-row:auto!important}
        .hierarchy-hero{grid-template-columns:1fr!important;row-gap:6px!important;min-height:0!important;padding:14px!important}
        .hierarchy-hero .metric-value,.hierarchy-hero>strong{font-size:27px!important}
        .hierarchy-hero .metric-foot,.hierarchy-hero>small{text-align:left!important}
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

    mark(treasury, 'hierarchy-hero', 1); treasury?.classList.add('overview-treasury');
    mark(profit, 'hierarchy-hero', 2); profit?.classList.add('overview-profit');
    mark(revenue, 'hierarchy-medium', 3); revenue?.classList.add('overview-support');
    mark(reserve, 'hierarchy-medium', 4); reserve?.classList.add('overview-support');
    mark(payouts, 'hierarchy-medium', 5); payouts?.classList.add('overview-support');
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
    const opValue = numericText(operating);
    const withdrawableValue = numericText(withdrawable);
    const sameProfit = nearlyEqual(opValue, withdrawableValue);

    /* Safe withdrawal is the actual decision metric. If liquidity does not constrain it,
       operating profit is the same number and should not take a second card. */
    mark(withdrawable, 'hierarchy-hero', 1);
    withdrawable?.classList.add('revenue-profit-hero');
    if (sameProfit) {
      operating?.classList.add('hierarchy-hidden');
      relabel(withdrawable, 'Withdrawable operating profit', 'Operating profit and safe withdrawal are currently the same');
      mark(earned, 'hierarchy-medium', 2); earned?.classList.add('revenue-support');
      mark(reserve, 'hierarchy-medium', 3); reserve?.classList.add('revenue-support');
    } else {
      relabel(withdrawable, 'Safe withdrawal', 'Capped by both profit and available treasury liquidity');
      mark(operating, 'hierarchy-medium', 2); operating?.classList.add('revenue-support');
      mark(earned, 'hierarchy-medium', 3); earned?.classList.add('revenue-support');
      mark(reserve, 'hierarchy-medium', 4); reserve?.classList.add('revenue-support');
    }
  }

  function applyOdto() {
    const grid = document.querySelector('#odtoPayoutView .inventory-kpis');
    if (!grid) return;
    resetCards(grid);
    const inventory = cardByLabel(grid, 'Warehouse stock at cost') || cardByLabel(grid, 'ODTO inventory value');
    const reusable = cardByLabel(grid, 'Reusable crate inventory');
    const vault = cardByLabel(grid, 'User vault custody');
    const paid = cardByLabel(grid, 'Paid to ODTO');
    const open = cardByLabel(grid, 'Inbound / open AP') || cardByLabel(grid, 'Open ODTO payable');

    relabel(inventory, 'ODTO inventory value', 'Physical stock held at acquisition cost');
    relabel(open, 'Open ODTO payable', 'Ordered inventory not yet paid / received');
    mark(inventory, 'hierarchy-hero', 1); inventory?.classList.add('odto-inventory-hero');
    mark(paid, 'hierarchy-medium', 2); paid?.classList.add('odto-paid');
    mark(open, 'hierarchy-medium', 3); open?.classList.add('odto-open');
    mark(reusable, 'hierarchy-small', 4); reusable?.classList.add('odto-reusable');
    mark(vault, 'hierarchy-small', 5); vault?.classList.add('odto-vault');
  }

  function applyStocks() {
    const grid = document.querySelector('#stocksPayoutView .finance-kpis');
    if (!grid) return;
    resetCards(grid);
    const margin = cardById('stockMargin');
    const inflow = cardById('stockInflow');
    const outflow = cardById('stockOutflow');
    const reserve = cardById('stockReserve');
    mark(margin, 'hierarchy-hero', 1); margin?.classList.add('stock-margin-hero');
    mark(inflow, 'hierarchy-medium', 2); inflow?.classList.add('stock-inflow');
    mark(outflow, 'hierarchy-medium', 3); outflow?.classList.add('stock-outflow');
    mark(reserve, 'hierarchy-medium', 4); reserve?.classList.add('stock-reserve');
  }

  function applyCredits() {
    const grid = document.querySelector('#creditsCoreView > .metric-grid');
    if (!grid) return;
    resetCards(grid);
    const supply = cardByLabel(grid, 'Credits in circulation');
    const emissions = cardById('newEmissionMetric');
    const exposure = cardById('creditsPendingBack');
    mark(supply, 'hierarchy-hero', 1); supply?.classList.add('credits-supply-hero');
    mark(emissions, 'hierarchy-medium', 2); emissions?.classList.add('credits-emissions');
    mark(exposure, 'hierarchy-medium', 3); exposure?.classList.add('credits-exposure');
  }

  function applyLulu() {
    const lulu = document.getElementById('lulu');
    const hero = lulu?.querySelector('.lulu-hero');
    if (!lulu || !hero) return;

    const emitted = cardById('luluEmitted');
    if (emitted && emitted.parentElement !== hero) hero.appendChild(emitted);

    resetCards(lulu);
    const burned = cardById('luluBurned');
    const remaining = cardById('luluRemaining');
    const lifetime = cardByLabel(hero, 'Lifetime max emission');
    const original = cardByLabel(hero, 'Original supply');

    /* Original supply is already implicit in the progress bar and lifetime capacity. */
    original?.classList.add('hierarchy-hidden');
    mark(emitted, 'hierarchy-hero', 1); emitted?.classList.add('lulu-emitted-hero');
    mark(burned, 'hierarchy-medium', 2); burned?.classList.add('lulu-support');
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
      mark(mismatch, 'hierarchy-medium', 1);
      mismatch.classList.add('hierarchy-alert');
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
