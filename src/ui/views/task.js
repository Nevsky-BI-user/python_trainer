// Сторінка задачі практикуму: історія, дані, кроки по одному.
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { highlightedBlock } from '../editor.js';
import { createExercise } from '../exercise.js';
import { meter, pageHead, pager, progressChip } from '../parts.js';
import { taskHref } from '../router.js';
import { stepPayload } from '../../core/evaluate.js';

export function taskView(ctx, route) {
  const { catalog, store, runner } = ctx;
  const entry = catalog.taskById.get(route.id);
  if (!entry) return null;
  const { task, level, number } = entry;
  const ids = entry.itemIds;
  const total = task.steps.length;
  const index = catalog.tasks.indexOf(entry);
  const { prev, next } = catalog.neighbours(catalog.tasks, index);
  const toLink = (e) => (e ? { href: taskHref(e.task.id), number: e.number, title: e.task.title } : null);
  const maxLevel = Math.max(5, ...catalog.levels.map((l) => l.level));

  const firstOpen = () => {
    const i = ids.findIndex((id) => !store.isDone(id));
    return i < 0 ? 0 : i;
  };
  const parseStep = (raw) => {
    const m = /^s(\d+)$/.exec(raw || '');
    const i = m ? Number(m[1]) - 1 : -1;
    return i >= 0 && i < total ? i : null;
  };

  const chip = progressChip();
  const stepper = h('ol', { class: 'stepper', 'aria-label': 'Кроки задачі' });
  const host = h('div', { class: 'step-host' });
  let stepIndex = parseStep(route.step) ?? firstOpen();
  let current = null;

  function syncProgress() {
    const c = catalog.count(ids, store.isDone);
    chip.update(c.done, c.total);
  }

  function renderStepper() {
    stepper.replaceChildren(
      ...task.steps.map((step, i) => {
        const done = store.isDone(ids[i]);
        const isCurrent = i === stepIndex;
        return h(
          'li',
          { class: 'stepper-item' },
          h(
            'a',
            {
              class: `step-chip${done ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`,
              href: taskHref(task.id, `s${i + 1}`),
              title: `Крок ${i + 1}: ${step.title}`,
              'aria-current': isCurrent ? 'step' : null,
            },
            h('span', { class: 'step-num' }, done ? icon('check') : String(i + 1)),
            h('span', { class: 'step-title' }, step.title),
          ),
        );
      }),
    );
  }

  function stepNav(i) {
    const passed = store.isDone(ids[i]);
    const back = i > 0 ? h('a', { class: 'btn ghost', href: taskHref(task.id, `s${i}`) }, icon('left'), h('span', {}, `Крок ${i}`)) : h('span');
    const forward =
      i < total - 1
        ? h('a', { class: `btn${passed ? ' primary' : ''}`, href: taskHref(task.id, `s${i + 2}`) }, h('span', {}, `Крок ${i + 2}`), icon('right'))
        : h('span');
    return h('div', { class: 'step-nav' }, back, forward);
  }

  function show(i) {
    current?.destroy();
    stepIndex = i;
    const step = task.steps[i];
    let nav = stepNav(i);
    current = createExercise(ctx, {
      id: ids[i],
      item: step,
      badge: `Крок ${i + 1} з ${total}`,
      title: step.title,
      payload: (code) => stepPayload(task, i, code),
      onPassed: (first) => {
        renderStepper();
        const fresh = stepNav(i);
        nav.replaceWith(fresh);
        nav = fresh;
        if (first && ids.every(store.isDone)) ctx.toast(`Задачу ${number} розв'язано`);
      },
    });
    host.replaceChildren(current.el, nav);
    renderStepper();
  }

  const dataPanel = task.setup
    ? h(
        'details',
        { class: 'card data-panel' },
        h('summary', { class: 'data-summary' }, icon('database'), h('span', {}, 'Дані задачі'), h('span', { class: 'card-spacer' }), icon('right', 'chev')),
        h('div', { class: 'data-code' }, highlightedBlock(task.setup)),
      )
    : null;

  const el = h(
    'article',
    { class: 'page task' },
    pageHead({
      crumbs: [['Огляд', '#/'], [`Рівень ${level.level} · ${level.title}`, null]],
      number,
      title: task.title,
      meta: [meter(level.level, maxLevel), chip.el],
    }),
    task.skills?.length ? h('ul', { class: 'skills', 'aria-label': 'Навички' }, task.skills.map((s) => h('li', { class: 'skill' }, s))) : null,
    h('section', { class: 'prose story', html: task.story }),
    dataPanel,
    stepper,
    host,
    pager(toLink(prev), toLink(next), { prevLabel: 'Попередня задача', nextLabel: 'Наступна задача', label: 'Сусідні задачі' }),
  );

  syncProgress();
  show(stepIndex);
  const unsubscribe = store.subscribe(syncProgress);
  runner.prefetch([task.setup, ...task.steps.map((s) => s.solution)].filter(Boolean).join('\n'));

  return {
    el,
    title: `${number} ${task.title}`,
    update(r) {
      if (r.name !== 'task' || r.id !== task.id) return false;
      const i = parseStep(r.step) ?? stepIndex;
      if (i !== stepIndex) {
        show(i);
        const top = stepper.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) stepper.scrollIntoView({ block: 'start' });
      }
      return true;
    },
    destroy() {
      unsubscribe();
      current?.destroy();
    },
  };
}
