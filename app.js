const LULU_SUPPLY = 3333;
const LULU_LIFETIME_MAX = Math.floor(LULU_SUPPLY / 3) * 333 + (LULU_SUPPLY % 3) * 100;
const initialBurned = 37;

const state = {
  luluBurned: initialBurned,
  luluEmitted: 4096,
  ledger: [
    ['2026-09-12 11:58:42','Crate purchase','USDC','100.00','80.00','USDC','usr_7J2K','corr_9f2a81','Confirmed'],
    ['2026-09-12 11:57:18','Crate purchase','Credits','100','80','Credits','usr_2P8D','corr_f37c11','Confirmed'],
    ['2026-09-12 11:54:07','Cashback','USDC','0.00','420.00','USDC','usr_4W1A','corr_81a2db','Confirmed'],
    ['2026-09-12 11:49:36','Lulu burn','Lulu','3','333','Credits','usr_1TR8','corr_40c6e1','Confirmed'],
    ['2026-09-12 11:46:19','Credit spend','Credits','500','0','Credits','usr_9N3F','corr_1c70dd','Confirmed'],
    ['2026-09-12 11:40:12','Crate purchase','USDC','250.00','200.00','USDC','usr_6LM2','corr_7a981e','Confirmed'],
    ['2026-09-12 11:35:55','Adjustment','Credits','0','150','Credits','usr_3X5Q','corr_f92b73','Pending'],
    ['2026-09-12 11:29:03','Crate purchase','Credits','1000','800','Credits','usr_8Q4E','corr_a81733','Confirmed'],
    ['2026-09-12 11:22:41','Crate purchase','USDC','500.00','400.00','USDC','usr_7J2K','corr_704bc1','Confirmed'],
    ['2026-09-12 11:16:02','Lulu burn','Lulu','2','200','Credits','usr_5V9R','corr_c996d2','Confirmed'],
    ['2026-09-12 11:09:16','Crate purchase','USDC','100.00','80.00','USDC','usr_0K1C','corr_43bb0f','Confirmed'],
    ['2026-09-12 11:02:24','Crate purchase','Credits','250','200','Credits','usr_2P8D','corr_d09174','Confirmed']
  ],
  recon: [
    ['2026-09-12 11:52:12','USDC wallet · 0x41a…d91','$18,300.00','$18,295.00','-$5.00','High','Mismatch','tx_8b7c11'],
    ['2026-09-12 11:52:12','USDC wallet · 0x8d2…a31','$22,408.18','$22,408.18','$0.00','Info','Matched','wallet_8d2'],
    ['2026-09-12 11:52:11','Credits ledger · usr_7J2K','2,480 cr','2,480 cr','0 cr','Info','Matched','usr_7J2K'],
    ['2026-09-12 11:52:11','Credits ledger · usr_2P8D','5,110 cr','5,110 cr','0 cr','Info','Matched','usr_2P8D'],
    ['2026-09-12 11:52:11','Pending cashback queue','6 entries','6 entries','0','Info','Matched','queue_credits'],
    ['2026-09-12 11:52:11','Lulu emission ledger','4,096 cr','4,096 cr','0 cr','Info','Matched','lulu_emissions'],
    ['2026-09-12 11:52:11','Treasury reserve','$128,440.22','$128,440.22','$0.00','Info','Matched','treasury_main']
  ],
  credits: [
    ['2026-09-12 11:57:19','usr_2P8D','Crate cashback','+80','5,110','corr_f37c11','Confirmed'],
    ['2026-09-12 11:49:36','usr_1TR8','Lulu burn','+333','2,033','corr_40c6e1','Confirmed'],
    ['2026-09-12 11:46:19','usr_9N3F','Crate spend','-500','1,225','corr_1c70dd','Confirmed'],
    ['2026-09-12 11:35:55','usr_3X5Q','Manual adjustment','+150','3,600','corr_f92b73','Pending'],
    ['2026-09-12 11:29:04','usr_8Q4E','Crate cashback','+800','9,240','corr_a81733','Confirmed'],
    ['2026-09-12 11:16:03','usr_5V9R','Lulu burn','+200','1,400','corr_c996d2','Confirmed'],
    ['2026-09-12 10:52:14','usr_0K1C','Promo','+250','950','promo_sep12','Confirmed'],
    ['2026-09-12 10:33:47','usr_7J2K','Crate spend','-100','2,480','corr_b11fc0','Confirmed'],
    ['2026-09-12 10:29:12','usr_4W1A','Crate cashback','+420','4,885','corr_81a2db','Confirmed']
  ],
  lulu: [
    ['2026-07-28 00:33:39','usr_1TR8','36, 37','2','200','0','0xa16ed92f5…','Confirmed'],
    ['2026-07-14 04:56:13','usr_1TR8','35','1','100','0','0x6c758d0f6…','Confirmed'],
    ['2026-07-08 18:54:40','usr_1TR8','33, 34','2','200','0','0x0bff3d2a7…','Confirmed'],
    ['2026-07-07 19:06:01','usr_1TR8','25, 31','2','200','0','0x208523753…','Confirmed'],
    ['2026-07-04 08:12:12','usr_1TR8','48','1','100','0','0xbc1b21011…','Confirmed'],
    ['2026-07-04 08:12:03','usr_1TR8','14','1','100','0','0xfa007b284…','Confirmed'],
    ['2026-07-03 20:20:04','usr_1TR8','26, 27, 28','3','333','33','0xa1bbfa767…','Confirmed'],
    ['2026-07-03 19:22:37','usr_7B4Q','41, 42, 43','3','333','33','0x6cba20bff…','Confirmed']
  ],
  rules: [
    ['2026-06-13 09:05:56','USDC cashback rate','—','80%','system','Initial treasury configuration'],
    ['2026-06-13 09:05:56','Credit cashback rate','—','80%','system','Initial treasury configuration'],
    ['2026-06-13 09:05:56','Market fee','—','0%','system','Initial launch configuration'],
    ['2026-06-13 09:05:56','Purchase fee','—','0%','system','Initial launch configuration'],
    ['2026-06-13 09:05:56','Lulu single burn','—','100 credits','system','Lulu burn program'],
    ['2026-06-13 09:05:56','Lulu triple burn','—','333 credits','system','Lulu bonus rule']
  ]
};

