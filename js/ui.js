/* ==========================================================================
   UI 3.0 — 交互增强层（与业务脚本解耦，出错不影响主流程）
   ========================================================================== */
  /* ============================================================
     UI 3.0 — 交互增强层（与业务脚本解耦，出错不影响主流程）
     ============================================================ */
  (function () {
    'use strict';
    var UI = {};
    window.UI = UI;

    /* ---------------- Toast ---------------- */
    var toastHost = null;
    function getHost() {
      if (!toastHost) {
        toastHost = document.createElement('div');
        toastHost.id = 'toast-host';
        document.body.appendChild(toastHost);
      }
      return toastHost;
    }

    UI.toast = function (message, type, duration) {
      if (message === undefined || message === null) return;
      var msg = String(message);
      if (!msg.trim()) return;
      var ok = (type === 'ok' || type === 'success');
      var bad = (type === 'err' || type === 'error');
      var el = document.createElement('div');
      el.className = 'toast' + (ok ? ' ok' : bad ? ' err' : '');
      var icon = document.createElement('i');
      icon.className = 'fas ' + (ok ? 'fa-circle-check' : bad ? 'fa-circle-exclamation' : 'fa-circle-info');
      var span = document.createElement('span');
      span.textContent = msg;
      el.appendChild(icon);
      el.appendChild(span);
      getHost().appendChild(el);
      window.setTimeout(function () {
        el.classList.add('hide');
        window.setTimeout(function () { el.remove(); }, 230);
      }, duration || 2600);
    };

    /* 原生 alert 会阻塞且样式突兀，换成轻提示（按语义着色） */
    window.alert = function (msg) {
      var text = String(msg === undefined ? '' : msg);
      var bad = /fail|error|denied|insufficient|invalid|not allowed|cannot/i.test(text);
      var ok = /success|completed|saved|sent/i.test(text);
      UI.toast(text, bad ? 'err' : ok ? 'ok' : 'info', bad ? 4200 : 3000);
    };

    /* ---------------- 导航高亮 ---------------- */
    var NAV_MAP = {
      'inventory': 'nav-inventory',
      'stock-in-office': 'nav-stock-in-toggle',
      'stock-in-kepayan-seafood': 'nav-stock-in-toggle',
      'stock-in-kepayan-packaged': 'nav-stock-in-toggle',
      'stock-out': 'nav-stock-out',
      'transaction-records': 'nav-transaction-records',
      'online-records': 'nav-online-records'
    };

    UI.setActiveNav = function (section) {
      var id = NAV_MAP[section] || 'nav-inventory';
      Array.prototype.forEach.call(document.querySelectorAll('.nav-menu li'), function (li) {
        li.classList.remove('active');
      });
      var link = document.getElementById(id);
      if (link && link.parentElement) link.parentElement.classList.add('active');

      // 进入入库页自动聚焦商品名，省一次点击
      if (section && section.indexOf('stock-in-') === 0) {
        var nameEl = document.getElementById(section + '-name');
        if (nameEl) {
          window.setTimeout(function () { nameEl.focus(); }, 80);
        }
      }
      window.setTimeout(updateCounts, 260);
    };

    /* ---------------- 下拉菜单：点击也能展开（手机必需） ---------------- */
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest ? e.target.closest('.nav-menu .dropdown > a') : null;
      var subItem = e.target.closest ? e.target.closest('.dropdown-content a') : null;

      if (subItem) {
        Array.prototype.forEach.call(document.querySelectorAll('.dropdown.open'), function (d) {
          d.classList.remove('open');
        });
        return;
      }
      if (toggle) {
        e.preventDefault();
        var li = toggle.parentElement;
        var willOpen = !li.classList.contains('open');
        Array.prototype.forEach.call(document.querySelectorAll('.dropdown.open'), function (d) {
          d.classList.remove('open');
        });
        if (willOpen) li.classList.add('open');
        return;
      }
      Array.prototype.forEach.call(document.querySelectorAll('.dropdown.open'), function (d) {
        if (!d.contains(e.target)) d.classList.remove('open');
      });
    });

    /* ---------------- 表格：自动补 data-label + 手机卡片模式 ---------------- */
    function cellLabel(th) {
      return (th.textContent || '').replace(/[↕⇅↑↓]/g, '').replace(/\s+/g, ' ').trim();
    }

    /* 库存表的列顺序 -> 语义字段，供手机卡片精确排版 */
    var INVENTORY_FIELDS = ['name', 'image', 'category', 'quantity', 'expiry', 'location', 'modified', 'modifiedBy', 'action'];

    function labelize(table) {
      var heads = [];
      Array.prototype.forEach.call(table.querySelectorAll('thead th'), function (th) {
        heads.push(cellLabel(th));
      });
      if (!heads.length) return;
      if (!table.classList.contains('card-mode')) table.classList.add('card-mode');

      var isInventory = table.id === 'inventory-table';
      var rows = table.querySelectorAll('tbody tr');
      for (var r = 0; r < rows.length; r++) {
        var tr = rows[r];
        var cells = tr.children;
        var complete = tr.getAttribute('data-label-done') === '1';

        // 行内容可能被局部重建（Firebase child_changed），检查字段标记是否齐全
        if (complete) {
          var missing = false;
          for (var k = 0; k < cells.length; k++) {
            if (cells[k].tagName === 'TD' && !cells[k].getAttribute('data-field')) { missing = true; break; }
          }
          if (!missing) continue;
        }

        var titleCell = null;
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (cell.tagName !== 'TD') continue;
          if (heads[i]) cell.setAttribute('data-label', heads[i]);
          if (!cell.getAttribute('data-field')) {
            cell.setAttribute('data-field', isInventory ? (INVENTORY_FIELDS[i] || ('f' + i)) : ('f' + i));
          }

          var onlyCheckbox = cell.querySelector('input[type="checkbox"], input[type="radio"]') &&
                             !(cell.textContent || '').trim();
          if (onlyCheckbox) {
            cell.classList.add('cell-check');
          } else if (!titleCell) {
            titleCell = cell;
          }

          if (isInventory && i === 1) {
            // 缩略图列：只有真的有图片时才显示
            cell.classList.toggle('has-thumb', !!cell.querySelector('img'));
          }
        }
        if (titleCell) titleCell.classList.add('cell-title');

        // 记住行对应的记录 id，便于保存后定位并高亮
        if (!tr.getAttribute('data-item-id')) {
          var withId = tr.querySelector('[data-item-id]');
          if (withId) tr.setAttribute('data-item-id', withId.getAttribute('data-item-id'));
        }
        tr.setAttribute('data-label-done', '1');
      }
    }

    function labelizeAll() {
      var tables = document.querySelectorAll('table');
      for (var i = 0; i < tables.length; i++) labelize(tables[i]);
    }

    /* ---------------- 计数 ---------------- */
    function countRows(table) {
      if (!table) return 0;
      var rows = table.querySelectorAll('tbody tr');
      var n = 0;
      for (var i = 0; i < rows.length; i++) {
        var tr = rows[i];
        if (tr.querySelector('td[colspan]')) continue;
        if (tr.style.display === 'none') continue;
        n++;
      }
      return n;
    }

    function updateCounts() {
      var pairs = [
        ['inventory-count', 'inventory-table'],
        ['transaction-count', 'transaction-records-table'],
        ['stock-out-count', 'stock-out-table'],
        ['online-count', 'online-records-table']
      ];
      pairs.forEach(function (p) {
        var chip = document.getElementById(p[0]);
        var table = document.getElementById(p[1]);
        if (!chip || !table) return;
        var section = table.closest ? table.closest('section') : null;
        if (section && section.style.display === 'none') return;
        chip.textContent = String(countRows(table));
      });
    }

    var refreshTimer = null;
    function scheduleRefresh() {
      if (refreshTimer) return;
      refreshTimer = window.setTimeout(function () {
        refreshTimer = null;
        labelizeAll();
        updateCounts();
        refreshSuggestions();
      }, 180);
    }

    // 供业务层在批量渲染 / 重写表头后主动调用，避免依赖全域 DOM 监听
    UI.refresh = function () {
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      labelizeAll();
      updateCounts();
      refreshSuggestions();
    };

    /* ---------------- 搜索框：清空按钮 ---------------- */
    function bindToolbars() {
      Array.prototype.forEach.call(document.querySelectorAll('.clear-btn[data-clear]'), function (btn) {
        if (btn.getAttribute('data-bound') === '1') return;
        btn.setAttribute('data-bound', '1');
        btn.addEventListener('click', function () {
          var input = document.getElementById(btn.getAttribute('data-clear'));
          if (!input) return;
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        });
      });

      Array.prototype.forEach.call(document.querySelectorAll('.toolbar .control input'), function (input) {
        if (input.getAttribute('data-sync') === '1') return;
        input.setAttribute('data-sync', '1');
        var wrap = input.parentElement;
        var sync = function () {
          if (wrap && wrap.classList.contains('control')) {
            wrap.classList.toggle('has-value', !!input.value);
          }
        };
        input.addEventListener('input', sync);
        input.addEventListener('change', sync);
        sync();
      });

      bindInventorySort();
    }

    /* ---------------- 库存：手机端排序下拉 ---------------- */
    /* 手机上表格表头隐藏了，用户没有排序入口，这里补一个 */
    function bindInventorySort() {
      var toolbar = document.querySelector('#inventory-list-section .toolbar');
      if (!toolbar) return;
      var existing = document.getElementById('inventory-sort');
      var select;

      if (!existing) {
        var wrap = document.createElement('div');
        wrap.className = 'control is-sort';
        wrap.innerHTML = '<i class="fas fa-arrow-down-wide-short"></i>' +
          '<select id="inventory-sort" aria-label="Sort inventory">' +
          '<option value="category">Category</option>' +
          '<option value="name">Name A-Z</option>' +
          '<option value="expiry">Expiry</option>' +
          '</select>';
        toolbar.appendChild(wrap);
        select = wrap.querySelector('select');
        select.setAttribute('data-sort-bound', '1');
        select.addEventListener('change', function () {
          var v = this.value;
          if (v === 'name' && window.sortInventoryByName) window.sortInventoryByName('asc');
          else if (v === 'expiry' && window.sortInventoryByExpiry) window.sortInventoryByExpiry('asc');
          else if (window.sortInventoryByCategory) window.sortInventoryByCategory('asc');
        });
      }
    }

    /* ---------------- 入库：历史记忆 + 自动补全 ---------------- */
    var RECENT_KEY = 'sp_recent_products_v1';
    var UNIT_KEY = 'sp_unit_';
    var UNIT_MAP_KEY = 'sp_name_unit_map_v1';

    function readJSON(key, fallback) {
      try {
        var v = JSON.parse(localStorage.getItem(key) || 'null');
        return v === null ? fallback : v;
      } catch (err) { return fallback; }
    }

    function writeJSON(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) {}
    }

    function refreshSuggestions() {
      var dl = document.getElementById('product-suggestions');
      if (!dl) return;
      var seen = {};
      var list = [];
      var push = function (name) {
        var n = (name || '').trim();
        if (!n) return;
        var k = n.toLowerCase();
        if (seen[k]) return;
        seen[k] = 1;
        list.push(n);
      };

      Array.prototype.forEach.call(document.querySelectorAll('#inventory-table tbody tr'), function (tr) {
        var td = tr.children[0];
        if (td) push(td.textContent);
      });
      readJSON(RECENT_KEY, []).forEach(push);

      var sig = list.slice(0, 120).join('|');
      if (dl.childElementCount && dl.getAttribute('data-sig') === sig) return;
      dl.innerHTML = '';
      list.slice(0, 200).forEach(function (name) {
        var opt = document.createElement('option');
        opt.value = name;
        dl.appendChild(opt);
      });
      dl.setAttribute('data-sig', sig);
    }

    UI.onStockInSuccess = function (prefix, name, unit, quantity) {
      var cleanName = (name || '').trim();
      var cleanUnit = (unit || '').trim();
      if (cleanName) {
        var recent = readJSON(RECENT_KEY, []);
        recent = recent.filter(function (n) { return String(n).toLowerCase() !== cleanName.toLowerCase(); });
        recent.unshift(cleanName);
        writeJSON(RECENT_KEY, recent.slice(0, 40));

        if (cleanUnit) {
          var map = readJSON(UNIT_MAP_KEY, {});
          map[cleanName.toLowerCase()] = cleanUnit;
          writeJSON(UNIT_MAP_KEY, map);
        }
      }
      if (cleanUnit) {
        try { localStorage.setItem(UNIT_KEY + prefix, cleanUnit); } catch (err) {}
      }
      refreshSuggestions();
      var qty = parseFloat(quantity);
      var label = cleanName + (isNaN(qty) ? '' : ' x ' + qty) + (cleanUnit ? ' ' + cleanUnit : '');
      UI.toast('Saved: ' + label, 'ok', 2400);
    };

    /* ---------------- 编辑保存后：留在原地 ---------------- */
    /* 之前保存会整表重建（tbody 清空再填），页面高度瞬间塌陷 -> 滚动位置丢失、人被"弹走"。
       现在改为依赖 Firebase child_changed 原位更新，这里只负责复位滚动 + 高亮那一行。 */
    UI.afterItemSaved = function (id) {
      var y = window.scrollY;
      var x = window.scrollX;

      var keepStill = function () {
        if (Math.abs(window.scrollY - y) > 4) window.scrollTo(x, y);
      };

      // DOM 更新是异步的，多点几次确保稳定；同时不打断用户主动滚动
      var tries = 0;
      var timer = window.setInterval(function () {
        keepStill();
        tries++;
        if (tries >= 4) window.clearInterval(timer);
      }, 60);

      window.setTimeout(function () {
        var targets = [];
        if (id) {
          var row = document.querySelector('#inventory-table tbody tr[data-item-id="' + id + '"]');
          var card = document.querySelector('#inventory-cards .inventory-card[data-item-id="' + id + '"]');
          if (row) targets.push(row);
          if (card) targets.push(card);
        }
        targets.forEach(function (el) {
          el.classList.remove('row-flash');
          void el.offsetWidth;
          el.classList.add('row-flash');
          window.setTimeout(function () { el.classList.remove('row-flash'); }, 1900);
        });
      }, 320);
    };

    function autofillUnit(prefix, name) {
      if (!name) return;
      var unitInput = document.getElementById(prefix + '-unit');
      if (!unitInput || unitInput.value.trim()) return;
      var map = readJSON(UNIT_MAP_KEY, {});
      var unit = map[name.toLowerCase()] || localStorage.getItem(UNIT_KEY + prefix);
      if (unit) unitInput.value = unit;
    }

    function initStockInForms() {
      ['office', 'kepayan-seafood', 'kepayan-packaged'].forEach(function (key) {
        var prefix = 'stock-in-' + key;
        var nameEl = document.getElementById(prefix + '-name');
        var qtyEl = document.getElementById(prefix + '-quantity');
        var unitEl = document.getElementById(prefix + '-unit');
        var btn = document.getElementById(prefix + '-button');
        if (!nameEl || !qtyEl || !unitEl || !btn) return;

        if (nameEl.getAttribute('data-ui') !== '1') {
          nameEl.setAttribute('data-ui', '1');
          nameEl.addEventListener('change', function () { autofillUnit(prefix, nameEl.value.trim()); });
          nameEl.addEventListener('blur', function () { autofillUnit(prefix, nameEl.value.trim()); });
        }

        var stepper = qtyEl.closest('.stepper');
        if (stepper && stepper.getAttribute('data-ui') !== '1') {
          stepper.setAttribute('data-ui', '1');
          Array.prototype.forEach.call(stepper.querySelectorAll('.step'), function (b) {
            b.addEventListener('click', function () {
              var step = parseFloat(b.getAttribute('data-step')) || 1;
              var cur = parseFloat(qtyEl.value);
              if (isNaN(cur)) cur = 0;
              var next = cur + step;
              if (next < 0) next = 0;
              qtyEl.value = next % 1 === 0 ? String(next) : next.toFixed(2);
              qtyEl.dispatchEvent(new Event('input', { bubbles: true }));
            });
          });
        }

        var fields = [nameEl, qtyEl, unitEl, document.getElementById(prefix + '-expired-date')];
        fields.forEach(function (el) {
          if (!el || el.getAttribute('data-enter') === '1') return;
          el.setAttribute('data-enter', '1');
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              btn.click();
            }
          });
        });
      });
    }

    /* ---------------- 出库按钮状态提示 ---------------- */
    function bindStockOutHint() {
      var btn = document.getElementById('batch-stock-out-button');
      var hint = document.getElementById('batch-stock-out-hint');
      if (!btn || !hint || btn.getAttribute('data-ui') === '1') return;
      btn.setAttribute('data-ui', '1');
      var sync = function () {
        hint.textContent = btn.disabled ? 'Tick items in the list above to enable' : 'Ready to process';
      };
      new MutationObserver(sync).observe(btn, { attributes: true, attributeFilter: ['disabled'] });
      sync();
    }

    /* ---------------- 键盘：/ 聚焦搜索，Esc 收起下拉 ---------------- */
    function bindShortcuts() {
      document.addEventListener('keydown', function (e) {
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        var typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
        if (e.key === '/' && !typing) {
          var box = document.querySelector('.toolbar .control input[type="text"]');
          if (box && box.offsetParent !== null) {
            e.preventDefault();
            box.focus();
          }
        }
        if (e.key === 'Escape') {
          Array.prototype.forEach.call(document.querySelectorAll('.dropdown.open'), function (d) {
            d.classList.remove('open');
          });
        }
      });
    }

    /* ---------------- 在线记录刷新 ---------------- */
    function bindMisc() {
      bindStockOutHint();
      var refreshOnline = document.getElementById('refresh-online-records');
      if (refreshOnline && refreshOnline.getAttribute('data-ui') !== '1') {
        refreshOnline.setAttribute('data-ui', '1');
        refreshOnline.addEventListener('click', function () {
          if (typeof window.loadOnlineRecords === 'function') {
            window.loadOnlineRecords();
            UI.toast('Refreshing online records...', 'info', 1400);
          }
        });
      }
    }

    /* ---------------- 启动 ---------------- */
    function boot() {
      labelizeAll();
      updateCounts();
      bindToolbars();
      initStockInForms();
      bindMisc();
      bindShortcuts();
      refreshSuggestions();
      UI.setActiveNav('inventory');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }

    // 只监听数据表体，而不是整个 document.body。
    // 之前 observe(body, subtree) 会把弹窗、Toast、下拉菜单的所有变动都算进来，
    // 库存一次性渲染几十行时会反复排队 refresh，是手机端滚动卡顿的来源之一。
    var watchTargets = [
      document.querySelector('#inventory-table tbody'),
      document.getElementById('inventory-cards'),
      document.querySelector('#transaction-records-table tbody'),
      document.querySelector('#transaction-records-cards'),
      document.querySelector('#stock-out-table tbody'),
      document.querySelector('#stock-out-cards'),
      document.querySelector('#online-records-table tbody')
    ].filter(Boolean);

    if (watchTargets.length) {
      var observer = new MutationObserver(function () { scheduleRefresh(); });
      watchTargets.forEach(function (target) {
        // subtree: 行内容被 innerHTML 整体替换时（编辑保存）也要重新补标记
        observer.observe(target, { childList: true, subtree: true });
      });
    }

    window.addEventListener('resize', function () { scheduleRefresh(); });
  })();