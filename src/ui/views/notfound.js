import { h } from '../dom.js';
import { icon } from '../icons.js';

export function notFoundView() {
  const el = h(
    'div',
    { class: 'page empty-state' },
    h('p', { class: 'eyebrow' }, '404'),
    h('h1', { class: 'page-title' }, 'Такої сторінки немає'),
    h('a', { class: 'btn primary', href: '#/' }, icon('grid'), h('span', {}, 'До огляду')),
  );
  return { el, title: 'Сторінку не знайдено' };
}
