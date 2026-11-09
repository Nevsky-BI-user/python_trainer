// Картка вправи або кроку: умова, редактор, дії, підказка, розв'язок, результат.
import { h } from './dom.js';
import { icon } from './icons.js';
import { createEditor, highlightedBlock } from './editor.js';
import { renderResult, renderPending, renderInfra } from './result.js';
import { judge } from '../core/evaluate.js';

/**
 * ctx: { store, runner }
 * opts: {
 *   id: ідентифікатор для прогресу і збереженого коду,
 *   item: вправа чи крок ({ task, starter, solution, expected, check, hint }),
 *   badge: підпис картки («Вправа 2», «Крок 3 з 5»),
 *   title: необов'язкова назва (для кроків),
 *   payload: (code) => корисне навантаження для запуску,
 *   onPassed: () => void (після зарахування),
 * }
 */
export function createExercise(ctx, { id, item, badge, title = null, payload, onPassed }) {
  const { store, runner } = ctx;
  const done = () => store.isDone(id);

  const state = h('span', { class: 'card-state' });
  const syncState = () => {
    state.replaceChildren(...(done() ? [icon('check'), 'Зараховано'] : []));
    card.classList.toggle('is-done', done());
  };

  const host = h('div', { class: 'editor-host' });
  const result = h('div', { class: 'result', 'aria-live': 'polite' });

  const runBtn = h('button', { class: 'btn', type: 'button', title: 'Запустити (Ctrl+Enter)', 'aria-keyshortcuts': 'Control+Enter' }, icon('play'), h('span', {}, 'Запустити'));
  const checkBtn = h('button', { class: 'btn primary', type: 'button', title: 'Перевірити (Ctrl+Shift+Enter)', 'aria-keyshortcuts': 'Control+Shift+Enter' }, icon('check'), h('span', {}, 'Перевірити'));
  const hintBtn = item.hint ? h('button', { class: 'btn ghost', type: 'button', 'aria-expanded': 'false' }, icon('bulb'), h('span', {}, 'Підказка')) : null;
  const solBtn = h('button', { class: 'btn ghost', type: 'button', 'aria-expanded': 'false' }, icon('eye'), h('span', {}, 'Розв\'язок'));
  const resetBtn = h('button', { class: 'btn ghost icon-only', type: 'button', title: 'Повернути початковий код', 'aria-label': 'Повернути початковий код' }, icon('reset'));

  // Підказка: звичайний текст (може містити «<» у порівняннях), тому не HTML.
  const hintBox = item.hint ? h('div', { class: 'reveal hint', hidden: true }, icon('bulb'), h('div', { class: 'hint-text' }, item.hint)) : null;
  const insertBtn = h('button', { class: 'btn ghost small', type: 'button' }, icon('copy'), h('span', {}, 'Вставити в редактор'));
  const solBox = h('div', { class: 'reveal solution', hidden: true }, h('div', { class: 'reveal-head' }, h('span', { class: 'out-label' }, 'Еталонний розв\'язок'), insertBtn), highlightedBlock(item.solution));

  const card = h(
    'section',
    { class: 'card exercise', id },
    h('header', { class: 'card-head' }, h('span', { class: 'badge' }, badge), title ? h('h3', { class: 'card-title' }, title) : null, h('span', { class: 'card-spacer' }), state),
    h('div', { class: 'prose task-text', html: item.task }),
    h('div', { class: 'editor-shell' }, host),
    h('div', { class: 'actions' }, runBtn, checkBtn, h('span', { class: 'actions-spacer' }), hintBtn, solBtn, resetBtn),
    hintBox,
    solBox,
    result,
  );

  const editor = createEditor(host, {
    doc: store.getCode(id) ?? item.starter,
    label: `${badge}: редактор коду`,
    onChange: (code) => {
      if (code === item.starter) store.clearCode(id);
      else store.setCode(id, code);
    },
    onRun: () => execute('run'),
    onCheck: () => execute('check'),
  });

  let busy = false;
  async function execute(mode) {
    if (busy) return;
    busy = true;
    card.classList.add('is-busy');
    runBtn.disabled = checkBtn.disabled = true;
    editor.markError(null);
    const status = runner.status.state;
    renderPending(result, status === 'ready' || status === 'running' ? 'Виконую' : 'Завантажую Python, перший запуск довший');

    const code = editor.getValue();
    const base = payload(code);
    const outcome = await runner.run(mode === 'check' ? base : { ...base, check: null });

    busy = false;
    card.classList.remove('is-busy');
    runBtn.disabled = checkBtn.disabled = false;

    if (outcome.infraError) {
      renderInfra(result, outcome.infraError);
      return;
    }
    const res = outcome.result;
    if (res.errorLine) editor.markError(res.errorLine);
    if (mode === 'check') {
      const verdict = judge(item, res);
      renderResult(result, { result: res, verdict, expected: item.expected });
      if (verdict.passed) {
        const first = !done();
        store.markDone(id);
        syncState();
        onPassed?.(first);
      }
    } else {
      renderResult(result, { result: res });
    }
  }

  const toggle = (btn, box) => {
    const open = box.hidden;
    box.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('is-on', open);
  };

  runBtn.addEventListener('click', () => execute('run'));
  checkBtn.addEventListener('click', () => execute('check'));
  hintBtn?.addEventListener('click', () => toggle(hintBtn, hintBox));
  solBtn.addEventListener('click', () => toggle(solBtn, solBox));
  insertBtn.addEventListener('click', () => {
    editor.setValue(item.solution);
    editor.focus();
  });
  resetBtn.addEventListener('click', () => {
    editor.setValue(item.starter);
    store.clearCode(id);
    result.replaceChildren();
    editor.focus();
  });

  syncState();
  return { el: card, editor, destroy: () => editor.view.destroy() };
}