const overviewRows = [
  ['11:58:42','Crate purchase','USDC','$100.00','$80.00','+$20.00','Confirmed'],
  ['11:57:19','Credit crate + cashback','Credits','100 cr','80 cr','-20 cr','Confirmed'],
  ['11:49:36','Lulu emission','Credits','—','333 cr','-333 cr','Confirmed'],
  ['11:40:12','Crate purchase','USDC','$250.00','$200.00','+$50.00','Confirmed'],
  ['11:29:04','Credit crate + cashback','Credits','1,000 cr','800 cr','-200 cr','Confirmed'],
  ['11:22:41','Crate purchase','USDC','$500.00','$400.00','+$100.00','Confirmed']
];

function statusBadge(v){ const c=v.toLowerCase().replace(/\s/g,'-'); return `<span class="badge ${c}">${v}</span>`; }
function assetBadge(v){ const c=v.toLowerCase(); return `<span class="badge asset-${c}">${v}</span>`; }
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])); }

function renderOverview(){
  document.getElementById('overviewTable').innerHTML = overviewRows.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${assetBadge(r[2])}</td><td>${r[3]}</td><td>${r[4]}</td><td class="${r[5].startsWith('+')?'positive-text':'negative-text'}">${r[5]}</td><td>${statusBadge(r[6])}</td></tr>`).join('');
  const assets=[96,101,107,111,119,128], liabilities=[26,27,28,29,30,31]; const labels=['Apr','May','Jun','Jul','Aug','Sep'];
  const chart=document.getElementById('treasuryChart'); chart.innerHTML=labels.map((m,i)=>`<div class="bar-group"><div class="bar asset" title="$${assets[i]}k assets" style="height:${assets[i]/1.35}%"></div><div class="bar liability" title="$${liabilities[i]}k liabilities" style="height:${liabilities[i]/1.35}%"></div><div class="bar-label">${m}</div></div>`).join('');
}

function renderLedger(){
  const q=(document.getElementById('ledgerSearch')?.value||'').toLowerCase();
  const a=document.getElementById('ledgerAsset')?.value||'all', t=document.getElementById('ledgerType')?.value||'all', s=document.getElementById('ledgerStatus')?.value||'all';
  const filtered=state.ledger.filter(r=>(!q||r.join(' ').toLowerCase().includes(q))&&(a==='all'||r[2]===a||r[5]===a)&&(t==='all'||r[1]===t)&&(s==='all'||r[8]===s));
  document.getElementById('ledgerTable').innerHTML=filtered.map(r=>{
    const invalid=(r[1]==='Crate purchase'&&r[2]==='USDC'&&r[5]!=='USDC')||(r[1]==='Crate purchase'&&r[2]==='Credits'&&r[5]!=='Credits');
    return `<tr><td class="mono">${r[0]}</td><td>${r[1]}${invalid?' <span class="badge failed">Invalid pair</span>':''}</td><td>${assetBadge(r[2])}</td><td>${r[3]}</td><td>${r[4]}</td><td>${assetBadge(r[5])}</td><td class="mono">${r[6]}</td><td class="mono">${r[7]}</td><td>${statusBadge(r[8])}</td></tr>`;
  }).join('');
  return filtered;
}

function renderRecon(){
  const sev=document.getElementById('reconSeverity')?.value||'all', res=document.getElementById('reconStatus')?.value||'all', q=(document.getElementById('reconSearch')?.value||'').toLowerCase();
  const filtered=state.recon.filter(r=>(sev==='all'||r[5]===sev)&&(res==='all'||r[6]===res)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('reconTable').innerHTML=filtered.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="${r[4].startsWith('-')?'negative-text':''}">${r[4]}</td><td>${statusBadge(r[5])}</td><td>${statusBadge(r[6])}</td><td class="mono">${r[7]}</td></tr>`).join('');
  return filtered;
}

