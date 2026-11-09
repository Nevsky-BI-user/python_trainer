"""Ворота розкладки і смоук інтерфейсу за рендером.

    python scripts/check_layout.py
    python scripts/check_layout.py --only lesson --widths 1440 --no-python

Збирає застосунок, піднімає vite preview, відкриває сторінки в Chromium без
голови (звук вимкнено, рух зменшено) і перевіряє на кожній ширині:
  * немає горизонтальної прокрутки, вміст не виходить за колонку сторінки;
  * блоки однієї колонки мають спільні межі, блоки одного ряду однаковий top і висоту;
  * колонки в стосах рядків (бічна панель, задачі рівнів) мають спільні межі;
  * сталі кнопки не зсуваються між станами (підказка, розв'язок, крок, тема);
  * лічильники на екрані дорівнюють кількостям, порахованим з контенту окремо.
Потім на одній ширині справжній Python: вправа, крок задачі з еталонами
попередніх, графік matplotlib, пісочниця. Знімки сторінок: .local/layout/.
Код виходу 1, якщо знайдено хоч одну розбіжність.
"""

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
VITE = ROOT / 'node_modules' / 'vite' / 'bin' / 'vite.js'
SHOTS = ROOT / '.local' / 'layout'
TOL = 1.0
# Найбільший проміжок між текстом найдовшої назви і числом: проміжок сітки 10 px плюс запас на ch і округлення.
SLACK = 24
PAGES = ('home', 'lesson', 'task', 'sandbox', 'notfound', 'mobile', 'canary', 'python')
PY_TIMEOUT = 240_000

