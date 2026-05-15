(function () {
  const nav = document.getElementById('nav');
  if (nav) {
    let lastScroll = 0;
    function onScroll() {
      const y = window.scrollY;
      if (y > 12) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const floating = document.getElementById('floating-cta');
  if (floating) {
    const calculator = document.getElementById('calculator');
    function onFloatScroll() {
      const heroBottom = window.innerHeight * 0.8;
      const beyondHero = window.scrollY > heroBottom;
      const beforeCalc = !calculator || calculator.getBoundingClientRect().top > window.innerHeight * 0.3;
      const inFooterZone = window.scrollY + window.innerHeight > document.body.scrollHeight - 400;
      if (beyondHero && beforeCalc && !inFooterZone) {
        floating.classList.add('visible');
      } else {
        floating.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', onFloatScroll, { passive: true });
    onFloatScroll();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          if (entry.target.classList.contains('growth-curve')) {
            entry.target.classList.add('animate');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
    });
    const gc = document.querySelector('.growth-curve');
    if (gc) gc.classList.add('animate');
  }

  const presets = {
    conservative: { conv: 3, arpu: 50, take: 12 },
    base: { conv: 5, arpu: 80, take: 15 },
    engaged: { conv: 10, arpu: 120, take: 18 },
    top: { conv: 20, arpu: 200, take: 20 }
  };

  const convInput = document.getElementById('conv-input');
  const arpuInput = document.getElementById('arpu-input');
  const takeInput = document.getElementById('take-input');

  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const p = presets[btn.dataset.preset];
      if (!p || !convInput || !arpuInput || !takeInput) return;
      document.querySelectorAll('.preset-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      convInput.value = p.conv;
      arpuInput.value = p.arpu;
      takeInput.value = p.take;
      convInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  if (convInput && arpuInput && takeInput) {
    function clearPresetOnManual() {
      const cur = { conv: parseInt(convInput.value, 10), arpu: parseInt(arpuInput.value, 10), take: parseInt(takeInput.value, 10) };
      let matched = null;
      Object.keys(presets).forEach(function (key) {
        const p = presets[key];
        if (p.conv === cur.conv && p.arpu === cur.arpu && p.take === cur.take) matched = key;
      });
      document.querySelectorAll('.preset-btn').forEach(function (b) {
        if (matched && b.dataset.preset === matched) b.classList.add('active');
        else b.classList.remove('active');
      });
    }
    convInput.addEventListener('input', clearPresetOnManual);
    arpuInput.addEventListener('input', clearPresetOnManual);
    takeInput.addEventListener('input', clearPresetOnManual);
  }
})();
