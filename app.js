const LULU_SUPPLY=3333;
const LULU_MAX=Math.floor(LULU_SUPPLY/3)*333+(LULU_SUPPLY%3)*100;
const CREDIT_BACK_RATE=.05;

const state={
  activityView:'usdc',luluBurned:37,luluEmitted:4096,
  usdc:[
    ['2026-09-12 12:03:42','Crate Purchase','In',250,'$250 crate opened','usr_7J2K','corr_usdc_01','Confirmed'],
    ['2026-09-12 12:01:16','Cashback','Out',200,'80% instant sell settlement','usr_7J2K','corr_cash_01','Confirmed'],
    ['2026-09-12 11:58:20','Shipping','In',24.95,'UPS shipping charge collected','usr_2P8D','ship_8e13','Confirmed'],
    ['2026-09-12 11:54:07','Marketplace Fee','In',12.50,'1% fee on $1,250 marketplace sale','usr_4W1A','mkt_81a2','Confirmed'],
    ['2026-09-12 11:49:36','Crate Purchase','In',1000,'$1,000 crate opened','usr_1TR8','corr_usdc_02','Confirmed'],
    ['2026-09-12 11:46:19','Cashback','Out',800,'80% instant sell settlement','usr_1TR8','corr_cash_02','Confirmed'],
    ['2026-09-12 11:40:12','Crate Purchase','In',100,'$100 crate opened','usr_6LM2','corr_usdc_03','Confirmed'],
    ['2026-09-12 11:35:55','Shipping','In',18.40,'Canada Post shipping charge','usr_3X5Q','ship_31f2','Pending'],
    ['2026-09-12 11:29:03','Marketplace Fee','In',6.55,'1% fee on $655 marketplace sale','usr_8Q4E','mkt_a817','Confirmed']
  ],
  creditActivity:[
    ['2026-09-12 12:03:43','Credit Back','In',12.50,'$250 crate · paid with USDC','usr_7J2K','corr_usdc_01','Confirmed'],
    ['2026-09-12 12:00:02','Credit Back','In',50,'$1,000 crate · paid with Credits','usr_2P8D','corr_credit_01','Confirmed'],
    ['2026-09-12 11:57:19','Credit Spend','Out',1000,'$1,000-equivalent crate purchase','usr_2P8D','corr_credit_01','Confirmed'],
    ['2026-09-12 11:49:36','Lulu Emission','In',333,'3 Lulus burned · includes 33 bonus','usr_1TR8','0xa16ed92f5…','Confirmed'],
    ['2026-09-12 11:46:19','Promotional Run','In',250,'September collector campaign','usr_9N3F','promo_sep12','Confirmed'],
    ['2026-09-12 11:40:13','Credit Back','In',5,'$100 crate · paid with USDC','usr_6LM2','corr_usdc_03','Confirmed'],
    ['2026-09-12 11:35:55','Credit Spend','Out',250,'$250-equivalent crate purchase','usr_3X5Q','corr_credit_02','Confirmed'],
    ['2026-09-12 11:35:56','Credit Back','In',12.50,'$250 crate · paid with Credits','usr_3X5Q','corr_credit_02','Confirmed'],
    ['2026-09-12 11:16:03','Lulu Emission','In',200,'2 Lulus burned','usr_5V9R','0xc996d2…','Confirmed'],
    ['2026-09-12 10:52:14','Promotional Run','In',100,'New-user activation campaign','usr_0K1C','promo_newuser','Confirmed']
  ],
  recon:[
    ['2026-09-12 11:52:12','USDC wallet · 0x41a…d91','$18,300.00','$18,295.00','-$5.00','High','Mismatch','tx_8b7c11'],
    ['2026-09-12 11:52:12','USDC wallet · 0x8d2…a31','$22,408.18','$22,408.18','$0.00','Info','Matched','wallet_8d2'],
    ['2026-09-12 11:52:11','Credits ledger · usr_7J2K','2,480 cr','2,480 cr','0 cr','Info','Matched','usr_7J2K'],
    ['2026-09-12 11:52:11','Credit Back queue','6 entries','6 entries','0','Info','Matched','credit_back_queue'],
    ['2026-09-12 11:52:11','Lulu emission ledger','4,096 cr','4,096 cr','0 cr','Info','Matched','lulu_emissions'],
    ['2026-09-12 11:52:11','Shipping receipts','$6,418.15','$6,418.15','$0.00','Info','Matched','shipping_receipts']
  ],
  credits:[
    ['2026-09-12 12:03:43','usr_7J2K','Credit Back','+12.50','2,492.50','$250 crate · USDC','corr_usdc_01','Confirmed'],
    ['2026-09-12 12:00:02','usr_2P8D','Credit Back','+50.00','5,160.00','$1,000 crate · Credits','corr_credit_01','Confirmed'],
    ['2026-09-12 11:57:19','usr_2P8D','Credit Spend','−1,000.00','5,110.00','$1,000-equivalent crate','corr_credit_01','Confirmed'],
    ['2026-09-12 11:49:36','usr_1TR8','Lulu Emission','+333.00','2,033.00','3 Lulus burned','0xa16ed92f5…','Confirmed'],
    ['2026-09-12 11:46:19','usr_9N3F','Promotional Run','+250.00','1,475.00','September collector campaign','promo_sep12','Confirmed'],
    ['2026-09-12 11:40:13','usr_6LM2','Credit Back','+5.00','805.00','$100 crate · USDC','corr_usdc_03','Confirmed'],
    ['2026-09-12 11:35:56','usr_3X5Q','Credit Back','+12.50','3,612.50','$250 crate · Credits','corr_credit_02','Confirmed'],
    ['2026-09-12 11:16:03','usr_5V9R','Lulu Emission','+200.00','1,400.00','2 Lulus burned','0xc996d2…','Confirmed'],
    ['2026-09-12 10:52:14','usr_0K1C','Promotional Run','+100.00','950.00','New-user activation','promo_newuser','Confirmed']
  ],
  lulu:[
    ['2026-07-28 00:33:39','usr_1TR8','36, 37','2','200','0','0xa16ed92f5…','Confirmed'],['2026-07-14 04:56:13','usr_1TR8','35','1','100','0','0x6c758d0f6…','Confirmed'],['2026-07-08 18:54:40','usr_1TR8','33, 34','2','200','0','0x0bff3d2a7…','Confirmed'],['2026-07-03 20:20:04','usr_1TR8','26, 27, 28','3','333','33','0xa1bbfa767…','Confirmed']
  ],
  rules:[
    ['2026-09-12 12:05:00','Credit Back rate','—','5 cr / $100','system','Every crate open'],
    ['2026-09-12 12:05:00','Credit Back eligibility','—','USDC + Credits','system','Independent of payment method'],
    ['2026-06-13 09:05:56','USDC cashback rate','—','80%','system','Demo settlement rule'],
    ['2026-06-13 09:05:56','Marketplace fee','—','1%','system','Demo fee'],
    ['2026-06-13 09:05:56','Lulu single burn','—','100 credits','system','Lulu program'],
    ['2026-06-13 09:05:56','Lulu triple burn','—','333 credits','system','Lulu bonus']
  ]
};