function renderCredits(){
  const q=(document.getElementById('creditSearch')?.value||'').toLowerCase(), src=document.getElementById('creditSource')?.value||'all';
  const filtered=state.credits.filter(r=>(src==='all'||r[2]===src)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('creditTable').innerHTML=filtered.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="${r[3].startsWith('+')?'positive-text':'negative-text'}">${r[3]}</td><td>${r[4]} cr</td><td class="mono">${r[5]}</td><td>${statusBadge(r[6])}</td></tr>`).join('');
  const sources=[['Crate cashback',57],['Lulu burns',18],['Promos',16],['Manual adjustments',9]];
  document.getElementById('creditSourceBars').innerHTML=sources.map(([n,p])=>`<div class="hbar-row"><div class="hbar-label"><b>${n}</b><span>${p}% of lifetime issuance</span></div><div class="hbar-track"><div class="hbar-fill" style="width:${p}%"></div></div></div>`).join('');
  return filtered;
}

function maxLuluEmission(n){return Math.floor(n/3)*333+(n%3)*100}
function renderLulu(){
  const remaining=LULU_SUPPLY-state.luluBurned, remainingMax=maxLuluEmission(remaining), lost=LULU_LIFETIME_MAX-state.luluEmitted-remainingMax;
  const bonus=Math.max(0,state.luluEmitted-(state.luluBurned*100));
  document.getElementById('luluBurned').textContent=state.luluBurned.toLocaleString(); document.getElementById('luluRemaining').textContent=remaining.toLocaleString();
  document.getElementById('luluEmitted').textContent=state.luluEmitted.toLocaleString(); document.getElementById('creditsLuluIssued').textContent=state.luluEmitted.toLocaleString();
  document.getElementById('luluMaxRemaining').textContent=remainingMax.toLocaleString(); document.getElementById('overviewLuluRemaining').textContent=remainingMax.toLocaleString()+' cr';
  document.getElementById('luluBonusIssued').textContent=bonus.toLocaleString(); document.getElementById('luluLostPotential').textContent=Math.max(0,lost).toLocaleString();
  document.getElementById('luluProgressText').textContent=`${state.luluBurned.toLocaleString()} / ${LULU_SUPPLY.toLocaleString()}`; document.getElementById('luluSupplyProgress').style.width=`${Math.max(.3,(state.luluBurned/LULU_SUPPLY)*100)}%`;
  const q=(document.getElementById('luluSearch')?.value||'').toLowerCase(), st=document.getElementById('luluStatus')?.value||'all'; const filtered=state.lulu.filter(r=>(st==='all'||r[7]===st)&&(!q||r.join(' ').toLowerCase().includes(q)));
  document.getElementById('luluTable').innerHTML=filtered.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="positive-text">+${r[4]} cr</td><td>${Number(r[5])?`+${r[5]} cr`:'—'}</td><td class="mono">${r[6]}</td><td>${statusBadge(r[7])}</td></tr>`).join('');
  return filtered;
}
function renderRules(){document.getElementById('rulesTable').innerHTML=state.rules.map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="mono">${r[4]}</td><td>${r[5]}</td></tr>`).join('');}

function setLastUpdated(){const d=new Date(); document.getElementById('lastUpdated').textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)}

function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function downloadCSV(name, headers, rows){const content=[headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'); const blob=new Blob([content],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`chosen-treasury-${name}-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);showToast('CSV exported');}

