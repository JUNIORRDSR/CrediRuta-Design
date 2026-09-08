/* CrediRuta · shell del prototipo
   Router de pantallas, navegación inferior, hojas, selección y formato de dinero.
   Las pantallas son markup puro; toda la interacción vive aquí. */
(function () {
  var phone = document.getElementById('phone');
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  var stack = [];

  var TABS = {
    cobrador: [
      { id: 'ruta', icon: 'i-route', label: 'Ruta' },
      { id: 'clientes', icon: 'i-users', label: 'Clientes' },
      { id: 'caja', icon: 'i-wallet', label: 'Caja' }
    ],
    admin: [
      { id: 'adminHoy', icon: 'i-grid', label: 'Hoy' },
      { id: 'adminRutas', icon: 'i-route', label: 'Rutas' },
      { id: 'adminCartera', icon: 'i-card', label: 'Cartera' },
      { id: 'adminEquipo', icon: 'i-users', label: 'Equipo' }
    ]
  };

  /* pantallas que no son una pestana pero se pintan dentro de una */
  var PESTANA_ACTIVA = { rutaVencida: 'ruta', equipoVacio: 'adminEquipo' };

  /* ---- monta nav + barra de gesto en cada pantalla ---- */
  function mountChrome() {
    var screens = phone.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      var s = screens[i];
      if (!s.querySelector('.inset')) {
        var ins = document.createElement('div');
        ins.className = 'inset';
        s.insertBefore(ins, s.firstChild);
      }
      var kind = s.getAttribute('data-nav');
      if (kind && TABS[kind]) {
        var nav = document.createElement('div');
        nav.className = 'nav';
        var items = '<div class="nav__items">';
        TABS[kind].forEach(function (t) {
          var on = t.id === (PESTANA_ACTIVA[s.id] || s.id) ? ' is-on' : '';
          items += '<button class="nav__item' + on + '" data-go="' + t.id + '">' +
            '<span class="nav__pill"><svg class="i"><use href="#' + t.icon + '"></use></svg></span>' +
            '<span class="nav__label">' + t.label + '</span></button>';
        });
        nav.innerHTML = items + '</div>';
        s.appendChild(nav);
      }
      var g = document.createElement('div');
      g.className = 'gesture';
      g.innerHTML = '<i></i>';
      s.appendChild(g);
    }
  }

  /* ---- router ---- */
  function show(id) {
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('screen')) return;
    var all = phone.querySelectorAll('.screen');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('is-active');
    target.classList.add('is-active');
    var body = target.querySelector('.body');
    if (body) body.scrollTop = 0;
    phone.setAttribute('data-screen', id);
    closeSheets();
  }

  function go(id) {
    var cur = phone.getAttribute('data-screen');
    if (cur && cur !== id) stack.push(cur);
    if (stack.length > 30) stack.shift();
    show(id);
  }

  function back() {
    var prev = stack.pop();
    show(prev || 'ruta');
  }

  /* ---- hojas ---- */
  function openSheet(id) {
    var sh = document.getElementById(id);
    if (sh) sh.classList.add('is-open');
  }
  function closeSheets() {
    var sheets = phone.querySelectorAll('.sheet.is-open');
    for (var i = 0; i < sheets.length; i++) sheets[i].classList.remove('is-open');
  }

  /* ---- brindis ---- */
  function toast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = '<svg class="i i--sm"><use href="#i-check"></use></svg><span>' + msg + '</span>';
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  /* ---- marca la siguiente visita como hecha tras cobrar ---- */
  function marcarVisita(msg) {
    if (!/pago|abono|visita/i.test(msg)) return;
    var ruta = document.getElementById('ruta');
    if (!ruta) return;
    var nums = ruta.querySelectorAll('.tl__num');
    for (var i = 0; i < nums.length; i++) {
      if (!nums[i].classList.contains('is-done') && !nums[i].classList.contains('is-skip')) {
        nums[i].classList.add('is-done');
        nums[i].innerHTML = '<svg class="i i--sm"><use href="#i-check"></use></svg>';
        break;
      }
    }
  }

  /* ---- formato de dinero ---- */
  function formatMoney(v) {
    var digits = String(v).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  phone.addEventListener('input', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('money__val') && t.getAttribute('inputmode') === 'numeric') {
      var pos = t.value.length - t.selectionStart;
      t.value = formatMoney(t.value);
      var np = Math.max(0, t.value.length - pos);
      try { t.setSelectionRange(np, np); } catch (err) { /* input sin selección */ }
    }
  });

  /* ---- clics ---- */
  phone.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-go],[data-back],[data-sheet],[data-close],[data-toast],[data-toggle],.chip,.seg__item,.stepper__btn') : null;
    if (!el) return;

    /* selección exclusiva dentro de su grupo */
    if (el.classList.contains('chip') || el.classList.contains('seg__item')) {
      var group = el.parentElement;
      var sibs = group.children;
      for (var i = 0; i < sibs.length; i++) sibs[i].classList.remove('is-on');
      el.classList.add('is-on');
    }

    if (el.classList.contains('toggle') || el.hasAttribute('data-toggle')) {
      el.classList.toggle('is-on');
      return;
    }

    if (el.classList.contains('stepper__btn')) {
      var val = el.parentElement.querySelector('.stepper__val');
      if (val) {
        var n = parseInt(val.textContent.replace(/\D/g, ''), 10) || 0;
        var minus = !!el.querySelector('use[href="#i-minus"]');
        n = Math.max(1, n + (minus ? -1 : 1));
        val.textContent = n;
      }
      return;
    }

    var msg = el.getAttribute('data-toast');
    if (msg) { toast(msg); marcarVisita(msg); }

    if (el.hasAttribute('data-close')) closeSheets();

    var sheet = el.getAttribute('data-sheet');
    if (sheet) { openSheet(sheet); return; }

    if (el.hasAttribute('data-back')) { back(); return; }

    var dest = el.getAttribute('data-go');
    if (dest) {
      if (msg) setTimeout(function () { go(dest); }, 380);
      else go(dest);
    }
  });

  /* ---- cambiar de rol desde el HUD ---- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-jump]') : null;
    if (!el) return;
    stack = [];
    show(el.getAttribute('data-jump'));
    var hud = document.querySelectorAll('[data-jump]');
    for (var i = 0; i < hud.length; i++) hud[i].classList.remove('is-on');
    el.classList.add('is-on');
  });

  mountChrome();
  show(window.PANTALLA_INICIAL || 'bienvenida');
})();
