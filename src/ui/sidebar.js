// Бічна навігація: пошук, уроки за модулями, задачі за рівнями, прогрес і файл прогресу.
import { fill, h, progressRing } from './dom.js';
import { icon } from './icons.js';
import { button, progressBar } from './parts.js';
import { lessonHref, taskHref } from './router.js';

export function createSidebar(root, ctx) {
  const { catalog, store } = ctx;
  const open = new Set();
  let query = '';
  let active = { kind: 'home', id: null };
  let countCh = 3;

  const input = h('input', {
    class: 'side-search-input',
    type: 'search',
    placeholder: 'Пошук уроку чи задачі',
    'aria-label': 'Пошук уроку чи задачі',
    autocomplete: 'off',
    spellcheck: 'false',
  });
  const nav = h('nav', { class: 'side-nav', 'aria-label': 'Уроки і задачі' });
  const foot = h('div', { class: 'side-foot' });

  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  const exportBtn = button('download', 'Експорт', 'small ghost', { title: 'Зберегти прогрес і код у файл' });
  const importBtn = button('upload', 'Імпорт', 'small ghost', { title: 'Відновити прогрес з файлу' });
  const resetBtn = button('trash', 'Скинути', 'small ghost', { title: 'Скинути весь прогрес' });
  const footCount = h('span', { class: 'side-progress-count' });
  const footBar = h('div', { class: 'side-bar-slot' });
  foot.append(
    h('div', { class: 'side-progress' }, h('span', { class: 'side-progress-label' }, 'Прогрес'), footCount),
    footBar,
    h('div', { class: 'side-actions' }, exportBtn, importBtn, resetBtn),
    fileInput,
  );

  root.replaceChildren(h('div', { class: 'side-search' }, icon('search'), input), nav, foot);

  const matches = (number, title) => !query || title.toLowerCase().includes(query) || number.startsWith(query);

  function itemLink({ href, number, title, ids, isActive }) {
    const c = catalog.count(ids, store.isDone);
    return h(
      'a',
      { class: `side-item${isActive ? ' is-active' : ''}`, href, 'aria-current': isActive ? 'page' : null },
      h('span', { class: 'side-num' }, number),
      h('span', { class: 'side-title' }, title),
      progressRing(c.done, c.total),
    );
  }

  function group(key, num, title, entries, describe) {
    const items = entries.map((e) => describe(e)).filter((it) => matches(it.number, it.title));
    if (query && !items.length) return null;
    const c = catalog.count(
      entries.flatMap((e) => e.itemIds),
      store.isDone,
    );
    countCh = Math.max(countCh, 2 * String(c.total).length + 1);
    const details = h(
      'details',
      { class: 'side-group', open: Boolean(query) || open.has(key) },
      h(
        'summary',
        { class: 'side-summary' },
        h('span', { class: 'side-num' }, num),
        h('span', { class: 'side-title' }, title),
        h('span', { class: 'side-count' }, `${c.done}/${c.total}`),
      ),
      h('div', { class: 'side-items' }, items.map(itemLink)),
    );
    details.addEventListener('toggle', () => {
      if (query) return;
      if (details.open) open.add(key);
      else open.delete(key);
    });
    return details;
  }

  function topLink(href, iconName, label, isActive) {
    return h(
      'a',
      { class: `side-item side-top-link${isActive ? ' is-active' : ''}`, href, 'aria-current': isActive ? 'page' : null },
      h('span', { class: 'side-num' }, icon(iconName)),
      h('span', { class: 'side-title' }, label),
    );
  }

  function render() {
    const scroll = nav.scrollTop;
    countCh = 3;
    const lessonGroups = catalog.modules.map((mod, mi) =>
      group(
        `m:${mod.id}`,
        String(mi + 1),
        mod.title,
        catalog.lessons.filter((e) => e.module === mod),
        (e) => ({
          href: lessonHref(e.lesson.id),
          number: e.number,
          title: e.lesson.title,
          ids: e.itemIds,
          isActive: active.kind === 'lesson' && active.id === e.lesson.id,
        }),
      ),
    );
    const taskGroups = catalog.levels.map((level) =>
      group(
        `p:${level.id}`,
        String(level.level),
        level.title,
        catalog.tasks.filter((e) => e.level === level),
        (e) => ({
          href: taskHref(e.task.id),
          number: e.number,
          title: e.task.title,
          ids: e.itemIds,
          isActive: active.kind === 'task' && active.id === e.task.id,
        }),
      ),
    );
    const anyLessons = lessonGroups.some(Boolean);
    const anyTasks = taskGroups.some(Boolean);
    // Лічильники груп однієї ширини, щоб колонка назв закінчувалась на тому самому x.
    nav.style.setProperty('--count-ch', countCh);
    fill(
      nav,
      query ? null : h('div', { class: 'side-top' }, topLink('#/', 'grid', 'Огляд', active.kind === 'home'), topLink('#/sandbox', 'terminal', 'Пісочниця', active.kind === 'sandbox')),
      anyLessons ? h('div', { class: 'side-heading' }, 'Уроки') : null,
      lessonGroups,
      anyTasks ? h('div', { class: 'side-heading' }, 'Практикум') : null,
      taskGroups,
      query && !anyLessons && !anyTasks ? h('p', { class: 'side-empty' }, 'Нічого не знайдено') : null,
    );
    nav.scrollTop = scroll;

    const t = catalog.totals(store.isDone);
    const done = t.exercises.done + t.steps.done;
    const total = t.exercises.total + t.steps.total;
    footCount.textContent = `${done}/${total}`;
    footBar.replaceChildren(progressBar(done, total, 'Загальний прогрес'));
  }

  function revealActive() {
    const a = nav.querySelector('.side-item.is-active:not(.side-top-link)');
    if (!a) return;
    const top = a.offsetTop;
    if (top < nav.scrollTop || top + a.offsetHeight > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = Math.max(0, top - nav.clientHeight / 3);
    }
  }

  input.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) {
      e.stopPropagation();
      input.value = '';
      query = '';
      render();
    }
  });

  exportBtn.addEventListener('click', () => {
    const blob = new Blob([store.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = h('a', { href: url, download: `python-trainer-${stamp}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    ctx.toast('Прогрес збережено у файл');
  });
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    try {
      store.importJson(await file.text());
      ctx.refresh();
      ctx.toast('Прогрес відновлено');
    } catch (err) {
      ctx.toast(err instanceof SyntaxError ? 'Файл пошкоджений' : err.message, 'err');
    }
  });
  resetBtn.addEventListener('click', async () => {
    if (!(await ctx.confirm('Скинути весь прогрес і збережений код? Повернути їх можна лише з файлу експорту.', 'Скинути'))) return;
    store.reset();
    ctx.refresh();
    ctx.toast('Прогрес скинуто');
  });

  store.subscribe(render);

  return {
    setActive(route) {
      if (route.name === 'lesson') {
        active = { kind: 'lesson', id: route.id };
        const e = catalog.lessonById.get(route.id);
        if (e) open.add(`m:${e.module.id}`);
      } else if (route.name === 'task') {
        active = { kind: 'task', id: route.id };
        const e = catalog.taskById.get(route.id);
        if (e) open.add(`p:${e.level.id}`);
      } else {
        active = { kind: route.name, id: null };
      }
      render();
      revealActive();
    },
    focusSearch() {
      input.focus();
      input.select();
    },
  };
}
