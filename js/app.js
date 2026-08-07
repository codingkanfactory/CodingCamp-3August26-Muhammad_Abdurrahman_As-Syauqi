/* ============================================================
   EXPENSE & BUDGET VISUALIZER — app.js
   Vanilla JS · localStorage · Chart.js
   ============================================================ */

'use strict';

/* ------------------------------------------------------------------ */
/*  CONSTANTS & STATE                                                   */
/* ------------------------------------------------------------------ */

const STORAGE_KEY_TX      = 'ebv_transactions';
const STORAGE_KEY_CATS    = 'ebv_custom_categories';
const STORAGE_KEY_THEME   = 'ebv_theme';
const STORAGE_KEY_SORT    = 'ebv_sort_preference';
const STORAGE_KEY_THRESH  = 'ebv_threshold';

/** Built-in categories with Lucide icon names */
const BASE_CATEGORIES = [
  { name: 'Makanan',       icon: 'utensils' },
  { name: 'Transportasi',  icon: 'bus' },
  { name: 'Hiburan',       icon: 'gamepad-2' },
];

/** Palette for chart slices - Teal Theme */
const CHART_PALETTE = [
  '#14b8a6', '#0d9488', '#06b6d4', '#0891b2',
  '#10b981', '#059669', '#6366f1', '#4f46e5',
  '#8b5cf6', '#7c3aed', '#ec4899', '#db2777',
];

/** Application state (source of truth) */
let state = {
  transactions:      [],   // { id, name, amount, date, category }
  customCategories:  [],   // [{ name, icon }]
  theme:             'light',
  sortPreference:    'newest',
  threshold:         0,
};

/** Chart.js instance */
let expenseChart = null;

/* ------------------------------------------------------------------ */
/*  UTILITY HELPERS                                                     */
/* ------------------------------------------------------------------ */

/** Generate a unique ID */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Format number to Indonesian Rupiah */
function formatRupiah(amount) {
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

/** Format ISO date string to locale (e.g. "4 Agu 2025") */
function formatDate(isoStr) {
  if (!isoStr) return '-';
  const [y, m, d] = isoStr.split('-');
  const date = new Date(+y, +m - 1, +d);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Parse ISO date to "YYYY-MM" month key */
function monthKey(isoStr) {
  return isoStr ? isoStr.slice(0, 7) : '';
}

/** Format "YYYY-MM" to "Januari 2025" */
function formatMonthLabel(key) {
  if (!key) return '-';
  const [y, m] = key.split('-');
  const date = new Date(+y, +m - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/** Show a brief toast notification */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/** Get all categories (base + custom) */
function getAllCategories() {
  return [...BASE_CATEGORIES, ...state.customCategories];
}

/** Get category object by name */
function getCategoryByName(name) {
  return getAllCategories().find(c => c.name === name) || { name, icon: 'tag' };
}

/** Lucide icon names for custom categories */
const CUSTOM_ICONS = [
  'tag', 'shopping-bag', 'heart-pulse', 'book-open', 'laptop',
  'dumbbell', 'plane', 'gift', 'wrench', 'lightbulb'
];

/* ------------------------------------------------------------------ */
/*  LOCALSTORAGE PERSISTENCE                                            */
/* ------------------------------------------------------------------ */

function saveAll() {
  localStorage.setItem(STORAGE_KEY_TX,   JSON.stringify(state.transactions));
  localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(state.customCategories));
  localStorage.setItem(STORAGE_KEY_THEME, state.theme);
  localStorage.setItem(STORAGE_KEY_SORT, state.sortPreference);
  localStorage.setItem(STORAGE_KEY_THRESH, state.threshold.toString());
}

function loadAll() {
  try {
    const tx     = localStorage.getItem(STORAGE_KEY_TX);
    const cats   = localStorage.getItem(STORAGE_KEY_CATS);
    const theme  = localStorage.getItem(STORAGE_KEY_THEME);
    const sort   = localStorage.getItem(STORAGE_KEY_SORT);
    const thresh = localStorage.getItem(STORAGE_KEY_THRESH);

    state.transactions     = tx     ? JSON.parse(tx)   : [];
    state.customCategories = cats   ? JSON.parse(cats) : [];
    state.theme            = theme === 'dark' ? 'dark' : 'light';
    state.sortPreference   = sort   || 'newest';
    state.threshold        = thresh ? parseFloat(thresh) : 0;
  } catch (e) {
    console.warn('Failed to load data from localStorage.', e);
    state.transactions     = [];
    state.customCategories = [];
    state.theme            = 'light';
    state.sortPreference   = 'newest';
    state.threshold        = 0;
  }
}

/* ------------------------------------------------------------------ */
/*  THEME                                                               */
/* ------------------------------------------------------------------ */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  
  // Update Lucide icon
  if (icon) {
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons();
  }

  // Update Chart.js text color on theme change
  if (expenseChart) {
    updateChartTheme(theme);
    expenseChart.update();
  }
}

function updateChartTheme(theme) {
  if (!expenseChart) return;
  const textColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';
  expenseChart.options.plugins.legend.labels.color = textColor;
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
  saveAll();
}

/* ------------------------------------------------------------------ */
/*  CATEGORY DROPDOWN — populate <select>                               */
/* ------------------------------------------------------------------ */

function buildCategoryDropdown() {
  const select = document.getElementById('itemCategory');
  const current = select.value;

  // Clear existing options (keep placeholder)
  select.innerHTML = '<option value="">-- Pilih Kategori --</option>';

  getAllCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });

  // Restore previous selection if still valid
  if (current && select.querySelector(`option[value="${CSS.escape(current)}"]`)) {
    select.value = current;
  }
}

