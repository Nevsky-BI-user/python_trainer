// Сторінка уроку: теорія, приклади з живим запуском, вправи.
import { h } from '../dom.js';
import { highlightedBlock } from '../editor.js';
import { createExercise } from '../exercise.js';
import { renderResult, renderPending, renderInfra } from '../result.js';
import { button, pageHead, pager, progressChip } from '../parts.js';
import { lessonHref } from '../router.js';
import { exercisePayload } from '../../core/evaluate.js';
import { exerciseId } from '../../core/catalog.js';

export function lessonView(ctx, route) {
  const { catalog, store, runner } = ctx;
  const entry = catalog.lessonById.get(route.id);
  if (!entry) return null;
  const { lesson, module, number, moduleNumber } = entry;
  const index = catalog.lessons.indexOf(entry);
  const { prev, next } = catalog.neighbours(catalog.lessons, index);
  const toLink = (e) => (e ? { href: lessonHref(e.lesson.id), number: e.number, title: e.lesson.title } : null);

  const chip = progressChip();
  const syncChip = () => {
    const c = catalog.count(entry.itemIds, store.isDone);
    chip.update(c.done, c.total);
  };

  const examples = lesson.examples.map((example) => exampleCard(ctx, example));
  const exercises = lesson.exercises.map((item, i) =>
    createExercise(ctx, {
      id: exerciseId(lesson, i),
      item,
      badge: `Вправа ${i + 1}`,
      payload: (code) => exercisePayload(item, code),
      onPassed: (first) => {
        if (first && entry.itemIds.every(store.isDone)) ctx.toast(`Урок ${number} пройдено`);
      },
    }),
  );

  const el = h(
    'article',
    { class: 'page lesson' },
    pageHead({
      crumbs: [['Огляд', '#/'], [`Модуль ${moduleNumber} · ${module.title}`, null]],
      number,
      title: lesson.title,
      meta: entry.itemIds.length ? [chip.el] : [],
    }),
    h('section', { class: 'prose theory', html: lesson.theory }),
    examples.length ? h('h2', { class: 'section-title' }, 'Приклади') : null,
    examples.map((e) => e.el),
    exercises.length ? h('h2', { class: 'section-title' }, 'Вправи') : null,
    exercises.map((e) => e.el),
    pager(toLink(prev), toLink(next), { prevLabel: 'Попередній урок', nextLabel: 'Наступний урок', label: 'Сусідні уроки' }),
  );

  syncChip();
  const unsubscribe = store.subscribe(syncChip);
  runner.prefetch([...lesson.examples.map((e) => e.code), ...lesson.exercises.map((e) => e.solution)].join('\n'));

  return {
    el,
    title: `${number} ${lesson.title}`,
    update: (r) => r.name === 'lesson' && r.id === lesson.id,
    anchorId: (r) => (r.anchor ? `${lesson.id}/${r.anchor}` : null),
    destroy() {
      unsubscribe();
      examples.forEach((e) => e.destroy());
      exercises.forEach((e) => e.destroy());
    },
  };
}

function exampleCard(ctx, example) {
  const body = h('div', { class: 'example-body' }, example.output ? h('pre', { class: 'out' }, example.output) : null);
  const runBtn = button('play', 'Запустити', 'small ghost');
  const sandboxBtn = button('terminal', 'У пісочницю', 'small ghost');
  const el = h(
    'div',
    { class: 'example' },
    h('div', { class: 'example-code' }, highlightedBlock(example.code)),
    h(
      'div',
      { class: 'example-out' },
      h('div', { class: 'example-bar' }, h('span', { class: 'out-label' }, 'Вивід'), h('span', { class: 'card-spacer' }), runBtn, sandboxBtn),
      body,
    ),
  );

  let running = false;
  async function run() {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    renderPending(body, 'Виконую');
    const outcome = await ctx.runner.run({ code: example.code, prelude: [], check: null });
    running = false;
    runBtn.disabled = false;
    if (outcome.infraError) renderInfra(body, outcome.infraError);
    else renderResult(body, { result: outcome.result, plain: true });
  }

  runBtn.addEventListener('click', run);
  sandboxBtn.addEventListener('click', () => ctx.openInSandbox(example.code));

  // Приклади з графіками будуються, коли доходять до екрана: картинок у контенті немає.
  let observer = null;
  if (example.images && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          observer = null;
          run();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(el);
  }

  return { el, destroy: () => observer?.disconnect() };
}