const $=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const badge=v=>`<span class="badge ${String(v).toLowerCase().replace(/\s/g,'-')}">${esc(v)}</span>`;
const money=v=>'$'+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const cr=v=>Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const direction=v=>`<span class="flow ${v==='In'?'flow-in':'flow-out'}">${v==='In'?'↗ In':'↙ Out'}</span>`;

const overviewRows=[
  ['12:03:43','Credit Back','Credits','12.50 cr','—','−12.50 cr','Confirmed'],
  ['12:03:42','Crate Purchase','USDC','$250.00','—','+$250.00','Confirmed'],
  ['12:01:16','Cashback','USDC','—','$200.00','−$200.00','Confirmed'],
  ['11:58:20','Shipping','USDC','$24.95','—','+$24.95','Confirmed'],
  ['11:54:07','Marketplace Fee','USDC','$12.50','—','+$12.50','Confirmed'],
  ['11:49:36','Lulu Emission','Credits','333 cr','—','−333 cr','Confirmed'],
  ['11:46:19','Promotional Run','Credits','250 cr','—','−250 cr','Confirmed']
];
function renderOverview(){
  if($('overviewTable'))$('overviewTable').innerHTML=overviewRows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td class="${String(r[5]).startsWith('+')?'positive-text':'negative-text'}">${r[5]}</td><td>${badge(r[6])}</td></tr>`).join('');
  if($('treasuryChart')){const a=[96,101,107,111,119,128],l=[26,27,28,29,30,31],m=['Apr','May','Jun','Jul','Aug','Sep'];$('treasuryChart').innerHTML=m.map((x,i)=>`<div class="bar-group"><div class="bar asset" style="height:${a[i]/1.35}%"></div><div class="bar liability" style="height:${l[i]/1.35}%"></div><div class="bar-label">${x}</div></div>`).join('')}
}

function patchUI(){
  const tab=[...document.querySelectorAll('.tab')].find(x=>x.dataset.tab==='ledger');
  if(tab){tab.textContent='Activity';tab.dataset.tab='activity'}
  const old=$('ledger');
  if(old){old.id='activity';old.innerHTML=`
    <div class="section-intro"><div><h2>Activity</h2><p>USDC and Credits are separate systems. Toggle between them instead of mixing both in one log.</p></div><button class="export-btn" data-export="activity">Export CSV</button></div>
    <div class="segmented"><button class="segment active" data-view="usdc">USDC</button><button class="segment" data-view="credits">Credits</button></div>
    <div id="usdcActivity" class="activity-view active">
      <div class="rule-callout"><b>USDC tracks cash flow.</b> Crate purchases, shipping charges and marketplace fees are inflows. User cashback / instant-sell settlements are outflows.</div>
      <div class="metric-grid compact"><article class="metric-card"><div class="metric-label">Crate purchases · QTD</div><div class="metric-value">+$184,520.00</div></article><article class="metric-card"><div class="metric-label">Cashback · QTD</div><div class="metric-value negative-text">−$119,834.40</div></article><article class="metric-card"><div class="metric-label">Shipping collected</div><div class="metric-value">+$6,418.15</div></article><article class="metric-card"><div class="metric-label">Marketplace fees</div><div class="metric-value">+$1,284.62</div></article></div>
      <div class="filters"><input id="usdcSearch" class="control grow" placeholder="Search user, reference or event…"><select id="usdcType" class="control"><option value="all">All types</option><option>Crate Purchase</option><option>Cashback</option><option>Shipping</option><option>Marketplace Fee</option></select><select id="usdcDirection" class="control"><option value="all">In + Out</option><option>In</option><option>Out</option></select><select id="usdcStatus" class="control"><option value="all">All statuses</option><option>Confirmed</option><option>Pending</option><option>Failed</option></select></div>
      <article class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Time</th><th>Type</th><th>Direction</th><th>USDC</th><th>Business context</th><th>User</th><th>Reference</th><th>Status</th></tr></thead><tbody id="usdcTable"></tbody></table></div></article>
    </div>
    <div id="creditsActivity" class="activity-view">
      <div class="rule-callout credit-callout"><b>Credit Back is universal:</b> every crate open emits <strong>5 credits per $100 of crate value</strong>, regardless of whether it was bought with USDC or Credits. $250 → 12.5 cr; $1,000 → 50 cr.</div>
      <div class="metric-grid compact"><article class="metric-card"><div class="metric-label">Credit Back · QTD</div><div class="metric-value">+9,226.00</div></article><article class="metric-card"><div class="metric-label">Lulu · lifetime</div><div class="metric-value">+4,096</div></article><article class="metric-card"><div class="metric-label">Promotional Runs · QTD</div><div class="metric-value">+3,850</div></article><article class="metric-card"><div class="metric-label">Credits spent · QTD</div><div class="metric-value negative-text">−67,240</div></article></div>
      <div class="filters"><input id="creditActivitySearch" class="control grow" placeholder="Search user, reference or event…"><select id="creditActivityType" class="control"><option value="all">All types</option><option>Credit Back</option><option>Lulu Emission</option><option>Promotional Run</option><option>Credit Spend</option></select><select id="creditActivityDirection" class="control"><option value="all">In + Out</option><option>In</option><option>Out</option></select><select id="creditActivityStatus" class="control"><option value="all">All statuses</option><option>Confirmed</option><option>Pending</option><option>Failed</option></select></div>
      <article class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Time</th><th>Type</th><th>Direction</th><th>Credits</th><th>Source / Context</th><th>User</th><th>Reference</th><th>Status</th></tr></thead><tbody id="creditActivityTable"></tbody></table></div></article>
    </div>`}

  const credits=$('credits');
  if(credits) credits.innerHTML=`
    <div class="section-intro"><div><h2>Credits</h2><p>Track Credit emissions, usage and liability without treating Credits like cash.</p></div><button class="export-btn" data-export="credits">Export CSV</button></div>
    <div class="metric-grid compact"><article class="metric-card"><div class="metric-label">Outstanding</div><div class="metric-value">84,920.00</div><div class="metric-foot">Held by users</div></article><article class="metric-card"><div class="metric-label">Credit Back issued</div><div class="metric-value">91,420.50</div><div class="metric-foot">Lifetime</div></article><article class="metric-card"><div class="metric-label">Lulu issued</div><div class="metric-value" id="creditsLuluIssued">4,096</div><div class="metric-foot">Lifetime</div></article><article class="metric-card"><div class="metric-label">Promotional issued</div><div class="metric-value">21,600</div><div class="metric-foot">Lifetime</div></article></div>
    <div class="two-col"><article class="panel"><div class="panel-head"><div><h3>Issuance by source</h3><p>Only newly-created Credits count as issuance.</p></div></div><div class="horizontal-bars" id="creditSourceBars"></div></article><article class="panel"><div class="panel-head"><div><h3>Credit Back rule</h3><p>Reward emission is based on crate value, not payment method.</p></div></div><div class="credit-formula"><div><span>Rate</span><b>5 cr / $100</b></div><div><span>$250 crate</span><b>12.5 cr</b></div><div><span>$1,000 crate</span><b>50 cr</b></div><div><span>Formula</span><code>crate value × 5%</code></div></div></article></div>
    <div class="filters"><input id="creditSearch" class="control grow" placeholder="Search user or reference…"><select id="creditSource" class="control"><option value="all">All sources</option><option>Credit Back</option><option>Lulu Emission</option><option>Promotional Run</option><option>Credit Spend</option></select></div>
    <article class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Time</th><th>User</th><th>Source</th><th>Change</th><th>Balance after</th><th>Context</th><th>Reference</th><th>Status</th></tr></thead><tbody id="creditTable"></tbody></table></div></article>`;

  const rules=$('rules');
  if(rules) rules.innerHTML=`
    <div class="section-intro"><div><h2>Rules</h2><p>Human-readable treasury economics with a permanent change history.</p></div><button class="export-btn" data-export="rules">Export CSV</button></div>
    <div class="rule-grid"><article class="rule-card"><span>Credit Back</span><strong>5 cr per $100</strong><p>Issued on every crate open, whether paid with USDC or Credits.</p></article><article class="rule-card"><span>USDC Cashback</span><strong>80%</strong><p>Demo rate for eligible instant-sell / cashback settlements.</p></article><article class="rule-card"><span>Marketplace Fee</span><strong>1%</strong><p>Only the fee is company revenue; sale principal is not.</p></article><article class="rule-card"><span>Lulu</span><strong>100 / 333 cr</strong><p>100 per single burn; 333 per complete group of three.</p></article></div>
    <article class="panel table-panel"><div class="panel-head"><div><h3>Change history</h3><p>Production changes should record who changed them, when and why.</p></div></div><div class="table-wrap"><table><thead><tr><th>Updated at</th><th>Rule</th><th>Old</th><th>New</th><th>Updated by</th><th>Reason</th></tr></thead><tbody id="rulesTable"></tbody></table></div></article>`;

  document.head.insertAdjacentHTML('beforeend',`<style>
    .segmented{display:inline-flex;border:1px solid var(--border,#202833);background:#0a0e12;border-radius:10px;padding:3px;margin-bottom:14px}.segment{border:0;background:transparent;color:#8f98a7;padding:8px 18px;border-radius:7px;cursor:pointer;font-weight:700}.segment.active{background:#1a222c;color:#fff}.activity-view{display:none}.activity-view.active{display:block}.flow{font-weight:800}.flow-in{color:#61d894}.flow-out{color:#ff6b6b}.credit-callout{border-color:rgba(201,255,113,.22)!important}.credit-formula{display:grid;grid-template-columns:1fr 1fr;padding:14px;gap:8px}.credit-formula div{border:1px solid var(--border,#202833);border-radius:8px;padding:12px;background:#0b1015}.credit-formula span{display:block;color:#8f98a7;font-size:10px;margin-bottom:5px}.credit-formula b,.credit-formula code{font-size:13px}@media(max-width:700px){.credit-formula{grid-template-columns:1fr}}
  </style>`);
}

function renderUsdc(){const q=($('usdcSearch')?.value||'').toLowerCase(),t=$('usdcType')?.value||'all',d=$('usdcDirection')?.value||'all',s=$('usdcStatus')?.value||'all';const rows=state.usdc.filter(r=>(!q||r.join(' ').toLowerCase().includes(q))&&(t==='all'||r[1]===t)&&(d==='all'||r[2]===d)&&(s==='all'||r[7]===s));if($('usdcTable'))$('usdcTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${r[2]==='In'?'+':'−'}${money(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');return rows}
function renderCreditActivity(){const q=($('creditActivitySearch')?.value||'').toLowerCase(),t=$('creditActivityType')?.value||'all',d=$('creditActivityDirection')?.value||'all',s=$('creditActivityStatus')?.value||'all';const rows=state.creditActivity.filter(r=>(!q||r.join(' ').toLowerCase().includes(q))&&(t==='all'||r[1]===t)&&(d==='all'||r[2]===d)&&(s==='all'||r[7]===s));if($('creditActivityTable'))$('creditActivityTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${direction(r[2])}</td><td class="${r[2]==='In'?'positive-text':'negative-text'}">${r[2]==='In'?'+':'−'}${cr(r[3])}</td><td>${r[4]}</td><td class="mono">${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');return rows}
function renderCredits(){const q=($('creditSearch')?.value||'').toLowerCase(),src=$('creditSource')?.value||'all';const rows=state.credits.filter(r=>(src==='all'||r[2]===src)&&(!q||r.join(' ').toLowerCase().includes(q)));if($('creditTable'))$('creditTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="${r[3].startsWith('+')?'positive-text':'negative-text'}">${r[3]}</td><td>${r[4]} cr</td><td>${r[5]}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');if($('creditSourceBars'))$('creditSourceBars').innerHTML=[['Credit Back',78],['Promotional Runs',18],['Lulu',4]].map(([n,p])=>`<div class="hbar-row"><div class="hbar-label"><b>${n}</b><span>${p}% of modeled issuance</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${p}%"></div></div></div>`).join('');return rows}
function renderRecon(){const sev=$('reconSeverity')?.value||'all',res=$('reconStatus')?.value||'all',q=($('reconSearch')?.value||'').toLowerCase();const rows=state.recon.filter(r=>(sev==='all'||r[5]===sev)&&(res==='all'||r[6]===res)&&(!q||r.join(' ').toLowerCase().includes(q)));if($('reconTable'))$('reconTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="${r[4].startsWith('-')?'negative-text':''}">${r[4]}</td><td>${badge(r[5])}</td><td>${badge(r[6])}</td><td class="mono">${r[7]}</td></tr>`).join('');return rows}
function maxLulu(n){return Math.floor(n/3)*333+(n%3)*100}
function renderLulu(){const rem=LULU_SUPPLY-state.luluBurned,remMax=maxLulu(rem),lost=Math.max(0,LULU_MAX-state.luluEmitted-remMax),bonus=Math.max(0,state.luluEmitted-state.luluBurned*100);if($('luluBurned'))$('luluBurned').textContent=state.luluBurned.toLocaleString();if($('luluRemaining'))$('luluRemaining').textContent=rem.toLocaleString();if($('luluEmitted'))$('luluEmitted').textContent=state.luluEmitted.toLocaleString();if($('creditsLuluIssued'))$('creditsLuluIssued').textContent=state.luluEmitted.toLocaleString();if($('luluMaxRemaining'))$('luluMaxRemaining').textContent=remMax.toLocaleString();if($('overviewLuluRemaining'))$('overviewLuluRemaining').textContent=remMax.toLocaleString()+' cr';if($('luluBonusIssued'))$('luluBonusIssued').textContent=bonus.toLocaleString();if($('luluLostPotential'))$('luluLostPotential').textContent=lost.toLocaleString();if($('luluProgressText'))$('luluProgressText').textContent=`${state.luluBurned.toLocaleString()} / ${LULU_SUPPLY.toLocaleString()}`;if($('luluSupplyProgress'))$('luluSupplyProgress').style.width=Math.max(.3,state.luluBurned/LULU_SUPPLY*100)+'%';const q=($('luluSearch')?.value||'').toLowerCase(),st=$('luluStatus')?.value||'all';const rows=state.lulu.filter(r=>(st==='all'||r[7]===st)&&(!q||r.join(' ').toLowerCase().includes(q)));if($('luluTable'))$('luluTable').innerHTML=rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="positive-text">+${r[4]} cr</td><td>${Number(r[5])?`+${r[5]} cr`:'—'}</td><td class="mono">${r[6]}</td><td>${badge(r[7])}</td></tr>`).join('');return rows}
function renderRules(){if($('rulesTable'))$('rulesTable').innerHTML=state.rules.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="mono">${r[4]}</td><td>${r[5]}</td></tr>`).join('');return state.rules}

function bind(){
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab))});
  document.querySelectorAll('.segment').forEach(b=>b.onclick=()=>{state.activityView=b.dataset.view;document.querySelectorAll('.segment').forEach(x=>x.classList.toggle('active',x===b));$('usdcActivity').classList.toggle('active',state.activityView==='usdc');$('creditsActivity').classList.toggle('active',state.activityView==='credits')});
  [['usdcSearch','input',renderUsdc],['usdcType','change',renderUsdc],['usdcDirection','change',renderUsdc],['usdcStatus','change',renderUsdc],['creditActivitySearch','input',renderCreditActivity],['creditActivityType','change',renderCreditActivity],['creditActivityDirection','change',renderCreditActivity],['creditActivityStatus','change',renderCreditActivity],['creditSearch','input',renderCredits],['creditSource','change',renderCredits],['reconSeverity','change',renderRecon],['reconStatus','change',renderRecon],['reconSearch','input',renderRecon],['luluSearch','input',renderLulu],['luluStatus','change',renderLulu]].forEach(([id,e,f])=>$(id)?.addEventListener(e,f));
  document.querySelectorAll('[data-export]').forEach(b=>b.onclick=()=>exportCsv(b.dataset.export));
  if($('refreshBtn'))$('refreshBtn').onclick=()=>{renderAll();toast('Treasury refreshed')};
}
function csvEsc(v){const s=String(v);return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function dl(name,heads,rows){const blob=new Blob([[heads,...rows].map(r=>r.map(csvEsc).join(',')).join('\n')],{type:'text/csv'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),300);toast('CSV exported')}
function exportCsv(sec){const d=new Date().toISOString().slice(0,10);if(sec==='activity')return state.activityView==='usdc'?dl(`chosen-usdc-activity-${d}.csv`,['time','type','direction','usdc','context','user','reference','status'],renderUsdc()):dl(`chosen-credits-activity-${d}.csv`,['time','type','direction','credits','context','user','reference','status'],renderCreditActivity());if(sec==='credits')return dl(`chosen-credits-${d}.csv`,['time','user','source','change','balance','context','reference','status'],renderCredits());if(sec==='reconciliation')return dl(`chosen-reconciliation-${d}.csv`,['time','scope','internal','observed','difference','severity','result','reference'],renderRecon());if(sec==='lulu')return dl(`chosen-lulu-${d}.csv`,['time','user','token_ids','burned','issued','bonus','tx','status'],renderLulu());if(sec==='rules')return dl(`chosen-rules-${d}.csv`,['updated','rule','old','new','updated_by','reason'],renderRules());if(sec==='overview')return dl(`chosen-treasury-overview-${d}.csv`,['time','event','asset','in','out','net','status'],overviewRows)}
function toast(msg){const el=$('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove('show'),1700)}
function renderAll(){renderOverview();renderUsdc();renderCreditActivity();renderCredits();renderRecon();renderLulu();renderRules();if($('lastUpdated'))$('lastUpdated').textContent=new Date().toLocaleString()}
function demo(){const ts=new Date().toISOString().replace('T',' ').slice(0,19),id=Math.random().toString(36).slice(2,8),user='usr_'+Math.random().toString(36).slice(2,6).toUpperCase(),vals=[100,250,500,1000],v=vals[Math.floor(Math.random()*vals.length)],back=v*CREDIT_BACK_RATE;if(Math.random()<.55){state.usdc.unshift([ts,'Crate Purchase','In',v,`$${v.toLocaleString()} crate opened`,user,'corr_'+id,'Confirmed']);state.creditActivity.unshift([ts,'Credit Back','In',back,`$${v.toLocaleString()} crate · paid with USDC`,user,'corr_'+id,'Confirmed'])}else{state.creditActivity.unshift([ts,'Credit Spend','Out',v,`$${v.toLocaleString()}-equivalent crate purchase`,user,'corr_'+id,'Confirmed']);state.creditActivity.unshift([ts,'Credit Back','In',back,`$${v.toLocaleString()} crate · paid with Credits`,user,'corr_'+id,'Confirmed'])}renderUsdc();renderCreditActivity();if($('lastUpdated'))$('lastUpdated').textContent=new Date().toLocaleString()}

patchUI();bind();renderAll();setInterval(demo,15000);
