/* Final 365-day Auto Credit Back policy: unresolved vault items become Credits. */
(function () {
  function ensureAutoCreditBackPolicy() {
    const projected = state.pendingItems
      .filter(item => item.status === 'Vaulted')
      .reduce((sum, item) => sum + pendingLiquidationAmount(item), 0);

    // At day 365 the choice ends: the item leaves the vault and settles in Credits.
    // The settlement basis is 70% x min(initial prize FMV, live FMV at settlement).
    setText('pendingCreditMetric', credits(projected));
    setText('creditsPendingBack', credits(projected));

    const activityMetric = document.getElementById('pendingCreditMetric')?.closest('.metric-card');
    if (activityMetric) {
      activityMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      activityMetric.querySelector('.metric-foot').textContent = 'All unresolved vault items convert to Credits at day 365';
    }

    const creditsMetric = document.getElementById('creditsPendingBack')?.closest('.metric-card');
    if (creditsMetric) {
      creditsMetric.querySelector('.metric-label').textContent = 'Projected Auto Credit Back';
      creditsMetric.querySelector('.metric-foot').textContent = 'Credits deposited automatically if current vaults reach expiry';
    }

    const rulesGrid = document.querySelector('#rules .rules-grid');
    if (rulesGrid) {
      let card = [...rulesGrid.querySelectorAll('.rule-card')].find(c => {
        const label = c.querySelector('span')?.textContent.trim();
        return label === 'Auto Credit Back' || label === '365-Day Fallback' || label === '365-Day Expiry';
      });
      if (!card) {
        card = document.createElement('article');
        card.className = 'rule-card';
        rulesGrid.appendChild(card);
      }
      card.innerHTML = '<span>Auto Credit Back</span><strong>Day 365 · Credits</strong><p>If still unresolved at day 365, the item is removed from the vault and automatically settled into Credits at 70% × min(initial FMV, live FMV). There is no opt-out and the original payment method does not matter.</p>';

      let reroll = [...rulesGrid.querySelectorAll('.rule-card')].find(c => c.querySelector('span')?.textContent.trim() === 'After Auto Credit Back');
      if (!reroll) {
        reroll = document.createElement('article');
        reroll.className = 'rule-card';
        rulesGrid.appendChild(reroll);
      }
      reroll.innerHTML = '<span>After Auto Credit Back</span><strong>Credits stay available</strong><p>The Credits remain in the user balance even if they are inactive. They can return later and spend those Credits on a new crate.</p>';
    }

    const note = document.querySelector('#rules .rule-note');
    if (note) note.innerHTML = '<b>365-day settlement:</b> the user has one year to list, redeem, or liquidate a vaulted item. If nothing is done by day 365, the choice ends automatically: the item disappears from the vault, an <b>Auto Credit Back</b> event is written to Credits Activity, and 70% × min(initial FMV, live FMV at settlement) is deposited into the user\'s Credits balance. This happens even if the original crate was purchased with USDC. The Credits remain available until the user returns and can be spent on another crate.';

    const settlePanel = [...document.querySelectorAll('#credits .panel h3')]
      .find(el => el.textContent.trim() === 'How Credits settle')?.closest('.panel');
    if (settlePanel) {
      const stack = settlePanel.querySelector('.info-stack');
      if (stack) stack.innerHTML = '<div><b>Immediate Credit Back</b><span>A Credits-funded prize can be settled immediately at the normal Credit Back rate.</span></div><div><b>Vaulted item</b><span>The user has 365 days to list it, physically redeem it, or use the available liquidation option.</span></div><div><b>Day 365</b><span>If still unresolved, the item is automatically removed from the vault. There is no longer a choice.</span></div><div><b>Auto Credit Back</b><span>70% × the lower of the original prize FMV or the live FMV is deposited in Credits, regardless of whether the original crate used USDC or Credits.</span></div><div><b>Return later</b><span>The Credits stay in the account and can be used later to open another crate.</span></div>';
    }

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(el => el.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'Users have 365 days to act on a vaulted item. At day 365 an unresolved item disappears from the vault and automatically settles into Credits at the capped 70% basis.';
    }

    const activitySelect = document.getElementById('creditActivityType');
    if (activitySelect && ![...activitySelect.options].some(o => o.value === 'Auto Credit Back')) {
      const option = document.createElement('option');
      option.value = 'Auto Credit Back';
      option.textContent = 'Auto Credit Back';
      activitySelect.appendChild(option);
    }
  }

  if (!state.rules.some(r => r[1] === 'Auto Credit Back at expiry')) {
    state.rules.unshift([
      '2026-09-12 14:27:00',
      'Auto Credit Back at expiry',
      'Item simply expires / fallback ambiguous',
      'Day 365: item removed + 70% capped FMV paid automatically in Credits',
      'admin',
      'Preserve user value without forcing a USDC liquidity event; Credits remain available for future crates'
    ]);
  }

  const previousRenderAll = renderAll;
  renderAll = function () {
    previousRenderAll();
    ensureAutoCreditBackPolicy();
    renderRules();
  };

  ensureAutoCreditBackPolicy();
  renderRules();
})();