# Заміри в сторінці. Кожна функція повертає { checks, problems }.
PROBE = r"""
(() => {
  const T = 1;
  const R = (el) => el.getBoundingClientRect();
  const px = (v) => parseFloat(v) || 0;
  const f = (n) => Math.round(n * 10) / 10;
  const shown = (el) => {
    if (!el || el.hidden) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = R(el);
    return r.width > 0 && r.height > 0;
  };
  const inFlow = (el) => {
    const cs = getComputedStyle(el);
    return cs.position !== 'absolute' && cs.position !== 'fixed' && !cs.display.startsWith('inline');
  };
  const label = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean) : [];
    if (cls.length) s += '.' + cls.join('.');
    return s;
  };
  const contentBox = (el) => {
    const r = R(el);
    const cs = getComputedStyle(el);
    return {
      left: r.left + px(cs.borderLeftWidth) + px(cs.paddingLeft),
      right: r.right - px(cs.borderRightWidth) - px(cs.paddingRight),
    };
  };
  const spread = (vs) => Math.max(...vs) - Math.min(...vs);
  const textRange = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range;
  };
  const textRect = (el) => textRange(el).getBoundingClientRect();
  const wraps = (el) => new Set([...textRange(el).getClientRects()].map((q) => Math.round(q.top))).size > 1;
  const groupRows = (items) => {
    const rows = [];
    for (const el of items) {
      const r = R(el);
      const row = rows.find((g) => r.top < g.bottom - T && r.bottom > g.top + T);
      if (row) {
        row.items.push(el);
        row.top = Math.min(row.top, r.top);
        row.bottom = Math.max(row.bottom, r.bottom);
      } else rows.push({ items: [el], top: r.top, bottom: r.bottom });
    }
    rows.forEach((g) => g.items.sort((a, b) => R(a).left - R(b).left));
    return rows.sort((a, b) => a.top - b.top);
  };
  // Лише власна прокрутка виправдовує вихід за край; overflow: hidden обрізає вміст і теж дефект.
  const scrolls = (el, stop) => {
    for (let p = el.parentElement; p && p !== stop; p = p.parentElement) {
      if (['auto', 'scroll'].includes(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };

  window.__probe = {
    overflow() {
      const iw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const problems = [];
      if (sw > iw + T) {
        const culprits = [...document.querySelectorAll('body *')]
          .filter((el) => shown(el) && R(el).right > iw + T && !scrolls(el, document.body))
          .slice(0, 6)
          .map(label);
        problems.push(`горизонтальна прокрутка: документ ${sw}px при вікні ${iw}px; за краєм: ${culprits.join(', ')}`);
      }
      let checks = 1;
      const page = document.querySelector('.main > .page');
      if (page) {
        const pr = R(page);
        const out = [...page.querySelectorAll('*')].filter((el) => {
          if (!shown(el) || scrolls(el, page)) return false;
          const r = R(el);
          return r.right > pr.right + T || r.left < pr.left - T;
        });
        checks += 1;
        if (out.length) problems.push(`вміст виходить за колонку сторінки: ${out.slice(0, 6).map(label).join(', ')}`);
      }
      return { checks, problems };
    },

    // Прямі нащадки в потоці мають спільний лівий (і правий) край із вмістом контейнера.
    edges(sel, mode) {
      const problems = [];
      let checks = 0;
      for (const box of document.querySelectorAll(sel)) {
        if (!shown(box)) continue;
        const cb = contentBox(box);
        for (const c of box.children) {
          if (!shown(c) || !inFlow(c)) continue;
          const r = R(c);
          checks += 1;
          if (Math.abs(r.left - cb.left) > T) problems.push(`${label(box)} > ${label(c)}: лівий край зсунуто на ${f(r.left - cb.left)}px`);
          if (mode === 'both' && Math.abs(r.right - cb.right) > T) problems.push(`${label(box)} > ${label(c)}: правий край зсунуто на ${f(r.right - cb.right)}px`);
        }
      }
      return { checks, problems };
    },

    // Елементи одного ряду: однакові top, висота, центр чи ширина.
    row(sel, childSel, props) {
      const problems = [];
      let checks = 0;
      const pick = { top: (r) => r.top, height: (r) => r.height, center: (r) => (r.top + r.bottom) / 2, width: (r) => r.width };
      for (const box of document.querySelectorAll(sel)) {
        if (!shown(box)) continue;
        const items = [...box.querySelectorAll(childSel)].filter((el) => shown(el) && inFlowOrFlex(el) && el.closest(sel) === box);
        for (const g of groupRows(items)) {
          if (g.items.length < 2) continue;
          for (const p of props) {
            const vs = g.items.map((el) => pick[p](R(el)));
            checks += 1;
            if (spread(vs) > T) problems.push(`${label(box)}: ${p} у ряду різниться на ${f(spread(vs))}px (${g.items.map((el, i) => `${label(el)}=${f(vs[i])}`).join(', ')})`);
          }
        }
      }
      return { checks, problems };
      function inFlowOrFlex(el) {
        const cs = getComputedStyle(el);
        return cs.position !== 'absolute' && cs.position !== 'fixed';
      }
    },

    // Сітка карток: у кожному ряду ті самі ліві межі, що й у першому.
    grid(sel, childSel) {
      const problems = [];
      let checks = 0;
      for (const box of document.querySelectorAll(sel)) {
        const rows = groupRows([...box.querySelectorAll(childSel)].filter(shown));
        if (rows.length < 2) continue;
        const first = rows[0].items.map((el) => R(el).left);
        rows.slice(1).forEach((g, ri) =>
          g.items.forEach((el, i) => {
            checks += 1;
            const d = R(el).left - first[i];
            if (Math.abs(d) > T) problems.push(`${label(box)}: ряд ${ri + 2}, картка ${i + 1} зсунута від колонки на ${f(d)}px`);
          }),
        );
      }
      return { checks, problems };
    },

    // Стос рядків: частини рядка стоять в однакових колонках у всіх рядах.
    columns(rowSel, parts) {
      const problems = [];
      let checks = 0;
      const rows = [...document.querySelectorAll(rowSel)].filter(shown);
      if (rows.length < 2) return { checks, problems };
      for (const [ps, mode] of parts) {
        const cells = rows.map((r) => r.querySelector(ps)).filter(shown);
        if (cells.length < 2) continue;
        for (const edge of mode === 'both' ? ['left', 'right'] : [mode]) {
          const vs = cells.map((c) => R(c)[edge]);
          checks += 1;
          if (spread(vs) > T) {
            const lo = cells[vs.indexOf(Math.min(...vs))];
            const hi = cells[vs.indexOf(Math.max(...vs))];
            problems.push(`${rowSel} ${ps}: ${edge === 'left' ? 'лівий' : 'правий'} край гуляє на ${f(spread(vs))}px між рядами («${lo.textContent.trim().slice(0, 24)}» і «${hi.textContent.trim().slice(0, 24)}»)`);
          }
        }
      }
      return { checks, problems };
    },

    // Однакові проміжки між сусідніми однотипними блоками стосу.
    gaps(sel, childSel) {
      const problems = [];
      let checks = 0;
      for (const box of document.querySelectorAll(sel)) {
        const kids = [...box.children].filter(shown);
        const gs = [];
        for (let i = 1; i < kids.length; i++) {
          if (kids[i].matches(childSel) && kids[i - 1].matches(childSel)) gs.push(R(kids[i]).top - R(kids[i - 1]).bottom);
        }
        if (gs.length < 2) continue;
        checks += 1;
        if (spread(gs) > T) problems.push(`${label(box)} > ${childSel}: проміжки між блоками різні (${gs.map(f).join(', ')}px)`);
      }
      return { checks, problems };
    },

    // Число стоїть одразу за найдовшою назвою стосу. Міряється текст, бо комірка буває ширшою
    // за нього; назва, що переноситься, заповнює колонку цілком.
    slack(rowSel, nameSel, numSel, limit) {
      const rows = [...document.querySelectorAll(rowSel)].filter(shown);
      const names = rows.map((r) => r.querySelector(nameSel)).filter(shown);
      const nums = rows.map((r) => r.querySelector(numSel)).filter(shown);
      if (!names.length || !nums.length) return { checks: 0, problems: [], gap: null };
      const right = Math.max(...names.map((el) => (wraps(el) ? R(el).right : Math.min(textRect(el).right, R(el).right))));
      const left = Math.min(...nums.map((el) => textRect(el).left));
      const gap = f(left - right);
      return { checks: 1, problems: gap > limit ? [`${rowSel}: між найдовшою назвою і числом ${gap}px, межа ${limit}px`] : [], gap };
    },

    rects(sel, refSel) {
      const ref = refSel ? document.querySelector(refSel) : null;
      const o = ref ? R(ref) : { left: 0, top: 0 };
      return [...document.querySelectorAll(sel)].filter(shown).map((el) => {
        const r = R(el);
        return { name: label(el), x: f(r.left - o.left), y: f(r.top - o.top), w: f(r.width), h: f(r.height) };
      });
    },

    text(sel) {
      return [...document.querySelectorAll(sel)].map((el) => el.textContent.replace(/\s+/g, ' ').trim());
    },

    home() {
      const t = (root, sel) => (root.querySelector(sel)?.textContent || '').replace(/\s+/g, ' ').trim();
      return {
        stats: [...document.querySelectorAll('.stat')].map((s) => ({ label: t(s, '.stat-label'), done: t(s, '.stat-done'), total: t(s, '.stat-total') })),
        modules: [...document.querySelectorAll('.module-card')].map((c) => ({ title: t(c, '.module-title'), meta: t(c, '.module-meta'), count: t(c, '.module-count') })),
        levels: [...document.querySelectorAll('.level-card')].map((c) => ({
          title: t(c, '.level-title'),
          count: t(c, '.level-count'),
          tasks: [...c.querySelectorAll('.level-task')].map((a) => ({ title: t(a, '.level-task-title'), count: t(a, '.level-task-count') })),
        })),
      };
    },

    sidebar() {
      const t = (root, sel) => (root.querySelector(sel)?.textContent || '').replace(/\s+/g, ' ').trim();
      return {
        total: t(document, '.side-progress-count'),
        groups: [...document.querySelectorAll('.side-group')].map((g) => ({
          title: t(g, '.side-summary .side-title'),
          count: t(g, '.side-summary .side-count'),
          items: [...g.querySelectorAll('.side-item')].map((a) => t(a, '.side-title')),
        })),
      };
    },
  };
})();
"""


