// Дрібні спільні частини сторінок: кнопки, шапка, смужки прогресу, гортання.
import { h } from './dom.js';
import { icon } from './icons.js';

export function button(iconName, label, cls = '', attrs = {}) {
  return h(
    'button',
    { class: `btn ${cls}`.trim(), type: 'button', ...attrs },
    iconName ? icon(iconName) : null,
    label ? h('span', {}, label) : null,
  );
}

export function progressBar(done, total, label) {
  const pct = total ? (done / total) * 100 : 0;
  return h(
    'div',
    { class: 'bar', role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done },
    h('span', { class: 'bar-fill', style: `width:${pct}%` }),
  );
}

/** Чип «2/5» з кільцем, що оновлюється на місці. */
export function progressChip() {
  const count = h('span', { class: 'chip-count' });
  const el = h('span', { class: 'chip progress-chip' }, count);
  return {
    el,
    update(done, total) {
      count.textContent = `${done}/${total}`;
      el.classList.toggle('is-full', total > 0 && done === total);
    },
  };
}

/** Сходинки складності: max стовпчиків, перші level зафарбовані. */
export function meter(level, max = 5) {
  return h(
    'span',
    { class: 'meter', role: 'img', 'aria-label': `Складність ${level} з ${max}` },
    Array.from({ length: max }, (_, i) => h('span', { class: `meter-bar${i < level ? ' on' : ''}`, style: `height:${6 + i * 3}px` })),
  );
}

/** crumbs: [[текст, href|null], ...] */
export function pageHead({ crumbs = [], number = null, title, meta = [] }) {
  return h(
    'header',
    { class: 'page-head' },
    crumbs.length
      ? h(
          'nav',
          { class: 'crumbs', 'aria-label': 'Шлях' },
          crumbs.map(([text, href], i) => [i ? h('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '/') : null, href ? h('a', { href }, text) : h('span', {}, text)]),
        )
      : null,
    h('h1', { class: 'page-title' }, number ? h('span', { class: 'page-num' }, number) : null, title),
    meta.length ? h('div', { class: 'page-meta' }, meta) : null,
  );
}

/** Гортання між сусідами: prev/next = { href, number, title } або null. */
export function pager(prev, next, { prevLabel, nextLabel, label }) {
  const link = (entry, dir) => {
    if (!entry) return h('span', { class: 'pager-empty' });
    return h(
      'a',
      { class: `pager-link ${dir}`, href: entry.href },
      dir === 'prev' ? icon('left') : null,
      h(
        'span',
        { class: 'pager-text' },
        h('span', { class: 'pager-kicker' }, dir === 'prev' ? prevLabel : nextLabel),
        h('span', { class: 'pager-title' }, h('span', { class: 'pager-num' }, entry.number), entry.title),
      ),
      dir === 'next' ? icon('right') : null,
    );
  };
  return h('nav', { class: 'pager', 'aria-label': label }, link(prev, 'prev'), link(next, 'next'));
}
