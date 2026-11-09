// Пісочниця: вільний код без перевірки, зберігається між сесіями.
import { h } from '../dom.js';
import { createEditor } from '../editor.js';
import { renderResult, renderPending, renderInfra } from '../result.js';
import { button, pageHead } from '../parts.js';

export const SANDBOX_ID = 'sandbox';

export const SANDBOX_DEFAULT = `import pandas as pd

sales = pd.DataFrame({
    "місто": ["Київ", "Львів", "Одеса", "Дніпро"],
    "виручка": [182_400, 96_300, 121_750, 88_900],
})

print(sales.sort_values("виручка", ascending=False))
print("Разом:", sales["виручка"].sum())
`;

export function sandboxView(ctx) {
  const { store, runner } = ctx;
  const host = h('div', { class: 'editor-host' });
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const runBtn = button('play', 'Запустити', 'primary', { title: 'Запустити (Ctrl+Enter)', 'aria-keyshortcuts': 'Control+Enter' });
  const resetBtn = button('reset', 'Початковий код', 'ghost');

  const editor = createEditor(host, {
    doc: store.getCode(SANDBOX_ID) ?? SANDBOX_DEFAULT,
    label: 'Пісочниця: редактор коду',
    onChange: (code) => {
      if (code === SANDBOX_DEFAULT) store.clearCode(SANDBOX_ID);
      else store.setCode(SANDBOX_ID, code);
    },
    onRun: run,
    onCheck: run,
  });

  let busy = false;
  async function run() {
    if (busy) return;
    busy = true;
    runBtn.disabled = true;
    editor.markError(null);
    const status = runner.status.state;
    renderPending(result, status === 'ready' || status === 'running' ? 'Виконую' : 'Завантажую Python, перший запуск довший');
    const outcome = await runner.run({ code: editor.getValue(), prelude: [], check: null });
    busy = false;
    runBtn.disabled = false;
    if (outcome.infraError) {
      renderInfra(result, outcome.infraError);
      return;
    }
    if (outcome.result.errorLine) editor.markError(outcome.result.errorLine);
    renderResult(result, { result: outcome.result });
  }

  runBtn.addEventListener('click', run);
  resetBtn.addEventListener('click', async () => {
    if (editor.getValue() !== SANDBOX_DEFAULT && !(await ctx.confirm('Повернути початковий код пісочниці? Поточний код буде замінено.', 'Повернути'))) return;
    editor.setValue(SANDBOX_DEFAULT);
    store.clearCode(SANDBOX_ID);
    result.replaceChildren();
  });

  const el = h(
    'article',
    { class: 'page sandbox' },
    pageHead({ crumbs: [['Огляд', '#/']], title: 'Пісочниця' }),
    h(
      'section',
      { class: 'card exercise' },
      h('div', { class: 'editor-shell tall' }, host),
      h('div', { class: 'actions' }, runBtn, h('span', { class: 'actions-spacer' }), resetBtn),
      result,
    ),
  );

  runner.prefetch(editor.getValue());
  return { el, title: 'Пісочниця', destroy: () => editor.view.destroy() };
}
