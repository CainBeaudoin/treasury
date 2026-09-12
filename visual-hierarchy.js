/* Compact importance hierarchy for Chosen Finance. Loaded last. */
(function () {
  const VERSION = 'hierarchy-v3-compact';
  const CARD_SELECTOR = '.metric-card, .lulu-stat, .overview-summary > div, .rule-card';

  const cardById = id => document.getElementById(id)?.closest('.metric-card, .lulu-stat, .overview-summary > div') || null;
  const cardByLabel = (root, label) => root ? [...root.querySelectorAll(CARD_SELECTOR)].find(card => card.querySelector('.metric-label, span')?.textContent.trim() === label) || null : null;
  const valueOf = card => {
    const n = Number(String(card?.querySelector('.metric-value, strong')?.textContent || '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  };
  const equal = (a,b) => a != null && b != null && Math.abs(a-b) <= .005;

  function reset(root) {
    if (!root) return;
    root.querySelectorAll(CARD_SELECTOR).forEach(card => {
      [...card.classList].filter(x => x.startsWith('hierarchy-') || x.startsWith('overview-') || x.startsWith('revenue-') || x.startsWith('odto-') || x.startsWith('stock-') || x.startsWith('credits-') || x.startsWith('lulu-')).forEach(x => card.classList.remove(x));
      card.style.order = '';
    });
    root.classList?.remove('revenue-consolidated');
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
    document.getElementById('visualHierarchyStyles')?.remove();
    const s = document.createElement('style');
    s.id = 'visualHierarchyStyles';
    s.textContent = `
      /* Headline metrics are wide rather than tall. */
      .hierarchy-hero{padding:14px 18px!important;min-height:86px!important;display:grid!important;grid-template-columns:minmax(135px,.75fr) auto minmax(180px,1fr);align-items:center;column-gap:18px}
      .hierarchy-hero .metric-label,.hierarchy-hero>span{font-size:11px!important;font-weight:650;color:#aeb9c6!important;margin:0!important}
      .hierarchy-hero .metric-value,.hierarchy-hero>strong{font-size:30px!important;line-height:1!important;letter-spacing:-.045em;white-space:nowrap;margin:0!important}
      .hierarchy-hero .metric-foot,.hierarchy-hero>small{font-size:10px!important;line-height:1.3;margin:0!important;text-align:right;color:var(--muted)}
      .hierarchy-medium{padding:11px 13px!important;min-height:70px!important}
      .hierarchy-medium .metric-value,.hierarchy-medium>strong{font-size:20px!important;letter-spacing:-.03em}
      .hierarchy-small{padding:10px 12px!important;min-height:60px!important}
      .hierarchy-small .metric-value,.hierarchy-small>strong{font-size:17px!important;letter-spacing:-.02em}
      .hierarchy-small .metric-foot,.hierarchy-small>small{font-size:9.5px!important;line-height:1.25}
      .hierarchy-alert{border-color:rgba(255,107,114,.48)!important;box-shadow:inset 0 2px 0 var(--danger)!important}
      .hierarchy-wide{grid-column:span 6!important}.hierarchy-hidden{display:none!important}

      /* Overview: two compact headline cards, three supporting cards below. */
      #overviewSummary{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #overviewSummary .overview-headline{grid-column:span 6}
      #overviewSummary .overview-support{grid-column:span 4}

      /* Revenue: one profit headline. When profit == safe withdrawal, the duplicate card disappears. */
      #poolRevenue .finance-kpis{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #poolRevenue .revenue-profit-hero{grid-column:1/-1}
      #poolRevenue .revenue-support{grid-column:span 4}
      #poolRevenue .finance-kpis.revenue-consolidated .revenue-support{grid-column:span 6}

      /* ODTO: inventory headline, then four concise supporting states. */
      #odtoPayoutView .inventory-kpis{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #odtoPayoutView .odto-inventory-hero{grid-column:1/-1}
      #odtoPayoutView .odto-support{grid-column:span 3}

      /* Stocks: margin headline, cash mechanics directly underneath. */
      #stocksPayoutView .finance-kpis{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #stocksPayoutView .stock-margin-hero{grid-column:1/-1}
      #stocksPayoutView .stock-support{grid-column:span 4}

      /* Credits: supply headline, two explanatory metrics below. */
      #creditsCoreView>.metric-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #creditsCoreView>.metric-grid .credits-supply-hero{grid-column:1/-1}
      #creditsCoreView>.metric-grid .credits-support{grid-column:span 6}

      /* Lulu: Credit emission headline, burn/capacity stats below. */
      #lulu .lulu-hero{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:10px!important;align-items:stretch}
      #lulu .lulu-hero .lulu-emitted-hero{grid-column:1/-1}
      #lulu .lulu-hero .lulu-support{grid-column:span 4}
      #lulu>.metric-grid.compact{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:10px}
      #lulu>.metric-grid.compact .metric-card{min-height:60px!important}

      #reconciliation .metric-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
      #reconciliation .metric-grid .hierarchy-alert{min-height:70px!important}

      #rules .rules-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:8px!important}
      #rules .rule-card{grid-column:span 4;padding:10px 12px!important;min-height:0!important}
      #rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      #rules .rule-card strong{font-size:15px!important}#rules .rule-card p{font-size:10px!important;line-height:1.35!important}

      .table-panel{margin-top:14px}.table-panel .panel-head h3{font-size:13px}.table-panel .panel-head p{font-size:10px;max-width:640px}.finance-grid .panel{min-height:0}.finance-grid .panel h3{font-size:13px}

      @media(max-width:1050px){
        #overviewSummary .overview-support,#poolRevenue .revenue-support,#odtoPayoutView .odto-support,#stocksPayoutView .stock-support,#lulu .lulu-hero .lulu-support{grid-column:span 6}
        #rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:span 6!important}
      }
      @media(max-width:700px){
        #overviewSummary,#poolRevenue .finance-kpis,#odtoPayoutView .inventory-kpis,#stocksPayoutView .finance-kpis,#creditsCoreView>.metric-grid,#lulu .lulu-hero,#lulu>.metric-grid.compact,#reconciliation .metric-grid,#rules .rules-grid{grid-template-columns:1fr!important}
        #overviewSummary>*,#poolRevenue .finance-kpis>*,#odtoPayoutView .inventory-kpis>*,#stocksPayoutView .finance-kpis>*,#creditsCoreView>.metric-grid>*,#lulu .lulu-hero>*,#rules .rule-card,#rules .rule-card.hierarchy-wide{grid-column:1!important;grid-row:auto!important}
        .hierarchy-hero{grid-template-columns:1fr!important;row-gap:5px!important;min-height:0!important;padding:13px!important}
        .hierarchy-hero .metric-value,.hierarchy-hero>strong{font-size:27px!important}.hierarchy-hero .metric-foot,.hierarchy-hero>small{text-align:left!important}
      }
    `;
    document.head.appendChild(s);
  }

  function overview() {
    const grid = document.getElementById('overviewSummary');
    if (!grid) return;
    reset(grid);
    const treasury = cardByLabel(grid, 'Treasury USDC');
    const profit = cardById('ovProfit');
    const revenue = cardById('ovRevenue');
    const reserve = cardById('ovReserve');
    const payouts = cardById('ovPayouts');
    [treasury, profit].forEach((c,i) => { mark(c,'hierarchy-hero',i+1); c?.classList.add('overview-headline'); });
    [revenue,reserve,payouts].forEach((c,i) => { mark(c,'hierarchy-medium',i+3); c?.classList.add('overview-support'); });
    relabel(payouts,'Cash payouts');
  }

  function revenue() {
    const grid = document.querySelector('#poolRevenue .finance-kpis');
    if (!grid) return;
    reset(grid);
    const operating = cardById('rpOperatingProfit');
    const safe = cardById('rpWithdrawable');
    const earned = cardById('rpEarned');
    const reserve = cardById('rpReserve');
    const same = equal(valueOf(operating), valueOf(safe));

    mark(safe,'hierarchy-hero',1); safe?.classList.add('revenue-profit-hero');
    if (same) {
      operating?.classList.add('hierarchy-hidden');
      grid.classList.add('revenue-consolidated');
      relabel(safe,'Withdrawable operating profit','Profit available to withdraw at current liquidity');
      [earned,reserve].forEach((c,i) => { mark(c,'hierarchy-medium',i+2); c?.classList.add('revenue-support'); });
    } else {
      relabel(safe,'Safe withdrawal','Capped by operating profit and available treasury liquidity');
      [operating,earned,reserve].forEach((c,i) => { mark(c,'hierarchy-medium',i+2); c?.classList.add('revenue-support'); });
    }
  }

  function odto() {
    const grid = document.querySelector('#odtoPayoutView .inventory-kpis');
    if (!grid) return;
    reset(grid);
    const inventory = cardByLabel(grid,'Warehouse stock at cost') || cardByLabel(grid,'ODTO inventory value');
    const paid = cardByLabel(grid,'Paid to ODTO');
    const open = cardByLabel(grid,'Inbound / open AP') || cardByLabel(grid,'Open ODTO payable');
    const reusable = cardByLabel(grid,'Reusable crate inventory');
    const vault = cardByLabel(grid,'User vault custody');
    relabel(inventory,'ODTO inventory value','Physical stock held at acquisition cost');
    relabel(open,'Open ODTO payable','Ordered inventory not yet paid / received');
    mark(inventory,'hierarchy-hero',1); inventory?.classList.add('odto-inventory-hero');
    [paid,open,reusable,vault].forEach((c,i) => { mark(c,i<2?'hierarchy-medium':'hierarchy-small',i+2); c?.classList.add('odto-support'); });
  }

  function stocks() {
    const grid = document.querySelector('#stocksPayoutView .finance-kpis');
    if (!grid) return;
    reset(grid);
    const margin = cardById('stockMargin');
    mark(margin,'hierarchy-hero',1); margin?.classList.add('stock-margin-hero');
    [cardById('stockInflow'),cardById('stockOutflow'),cardById('stockReserve')].forEach((c,i) => { mark(c,'hierarchy-medium',i+2); c?.classList.add('stock-support'); });
  }

  function credits() {
    const grid = document.querySelector('#creditsCoreView > .metric-grid');
    if (!grid) return;
    reset(grid);
    const supply = cardByLabel(grid,'Credits in circulation');
    mark(supply,'hierarchy-hero',1); supply?.classList.add('credits-supply-hero');
    [cardById('newEmissionMetric'),cardById('creditsPendingBack')].forEach((c,i) => { mark(c,'hierarchy-medium',i+2); c?.classList.add('credits-support'); });
  }

  function lulu() {
    const root = document.getElementById('lulu');
    const hero = root?.querySelector('.lulu-hero');
    if (!root || !hero) return;
    const emitted = cardById('luluEmitted');
    if (emitted && emitted.parentElement !== hero) hero.appendChild(emitted);
    reset(root);
    cardByLabel(hero,'Original supply')?.classList.add('hierarchy-hidden');
    mark(emitted,'hierarchy-hero',1); emitted?.classList.add('lulu-emitted-hero');
    [cardById('luluBurned'),cardById('luluRemaining'),cardByLabel(hero,'Lifetime max emission')].forEach((c,i) => { mark(c,'hierarchy-medium',i+2); c?.classList.add('lulu-support'); });
    root.querySelector(':scope > .metric-grid.compact')?.querySelectorAll('.metric-card').forEach(c => mark(c,'hierarchy-small'));
  }

  function reconciliation() {
    const grid = document.querySelector('#reconciliation .metric-grid');
    if (!grid) return;
    reset(grid);
    const cards = [...grid.querySelectorAll('.metric-card')];
    cards.forEach(c => mark(c,'hierarchy-small'));
    const mismatch = cards.find(c => c.querySelector('.metric-label')?.textContent.trim() === 'Mismatches');
    const n = Number((mismatch?.querySelector('.metric-value')?.textContent || '0').replace(/[^0-9.-]/g,'')) || 0;
    if (mismatch && n > 0) { mismatch.classList.remove('hierarchy-small'); mark(mismatch,'hierarchy-medium',1); mismatch.classList.add('hierarchy-alert'); }
  }

  function rules() {
    const grid = document.querySelector('#rules .rules-grid');
    if (!grid) return;
    reset(grid);
    const wide = new Set(['Revenue & Reserves','Stock Packs','Physical Sneakers']);
    grid.querySelectorAll('.rule-card').forEach(card => { mark(card,'hierarchy-small'); if (wide.has(card.querySelector('span')?.textContent.trim())) card.classList.add('hierarchy-wide'); });
  }

  function applyAll() {
    addStyles(); overview(); revenue(); odto(); stocks(); credits(); lulu(); reconciliation(); rules();
    document.querySelectorAll('.table-panel').forEach(x => x.classList.add('hierarchy-detail'));
    document.body.dataset.visualHierarchy = VERSION;
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.tab,.payout-tab,.credit-program-tab,.segment,#refreshBtn')) { setTimeout(applyAll,25); setTimeout(applyAll,120); }
  });

  const previousRenderAll = window.renderAll;
  if (typeof previousRenderAll === 'function') window.renderAll = function(){ previousRenderAll(); setTimeout(applyAll,0); };

  applyAll();
  setTimeout(applyAll,100);
})();