def node_content():
    """Кількості з контенту через Node-завантажувач (окремий від застосунку шлях)."""
    js = (
        "import { loadContent } from './scripts/lib/load-content.mjs';"
        "const { modules, levels } = await loadContent();"
        "console.log(JSON.stringify({"
        "modules: modules.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map((l) => ({ id: l.id, title: l.title,"
        " exercises: l.exercises.length, hints: l.exercises.filter((e) => e.hint).length, examples: (l.examples || []).length,"
        " images: (l.examples || []).some((e) => e.images), firstImage: (l.examples || []).findIndex((e) => e.images) })) })),"
        "levels: levels.map((v) => ({ id: v.id, level: v.level, title: v.title, tasks: v.tasks.map((t) => ({ id: t.id, title: t.title,"
        " steps: t.steps.length, setup: Boolean(t.setup) })) })),"
        "}));"
    )
    out = subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        sys.exit(f'Не вдалося прочитати контент:\n{out.stderr}')
    return json.loads(out.stdout)


def fraction(text):
    m = re.fullmatch(r'(\d+)\s*/\s*(\d+)', text.replace('/ ', '/').strip())
    return (int(m.group(1)), int(m.group(2))) if m else None


class Report:
    def __init__(self):
        self.failed = 0
        self.checks = 0

    def add(self, scope, res):
        n, problems = res['checks'], res['problems']
        self.checks += n
        self.failed += len(problems)
        print(f'  {scope:<44} {"ok" if not problems else "FAIL":<4} {n:>4}', flush=True)
        for p in problems:
            print(f'      - {p}', flush=True)

    def expect(self, scope, pairs):
        """pairs: [(опис, на екрані, очікувано)]"""
        problems = [f'{what}: на екрані {got!r}, очікувано {want!r}' for what, got, want in pairs if got != want]
        self.add(scope, {'checks': len(pairs), 'problems': problems})


def same_rects(before, after):
    if len(before) != len(after):
        return [f'кількість елементів змінилась: {len(before)} → {len(after)}']
    out = []
    for a, b in zip(before, after):
        moved = [k for k in ('x', 'y', 'w', 'h') if abs(a[k] - b[k]) > TOL]
        if moved:
            out.append(f'{a["name"]} зсунувся: ' + ', '.join(f'{k} {a[k]} → {b[k]}' for k in moved))
    return out


def moved(page, sel, ref, action):
    before = page.evaluate('([s, r]) => window.__probe.rects(s, r)', [sel, ref])
    action()
    page.wait_for_timeout(120)
    after = page.evaluate('([s, r]) => window.__probe.rects(s, r)', [sel, ref])
    return {'checks': max(len(before), 1), 'problems': same_rects(before, after)}


def stable(rep, page, scope, sel, ref, action):
    rep.add(scope, moved(page, sel, ref, action))


def probe(page, fn, *args):
    return page.evaluate(f'(a) => window.__probe.{fn}(...a)', list(args))


def open_page(ctx, base, route, errors):
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append(f'{route}: {e}'))
    page.on('console', lambda m: errors.append(f'{route}: {m.text}') if m.type == 'error' else None)
    page.add_init_script(PROBE)
    page.goto(f'{base}#{route}')
    page.wait_for_selector('.main > .page')
    page.evaluate('document.fonts.ready.then(() => true)')
    page.wait_for_timeout(150)
    return page


def shot(page, name):
    page.screenshot(path=str(SHOTS / f'{name}.png'), full_page=True)


def common_layout(rep, page, w, name):
    rep.add(f'{w} {name}: прокрутка і межі колонки', probe(page, 'overflow'))
    rep.add(f'{w} {name}: блоки сторінки в одній колонці', probe(page, 'edges', '.main > .page', 'both'))
    rep.add(f'{w} {name}: шапка по центру ряду', probe(page, 'row', '.topbar', ':scope > *', ['center']))


