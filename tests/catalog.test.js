import { describe, expect, it } from 'vitest';
import { buildCatalog, exerciseId, stepId } from '../src/core/catalog.js';
import { nextHref, parseHash } from '../src/ui/router.js';

const ex = (n) => Array.from({ length: n }, () => ({ task: 't', starter: '', solution: 's', expected: '1' }));
const step = (n) => Array.from({ length: n }, () => ({ title: 't', task: 't', starter: '', solution: 's', expected: '1', hint: 'h' }));

const content = {
  modules: [
    { id: 'm1', title: 'Основи', lessons: [{ id: 'l1-1', exercises: ex(2) }, { id: 'l1-2', exercises: ex(1) }] },
    { id: 'm2', title: 'Колекції', lessons: [{ id: 'l2-1', exercises: ex(3) }] },
  ],
  levels: [{ id: 'p1', level: 1, title: 'Розминка', tasks: [{ id: 'p1-1', steps: step(2) }, { id: 'p1-2', steps: step(3) }] }],
};

describe('catalog', () => {
  const c = buildCatalog(content);

  it('ідентифікатори вправ і кроків', () => {
    expect(exerciseId({ id: 'l1-1' }, 0)).toBe('l1-1/e1');
    expect(stepId({ id: 'p1-2' }, 2)).toBe('p1-2/s3');
    expect(c.lessonById.get('l2-1').itemIds).toEqual(['l2-1/e1', 'l2-1/e2', 'l2-1/e3']);
  });

  it('нумерація: модуль.урок і рівень.задача', () => {
    expect(c.lessons.map((e) => e.number)).toEqual(['1.1', '1.2', '2.1']);
    expect(c.tasks.map((e) => e.number)).toEqual(['1.1', '1.2']);
    expect(c.lessonById.get('l2-1').moduleNumber).toBe(2);
  });

  it('підсумки дорівнюють кількості вправ і кроків', () => {
    const none = () => false;
    expect(c.totals(none)).toEqual({ exercises: { done: 0, total: 6 }, steps: { done: 0, total: 5 } });
    const some = (id) => ['l1-1/e1', 'p1-2/s3'].includes(id);
    expect(c.totals(some)).toEqual({ exercises: { done: 1, total: 6 }, steps: { done: 1, total: 5 } });
  });

  it('сусіди на краях порожні', () => {
    expect(c.neighbours(c.lessons, 0)).toEqual({ prev: null, next: c.lessons[1] });
    expect(c.neighbours(c.lessons, 2).next).toBeNull();
  });

  it('продовжити: спершу уроки по порядку, потім задачі, наприкінці нічого', () => {
    expect(c.nextUnsolved(() => false)).toEqual({ route: '#/lesson/l1-1', anchor: 'l1-1/e1' });
    const lessonsDone = (id) => id.startsWith('l');
    expect(c.nextUnsolved(lessonsDone)).toEqual({ route: '#/task/p1-1', anchor: 'p1-1/s1' });
    expect(c.nextUnsolved(() => true)).toBeNull();
    expect(nextHref(c.nextUnsolved((id) => id === 'l1-1/e1'))).toBe('#/lesson/l1-1/e2');
  });
});

describe('router', () => {
  it('розбирає маршрути', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#/')).toEqual({ name: 'home' });
    expect(parseHash('#/lesson/l1-1')).toEqual({ name: 'lesson', id: 'l1-1', anchor: null });
    expect(parseHash('#/lesson/l1-1/e2')).toEqual({ name: 'lesson', id: 'l1-1', anchor: 'e2' });
    expect(parseHash('#/task/p4-2/s3')).toEqual({ name: 'task', id: 'p4-2', step: 's3' });
    expect(parseHash('#/sandbox')).toEqual({ name: 'sandbox' });
  });
  it('невідоме і зайві сегменти ведуть на 404', () => {
    expect(parseHash('#/nope').name).toBe('notfound');
    expect(parseHash('#/sandbox/x').name).toBe('notfound');
    expect(parseHash('#/lesson/l1-1/e1/zzz').name).toBe('notfound');
    expect(parseHash('#/lesson/%E0%A4%A').name).toBe('lesson');
  });
});
