const LULU_SUPPLY = 3333;
const LULU_MAX = Math.floor(LULU_SUPPLY / 3) * 333 + (LULU_SUPPLY % 3) * 100;
const CRATE_BONUS_RATE = 0.05;
const INSTANT_SETTLEMENT_RATE = 0.80;
const PENDING_LIQUIDATION_RATE = 0.70;
const PENDING_LIQUIDATION_DAYS = 365;
const TREASURY_USDC = 128440.22;
const HARD_USDC_OBLIGATIONS = 31280.40;

const state = {
  activityView: 'usdc',
  luluBurned: 37,
  luluEmitted: 4096,
  usdc: [
    ['2026-09-12 13:20:42','Crate Purchase','In',250,'$250 USDC crate opened','usr_7J2K','corr_usdc_01','Confirmed'],
    ['2026-09-12 13:19:58','Cashback','Out',144,'$180 prize FMV × 80% USDC cashback','usr_7J2K','corr_cash_01','Confirmed'],
    ['2026-09-12 13:12:20','Shipping Collected','In',24.95,'UPS shipping charge collected from user','usr_2P8D','ship_8e13','Confirmed'],
    ['2026-09-12 13:12:21','Shipping Cost','Out',18.40,'UPS label + handling cost','usr_2P8D','ship_8e13','Confirmed'],
    ['2026-09-12 13:11:52','Item Redemption','Out',280,'Physical claim: item acquired at actual cost basis','usr_2P8D','claim_8e13','Confirmed'],
    ['2026-09-12 13:06:07','Marketplace Fee','In',12.50,'1% fee on $1,250 marketplace sale','usr_4W1A','mkt_81a2','Confirmed'],
    ['2026-09-12 12:59:36','Crate Purchase','In',1000,'$1,000 USDC crate opened','usr_1TR8','corr_usdc_02','Confirmed'],
    ['2026-09-12 12:58:19','Cashback','Out',800,'$1,000 prize FMV × 80% USDC cashback','usr_1TR8','corr_cash_02','Confirmed'],
    ['2026-09-12 12:40:12','Crate Purchase','In',100,'$100 USDC crate opened','usr_6LM2','corr_usdc_03','Confirmed'],
    ['2026-09-12 12:29:03','Marketplace Fee','In',6.55,'1% fee on $655 marketplace sale','usr_8Q4E','mkt_a817','Confirmed']
  ],
  creditActivity: [
    ['2026-09-12 13:20:43','Crate Bonus','In',12.50,'5% bonus on $250 crate · paid with USDC','usr_7J2K','corr_usdc_01','Confirmed'],
    ['2026-09-12 13:15:03','Credit Spend','Out',100,'100 Credit crate entry','usr_2P8D','corr_credit_high','Confirmed'],
    ['2026-09-12 13:15:04','Credit Back','In',800,'$1,000 prize FMV × 80% · net-expansive outcome','usr_2P8D','corr_credit_high','Confirmed'],
    ['2026-09-12 13:15:05','Crate Bonus','In',5,'5% bonus on $100-equivalent crate','usr_2P8D','corr_credit_high','Confirmed'],
    ['2026-09-12 13:08:03','Credit Spend','Out',100,'100 Credit crate entry','usr_3X5Q','corr_credit_low','Confirmed'],
    ['2026-09-12 13:08:04','Credit Back','In',64,'$80 prize FMV × 80% · net-deflationary outcome','usr_3X5Q','corr_credit_low','Confirmed'],
    ['2026-09-12 13:08:05','Crate Bonus','In',5,'5% bonus on $100-equivalent crate','usr_3X5Q','corr_credit_low','Confirmed'],
    ['2026-09-12 12:49:36','Lulu Emission','In',333,'3 Lulus burned · includes 33 bonus','usr_1TR8','0xa16ed92f5…','Confirmed'],
    ['2026-09-12 12:46:19','Promotional Run','In',250,'September collector campaign','usr_9N3F','promo_sep12','Confirmed'],
    ['2026-09-12 12:40:13','Crate Bonus','In',5,'5% bonus on $100 crate · paid with USDC','usr_6LM2','corr_usdc_03','Confirmed'],
    ['2026-09-12 12:35:55','Credit Spend','Out',250,'250 Credit crate entry · prize moved to vault','usr_5V9R','vault_5v9r','Confirmed'],
    ['2026-09-12 12:35:56','Crate Bonus','In',12.50,'5% bonus on 250 Credit crate','usr_5V9R','vault_5v9r','Confirmed'],
    ['2026-09-12 11:52:14','Promotional Run','In',100,'New-user activation campaign','usr_0K1C','promo_newuser','Confirmed']
  ],
  pendingItems: [
    {opened:'2026-09-12 12:35:55',user:'usr_5V9R',item:'Jordan 1 Low',paidWith:'Credits',entry:250,initialFmv:300,marketFmv:340,expectedCost:280,daysLeft:352,status:'Vaulted',ref:'vault_5v9r'},
    {opened:'2026-09-11 22:14:09',user:'usr_4W1A',item:'Rare sneaker grail',paidWith:'Credits',entry:100,initialFmv:1000,marketFmv:1200,expectedCost:875,daysLeft:364,status:'Vaulted',ref:'vault_4w1a'},
    {opened:'2026-09-09 17:03:44',user:'usr_8Q4E',item:'Jordan 4',paidWith:'USDC',entry:500,initialFmv:420,marketFmv:360,expectedCost:390,daysLeft:362,status:'Vaulted',ref:'vault_8q4e'},
    {opened:'2026-08-02 09:41:28',user:'usr_7B4Q',item:'New Balance 9060',paidWith:'Credits',entry:100,initialFmv:80,marketFmv:65,expectedCost:68,daysLeft:324,status:'Vaulted',ref:'vault_7b4q'}
  ],
  recon: [
    ['2026-09-12 13:18:12','USDC wallet · 0x41a…d91','$18,300.00','$18,295.00','-$5.00','High','Mismatch','tx_8b7c11'],
    ['2026-09-12 13:18:12','USDC wallet · 0x8d2…a31','$22,408.18','$22,408.18','$0.00','Info','Matched','wallet_8d2'],
    ['2026-09-12 13:18:11','Credits balance · usr_7J2K','2,492.50 cr','2,492.50 cr','0 cr','Info','Matched','usr_7J2K'],
    ['2026-09-12 13:18:11','Pending item register','4 items','4 items','0','Info','Matched','vault_items'],
    ['2026-09-12 13:18:11','Pending Credit liquidation exposure','955.50 cr','955.50 cr','0 cr','Info','Matched','pending_credit_liquidation'],
    ['2026-09-12 13:18:11','Pending fulfillment reserve','$1,613.00','$1,613.00','$0.00','Info','Matched','pending_fulfillment'],
    ['2026-09-12 13:18:11','Lulu emission record','4,096 cr','4,096 cr','0 cr','Info','Matched','lulu_emissions']
  ],
  credits: [
    ['2026-09-12 13:20:43','usr_7J2K','Crate Bonus','+12.50','2,492.50','5% on $250 USDC crate','corr_usdc_01','Confirmed'],
    ['2026-09-12 13:15:03','usr_2P8D','Credit Spend','-100.00','4,110.00','100 Credit crate entry','corr_credit_high','Confirmed'],
    ['2026-09-12 13:15:04','usr_2P8D','Credit Back','+800.00','4,910.00','$1,000 prize FMV × 80%','corr_credit_high','Confirmed'],
    ['2026-09-12 13:15:05','usr_2P8D','Crate Bonus','+5.00','4,915.00','5% bonus on $100-equivalent crate','corr_credit_high','Confirmed'],
    ['2026-09-12 13:08:03','usr_3X5Q','Credit Spend','-100.00','1,250.00','100 Credit crate entry','corr_credit_low','Confirmed'],
    ['2026-09-12 13:08:04','usr_3X5Q','Credit Back','+64.00','1,314.00','$80 prize FMV × 80%','corr_credit_low','Confirmed'],
    ['2026-09-12 13:08:05','usr_3X5Q','Crate Bonus','+5.00','1,319.00','5% bonus on $100-equivalent crate','corr_credit_low','Confirmed'],
    ['2026-09-12 12:49:36','usr_1TR8','Lulu Emission','+333.00','2,033.00','3 Lulu burn','0xa16ed92f5…','Confirmed'],
    ['2026-09-12 12:46:19','usr_9N3F','Promotional Run','+250.00','3,600.00','September collector campaign','promo_sep12','Confirmed'],
    ['2026-09-12 12:35:55','usr_5V9R','Credit Spend','-250.00','1,250.00','250 Credit crate; prize vaulted','vault_5v9r','Confirmed'],
    ['2026-09-12 12:35:56','usr_5V9R','Crate Bonus','+12.50','1,262.50','5% bonus; item remains pending','vault_5v9r','Confirmed']
  ],
  lulu: [
    ['2026-07-28 00:33:39','usr_1TR8','36, 37','2','200','0','0xa16ed92f5…','Confirmed'],
    ['2026-07-14 04:56:13','usr_1TR8','35','1','100','0','0x6c758d0f6…','Confirmed'],
    ['2026-07-08 18:54:40','usr_1TR8','33, 34','2','200','0','0x0bff3d2a7…','Confirmed'],
    ['2026-07-03 20:20:04','usr_1TR8','26, 27, 28','3','333','33','0xa1bbfa767…','Confirmed'],
    ['2026-07-03 19:22:37','usr_7B4Q','41, 42, 43','3','333','33','0x6cba20bff…','Confirmed']
  ],
  rules: [
    ['2026-09-12 13:31:00','Pending liquidation','80% auto fallback at day 365','70% × min(initial FMV, live FMV), available for 365 days','admin','Cap upside exposure, follow market downside, and remove perpetual liquidation availability'],
    ['2026-09-12 13:26:00','Credit accounting','USD-like liability','Non-cash platform units','admin','Do not assign cash value until prize settlement creates a real cash event'],
    ['2026-09-12 13:26:00','Credit Back basis','80% of crate price','80% of prize FMV','admin','Outcome value can make a crate deflationary or inflationary in Credits'],
    ['2026-09-12 13:26:00','Physical redemption','Prize FMV','Actual cost basis','admin','Cash treasury should reflect what Chosen actually pays to fulfill'],
    ['2026-09-12 13:25:00','Crate Bonus','5% Credit Back','5% Crate Bonus','admin','Separate bonus emissions from outcome settlement'],
    ['2026-06-13 09:05:56','Marketplace Fee','—','1%','system','Demo marketplace fee'],
    ['2026-06-13 09:05:56','Lulu Single','—','100 Credits','system','Lulu burn program'],
    ['2026-06-13 09:05:56','Lulu Triple','—','333 Credits','system','Lulu bonus rule']
  ]
};

