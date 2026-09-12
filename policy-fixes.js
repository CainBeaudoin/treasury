/* Final treasury display fixes layered after policy-overrides.js. */
(function () {
  function projectedAutoCreditBack() {
    return state.pendingItems
      .filter(item => item.status === 'Vaulted')
      .reduce((sum, item) => sum + pendingLiquidationAmount(item), 0);
  }

  function syncAutoCreditBackUi() {
    const projected = projectedAutoCreditBack();

    // This metric covers every vaulted item because day-365 settlement is always Credits,
    // regardless of whether the crate originally used USDC or Credits.
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
      let card = document.getElementById('autoCreditBackExposure');
      if (!card) {
        card = document.createElement('div');
        card.innerHTML = '<span>Projected Auto Credit Back</span><strong id="autoCreditBackExposure">0 cr</strong>';
        exposureStrip.insertBefore(card, exposureStrip.lastElementChild || null);
      }
      setText('autoCreditBackExposure', credits(projected) + ' cr');
    }

    document.querySelectorAll('#rules .rule-card').forEach(card => {
      const label = card.querySelector('span')?.textContent.trim();
      if (label === '365-Day Fallback' || label === '365-Day Expiry' || label === '365-Day Window') {
        card.innerHTML = '<span>365-Day Window</span><strong>Auto Credit Back</strong><p>During the 365-day window, the user can list, redeem, or liquidate. At day 365, if the item is still unresolved, it is removed from the vault and automatically settled in Credits at 70% × min(initial FMV, live FMV).</p>';
      }
    });

    const pendingHead = [...document.querySelectorAll('#credits .subsection-head h3')]
      .find(el => el.textContent.trim() === 'Pending item exposure');
    if (pendingHead) {
      const p = pendingHead.parentElement?.querySelector('p');
      if (p) p.textContent = 'The user has 365 days to list, redeem, or liquidate. If they do nothing, the item disappears from the vault at day 365 and Auto Credit Back deposits the capped 70% amount into Credits.';
    }
  }

  const baseRenderAll = renderAll;
  renderAll = function () {
    baseRenderAll();
    syncAutoCreditBackUi();
  };

  renderAll();
})();