/* ------------------------------------------------------------------ */
/*  CUSTOM CATEGORY MANAGEMENT                                          */
/* ------------------------------------------------------------------ */

function renderCustomCategories() {
  const container = document.getElementById('customCategoryList');
  container.innerHTML = '';

  if (state.customCategories.length === 0) return;

  state.customCategories.forEach((cat, idx) => {
    const tag = document.createElement('span');
    tag.className = 'custom-cat-tag';
    tag.innerHTML = `
      <i data-lucide="${cat.icon}" style="width: 14px; height: 14px;"></i>
      ${cat.name}
      <button data-idx="${idx}" title="Hapus kategori ${cat.name}" aria-label="Hapus ${cat.name}">✕</button>
    `;
    container.appendChild(tag);
  });

  // Re-initialize Lucide icons
  lucide.createIcons();
}

function addCustomCategory() {
  const input   = document.getElementById('customCatInput');
  const errEl   = document.getElementById('customCatError');
  const rawName = input.value.trim();

  errEl.textContent = '';

  if (!rawName) {
    errEl.textContent = 'Nama kategori tidak boleh kosong.';
    return;
  }

  // Check duplicates (case-insensitive)
  const exists = getAllCategories().some(
    c => c.name.toLowerCase() === rawName.toLowerCase()
  );
  if (exists) {
    errEl.textContent = 'Kategori sudah ada.';
    return;
  }

  // Assign a rotating icon from a small set
  const icon = CUSTOM_ICONS[state.customCategories.length % CUSTOM_ICONS.length];

  state.customCategories.push({ name: rawName, icon });
  saveAll();

  buildCategoryDropdown();
  renderCustomCategories();
  input.value = '';
  showToast(`Kategori "${rawName}" ditambahkan.`);
}

function deleteCustomCategory(idx) {
  const cat = state.customCategories[idx];
  if (!cat) return;

  state.customCategories.splice(idx, 1);
  saveAll();

  buildCategoryDropdown();
  renderCustomCategories();
  renderAll();          // chart & summary may need update
  showToast(`Kategori "${cat.name}" dihapus.`);
}

/* ------------------------------------------------------------------ */
/*  FORM VALIDATION                                                     */
/* ------------------------------------------------------------------ */

function clearErrors() {
  ['itemName', 'itemAmount', 'itemDate', 'itemCategory'].forEach(id => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    el && el.classList.remove('is-error');
    if (errEl) errEl.textContent = '';
  });
}

function showFieldError(fieldId, msg) {
  const el    = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + 'Error');
  el && el.classList.add('is-error');
  if (errEl) errEl.textContent = msg;
}

function validateForm() {
  let valid = true;
  clearErrors();

  const name     = document.getElementById('itemName').value.trim();
  const amount   = document.getElementById('itemAmount').value.trim();
  const date     = document.getElementById('itemDate').value;
  const category = document.getElementById('itemCategory').value;

  if (!name) {
    showFieldError('itemName', 'Nama item wajib diisi.');
    valid = false;
  }

  if (!amount || isNaN(+amount) || +amount <= 0) {
    showFieldError('itemAmount', 'Masukkan jumlah yang valid (> 0).');
    valid = false;
  }

  if (!date) {
    showFieldError('itemDate', 'Tanggal wajib dipilih.');
    valid = false;
  }

  if (!category) {
    showFieldError('itemCategory', 'Pilih kategori terlebih dahulu.');
    valid = false;
  }

  return valid;
}

/* ------------------------------------------------------------------ */
/*  TRANSACTIONS — CRUD                                                 */
/* ------------------------------------------------------------------ */