def check_home(rep, ctx, base, w, data, errors):
    page = open_page(ctx, base, '/', errors)
    common_layout(rep, page, w, 'огляд')
    rep.add(f'{w} огляд: секції в колонці', probe(page, 'edges', '.home-section', 'both'))
    rep.add(f'{w} огляд: перший екран з лівого краю', probe(page, 'edges', '.hero', 'left'))
    rep.add(f'{w} огляд: кнопки першого екрана', probe(page, 'row', '.hero-actions', '.btn', ['top', 'height']))
    rep.add(f'{w} огляд: плитки прогресу', probe(page, 'row', '.stats', '.stat', ['top', 'height', 'width']))
    rep.add(f'{w} огляд: картки модулів у ряду', probe(page, 'row', '.module-grid', '.module-card', ['top', 'height', 'width']))
    rep.add(f'{w} огляд: картки модулів у колонках', probe(page, 'grid', '.module-grid', '.module-card'))
    rep.add(f'{w} огляд: картки рівнів у колонці', probe(page, 'edges', '.levels', 'both'))
    rep.add(f'{w} огляд: проміжки між рівнями', probe(page, 'gaps', '.levels', '.level-card'))
    rep.add(
        f'{w} огляд: колонки карток рівнів',
        probe(page, 'columns', '.level-card', [['.level-side', 'both'], ['.level-main', 'both'], ['.level-progress', 'both'], ['.level-progress .bar', 'both']]),
    )
    rep.add(
        f'{w} огляд: колонки задач у рівнях',
        probe(page, 'columns', '.level-task', [['.level-task-num', 'left'], ['.level-task-title', 'both'], ['.level-task-count', 'right'], ['.ring', 'both']]),
    )
    rep.add(f'{w} огляд: лічильник задач одразу за назвами', probe(page, 'slack', '.level-task', '.level-task-title', '.level-task-count', SLACK))
    rep.add(
        f'{w} огляд: колонки груп бічної панелі',
        probe(page, 'columns', '.side-summary', [['.side-num', 'left'], ['.side-title', 'both'], ['.side-count', 'right']]),
    )

    lessons = [l for m in data['modules'] for l in m['lessons']]
    tasks = [t for v in data['levels'] for t in v['tasks']]
    total_ex = sum(l['exercises'] for l in lessons)
    total_steps = sum(t['steps'] for t in tasks)
    h = probe(page, 'home')
    stats = {s['label']: (int(s['done']), int(re.search(r'\d+', s['total']).group())) for s in h['stats']}
    rep.expect(
        f'{w} огляд: плитки = контент',
        [
            ('вправи уроків', stats.get('Вправи уроків'), (0, total_ex)),
            ('кроки задач', stats.get('Кроки задач'), (0, total_steps)),
            ('уроки з вправами', stats.get('Уроки пройдено'), (0, sum(1 for l in lessons if l['exercises']))),
            ('задачі', stats.get("Задачі розв'язано"), (0, len(tasks))),
        ],
    )
    mods = [m for m in data['modules'] if m['lessons']]
    pairs = [('кількість модулів', len(h['modules']), len(mods))]
    for card, m in zip(h['modules'], mods):
        pairs.append((f'модуль «{m["title"]}»: назва', card['title'], m['title']))
        pairs.append((f'модуль «{m["title"]}»: уроків', int(card['meta'].split()[0]), len(m['lessons'])))
        pairs.append((f'модуль «{m["title"]}»: вправ', fraction(card['count']), (0, sum(l['exercises'] for l in m['lessons']))))
    pairs.append(('сума вправ модулів = плитка', sum(fraction(c['count'])[1] for c in h['modules']), total_ex))
    rep.expect(f'{w} огляд: модулі = контент', pairs)
    pairs = [('кількість рівнів', len(h['levels']), len(data['levels']))]
    for card, v in zip(h['levels'], data['levels']):
        pairs.append((f'рівень {v["level"]}: кроків', fraction(card['count']), (0, sum(t['steps'] for t in v['tasks']))))
        pairs.append((f'рівень {v["level"]}: задачі', [t['title'] for t in card['tasks']], [t['title'] for t in v['tasks']]))
        pairs.append((f'рівень {v["level"]}: кроки задач', [fraction(t['count']) for t in card['tasks']], [(0, t['steps']) for t in v['tasks']]))
        pairs.append((f'рівень {v["level"]}: сума задач = рівень', sum(fraction(t['count'])[1] for t in card['tasks']), fraction(card['count'])[1]))
    pairs.append(('сума кроків рівнів = плитка', sum(fraction(c['count'])[1] for c in h['levels']), total_steps))
    rep.expect(f'{w} огляд: рівні = контент', pairs)
    s = probe(page, 'sidebar')
    groups = [(m['title'], sum(l['exercises'] for l in m['lessons']), [l['title'] for l in m['lessons']]) for m in mods]
    groups += [(v['title'], sum(t['steps'] for t in v['tasks']), [t['title'] for t in v['tasks']]) for v in data['levels']]
    pairs = [('загальний прогрес', fraction(s['total']), (0, total_ex + total_steps)), ('кількість груп', len(s['groups']), len(groups))]
    for g, (title, total, items) in zip(s['groups'], groups):
        pairs.append((f'група «{title}»: лічильник', fraction(g['count']), (0, total)))
        pairs.append((f'група «{title}»: пункти', g['items'], items))
    rep.expect(f'{w} бічна панель = контент', pairs)

    stable(rep, page, f'{w} огляд: шапка не зсувається від теми', '.topbar > .brand, #theme-btn, #menu-btn', None, lambda: page.click('#theme-btn'))
    if w == 1440:
        shot(page, f'{w}-home-dark')
    page.click('#theme-btn')
    page.wait_for_timeout(100)
    shot(page, f'{w}-home')
    page.close()


