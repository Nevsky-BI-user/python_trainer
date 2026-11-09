import '@fontsource-variable/unbounded';
import '@fontsource-variable/commissioner';
import '@fontsource-variable/jetbrains-mono';
import './styles.css';

import { modules, levels } from './content/index.js';
import { buildCatalog } from './core/catalog.js';
import { createStore } from './core/store.js';
import { createRunner } from './runtime/client.js';
import { h } from './ui/dom.js';
import { icon } from './ui/icons.js';
import { parseHash } from './ui/router.js';
import { createSidebar } from './ui/sidebar.js';
import { homeView } from './ui/views/home.js';
import { lessonView } from './ui/views/lesson.js';
import { taskView } from './ui/views/task.js';
import { sandboxView, SANDBOX_ID } from './ui/views/sandbox.js';
import { notFoundView } from './ui/views/notfound.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const main = $('main');
const sidebarEl = $('sidebar');
const scrim = $('scrim');
const menuBtn = $('menu-btn');
const themeBtn = $('theme-btn');
const statusEl = $('py-status');

const store = createStore();
const catalog = buildCatalog({ modules, levels });

/* ---------- Стан Python у шапці ---------- */

const STATUS_TEXT = {
  idle: 'Python',
  loading: 'Завантажую Python',
  packages: 'Завантажую бібліотеки',
  running: 'Виконую',
  failed: 'Python недоступний',
};
let pyVersion = 'Python';
function renderStatus({ state, detail }) {
  if (state === 'ready' && /^Python \d/.test(detail || '')) pyVersion = detail;
  const text = state === 'ready' ? pyVersion : detail || STATUS_TEXT[state] || 'Python';
  statusEl.dataset.state = state;
  statusEl.querySelector('.py-text').textContent = text;
  statusEl.title = state === 'failed' ? `Python не завантажився: ${detail}` : text;
}
const runner = createRunner({ onStatus: renderStatus });

/* ---------- Тема ---------- */

const darkMedia = matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => document.documentElement.dataset.theme || (darkMedia.matches ? 'dark' : 'light');
function renderThemeBtn() {
  const dark = currentTheme() === 'dark';
  themeBtn.replaceChildren(icon(dark ? 'sun' : 'moon'));
  const label = dark ? 'Світла тема' : 'Темна тема';
  themeBtn.setAttribute('aria-label', label);
  themeBtn.title = label;
}
themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  store.setTheme(next);
  renderThemeBtn();
});
darkMedia.addEventListener('change', renderThemeBtn);
renderThemeBtn();

/* ---------- Висувна навігація на вузьких екранах ---------- */

const narrow = matchMedia('(max-width: 899.98px)');
function setDrawer(open) {
  app.classList.toggle('nav-open', open);
  scrim.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.replaceChildren(icon(open ? 'close' : 'menu'));
  sidebarEl.inert = narrow.matches && !open;
}
menuBtn.addEventListener('click', () => setDrawer(!app.classList.contains('nav-open')));
scrim.addEventListener('click', () => setDrawer(false));
narrow.addEventListener('change', () => setDrawer(false));

/* ---------- Сповіщення і підтвердження ---------- */

function toast(text, kind = 'ok') {
  const el = h('div', { class: `toast ${kind}`, role: kind === 'err' ? 'alert' : 'status' }, icon(kind === 'err' ? 'close' : 'check'), h('span', {}, text));
  $('toasts').append(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

function confirmDialog(text, okLabel = 'Так') {
  const dialog = $('dialog');
  $('dialog-text').textContent = text;
  $('dialog-ok').textContent = okLabel;
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok'), { once: true });
    dialog.returnValue = '';
    dialog.showModal();
  });
}

async function openInSandbox(code) {
  const current = store.getCode(SANDBOX_ID);
  if (current !== undefined && current.trim() && current !== code) {
    if (!(await confirmDialog('Замінити код у пісочниці цим прикладом?', 'Замінити'))) return;
  }
  store.setCode(SANDBOX_ID, code);
  location.hash = '#/sandbox';
}

/* ---------- Маршрутизація ---------- */

const ctx = { store, runner, catalog, toast, confirm: confirmDialog, openInSandbox, refresh };
const sidebar = createSidebar(sidebarEl, ctx);

let view = null;

function build(route) {
  switch (route.name) {
    case 'home':
      return homeView(ctx);
    case 'lesson':
      return lessonView(ctx, route);
    case 'task':
      return taskView(ctx, route);
    case 'sandbox':
      return sandboxView(ctx);
    default:
      return null;
  }
}

function route() {
  const r = parseHash(location.hash);
  let fresh = false;
  if (!(view?.update && view.update(r))) {
    view?.destroy?.();
    view = build(r) || notFoundView(ctx);
    main.replaceChildren(view.el);
    document.title = `${view.title} · Python тренажер`;
    fresh = true;
  }
  const anchor = view.anchorId?.(r);
  const target = anchor ? document.getElementById(anchor) : null;
  if (target) target.scrollIntoView({ block: 'start' });
  else if (fresh) window.scrollTo(0, 0);
  sidebar.setActive(r);
  setDrawer(false);
  if (fresh) main.focus({ preventScroll: true });
  if (r.name !== 'notfound') store.setLast(location.hash || '#/');
}

function refresh() {
  view?.destroy?.();
  view = null;
  route();
}

window.addEventListener('hashchange', route);
window.addEventListener('pagehide', () => store.flush());
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') store.flush();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && app.classList.contains('nav-open')) setDrawer(false);
  const typing = e.target.closest?.('input, textarea, [contenteditable="true"], .cm-editor');
  if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    if (narrow.matches) setDrawer(true);
    sidebar.focusSearch();
  }
});

route();
