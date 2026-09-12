/* Live treasury structure + finance model. This file is loaded directly by index.html. */
(function () {
  const ODTO_COST_RATE = 0.70;
  const CAD_USD = 0.72;
  const CASHBACK_RESERVE = 8000;
  const OPERATING_BUFFER = 2500;

  const catalog = [
    {item:'Air Jordan 3 Black Cement (2024)',brand:'JORDAN',itemNo:'P1413',listCad:380,qty:18,status:'Paid',due:'2026-09-06',ref:'odto_q3_001',description:'Black tumbled-leather Jordan 3 with grey elephant-print overlays, Fire Red tongue branding and visible Air cushioning.'},
    {item:'Yeezy Slide Onyx',brand:'YEEZY',itemNo:'P2426',listCad:350,qty:22,status:'Paid',due:'2026-09-07',ref:'odto_q3_002',description:'Onyx-black lightweight EVA slide with a soft footbed and grooved outsole.'},
    {item:'Air Jordan 11 Cherry',brand:'JORDAN',itemNo:'P879',listCad:420,qty:12,status:'Paid',due:'2026-09-08',ref:'odto_q3_003',description:'White mesh Jordan 11 with cherry-red patent-leather mudguard, red Jumpman branding and translucent outsole.'},
    {item:'Nike Air Force 1 Low Supreme White',brand:'NIKE',itemNo:'P684',listCad:350,qty:10,status:'Paid',due:'2026-09-09',ref:'odto_q3_004',description:'Monochrome white Air Force 1 with Supreme red box-logo branding and alternate branded laces.'},
    {item:'Air Jordan 4 Nigel Sylvester Brick by Brick',brand:'JORDAN',itemNo:'P1887',listCad:855,qty:6,status:'Paid',due:'2026-09-10',ref:'odto_q3_005',description:'Firewood-orange Jordan 4 from Nigel Sylvester’s Bike Air series with BMX-inspired branding and sail/red tooling.'},
    {item:'Air Jordan 1 High Off-White University Blue',brand:'JORDAN',itemNo:'P533',listCad:2800,qty:2,status:'Pending',due:'2026-09-16',ref:'odto_q3_006',description:'Deconstructed Off-White Jordan 1 in University Blue with exposed construction details, printed branding and zip tie.'},
    {item:'Nike Air Force 1 Low Off-White Volt',brand:'NIKE',itemNo:'P1360',listCad:1600,qty:3,status:'Awaiting Invoice',due:'2026-09-20',ref:'odto_q3_007',description:'Volt Off-White Air Force 1 with synthetic mesh, suede overlays, oversized black Swoosh and printed AIR details.'},
    {item:'Nike Air Force 1 Low Off-White Black',brand:'NIKE',itemNo:'P1358',listCad:600,qty:5,status:'Pending',due:'2026-09-18',ref:'odto_q3_008',description:'Black Off-White Air Force 1 with mesh and suede construction, oversized white Swoosh and collaborative medial branding.'}
  ];

  catalog.forEach(x => {
    x.unitCostCad = x.listCad * ODTO_COST_RATE;
    x.unitCostUsdc = x.unitCostCad * CAD_USD;
    x.totalUsdc = x.unitCostUsdc * x.qty;
  });

  state.odtoCatalog = catalog;
  state.supplierPayouts = catalog.map((x,i) => [
    `2026-09-${String(Math.min(12,5+i)).padStart(2,'0')} 12:${String(10+i*4).padStart(2,'0')}:00`,
    'ODTO',x.item,`Q3 batch · ${x.qty} units`,x.totalUsdc,'USDC',x.status,x.due,x.ref,
    x.listCad,x.unitCostCad,x.qty,x.description,x.itemNo,x.unitCostUsdc
  ]);

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

  const num = v => Number(v || 0);
  const usd = v => money(num(v));
  const cad = v => 'C$' + num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

  function totals(){
    const earnedRevenue = state.poolRevenue.reduce((a,r)=>a+num(r[4]),0);
    const grossSource = state.poolRevenue.reduce((a,r)=>a+num(r[2]),0);
    const supplierPaid = state.supplierPayouts.filter(r=>r[6]==='Paid').reduce((a,r)=>a+num(r[4]),0);
    const supplierPending = state.supplierPayouts.filter(r=>r[6]==='Pending').reduce((a,r)=>a+num(r[4]),0);
    const supplierAwaiting = state.supplierPayouts.filter(r=>r[6]==='Awaiting Invoice').reduce((a,r)=>a+num(r[4]),0);
    const supplierOpen = supplierPending + supplierAwaiting;
    const fulfillmentReserve = typeof pendingReserve === 'function' ? pendingReserve() : 0;
    const requiredReserve = CASHBACK_RESERVE + supplierOpen + fulfillmentReserve + OPERATING_BUFFER;
    const withdrawableProfit = Math.max(0, earnedRevenue - supplierPaid - requiredReserve);
    return {earnedRevenue,grossSource,supplierPaid,supplierOpen,fulfillmentReserve,requiredReserve,withdrawableProfit};
  }

  function addStyles(){
    if(document.getElementById('liveTreasuryFixStyles')) return;
    const s=document.createElement('style');
    s.id='liveTreasuryFixStyles';
    s.textContent=`
      .finance-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}.finance-kpis .metric-card{min-height:0}.finance-kpis .metric-value{font-size:22px}
      .finance-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0}.finance-breakdown{width:100%;border-collapse:collapse}.finance-breakdown th,.finance-breakdown td{padding:10px 0;border-bottom:1px solid var(--border);font-size:11px}.finance-breakdown th{text-align:left;color:var(--muted);background:transparent}.finance-breakdown td:last-child,.finance-breakdown th:last-child{text-align:right}
      .supplier-source-note{margin:0 0 14px;padding:11px 13px;border:1px solid rgba(60,150,255,.3);background:rgba(60,150,255,.06);border-radius:11px;font-size:11px;line-height:1.5;color:#b9c7d6}.supplier-source-note b{color:var(--blue)}
      .product-desc{max-width:360px;white-space:normal;line-height:1.4;color:var(--muted);font-size:11px}
      .overview-profit-strip{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:12px 0 20px}.overview-profit-strip>div{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 14px;display:grid;gap:5px;min-width:0}.overview-profit-strip span{font-size:10px;color:var(--muted)}.overview-profit-strip strong{font-size:18px}.overview-profit-strip .highlight{box-shadow:inset 0 2px 0 var(--blue)}.overview-profit-strip .highlight strong{color:var(--blue)}
      @media(max-width:1200px){.overview-profit-strip{grid-template-columns:repeat(3,1fr)}.finance-kpis{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.overview-profit-strip,.finance-grid,.finance-kpis{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function ensurePanels(){
    const main=document.querySelector('main.main');
    const activity=document.getElementById('activity');
    if(!main||!activity) return;
    if(!document.getElementById('poolRevenue')){
      const p=document.createElement('section');p.id='poolRevenue';p.className='tab-panel';main.insertBefore(p,activity);
    }
    if(!document.getElementById('supplierPayouts')){
      const p=document.createElement('section');p.id='supplierPayouts';p.className='tab-panel';main.insertBefore(p,activity);
    }
  }

  function bindTab(button,id){
    if(button.dataset.liveBound) return;
    button.dataset.liveBound='1';
    button.addEventListener('click',()=>{
      document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(id)?.classList.add('active');
      renderFinance();
    });
  }

  function syncNavigation(){
    const nav=document.querySelector('.tabs');
    if(!nav) return;
    const order=[['overview','Overview'],['activity','Activity'],['poolRevenue','Revenue Pool'],['supplierPayouts','Supplier Payouts'],['credits','Credits'],['reconciliation','Reconciliation'],['lulu','Lulu'],['rules','Rules']];
    order.forEach(([id,label])=>{
      let b=[...nav.querySelectorAll('.tab')].find(x=>x.dataset.tab===id);
      if(!b){b=document.createElement('button');b.className='tab';b.dataset.tab=id;}
      b.textContent=label;bindTab(b,id);nav.appendChild(b);
    });
  }

  function setupRevenuePage(){
    const p=document.getElementById('poolRevenue');if(!p) return;
    p.innerHTML=`
      <div class="section-intro"><div><h2>Revenue Pool</h2><p>Quarterly earned revenue, reserves, supplier obligations and the amount that can safely be distributed as profit.</p></div><button class="export-btn" id="exportRevenuePool">Export CSV</button></div>
      <div class="finance-kpis">
        <article class="metric-card"><div class="metric-label">Gross source volume</div><div class="metric-value" id="rpGross">$0</div><div class="metric-foot">Underlying Q3 activity</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Q3 earned revenue</div><div class="metric-value" id="rpEarned">$0</div><div class="metric-foot">Chosen margin and fees earned</div></article>
        <article class="metric-card"><div class="metric-label">Supplier cash paid</div><div class="metric-value" id="rpPaid">$0</div><div class="metric-foot">Realized ODTO outflow</div></article>
        <article class="metric-card"><div class="metric-label">Required reserve</div><div class="metric-value" id="rpReserve">$0</div><div class="metric-foot">Cashback + AP + claims + buffer</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Withdrawable profit</div><div class="metric-value" id="rpWithdrawable">$0</div><div class="metric-foot">Safe Q3 distribution after reserves</div></article>
      </div>
      <div class="finance-grid">
        <article class="panel"><div class="panel-head"><div><h3>Revenue by source</h3><p>Gross volume is context; only earned margin enters the pool.</p></div></div><table class="finance-breakdown"><thead><tr><th>Source</th><th>Gross</th><th>Earned</th></tr></thead><tbody id="rpSources"></tbody></table></article>
        <article class="panel"><div class="panel-head"><div><h3>Profit waterfall</h3><p>Cash that must stay before profit can be removed.</p></div></div><table class="finance-breakdown"><tbody id="rpWaterfall"></tbody></table></article>
      </div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>Quarterly revenue activity</h3><p>Audit trail backing the pool.</p></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Source</th><th>Gross volume</th><th>Rate</th><th>Earned revenue</th><th>Reference</th></tr></thead><tbody id="rpTable"></tbody></table></div></article>`;
    document.getElementById('exportRevenuePool')?.addEventListener('click',()=>exportSection('pool-revenue'));
  }

  function setupSupplierPage(){
    const p=document.getElementById('supplierPayouts');if(!p) return;
    p.innerHTML=`
      <div class="section-intro"><div><h2>Supplier Payouts</h2><p>ODTO inventory cost basis. Supplier payout is modeled at 70% of ODTO listed CAD price.</p></div><button class="export-btn" id="exportSupplierLive">Export CSV</button></div>
      <div class="supplier-source-note"><b>Supplier basis:</b> ODTO list price × 70%. USDC-equivalent payout uses the demo treasury rate of 1 CAD = 0.72 USD.</div>
      <div class="finance-kpis">
        <article class="metric-card"><div class="metric-label">ODTO retail value</div><div class="metric-value" id="spRetail">C$0</div></article>
        <article class="metric-card"><div class="metric-label">70% contract value</div><div class="metric-value" id="spContract">C$0</div></article>
        <article class="metric-card accent-usdc"><div class="metric-label">Paid this quarter</div><div class="metric-value" id="spPaid">$0</div></article>
        <article class="metric-card"><div class="metric-label">Open supplier AP</div><div class="metric-value" id="spOpen">$0</div></article>
        <article class="metric-card"><div class="metric-label">Product lines</div><div class="metric-value" id="spSkus">0</div></article>
      </div>
      <article class="panel table-panel"><div class="panel-head"><div><h3>ODTO supplier payout activity</h3><p>List price, 70% supplier basis, quantity and payout status.</p></div></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>ODTO item</th><th>List CAD</th><th>70% cost CAD</th><th>Qty</th><th>Unit USDC</th><th>Total payout</th><th>Status</th><th>Description</th></tr></thead><tbody id="spTable"></tbody></table></div></article>`;
    document.getElementById('exportSupplierLive')?.addEventListener('click',()=>exportSection('supplier-payouts'));
  }

  function setupOverview(){
    const o=document.getElementById('overview');if(!o) return;
    const intro=o.querySelector('.section-intro p');if(intro) intro.textContent='Executive view of treasury cash, quarterly revenue, supplier obligations, reserves and distributable profit.';
    const metrics=o.querySelector('.overview-metrics');if(!metrics) return;
    let strip=document.getElementById('overviewProfitStrip');if(!strip){strip=document.createElement('div');strip.id='overviewProfitStrip';metrics.insertAdjacentElement('afterend',strip);}
    strip.className='overview-profit-strip';
    strip.innerHTML=`
      <div class="highlight"><span>Q3 earned revenue</span><strong id="ovRevenue">$0</strong></div>
      <div><span>Supplier paid</span><strong id="ovPaid">$0</strong></div>
      <div><span>Supplier open AP</span><strong id="ovOpen">$0</strong></div>
      <div><span>Total supplier committed</span><strong id="ovCommitted">$0</strong></div>
      <div><span>Required reserve</span><strong id="ovReserve">$0</strong></div>
      <div class="highlight"><span>Withdrawable Q3 profit</span><strong id="ovProfit">$0</strong></div>`;
  }

  function syncRules(){
    const grid=document.querySelector('#rules .rules-grid');if(!grid) return;
    const rules=[
      ['Credits','Non-cash units','Credits have no direct cash value in treasury reporting.'],
      ['Credit Spend','Entry removed','A Credits-funded crate immediately removes the crate entry amount.'],
      ['Immediate Credit Back','80% of prize FMV','Credits-funded immediate settlement is based on prize FMV, not entry.'],
      ['USDC Cashback','80% of prize FMV','USDC-funded immediate settlement is paid in USDC.'],
      ['Crate Bonus','5% of entry','Every crate emits a separate 5% Credit bonus.'],
      ['Vaulted Item','365-day window','The user can list, redeem or liquidate during the claim window.'],
      ['Pending Liquidation','70% capped','70% × min(initial prize FMV, current live FMV).'],
      ['Liquidation Asset','Original asset','Within 365 days, Credits-funded vaults liquidate to Credits and USDC-funded vaults to USDC.'],
      ['Auto Credit Back','Day 365 · Credits','If unresolved at day 365, the item disappears and automatically settles in Credits at the capped 70% basis.'],
      ['After Auto Credit Back','Credits remain','Credits stay in the user account and can later be rerolled into another crate.'],
      ['Physical Redemption','Actual acquisition cost','Supplier/acquisition cost, not retail FMV, becomes the USDC outflow.'],
      ['Supplier Cost','70% of ODTO list','Demo supplier basis uses 70% of ODTO listed CAD price.'],
      ['Revenue Pool','Profit after reserves','Withdrawable profit is earned revenue less paid suppliers and required liquidity reserves.'],
      ['Marketplace','Fee only','Marketplace sale principal is not company revenue; only Chosen’s fee is revenue.'],
      ['Shipping','Separate cash flows','User shipping payment is inflow; carrier/handling is outflow.'],
      ['Lulu Single','100 Credits','Each Lulu burned emits 100 Credits.'],
      ['Lulu Triple','333 Credits','Every three Lulus burned emit 333 Credits total.']
    ];
    grid.innerHTML=rules.map((r,i)=>`<article class="rule-card${i===8?' accent-rule':''}"><span>${r[0]}</span><strong>${r[1]}</strong><p>${r[2]}</p></article>`).join('');
    const note=document.querySelector('#rules .rule-note');if(note) note.innerHTML='<b>Accounting boundary:</b> Credits remain non-cash. Revenue Pool is the quarterly earned amount after supplier cash costs and reserves. At day 365 unresolved vault items automatically convert to Credits at 70% × min(initial FMV, live FMV).';
  }

  function renderFinance(){
    const t=totals();
    setText('rpGross',usd(t.grossSource));setText('rpEarned',usd(t.earnedRevenue));setText('rpPaid',usd(t.supplierPaid));setText('rpReserve',usd(t.requiredReserve));setText('rpWithdrawable',usd(t.withdrawableProfit));
    setText('ovRevenue',usd(t.earnedRevenue));setText('ovPaid',usd(t.supplierPaid));setText('ovOpen',usd(t.supplierOpen));setText('ovCommitted',usd(t.supplierPaid+t.supplierOpen));setText('ovReserve',usd(t.requiredReserve));setText('ovProfit',usd(t.withdrawableProfit));
    const by={};state.poolRevenue.forEach(r=>{const k=r[1];by[k]=by[k]||{g:0,e:0};by[k].g+=num(r[2]);by[k].e+=num(r[4]);});
    const src=document.getElementById('rpSources');if(src) src.innerHTML=Object.entries(by).map(([k,v])=>`<tr><td>${k}</td><td>${usd(v.g)}</td><td>${usd(v.e)}</td></tr>`).join('');
    const wf=document.getElementById('rpWaterfall');if(wf) wf.innerHTML=`<tr><td>Q3 earned revenue</td><td>+${usd(t.earnedRevenue)}</td></tr><tr><td>Supplier payouts paid</td><td>−${usd(t.supplierPaid)}</td></tr><tr><td>Open supplier AP reserve</td><td>−${usd(t.supplierOpen)}</td></tr><tr><td>Cashback reserve</td><td>−${usd(CASHBACK_RESERVE)}</td></tr><tr><td>Pending claim reserve</td><td>−${usd(t.fulfillmentReserve)}</td></tr><tr><td>Operating buffer</td><td>−${usd(OPERATING_BUFFER)}</td></tr><tr><td><b>Withdrawable Q3 profit</b></td><td><b>${usd(t.withdrawableProfit)}</b></td></tr>`;
    const rt=document.getElementById('rpTable');if(rt) rt.innerHTML=state.poolRevenue.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${usd(r[2])}</td><td>${(num(r[3])*100).toFixed(1)}%</td><td>+${usd(r[4])}</td><td class="mono">${r[6]}</td></tr>`).join('');
    const retail=catalog.reduce((a,x)=>a+x.listCad*x.qty,0),contract=catalog.reduce((a,x)=>a+x.unitCostCad*x.qty,0);
    setText('spRetail',cad(retail));setText('spContract',cad(contract));setText('spPaid',usd(t.supplierPaid));setText('spOpen',usd(t.supplierOpen));setText('spSkus',String(catalog.length));
    const st=document.getElementById('spTable');if(st) st.innerHTML=catalog.map(x=>`<tr><td><b>${esc(x.item)}</b><small class="table-sub">${x.brand}</small></td><td class="mono">${x.itemNo}</td><td>${cad(x.listCad)}</td><td>${cad(x.unitCostCad)}</td><td>${x.qty}</td><td>${usd(x.unitCostUsdc)}</td><td>−${usd(x.totalUsdc)}</td><td>${badge(x.status)}</td><td class="product-desc">${esc(x.description)}</td></tr>`).join('');
    setText('pendingCreditMetric',credits(state.pendingItems.filter(x=>x.status==='Vaulted').reduce((a,x)=>a+pendingLiquidationAmount(x),0)));
    setText('creditsPendingBack',credits(state.pendingItems.filter(x=>x.status==='Vaulted').reduce((a,x)=>a+pendingLiquidationAmount(x),0)));
  }

  function initialize(){
    addStyles();ensurePanels();syncNavigation();setupRevenuePage();setupSupplierPage();setupOverview();syncRules();renderFinance();
  }

  const priorRenderAll=renderAll;
  renderAll=function(){priorRenderAll();initialize();};
  initialize();
})();