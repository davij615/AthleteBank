(function () {
  const segments = [
    { tier: 'Top 16 football fan bases', athletes: '~1,360 scholarship', fans: 320000000 },
    { tier: 'Remaining 124 FBS football', athletes: '~10,540', fans: 145000000 },
    { tier: "Men's basketball top 25", athletes: '~325', fans: 95000000 },
    { tier: "Women's basketball top 25", athletes: '~325', fans: 52000000 },
    { tier: 'Gymnastics + volleyball stars', athletes: '~600', fans: 38000000 },
    { tier: 'Baseball + softball', athletes: '~14,000', fans: 28000000 },
    { tier: 'Soccer + lacrosse + hockey', athletes: '~12,000', fans: 18000000 },
    { tier: 'All other D1 sports', athletes: '~8,000', fans: 11000000 },
    { tier: 'FCS football + D1 long tail', athletes: '~13,000', fans: 15000000 },
    { tier: 'D2 athletes (all sports)', athletes: '~125,000', fans: 18000000 },
    { tier: 'D3 athletes (all sports)', athletes: '~195,000', fans: 14000000 }
  ];

  const conv = document.getElementById('conv-input');
  const arpu = document.getElementById('arpu-input');
  const take = document.getElementById('take-input');
  if (!conv || !arpu || !take) return;

  const convV = document.getElementById('conv-val');
  const arpuV = document.getElementById('arpu-val');
  const takeV = document.getElementById('take-val');
  const barsEl = document.getElementById('calc-bars');
  const gmvEl = document.getElementById('gmv-total');
  const athlEl = document.getElementById('athl-total');
  const revEl = document.getElementById('rev-total');

  function fmtMoney(n) {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  }

  function fmtFans(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return n;
  }

  function render() {
    const c = parseInt(conv.value, 10) / 1000;
    const a = parseInt(arpu.value, 10);
    const t = parseInt(take.value, 10) / 100;

    convV.textContent = (c * 100).toFixed(2) + '%';
    arpuV.textContent = '$' + a;
    takeV.textContent = (t * 100).toFixed(0) + '%';

    const rows = segments.map(s => ({ ...s, gmv: s.fans * c * a }));
    const totalGmv = rows.reduce((s, r) => s + r.gmv, 0);
    const totalRev = totalGmv * t;
    const totalAthl = totalGmv - totalRev;
    const maxGmv = Math.max.apply(null, rows.map(r => r.gmv));

    gmvEl.textContent = fmtMoney(totalGmv);
    athlEl.textContent = fmtMoney(totalAthl);
    revEl.textContent = fmtMoney(totalRev);

    let html = '';
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const pct = (r.gmv / maxGmv) * 100;
      html += '<div class="calc-bar">' +
        '<div class="calc-bar-info">' +
          '<div class="calc-bar-name">' + r.tier + '</div>' +
          '<div class="calc-bar-sub">' + r.athletes + ' · ' + fmtFans(r.fans) + ' fans</div>' +
        '</div>' +
        '<div class="calc-bar-track">' +
          '<div class="calc-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<div>' +
          '<div class="calc-bar-val">' + fmtMoney(r.gmv) + '</div>' +
          '<div class="calc-bar-vsub">GMV / yr</div>' +
        '</div>' +
      '</div>';
    }
    barsEl.innerHTML = html;
  }

  conv.addEventListener('input', render);
  arpu.addEventListener('input', render);
  take.addEventListener('input', render);
  render();
})();
