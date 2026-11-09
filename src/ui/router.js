// Маршрути на хеші: працюють і з dev-сервера, і з будь-якої теки після збірки.
//   #/                      огляд
//   #/lesson/<id>[/eN]      урок, необов'язково з прокруткою до вправи
//   #/task/<id>[/sN]        задача практикуму на кроці N
//   #/sandbox               пісочниця

export function parseHash(hash) {
  const raw = String(hash || '').replace(/^#\/?/, '');
  const parts = raw
    .split('/')
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
  if (!parts.length) return { name: 'home' };
  const [head, id, sub] = parts;
  if (head === 'lesson' && id && parts.length <= 3) return { name: 'lesson', id, anchor: sub || null };
  if (head === 'task' && id && parts.length <= 3) return { name: 'task', id, step: sub || null };
  if (head === 'sandbox' && parts.length === 1) return { name: 'sandbox' };
  return { name: 'notfound' };
}

export const lessonHref = (id, anchor = null) => `#/lesson/${id}${anchor ? `/${anchor}` : ''}`;
export const taskHref = (id, step = null) => `#/task/${id}${step ? `/${step}` : ''}`;

/** Посилання на результат catalog.nextUnsolved: { route, anchor: 'l1-1/e2' } → '#/lesson/l1-1/e2'. */
export function nextHref(next) {
  if (!next) return null;
  const tail = next.anchor.slice(next.anchor.lastIndexOf('/') + 1);
  return `${next.route}/${tail}`;
}
