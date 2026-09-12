const LULU_SUPPLY = 3333;
const LULU_MAX = Math.floor(LULU_SUPPLY / 3) * 333 + (LULU_SUPPLY % 3) * 100;
const CRATE_BONUS_RATE = 0.05;
const FALLBACK_RATE = 0.80;
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
    {opened:'2026-09-12 12:35:55',user:'usr_5V9R',item:'Jordan 1 Low',paidWith:'Credits',entry:250,fmv:300,expectedCost:280,daysLeft:352,status:'Vaulted',ref:'vault_5v9r'},
    {opened:'2026-09-11 22:14:09',user:'usr_4W1A',item:'Rare sneaker grail',paidWith:'Credits',entry:100,fmv:1000,expectedCost:875,daysLeft:364,status:'Vaulted',ref:'vault_4w1a'},
    {opened:'2026-09-09 17:03:44',user:'usr_8Q4E',item:'Jordan 4',paidWith:'USDC',entry:500,fmv:420,expectedCost:390,daysLeft:362,status:'Vaulted',ref:'vault_8q4e'},
    {opened:'2026-08-02 09:41:28',user:'usr_7B4Q',item:'New Balance 9060',paidWith:'Credits',entry:100,fmv:80,expectedCost:68,daysLeft:324,status:'Vaulted',ref:'vault_7b4q'}
  ],
  recon: [
    ['2026-09-12 13:18:12','USDC wallet · 0x41a…d91','$18,300.00','$18,295.00','-$5.00','High','Mismatch','tx_8b7c11'],
    ['2026-09-12 13:18:12','USDC wallet · 0x8d2…a31','$22,408.18','$22,408.18','$0.00','Info','Matched','wallet_8d2'],
    ['2026-09-12 13:18:11','Credits balance · usr_7J2K','2,492.50 cr','2,492.50 cr','0 cr','Info','Matched','usr_7J2K'],
    ['2026-09-12 13:18:11','Pending item register','4 items','4 items','0','Info','Matched','vault_items'],
    ['2026-09-12 13:18:11','Pending Credit Back exposure','1,104 cr','1,104 cr','0 cr','Info','Matched','pending_credit_back'],
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
    ['2026-09-12 12:35:56','usr_5V9R','Crate Bonus','+12.50','1,262.50','5% bonus; fallback remains pending','vault_5v9r','Confirmed']
  ],
  lulu: [
    ['2026-07-28 00:33:39','usr_1TR8','36, 37','2','200','0','0xa16ed92f5…','Confirmed'],
    ['2026-07-14 04:56:13','usr_1TR8','35','1','100','0','0x6c758d0f6…','Confirmed'],
    ['2026-07-08 18:54:40','usr_1TR8','33, 34','2','200','0','0x0bff3d2a7…','Confirmed'],
    ['2026-07-03 20:20:04','usr_1TR8','26, 27, 28','3','333','33','0xa1bbfa767…','Confirmed'],
    ['2026-07-03 19:22:37','usr_7B4Q','41, 42, 43','3','333','33','0x6cba20bff…','Confirmed']
  ],
  rules: [
    ['2026-09-12 13:26:00','Credit accounting','USD-like liability','Non-cash platform units','admin','Do not assign cash value until prize settlement creates a real cash event'],
    ['2026-09-12 13:26:00','Credit Back basis','80% of crate price','80% of prize FMV','admin','Outcome value can make a crate deflationary or inflationary in Credits'],
    ['2026-09-12 13:26:00','Physical redemption','Prize FMV','Actual cost basis','admin','Cash treasury should reflect what Chosen actually pays to fulfill'],
    ['2026-09-12 13:26:00','Vault expiry','Untracked','Auto fallback at day 365','admin','Resolve pending prize exposure in the original funding asset'],
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
function pendingCreditBack(){ return state.pendingItems.filter(x=>x.status==='Vaulted'&&x.paidWith==='Credits').reduce((a,x)=>a+x.fmv*FALLBACK_RATE,0); }
function pendingUsdcFallback(){ return state.pendingItems.filter(x=>x.status==='Vaulted'&&x.paidWith==='USDC').reduce((a,x)=>a+x.fmv*FALLBACK_RATE,0); }
function pendingReserve(){ return state.pendingItems.filter(x=>x.status==='Vaulted').reduce((a,x)=>a+x.expectedCost,0); }
function totalCreditInflows(){ return state.creditActivity.filter(r=>r[2]==='In').reduce((a,r)=>a+Number(r[3]),0); }
function totalCreditOutflows(){ return state.creditActivity.filter(r=>r[2]==='Out').reduce((a,r)=>a+Number(r[3]),0); }
function netCreditChange(){ return totalCreditInflows()-totalCreditOutflows(); }
function newCreditEmissions(){ return ['Crate Bonus','Lulu Emission','Promotional Run'].reduce((sum,t)=>sum+sumRows(state.creditActivity,t,'In'),0); }
function totalCreditBack(){ return sumRows(state.creditActivity,'Credit Back','In')+sumRows(state.creditActivity,'Expiry Credit Back','In'); }

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
  const type=document.getElementById('usdcType')?.value||'all';
  const status=document.getElementById('usdcStatus')?.value||'all';
  const rows=state.usdc.filter(r=>(type==='all'||r[1]===type)&&(status==='all'||r[7]===status)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('usdcTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${r[2]==='In'?'+':'−'}${money(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  setText('usdcPurchases',money(sumRows(state.usdc,'Crate Purchase','In')));
  setText('usdcCashback',money(sumRows(state.usdc,'Cashback','Out')));
  setText('itemRedemptions',money(sumRows(state.usdc,'Item Redemption','Out')));
  const shippingNet=sumRows(state.usdc,'Shipping Collected','In')-sumRows(state.usdc,'Shipping Cost','Out');
  setText('shippingNet',(shippingNet<0?'−':'')+money(Math.abs(shippingNet)));
  setText('marketFees',money(sumRows(state.usdc,'Marketplace Fee','In')));
  return rows;
}

function renderCreditActivity(){
  const q=(document.getElementById('creditActivitySearch')?.value||'').toLowerCase();
  const type=document.getElementById('creditActivityType')?.value||'all';
  const status=document.getElementById('creditActivityStatus')?.value||'all';
  const rows=state.creditActivity.filter(r=>(type==='all'||r[1]===type)&&(status==='all'||r[7]===status)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('creditActivityTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${r[2]==='In'?'+':'−'}${credits(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  setText('creditSpendMetric',credits(sumRows(state.creditActivity,'Credit Spend','Out')));
  setText('creditBackMetric',credits(totalCreditBack()));
  setText('crateBonusMetric',credits(sumRows(state.creditActivity,'Crate Bonus','In')));
  const net=netCreditChange(); setText('netCreditMetric',(net>=0?'+':'−')+credits(Math.abs(net)));
  setText('pendingCreditMetric',credits(pendingCreditBack()));
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
  setText('pendingCreditBackExposure',credits(pendingCreditBack())+' cr');
  setText('pendingUsdcFallback',money(pendingUsdcFallback()));
  setText('pendingFulfillmentReserve',money(pendingReserve()));
  document.getElementById('pendingItemsTable').innerHTML=active.map(x=>{
    const entry=x.paidWith==='Credits'?`${credits(x.entry)} cr`:money(x.entry);
    const fallback=x.paidWith==='Credits'?`${credits(x.fmv*FALLBACK_RATE)} cr`:money(x.fmv*FALLBACK_RATE);
    return `<tr><td class="mono">${x.opened}</td><td class="mono">${x.user}</td><td>${x.item}</td><td>${badge(x.paidWith)}</td><td>${entry}</td><td>${money(x.fmv)}</td><td>${fallback}</td><td>${money(x.expectedCost)}</td><td>${x.daysLeft}</td><td>${badge(x.status)}</td></tr>`;
  }).join('');
  return active.map(x=>[x.opened,x.user,x.item,x.paidWith,x.entry,x.fmv,x.fmv*FALLBACK_RATE,x.expectedCost,x.daysLeft,x.status,x.ref]);
}

function renderCredits(){
  const q=(document.getElementById('creditsSearch')?.value||'').toLowerCase(); const source=document.getElementById('creditsSource')?.value||'all';
  const rows=state.credits.filter(r=>(source==='all'||r[2]===source)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('creditsTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="${r[3].startsWith('+')?'positive-text':'negative-text'}">${r[3]}</td><td>${r[4]} cr</td><td>${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  const net=netCreditChange(); setText('creditsNetChange',(net>=0?'+':'−')+credits(Math.abs(net)));
  setText('newEmissionMetric',credits(newCreditEmissions()));
  setText('creditsBackReturned',credits(totalCreditBack()));
  setText('creditsPendingBack',credits(pendingCreditBack()));
  const raw=[['Crate Bonus',sumRows(state.creditActivity,'Crate Bonus','In')],['Lulu',sumRows(state.creditActivity,'Lulu Emission','In')],['Promotional',sumRows(state.creditActivity,'Promotional Run','In')]];
  const total=raw.reduce((a,x)=>a+x[1],0)||1;
  document.getElementById('creditSourceBars').innerHTML=raw.map(([name,value])=>{ const p=Math.round(value/total*100); return `<div class="hbar-row"><div class="hbar-label"><b>${name}</b><span>${credits(value)} cr · ${p}%</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${p}%"></div></div></div>`; }).join('');
  renderPendingItems();
  return rows;
}

function maxLuluEmission(n){ return Math.floor(n/3)*333+(n%3)*100; }
function renderLulu(){
  const remaining=LULU_SUPPLY-state.luluBurned, remainingMax=maxLuluEmission(remaining), bonus=Math.max(0,state.luluEmitted-state.luluBurned*100), lost=Math.max(0,LULU_MAX-state.luluEmitted-remainingMax);
  setText('luluBurned',state.luluBurned.toLocaleString()); setText('luluRemaining',remaining.toLocaleString()); setText('luluEmitted',state.luluEmitted.toLocaleString()); setText('creditsLuluIssued',state.luluEmitted.toLocaleString()); setText('luluMaxRemaining',remainingMax.toLocaleString()); setText('luluBonusIssued',bonus.toLocaleString()); setText('luluLostPotential',lost.toLocaleString()); setText('luluProgressText',`${state.luluBurned.toLocaleString()} / ${LULU_SUPPLY.toLocaleString()}`);
  document.getElementById('luluSupplyProgress').style.width=`${Math.max(.4,(state.luluBurned/LULU_SUPPLY)*100)}%`;
  document.getElementById('luluTable').innerHTML=state.lulu.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="positive-text">+${r[4]} cr</td><td>${Number(r[5])?`+${r[5]} cr`:'—'}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');
  return state.lulu;
}

function renderRules(){ document.getElementById('rulesTable').innerHTML=state.rules.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join(''); return state.rules; }

function renderAll(){ renderOverview(); renderUsdc(); renderCreditActivity(); renderRecon(); renderCredits(); renderLulu(); renderRules(); setText('lastUpdated',new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})); }

function exportCSV(kind){
  let rows=[], headers=[];
  if(kind==='activity'){
    if(state.activityView==='usdc'){ headers=['Time','Type','Flow','USDC','Description','User','Reference','Status']; rows=renderUsdc(); }
    else { headers=['Time','Type','Flow','Credits','Description','User','Reference','Status']; rows=renderCreditActivity(); }
  } else if(kind==='credits'){ headers=['Time','User','Category','Change','Balance after','Detail','Reference','Status']; rows=renderCredits(); }
  else if(kind==='pending-items'){ headers=['Opened','User','Item','Paid with','Entry','Prize FMV','80% fallback','Expected cost','Days left','Status','Reference']; rows=renderPendingItems(); }
  else if(kind==='reconciliation'){ headers=['Checked at','Scope','Internal','Observed','Difference','Severity','Result','Reference']; rows=renderRecon(); }
  else if(kind==='lulu'){ headers=['Time','User','Lulus','Count','Credits','Bonus','Transaction','Status']; rows=state.lulu; }
  else if(kind==='rules'){ headers=['Time','Rule','Old','New','Changed by','Reason']; rows=state.rules; }
  else { headers=['Time','Area','Event','Direction','Amount','Reference']; rows=[]; }
  const all=[headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([all],{type:'text/csv'}), a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`chosen-${kind}-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
}

function simulate(){
  const now=new Date(); const ts=now.toISOString().replace('T',' ').slice(0,19); const user='usr_'+Math.random().toString(36).slice(2,6).toUpperCase(); const crate=[100,250,500,1000][Math.floor(Math.random()*4)]; const multiplier=[0.45,0.8,1.2,2,10][Math.floor(Math.random()*5)]; const fmv=Math.round(crate*multiplier); const expectedCost=Math.round(fmv*0.9); const ref='corr_'+Math.random().toString(36).slice(2,8);
  if(Math.random()<0.55){
    state.usdc.unshift([ts,'Crate Purchase','In',crate,`$${crate.toLocaleString()} USDC crate opened`,user,ref,'Confirmed']);
    state.creditActivity.unshift([ts,'Crate Bonus','In',crate*CRATE_BONUS_RATE,`5% bonus on $${crate.toLocaleString()} USDC crate`,user,ref,'Confirmed']);
    state.credits.unshift([ts,user,'Crate Bonus','+'+(crate*CRATE_BONUS_RATE).toFixed(2),'—',`5% on $${crate.toLocaleString()} USDC crate`,ref,'Confirmed']);
    const roll=Math.random();
    if(roll<0.45){ state.usdc.unshift([ts,'Cashback','Out',fmv*FALLBACK_RATE,`$${fmv.toLocaleString()} prize FMV × 80%`,user,ref,'Confirmed']); }
    else if(roll<0.82){ state.pendingItems.unshift({opened:ts,user,item:'Vaulted prize',paidWith:'USDC',entry:crate,fmv,expectedCost,daysLeft:365,status:'Vaulted',ref}); }
    else { state.usdc.unshift([ts,'Item Redemption','Out',expectedCost,`Physical claim · ${money(expectedCost)} actual cost basis`,user,ref,'Confirmed']); state.usdc.unshift([ts,'Shipping Collected','In',24.95,'Shipping collected from user',user,ref,'Confirmed']); state.usdc.unshift([ts,'Shipping Cost','Out',18.40,'Carrier + handling expense',user,ref,'Confirmed']); }
  } else {
    state.creditActivity.unshift([ts,'Credit Spend','Out',crate,`${credits(crate)} Credit crate entry`,user,ref,'Confirmed']);
    state.creditActivity.unshift([ts,'Crate Bonus','In',crate*CRATE_BONUS_RATE,`5% bonus on ${credits(crate)} Credit crate`,user,ref,'Confirmed']);
    state.credits.unshift([ts,user,'Credit Spend','-'+crate.toFixed(2),'—',`${credits(crate)} Credit crate entry`,ref,'Confirmed']);
    state.credits.unshift([ts,user,'Crate Bonus','+'+(crate*CRATE_BONUS_RATE).toFixed(2),'—',`5% bonus on Credit crate`,ref,'Confirmed']);
    if(Math.random()<0.58){ const back=fmv*FALLBACK_RATE; state.creditActivity.unshift([ts,'Credit Back','In',back,`$${fmv.toLocaleString()} prize FMV × 80%`,user,ref,'Confirmed']); state.credits.unshift([ts,user,'Credit Back','+'+back.toFixed(2),'—',`$${fmv.toLocaleString()} prize FMV × 80%`,ref,'Confirmed']); }
    else { state.pendingItems.unshift({opened:ts,user,item:'Vaulted prize',paidWith:'Credits',entry:crate,fmv,expectedCost,daysLeft:365,status:'Vaulted',ref}); }
  }
  state.usdc=state.usdc.slice(0,40); state.creditActivity=state.creditActivity.slice(0,45); state.credits=state.credits.slice(0,45); state.pendingItems=state.pendingItems.slice(0,20); renderAll();
}

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); document.getElementById(btn.dataset.tab).classList.add('active'); }));
document.querySelectorAll('.segment').forEach(btn=>btn.addEventListener('click',()=>{ state.activityView=btn.dataset.activity; document.querySelectorAll('.segment').forEach(x=>x.classList.remove('active')); document.querySelectorAll('.activity-view').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); document.getElementById(btn.dataset.activity==='usdc'?'usdcActivity':'creditsActivity').classList.add('active'); }));
['usdcSearch','usdcType','usdcStatus'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderUsdc));
['creditActivitySearch','creditActivityType','creditActivityStatus'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderCreditActivity));
['reconSearch','reconResult'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderRecon));
['creditsSearch','creditsSource'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderCredits));
document.querySelectorAll('[data-export]').forEach(btn=>btn.addEventListener('click',()=>exportCSV(btn.dataset.export)));
document.getElementById('refreshBtn').addEventListener('click',simulate);
renderAll(); setInterval(simulate,15000);