def check_lesson(rep, ctx, base, w, lesson, errors):
    page = open_page(ctx, base, f'/lesson/{lesson["id"]}', errors)
    name = f'урок {lesson["id"]}'
    common_layout(rep, page, w, name)
    rep.add(f'{w} {name}: вміст карток вправ', probe(page, 'edges', '.card.exercise', 'both'))
    rep.add(f'{w} {name}: вміст прикладів', probe(page, 'edges', '.example', 'both'))
    rep.add(f'{w} {name}: текст з лівого краю', probe(page, 'edges', '.prose', 'left'))
    rep.add(f'{w} {name}: кнопки дій', probe(page, 'row', '.actions', '.btn', ['top', 'height']))
    rep.add(f'{w} {name}: шапки карток', probe(page, 'row', '.card-head', ':scope > *', ['center']))
    rep.add(f'{w} {name}: рядок виводу прикладу', probe(page, 'row', '.example-bar', '.btn', ['top', 'height']))
    rep.add(f'{w} {name}: шапка сторінки', probe(page, 'row', '.page-meta', ':scope > *', ['center']))
    rep.add(f'{w} {name}: гортання', probe(page, 'row', '.pager', ':scope > *', ['top', 'height', 'width']))
    rep.add(f'{w} {name}: проміжки між вправами', probe(page, 'gaps', '.main > .page', '.card.exercise'))
    rep.add(f'{w} {name}: проміжки між прикладами', probe(page, 'gaps', '.main > .page', '.example'))
    page.evaluate("document.querySelectorAll('.side-group').forEach((d) => { d.open = true; })")
    page.wait_for_timeout(100)
    rep.add(
        f'{w} {name}: колонки пунктів бічної панелі',
        probe(page, 'columns', '.side-items > .side-item', [['.side-num', 'left'], ['.side-title', 'both'], ['.ring', 'both']]),
    )
    rep.add(f'{w} {name}: кнопки під панеллю', probe(page, 'row', '.side-actions', '.btn', ['top', 'height']))
    rep.expect(
        f'{w} {name}: лічильники = контент',
        [
            ('вправ на сторінці', page.locator('.card.exercise').count(), lesson['exercises']),
            ('прикладів на сторінці', page.locator('.example').count(), lesson['examples']),
            ('чип прогресу', fraction(page.locator('.page-meta .chip-count').inner_text()), (0, lesson['exercises'])),
        ],
    )
    page.evaluate("document.querySelector('.card.exercise').dataset.probe = 'card'")
    card = page.locator('[data-probe=card]')
    keep = '[data-probe=card] .actions .btn, [data-probe=card] .card-head > *'
    if lesson['hints']:
        hint = card.get_by_role('button', name='Підказка')
        if hint.count():
            stable(rep, page, f'{w} {name}: кнопки на місці з підказкою', keep, '[data-probe=card]', hint.click)
            hint.click()
    sol = card.get_by_role('button', name="Розв'язок")
    stable(rep, page, f"{w} {name}: кнопки на місці з розв'язком", keep, '[data-probe=card]', sol.click)
    rep.add(f"{w} {name}: шапка розв'язку", probe(page, 'row', '[data-probe=card] .reveal-head', ':scope > *', ['center']))
    sol.click()
    shot(page, f'{w}-lesson-{lesson["id"]}')
    page.close()


def check_task(rep, ctx, base, w, task, errors):
    page = open_page(ctx, base, f'/task/{task["id"]}', errors)
    name = f'задача {task["id"]}'
    common_layout(rep, page, w, name)
    rep.add(f'{w} {name}: вміст кроку', probe(page, 'edges', '.step-host', 'both'))
    rep.add(f'{w} {name}: вміст картки кроку', probe(page, 'edges', '.card.exercise', 'both'))
    rep.add(f'{w} {name}: текст з лівого краю', probe(page, 'edges', '.prose', 'left'))
    rep.add(f'{w} {name}: кроки в ряду', probe(page, 'row', '.stepper', '.step-chip', ['top', 'height', 'width']))
    rep.add(f'{w} {name}: кнопки дій', probe(page, 'row', '.actions', '.btn', ['top', 'height']))
    rep.add(f'{w} {name}: шапка сторінки', probe(page, 'row', '.page-meta', ':scope > *', ['center']))
    rep.add(f'{w} {name}: рядок даних задачі', probe(page, 'row', '.data-summary', ':scope > *', ['center']))
    rep.add(f'{w} {name}: гортання', probe(page, 'row', '.pager', ':scope > *', ['top', 'height', 'width']))
    rep.expect(
        f'{w} {name}: лічильники = контент',
        [
            ('кроків у смузі', page.locator('.stepper .step-chip').count(), task['steps']),
            ('чип прогресу', fraction(page.locator('.page-meta .chip-count').inner_text()), (0, task['steps'])),
            ('підпис кроку', page.locator('.step-host .badge').inner_text().strip(), f'Крок 1 з {task["steps"]}'),
            ('панель даних', page.locator('details.data-panel').count(), 1 if task['setup'] else 0),
        ],
    )
    if task['setup']:
        stable(rep, page, f'{w} {name}: рядок даних не зсувається', '.data-summary, .page-head', '.main > .page', lambda: page.click('.data-summary'))
        rep.add(f'{w} {name}: вміст панелі даних', probe(page, 'edges', 'details.data-panel', 'both'))
        page.click('.data-summary')
    stable(
        rep,
        page,
        f'{w} {name}: смуга кроків стоїть на місці',
        '.stepper .step-chip, .step-host .card-head .badge',
        '.stepper',
        lambda: (page.click('.stepper .step-chip >> nth=1'), page.wait_for_function("document.querySelector('.step-host .badge').textContent.startsWith('Крок 2')")),
    )
    shot(page, f'{w}-task-{task["id"]}')
    page.close()


def check_simple(rep, ctx, base, w, route, name, errors):
    page = open_page(ctx, base, route, errors)
    common_layout(rep, page, w, name)
    rep.add(f'{w} {name}: вміст картки', probe(page, 'edges', '.card.exercise', 'both'))
    rep.add(f'{w} {name}: кнопки дій', probe(page, 'row', '.actions', '.btn', ['top', 'height']))
    shot(page, f'{w}-{route.strip("/").replace("/", "-") or "home"}')
    page.close()


