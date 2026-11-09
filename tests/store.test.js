import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from '../src/core/store.js';

const KEY = 'pytrainer:v2';

function memoryStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    saved: () => JSON.parse(m.get(KEY) ?? 'null'),
  };
}

describe('store', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('порожнє сховище дає порожній стан', () => {
    const s = createStore(memoryStorage());
    expect(s.state).toEqual({ done: {}, code: {}, theme: null, last: null });
    expect(s.isDone('l1-1/e1')).toBe(false);
    expect(s.getCode('l1-1/e1')).toBeUndefined();
  });

  it('код зберігається з затримкою, а не на кожну літеру', () => {
    const mem = memoryStorage();
    const s = createStore(mem);
    s.setCode('l1-1/e1', 'x = 1');
    expect(mem.saved()).toBeNull();
    vi.advanceTimersByTime(300);
    expect(mem.saved().code['l1-1/e1']).toBe('x = 1');
  });

  it('flush пише одразу', () => {
    const mem = memoryStorage();
    const s = createStore(mem);
    s.setCode('a', '1');
    s.flush();
    expect(mem.saved().code.a).toBe('1');
  });

  it('зарахування пишеться одразу і сповіщає підписників один раз', () => {
    const mem = memoryStorage();
    const s = createStore(mem);
    const fn = vi.fn();
    s.subscribe(fn);
    s.markDone('l1-1/e1');
    s.markDone('l1-1/e1');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(mem.saved().done['l1-1/e1']).toBe(true);
  });

  it('reset чистить прогрес і код, але лишає тему', () => {
    const s = createStore(memoryStorage());
    s.setTheme('dark');
    s.markDone('a');
    s.setCode('a', 'x');
    s.reset();
    expect(s.state).toEqual({ done: {}, code: {}, theme: 'dark', last: null });
  });

  it('експорт і імпорт повертають той самий стан', () => {
    const a = createStore(memoryStorage());
    a.markDone('p1-1/s1');
    a.setCode('p1-1/s2', 'print(1)');
    const b = createStore(memoryStorage());
    b.importJson(a.exportJson());
    expect(b.isDone('p1-1/s1')).toBe(true);
    expect(b.getCode('p1-1/s2')).toBe('print(1)');
  });

  it('імпорт чужого файлу відхиляється і не чіпає стан', () => {
    const s = createStore(memoryStorage());
    s.markDone('a');
    expect(() => s.importJson(JSON.stringify({ done: { b: true } }))).toThrow(/не файл прогресу/);
    expect(s.isDone('a')).toBe(true);
    expect(() => s.importJson('{')).toThrow(SyntaxError);
  });

  it('биті значення відкидаються при читанні', () => {
    const raw = JSON.stringify({ done: { a: true, b: 'так' }, code: { a: 'x', b: 5 }, theme: 'pink', last: 7 });
    const s = createStore(memoryStorage({ [KEY]: raw }));
    expect(s.state).toEqual({ done: { a: true }, code: { a: 'x' }, theme: null, last: null });
  });

  it('недоступне сховище не ламає застосунок', () => {
    const broken = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    const s = createStore(broken);
    expect(() => {
      s.markDone('a');
      s.setCode('a', 'x');
      s.flush();
    }).not.toThrow();
    expect(s.isDone('a')).toBe(true);
    expect(createStore(null).isDone('a')).toBe(false);
  });
});
