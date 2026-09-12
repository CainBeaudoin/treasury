/* Credits program navigation + Lulu burn planning. Loaded after policy-fixes.js. */
(function () {
  const LULU_TOTAL_SUPPLY = 3333;
  const LULU_FIRST_7D_FORECAST = 2000;
  const LULU_FIRST_30D_FORECAST = 2700;
  let activeCreditProgram = 'credits';

  const projectedLuluCredits = n => Math.floor(n / 3) * 333 + (n % 3) * 100;
  const pct = n => (n / LULU_TOTAL_SUPPLY * 100).toFixed(1) + '%';

  function addStyles() {
    if (document.getElementById('creditLuluStyles')) return;
    const style = document.createElement('style');
    style.id = 'creditLuluStyles';
    style.textContent = `
      .credit-program-tabs{display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:4px;margin:0 0 16px}
      .credit-program-tab{border:0;background:transparent;color:var(--muted);padding:8px 18px;border-radius:8px;cursor:pointer;font:inherit}
      .credit-program-tab.active{background:var(--surface3);color:var(--text);box-shadow:0 0 0 1px #2b3541}
      .credit-program-view{display:none}.credit-program-view.active{display:block}
      .lulu-planning-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 14px}
      .lulu-planning-grid .metric-card{min-height:94px}
      .lulu-planning-note{margin:0 0 16px;padding:10px 13px;border:1px solid rgba(255,198,90,.28);background:rgba(255,198,90,.055);border-radius:11px;color:#c9d2dc;font-size:11px;line-height:1.45}
      .lulu-planning-note b{color:var(--warning)}
      @media(max-width:1050px){.lulu-planning-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:700px){.lulu-planning-grid{grid-template-columns:1fr}.credit-program-tabs{display:flex}.credit-program-tab{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function activateProgram(view) {
    activeCreditProgram = view;
    const credits = document.getElementById('credits');
    if (!credits) return;
    credits.querySelectorAll('.credit-program-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.creditProgram === view));
    const core = document.getElementById('creditsCoreView');
    const lulu = document.getElementById('lulu');
    core?.classList.toggle('active', view === 'credits');
    lulu?.classList.toggle('active', view === 'lulu');
  }

  function addLuluPlanning(lulu) {
    const intro = lulu.querySelector('.section-intro');
    if (intro) {
      const h2 = intro.querySelector('h2');
      const p = intro.querySelector('p');
      if (h2) h2.textContent = 'Lulu';
      if (p) p.textContent = 'Burn-driven Credit emissions with no expiration on burn eligibility.';
    }

    let planning = document.getElementById('luluPlanningForecast');
    if (!planning) {
      planning = document.createElement('div');
      planning.id = 'luluPlanningForecast';
      const hero = lulu.querySelector('.lulu-hero');
      (hero || lulu.firstElementChild)?.insertAdjacentElement('beforebegin', planning);
    }

    const first7Credits = projectedLuluCredits(LULU_FIRST_7D_FORECAST);
    const first30Credits = projectedLuluCredits(LULU_FIRST_30D_FORECAST);
    const longTail = LULU_TOTAL_SUPPLY - LULU_FIRST_30D_FORECAST;

    planning.innerHTML = `
      <div class="lulu-planning-grid">
        <article class="metric-card tone-info"><div class="metric-label">Burn eligibility</div><div class="metric-value">No expiry</div><div class="metric-foot">Lulus remain burnable over time</div></article>
        <article class="metric-card tone-warning"><div class="metric-label">7-day planning forecast</div><div class="metric-value">${LULU_FIRST_7D_FORECAST.toLocaleString()}</div><div class="metric-foot">${pct(LULU_FIRST_7D_FORECAST)} of supply · ${first7Credits.toLocaleString()} Credits</div></article>
        <article class="metric-card tone-warning"><div class="metric-label">30-day planning forecast</div><div class="metric-value">${LULU_FIRST_30D_FORECAST.toLocaleString()}</div><div class="metric-foot">${pct(LULU_FIRST_30D_FORECAST)} of supply · ${first30Credits.toLocaleString()} Credits</div></article>
        <article class="metric-card tone-info"><div class="metric-label">Long-tail supply</div><div class="metric-value">${longTail.toLocaleString()}</div><div class="metric-foot">Still available to burn after the initial high-demand period</div></article>
      </div>
      <div class="lulu-planning-note"><b>Planning assumption:</b> burn demand is modeled as front-loaded, but there is no deadline. Forecast Credits are not counted in circulating supply until the corresponding Lulus are actually burned.</div>`;
  }

  function updateRuleCopy() {
    const cards = [...document.querySelectorAll('#rules .rule-card')];
    const luluRule = cards.find(card => card.querySelector('span')?.textContent.trim() === 'Marketplace, Shipping & Lulu');
    if (luluRule) {
      luluRule.innerHTML = '<span>Marketplace, Shipping & Lulu</span><strong>Net economics · no Lulu expiry</strong><p>Marketplace principal is not revenue; only the fee is. Shipping inflow and carrier cost stay separate. Lulu burn eligibility does not expire, and burns emit 100 Credits each or 333 Credits per three.</p>';
    }
  }

  function setupCreditsPrograms() {
    addStyles();

    const credits = document.getElementById('credits');
    const lulu = document.getElementById('lulu');
    if (!credits || !lulu) return;

    // Lulu is a Credit program, not a primary finance section.
    document.querySelectorAll('.tabs .tab[data-tab="lulu"]').forEach(btn => btn.remove());

    let tabs = document.getElementById('creditProgramTabs');
    let core = document.getElementById('creditsCoreView');

    if (!tabs) {
      const existingChildren = [...credits.children];
      core = document.createElement('div');
      core.id = 'creditsCoreView';
      core.className = 'credit-program-view';
      existingChildren.forEach(child => core.appendChild(child));

      tabs = document.createElement('div');
      tabs.id = 'creditProgramTabs';
      tabs.className = 'credit-program-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Credit programs');
      tabs.innerHTML = '<button class="credit-program-tab" data-credit-program="credits">Credits</button><button class="credit-program-tab" data-credit-program="lulu">Lulu</button>';

      credits.appendChild(tabs);
      credits.appendChild(core);
    }

    if (lulu.parentElement !== credits) credits.appendChild(lulu);
    lulu.classList.remove('tab-panel');
    lulu.classList.add('credit-program-view');

    tabs.querySelectorAll('.credit-program-tab').forEach(btn => {
      if (btn.dataset.creditLuluBound) return;
      btn.dataset.creditLuluBound = '1';
      btn.addEventListener('click', () => activateProgram(btn.dataset.creditProgram));
    });

    addLuluPlanning(lulu);
    updateRuleCopy();
    activateProgram(activeCreditProgram);
  }

  const previousRenderAll = renderAll;
  renderAll = function () {
    previousRenderAll();
    setupCreditsPrograms();
  };

  setupCreditsPrograms();
})();
