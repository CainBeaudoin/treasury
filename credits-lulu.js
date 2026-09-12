/* Credits program navigation + Lulu snapshot. Loaded after policy-fixes.js. */
(function () {
  const LULU_TOTAL_SUPPLY = 3333;
  const LULU_SNAPSHOT_BURNED = 1300;
  const LULU_SNAPSHOT_REF = 'lulu_snapshot_1300';
  let activeCreditProgram = 'credits';

  const creditsForBurn = n => Math.floor(n / 3) * 333 + (n % 3) * 100;

  function seededRandom(seed) {
    let x = seed >>> 0;
    return function () {
      x = (1664525 * x + 1013904223) >>> 0;
      return x / 4294967296;
    };
  }

  function buildMixedBurnSnapshot() {
    const random = seededRandom(9132026);
    const mix = [
      [1, .38], [2, .24], [3, .18], [4, .08],
      [6, .06], [9, .03], [12, .02], [15, .01]
    ];
    const transactions = [];
    let burned = 0;
    let emitted = 0;
    let bonus = 0;

    while (burned < LULU_SNAPSHOT_BURNED) {
      const roll = random();
      let cumulative = 0;
      let count = 1;
      for (const [size, weight] of mix) {
        cumulative += weight;
        if (roll < cumulative) { count = size; break; }
      }
      count = Math.min(count, LULU_SNAPSHOT_BURNED - burned);
      const credits = creditsForBurn(count);
      const txBonus = Math.floor(count / 3) * 33;
      transactions.push({ count, credits, bonus: txBonus });
      burned += count;
      emitted += credits;
      bonus += txBonus;
    }

    return { burned, emitted, bonus, transactions };
  }

  const snapshot = buildMixedBurnSnapshot();

  function applyLuluSnapshotState() {
    state.luluBurned = snapshot.burned;
    state.luluEmitted = snapshot.emitted;

    const recent = snapshot.transactions.slice(-16).reverse();
    state.lulu = recent.map((tx, i) => {
      const minute = String(58 - i * 3).padStart(2, '0');
      const ids = Array.from({ length: tx.count }, (_, j) => 1300 - i * 20 - j).filter(n => n > 0).join(', ');
      return [
        `2026-09-12 17:${minute}:00`,
        `usr_L${String(i + 1).padStart(3, '0')}`,
        ids || '—',
        String(tx.count),
        String(tx.credits),
        String(tx.bonus),
        `0xlulu${String(1300 - i).padStart(4, '0')}…`,
        'Confirmed'
      ];
    });
  }

  function syncLuluCreditLedger() {
    state.creditActivity = state.creditActivity.filter(r => r[6] !== LULU_SNAPSHOT_REF);
    state.credits = state.credits.filter(r => r[6] !== LULU_SNAPSHOT_REF);

    const alreadyRepresented = state.creditActivity
      .filter(r => r[1] === 'Lulu Emission')
      .reduce((sum, r) => sum + Number(r[3] || 0), 0);
    const adjustment = Math.max(0, snapshot.emitted - alreadyRepresented);
    if (!adjustment) return;

    state.creditActivity.unshift([
      '2026-09-12 17:59:00',
      'Lulu Emission',
      'In',
      adjustment,
      'Cumulative Lulu burn reconciliation',
      'system',
      LULU_SNAPSHOT_REF,
      'Confirmed'
    ]);
    state.credits.unshift([
      '2026-09-12 17:59:00',
      'system',
      'Lulu Emission',
      `+${adjustment.toFixed(2)}`,
      '—',
      'Lulu emission reconciliation',
      LULU_SNAPSHOT_REF,
      'Confirmed'
    ]);
  }

  function addStyles() {
    if (document.getElementById('creditLuluStyles')) return;
    const style = document.createElement('style');
    style.id = 'creditLuluStyles';
    style.textContent = `
      .credit-program-tabs{display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:4px;margin:0 0 16px}
      .credit-program-tab{border:0;background:transparent;color:var(--muted);padding:8px 18px;border-radius:8px;cursor:pointer;font:inherit}
      .credit-program-tab.active{background:var(--surface3);color:var(--text);box-shadow:0 0 0 1px #2b3541}
      .credit-program-view{display:none}.credit-program-view.active{display:block}
      #lulu>.metric-grid.compact{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
      #lulu>.metric-grid.compact>.metric-card:nth-child(4){display:none!important}
      #lulu .section-intro p,#lulu .panel-head p{display:none!important}
      @media(max-width:900px){#lulu>.metric-grid.compact{grid-template-columns:1fr!important}}
      @media(max-width:700px){.credit-program-tabs{display:flex}.credit-program-tab{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function activateProgram(view) {
    activeCreditProgram = view;
    const credits = document.getElementById('credits');
    if (!credits) return;
    credits.querySelectorAll('.credit-program-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.creditProgram === view));
    document.getElementById('creditsCoreView')?.classList.toggle('active', view === 'credits');
    document.getElementById('lulu')?.classList.toggle('active', view === 'lulu');
  }

  function updateLuluContent(lulu) {
    const intro = lulu.querySelector('.section-intro');
    if (intro) {
      const h2 = intro.querySelector('h2');
      const p = intro.querySelector('p');
      if (h2) h2.textContent = 'Lulu';
      p?.remove();
    }

    document.getElementById('luluSnapshotNote')?.remove();

    const table = lulu.querySelector('.table-panel');
    if (table && !table.querySelector('.panel-head')) {
      const head = document.createElement('div');
      head.className = 'panel-head';
      head.innerHTML = '<div><h3>Recent Burn Activity</h3></div>';
      table.insertBefore(head, table.firstChild);
    } else if (table) {
      table.querySelector('.panel-head p')?.remove();
    }
  }

  function updateRuleCopy() {
    const cards = [...document.querySelectorAll('#rules .rule-card')];
    const luluRule = cards.find(card => card.querySelector('span')?.textContent.trim() === 'Marketplace, Shipping & Lulu');
    if (luluRule) {
      luluRule.innerHTML = '<span>Marketplace, Shipping & Lulu</span><strong>Net economics</strong><p>Marketplace principal is not revenue; only the fee is. Shipping stays separate. Lulu emits 100 Credits per single burn or 333 Credits per three.</p>';
    }
  }

  function setupCreditsPrograms() {
    addStyles();

    const credits = document.getElementById('credits');
    const lulu = document.getElementById('lulu');
    if (!credits || !lulu) return;

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

    updateLuluContent(lulu);
    updateRuleCopy();
    activateProgram(activeCreditProgram);
  }

  applyLuluSnapshotState();
  syncLuluCreditLedger();

  const previousRenderAll = renderAll;
  renderAll = function () {
    applyLuluSnapshotState();
    syncLuluCreditLedger();
    previousRenderAll();
    setupCreditsPrograms();
  };

  renderAll();

  if (!document.querySelector('script[data-odto-inventory]')) {
    const script = document.createElement('script');
    script.src = './inventory-odto.js?v=20260912-9';
    script.dataset.odtoInventory = '1';
    document.body.appendChild(script);
  }
})();
