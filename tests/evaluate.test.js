import { describe, expect, it } from 'vitest';
import { compareOutput, exercisePayload, judge, normalizeOutput, stepPayload } from '../src/core/evaluate.js';

const ok = (stdout, check = null) => ({ stdout, stderr: '', error: null, errorType: null, errorLine: null, check, images: [], truncated: false });

describe('normalizeOutput', () => {
  it('прибирає \\r, пробіли в кінці рядків і порожні рядки в кінці', () => {
    expect(normalizeOutput('a  \r\nb\t\n\n\n')).toBe('a\nb');
  });
  it('не чіпає пробіли на початку рядка', () => {
    expect(normalizeOutput('  x\n    y')).toBe('  x\n    y');
  });
  it('null і undefined дають порожній рядок', () => {
    expect(normalizeOutput(null)).toBe('');
    expect(normalizeOutput(undefined)).toBe('');
  });
});

describe('compareOutput', () => {
  it('однаковий вивід з різними хвостами рівний', () => {
    expect(compareOutput('1\n2  \n', '1\n2')).toEqual({ equal: true, line: null });
  });
  it('повертає номер першого розбіжного рядка', () => {
    expect(compareOutput('1\n2\n3', '1\n5\n3')).toEqual({ equal: false, line: 2 });
  });
  it('зайвий або відсутній рядок теж розбіжність', () => {
    expect(compareOutput('1\n2\n3', '1\n2')).toEqual({ equal: false, line: 3 });
    expect(compareOutput('1', '1\n2')).toEqual({ equal: false, line: 2 });
  });
});

describe('payloads', () => {
  it('вправа уроку: без прелюдії, з перевіркою вправи', () => {
    expect(exercisePayload({ check: 'expect(True, "")' }, 'x = 1')).toEqual({ code: 'x = 1', prelude: [], check: 'expect(True, "")' });
    expect(exercisePayload({}, 'x = 1').check).toBeNull();
  });
  it('крок задачі: setup і еталони попередніх кроків по порядку', () => {
    const task = {
      setup: 'S',
      steps: [
        { solution: 'A', check: 'c1' },
        { solution: 'B', check: 'c2' },
        { solution: 'C' },
      ],
    };
    expect(stepPayload(task, 0, 'mine')).toEqual({ code: 'mine', prelude: ['S'], check: 'c1' });
    expect(stepPayload(task, 2, 'mine')).toEqual({ code: 'mine', prelude: ['S', 'A', 'B'], check: null });
  });
  it('задача без setup не додає порожній блок', () => {
    expect(stepPayload({ steps: [{ solution: 'A' }, { solution: 'B' }] }, 1, 'x').prelude).toEqual(['A']);
  });
});

describe('judge', () => {
  it('помилка виконання: не зараховано, повідомлення з traceback', () => {
    const v = judge({ expected: '1' }, { ...ok(''), error: 'NameError: x', errorType: 'NameError' });
    expect(v).toMatchObject({ passed: false, kind: 'error', message: 'NameError: x', mismatch: false });
  });
  it('лише expected: розбіжність виводу з номером рядка', () => {
    const v = judge({ expected: 'a\nb' }, ok('a\nc'));
    expect(v).toMatchObject({ passed: false, kind: 'output', mismatch: true, line: 2 });
  });
  it('лише check: повідомлення перевірки', () => {
    const v = judge({ check: '...' }, ok('', { ok: false, message: 'Колонка price має бути числовою' }));
    expect(v).toMatchObject({ passed: false, kind: 'check', message: 'Колонка price має бути числовою', mismatch: false });
  });
  it('обидва збої: конкретне повідомлення check, розбіжність лишається в mismatch', () => {
    const v = judge({ expected: '10', check: '...' }, ok('11', { ok: false, message: 'Сума має бути 10' }));
    expect(v).toMatchObject({ passed: false, kind: 'check', message: 'Сума має бути 10', mismatch: true, line: 1 });
  });
  it('вивід правильний, а перевірка не пройшла: не зараховано', () => {
    const v = judge({ expected: '10', check: '...' }, ok('10', { ok: false, message: 'df не змінено' }));
    expect(v).toMatchObject({ passed: false, kind: 'check', mismatch: false });
  });
  it('перевірка не виконалась: не зараховано', () => {
    expect(judge({ check: '...' }, ok('')).passed).toBe(false);
  });
  it('усе збіглося: зараховано', () => {
    expect(judge({ expected: '10', check: '...' }, ok('10\n', { ok: true, message: '' }))).toMatchObject({ passed: true, kind: 'ok' });
  });
});
