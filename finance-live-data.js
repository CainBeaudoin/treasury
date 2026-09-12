/* ODTO-backed supplier costs + quarterly distributable profit model.
   Supplier contract assumption: 70% of ODTO listed CAD price.
   Demo CAD/USD snapshot used for the treasury view: 1 CAD = 0.72 USD.
*/
(function () {
  const ODTO_COST_RATE = 0.70;
  const CAD_USD = 0.72;
  const CASHBACK_RESERVE = 8000;
  const OPERATING_BUFFER = 2500;

  const catalog = [
    {
      item: 'Air Jordan 3 Black Cement (2024)', brand: 'JORDAN', itemNo: 'P1413', listCad: 380, qty: 18, status: 'Paid',
      due: '2026-09-06', ref: 'odto_q3_001', claim: 'Q3 batch · 18 units',
      description: 'Black tumbled-leather Jordan 3 with grey elephant-print overlays, Fire Red tongue branding and visible Air cushioning.',
      url: 'https://odto.com/products/air-jordan-3-black-cement-2024'
    },
    {
      item: 'Yeezy Slide Onyx', brand: 'YEEZY', itemNo: 'P2426', listCad: 350, qty: 22, status: 'Paid',
      due: '2026-09-07', ref: 'odto_q3_002', claim: 'Q3 batch · 22 units',
      description: 'Onyx-black lightweight EVA slide with a soft footbed and grooved outsole.',
      url: 'https://odto.com/products/yeezy-slide-onyx'
    },
    {
      item: 'Air Jordan 11 Cherry', brand: 'JORDAN', itemNo: 'P879', listCad: 420, qty: 12, status: 'Paid',
      due: '2026-09-08', ref: 'odto_q3_003', claim: 'Q3 batch · 12 units',
      description: 'White mesh Jordan 11 with cherry-red patent-leather mudguard, red Jumpman branding and translucent outsole.',
      url: 'https://odto.com/products/air-jordan-11-cherry'
    },
    {
      item: 'Nike Air Force 1 Low Supreme White', brand: 'NIKE', itemNo: 'P684', listCad: 350, qty: 10, status: 'Paid',
      due: '2026-09-09', ref: 'odto_q3_004', claim: 'Q3 batch · 10 units',
      description: 'Monochrome white Air Force 1 with Supreme red box-logo branding and alternate branded laces.',
      url: 'https://odto.com/products/nike-air-force-1-low-supreme-white-1'
    },
    {
      item: 'Air Jordan 4 Nigel Sylvester Brick by Brick', brand: 'JORDAN', itemNo: 'P1887', listCad: 855, qty: 6, status: 'Paid',
      due: '2026-09-10', ref: 'odto_q3_005', claim: 'Q3 batch · 6 units',
      description: 'Firewood-orange Jordan 4 from Nigel Sylvester’s Bike Air series with BMX-inspired branding and sail/red tooling.',
      url: 'https://odto.com/products/air-jordan-4-nigel-sylvester-brick-by-brick'
    },
    {
      item: 'Air Jordan 1 High Off-White University Blue', brand: 'JORDAN', itemNo: 'P533', listCad: 2800, qty: 2, status: 'Pending',
      due: '2026-09-16', ref: 'odto_q3_006', claim: 'Q3 batch · 2 units',
      description: 'Deconstructed Off-White Jordan 1 in University Blue with exposed construction details, printed branding and zip tie.',
      url: 'https://odto.com/products/air-jordan-1-high-off-white-university-blue'
    },
    {
      item: 'Nike Air Force 1 Low Off-White Volt', brand: 'NIKE', itemNo: 'P1360', listCad: 1600, qty: 3, status: 'Awaiting Invoice',
      due: '2026-09-20', ref: 'odto_q3_007', claim: 'Q3 batch · 3 units',
      description: 'Volt Off-White Air Force 1 with synthetic mesh, suede overlays, oversized black Swoosh and printed AIR details.',
      url: 'https://odto.com/products/nike-air-force-1-low-off-white-volt'
    },
    {
      item: 'Nike Air Force 1 Low Off-White Black', brand: 'NIKE', itemNo: 'P1358', listCad: 600, qty: 5, status: 'Pending',
      due: '2026-09-18', ref: 'odto_q3_008', claim: 'Q3 batch · 5 units',
      description: 'Black Off-White Air Force 1 with mesh and suede construction, oversized white Swoosh and collaborative medial branding.',
      url: 'https://odto.com/products/nike-air-force-1-low-off-white-black'
    }
  ];

  catalog.forEach(x => {
    x.unitCostCad = x.listCad * ODTO_COST_RATE;
    x.unitCostUsdc = x.unitCostCad * CAD_USD;
    x.totalUsdc = x.unitCostUsdc * x.qty;
  });

  state.odtoCatalog = catalog;

  // Keep the legacy supplier row shape so the existing render pipeline remains compatible.
  // Additional fields after index 8 carry ODTO retail / contract / quantity / description data.
  state.supplierPayouts = catalog.map((x, i) => [
    `2026-09-${String(Math.min(12, 5 + i)).padStart(2,'0')} 12:${String(10 + i * 4).padStart(2,'0')}:00`,
    'ODTO', x.item, x.claim, x.totalUsdc, 'USDC', x.status, x.due, x.ref,
    x.listCad, x.unitCostCad, x.qty, x.description, x.itemNo, x.url, x.unitCostUsdc
  ]);

  // Q3 source activity. "Pool revenue" is earned Chosen revenue/margin, not gross customer volume.
  state.poolRevenue = [
    ['2026-07-31 23:59:00','Crate Margin',48000,0.30,14400,'USDC','q3_jul_crates','Confirmed'],
    ['2026-07-31 23:59:01','Marketplace Fees',80000,0.01,800,'USDC','q3_jul_market','Confirmed'],
    ['2026-07-31 23:59:02','Shipping Margin',5000,0.12,600,'USDC','q3_jul_ship','Confirmed'],
    ['2026-07-31 23:59:03','Partner Revenue Share',20000,0.05,1000,'USDC','q3_jul_partner','Confirmed'],
    ['2026-08-31 23:59:00','Crate Margin',52000,0.30,15600,'USDC','q3_aug_crates','Confirmed'],
    ['2026-08-31 23:59:01','Marketplace Fees',90000,0.01,900,'USDC','q3_aug_market','Confirmed'],
    ['2026-08-31 23:59:02','Shipping Margin',6000,0.12,720,'USDC','q3_aug_ship','Confirmed'],
    ['2026-08-31 23:59:03','Partner Revenue Share',24000,0.05,1200,'USDC','q3_aug_partner','Confirmed'],
    ['2026-09-12 14:00:00','Crate Margin',50000,0.30,15000,'USDC','q3_sep_crates','Confirmed'],
    ['2026-09-12 14:00:01','Marketplace Fees',80000,0.01,800,'USDC','q3_sep_market','Confirmed'],
    ['2026-09-12 14:00:02','Shipping Margin',7000,0.12,840,'USDC','q3_sep_ship','Confirmed'],
    ['2026-09-12 14:00:03','Partner Revenue Share',28000,0.05,1400,'USDC','q3_sep_partner','Confirmed']
  ];

  function num(v){ return Number(v || 0); }
  function usd(v){ return money(num(v)); }
  function cad(v){ return 'C$' + num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function totals() {
    const earnedRevenue = state.poolRevenue.reduce((a,r)=>a+num(r[4]),0);
    const grossSource = state.poolRevenue.reduce((a,r)=>a+num(r[2]),0);
    const supplierPaid = state.supplierPayouts.filter(r=>r[6]==='Paid').reduce((a,r)=>a+num(r[4]),0);
    const supplierPending = state.supplierPayouts.filter(r=>r[6]==='Pending').reduce((a,r)=>a+num(r[4]),0);
    const supplierAwaiting = state.supplierPayouts.filter(r=>r[6]==='Awaiting Invoice').reduce((a,r)=>a+num(r[4]),0);
    const supplierOpen = supplierPending + supplierAwaiting;
    const fulfillmentReserve = typeof pendingReserve === 'function' ? pendingReserve() : 0;
    const requiredReserve = CASHBACK_RESERVE + supplierOpen + fulfillmentReserve + OPERATING_BUFFER;
    const afterPaidSuppliers = earnedRevenue - supplierPaid;
    const withdrawableProfit = Math.max(0, afterPaidSuppliers - requiredReserve);
    return {earnedRevenue,grossSource,supplierPaid,supplierPending,supplierAwaiting,supplierOpen,fulfillmentReserve,requiredReserve,afterPaidSuppliers,withdrawableProfit};
  }

  function addStyles() {
    if (document.getElementById('odtoFinanceStyles')) return;
    const style = document.createElement('style');
    style.id = 'odtoFinanceStyles';
    style.textContent = `
      .supplier-source-note{margin:0 0 14px;padding:11px 13px;border:1px solid rgba(102,183,255,.3);background:rgba(102,183,255,.06);border-radius:11px;font-size:11px;line-height:1.5;color:#b9c7d6}
      .supplier-source-note b{color:var(--blue)}
      .product-desc{max-width:360px;white-space:normal;line-height:1.4;color:var(--muted);font-size:11px}
      .profit-positive{color:var(--blue)}
      .profit-waterfall td:last-child{text-align:right}
      .overview-profit-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0 20px}
      .overview-profit-strip>div{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 14px;display:grid;gap:5px}
      .overview-profit-strip span{font-size:10px;color:var(--muted)}
      .overview-profit-strip strong{font-size:19px}
      .overview-profit-strip .highlight{box-shadow:inset 0 2px 0 var(--blue)}
      @media(max-width:900px){.overview-profit-strip{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:620px){.overview-profit-strip{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function ensureTabs() {
    const nav = document.querySelector('.tabs');
    const activity = nav && [...nav.querySelectorAll('.tab')].find(b=>b.dataset.tab==='activity');
    if (!nav || !activity) return;
    [['poolRevenue','Pool Revenue'],['supplierPayouts','Supplier Payouts']].forEach(([id,label])=>{
      let btn = [...nav.querySelectorAll('.tab')].find(b=>b.dataset.tab===id);
      if (!btn) {
        btn = document.createElement('button');
        btn.className='tab'; btn.dataset.tab=id; btn.textContent=label;
      }
      nav.insertBefore(btn, activity);
      btn.addEventListener('click',()=>setTimeout(renderFinanceModel,0));
    });
  }

  function setupPoolPage() {
    const panel = document.getElementById('poolRevenue');
    if (!panel) return;
    panel.innerHTML = `
      <div class="section-intro"><div><h2>Pool Revenue</h2><p>Quarterly earned revenue, required reserves, and the amount that can safely be taken out as profit.</p></div><button class="export-btn" id="exportPoolRevenueModel">Export CSV</button></div>
      <div class="finance-kpis">
        <article class="metric-card"><div class="metric-label">Gross source volume</div><div class="metric-value" id="poolGrossSource">$0</div><div class="metric-foot">Underlying Q3 activity</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Q3 earned revenue</div><div class="metric-value" id="poolEarnedRevenue">$0</div><div class="metric-foot">Chosen margin / fees actually earned</div></article>
        <article class="metric-card"><div class="metric-label">Supplier cash paid</div><div class="metric-value" id="poolSupplierPaidModel">$0</div><div class="metric-foot">Realized ODTO cost this quarter</div></article>
        <article class="metric-card"><div class="metric-label">Required reserve</div><div class="metric-value" id="poolRequiredReserve">$0</div><div class="metric-foot">Cashback + open AP + claims + buffer</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Withdrawable profit</div><div class="metric-value profit-positive" id="poolWithdrawable">$0</div><div class="metric-foot">Safe Q3 profit after reserves</div></article>
      </div>
      <div class="finance-grid">
        <article class="panel"><div class="panel-head"><div><h3>Revenue by source</h3><p>Gross volume is context; only the earned amount enters the revenue pool.</p></div></div><table class="finance-breakdown"><thead><tr><th>Source</th><th>Gross volume</th><th>Earned</th></tr></thead><tbody id="poolSourceSummaryModel"></tbody></table></article>
        <article class="panel"><div class="panel-head"><div><h3>Profit waterfall</h3><p>What must stay in treasury before quarterly profit can be removed.</p></div></div><table class="finance-breakdown profit-waterfall"><tbody id="profitWaterfall"></tbody></table></article>
      </div>
      <div class="filters"><input id="poolSearchModel" class="control grow" placeholder="Search source or reference…"/><select id="poolSourceModel" class="control"><option value="all">All sources</option><option>Crate Margin</option><option>Marketplace Fees</option><option>Shipping Margin</option><option>Partner Revenue Share</option></select></div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>Quarterly revenue activity</h3><p>Audit trail backing the pool.</p></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Source</th><th>Gross volume</th><th>Rate</th><th>Earned revenue</th><th>Asset</th><th>Reference</th><th>Status</th></tr></thead><tbody id="poolRevenueTableModel"></tbody></table></div></article>`;
    document.getElementById('poolSearchModel')?.addEventListener('input',renderFinanceModel);
    document.getElementById('poolSourceModel')?.addEventListener('change',renderFinanceModel);
    document.getElementById('exportPoolRevenueModel')?.addEventListener('click',()=>exportSection('pool-revenue'));
  }

  function setupSupplierPage() {
    const panel = document.getElementById('supplierPayouts');
    if (!panel) return;
    panel.innerHTML = `
      <div class="section-intro"><div><h2>Supplier Payouts</h2><p>ODTO inventory used as the supplier basis. Contract cost is modeled at 70% of the listed CAD price.</p></div><button class="export-btn" id="exportSupplierModel">Export CSV</button></div>
      <div class="supplier-source-note"><b>Supplier basis:</b> ODTO public product listings. Supplier contract assumption = 70% of listed CAD price. Treasury payout is shown as a USDC equivalent using a demo snapshot of 1 CAD = 0.72 USD.</div>
      <div class="finance-kpis">
        <article class="metric-card"><div class="metric-label">ODTO retail value</div><div class="metric-value" id="supplierRetailCad">C$0</div><div class="metric-foot">Listed value × units</div></article>
        <article class="metric-card"><div class="metric-label">70% contract value</div><div class="metric-value" id="supplierContractCad">C$0</div><div class="metric-foot">Modeled supplier cost in CAD</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Paid this quarter</div><div class="metric-value" id="supplierPaidModel">$0</div><div class="metric-foot">Completed USDC-equivalent payouts</div></article>
        <article class="metric-card"><div class="metric-label">Open supplier AP</div><div class="metric-value" id="supplierOpenModel">$0</div><div class="metric-foot">Pending + awaiting invoice</div></article>
        <article class="metric-card"><div class="metric-label">Product lines</div><div class="metric-value" id="supplierSkuCount">0</div><div class="metric-foot">ODTO SKUs represented in Q3</div></article>
      </div>
      <div class="filters"><input id="supplierSearchModel" class="control grow" placeholder="Search product, item number or description…"/><select id="supplierStatusModel" class="control"><option value="all">All statuses</option><option>Paid</option><option>Pending</option><option>Awaiting Invoice</option></select></div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>ODTO supplier payout activity</h3><p>List price, 70% supplier basis, quantity and payout status.</p></div></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>ODTO item</th><th>List CAD</th><th>70% cost CAD</th><th>Qty</th><th>Unit USDC</th><th>Total payout</th><th>Status</th><th>Description</th><th>Payout ref</th></tr></thead><tbody id="supplierPayoutTableModel"></tbody></table></div></article>`;
    document.getElementById('supplierSearchModel')?.addEventListener('input',renderFinanceModel);
    document.getElementById('supplierStatusModel')?.addEventListener('change',renderFinanceModel);
    document.getElementById('exportSupplierModel')?.addEventListener('click',()=>exportSection('supplier-payouts'));
  }

  function setupOverview() {
    const overview = document.getElementById('overview');
    if (!overview || document.getElementById('overviewProfitStrip')) return;
    const metrics = overview.querySelector('.overview-metrics');
    if (!metrics) return;
    const strip = document.createElement('div');
    strip.id='overviewProfitStrip';
    strip.className='overview-profit-strip';
    strip.innerHTML = `
      <div><span>Q3 earned revenue</span><strong id="overviewPoolRevenue">$0</strong></div>
      <div><span>ODTO supplier cash paid</span><strong id="overviewSupplierPaid">$0</strong></div>
      <div><span>Required Q3 reserve</span><strong id="overviewReserveHeld">$0</strong></div>
      <div class="highlight"><span>Q3 withdrawable profit</span><strong class="profit-positive" id="overviewWithdrawableProfit">$0</strong></div>`;
    metrics.insertAdjacentElement('afterend',strip);
  }

  function renderFinanceModel() {
    const t = totals();
    setText('poolGrossSource',usd(t.grossSource));
    setText('poolEarnedRevenue',usd(t.earnedRevenue));
    setText('poolSupplierPaidModel',usd(t.supplierPaid));
    setText('poolRequiredReserve',usd(t.requiredReserve));
    setText('poolWithdrawable',usd(t.withdrawableProfit));

    setText('overviewPoolRevenue',usd(t.earnedRevenue));
    setText('overviewSupplierPaid',usd(t.supplierPaid));
    setText('overviewReserveHeld',usd(t.requiredReserve));
    setText('overviewWithdrawableProfit',usd(t.withdrawableProfit));

    const bySource = {};
    state.poolRevenue.forEach(r=>{ const k=r[1]; bySource[k]=bySource[k]||{gross:0,earned:0}; bySource[k].gross+=num(r[2]); bySource[k].earned+=num(r[4]); });
    const sourceBody=document.getElementById('poolSourceSummaryModel');
    if(sourceBody) sourceBody.innerHTML=Object.entries(bySource).map(([k,v])=>`<tr><td>${k}</td><td>${usd(v.gross)}</td><td class="positive-text">${usd(v.earned)}</td></tr>`).join('');

    const waterfall=document.getElementById('profitWaterfall');
    if(waterfall) waterfall.innerHTML=`
      <tr><td>Q3 earned revenue</td><td class="positive-text">+${usd(t.earnedRevenue)}</td></tr>
      <tr><td>ODTO supplier payouts already paid</td><td class="negative-text">−${usd(t.supplierPaid)}</td></tr>
      <tr><td>Open supplier AP reserve</td><td class="negative-text">−${usd(t.supplierOpen)}</td></tr>
      <tr><td>Cashback liquidity reserve</td><td class="negative-text">−${usd(CASHBACK_RESERVE)}</td></tr>
      <tr><td>Pending physical-claim reserve</td><td class="negative-text">−${usd(t.fulfillmentReserve)}</td></tr>
      <tr><td>Operating buffer</td><td class="negative-text">−${usd(OPERATING_BUFFER)}</td></tr>
      <tr><td><b>Withdrawable Q3 profit</b></td><td class="profit-positive"><b>${usd(t.withdrawableProfit)}</b></td></tr>`;

    const pq=(document.getElementById('poolSearchModel')?.value||'').toLowerCase();
    const ps=document.getElementById('poolSourceModel')?.value||'all';
    const poolRows=state.poolRevenue.filter(r=>(ps==='all'||r[1]===ps)&&(!pq||r.join(' ').toLowerCase().includes(pq)));
    const poolBody=document.getElementById('poolRevenueTableModel');
    if(poolBody) poolBody.innerHTML=poolRows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${usd(r[2])}</td><td>${(num(r[3])*100).toFixed(1)}%</td><td class="positive-text">+${usd(r[4])}</td><td>${badge(r[5])}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');

    const retailCad=catalog.reduce((a,x)=>a+x.listCad*x.qty,0);
    const contractCad=catalog.reduce((a,x)=>a+x.unitCostCad*x.qty,0);
    setText('supplierRetailCad',cad(retailCad));
    setText('supplierContractCad',cad(contractCad));
    setText('supplierPaidModel',usd(t.supplierPaid));
    setText('supplierOpenModel',usd(t.supplierOpen));
    setText('supplierSkuCount',String(catalog.length));

    const sq=(document.getElementById('supplierSearchModel')?.value||'').toLowerCase();
    const ss=document.getElementById('supplierStatusModel')?.value||'all';
    const supplierRows=catalog.filter(x=>(ss==='all'||x.status===ss)&&(!sq||[x.item,x.itemNo,x.description,x.brand].join(' ').toLowerCase().includes(sq)));
    const supplierBody=document.getElementById('supplierPayoutTableModel');
    if(supplierBody) supplierBody.innerHTML=supplierRows.map(x=>`<tr><td><b>${x.item}</b><small class="table-sub">${x.brand}</small></td><td class="mono">${x.itemNo}</td><td>${cad(x.listCad)}</td><td>${cad(x.unitCostCad)}</td><td>${x.qty}</td><td>${usd(x.unitCostUsdc)}</td><td class="negative-text">−${usd(x.totalUsdc)}</td><td>${badge(x.status)}</td><td class="product-desc">${esc(x.description)}</td><td class="mono">${x.ref}</td></tr>`).join('');
  }

  function initialize() {
    addStyles();
    ensureTabs();
    setupPoolPage();
    setupSupplierPage();
    setupOverview();
    renderFinanceModel();
  }

  const previousRenderAll = renderAll;
  renderAll = function(){
    previousRenderAll();
    initialize();
    renderFinanceModel();
  };

  initialize();
})();