def check_mobile(rep, browser, base, data, lesson, task, errors):
    w = 390
    ctx = browser.new_context(viewport={'width': w, 'height': 844}, reduced_motion='reduce', color_scheme='light', locale='uk-UA', has_touch=True)
    try:
        for route, name in (('/', 'огляд'), (f'/lesson/{lesson["id"]}', f'урок {lesson["id"]}'), (f'/task/{task["id"]}', f'задача {task["id"]}'), ('/sandbox', 'пісочниця')):
            page = open_page(ctx, base, route, errors)
            rep.add(f'{w} {name}: прокрутка і межі колонки', probe(page, 'overflow'))
            rep.add(f'{w} {name}: блоки сторінки в одній колонці', probe(page, 'edges', '.main > .page', 'both'))
            rep.add(f'{w} {name}: шапка по центру ряду', probe(page, 'row', '.topbar', ':scope > *', ['center']))
            r = page.evaluate("(() => { const r = document.querySelector('.main > .page').getBoundingClientRect(); return [r.left, innerWidth - r.right]; })()")
            rep.expect(f'{w} {name}: поля по боках', [('ліве поле не менше 16px', r[0] >= 16 - TOL, True), ('праве поле не менше 16px', r[1] >= 16 - TOL, True)])
            if name == 'огляд':
                rep.add(f'{w} огляд: плитки прогресу', probe(page, 'row', '.stats', '.stat', ['top', 'height', 'width']))
                state = lambda: page.evaluate(
                    "(() => { const s = document.getElementById('sidebar').getBoundingClientRect();"
                    " return { open: document.getElementById('app').classList.contains('nav-open'), inert: document.getElementById('sidebar').inert,"
                    " visible: s.right > 1 && s.left > -1 }; })()"
                )
                closed = state()
                page.click('#menu-btn')
                page.wait_for_timeout(150)
                opened = state()
                page.keyboard.press('Escape')
                page.wait_for_timeout(150)
                again = state()
                rep.expect(
                    f'{w} шухляда змісту',
                    [
                        ('закрита на старті', closed, {'open': False, 'inert': True, 'visible': False}),
                        ('відкривається кнопкою', opened, {'open': True, 'inert': False, 'visible': True}),
                        ('закривається Escape', again, closed),
                    ],
                )
            if name.startswith('задача'):
                rep.add(f'{w} {name}: кроки в ряду', probe(page, 'row', '.stepper', '.step-chip', ['top', 'height', 'width']))
            rep.add(f'{w} {name}: кнопки дій', probe(page, 'row', '.actions', '.btn', ['top', 'height']))
            shot(page, f'{w}-{route.strip("/").replace("/", "-") or "home"}')
            page.close()
    finally:
        ctx.close()


def check_canaries(rep, browser, base, lesson, task):
    """Навмисні дефекти: кожна перевірка мусить їх помітити, інакше нуль знахідок нічого не доводить."""
    w = 1440
    lesson_route, task_route = f'/lesson/{lesson["id"]}', f'/task/{task["id"]}'
    canaries = [
        ('/', 'задачі другого рівня зсунуто', '.level-card:nth-child(2) .level-tasks { padding-left: 3px }', 'columns', ['.level-task', [['.level-task-num', 'left']]]),
        ('/', 'лічильник задач далеко від назв', '.page.home { --task-title-w: 9999px !important }', 'slack', ['.level-task', '.level-task-title', '.level-task-count', SLACK]),
        ('/', 'плитка нижча за сусідні', '.stat:nth-child(3) { align-self: start; padding-bottom: 6px }', 'row', ['.stats', '.stat', ['height']]),
        ('/', 'картка модуля поза колонкою', '.module-card:nth-child(5) { margin-left: 4px }', 'grid', ['.module-grid', '.module-card']),
        ('/', 'група панелі з іншою колонкою', '.side-group:nth-of-type(3) .side-summary { padding-left: 14px }', 'columns', ['.side-summary', [['.side-num', 'left']]]),
        ('/', 'лічильник групи іншої ширини', '.side-group:nth-of-type(2) .side-count { min-width: 9ch }', 'columns', ['.side-summary', [['.side-title', 'both']]]),
        ('/', 'вміст ширший за колонку', '.hero-actions { min-width: 2600px }', 'overflow', []),
        (lesson_route, 'вміст обрізано контейнером', '.card.exercise .actions { overflow: hidden; min-width: 0 } .card.exercise .actions .btn.primary { min-width: 1400px }', 'overflow', []),
        ('/', 'кнопка теми не по центру шапки', '#theme-btn { margin-top: 8px }', 'row', ['.topbar', ':scope > *', ['center']]),
        (lesson_route, 'умова вправи зсунута', '.card.exercise .task-text { margin-left: 3px }', 'edges', ['.card.exercise', 'both']),
        (lesson_route, 'кнопка дій вища', '.card.exercise .actions .btn.primary { height: 46px }', 'row', ['.actions', '.btn', ['height']]),
        (lesson_route, 'інший проміжок між вправами', '.card.exercise:nth-child(2 of .card.exercise) { margin-bottom: 40px }', 'gaps', ['.main > .page', '.card.exercise']),
        (lesson_route, 'гортання ширше за колонку', '.pager { margin-right: -6px }', 'edges', ['.main > .page', 'both']),
        (lesson_route, "кнопка розв'язку ширшає", '.btn.is-on { padding-inline: 26px }', 'stable', []),
        (task_route, 'крок у смузі нижче', '.stepper-item:first-child .step-chip { margin-top: 3px }', 'row', ['.stepper', '.step-chip', ['top']]),
        (task_route, 'абзац історії зсунуто', '.prose.story > :first-child { margin-left: 2px }', 'edges', ['.prose', 'left']),
    ]
    ctx = browser.new_context(viewport={'width': w, 'height': 900}, reduced_motion='reduce', color_scheme='light', locale='uk-UA')
    try:
        for route, name, css, fn, args in canaries:
            page = open_page(ctx, base, route, [])
            page.add_style_tag(content=css)
            page.wait_for_timeout(80)
            if fn == 'stable':
                page.evaluate("document.querySelector('.card.exercise').dataset.probe = 'card'")
                sol = page.locator('[data-probe=card]').get_by_role('button', name="Розв'язок")
                res = moved(page, '[data-probe=card] .actions .btn', '[data-probe=card]', sol.click)
            else:
                res = probe(page, fn, *args)
            fired = bool(res['problems'])
            rep.add(f'{w} канарка: {name}', {'checks': 1, 'problems': [] if fired else ['перевірка не помітила навмисного дефекту']})
            page.close()
    finally:
        ctx.close()


