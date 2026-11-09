// Ворота контенту: схема, заборонені символи, реальний запуск у Pyodide.
//   npm run verify                 усе
//   npm run verify -- --only p4    лише ідентифікатори, що починаються з p4
//   npm run verify -- --no-run     лише схема і текст, без Python
//
// Для кожного прикладу: вивід коду == output.
// Для кожної вправи і кроку задачі: еталон проходить (вивід/перевірка), а стартовий
// код НЕ проходить (інакше перевірка порожня і зараховує будь-що).
import { createNodeRuntime } from './lib/node-runtime.mjs';
import { loadContent } from './lib/load-content.mjs';
import { compareOutput, exercisePayload, stepPayload, judge } from '../src/core/evaluate.js';
import { validateContent } from '../src/core/schema.js';

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const noRun = args.includes('--no-run');
const verbose = args.includes('--verbose');

const { modules, levels } = await loadContent();
const problems = validateContent({ modules, levels });
const failures = [];
const stats = { examples: 0, exercises: 0, steps: 0 };

const selected = (id) => !only || id.startsWith(only);

if (!noRun) {
  const rt = await createNodeRuntime();

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!selected(lesson.id) && !selected(mod.id)) continue;
      for (const [i, ex] of lesson.examples.entries()) {
        const id = `${lesson.id}/x${i + 1}`;
        stats.examples += 1;
        const r = await rt.run({ code: ex.code });
        const shown = r.error ? r.stdout + r.error : r.stdout;
        const cmp = compareOutput(shown, ex.output);
        if (!cmp.equal) failures.push({ id, what: `вивід прикладу розходиться з output (рядок ${cmp.line})`, actual: shown });
        else if (r.images.length && !ex.images) failures.push({ id, what: 'приклад малює графік: додай images: true' });
      }
      for (const [i, ex] of lesson.exercises.entries()) {
        const id = `${lesson.id}/e${i + 1}`;
        stats.exercises += 1;
        await checkItem(rt, id, ex, (code) => exercisePayload(ex, code));
      }
    }
  }

  for (const level of levels) {
    for (const task of level.tasks) {
      if (!selected(task.id) && !selected(level.id)) continue;
      for (const [i, step] of task.steps.entries()) {
        const id = `${task.id}/s${i + 1}`;
        stats.steps += 1;
        await checkItem(rt, id, step, (code) => stepPayload(task, i, code));
      }
    }
  }
}

async function checkItem(rt, id, item, makePayload) {
  const good = await rt.run(makePayload(item.solution));
  const verdict = judge(item, good);
  if (!verdict.passed) {
    failures.push({
      id,
      what: `еталонний розв'язок не проходить: ${verdict.message}`,
      actual: good.error || good.stdout,
    });
  } else if (verbose) {
    console.log(`ok ${id}`);
  }
  const bad = await rt.run(makePayload(item.starter));
  if (judge(item, bad).passed) {
    failures.push({ id, what: 'стартовий код уже проходить перевірку: перевірка нічого не перевіряє' });
  }
}

const total = { modules: modules.length, lessons: 0, exercises: 0, levels: levels.length, tasks: 0, steps: 0 };
for (const m of modules) { total.lessons += m.lessons.length; total.exercises += m.lessons.reduce((s, l) => s + l.exercises.length, 0); }
for (const l of levels) { total.tasks += l.tasks.length; total.steps += l.tasks.reduce((s, t) => s + t.steps.length, 0); }

console.log(`Контент: модулів ${total.modules}, уроків ${total.lessons}, вправ ${total.exercises}; рівнів ${total.levels}, задач ${total.tasks}, кроків ${total.steps}`);
if (!noRun) console.log(`Запущено: прикладів ${stats.examples}, вправ ${stats.exercises}, кроків ${stats.steps}`);
for (const p of problems) console.log(`СХЕМА  ${p}`);
for (const f of failures) {
  console.log(`ЗБІЙ   ${f.id}: ${f.what}`);
  if (f.actual !== undefined) console.log(String(f.actual).split('\n').map((l) => `        | ${l}`).join('\n'));
}
const bad = problems.length + failures.length;
console.log(bad ? `Проблем: ${bad}` : 'Усе зелене');
process.exit(bad ? 1 : 0);
