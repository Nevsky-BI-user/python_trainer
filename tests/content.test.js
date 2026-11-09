import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { modules, levels } from '../src/content/index.js';
import { loadContent } from '../scripts/lib/load-content.mjs';
import { validateContent } from '../src/core/schema.js';
import { buildCatalog } from '../src/core/catalog.js';
import { explainError } from '../src/core/errors.js';
import { PYODIDE_VERSION } from '../src/runtime/version.js';

const ids = ({ modules: m, levels: l }) => ({
  modules: m.map((x) => [x.id, x.lessons.map((y) => y.id)]),
  levels: l.map((x) => [x.id, x.tasks.map((y) => y.id)]),
});

describe('контент', () => {
  it('застосунок (import.meta.glob) і перевірка в Node бачать той самий контент у тому самому порядку', async () => {
    expect(ids(await loadContent())).toEqual(ids({ modules, levels }));
  });

  it('схема чиста: поля, унікальні id, без довгих і коротких тире', () => {
    expect(validateContent({ modules, levels })).toEqual([]);
  });

  it('ідентифікатори вправ і кроків не перетинаються між уроками і задачами', () => {
    const c = buildCatalog({ modules, levels });
    const all = [...c.lessons, ...c.tasks].flatMap((e) => e.itemIds);
    expect(new Set(all).size).toBe(all.length);
  });

  it('рівні йдуть за зростанням складності', () => {
    const order = levels.map((l) => l.level);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('підказки задач: звичайний текст без HTML-сутностей', () => {
    const hints = [...modules.flatMap((m) => m.lessons.flatMap((l) => l.exercises)), ...levels.flatMap((l) => l.tasks.flatMap((t) => t.steps))]
      .map((x) => x.hint)
      .filter(Boolean);
    for (const h of hints) expect(h).not.toMatch(/&[a-z]+;|<\/?[a-z]+[\s>]/);
  });
});

describe('середовище', () => {
  it('версія Pyodide у застосунку збігається з тією, якою перевіряється контент', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(pkg.devDependencies.pyodide).toBe(PYODIDE_VERSION);
  });

  it('пояснення типових помилок є, невідомий тип дає null', () => {
    for (const t of ['SyntaxError', 'NameError', 'KeyError', 'TimeoutError']) expect(explainError(t)).toBeTruthy();
    expect(explainError('WeirdError')).toBeNull();
  });
});
