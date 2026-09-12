/* Final treasury QA and simplification layer. Runs after visual-hierarchy.js. */
(function () {
  const VERSION = 'treasury-audit-v3-credit-layout';
  const CREDIT_OPENING_SUPPLY = 83573;
  const num = v => Number(v || 0);
  const textNumber = v => {
    const n = Number(String(v || '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const usd = v => typeof money === 'function' ? money(num(v)) : '$' + num(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  const cr = v => typeof credits === 'function' ? credits(num(v)) : num(v).toLocaleString(undefined,{maximumFractionDigits:2});
  const equal = (a,b) => Math.abs(num(a)-num(b)) <= .005;
  const cardById = id => document.getElementById(id)?.closest('.metric-card, .overview-summary > div, .lulu-stat') || null;
  const cardByLabel = (root,label) => root ? [...root.querySelectorAll('.metric-card,.overview-summary>div,.lulu-stat,.rule-card')].find(c=>c.querySelector('.metric-label,span')?.textContent.trim()===label) || null : null;
  const valueOf = card => textNumber(card?.querySelector('.metric-value,strong')?.textContent);

  function relabel(card,label,foot) {
    if (!card) return;
    const l=card.querySelector('.metric-label'); const f=card.querySelector('.metric-foot');
    if (l && label) l.textContent=label;
    if (f && foot!==undefined) f.textContent=foot;
  }
  function setValue(card,value){ const el=card?.querySelector('.metric-value,strong'); if(el) el.textContent=value; }
  function setTone(card,tone){ if(!card)return; card.classList.remove('tone-positive','tone-negative','tone-warning','tone-info'); if(tone)card.classList.add('tone-'+tone); }

  function snapshot() {
    const odto=document.getElementById('odtoPayoutView');
    const inventory=cardByLabel(odto,'ODTO inventory value')||cardByLabel(odto,'Warehouse stock at cost');
    const paid=cardByLabel(odto,'Paid to ODTO');
    const open=cardByLabel(odto,'Open ODTO payable')||cardByLabel(odto,'Inbound / open AP');
    const reusable=cardByLabel(odto,'Reusable crate inventory')||cardByLabel(odto,'Inventory allocation');
    const vault=cardByLabel(odto,'User vault custody');
    const inventoryValue=valueOf(inventory), paidToOdto=valueOf(paid), openAp=valueOf(open), reusableValue=valueOf(reusable), vaultValue=valueOf(vault);
    const redeemedValue=Math.max(0,paidToOdto-inventoryValue);
    const allocatedInventoryCost=Math.max(0,paidToOdto-reusableValue);
    const earnedRevenue=Array.isArray(state?.poolRevenue)?state.poolRevenue.reduce((s,r)=>s+num(r[4]),0):valueOf(cardById('rpEarned'));
    const requiredReserve=valueOf(cardById('rpReserve'));
    const treasury=typeof TREASURY_USDC!=='undefined'?num(TREASURY_USDC):valueOf(cardByLabel(document.getElementById('overviewSummary'),'Treasury USDC'));
    const hard=typeof HARD_USDC_OBLIGATIONS!=='undefined'?num(HARD_USDC_OBLIGATIONS):0;
    const operatingProfit=earnedRevenue-allocatedInventoryCost;
    const liquiditySurplus=Math.max(0,treasury-hard-requiredReserve);
    const safeWithdrawal=Math.max(0,Math.min(operatingProfit,liquiditySurplus));
    const postWithdrawalCushion=Math.max(0,liquiditySurplus-safeWithdrawal);
    const stockInflow=valueOf(cardById('stockInflow')), stockOutflow=valueOf(cardById('stockOutflow'));
    const stockMargin=stockInflow-stockOutflow, stockPacks=stockInflow?stockInflow/50:0;
    const creditNet=typeof netCreditChange==='function'?netCreditChange():0;
    const creditSupply=CREDIT_OPENING_SUPPLY+creditNet;
    const newEmissions=typeof newCreditEmissions==='function'?newCreditEmissions():0;
    const crateBonus=typeof sumRows==='function'?sumRows(state.creditActivity,'Crate Bonus','In'):0;
    const luluEmission=typeof sumRows==='function'?sumRows(state.creditActivity,'Lulu Emission','In'):0;
    const promotions=typeof sumRows==='function'?sumRows(state.creditActivity,'Promotional Run','In'):0;
    const autoCreditExposure=Array.isArray(state?.pendingItems)&&typeof pendingLiquidationAmount==='function'?state.pendingItems.filter(x=>x.status==='Vaulted').reduce((s,x)=>s+pendingLiquidationAmount(x),0):valueOf(cardById('creditsPendingBack'));
    return {inventory,paid,open,reusable,vault,inventoryValue,paidToOdto,openAp,reusableValue,vaultValue,redeemedValue,allocatedInventoryCost,earnedRevenue,requiredReserve,treasury,hard,operatingProfit,liquiditySurplus,safeWithdrawal,postWithdrawalCushion,stockInflow,stockOutflow,stockMargin,stockPacks,creditNet,creditSupply,newEmissions,crateBonus,luluEmission,promotions,autoCreditExposure};
  }

  function styles(){
    document.getElementById('treasuryAuditStyles')?.remove();
    const s=document.createElement('style'); s.id='treasuryAuditStyles'; s.textContent=`
      .audit-hidden{display:none!important}
      #poolRevenue .finance-kpis{grid-template-columns:repeat(12,minmax(0,1fr))!important}#poolRevenue .revenue-profit-hero{grid-column:1/-1!important}#poolRevenue .revenue-support{grid-column:span 4!important}
      #odtoPayoutView .inventory-kpis{grid-template-columns:repeat(12,minmax(0,1fr))!important}#odtoPayoutView .odto-inventory-hero{grid-column:1/-1!important}#odtoPayoutView .odto-support{grid-column:span 4!important}
      .credits-executive{
        border:1px solid rgba(102,183,255,.3);
        background:linear-gradient(180deg,rgba(102,183,255,.07),var(--surface) 72%);
        border-radius:14px;
        padding:12px;
        margin:4px 0 16px;
        display:grid;
        grid-template-columns:repeat(12,minmax(0,1fr));
        gap:10px;
        align-items:stretch;
        box-shadow:inset 0 2px 0 var(--info);
        min-width:0
      }
      .credits-executive-main{
        grid-column:1/-1;
        display:grid;
        grid-template-columns:minmax(160px,.9fr) auto minmax(220px,1fr);
        align-items:center;
        gap:16px;
        min-width:0;
        padding:13px 14px
      }
      .credits-executive-main span,.credits-executive-stat span{
        display:block;
        font-size:10px;
        line-height:1.35;
        color:var(--muted);
        margin-bottom:6px;
        overflow-wrap:anywhere
      }
      .credits-executive-main strong{
        display:block;
        font-size:30px;
        letter-spacing:-.045em;
        line-height:1.05;
        color:var(--info);
        white-space:nowrap
      }
      .credits-executive-main small{
        display:block;
        color:var(--muted);
        font-size:10px;
        line-height:1.4;
        text-align:right;
        overflow-wrap:anywhere
      }
      .credits-executive-stat{
        grid-column:span 4;
        min-width:0;
        min-height:74px;
        padding:12px 14px;
        border:1px solid var(--border);
        background:var(--surface2);
        border-radius:10px;
        display:flex;
        flex-direction:column;
        justify-content:center
      }
      .credits-executive-stat strong{
        display:block;
        font-size:20px;
        line-height:1.15;
        letter-spacing:-.025em;
        white-space:normal;
        overflow-wrap:anywhere
      }
      .credits-executive-source{
        grid-column:1/-1;
        border-top:1px solid var(--border);
        padding:9px 2px 1px;
        font-size:10px;
        line-height:1.5;
        color:var(--muted);
        white-space:normal;
        overflow-wrap:anywhere
      }
      .credits-executive-source b{color:#c6d1dd;font-weight:600}
      #creditsCoreView>.two-col,#creditsCoreView>.subsection-head,#creditsCoreView>.exposure-strip{display:none!important}
      @media(max-width:1000px){
        .credits-executive-main{grid-template-columns:1fr auto;gap:10px 16px}
        .credits-executive-main small{grid-column:1/-1;text-align:left}
        .credits-executive-stat{grid-column:span 4}
      }
      @media(max-width:820px){
        .credits-executive-stat{grid-column:span 6}
        .credits-executive-stat:nth-of-type(4){grid-column:1/-1}
      }
      @media(max-width:700px){
        .credits-executive{grid-template-columns:1fr;padding:10px}
        .credits-executive-main,.credits-executive-stat,.credits-executive-source{grid-column:1!important}
        .credits-executive-main{grid-template-columns:1fr;padding:10px 8px}
        .credits-executive-main strong{font-size:27px;white-space:normal}
        .credits-executive-main small{text-align:left}
        .credits-executive-stat{min-height:68px}
      }`;
    document.head.appendChild(s);
  }

  function improveOverview(x){
    const grid=document.getElementById('overviewSummary'); if(!grid)return;
    const profit=cardById('ovProfit'), payouts=cardById('ovPayouts');
    setValue(profit,usd(x.safeWithdrawal)); relabel(profit,'Withdrawable profit',`Leaves ${usd(x.postWithdrawalCushion)} above obligations and reserves`);
    setValue(payouts,usd(x.paidToOdto+x.stockOutflow)); relabel(payouts,'Cash payouts',`ODTO ${usd(x.paidToOdto)} · stocks ${usd(x.stockOutflow)} · inventory ${usd(x.inventoryValue)}`); setTone(payouts,'negative');
  }

  function improveRevenue(x){
    const operating=cardById('rpOperatingProfit'), safe=cardById('rpWithdrawable'), earned=cardById('rpEarned'), reserve=cardById('rpReserve');
    if(!safe)return;
    setValue(safe,usd(x.safeWithdrawal)); setValue(operating,usd(x.operatingProfit));
    [safe,operating,earned,reserve].forEach(c=>c?.classList.remove('hierarchy-hidden'));
    safe.classList.add('hierarchy-hero','revenue-profit-hero');
    [operating,earned,reserve].forEach(c=>c?.classList.add('hierarchy-medium','revenue-support'));
    if(equal(x.operatingProfit,x.safeWithdrawal)){
      relabel(safe,'Withdrawable operating profit','Operating profit is the limiting factor; treasury liquidity is sufficient');
      relabel(operating,'Post-withdrawal cushion','Liquidity left above hard obligations and required reserves after withdrawal'); setValue(operating,usd(x.postWithdrawalCushion)); setTone(operating,'info');
    }else{
      relabel(safe,'Safe withdrawal','Capped by operating profit and available treasury liquidity'); relabel(operating,'Operating profit','Earned revenue less allocated inventory cost');
    }
    document.querySelectorAll('#rpWaterfall tr').forEach(r=>{const td=r.querySelector('td'); if(td?.textContent.trim()==='Inventory COGS recognized')td.textContent='Allocated inventory cost';});
  }

  function improveOdto(x){
    const grid=document.querySelector('#odtoPayoutView .inventory-kpis'); if(!grid)return;
    relabel(x.inventory,'ODTO inventory value',`${usd(x.reusableValue)} reusable · ${usd(x.vaultValue)} user vault`);
    relabel(x.paid,'Paid to ODTO',`${usd(x.redeemedValue)} of paid inventory has been redeemed`);
    relabel(x.open,'Open ODTO payable','Inbound inventory ordered but not yet paid / received');
    relabel(x.reusable,'Inventory allocation',`${usd(x.vaultValue)} allocated to user vaults`); setValue(x.reusable,usd(x.reusableValue));
    x.vault?.classList.add('audit-hidden');
    [x.paid,x.open,x.reusable].forEach(c=>{c?.classList.add('hierarchy-medium','odto-support');});
  }

  function improveStocks(x){
    const margin=cardById('stockMargin'); if(!margin)return;
    const rate=x.stockInflow?x.stockMargin/x.stockInflow*100:0;
    setValue(margin,usd(x.stockMargin)); relabel(margin,'Net stock-pack margin',`${x.stockPacks.toFixed(0)} packs · ${usd(x.stockPacks?x.stockMargin/x.stockPacks:0)} avg margin · ${rate.toFixed(1)}%`);
  }

  function compactCredits(x){
    const root=document.getElementById('creditsCoreView'); if(!root)return;
    const intro=root.querySelector('.section-intro p'); if(intro)intro.textContent='Crate-only, non-cash supply.';
    root.querySelector(':scope>.metric-grid')?.classList.add('audit-hidden'); root.querySelector(':scope>.two-col')?.classList.add('audit-hidden'); root.querySelector(':scope>.subsection-head')?.classList.add('audit-hidden'); root.querySelector(':scope>.exposure-strip')?.classList.add('audit-hidden');
    let box=document.getElementById('creditsExecutive'); if(!box){box=document.createElement('article');box.id='creditsExecutive';box.className='credits-executive';root.querySelector('.section-intro')?.insertAdjacentElement('afterend',box);}
    const sign=x.creditNet>=0?'+':'−';
    box.innerHTML=`<div class="credits-executive-main"><span>Credits in circulation</span><strong>${cr(x.creditSupply)}</strong><small>Non-cash units · crates only</small></div><div class="credits-executive-stat"><span>Net change</span><strong class="${x.creditNet>=0?'positive-text':'negative-text'}">${sign}${cr(Math.abs(x.creditNet))}</strong></div><div class="credits-executive-stat"><span>New emissions</span><strong>${cr(x.newEmissions)}</strong></div><div class="credits-executive-stat"><span>Auto Credit Back exposure</span><strong class="warning-text">${cr(x.autoCreditExposure)}</strong></div><div class="credits-executive-source"><b>Emission mix:</b> Lulu ${cr(x.luluEmission)} · Crate Bonus ${cr(x.crateBonus)} · Promotions ${cr(x.promotions)}</div>`;
    const panel=document.getElementById('creditsTable')?.closest('.panel'); if(panel&&!panel.querySelector('.panel-head')){const head=document.createElement('div');head.className='panel-head';head.innerHTML='<div><h3>Credits Activity</h3></div>';panel.insertBefore(head,panel.firstChild);}
    const pending=document.getElementById('pendingItemsTable')?.closest('.panel'); if(pending){pending.classList.remove('audit-hidden');if(!pending.querySelector('.panel-head')){const head=document.createElement('div');head.className='panel-head';head.innerHTML='<div><h3>Pending Item Exposure</h3></div>';pending.insertBefore(head,pending.firstChild);}}
  }

  function fixRules(){
    const root=document.getElementById('rules'); if(!root)return;
    const find=label=>[...root.querySelectorAll('.rule-card')].find(c=>c.querySelector('span')?.textContent.trim()===label);
    const rev=find('Revenue & Reserves'); if(rev)rev.innerHTML='<span>Revenue & Reserves</span><strong>Profit + liquidity test</strong><p>ODTO purchases add inventory rather than becoming an immediate expense. Operating profit deducts inventory allocated to user vaults or redeemed. Safe withdrawal is the lower of operating profit and treasury liquidity above hard obligations and required reserves.</p>';
    const physical=find('Physical Sneakers'); if(physical)physical.innerHTML='<span>Physical Sneakers</span><strong>Inventory → allocated cost</strong><p>Reusable ODTO stock remains inventory. Once a prize is assigned to a user vault or redeemed, its acquisition cost is allocated against platform earnings and replenishment can be ordered.</p>';
  }

  function auditRecon(x){
    if(!Array.isArray(state?.recon))return;
    const refs=new Set(['audit_credit_supply','audit_lulu_ledger','audit_auto_credit','audit_odto_ap','audit_revenue_total','lulu_emissions']); state.recon=state.recon.filter(r=>!refs.has(String(r[7]||'')));
    const p=state.recon.find(r=>String(r[7]||'')==='pending_credit_liquidation'); if(p)p[1]='Within-window Credits liquidation exposure'; const a=state.recon.find(r=>String(r[7]||'')==='qa_inventory_cogs'); if(a)a[1]='Allocated inventory cost';
    const supplyCard=cardByLabel(document.getElementById('creditsCoreView'),'Credits in circulation'); const displayedSupply=valueOf(supplyCard)||x.creditSupply;
    const supplierOpen=Array.isArray(state.supplierPayouts)?state.supplierPayouts.filter(r=>r[6]==='Pending'||r[6]==='Awaiting Invoice').reduce((s,r)=>s+num(r[4]),0):x.openAp;
    const displayedAuto=valueOf(cardById('creditsPendingBack'))||x.autoCreditExposure; const displayedRevenue=valueOf(cardById('rpEarned'))||x.earnedRevenue; const luluLedger=typeof sumRows==='function'?sumRows(state.creditActivity,'Lulu Emission','In'):x.luluEmission;
    const stamp=new Date().toISOString().replace('T',' ').slice(0,19); const checks=[['Credits circulation',displayedSupply,x.creditSupply,'cr','audit_credit_supply'],['Lulu emission ledger',num(state.luluEmitted),luluLedger,'cr','audit_lulu_ledger'],['Auto Credit Back exposure',displayedAuto,x.autoCreditExposure,'cr','audit_auto_credit'],['ODTO open AP / inbound',x.openAp,supplierOpen,'usd','audit_odto_ap'],['Revenue pool total',displayedRevenue,x.earnedRevenue,'usd','audit_revenue_total']];
    checks.reverse().forEach(([label,left,right,fmt,ref])=>{const ok=equal(left,right),f=v=>fmt==='usd'?usd(v):cr(v)+' cr';state.recon.unshift([stamp,label,f(left),f(right),ok?'0':f(left-right),ok?'Info':'High',ok?'Matched':'Mismatch',ref]);});
    if(typeof renderRecon==='function')renderRecon(); const cards=[...document.querySelectorAll('#reconciliation .metric-card')],m=state.recon.filter(r=>r[6]==='Mismatch').length; if(cards[0])cards[0].querySelector('.metric-value').textContent=state.recon.length.toLocaleString(); if(cards[1])cards[1].querySelector('.metric-value').textContent=m.toLocaleString();
  }

  function apply(){
    styles(); const x=snapshot(); improveOverview(x); improveRevenue(x); improveOdto(x); improveStocks(x); compactCredits(x); fixRules(); auditRecon(x); document.body.dataset.treasuryAudit=VERSION;
  }

  document.addEventListener('click',e=>{if(e.target.closest('.tab,.payout-tab,.credit-program-tab,.segment,#refreshBtn')){setTimeout(apply,45);setTimeout(apply,150);}});
  const prev=window.renderAll; if(typeof prev==='function')window.renderAll=function(){prev();setTimeout(apply,10);};
  apply(); setTimeout(apply,180);
})();