function addTransaction(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const tx = {
    id:       uid(),
    name:     document.getElementById('itemName').value.trim(),
    amount:   +document.getElementById('itemAmount').value,
    date:     document.getElementById('itemDate').value,
    category: document.getElementById('itemCategory').value,
  };

  state.transactions.unshift(tx); // newest first
  saveAll();
  renderAll();

  // Reset form
  document.getElementById('transactionForm').reset();
  clearErrors();
  showToast('Transaksi berhasil ditambahkan.');
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(tx => tx.id !== id);
  saveAll();
  renderAll();
  showToast('Transaksi dihapus.');
}

function clearAllTransactions() {
  if (state.transactions.length === 0) {
    showToast('Tidak ada transaksi untuk dihapus.');
    return;
  }
  if (!window.confirm('Hapus semua transaksi? Tindakan ini tidak bisa dibatalkan.')) return;
  state.transactions = [];
  saveAll();
  renderAll();
  showToast('Semua transaksi dihapus.');
}

/* ------------------------------------------------------------------ */
/*  SORTING & THRESHOLD                                                 */
/* ------------------------------------------------------------------ */

function getSortedTransactions() {
  const sorted = [...state.transactions];
  
  switch (state.sortPreference) {
    case 'oldest':
      sorted.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case 'highest':
      sorted.sort((a, b) => b.amount - a.amount);
      break;
    case 'lowest':
      sorted.sort((a, b) => a.amount - b.amount);
      break;
    case 'category':
      sorted.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'newest':
    default:
      // Keep newest first (default state.transactions order)
      break;
  }
  
  return sorted;
}

function handleSortChange() {
  const select = document.getElementById('sortSelect');
  state.sortPreference = select.value;
  saveAll();
  renderTransactionList();
}

function handleThresholdChange() {
  const input = document.getElementById('thresholdInput');
  state.threshold = parseFloat(input.value) || 0;
  saveAll();
  renderTransactionList();
}

/* ------------------------------------------------------------------ */
/*  RENDER — BALANCE                                                    */
/* ------------------------------------------------------------------ */

function renderBalance() {
  const total = state.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const count = state.transactions.length;

  document.getElementById('totalBalance').textContent = formatRupiah(total);
  document.getElementById('balanceSub').textContent   =
    count === 0
      ? '0 transaksi tercatat'
      : `${count} transaksi · ${formatRupiah(total / count)} rata-rata`;
}

/* ------------------------------------------------------------------ */
/*  RENDER — TRANSACTION LIST                                           */
/* ------------------------------------------------------------------ */

function renderTransactionList() {
  const container   = document.getElementById('transactionList');
  const emptyState  = document.getElementById('listEmptyState');

  // Clear previous items (keep static empty state)
  [...container.querySelectorAll('.transaction-item')].forEach(el => el.remove());

  if (state.transactions.length === 0) {
    emptyState.style.display = '';
    return;
  }
  emptyState.style.display = 'none';

  const sortedTransactions = getSortedTransactions();

  sortedTransactions.forEach(tx => {
    const cat  = getCategoryByName(tx.category);
    const item = document.createElement('div');
    item.className   = 'transaction-item';
    item.role        = 'listitem';
    item.dataset.id  = tx.id;

    // Apply threshold highlight
    if (state.threshold > 0 && tx.amount > state.threshold) {
      item.classList.add('highlight-threshold');
    }

    item.innerHTML = `
      <div class="tx-icon"><i data-lucide="${cat.icon}"></i></div>
      <div class="tx-body">
        <div class="tx-name">${escapeHtml(tx.name)}</div>
        <div class="tx-meta">
          <span class="tx-category">${escapeHtml(tx.category)}</span>
          <span class="tx-date">${formatDate(tx.date)}</span>
        </div>
      </div>
      <div class="tx-amount">−${formatRupiah(tx.amount)}</div>
      <button class="tx-delete" data-id="${tx.id}" title="Hapus transaksi" aria-label="Hapus ${escapeHtml(tx.name)}">
        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
      </button>
    `;
    container.appendChild(item);
  });

  // Re-initialize Lucide icons
  lucide.createIcons();
}

/** Simple HTML escaping to prevent XSS from user input */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ------------------------------------------------------------------ */
/*  RENDER — PIE CHART                                                  */
/* ------------------------------------------------------------------ */

