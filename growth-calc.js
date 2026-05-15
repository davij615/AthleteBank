(function () {
  // 5 cohorts, each with size in thousands and the year it unlocks (1-indexed)
  // Sizes are deliberately conservative — these are addressable, not signed
  const cohorts = [
    { id: 'athletes',  label: 'NIL athletes',       size: 500_000, unlocks: 1 }, // 190K D1 + ~310K all-NCAA
    { id: 'coaches',   label: 'Coaches',            size: 100_000, unlocks: 2 },
    { id: 'retired',   label: 'Retired + officials', size: 80_000,  unlocks: 3 },
    { id: 'esa',       label: 'Sports ESAs',        size: 30_000,  unlocks: 4 }, // ESA-eligible parent households
    { id: 'public',    label: 'Accredited + public', size: 2_000_000, unlocks: 5 }, // ramped slow
  ];

  const presets = {
    conservative: { pen: 2,  arpu: 180, attach: 120 },
    base:         { pen: 3,  arpu: 240, attach: 140 },
    bull:         { pen: 6,  arpu: 360, attach: 180 },
    moon:         { pen: 12, arpu: 520, attach: 220 },
  };

  const $ = (id) => document.getElementById(id);
  const pen = $('gpen-input');
  const arpu = $('garpu-input');
  const attach = $('gattach-input');
  if (!pen || !arpu || !attach) return;

  const penV = $('gpen-val');
  const arpuV = $('garpu-val');
  const attachV = $('gattach-val');
  const chart = $('gcalc-chart');
  const y5Rev = $('gy5-rev');
  const cumRev = $('gcum-rev');
  const usersT = $('gusers-total');

  function fmtMoney(n) {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  }
  function fmtUsers(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return Math.round(n);
  }

  // Easing curve for cohort ramp — cohorts grow fast at first, taper toward target
  // Returns share of target penetration achieved at a given "years active"
  function rampCurve(yearsActive) {
    if (yearsActive <= 0) return 0;
    // 1 - 1/(1+x) gives a smooth curve approaching 1
    // We want yearsActive=1 → ~0.5, yearsActive=4 → ~0.85, yearsActive=5 → ~0.92
    return 1 - 1 / (1 + 0.85 * yearsActive);
  }

  // Attach ramp — newer cohort pays 1x ARPU, older cohort pays full attach multiplier
  function attachCurve(yearsActive, attachMult) {
    if (yearsActive <= 1) return 1.0;
    // Smooth ramp from 1.0 at year 1 to attachMult at year 5
    const t = Math.min(1, (yearsActive - 1) / 4);
    return 1.0 + (attachMult - 1.0) * t;
  }

  function compute() {
    const penFrac = parseFloat(pen.value) / 100;     // 0.03 for 3%
    const arpuDol = parseFloat(arpu.value);          // base annual $ per user
    const attachMult = parseFloat(attach.value) / 100; // 1.4 for 1.4x

    penV.textContent = (penFrac * 100).toFixed(0) + '%';
    arpuV.textContent = '$' + arpuDol;
    attachV.textContent = attachMult.toFixed(2) + 'x';

    // For each year 1..5, compute:
    //  - Total users (sum across unlocked cohorts, applying ramp)
    //  - Total revenue (sum across unlocked cohorts, applying ramp × ARPU × attach)
    //  - Per-cohort breakdown so we can color "existing" vs "newly unlocked"
    const years = [];
    for (let y = 1; y <= 5; y++) {
      let revOld = 0;  // cohorts that were already active before this year
      let revNew = 0;  // cohorts unlocking this year
      let users = 0;
      const cohortDetails = [];
      cohorts.forEach((c) => {
        if (y < c.unlocks) return; // not unlocked yet
        const yearsActive = y - c.unlocks + 1;
        const ramp = rampCurve(yearsActive);
        // public cohort gets a steeper discount on penetration (huge TAM, narrower attach)
        const cohortPen = c.id === 'public' ? penFrac * 0.15 : penFrac;
        const u = c.size * cohortPen * ramp;
        const att = attachCurve(yearsActive, attachMult);
        const rev = u * arpuDol * att;
        users += u;
        if (c.unlocks === y) revNew += rev; else revOld += rev;
        cohortDetails.push({ id: c.id, label: c.label, users: u, rev });
      });
      years.push({ y, revOld, revNew, total: revOld + revNew, users, cohortDetails });
    }

    // Totals
    const totalCum = years.reduce((s, yr) => s + yr.total, 0);
    const y5 = years[4];
    y5Rev.textContent = fmtMoney(y5.total);
    cumRev.textContent = fmtMoney(totalCum);
    usersT.textContent = fmtUsers(y5.users);

    // Render the bar chart
    const maxRev = Math.max.apply(null, years.map(yr => yr.total));
    let html = '';
    for (const yr of years) {
      const totalPct = (yr.total / maxRev) * 100;
      const oldPct = yr.total > 0 ? (yr.revOld / yr.total) * 100 : 0;
      const newPct = yr.total > 0 ? (yr.revNew / yr.total) * 100 : 0;
      const isLast = yr.y === 5;
      html += '<div class="gbar' + (isLast ? ' gbar-final' : '') + '">' +
        '<div class="gbar-year">Y' + yr.y + '</div>' +
        '<div class="gbar-track">' +
          '<div class="gbar-fill" style="height:' + totalPct + '%">' +
            (newPct > 0 ? '<div class="gbar-segment gbar-new" style="flex:' + newPct + '"></div>' : '') +
            (oldPct > 0 ? '<div class="gbar-segment gbar-old" style="flex:' + oldPct + '"></div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="gbar-value">' + fmtMoney(yr.total) + '</div>' +
        '<div class="gbar-users">' + fmtUsers(yr.users) + ' users</div>' +
      '</div>';
    }
    chart.innerHTML = html;
  }

  // Preset wiring
  document.querySelectorAll('.gpreset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = presets[btn.dataset.gpreset];
      if (!p) return;
      document.querySelectorAll('.gpreset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pen.value = p.pen;
      arpu.value = p.arpu;
      attach.value = p.attach;
      compute();
    });
  });

  // Clear preset highlight when user drags
  function clearPresetOnManual() {
    const cur = {
      pen: parseInt(pen.value, 10),
      arpu: parseInt(arpu.value, 10),
      attach: parseInt(attach.value, 10),
    };
    let matched = null;
    Object.keys(presets).forEach((key) => {
      const p = presets[key];
      if (p.pen === cur.pen && p.arpu === cur.arpu && p.attach === cur.attach) matched = key;
    });
    document.querySelectorAll('.gpreset-btn').forEach((b) => {
      if (matched && b.dataset.gpreset === matched) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  [pen, arpu, attach].forEach((el) => {
    el.addEventListener('input', () => { clearPresetOnManual(); compute(); });
  });

  compute();
})();