const money = n => '$' + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const credits = n => Number(n).toLocaleString(undefined,{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const badge = v => `<span class="badge ${String(v).toLowerCase().replace(/\s/g,'-')}">${esc(v)}</span>`;
const direction = v => `<span class="direction ${v.toLowerCase()}">${v==='In'?'+':'−'} ${v}</span>`;

function sumRows(rows,type,dir){ return rows.filter(r=>(!type||r[1]===type)&&(!dir||r[2]===dir)).reduce((a,r)=>a+Number(r[3]),0); }
function setText(id,value){ const el=document.getElementById(id); if(el) el.textContent=value; }
function liquidationBasis(x){ return Math.min(Number(x.initialFmv),Number(x.marketFmv)); }
function pendingLiquidationAmount(x){ return liquidationBasis(x)*PENDING_LIQUIDATION_RATE; }
function liquidationEligible(x){ return x.status==='Vaulted' && x.daysLeft>0 && x.daysLeft<=PENDING_LIQUIDATION_DAYS; }
function pendingCreditLiquidation(){ return state.pendingItems.filter(x=>liquidationEligible(x)&&x.paidWith==='Credits').reduce((a,x)=>a+pendingLiquidationAmount(x),0); }
function pendingUsdcLiquidation(){ return state.pendingItems.filter(x=>liquidationEligible(x)&&x.paidWith==='USDC').reduce((a,x)=>a+pendingLiquidationAmount(x),0); }
function pendingReserve(){ return state.pendingItems.filter(x=>x.status==='Vaulted').reduce((a,x)=>a+x.expectedCost,0); }
function totalCreditInflows(){ return state.creditActivity.filter(r=>r[2]==='In').reduce((a,r)=>a+Number(r[3]),0); }
function totalCreditOutflows(){ return state.creditActivity.filter(r=>r[2]==='Out').reduce((a,r)=>a+Number(r[3]),0); }
function netCreditChange(){ return totalCreditInflows()-totalCreditOutflows(); }
function newCreditEmissions(){ return ['Crate Bonus','Lulu Emission','Promotional Run'].reduce((sum,t)=>sum+sumRows(state.creditActivity,t,'In'),0); }
function totalCreditBack(){ return sumRows(state.creditActivity,'Credit Back','In'); }

function syncPolicyCopy(){
  const setCard=(label,strong,body)=>{
    const card=[...document.querySelectorAll('#rules .rule-card')].find(c=>c.querySelector('span')?.textContent.trim()===label);
    if(card) card.innerHTML=`<span>${label}</span><strong>${strong}</strong><p>${body}</p>`;
    return card;
  };
  setCard('Vaulted Item','Pending','No cash leaves while vaulted. Liquidation is a separate time-limited option.');
  const expiry=[...document.querySelectorAll('#rules .rule-card')].find(c=>c.querySelector('span')?.textContent.trim()==='365-Day Expiry');
  if(expiry) expiry.innerHTML='<span>Pending Liquidation</span><strong>70% capped</strong><p>Available for 365 days only: 70% × min(initial prize FMV, current live FMV).</p>';
  const grid=document.querySelector('#rules .rules-grid');
  if(grid && ![...grid.querySelectorAll('.rule-card span')].some(x=>x.textContent.trim()==='Market Protection')){
    const shipping=[...grid.querySelectorAll('.rule-card')].find(c=>c.querySelector('span')?.textContent.trim()==='Shipping');
    const market=document.createElement('article'); market.className='rule-card'; market.innerHTML='<span>Market Protection</span><strong>Lower value wins</strong><p>If market rises, payout is capped at the initial prize FMV. If market falls, payout uses the lower live FMV.</p>';
    const windowCard=document.createElement('article'); windowCard.className='rule-card'; windowCard.innerHTML='<span>365-Day Window</span><strong>Expires</strong><p>After 365 days, the liquidation option is unavailable. No automatic fallback is paid.</p>';
    grid.insertBefore(market,shipping||null); grid.insertBefore(windowCard,shipping||null);
  }
  const note=document.querySelector('#rules .rule-note');
  if(note) note.innerHTML='<b>Accounting boundary:</b> a vaulted prize can have an initial FMV, a live FMV, a time-limited liquidation amount, and an expected cost basis without any USDC actually moving. Pending liquidation is 70% × min(initial FMV, live FMV) and is available for 365 days only. Physical redemption instead realizes the actual acquisition cost as USDC outflow.';

  const pendingHead=[...document.querySelectorAll('#credits .subsection-head h3')].find(x=>x.textContent.trim()==='Pending item exposure');
  if(pendingHead){ const p=pendingHead.parentElement?.querySelector('p'); if(p) p.textContent='These prizes are still theoretical. During the 365-day window, each can liquidate at a capped market-aware rate or become a real USDC fulfillment cost if physically redeemed.'; }
  const creditExp=document.getElementById('pendingCreditBackExposure'); if(creditExp?.previousElementSibling) creditExp.previousElementSibling.textContent='Pending Credit liquidation';
  const usdcExp=document.getElementById('pendingUsdcFallback'); if(usdcExp?.previousElementSibling) usdcExp.previousElementSibling.textContent='Pending USDC liquidation';
  const pendingTable=document.querySelector('#pendingItemsTable')?.closest('table')?.querySelector('thead tr');
  if(pendingTable) pendingTable.innerHTML='<th>Opened</th><th>User</th><th>Item</th><th>Paid with</th><th>Entry</th><th>Initial FMV</th><th>Live FMV</th><th>70% liquidation</th><th>Expected cost</th><th>Days left</th><th>Status</th>';

  const metric=document.getElementById('pendingCreditMetric')?.closest('.metric-card');
  if(metric){ metric.querySelector('.metric-label').textContent='Pending Credit Liquidation'; metric.querySelector('.metric-foot').textContent='70% capped liquidation within 365 days'; }
  const creditsMetric=document.getElementById('creditsPendingBack')?.closest('.metric-card');
  if(creditsMetric){ creditsMetric.querySelector('.metric-label').textContent='Pending Credit Liquidation'; creditsMetric.querySelector('.metric-foot').textContent='Potential 70% liquidation within claim window'; }

  const settlePanel=[...document.querySelectorAll('#credits .panel h3')].find(x=>x.textContent.trim()==='How Credits settle')?.closest('.panel');
  if(settlePanel){
    const stack=settlePanel.querySelector('.info-stack');
    if(stack) stack.innerHTML='<div><b>Credit Back</b><span>80% of the prize\'s live FMV when a Credits-funded prize is cashed back immediately. It may be lower or higher than the entry Credits.</span></div><div><b>Vaulted prize</b><span>No immediate Credit Back and no USDC outflow. It becomes pending exposure.</span></div><div><b>Pending liquidation</b><span>For 365 days, liquidation is 70% × the lower of initial prize FMV or current live FMV. Upside is capped; downside follows the market.</span></div><div><b>Physical redemption</b><span>The theoretical prize becomes real cash cost: Chosen records the actual product cost basis as USDC outflow.</span></div><div><b>After 365 days</b><span>The liquidation option expires. There is no automatic fallback payout.</span></div>';
  }
  document.querySelectorAll('#creditActivityType option, #creditsSource option').forEach(o=>{ if(o.textContent.trim()==='Expiry Credit Back') o.remove(); });
  document.querySelectorAll('.mix-row').forEach(row=>{ const title=row.querySelector('strong')?.textContent.trim(); if(title==='Vaulted item'){ const span=row.querySelector('span'); if(span) span.textContent='Creates time-limited liquidation exposure plus an expected fulfillment cost reserve.'; } });
}

function renderOverview(){
  const reserve=pendingReserve();
  setText('overviewPendingReserve',money(reserve));
  setText('overviewAvailableUsdc',money(TREASURY_USDC-HARD_USDC_OBLIGATIONS-reserve));
  const combined=[
    [state.usdc[0][0].slice(11),'USDC',state.usdc[0][1],state.usdc[0][2],money(state.usdc[0][3]),state.usdc[0][6]],
    [state.creditActivity[0][0].slice(11),'Credits',state.creditActivity[0][1],state.creditActivity[0][2],credits(state.creditActivity[0][3])+' cr',state.creditActivity[0][6]],
    [state.usdc[4][0].slice(11),'USDC',state.usdc[4][1],state.usdc[4][2],money(state.usdc[4][3]),state.usdc[4][6]],
    [state.creditActivity[2][0].slice(11),'Credits',state.creditActivity[2][1],state.creditActivity[2][2],credits(state.creditActivity[2][3])+' cr',state.creditActivity[2][6]],
    [state.creditActivity[5][0].slice(11),'Credits',state.creditActivity[5][1],state.creditActivity[5][2],credits(state.creditActivity[5][3])+' cr',state.creditActivity[5][6]]
  ];
  document.getElementById('overviewTable').innerHTML=combined.map(r=>`<tr><td class="mono">${r[0]}</td><td>${badge(r[1])}</td><td>${r[2]}</td><td>${direction(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td></tr>`).join('');
  const incoming=[16,19,23,27,31,36], outgoing=[11,13,15,18,20,23], labels=['Apr','May','Jun','Jul','Aug','Sep'];
  document.getElementById('cashflowChart').innerHTML=labels.map((m,i)=>`<div class="bar-group"><div class="bar asset" title="$${incoming[i]}k in" style="height:${incoming[i]*2}%"></div><div class="bar liability" title="$${outgoing[i]}k out" style="height:${outgoing[i]*2}%"></div><div class="bar-label">${m}</div></div>`).join('');
}

function renderUsdc(){
  const q=(document.getElementById('usdcSearch')?.value||'').toLowerCase();
  const type=document.getElementById('usdcType')?.value||'all'; const status=document.getElementById('usdcStatus')?.value||'all';
  const rows=state.usdc.filter(r=>(type==='all'||r[1]===type)&&(status==='all'||r[7]===status)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('usdcTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${money(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  setText('usdcPurchases',money(sumRows(state.usdc,'Crate Purchase','In')));
  setText('usdcCashback',money(sumRows(state.usdc,'Cashback','Out')));
  setText('itemRedemptions',money(sumRows(state.usdc,'Item Redemption','Out')));
  setText('shippingNet',money(sumRows(state.usdc,'Shipping Collected','In')-sumRows(state.usdc,'Shipping Cost','Out')));
  setText('marketFees',money(sumRows(state.usdc,'Marketplace Fee','In')));
  return rows;
}

function renderCreditActivity(){
  const q=(document.getElementById('creditActivitySearch')?.value||'').toLowerCase();
  const type=document.getElementById('creditActivityType')?.value||'all'; const status=document.getElementById('creditActivityStatus')?.value||'all';
  const rows=state.creditActivity.filter(r=>(type==='all'||r[1]===type)&&(status==='all'||r[7]===status)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('creditActivityTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${credits(r[3])} cr</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  setText('creditSpendMetric',credits(sumRows(state.creditActivity,'Credit Spend','Out')));
  setText('creditBackMetric',credits(totalCreditBack()));
  setText('crateBonusMetric',credits(sumRows(state.creditActivity,'Crate Bonus','In')));
  const net=netCreditChange(); setText('netCreditMetric',(net>=0?'+':'−')+credits(Math.abs(net)));
  setText('pendingCreditMetric',credits(pendingCreditLiquidation()));
  return rows;
}

function renderRecon(){
  const q=(document.getElementById('reconSearch')?.value||'').toLowerCase(); const result=document.getElementById('reconResult')?.value||'all';
  const rows=state.recon.filter(r=>(result==='all'||r[6]===result)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('reconTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="${String(r[4]).startsWith('-')?'negative-text':''}">${r[4]}</td><td>${badge(r[5])}</td><td>${badge(r[6])}</td><td class="mono">${r[7]}</td></tr>`).join('');
  return rows;
}

function renderPendingItems(){
  const active=state.pendingItems.filter(x=>x.status==='Vaulted');
  setText('pendingItemCount',active.length.toLocaleString());
  setText('pendingCreditBackExposure',credits(pendingCreditLiquidation())+' cr');
  setText('pendingUsdcFallback',money(pendingUsdcLiquidation()));
  setText('pendingFulfillmentReserve',money(pendingReserve()));
  document.getElementById('pendingItemsTable').innerHTML=active.map(x=>{
    const entry=x.paidWith==='Credits'?`${credits(x.entry)} cr`:money(x.entry);
    const liquid=pendingLiquidationAmount(x);
    const liquidation=x.paidWith==='Credits'?`${credits(liquid)} cr`:money(liquid);
    const trend=x.marketFmv>x.initialFmv?'Capped at initial':x.marketFmv<x.initialFmv?'Uses lower market':'No change';
    return `<tr><td class="mono">${x.opened}</td><td class="mono">${x.user}</td><td>${x.item}</td><td>${badge(x.paidWith)}</td><td>${entry}</td><td>${money(x.initialFmv)}</td><td>${money(x.marketFmv)}</td><td>${liquidation}<small class="table-sub">${trend}</small></td><td>${money(x.expectedCost)}</td><td>${x.daysLeft}</td><td>${badge(x.status)}</td></tr>`;
  }).join('');
  return active.map(x=>[x.opened,x.user,x.item,x.paidWith,x.entry,x.initialFmv,x.marketFmv,pendingLiquidationAmount(x),x.expectedCost,x.daysLeft,x.status,x.ref]);
}

function renderCredits(){
  const q=(document.getElementById('creditsSearch')?.value||'').toLowerCase(); const source=document.getElementById('creditsSource')?.value||'all';
  const rows=state.credits.filter(r=>(source==='all'||r[2]===source)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('creditsTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="${r[3].startsWith('+')?'positive-text':'negative-text'}">${r[3]}</td><td>${r[4]} cr</td><td>${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  const net=netCreditChange(); setText('creditsNetChange',(net>=0?'+':'−')+credits(Math.abs(net)));
  setText('newEmissionMetric',credits(newCreditEmissions()));
  setText('creditsBackReturned',credits(totalCreditBack()));
  setText('creditsPendingBack',credits(pendingCreditLiquidation()));
  const raw=[['Crate Bonus',sumRows(state.creditActivity,'Crate Bonus','In')],['Lulu',sumRows(state.creditActivity,'Lulu Emission','In')],['Promotional',sumRows(state.creditActivity,'Promotional Run','In')]];
  const total=raw.reduce((a,x)=>a+x[1],0)||1;
  document.getElementById('creditSourceBars').innerHTML=raw.map(([name,value])=>{ const p=Math.round(value/total*100); return `<div class="hbar-row"><div class="hbar-label"><b>${name}</b><span>${credits(value)} cr · ${p}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${p}%"></div></div></div>`; }).join('');
  renderPendingItems();
  return rows;
}

function maxLulu(n){ return Math.floor(n/3)*333+(n%3)*100; }
function renderLulu(){
  const remaining=LULU_SUPPLY-state.luluBurned, remainingMax=maxLulu(remaining), bonus=Math.max(0,state.luluEmitted-state.luluBurned*100), lost=LULU_MAX-state.luluEmitted-remainingMax;
  setText('luluBurned',state.luluBurned.toLocaleString()); setText('luluRemaining',remaining.toLocaleString()); setText('luluEmitted',state.luluEmitted.toLocaleString()); setText('luluMaxRemaining',remainingMax.toLocaleString()); setText('luluBonusIssued',bonus.toLocaleString()); setText('luluLostPotential',Math.max(0,lost).toLocaleString());
  setText('luluProgressText',`${state.luluBurned.toLocaleString()} / ${LULU_SUPPLY.toLocaleString()}`); document.getElementById('luluSupplyProgress').style.width=`${Math.max(.3,state.luluBurned/LULU_SUPPLY*100)}%`;
  const q=(document.getElementById('luluSearch')?.value||'').toLowerCase(); const status=document.getElementById('luluStatus')?.value||'all';
  const rows=state.lulu.filter(r=>(status==='all'||r[7]===status)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('luluTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="positive-text">+${r[4]} cr</td><td>${Number(r[5])?`+${r[5]} cr`:'—'}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  return rows;
}

function renderRules(){ document.getElementById('rulesTable').innerHTML=state.rules.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="positive-text">${r[3]}</td><td class="mono">${r[4]}</td><td>${r[5]}</td></tr>`).join(''); return state.rules; }
function renderAll(){ syncPolicyCopy(); renderOverview(); renderUsdc(); renderCreditActivity(); renderRecon(); renderCredits(); renderLulu(); renderRules(); setText('lastUpdated',new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})); }

function csvCell(v){ return `"${String(v??'').replace(/"/g,'""')}"`; }
function downloadCsv(name,headers,rows){ const csv=[headers,...rows].map(r=>r.map(csvCell).join(',')).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`chosen-${name}-${new Date().toISOString().slice(0,10)}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function exportSection(kind){
  let headers=[],rows=[];
  if(kind==='overview'){ headers=['Time','Area','Event','Direction','Amount','Reference']; rows=[['13:20:42','USDC','Crate Purchase','In',250,'corr_usdc_01'],['13:20:43','Credits','Crate Bonus','In',12.5,'corr_usdc_01'],['13:11:52','USDC','Item Redemption','Out',280,'claim_8e13']]; }
  else if(kind==='activity'){ if(state.activityView==='usdc'){ headers=['Time','Type','Flow','USDC','Description','User','Reference','Status']; rows=renderUsdc(); } else { headers=['Time','Type','Flow','Credits','Description','User','Reference','Status']; rows=renderCreditActivity(); } }
  else if(kind==='reconciliation'){ headers=['Checked at','Scope','Internal','Observed','Difference','Severity','Result','Reference']; rows=renderRecon(); }
  else if(kind==='credits'){ headers=['Time','User','Source','Change','Balance after','Description','Reference','Status']; rows=renderCredits(); }
  else if(kind==='pending-items'){ headers=['Opened','User','Item','Paid with','Entry','Initial FMV','Live FMV','70% liquidation','Expected cost','Days left','Status','Reference']; rows=renderPendingItems(); }
  else if(kind==='lulu'){ headers=['Time','User','Token IDs','Burn count','Credits issued','Bonus','Tx','Status']; rows=renderLulu(); }
  else if(kind==='rules'){ headers=['Time','Rule','Old','New','Changed by','Reason']; rows=state.rules; }
  downloadCsv(kind,headers,rows);
}

document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active')); b.classList.add('active'); document.getElementById(b.dataset.tab).classList.add('active'); }));
document.querySelectorAll('.segment').forEach(b=>b.addEventListener('click',()=>{ state.activityView=b.dataset.activity; document.querySelectorAll('.segment,.activity-view').forEach(x=>x.classList.remove('active')); b.classList.add('active'); document.getElementById(b.dataset.activity+'Activity').classList.add('active'); }));
['usdcSearch','usdcType','usdcStatus'].forEach(id=>document.getElementById(id)?.addEventListener(id.includes('Search')?'input':'change',renderUsdc));
['creditActivitySearch','creditActivityType','creditActivityStatus'].forEach(id=>document.getElementById(id)?.addEventListener(id.includes('Search')?'input':'change',renderCreditActivity));
['reconSearch','reconResult'].forEach(id=>document.getElementById(id)?.addEventListener(id.includes('Search')?'input':'change',renderRecon));
['creditsSearch','creditsSource'].forEach(id=>document.getElementById(id)?.addEventListener(id.includes('Search')?'input':'change',renderCredits));
['luluSearch','luluStatus'].forEach(id=>document.getElementById(id)?.addEventListener(id.includes('Search')?'input':'change',renderLulu));
document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>exportSection(b.dataset.export)));
document.getElementById('refreshBtn').addEventListener('click',renderAll);

function demoEvent(){
  const now=new Date(); const ts=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+now.toTimeString().slice(0,8); const users=['usr_A81D','usr_K2F4','usr_M91X','usr_P7Q3']; const user=users[Math.floor(Math.random()*users.length)]; const crate=[100,250,500,1000][Math.floor(Math.random()*4)]; const roll=Math.random(); const ref='live_'+Math.random().toString(36).slice(2,8); const fmv=[80,180,300,650,1000][Math.floor(Math.random()*5)]; const expectedCost=Math.round(fmv*(0.82+Math.random()*0.12));
  if(Math.random()<0.5){
    state.usdc.unshift([ts,'Crate Purchase','In',crate,`$${crate} USDC crate opened`,user,ref,'Confirmed']); state.creditActivity.unshift([ts,'Crate Bonus','In',crate*CRATE_BONUS_RATE,`5% Crate Bonus on $${crate} USDC crate`,user,ref,'Confirmed']);
    if(roll<0.45){ state.usdc.unshift([ts,'Cashback','Out',fmv*INSTANT_SETTLEMENT_RATE,`$${fmv.toLocaleString()} prize FMV × 80%`,user,ref,'Confirmed']); }
    else if(roll<0.82){ state.pendingItems.unshift({opened:ts,user,item:'Vaulted prize',paidWith:'USDC',entry:crate,initialFmv:fmv,marketFmv:fmv,expectedCost,daysLeft:365,status:'Vaulted',ref}); }
    else { state.usdc.unshift([ts,'Item Redemption','Out',expectedCost,`Physical prize claim · actual cost basis`,user,ref,'Confirmed']); }
  } else {
    state.creditActivity.unshift([ts,'Credit Spend','Out',crate,`${crate} Credit crate entry`,user,ref,'Confirmed']); state.creditActivity.unshift([ts,'Crate Bonus','In',crate*CRATE_BONUS_RATE,`5% Crate Bonus on ${crate} Credit crate`,user,ref,'Confirmed']);
    if(Math.random()<0.58){ const back=fmv*INSTANT_SETTLEMENT_RATE; state.creditActivity.unshift([ts,'Credit Back','In',back,`$${fmv.toLocaleString()} prize FMV × 80%`,user,ref,'Confirmed']); state.credits.unshift([ts,user,'Credit Back','+'+back.toFixed(2),'—',`$${fmv.toLocaleString()} prize FMV × 80%`,ref,'Confirmed']); }
    else { state.pendingItems.unshift({opened:ts,user,item:'Vaulted prize',paidWith:'Credits',entry:crate,initialFmv:fmv,marketFmv:fmv,expectedCost,daysLeft:365,status:'Vaulted',ref}); }
  }
  state.usdc=state.usdc.slice(0,40); state.creditActivity=state.creditActivity.slice(0,45); state.credits=state.credits.slice(0,45); state.pendingItems=state.pendingItems.slice(0,20); renderAll();
}

renderAll(); setInterval(demoEvent,15000);