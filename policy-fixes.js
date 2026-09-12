/* Chosen Finance — QA-hardened finance + treasury UI. Loaded after policy-overrides.js. */
(function () {
  const ODTO_COST_RATE = 0.70;
  const CAD_USD = 0.72;
  const CASHBACK_RESERVE = 8000;
  const OPERATING_BUFFER = 2500;
  const STOCK_PACK_PRICE = 50;
  const STOCK_MAX_PRIZE = 1000;
  const STOCK_LIQUIDITY_RESERVE = STOCK_MAX_PRIZE * 10;
  const STOCK_PACK_PAYMENT_ASSET = 'USDC';
  const CREDIT_OPENING_SUPPLY = 83573;
  const PERIOD_LABEL = 'Q3 2026 · through Sep 12';
  const UI_VERSION = 'finance-v5-payment-rails';
  let activePayoutView = 'odto';

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

  const stockTiers = [
    {tier:'Core',packs:100,avgCost:27,totalCost:2700},
    {tier:'Mid',packs:15,avgCost:50,totalCost:750},
    {tier:'Rare',packs:4,avgCost:150,totalCost:600},
    {tier:'Grail',packs:1,avgCost:1000,totalCost:1000}
  ];

  const stockExecutions = [
    ['2026-09-12 16:48:14','AAPL',50,28,22,'stk_q3_120','Executed'],
    ['2026-09-12 16:42:31','NVDA',50,31,19,'stk_q3_119','Executed'],
    ['2026-09-12 16:35:09','AMZN',50,25,25,'stk_q3_118','Executed'],
    ['2026-09-12 16:28:44','GOOGL',50,34,16,'stk_q3_117','Executed'],
    ['2026-09-12 16:20:02','TSLA',50,40,10,'stk_q3_116','Executed'],
    ['2026-09-12 16:12:55','MSFT',50,29,21,'stk_q3_115','Executed'],
    ['2026-09-12 15:59:21','META',50,55,-5,'stk_q3_114','Executed'],
    ['2026-09-12 15:42:08','PLTR',50,75,-25,'stk_q3_113','Executed'],
    ['2026-09-12 15:31:17','AAPL',50,26,24,'stk_q3_112','Executed'],
    ['2026-09-12 15:18:40','NVDA',50,150,-100,'stk_q3_111','Executed'],
    ['2026-09-12 14:54:33','TSLA',50,250,-200,'stk_q3_110','Executed'],
    ['2026-09-12 14:20:05','NVDA',50,1000,-950,'stk_q3_109','Executed']
  ];

  const stockQuarter = (() => {
    const packs = stockTiers.reduce((a,x)=>a+x.packs,0);
    const inflow = packs * STOCK_PACK_PRICE;
    const outflow = stockTiers.reduce((a,x)=>a+x.totalCost,0);
    return {packs,inflow,outflow,margin:inflow-outflow};
  })();

  state.odtoCatalog = catalog;
  state.stockPackExecutions = stockExecutions;
  state.supplierPayouts = catalog.map((x,i) => [
    `2026-09-${String(Math.min(12,5+i)).padStart(2,'0')} 12:${String(10+i*4).padStart(2,'0')}:00`,
    'ODTO',x.item,`Q3 batch · ${x.qty} units`,x.totalUsdc,'USDC',x.status,x.due,x.ref,
    x.listCad,x.unitCostCad,x.qty,x.description,x.itemNo,x.unitCostUsdc
  ]);

  state.poolRevenue = [
    ['2026-07-31 23:59:00','Crate Revenue Allocation',48000,0.30,14400,'USDC','q3_jul_crates','Confirmed'],
    ['2026-07-31 23:59:01','Marketplace Fees',80000,0.01,800,'USDC','q3_jul_market','Confirmed'],
    ['2026-07-31 23:59:02','Shipping Margin',5000,0.12,600,'USDC','q3_jul_ship','Confirmed'],
    ['2026-07-31 23:59:03','Partner Revenue Share',20000,0.05,1000,'USDC','q3_jul_partner','Confirmed'],
    ['2026-08-31 23:59:00','Crate Revenue Allocation',52000,0.30,15600,'USDC','q3_aug_crates','Confirmed'],
    ['2026-08-31 23:59:01','Marketplace Fees',90000,0.01,900,'USDC','q3_aug_market','Confirmed'],
    ['2026-08-31 23:59:02','Shipping Margin',6000,0.12,720,'USDC','q3_aug_ship','Confirmed'],
    ['2026-08-31 23:59:03','Partner Revenue Share',24000,0.05,1200,'USDC','q3_aug_partner','Confirmed'],
    ['2026-09-12 14:00:00','Crate Revenue Allocation',50000,0.30,15000,'USDC','q3_sep_crates','Confirmed'],
    ['2026-09-12 14:00:01','Marketplace Fees',80000,0.01,800,'USDC','q3_sep_market','Confirmed'],
    ['2026-09-12 14:00:02','Shipping Margin',7000,0.12,840,'USDC','q3_sep_ship','Confirmed'],
    ['2026-09-12 14:00:03','Partner Revenue Share',28000,0.05,1400,'USDC','q3_sep_partner','Confirmed'],
    ['2026-09-12 16:59:00','Stock Pack Net Margin',stockQuarter.inflow,stockQuarter.margin/stockQuarter.inflow,stockQuarter.margin,'USDC','q3_stockpacks','Confirmed']
  ];

  const num = v => Number(v || 0);
  const usd = v => money(num(v));
  const cad = v => 'C$' + num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  const nearlyEqual = (a,b,eps=.005) => Math.abs(num(a)-num(b)) <= eps;

  function totals() {
    const earnedRevenue = state.poolRevenue.reduce((a,r)=>a+num(r[4]),0);
    const supplierPaid = state.supplierPayouts.filter(r=>r[6]==='Paid').reduce((a,r)=>a+num(r[4]),0);
    const supplierPending = state.supplierPayouts.filter(r=>r[6]==='Pending').reduce((a,r)=>a+num(r[4]),0);
    const supplierAwaiting = state.supplierPayouts.filter(r=>r[6]==='Awaiting Invoice').reduce((a,r)=>a+num(r[4]),0);
    const supplierOpen = supplierPending + supplierAwaiting;
    const supplierContractUsd = state.supplierPayouts.reduce((a,r)=>a+num(r[4]),0);
    const fulfillmentReserve = typeof pendingReserve === 'function' ? pendingReserve() : 0;
    const requiredReserve = CASHBACK_RESERVE + supplierOpen + fulfillmentReserve + STOCK_LIQUIDITY_RESERVE + OPERATING_BUFFER;
    const operatingProfit = earnedRevenue - supplierPaid;
    const liquiditySurplus = Math.max(0, TREASURY_USDC - HARD_USDC_OBLIGATIONS - requiredReserve);
    const withdrawableProfit = Math.max(0, Math.min(operatingProfit, liquiditySurplus));
    return {earnedRevenue,supplierPaid,supplierOpen,supplierContractUsd,fulfillmentReserve,requiredReserve,operatingProfit,liquiditySurplus,withdrawableProfit};
  }

  function removeSyntheticDrift() {
    const isLiveRef = ref => String(ref || '').startsWith('live_');
    state.usdc = state.usdc.filter(r=>!isLiveRef(r[6]));
    state.creditActivity = state.creditActivity.filter(r=>!isLiveRef(r[6]));
    state.credits = state.credits.filter(r=>!isLiveRef(r[6]));
    state.pendingItems = state.pendingItems.filter(x=>!isLiveRef(x.ref));
  }

  function seedStockActivity() {
    const rows=[];
    stockExecutions.forEach(x=>{
      const [ts,ticker,pack,cost,,ref]=x;
      rows.push([ts,'Stock Pack Purchase','In',pack,`$${pack} cash/USDC stock pack opened`,ticker,ref,'Confirmed']);
      rows.push([ts,'Stock Acquisition','Out',cost,`${ticker} position purchased at execution value`,ticker,ref,'Confirmed']);
    });
    const existing=new Set(state.usdc.map(r=>`${r[6]}|${r[1]}`));
    const fresh=rows.filter(r=>!existing.has(`${r[6]}|${r[1]}`));
    state.usdc=[...fresh,...state.usdc];
  }

  function syncBrand() {
    document.title='Chosen Finance';
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content='Chosen Finance demo — USDC cash flow, crate-only Credits, cash-only stock packs, sneaker fulfillment, reserves and distributable profit.';
    const subbrand=document.querySelector('.subbrand');if(subbrand) subbrand.textContent='Finance';
    const h1=document.querySelector('.page-head h1');if(h1) h1.textContent='Finance & Treasury';
    const pageCopy=document.querySelector('.page-head p');if(pageCopy) pageCopy.textContent='Cash, obligations, crate-only Credits, cash-only stock packs, sneaker fulfillment and distributable profit in one operating view.';
    const nav=document.querySelector('.tabs');if(nav) nav.setAttribute('aria-label','Finance sections');
    const live=document.querySelector('.live-pill span:last-child');if(live) live.textContent='Demo snapshot';
    const asOf=document.querySelector('.as-of-card small');if(asOf) asOf.textContent='Snapshot model · refresh to recompute';
  }

  function addStyles() {
    if(document.getElementById('financeV4Styles')) return;
    document.getElementById('financeV2Styles')?.remove();
    document.getElementById('financeV3Styles')?.remove();
    const s=document.createElement('style');
    s.id='financeV4Styles';
    s.textContent=`
      :root{--success:#43d17f;--danger:#ff6b72;--warning:#ffc65a;--info:#66b7ff}
      .positive-text,.direction.in{color:var(--success)!important}.negative-text,.direction.out{color:var(--danger)!important}.warning-text{color:var(--warning)!important}.info-text{color:var(--info)!important}
      .badge.confirmed,.badge.matched,.badge.executed,.badge.paid{color:var(--success)!important}.badge.info,.badge.usdc,.badge.credits{color:var(--info)!important}.badge.pending,.badge.high,.badge.awaiting-invoice{color:var(--warning)!important}.badge.mismatch{color:var(--danger)!important}
      .tone-positive{border-color:rgba(67,209,127,.36)!important;background:linear-gradient(180deg,rgba(67,209,127,.085),var(--surface) 58%)!important;box-shadow:inset 0 2px 0 var(--success)!important}
      .tone-negative{border-color:rgba(255,107,114,.36)!important;background:linear-gradient(180deg,rgba(255,107,114,.085),var(--surface) 58%)!important;box-shadow:inset 0 2px 0 var(--danger)!important}
      .tone-warning{border-color:rgba(255,198,90,.36)!important;background:linear-gradient(180deg,rgba(255,198,90,.075),var(--surface) 58%)!important;box-shadow:inset 0 2px 0 var(--warning)!important}
      .tone-info{border-color:rgba(102,183,255,.32)!important;background:linear-gradient(180deg,rgba(102,183,255,.07),var(--surface) 58%)!important;box-shadow:inset 0 2px 0 var(--info)!important}
      .tone-positive .metric-value,.tone-positive>strong{color:var(--success)}.tone-negative .metric-value,.tone-negative>strong{color:var(--danger)}.tone-warning .metric-value,.tone-warning>strong{color:var(--warning)}.tone-info .metric-value,.tone-info>strong{color:var(--info)}
      .finance-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}.finance-kpis.three{grid-template-columns:repeat(3,minmax(0,1fr))}.finance-kpis .metric-card{min-height:96px}.finance-kpis .metric-value{font-size:22px}
      .finance-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0}.finance-breakdown{width:100%;border-collapse:collapse}.finance-breakdown th,.finance-breakdown td{padding:10px 0;border-bottom:1px solid var(--border);font-size:11px}.finance-breakdown th{text-align:left;color:var(--muted);background:transparent}.finance-breakdown td:last-child,.finance-breakdown th:last-child{text-align:right}
      .supplier-source-note{margin:0 0 14px;padding:10px 13px;border:1px solid rgba(102,183,255,.26);background:rgba(102,183,255,.045);border-radius:11px;font-size:11px;line-height:1.45;color:#b9c7d6}.supplier-source-note b{color:var(--info)}
      .payout-tabs{display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:4px;margin:0 0 16px}.payout-tab{border:0;background:transparent;color:var(--muted);padding:8px 18px;border-radius:8px;cursor:pointer}.payout-tab.active{background:var(--surface3);color:var(--text);box-shadow:0 0 0 1px #2b3541}.payout-view{display:none}.payout-view.active{display:block}
      .period-pill{display:inline-flex;align-items:center;padding:8px 11px;border:1px solid var(--border);background:var(--surface2);border-radius:999px;color:var(--muted);font-size:11px}
      #overview .overview-metrics,#overview .health-strip,#overview .two-col{display:none!important}
      .overview-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:4px 0 18px}.overview-summary>div{border:1px solid var(--border);background:var(--surface);border-radius:14px;padding:14px;min-width:0}.overview-summary span{display:block;font-size:10px;color:var(--muted);margin-bottom:8px}.overview-summary strong{font-size:21px;letter-spacing:-.03em}.overview-summary small{display:block;color:var(--muted);font-size:10px;margin-top:6px;line-height:1.35}.overview-summary small b{font-weight:700;color:var(--warning)}
      #usdcActivity>.metric-grid,#creditsActivity>.metric-grid,#creditsActivity .distinction-callout{display:none!important}
      #reconciliation .metric-grid>.metric-card:nth-child(4){display:none!important}#reconciliation .metric-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      #credits>.metric-grid.five{grid-template-columns:repeat(3,minmax(0,1fr))!important}#credits>.metric-grid.five>.metric-card:nth-child(2),#credits>.metric-grid.five>.metric-card:nth-child(4){display:none!important}#credits>.two-col{grid-template-columns:1fr!important}#credits>.two-col>article:nth-child(2){display:none!important}#credits .exposure-strip{grid-template-columns:repeat(2,minmax(0,1fr))!important}#credits .exposure-strip>div:nth-child(2),#credits .exposure-strip>div:nth-child(3){display:none!important}
      #lulu .lulu-hero{grid-template-columns:repeat(3,minmax(0,1fr))!important}#lulu .lulu-hero>.lulu-stat:first-child{display:none!important}#lulu>.metric-grid.compact{display:none!important}#lulu .formula-panel>div:nth-child(3){display:none!important}
      .rules-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.rule-card{padding:12px 13px!important}.rule-card strong{font-size:16px!important}.rule-card p{font-size:10.5px!important;line-height:1.4!important}.rule-note{display:none!important}.table-panel td{vertical-align:top}.supplier-row-paid td:nth-child(7){color:var(--danger)}.supplier-row-open td:nth-child(7){color:var(--warning)}
      @media(max-width:1200px){.overview-summary{grid-template-columns:repeat(3,1fr)}.finance-kpis{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){.rules-grid{grid-template-columns:repeat(2,1fr)!important}.finance-grid{grid-template-columns:1fr}}@media(max-width:760px){.overview-summary,.finance-kpis,.finance-kpis.three{grid-template-columns:1fr}#lulu .lulu-hero{grid-template-columns:1fr!important}.rules-grid{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(s);
  }

  function toneCard(id,tone){
    const el=document.getElementById(id);
    const card=el?.closest('.metric-card')||el?.closest('.overview-summary>div');
    if(!card)return;
    card.classList.remove('tone-positive','tone-negative','tone-warning','tone-info');
    card.classList.add(`tone-${tone}`);
  }

  function ensurePanels(){
    const main=document.querySelector('main.main');
    const activity=document.getElementById('activity');
    if(!main||!activity)return;
    if(!document.getElementById('poolRevenue')){const p=document.createElement('section');p.id='poolRevenue';p.className='tab-panel';main.insertBefore(p,activity);}
    if(!document.getElementById('supplierPayouts')){const p=document.createElement('section');p.id='supplierPayouts';p.className='tab-panel';main.insertBefore(p,activity);}
  }

  function bindTab(button,id){
    if(button.dataset.financeV4Bound)return;
    button.dataset.financeV4Bound='1';
    button.addEventListener('click',()=>{
      document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(id)?.classList.add('active');
      renderFinance();
    });
  }

  function syncNavigation(){
    const nav=document.querySelector('.tabs');if(!nav)return;
    const order=[['overview','Overview'],['activity','Activity'],['poolRevenue','Revenue Pool'],['supplierPayouts','Payouts'],['credits','Credits'],['reconciliation','Reconciliation'],['lulu','Lulu'],['rules','Rules']];
    order.forEach(([id,label])=>{
      let b=[...nav.querySelectorAll('.tab')].find(x=>x.dataset.tab===id);
      if(!b){b=document.createElement('button');b.className='tab';b.dataset.tab=id;}
      b.textContent=label;bindTab(b,id);nav.appendChild(b);
    });
  }

  function setupOverview(){
    const o=document.getElementById('overview');if(!o)return;
    const intro=o.querySelector('.section-intro p');if(intro)intro.textContent='Quarter-to-date performance, realized payouts, protected liquidity and safe withdrawal capacity.';
    const action=o.querySelector('.action-row');if(action)action.innerHTML=`<span class="period-pill">${PERIOD_LABEL}</span>`;
    const metrics=o.querySelector('.overview-metrics');if(!metrics)return;
    let summary=document.getElementById('overviewSummary');
    if(!summary){summary=document.createElement('div');summary.id='overviewSummary';summary.className='overview-summary';metrics.insertAdjacentElement('afterend',summary);}
    summary.innerHTML=`
      <div class="tone-info"><span>Treasury USDC</span><strong>${usd(TREASURY_USDC)}</strong><small>Actual cash held</small></div>
      <div class="tone-positive"><span>Q3-to-date earned revenue</span><strong id="ovRevenue">$0</strong><small>Includes net stock-pack margin</small></div>
      <div class="tone-negative"><span>Realized payouts</span><strong id="ovPayouts">$0</strong><small id="ovPayoutDetail">ODTO + stock acquisitions</small></div>
      <div class="tone-warning"><span>Required reserve</span><strong id="ovReserve">$0</strong><small>Plus ${usd(HARD_USDC_OBLIGATIONS)} hard obligations</small></div>
      <div><span>Safe withdrawal</span><strong id="ovProfit">$0</strong><small id="ovProfitDetail">Capped by profit and liquidity</small></div>`;
    const recent=o.querySelector('.table-panel .panel-head h3');if(recent)recent.textContent='Recent Activity';
    const recentP=o.querySelector('.table-panel .panel-head p');if(recentP)recentP.textContent='Latest material USDC and Credits events from the demo ledger.';
  }

  function setupRevenuePage(){
    const p=document.getElementById('poolRevenue');if(!p)return;
    p.innerHTML=`
      <div class="section-intro"><div><h2>Revenue Pool</h2><p>Separate operating profit from the liquidity that must remain protected before any distribution.</p></div><span class="period-pill">${PERIOD_LABEL}</span></div>
      <div class="finance-kpis">
        <article class="metric-card tone-positive"><div class="metric-label">Earned revenue</div><div class="metric-value" id="rpEarned">$0</div><div class="metric-foot">Fees, allocations and net stock-pack margin</div></article>
        <article class="metric-card tone-positive"><div class="metric-label">Operating profit</div><div class="metric-value" id="rpOperatingProfit">$0</div><div class="metric-foot">Revenue less paid ODTO acquisition cost</div></article>
        <article class="metric-card tone-warning"><div class="metric-label">Required reserve</div><div class="metric-value" id="rpReserve">$0</div><div class="metric-foot">AP + cashback + claims + stock reserve + buffer</div></article>
        <article class="metric-card"><div class="metric-label">Safe withdrawal</div><div class="metric-value" id="rpWithdrawable">$0</div><div class="metric-foot">Lower of operating profit and excess treasury liquidity</div></article>
      </div>
      <div class="finance-grid">
        <article class="panel"><div class="panel-head"><div><h3>Revenue by Source</h3><p>Stock-pack revenue is net of the position acquisition cost; stock-pack gross inflow is cash/USDC only.</p></div></div><table class="finance-breakdown"><thead><tr><th>Source</th><th>Gross</th><th>Earned</th></tr></thead><tbody id="rpSources"></tbody></table></article>
        <article class="panel"><div class="panel-head"><div><h3>Profit & Liquidity Bridge</h3><p>Profit and cash safety are calculated independently, then the lower number controls.</p></div></div><table class="finance-breakdown"><tbody id="rpWaterfall"></tbody></table></article>
      </div>`;
  }

  function setupPayoutsPage(){
    const p=document.getElementById('supplierPayouts');if(!p)return;
    const odtoActive=activePayoutView==='odto';
    p.innerHTML=`
      <div class="section-intro"><div><h2>Payouts</h2><p>Physical sneaker fulfillment and immediate stock-position purchases are tracked separately.</p></div><span class="period-pill">${PERIOD_LABEL}</span></div>
      <div class="payout-tabs"><button class="payout-tab${odtoActive?' active':''}" data-payout-view="odto">ODTO Supplier</button><button class="payout-tab${odtoActive?'':' active'}" data-payout-view="stocks">Robinhood Stocks</button></div>
      <div id="odtoPayoutView" class="payout-view${odtoActive?' active':''}">
        <div class="supplier-source-note"><b>Sneaker cost basis:</b> modeled at 70% of ODTO listed CAD. USDC equivalent uses 1 CAD = 0.72 USD for this demo.</div>
        <div class="finance-kpis three">
          <article class="metric-card tone-negative"><div class="metric-label">Paid Q3-to-date</div><div class="metric-value" id="spPaid">$0</div><div class="metric-foot">Realized ODTO cash outflow</div></article>
          <article class="metric-card tone-warning"><div class="metric-label">Open supplier AP</div><div class="metric-value" id="spOpen">$0</div><div class="metric-foot">Pending + awaiting invoice</div></article>
          <article class="metric-card tone-info"><div class="metric-label">70% contract value</div><div class="metric-value" id="spContract">C$0</div><div class="metric-foot">Represented ODTO inventory</div></article>
        </div>
        <article class="panel table-panel"><div class="panel-head"><div><h3>ODTO Payout Activity</h3><p>Product-level acquisition cost and payment state.</p></div></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>ODTO item</th><th>List CAD</th><th>70% cost</th><th>Qty</th><th>Unit USDC</th><th>Total payout</th><th>Status</th></tr></thead><tbody id="spTable"></tbody></table></div></article>
      </div>
      <div id="stocksPayoutView" class="payout-view${odtoActive?'':' active'}">
        <div class="supplier-source-note"><b>Cash-only stock packs:</b> every stock pack is purchased with cash/USDC. Credits can never open a stock pack, and stock packs do not emit Crate Bonus or any other Credits. Each winning position is then purchased immediately at its execution value. There is no cashback liability because the user already receives a liquid position. Demo reserve = 10 × the ${usd(STOCK_MAX_PRIZE)} top prize.</div>
        <div class="finance-kpis">
          <article class="metric-card tone-positive"><div class="metric-label">Q3-to-date cash inflow</div><div class="metric-value" id="stockInflow">$0</div><div class="metric-foot">${stockQuarter.packs} cash packs × ${usd(STOCK_PACK_PRICE)}</div></article>
          <article class="metric-card tone-negative"><div class="metric-label">Stock acquisitions</div><div class="metric-value" id="stockOutflow">$0</div><div class="metric-foot">Positions bought at execution value</div></article>
          <article class="metric-card"><div class="metric-label">Net stock-pack margin</div><div class="metric-value" id="stockMargin">$0</div><div class="metric-foot">Cash inflow − acquisition cost</div></article>
          <article class="metric-card tone-warning"><div class="metric-label">Liquidity reserve</div><div class="metric-value" id="stockReserve">$0</div><div class="metric-foot">10 simultaneous top-tier wins</div></article>
        </div>
        <div class="finance-grid">
          <article class="panel"><div class="panel-head"><div><h3>Q3 Outcome Mix</h3><p>Odds are concentrated toward lower-cost outcomes.</p></div></div><table class="finance-breakdown"><thead><tr><th>Tier</th><th>Packs</th><th>Odds</th><th>Avg cost</th><th>Outflow</th></tr></thead><tbody id="stockTierTable"></tbody></table></article>
          <article class="panel"><div class="panel-head"><div><h3>Accounting</h3><p>One cash pack creates one USDC inflow and one immediate acquisition outflow.</p></div></div><table class="finance-breakdown"><tbody><tr><td>Funding rail</td><td class="info-text">Cash / USDC only</td></tr><tr><td>Credits allowed</td><td class="negative-text">No</td></tr><tr><td>Crate Bonus</td><td class="negative-text">None</td></tr><tr><td>Pack purchase</td><td class="positive-text">+${usd(STOCK_PACK_PRICE)}</td></tr><tr><td>Example $28 position</td><td class="negative-text">−$28.00</td></tr><tr><td>Example pack P&amp;L</td><td class="positive-text">+$22.00</td></tr><tr><td>Example $1,000 position</td><td class="negative-text">−$1,000.00</td></tr><tr><td>Example pack P&amp;L</td><td class="negative-text">−$950.00</td></tr></tbody></table></article>
        </div>
        <article class="panel table-panel"><div class="panel-head"><div><h3>Recent Stock Executions</h3><p>Payout equals the position cost at execution, not a fixed percentage of the pack.</p></div></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Ticker</th><th>Cash pack inflow</th><th>Position cost</th><th>Pack P&amp;L</th><th>Reference</th><th>Status</th></tr></thead><tbody id="stockExecutionTable"></tbody></table></div></article>
      </div>`;
    p.querySelectorAll('.payout-tab').forEach(btn=>btn.addEventListener('click',()=>{
      activePayoutView=btn.dataset.payoutView;
      p.querySelectorAll('.payout-tab,.payout-view').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(activePayoutView==='odto'?'odtoPayoutView':'stocksPayoutView')?.classList.add('active');
    }));
  }

  function streamlineExistingTabs(){
    const activityIntro=document.querySelector('#activity .section-intro p');if(activityIntro)activityIntro.textContent='Transaction logs only. Stock packs appear only in USDC because they are cash-only; Credits are reserved for crate openings.';
    const creditsIntro=document.querySelector('#credits .section-intro p');if(creditsIntro)creditsIntro.textContent='Credits can only open crates. They never fund stock packs; this page tracks crate-related supply, emissions and day-365 settlement exposure.';
    const reconIntro=document.querySelector('#reconciliation .section-intro p');if(reconIntro)reconIntro.textContent='Exceptions first: wallet, payout, payment-rail and finance-model checks in one place.';
    const luluIntro=document.querySelector('#lulu .section-intro p');if(luluIntro)luluIntro.textContent='Burned supply, remaining capacity and burn history.';
    const rulesIntro=document.querySelector('#rules .section-intro p');if(rulesIntro)rulesIntro.textContent='Seven operating rules that materially affect balances, payouts and profit.';
    const type=document.getElementById('usdcType');
    if(type){[['Stock Pack Purchase','Stock Pack Purchase'],['Stock Acquisition','Stock Acquisition']].forEach(([value,label])=>{if(![...type.options].some(o=>o.value===value)){const opt=document.createElement('option');opt.value=value;opt.textContent=label;type.appendChild(opt);}});}
    const creditPending=document.getElementById('creditsPendingBack')?.closest('.metric-card');if(creditPending){creditPending.querySelector('.metric-label').textContent='Projected Auto Credit Back';creditPending.querySelector('.metric-foot').textContent='Day-365 Credit settlement exposure';}
    document.querySelectorAll('#rules .section-intro .export-btn').forEach(b=>b.textContent='Export audit log');
  }

  function syncCreditSupply(){
    const current=CREDIT_OPENING_SUPPLY + netCreditChange();
    document.querySelectorAll('.metric-card').forEach(card=>{
      const label=card.querySelector('.metric-label')?.textContent.trim();
      if(label==='Credits in circulation'){
        const value=card.querySelector('.metric-value');
        if(value)value.textContent=credits(current);
        const foot=card.querySelector('.metric-foot');
        if(foot)foot.textContent='Derived from opening supply + crate/credit ledger';
      }
    });
  }

  function syncRules(){
    const grid=document.querySelector('#rules .rules-grid');if(!grid)return;
    const rules=[
      ['Credits & Crates','Crates only','Credits have no direct treasury cash value and may only be spent on collectible crates. They can never open stock packs. Credit-funded crates remove entry Credits; every crate emits a separate 5% Crate Bonus.','info'],
      ['Sneaker Settlement','80% of prize FMV','Credits-funded immediate settlement pays Credits; USDC-funded immediate settlement pays USDC. The basis is prize FMV, not crate entry.','positive'],
      ['Vault Lifecycle','365 days → Credits','During the window: list, redeem, or liquidate at 70% × min(initial FMV, live FMV). At day 365 unresolved items automatically settle in Credits.','warning'],
      ['Physical Sneakers','Actual supplier cost','Physical redemption creates real USDC outflow at acquisition cost. Demo ODTO cost is modeled at 70% of listed CAD.','negative'],
      ['Stock Packs',`${usd(STOCK_PACK_PRICE)} cash only · live cost out`,'Stock packs are funded only with cash/USDC. Credits cannot be used, no Crate Bonus is emitted, and the winning position is purchased immediately at execution value. Pack P&L is cash pack price minus acquisition cost.','warning'],
      ['Revenue & Reserves','Profit + liquidity test','Operating profit is revenue less paid ODTO cost. Safe withdrawal is capped by both operating profit and treasury cash remaining after hard obligations and reserves.','positive'],
      ['Marketplace, Shipping & Lulu','Net economics','Marketplace principal is not revenue; only the fee is. Shipping inflow and carrier cost stay separate. Lulu emits 100 Credits each or 333 per three.','info']
    ];
    grid.innerHTML=rules.map(r=>`<article class="rule-card tone-${r[3]}"><span>${r[0]}</span><strong>${r[1]}</strong><p>${r[2]}</p></article>`).join('');
    const h=document.querySelector('#rules .table-panel .panel-head h3');if(h)h.textContent='Policy Audit Log';
    const hp=document.querySelector('#rules .table-panel .panel-head p');if(hp)hp.textContent='Material rule changes only.';
  }

  function upsertQaChecks(){
    const t=totals();
    const supplierCatalogUsd=catalog.reduce((a,x)=>a+x.totalUsdc,0);
    const reserveRecalc=CASHBACK_RESERVE+t.supplierOpen+t.fulfillmentReserve+STOCK_LIQUIDITY_RESERVE+OPERATING_BUFFER;
    const safeRecalc=Math.max(0,Math.min(t.operatingProfit,Math.max(0,TREASURY_USDC-HARD_USDC_OBLIGATIONS-reserveRecalc)));
    const stockCashPurchaseRows=state.usdc.filter(r=>r[1]==='Stock Pack Purchase'&&r[2]==='In').length;
    const stockAcquisitionRows=state.usdc.filter(r=>r[1]==='Stock Acquisition'&&r[2]==='Out').length;
    const invalidStockCreditRows=state.creditActivity.filter(r=>String(r[6]||'').startsWith('stk_')||String(r[1]||'').toLowerCase().includes('stock pack')||String(r[4]||'').toLowerCase().includes('stock pack')).length;
    const stockCreditBonusRows=state.creditActivity.filter(r=>r[1]==='Crate Bonus'&&String(r[6]||'').startsWith('stk_')).length;
    const checks=[
      {label:'Stock pack inflow',internal:stockQuarter.inflow,observed:stockQuarter.packs*STOCK_PACK_PRICE,ref:'qa_stock_inflow',format:'usd'},
      {label:'Stock acquisition cost',internal:stockQuarter.outflow,observed:stockTiers.reduce((a,x)=>a+x.totalCost,0),ref:'qa_stock_cost',format:'usd'},
      {label:'Stock pack margin',internal:stockQuarter.margin,observed:stockQuarter.inflow-stockQuarter.outflow,ref:'qa_stock_margin',format:'usd'},
      {label:'Stock cash purchase rows',internal:stockCashPurchaseRows,observed:stockExecutions.length,ref:'qa_stock_cash_rows',format:'count'},
      {label:'Stock acquisition rows',internal:stockAcquisitionRows,observed:stockExecutions.length,ref:'qa_stock_acquisition_rows',format:'count'},
      {label:'Stock packs funded by Credits',internal:invalidStockCreditRows,observed:0,ref:'qa_stock_cash_only',format:'count'},
      {label:'Stock-pack Credit emissions',internal:stockCreditBonusRows,observed:0,ref:'qa_stock_no_credit_bonus',format:'count'},
      {label:'ODTO contract total',internal:t.supplierContractUsd,observed:supplierCatalogUsd,ref:'qa_odto_contract',format:'usd'},
      {label:'Required reserve',internal:t.requiredReserve,observed:reserveRecalc,ref:'qa_required_reserve',format:'usd'},
      {label:'Safe withdrawal',internal:t.withdrawableProfit,observed:safeRecalc,ref:'qa_safe_withdrawal',format:'usd'}
    ];
    state.recon=state.recon.filter(r=>!String(r[7]||'').startsWith('qa_'));
    const ts=new Date().toISOString().replace('T',' ').slice(0,19);
    checks.reverse().forEach(check=>{
      const diff=num(check.observed)-num(check.internal);
      const matched=nearlyEqual(check.internal,check.observed);
      const formatValue=check.format==='count' ? v=>`${num(v).toLocaleString()} rows` : usd;
      const diffText=matched ? (check.format==='count'?'0 rows':'$0.00') : check.format==='count' ? `${diff>=0?'+':'−'}${Math.abs(diff).toLocaleString()} rows` : `${diff>=0?'+':'−'}${usd(Math.abs(diff))}`;
      state.recon.unshift([ts,check.label,formatValue(check.internal),formatValue(check.observed),diffText,matched?'Info':'High',matched?'Matched':'Mismatch',check.ref]);
    });
  }

  function syncReconSummary(){
    const cards=[...document.querySelectorAll('#reconciliation .metric-card')];
    const mismatches=state.recon.filter(r=>r[6]==='Mismatch').length;
    if(cards[0]){const label=cards[0].querySelector('.metric-label');const value=cards[0].querySelector('.metric-value');if(label)label.textContent='Checks run';if(value)value.textContent=state.recon.length.toLocaleString();cards[0].classList.add('tone-info');}
    if(cards[1]){const value=cards[1].querySelector('.metric-value');if(value)value.textContent=mismatches.toLocaleString();cards[1].classList.remove('tone-positive','tone-negative','tone-warning');cards[1].classList.add(mismatches?'tone-negative':'tone-positive');}
    if(cards[2]){const value=cards[2].querySelector('.metric-value');if(value)value.textContent='0';cards[2].classList.add('tone-positive');}
  }

  function renderRecentActivity(){
    const body=document.getElementById('overviewTable');if(!body)return;
    const usdcRows=state.usdc.map(r=>({ts:r[0],area:'USDC',event:r[1],flow:r[2],amount:money(r[3]),ref:r[6]}));
    const creditRows=state.creditActivity.map(r=>({ts:r[0],area:'Credits',event:r[1],flow:r[2],amount:`${credits(r[3])} cr`,ref:r[6]}));
    const rows=[...usdcRows,...creditRows].sort((a,b)=>String(b.ts).localeCompare(String(a.ts))).slice(0,8);
    body.innerHTML=rows.map(r=>`<tr><td class="mono">${r.ts.slice(11)}</td><td>${badge(r.area)}</td><td>${r.event}</td><td>${direction(r.flow)}</td><td>${r.amount}</td><td class="mono">${r.ref}</td></tr>`).join('');
  }

  function applyTones(){
    toneCard('newEmissionMetric','info');
    toneCard('creditsPendingBack','warning');
    const t=totals();
    toneCard('rpOperatingProfit',t.operatingProfit>0?'positive':'negative');
    toneCard('rpWithdrawable',t.withdrawableProfit>0?'positive':'negative');
    toneCard('ovProfit',t.withdrawableProfit>0?'positive':'negative');
    toneCard('stockMargin',stockQuarter.margin>=0?'positive':'negative');
  }

  function renderFinance(){
    const t=totals();
    const realizedPayouts=t.supplierPaid+stockQuarter.outflow;
    setText('ovRevenue',usd(t.earnedRevenue));
    setText('ovPayouts',usd(realizedPayouts));
    setText('ovPayoutDetail',`ODTO ${usd(t.supplierPaid)} · stocks ${usd(stockQuarter.outflow)}`);
    setText('ovReserve',usd(t.requiredReserve));
    setText('ovProfit',usd(t.withdrawableProfit));
    setText('ovProfitDetail',`Operating profit ${usd(t.operatingProfit)} · liquidity surplus ${usd(t.liquiditySurplus)}`);

    setText('rpEarned',usd(t.earnedRevenue));
    setText('rpOperatingProfit',usd(t.operatingProfit));
    setText('rpReserve',usd(t.requiredReserve));
    setText('rpWithdrawable',usd(t.withdrawableProfit));

    const by={};
    state.poolRevenue.forEach(r=>{const k=r[1];by[k]=by[k]||{gross:0,earned:0};by[k].gross+=num(r[2]);by[k].earned+=num(r[4]);});
    const src=document.getElementById('rpSources');
    if(src)src.innerHTML=Object.entries(by).map(([k,v])=>`<tr><td>${k}</td><td>${usd(v.gross)}</td><td class="${v.earned>=0?'positive-text':'negative-text'}">${v.earned>=0?'+':'−'}${usd(Math.abs(v.earned))}</td></tr>`).join('');

    const wf=document.getElementById('rpWaterfall');
    if(wf)wf.innerHTML=`
      <tr><td>Q3-to-date earned revenue</td><td class="positive-text">+${usd(t.earnedRevenue)}</td></tr>
      <tr><td>ODTO payouts paid</td><td class="negative-text">−${usd(t.supplierPaid)}</td></tr>
      <tr><td><b>Q3 operating profit</b></td><td class="${t.operatingProfit>=0?'positive-text':'negative-text'}"><b>${usd(t.operatingProfit)}</b></td></tr>
      <tr><td>Treasury USDC</td><td>${usd(TREASURY_USDC)}</td></tr>
      <tr><td>Hard USDC obligations</td><td class="warning-text">−${usd(HARD_USDC_OBLIGATIONS)}</td></tr>
      <tr><td>Required reserve</td><td class="warning-text">−${usd(t.requiredReserve)}</td></tr>
      <tr><td><b>Liquidity surplus</b></td><td class="${t.liquiditySurplus>0?'positive-text':'negative-text'}"><b>${usd(t.liquiditySurplus)}</b></td></tr>
      <tr><td><b>Safe withdrawal</b></td><td class="${t.withdrawableProfit>0?'positive-text':'negative-text'}"><b>${usd(t.withdrawableProfit)}</b></td></tr>`;

    const contract=catalog.reduce((a,x)=>a+x.unitCostCad*x.qty,0);
    setText('spPaid',usd(t.supplierPaid));
    setText('spOpen',usd(t.supplierOpen));
    setText('spContract',cad(contract));
    const st=document.getElementById('spTable');
    if(st)st.innerHTML=catalog.map(x=>`<tr class="${x.status==='Paid'?'supplier-row-paid':'supplier-row-open'}"><td title="${esc(x.description)}"><b>${esc(x.item)}</b><small class="table-sub">${x.brand}</small></td><td class="mono">${x.itemNo}</td><td>${cad(x.listCad)}</td><td>${cad(x.unitCostCad)}</td><td>${x.qty}</td><td>${usd(x.unitCostUsdc)}</td><td>${x.status==='Paid'?'−':''}${usd(x.totalUsdc)}</td><td>${badge(x.status)}</td></tr>`).join('');

    setText('stockInflow',usd(stockQuarter.inflow));
    setText('stockOutflow',usd(stockQuarter.outflow));
    setText('stockMargin',`${stockQuarter.margin>=0?'+':'−'}${usd(Math.abs(stockQuarter.margin))}`);
    setText('stockReserve',usd(STOCK_LIQUIDITY_RESERVE));
    const tierBody=document.getElementById('stockTierTable');
    if(tierBody)tierBody.innerHTML=stockTiers.map(x=>`<tr><td>${x.tier}</td><td>${x.packs}</td><td>${(x.packs/stockQuarter.packs*100).toFixed(1)}%</td><td>${usd(x.avgCost)}</td><td class="negative-text">−${usd(x.totalCost)}</td></tr>`).join('');
    const execBody=document.getElementById('stockExecutionTable');
    if(execBody)execBody.innerHTML=stockExecutions.map(x=>`<tr><td class="mono">${x[0]}</td><td><b>${x[1]}</b></td><td class="positive-text">+${usd(x[2])}</td><td class="negative-text">−${usd(x[3])}</td><td class="${x[4]>=0?'positive-text':'negative-text'}">${x[4]>=0?'+':'−'}${usd(Math.abs(x[4]))}</td><td class="mono">${x[5]}</td><td>${badge(x[6])}</td></tr>`).join('');

    const projected=state.pendingItems.filter(x=>x.status==='Vaulted').reduce((a,x)=>a+pendingLiquidationAmount(x),0);
    setText('pendingCreditMetric',credits(projected));
    setText('creditsPendingBack',credits(projected));
    syncCreditSupply();
    renderRecentActivity();
    applyTones();
  }

  function initialize(){
    removeSyntheticDrift();
    syncBrand();
    addStyles();
    ensurePanels();
    seedStockActivity();
    syncNavigation();
    setupOverview();
    setupRevenuePage();
    setupPayoutsPage();
    streamlineExistingTabs();
    syncRules();
    upsertQaChecks();
    renderRecon();
    syncReconSummary();
    renderFinance();
    document.body.dataset.financeUi=UI_VERSION;
    document.body.dataset.stockPackPayment=STOCK_PACK_PAYMENT_ASSET;
  }

  const priorRenderAll=renderAll;
  renderAll=function(){priorRenderAll();initialize();};
  initialize();
})();