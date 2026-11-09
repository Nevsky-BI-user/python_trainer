// Маленький помічник для створення DOM без шаблонних рядків з даними учня.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'html') el.innerHTML = value; // лише довірений контент з репозиторію
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

export function pluralUk(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Кільце прогресу: SVG з часткою виконаного. */
export function progressRing(done, total, size = 18) {
  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', `ring${frac === 1 ? ' ring-full' : ''}`);
  svg.setAttribute('aria-hidden', 'true');
  const bg = document.createElementNS(ns, 'circle');
  bg.setAttribute('cx', size / 2);
  bg.setAttribute('cy', size / 2);
  bg.setAttribute('r', r);
  bg.setAttribute('class', 'ring-bg');
  const fg = document.createElementNS(ns, 'circle');
  fg.setAttribute('cx', size / 2);
  fg.setAttribute('cy', size / 2);
  fg.setAttribute('r', r);
  fg.setAttribute('class', 'ring-fg');
  fg.setAttribute('stroke-dasharray', `${c * frac} ${c}`);
  fg.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
  // Нульова дуга з круглим кінцем малює крапку, тому без прогресу лише фон.
  svg.append(bg);
  if (frac > 0) svg.append(fg);
  if (frac === 1) {
    const tick = document.createElementNS(ns, 'path');
    const s = size;
    tick.setAttribute('d', `M${s * 0.3} ${s * 0.52} L${s * 0.45} ${s * 0.66} L${s * 0.72} ${s * 0.36}`);
    tick.setAttribute('class', 'ring-tick');
    svg.appendChild(tick);
  }
  return svg;
}
