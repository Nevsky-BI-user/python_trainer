// Спільна логіка оцінювання: нею користуються і застосунок, і перевірка контенту,
// тому «зараховано» в браузері означає те саме, що й у scripts/verify-content.mjs.

/** Нормалізує вивід: переноси рядків, пробіли в кінці рядків, порожні рядки в кінці. */
export function normalizeOutput(text) {
  return String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

/**
 * Порівнює вивід учня з очікуваним.
 * Повертає { equal, line } де line: номер першого розбіжного рядка (з 1) або null.
 */
export function compareOutput(actual, expected) {
  const a = normalizeOutput(actual).split('\n');
  const e = normalizeOutput(expected).split('\n');
  const n = Math.max(a.length, e.length);
  for (let i = 0; i < n; i += 1) {
    if (a[i] !== e[i]) return { equal: false, line: i + 1 };
  }
  return { equal: true, line: null };
}

/** Корисне навантаження для звичайної вправи уроку. */
export function exercisePayload(exercise, code) {
  return { code, prelude: [], check: exercise.check || null };
}

/**
 * Корисне навантаження для кроку задачі практикуму: дані задачі і еталонні
 * розв'язки попередніх кроків виконуються перед кодом учня (вивід приховано),
 * тож стан даних завжди такий, як описано в умові кроку.
 */
export function stepPayload(task, stepIndex, code) {
  const prelude = [];
  if (task.setup) prelude.push(task.setup);
  for (let i = 0; i < stepIndex; i += 1) prelude.push(task.steps[i].solution);
  return { code, prelude, check: task.steps[stepIndex].check || null };
}

/**
 * Вердикт за результатом запуску.
 * item: вправа або крок (expected та/або check).
 * result: відповідь harness.run.
 */
export function judge(item, result) {
  if (result.error) {
    return { passed: false, kind: 'error', message: result.error };
  }
  if (item.expected !== undefined && item.expected !== null) {
    const cmp = compareOutput(result.stdout, item.expected);
    if (!cmp.equal) {
      return { passed: false, kind: 'output', line: cmp.line, message: 'Вивід не збігається з очікуваним' };
    }
  }
  if (item.check) {
    if (!result.check) {
      return { passed: false, kind: 'check', message: 'Перевірка не виконалась' };
    }
    if (!result.check.ok) {
      return { passed: false, kind: 'check', message: result.check.message };
    }
  }
  return { passed: true, kind: 'ok', message: '' };
}