function renderChart() {
  const canvas     = document.getElementById('expenseChart');
  const ctx        = canvas.getContext('2d');
  const emptyState = document.getElementById('chartEmptyState');

  // Aggregate totals per category
  const totals = {};
  state.transactions.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });

  const labels = Object.keys(totals);
  const data   = Object.values(totals);

  if (labels.length === 0) {
    canvas.style.display       = 'none';
    emptyState.style.display   = 'block';
    if (expenseChart) { expenseChart.destroy(); expenseChart = null; }
    return;
  }

  canvas.style.display     = '';
  emptyState.style.display = 'none';

  const colors     = labels.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]);
  const textColor  = state.theme === 'dark' ? '#f1f5f9' : '#0f172a';

  if (expenseChart) {
    // Update existing chart in-place for smooth transitions
    expenseChart.data.labels           = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.options.plugins.legend.labels.color = textColor;
    expenseChart.update();
    return;
  }

  expenseChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor:  colors,
        borderColor:      state.theme === 'dark' ? '#151b23' : '#ffffff',
        borderWidth:      3,
        hoverOffset:      8,
      }],
    },
    options: {
      responsive:         true,
      maintainAspectRatio: true,
      animation: {
        animateRotate:  true,
        animateScale:   true,
        duration:       500,
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color:    textColor,
            padding:  12,
            font:     { size: 12, family: "'Poppins', sans-serif", weight: '500' },
            boxWidth: 14,
            boxHeight: 14,
          },
        },
        tooltip: {
          backgroundColor: state.theme === 'dark' ? '#1f2937' : '#ffffff',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: state.theme === 'dark' ? '#334155' : '#d1d5db',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return ` ${formatRupiah(context.parsed)}  (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/*  RENDER — MONTHLY SUMMARY                                            */
/* ------------------------------------------------------------------ */

function renderMonthlySummary() {
  const container = document.getElementById('monthlySummary');
  container.innerHTML = '';

  if (state.transactions.length === 0) {
    container.innerHTML = '<p class="empty-state">Belum ada data.</p>';
    return;
  }

  // Group by month
  const monthMap = {};
  state.transactions.forEach(tx => {
    const key = monthKey(tx.date);
    if (!monthMap[key]) monthMap[key] = { total: 0, count: 0 };
    monthMap[key].total += tx.amount;
    monthMap[key].count++;
  });

  // Sort descending by month key
  const sorted = Object.entries(monthMap).sort((a, b) => b[0].localeCompare(a[0]));

  sorted.forEach(([key, { total, count }]) => {
    const item = document.createElement('div');
    item.className = 'monthly-item';
    item.innerHTML = `
      <div>
        <div class="monthly-month">${formatMonthLabel(key)}</div>
        <div class="monthly-count">${count} transaksi</div>
      </div>
      <div class="monthly-amount">${formatRupiah(total)}</div>
    `;
    container.appendChild(item);
  });
}

/* ------------------------------------------------------------------ */
/*  RENDER ALL (single entry point for a full UI update)               */
/* ------------------------------------------------------------------ */

function renderAll() {
  renderBalance();
  renderTransactionList();
  renderChart();
  renderMonthlySummary();
}

/* ------------------------------------------------------------------ */
/*  EVENT LISTENERS                                                     */
/* ------------------------------------------------------------------ */

function attachEventListeners() {
  // Form submit
  document.getElementById('transactionForm').addEventListener('submit', addTransaction);

  // Delegate delete button clicks in the transaction list
  document.getElementById('transactionList').addEventListener('click', e => {
    const btn = e.target.closest('.tx-delete');
    if (btn) deleteTransaction(btn.dataset.id);
  });

  // Clear all button
  document.getElementById('clearAllBtn').addEventListener('click', clearAllTransactions);

  // Theme toggle
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

  // Add custom category
  document.getElementById('addCategoryBtn').addEventListener('click', addCustomCategory);
  document.getElementById('customCatInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomCategory(); }
  });

  // Delegate delete in custom category list
  document.getElementById('customCategoryList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-idx]');
    if (btn) deleteCustomCategory(+btn.dataset.idx);
  });

  // Sort dropdown
  document.getElementById('sortSelect').addEventListener('change', handleSortChange);

  // Threshold input
  document.getElementById('thresholdInput').addEventListener('input', handleThresholdChange);

  // Remove error highlight on user interaction
  ['itemName', 'itemAmount', 'itemDate', 'itemCategory'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('is-error');
      const errEl = document.getElementById(id + 'Error');
      if (errEl) errEl.textContent = '';
    });
    el.addEventListener('change', () => {
      el.classList.remove('is-error');
      const errEl = document.getElementById(id + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });
}

/* ------------------------------------------------------------------ */
/*  INITIALISATION                                                      */
/* ------------------------------------------------------------------ */

function init() {
  loadAll();
  applyTheme(state.theme);
  buildCategoryDropdown();
  renderCustomCategories();
  renderAll();
  attachEventListeners();

  // Set today's date as default for the date field
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('itemDate').value = today;

  // Restore sort preference
  document.getElementById('sortSelect').value = state.sortPreference;

  // Restore threshold value
  document.getElementById('thresholdInput').value = state.threshold || '';

  // Initialize Lucide icons
  lucide.createIcons();
}

// Boot
document.addEventListener('DOMContentLoaded', init);