// Панель результату запуску: вердикт, вивід, помилка з поясненням, порівняння, графіки.
import { h } from './dom.js';
import { icon } from './icons.js';
import { explainError } from '../core/errors.js';
import { normalizeOutput } from '../core/evaluate.js';

/** Порожня панель-заглушка під час виконання. */
export function renderPending(target, text) {
  target.replaceChildren(h('div', { class: 'result-pending' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), text));
}

/** Збій інфраструктури: Python не завантажився чи воркер упав. */
export function renderInfra(target, message) {
  target.replaceChildren(
    h('div', { class: 'verdict fail' }, icon('close'), h('span', {}, message)),
  );
}

/**
 * result: відповідь harness; verdict: результат judge або null (простий запуск);
 * expected: очікуваний вивід вправи (для порівняння при розбіжності);
 * plain: без підпису «Вивід» (у прикладах підпис уже стоїть над блоком).
 */
export function renderResult(target, { result, verdict = null, expected = null, plain = false }) {
  const parts = [];

  if (verdict) {
    if (verdict.passed) {
      parts.push(h('div', { class: 'verdict ok' }, icon('check'), h('span', {}, 'Зараховано')));
    } else if (verdict.kind !== 'error') {
      parts.push(h('div', { class: 'verdict fail' }, icon('close'), h('span', {}, verdict.message)));
    }
  }

  if (result.error) {
    parts.push(errorBlock(result));
  }

  const hasImages = Boolean(result.images && result.images.length);
  const showDiff = verdict && verdict.mismatch && expected !== null && expected !== undefined;
  if (showDiff) {
    parts.push(diffBlock(result.stdout, expected, verdict.line));
  } else if (result.stdout || (!result.error && !(plain && hasImages))) {
    parts.push(outputBlock(result.stdout, result.truncated, plain));
  }

  if (result.stderr && result.stderr.trim()) {
    parts.push(h('div', { class: 'out-block warn' }, h('div', { class: 'out-label' }, 'Попередження'), h('pre', { class: 'out' }, result.stderr.trimEnd())));
  }

  if (hasImages) {
    parts.push(figuresBlock(result.images));
  }

  target.replaceChildren(...parts);
}

function outputBlock(stdout, truncated, plain) {
  const text = normalizeOutput(stdout);
  const body = text ? h('pre', { class: 'out' }, text) : h('pre', { class: 'out empty' }, 'Порожньо');
  if (plain) return h('div', { class: 'out-plain' }, body, truncated ? h('span', { class: 'out-note' }, 'обрізано') : null);
  return h(
    'div',
    { class: 'out-block' },
    h('div', { class: 'out-label' }, 'Вивід', truncated ? h('span', { class: 'out-note' }, 'обрізано') : null),
    body,
  );
}

function errorBlock(result) {
  const explanation = explainError(result.errorType);
  return h(
    'div',
    { class: 'out-block error' },
    h('div', { class: 'out-label' }, result.errorType || 'Помилка', result.errorLine ? h('span', { class: 'out-note' }, `рядок ${result.errorLine}`) : null),
    h('pre', { class: 'out' }, result.error.trimEnd()),
    explanation ? h('p', { class: 'explain' }, explanation) : null,
  );
}

function diffBlock(actual, expected, line) {
  const column = (label, text) => {
    const lines = normalizeOutput(text).split('\n');
    return h(
      'div',
      { class: 'diff-col' },
      h('div', { class: 'out-label' }, label),
      h(
        'pre',
        { class: 'out diff-lines' },
        lines.map((content, i) =>
          h('span', { class: `diff-line${i + 1 === line ? ' mismatch' : ''}` }, h('span', { class: 'ln' }, String(i + 1)), content || ' '),
        ),
      ),
    );
  };
  return h('div', { class: 'diff' }, column('Твій вивід', actual), column('Очікувалось', expected));
}

function figuresBlock(images) {
  return h(
    'div',
    { class: 'figures' },
    images.map((b64, i) => h('img', { class: 'figure', src: `data:image/png;base64,${b64}`, alt: `Графік ${i + 1}`, loading: 'lazy' })),
  );
}
