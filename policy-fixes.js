/* Final treasury display fixes layered after policy-overrides.js. */
(function () {
  function projectedAutoCreditBack() {
    return state.pendingItems
      .filter(item => item.status === 'Vaulted')
      .reduce((sum, item) => sum + pendingLiquidationAmount(item), 0);
  }

  function syncRules() {
    const grid = document.querySelector('#rules .rules-grid');
    if (!grid) return;

    const rules = [
      ['Credits','Non-cash units','Credits have no direct cash value in treasury reporting. They only affect real cash when a physical claim or other USDC settlement creates a real obligation.'],
      ['Credit Spend','Entry removed','A Credits-funded crate immediately removes the crate entry amount from the user’s Credit balance.'],
      ['Immediate Credit Back','80% of prize FMV','For a Credits-funded prize settled immediately, the user receives Credits equal to 80% of the prize FMV. It is based on outcome value, not crate entry.'],
      ['USDC Cashback','80% of prize FMV','For a USDC-funded prize settled immediately, the user receives 80% of the prize FMV in USDC. No Credits are paid for that immediate settlement.'],
      ['Crate Bonus','5% of entry','Every crate emits a separate bonus equal to 5% of crate entry value, whether the crate was funded with USDC or Credits.'],
      ['Vaulted Item','365-day claim window','A vaulted prize does not immediately trigger Credit Back or a USDC outflow. The user can list, physically redeem, or liquidate it during the 365-day window.'],
      ['Pending Liquidation','70% capped','During the 365-day window, liquidation is 70% × min(initial prize FMV, current live FMV). Upside is capped at reveal FMV; downside follows the market.'],
      ['Liquidation Asset','Original settlement asset','During the 365-day window, Credits-funded vaults liquidate to Credits and USDC-funded vaults liquidate to USDC.'],
      ['365-Day Window','Auto Credit Back','At day 365, if the item is still unresolved, the user loses the choice to redeem or liquidate. The item is removed from the vault and automatically settled into Credits.'],
      ['Auto Credit Back','70% capped · Credits','The day-365 settlement is always Credits, regardless of original payment method, using 70% × min(initial FMV, live FMV at expiry).'],
      ['After Auto Credit Back','Credits remain available','If the user is inactive, the Credits remain in the account. They can return later and use those Credits to open or reroll into another crate.'],
      ['Physical Redemption','Actual acquisition cost','When a user redeems physically, Chosen records the actual amount paid to source the item as USDC outflow—not the displayed prize FMV.'],
      ['Shipping','Separate cash flows','Shipping charged to the user is a USDC inflow. Carrier, handling, and fulfillment costs are separate USDC outflows.'],
      ['Marketplace','Only the fee is revenue','Marketplace sale principal is not Chosen revenue. Only Chosen’s marketplace fee is recorded as company revenue. Demo fee: 1%.'],
      ['Supplier Payout','Actual cost basis','Paid supplier payouts are real USDC outflows tied to fulfillment cost basis. Pending or awaiting-invoice amounts are accounts-payable exposure, not completed cash movement.'],
      ['Pool Revenue','Allocated revenue only','Pool Revenue records Chosen’s actual allocated revenue, not the gross transaction value that generated it.'],
      ['Lulu Single','100 Credits','Each Lulu burned emits 100 Credits.'],
      ['Lulu Triple','333 Credits','Every three Lulus burned emit 333 Credits total, including the 33-Credit triple bonus.']
    ];

    grid.innerHTML = rules.map((r, i) =>
      `<article class="rule-card${i === 8 || i === 9 ? ' accent-rule' : ''}"><span>${r[0]}</span><strong>${r[1]}</strong><p>${r[2]}</p></article>`
    ).join('');

    const note = document.querySelector('#rules .rule-note');
    if (note) {
      note.innerHTML = '<b>Accounting boundary:</b> Credits are non-cash platform units. Vaulted prizes are pending exposure, not realized cash outflows. Real USDC leaves treasury for USDC cashback, physical acquisition/fulfillment, shipping costs, and paid supplier obligations. Unresolved vaults automatically close at day 365 through Auto Credit Back in Credits.';
    }
  }

  function syncAutoCreditBackUi() {
    const projected = projectedAutoCreditBack();

    setText('pendingCreditMetric', credits(projected));
    setText('creditsPendingBack', credits(projected));

    const creditsMetric = document.getElementById('creditsPendingBack')?.closest('.metric-card');
    if (creditsMetric) {
      creditsMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      creditsMetric.querySelector('.metric-foot').textContent = 'Credits if every current vault reaches day 365 unresolved';
    }

    const activityMetric = document.getElementById('pendingCreditMetric')?.closest('.metric-card');
    if (activityMetric) {
      activityMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      activityMetric.querySelector('.metric-foot').textContent = 'All unresolved vaulted items settle to Credits at day 365';
    }

    const exposureStrip = document.querySelector('#credits .exposure-strip');
    if (exposureStrip) {
      let value = document.getElementById('autoCreditBackExposure');
      if (!value) {
        const card = document.createElement('div');
        card.innerHTML = '<span>Projected Auto Credit Back</span><strong id="autoCreditBackExposure">0 cr</strong>';
        exposureStrip.insertBefore(card, exposureStrip.lastElementChild || null);
        value = document.getElementById('autoCreditBackExposure');
      }
      setText('autoCreditBackExposure', credits(projected) + ' cr');
    }

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(el => el.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'The user has 365 days to list, redeem, or liquidate. If they do nothing, the item disappears from the vault at day 365 and Auto Credit Back deposits the capped 70% amount into Credits.';
    }

    syncRules();
  }

  const baseRenderAll = renderAll;
  renderAll = function () {
    baseRenderAll();
    syncAutoCreditBackUi();
  };

  renderAll();
})();
