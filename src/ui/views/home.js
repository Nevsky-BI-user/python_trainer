// Огляд: продовжити з першого невиконаного, прогрес, модулі уроків, сходинки практикуму.
import { h, pluralUk, progressRing } from '../dom.js';
import { icon } from '../icons.js';
import { meter, progressBar } from '../parts.js';
import { lessonHref, nextHref, parseHash, taskHref } from '../router.js';

export function homeView(ctx) {
  const { store } = ctx;
  const el = h('div', { class: 'page home' });
  const render = () => el.replaceChildren(hero(ctx), stats(ctx), modulesSection(ctx), levelsSection(ctx));
  render();
  const unsubscribe = store.subscribe(render);
  return { el, title: 'Огляд', destroy: unsubscribe };
}

function hero(ctx) {
  const { catalog, store } = ctx;
  const next = catalog.nextUnsolved(store.isDone);
  let cta;
  if (next) {
    const r = parseHash(next.route);
    const e = r.name === 'lesson' ? catalog.lessonById.get(r.id) : catalog.taskById.get(r.id);
    const label = e ? `${e.number} ${r.name === 'lesson' ? e.lesson.title : e.task.title}` : '';
    cta = h('a', { class: 'btn primary large', href: nextHref(next) }, icon('play'), h('span', {}, 'Продовжити'), label ? h('span', { class: 'btn-sub' }, label) : null);
  } else {
    cta = h('span', { class: 'done-all' }, icon('check'), h('span', {}, 'Усе розв\'язано'));
  }
  return h(
    'section',
    { class: 'hero' },
    h('p', { class: 'eyebrow' }, 'Python для дата-аналітика'),
    h('h1', { class: 'hero-title' }, 'Від першої змінної до ', h('span', { class: 'marker' }, 'повного циклу аналізу')),
    h(
      'p',
      { class: 'lead' },
      'Справжній Python у браузері з pandas, numpy і matplotlib. Теорія з прикладами, вправи з миттєвою перевіркою і багатокрокові задачі: від розминки до очищення, зведення і візуалізації брудних даних.',
    ),
    h('div', { class: 'hero-actions' }, cta, h('a', { class: 'btn large', href: '#/sandbox' }, icon('terminal'), h('span', {}, 'Пісочниця'))),
  );
}

function stats(ctx) {
  const { catalog, store } = ctx;
  const t = catalog.totals(store.isDone);
  const lessons = catalog.lessons.filter((e) => e.itemIds.length);
  const lessonsDone = lessons.filter((e) => e.itemIds.every(store.isDone)).length;
  const tasksDone = catalog.tasks.filter((e) => e.itemIds.every(store.isDone)).length;
  const tile = (label, done, total) =>
    h(
      'div',
      { class: 'stat' },
      h('div', { class: 'stat-label' }, label),
      h('div', { class: 'stat-value' }, h('span', { class: 'stat-done' }, String(done)), h('span', { class: 'stat-total' }, `/ ${total}`)),
      progressBar(done, total, label),
    );
  return h(
    'section',
    { class: 'stats', 'aria-label': 'Прогрес' },
    tile('Вправи уроків', t.exercises.done, t.exercises.total),
    tile('Кроки задач', t.steps.done, t.steps.total),
    tile('Уроки пройдено', lessonsDone, lessons.length),
    tile('Задачі розв\'язано', tasksDone, catalog.tasks.length),
  );
}

function modulesSection(ctx) {
  const { catalog, store } = ctx;
  const cards = catalog.modules
    .map((mod, mi) => {
      const entries = catalog.lessons.filter((e) => e.module === mod);
      if (!entries.length) return null;
      const c = catalog.count(
        entries.flatMap((e) => e.itemIds),
        store.isDone,
      );
      const target = entries.find((e) => !e.itemIds.every(store.isDone)) || entries[0];
      return h(
        'a',
        { class: 'module-card', href: lessonHref(target.lesson.id) },
        h('span', { class: 'module-num' }, String(mi + 1).padStart(2, '0')),
        h('span', { class: 'module-title' }, mod.title),
        h('span', { class: 'module-meta' }, `${entries.length} ${pluralUk(entries.length, 'урок', 'уроки', 'уроків')}`),
        h('span', { class: 'module-progress' }, progressBar(c.done, c.total, mod.title), h('span', { class: 'module-count' }, `${c.done}/${c.total}`)),
      );
    })
    .filter(Boolean);
  return h('section', { class: 'home-section' }, h('h2', { class: 'section-title' }, 'Уроки'), h('div', { class: 'module-grid' }, cards));
}

function levelsSection(ctx) {
  const { catalog, store } = ctx;
  if (!catalog.levels.length) return null;
  const maxLevel = Math.max(5, ...catalog.levels.map((l) => l.level));
  const rows = catalog.levels.map((level) => {
    const entries = catalog.tasks.filter((e) => e.level === level);
    const c = catalog.count(
      entries.flatMap((e) => e.itemIds),
      store.isDone,
    );
    return h(
      'article',
      { class: 'level-card' },
      h('div', { class: 'level-side' }, h('span', { class: 'level-num' }, String(level.level)), meter(level.level, maxLevel)),
      h(
        'div',
        { class: 'level-main' },
        h('h3', { class: 'level-title' }, level.title),
        h('p', { class: 'level-desc' }, level.description),
        h(
          'ul',
          { class: 'level-tasks' },
          entries.map((e) => {
            const tc = catalog.count(e.itemIds, store.isDone);
            return h(
              'li',
              {},
              h(
                'a',
                { class: 'level-task', href: taskHref(e.task.id) },
                h('span', { class: 'level-task-num' }, e.number),
                h('span', { class: 'level-task-title' }, e.task.title),
                h('span', { class: 'level-task-count' }, `${tc.done}/${tc.total}`),
                progressRing(tc.done, tc.total),
              ),
            );
          }),
        ),
      ),
      h('div', { class: 'level-progress' }, h('span', { class: 'level-count' }, `${c.done}/${c.total}`), progressBar(c.done, c.total, level.title)),
    );
  });
  return h('section', { class: 'home-section' }, h('h2', { class: 'section-title' }, icon('stairs'), h('span', {}, 'Практикум')), h('div', { class: 'levels' }, rows));
}
