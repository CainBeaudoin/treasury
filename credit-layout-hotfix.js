/* Final credit layout guard: prevent large Credit values from crossing card boundaries. */
(function () {
  const STYLE_ID = 'creditLayoutHotfix';

  function apply() {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Credit cards must always own their content. */
      #credits .metric-card,
      #credits .credits-executive,
      #credits .credits-executive-main,
      #credits .credits-executive-stat {
        min-width: 0 !important;
        overflow: hidden !important;
      }

      /* Large numeric values may shrink, but may never spill into the next card. */
      #credits .metric-card .metric-value,
      #credits .credits-executive-main strong,
      #credits .credits-executive-stat strong {
        max-width: 100% !important;
        font-size: clamp(22px, 2vw, 30px) !important;
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: clip !important;
      }

      /* The current executive Credits summary gets enough room to breathe. */
      #credits .credits-executive-stat {
        min-height: 88px !important;
        padding: 14px 16px !important;
      }
      #credits .credits-executive-stat span {
        line-height: 1.35 !important;
        margin-bottom: 8px !important;
      }

      /* If an older Credit KPI grid is visible, do not keep two narrow cards side-by-side. */
      @media (max-width: 900px) {
        #credits .metric-grid,
        #credits .metric-grid.five,
        #creditsCoreView > .metric-grid,
        #creditsActivity > .metric-grid {
          grid-template-columns: 1fr !important;
        }
        #credits .metric-card .metric-value,
        #credits .credits-executive-stat strong {
          font-size: 26px !important;
        }
        #credits .credits-executive-stat {
          grid-column: 1 / -1 !important;
        }
      }

      @media (max-width: 560px) {
        #credits .metric-card,
        #credits .credits-executive-stat {
          padding: 16px !important;
        }
        #credits .metric-card .metric-value,
        #credits .credits-executive-main strong,
        #credits .credits-executive-stat strong {
          font-size: 24px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  apply();
  document.addEventListener('click', e => {
    if (e.target.closest('.tab,.credit-program-tab,.segment,#refreshBtn')) {
      setTimeout(apply, 40);
      setTimeout(apply, 180);
    }
  });
  setTimeout(apply, 250);
})();