const exportMap={
  overview:()=>downloadCSV('overview',['Time','Event','Asset','In','Out','Net','Status'],overviewRows),
  ledger:()=>downloadCSV('ledger',['Time','Event','Paid with','Amount','Cashback','Cashback asset','User','Correlation ID','Status'],renderLedger()),
  reconciliation:()=>downloadCSV('reconciliation',['Checked at','Scope','Internal','Observed','Difference','Severity','Result','Reference'],renderRecon()),
  credits:()=>downloadCSV('credits',['Time','User','Source','Change','Balance after','Reference','Status'],renderCredits()),
  lulu:()=>downloadCSV('lulu',['Time','User','Token IDs','NFT count','Credits issued','Bonus','Tx hash','Status'],renderLulu()),
  rules:()=>downloadCSV('rules',['Time','Rule','Previous','New','Changed by','Reason'],state.rules)
};

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active');}));
document.querySelectorAll('[data-export]').forEach(btn=>btn.addEventListener('click',()=>exportMap[btn.dataset.export]()));
['ledgerSearch','ledgerAsset','ledgerType','ledgerStatus'].forEach(id=>document.getElementById(id).addEventListener('input',renderLedger));
['reconSeverity','reconStatus','reconSearch'].forEach(id=>document.getElementById(id).addEventListener('input',renderRecon));
['creditSearch','creditSource'].forEach(id=>document.getElementById(id).addEventListener('input',renderCredits));
['luluSearch','luluStatus'].forEach(id=>document.getElementById(id).addEventListener('input',renderLulu));
document.getElementById('refreshBtn').addEventListener('click',()=>{setLastUpdated();showToast('Treasury refreshed')});

function addLiveDemoEvent(){
  const now=new Date(); const ts=now.toISOString().slice(0,19).replace('T',' '); const useUsdc=Math.random()>.45; const amounts=useUsdc?[100,250,500]:[100,250,500,1000]; const amount=amounts[Math.floor(Math.random()*amounts.length)]; const cb=Math.round(amount*.8*100)/100; const user='usr_'+Math.random().toString(36).slice(2,6).toUpperCase(); const corr='corr_'+Math.random().toString(16).slice(2,8);
  state.ledger.unshift([ts,'Crate purchase',useUsdc?'USDC':'Credits',useUsdc?amount.toFixed(2):String(amount),useUsdc?cb.toFixed(2):String(cb),useUsdc?'USDC':'Credits',user,corr,'Confirmed']); if(state.ledger.length>30)state.ledger.pop();
  setLastUpdated(); renderLedger();
  const active=document.querySelector('.tab.active')?.dataset.tab;if(active==='ledger')showToast('New ledger event received');
}

renderOverview();renderLedger();renderRecon();renderCredits();renderLulu();renderRules();setLastUpdated();
setInterval(setLastUpdated,5000); setInterval(addLiveDemoEvent,15000);
