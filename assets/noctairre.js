/* ==========================================================================
   NOCTAIRRE 夜 — theme script
   Vanilla. No dependencies, no build step.
   Every animated property is transform or opacity. Nothing touches layout.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------------
     Intro veil — 夜 draws in, curtain lifts. Once per session.
     Content is already painted underneath, so this never delays LCP content.
     ------------------------------------------------------------------------ */
  function intro() {
    var veil = $('[data-veil]');
    if (!veil) return;

    var done = function () {
      veil.classList.add('is-lifted');
      sessionStorage.setItem('noctairre:seen', '1');
      var hero = $('[data-hero]');
      if (hero) hero.classList.add('is-lit');
      veil.addEventListener('transitionend', function () { veil.remove(); }, { once: true });
      // ponytail: belt-and-braces removal in case transitionend never fires.
      setTimeout(function () { if (veil.parentNode) veil.remove(); }, 1600);
    };

    if (sessionStorage.getItem('noctairre:seen') === '1' || reduced.matches) {
      veil.remove();
      var hero = $('[data-hero]');
      if (hero) hero.classList.add('is-lit');
      return;
    }

    if (document.readyState === 'complete') setTimeout(done, 1200);
    else window.addEventListener('load', function () { setTimeout(done, 1200); });
    // Never let a stalled asset trap the visitor behind the veil.
    setTimeout(done, 3000);
  }

  /* ------------------------------------------------------------------------
     Petals — sakura drifting on canvas.
     Desktop only, pauses off-screen, dies on reduced-motion.
     ------------------------------------------------------------------------ */
  function petals() {
    var canvas = $('[data-petals]');
    if (!canvas || reduced.matches) return;
    if (window.innerWidth < 768) return; // battery + INP on mobile

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var running = true;
    var flock = [];
    var COUNT = 18;

    function size() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20 - Math.random() * 120,
        s: 5 + Math.random() * 7,
        vy: 0.22 + Math.random() * 0.42,
        drift: (Math.random() - 0.5) * 0.42,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.006 + Math.random() * 0.012,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.011,
        a: 0.14 + Math.random() * 0.26
      };
    }

    function shape(p) {
      // A single sakura petal: notched tip, tapered base.
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.62, -p.s * 0.55, p.s * 0.5, p.s * 0.52, 0, p.s * 0.82);
      ctx.bezierCurveTo(-p.s * 0.5, p.s * 0.52, -p.s * 0.62, -p.s * 0.55, 0, -p.s);
      ctx.closePath();
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < flock.length; i++) {
        var p = flock[i];
        p.phase += p.wobble;
        p.y += p.vy;
        p.x += p.drift + Math.sin(p.phase) * 0.5;
        p.rot += p.vr;

        if (p.y > h + 30) flock[i] = seed(false);
        if (p.x < -40) p.x = w + 30;
        if (p.x > w + 40) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Squash across the rotation axis so petals read as flat objects turning.
        ctx.scale(1, 0.55 + Math.abs(Math.sin(p.phase)) * 0.45);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#f4f2ed';
        shape(p);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }

    size();
    for (var i = 0; i < COUNT; i++) flock.push(seed(true));
    requestAnimationFrame(frame);

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(size, 200);
    });

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal — IntersectionObserver, never a scroll listener.
     ------------------------------------------------------------------------ */
  function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduced.matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Header — condense once past the fold.
     ------------------------------------------------------------------------ */
  function header() {
    var el = $('[data-header]');
    if (!el) return;
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
      el.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);
  }

  /* ------------------------------------------------------------------------
     Focus trap — shared by menu and drawer.
     ------------------------------------------------------------------------ */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

  function trap(container, e) {
    var nodes = $$(FOCUSABLE, container).filter(function (n) {
      return n.offsetParent !== null;
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------------------------------------------------
     Mobile menu — hamburger morphs, links stagger up behind glass.
     ------------------------------------------------------------------------ */
  function menu() {
    var btn = $('[data-burger]');
    var panel = $('[data-menu]');
    if (!btn || !panel) return;
    var last = null;

    function open() {
      last = document.activeElement;
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var link = $('a', panel);
      if (link) setTimeout(function () { link.focus(); }, 260);
    }

    function close() {
      panel.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (last) last.focus();
    }

    btn.addEventListener('click', function () {
      panel.classList.contains('is-open') ? close() : open();
    });

    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trap(panel, e);
    });

    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* ------------------------------------------------------------------------
     Accordions — grid-template-rows trick, no height math.
     ------------------------------------------------------------------------ */
  function accordions() {
    $$('[data-accordion]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!on));
      });
    });
  }

  /* ------------------------------------------------------------------------
     Cart — Shopify AJAX API + Section Rendering API.
     The drawer markup lives in Liquid only; JS never rebuilds it by hand.
     ------------------------------------------------------------------------ */
  var Cart = {
    drawer: null,
    lastFocus: null,

    init: function () {
      Cart.drawer = $('[data-drawer]');
      if (!Cart.drawer) return;

      $$('[data-cart-open]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.preventDefault();
          Cart.open();
        });
      });

      Cart.drawer.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-cart-close') || e.target.closest('[data-cart-close]')) {
          Cart.close();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && Cart.drawer.classList.contains('is-open')) Cart.close();
      });

      Cart.drawer.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') trap($('[data-drawer-panel]'), e);
      });

      // Quantity + remove, delegated so re-rendered markup keeps working.
      Cart.drawer.addEventListener('click', function (e) {
        var node = e.target.closest('[data-qty]');
        if (!node) return;
        e.preventDefault();
        Cart.change(node.dataset.key, parseInt(node.dataset.qty, 10));
      });

      document.addEventListener('submit', function (e) {
        var form = e.target.closest('[data-add-form]');
        if (!form) return;
        e.preventDefault();
        Cart.add(form);
      });
    },

    open: function () {
      Cart.lastFocus = document.activeElement;
      Cart.drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var close = $('[data-cart-close]', Cart.drawer);
      if (close) setTimeout(function () { close.focus(); }, 240);
    },

    close: function () {
      Cart.drawer.classList.remove('is-open');
      document.body.style.overflow = '';
      if (Cart.lastFocus) Cart.lastFocus.focus();
    },

    add: function (form) {
      var btn = $('[data-add-btn]', form);
      var label = btn ? $('[data-add-label]', btn) : null;
      var original = label ? label.textContent : '';
      var err = $('[data-add-error]', form);

      if (btn) {
        btn.setAttribute('aria-disabled', 'true');
        if (label) label.textContent = 'Adding';
      }
      if (err) err.hidden = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: [{ id: form.querySelector('[name="id"]').value, quantity: 1 }]
        })
      })
        .then(function (r) {
          return r.json().then(function (data) {
            if (!r.ok) throw new Error(data.description || data.message || 'Could not add to bag.');
            return data;
          });
        })
        .then(function () {
          return Cart.refresh();
        })
        .then(function () {
          Cart.open();
        })
        .catch(function (e) {
          if (err) {
            err.textContent = e.message;
            err.hidden = false;
          }
        })
        .finally(function () {
          if (btn) {
            btn.removeAttribute('aria-disabled');
            if (label) label.textContent = original;
          }
        });
    },

    change: function (key, quantity) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
        .then(function (r) { return r.json(); })
        .then(function () { return Cart.refresh(); })
        .catch(function () { window.location.href = '/cart'; });
    },

    // Ask Shopify to re-render the drawer section server-side, then swap it in.
    refresh: function () {
      return fetch('/?sections=cart-drawer')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var html = data['cart-drawer'];
          if (!html) return;
          var tmp = document.createElement('div');
          tmp.innerHTML = html;
          var fresh = $('[data-drawer-inner]', tmp);
          var live = $('[data-drawer-inner]', Cart.drawer);
          if (fresh && live) live.innerHTML = fresh.innerHTML;

          var count = $('[data-cart-count]', tmp);
          $$('[data-cart-count]').forEach(function (node) {
            if (!count) return;
            node.textContent = count.textContent;
            node.hidden = count.hidden;
          });
        });
    }
  };

  /* ------------------------------------------------------------------------
     Product variants — pick the variant matching the selected options.
     ------------------------------------------------------------------------ */
  function variants() {
    $$('[data-variant-picker]').forEach(function (root) {
      var raw = $('[data-variant-json]', root);
      if (!raw) return;

      var all;
      try { all = JSON.parse(raw.textContent); } catch (e) { return; }

      var idField = $('[data-variant-id]', root);
      var priceEl = $('[data-variant-price]', root);
      var compareEl = $('[data-variant-compare]', root);
      var btn = $('[data-add-btn]', root);
      var label = btn ? $('[data-add-label]', btn) : null;
      var money = root.dataset.moneyFormat || '${{amount}}';

      function format(cents) {
        var value = (cents / 100).toFixed(2);
        // Shopify money formats vary; handle the two common amount tokens.
        return money
          .replace(/\{\{\s*amount\s*\}\}/, value)
          .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100))
          .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, value.replace('.', ','));
      }

      function selected() {
        return $$('[data-option-index]', root)
          .filter(function (i) { return i.checked; })
          .sort(function (a, b) {
            return Number(a.dataset.optionIndex) - Number(b.dataset.optionIndex);
          })
          .map(function (i) { return i.value; });
      }

      function sync() {
        var chosen = selected();
        var match = all.filter(function (v) {
          return v.options.every(function (o, i) { return o === chosen[i]; });
        })[0];

        if (!match) {
          if (btn) {
            btn.setAttribute('aria-disabled', 'true');
            if (label) label.textContent = 'Unavailable';
          }
          return;
        }

        if (idField) idField.value = match.id;
        if (priceEl) priceEl.textContent = format(match.price);

        if (compareEl) {
          if (match.compare_at_price && match.compare_at_price > match.price) {
            compareEl.textContent = format(match.compare_at_price);
            compareEl.hidden = false;
          } else {
            compareEl.hidden = true;
          }
        }

        if (btn) {
          if (match.available) {
            btn.removeAttribute('aria-disabled');
            if (label) label.textContent = 'Add to bag';
          } else {
            btn.setAttribute('aria-disabled', 'true');
            if (label) label.textContent = 'Sold out';
          }
        }

        // Reflect the variant in the URL so shares and refreshes keep the choice.
        if (history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', match.id);
          history.replaceState({}, '', url);
        }
      }

      $$('[data-option-index]', root).forEach(function (input) {
        input.addEventListener('change', sync);
      });

      sync();
    });
  }

  /* ------------------------------------------------------------------------
     Page transitions — fade out, then navigate.
     Skips anything that isn't a plain same-origin left-click.
     ------------------------------------------------------------------------ */
  function transitions() {
    if (reduced.matches) return;

    var fade = document.createElement('div');
    fade.className = 'page-fade';
    document.body.appendChild(fade);

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target.closest('a');
      if (!a) return;

      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
      if (a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;
      if (/^\/(checkouts?|account\/logout)/.test(a.pathname)) return;
      if (/^(mailto|tel):/.test(href)) return;

      e.preventDefault();
      fade.classList.add('is-on');
      setTimeout(function () { window.location.href = a.href; }, 300);
    });

    // Back-button restores a cached page with the curtain still down — clear it.
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) fade.classList.remove('is-on');
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function boot() {
    intro();
    petals();
    reveal();
    header();
    menu();
    accordions();
    variants();
    transitions();
    Cart.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