def set_code(page, card, code):
    card.locator('.cm-content').click()
    page.keyboard.press('Control+A')
    page.keyboard.press('Delete')
    page.keyboard.insert_text(code)


def check_python(rep, browser, base, data, lesson, task, image_lesson, errors):
    w = 1440
    ctx = browser.new_context(viewport={'width': w, 'height': 900}, reduced_motion='reduce', color_scheme='light', locale='uk-UA')
    try:
        page = open_page(ctx, base, f'/lesson/{lesson["id"]}', errors)
        cards = page.locator('.card.exercise')
        c1 = cards.nth(0)
        c1.get_by_role('button', name="Розв'язок").click()
        c1.get_by_role('button', name='Вставити в редактор').click()
        t0 = time.time()
        c1.get_by_role('button', name='Перевірити').click()
        c1.locator('.verdict').wait_for(timeout=PY_TIMEOUT)
        first_run = time.time() - t0
        verdict = c1.locator('.verdict').get_attribute('class')
        rep.expect(
            f'{w} Python: еталон вправи 1 зараховано ({first_run:.0f} с з завантаженням)',
            [
                ('вердикт', verdict, 'verdict ok'),
                ('штамп картки', c1.locator('.card-state').text_content().strip(), 'Зараховано'),
                ('чип прогресу', fraction(page.locator('.page-meta .chip-count').inner_text()), (1, lesson['exercises'])),
            ],
        )
        if lesson['exercises'] > 1:
            c2 = cards.nth(1)
            set_code(page, c2, 'print("не те")')
            c2.get_by_role('button', name='Перевірити').click()
            c2.locator('.verdict').wait_for(timeout=PY_TIMEOUT)
            rep.expect(
                f'{w} Python: хибна відповідь не зараховується',
                [
                    ('вердикт', c2.locator('.verdict').get_attribute('class'), 'verdict fail'),
                    ('чип прогресу не змінився', fraction(page.locator('.page-meta .chip-count').inner_text()), (1, lesson['exercises'])),
                ],
            )
            if c2.locator('.diff').count():
                page.evaluate("document.querySelectorAll('.card.exercise')[1].dataset.probe = 'c2'")
                rep.add(f'{w} Python: колонки порівняння виводу', probe(page, 'row', '[data-probe=c2] .diff', '.diff-col', ['top', 'height', 'width']))
                rep.add(f'{w} Python: результат у колонці картки', probe(page, 'edges', '[data-probe=c2] .result', 'both'))
        if lesson['exercises'] > 2:
            c3 = cards.nth(2)
            set_code(page, c3, 'print(1')
            c3.get_by_role('button', name='Запустити').click()
            c3.locator('.out-block.error').wait_for(timeout=PY_TIMEOUT)
            rep.expect(f'{w} Python: синтаксична помилка з поясненням', [('пояснення помилки', c3.locator('.explain').count() > 0, True)])
        shot(page, f'{w}-python-lesson')
        page.close()

        page = open_page(ctx, base, f'/task/{task["id"]}', errors)
        n = task['steps']
        done = []
        for step in (1, 2, n):
            if step == 2:
                page.locator('.step-nav a', has_text='Крок 2').click()
            elif step == n and n > 2:
                page.goto(f'{base}#/task/{task["id"]}/s{n}')
            page.wait_for_function(f"document.querySelector('.step-host .badge')?.textContent === 'Крок {step} з {n}'")
            card = page.locator('.step-host .card.exercise')
            card.get_by_role('button', name="Розв'язок").click()
            card.get_by_role('button', name='Вставити в редактор').click()
            card.get_by_role('button', name='Перевірити').click()
            card.locator('.verdict').wait_for(timeout=PY_TIMEOUT)
            done.append((f'крок {step}', card.locator('.verdict').get_attribute('class'), 'verdict ok'))
            imgs = card.locator('.figures img')
            for i in range(imgs.count()):
                done.append((f'крок {step}: графік {i + 1} намальовано', imgs.nth(i).evaluate('(im) => im.complete && im.naturalWidth > 0'), True))
        done.append(('чип прогресу', fraction(page.locator('.page-meta .chip-count').inner_text()), (len({1, 2, n}), n)))
        done.append(('позначені кроки в смузі', page.locator('.stepper .step-chip.is-done').count(), len({1, 2, n})))
        rep.expect(f'{w} Python: еталони кроків 1, 2 і {n} задачі {task["id"]}', done)
        shot(page, f'{w}-python-task')
        page.close()

        page = open_page(ctx, base, f'/lesson/{image_lesson["id"]}', errors)
        ex = page.locator('.example').nth(image_lesson['firstImage'])
        ex.scroll_into_view_if_needed()
        img = ex.locator('.figures img').first
        img.wait_for(timeout=PY_TIMEOUT)
        rep.expect(f'{w} Python: графік прикладу {image_lesson["id"]}', [('картинка намальована', img.evaluate('(im) => im.complete && im.naturalWidth > 0'), True)])
        rep.add(f'{w} Python: графік у межах прикладу', probe(page, 'overflow'))
        shot(page, f'{w}-python-figure')
        page.close()

        src = (ROOT / 'src' / 'ui' / 'views' / 'sandbox.js').read_text(encoding='utf-8')
        revenue = re.search(r'"виручка": \[([^\]]+)\]', src).group(1)
        want = sum(int(x.strip().replace('_', '')) for x in revenue.split(','))
        page = open_page(ctx, base, '/sandbox', errors)
        page.get_by_role('button', name='Запустити').click()
        page.locator('.result .out').first.wait_for(timeout=PY_TIMEOUT)
        out = page.locator('.result .out').first.inner_text()
        got = re.search(r'Разом:\s*(\d+)', out)
        rep.expect(f'{w} Python: пісочниця рахує суму виручки', [('сума', int(got.group(1)) if got else out, want)])
        page.close()

        page = open_page(ctx, base, '/', errors)
        h = probe(page, 'home')
        stats = {s['label']: int(s['done']) for s in h['stats']}
        rep.expect(
            f'{w} Python: прогрес на огляді після перевірок',
            [('вправи уроків', stats.get('Вправи уроків'), 1), ('кроки задач', stats.get('Кроки задач'), len({1, 2, n}))],
        )
        page.close()
    finally:
        ctx.close()


def build():
    print('Збірка...', flush=True)
    out = subprocess.run(['node', str(VITE), 'build', '--logLevel', 'warn'], cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    if out.returncode:
        sys.exit(f'Збірка впала:\n{out.stdout}\n{out.stderr}')


def start_preview(port):
    log = open(SHOTS / 'preview.log', 'w', encoding='utf-8')
    proc = subprocess.Popen(
        ['node', str(VITE), 'preview', '--port', str(port), '--strictPort', '--host', '127.0.0.1'],
        cwd=ROOT,
        stdout=log,
        stderr=subprocess.STDOUT,
    )
    base = f'http://127.0.0.1:{port}/'
    deadline = time.time() + 30
    while time.time() < deadline:
        if proc.poll() is not None:
            log.close()
            sys.exit(f'vite preview не стартував (порт {port} зайнятий?): {(SHOTS / "preview.log").read_text(encoding="utf-8")}')
        try:
            with urllib.request.urlopen(base, timeout=2) as r:
                if r.status == 200:
                    return proc, log, base
        except OSError:
            time.sleep(0.3)
    proc.kill()
    sys.exit('vite preview не відповів за 30 с')


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--widths', default='1440,1920', help='ширини через кому (типово 1440,1920)')
    ap.add_argument('--only', default='', help=f'лише ці перевірки через кому: {", ".join(PAGES)}')
    ap.add_argument('--no-build', action='store_true', help='не збирати, взяти наявний dist/')
    ap.add_argument('--no-python', action='store_true', help='без справжнього Python у браузері (без мережі до CDN)')
    ap.add_argument('--port', type=int, default=4319)
    args = ap.parse_args()

    only = {x.strip() for x in args.only.split(',') if x.strip()}
    unknown = only - set(PAGES)
    if unknown:
        sys.exit(f'Невідомі перевірки: {", ".join(sorted(unknown))}. Є: {", ".join(PAGES)}')
    want = lambda k: not only or k in only
    widths = [int(x) for x in args.widths.split(',') if x.strip()]
    SHOTS.mkdir(parents=True, exist_ok=True)

    data = node_content()
    lessons = [l for m in data['modules'] for l in m['lessons']]
    lesson = next(l for l in lessons if l['exercises'] >= 3 and l['examples'])
    image_lesson = next(l for l in lessons if l['images'])
    task = next(t for t in data['levels'][-1]['tasks'] if t['steps'] >= 3)

    if not args.no_build:
        build()
    proc, log, base = start_preview(args.port)
    rep = Report()
    errors = []
    t0 = time.time()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, args=['--mute-audio'])
            try:
                for w in widths:
                    print(f'Ширина {w}', flush=True)
                    ctx = browser.new_context(viewport={'width': w, 'height': 900}, reduced_motion='reduce', color_scheme='light', locale='uk-UA')
                    try:
                        if want('home'):
                            check_home(rep, ctx, base, w, data, errors)
                        if want('lesson'):
                            check_lesson(rep, ctx, base, w, lesson, errors)
                        if want('task'):
                            check_task(rep, ctx, base, w, task, errors)
                        if want('sandbox'):
                            check_simple(rep, ctx, base, w, '/sandbox', 'пісочниця', errors)
                        if want('notfound'):
                            check_simple(rep, ctx, base, w, '/немає-такої', '404', errors)
                    finally:
                        ctx.close()
                if want('mobile'):
                    print('Мобільна 390', flush=True)
                    check_mobile(rep, browser, base, data, lesson, task, errors)
                if want('canary'):
                    print('Канарки', flush=True)
                    check_canaries(rep, browser, base, lesson, task)
                if want('python') and not args.no_python:
                    print('Справжній Python у браузері', flush=True)
                    check_python(rep, browser, base, data, lesson, task, image_lesson, errors)
            finally:
                browser.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
        log.close()

    rep.add('помилки в консолі браузера', {'checks': 1, 'problems': errors[:20]})
    print(f'\nПеревірок: {rep.checks}, розбіжностей: {rep.failed}, {time.time() - t0:.0f} с. Знімки: {SHOTS.relative_to(ROOT)}')
    return 1 if rep.failed else 0


if __name__ == '__main__':
    sys.exit(main())
