// Перевірка структури контенту. Повертає список проблем (рядки); порожній список = гаразд.

const FORBIDDEN = /[–—]/;

const KEYS = {
  module: ['id', 'title', 'lessons'],
  lesson: ['id', 'title', 'theory', 'examples', 'exercises'],
  example: ['code', 'output', 'images'],
  exercise: ['task', 'starter', 'solution', 'expected', 'check', 'hint'],
  level: ['id', 'level', 'title', 'description', 'tasks'],
  task: ['id', 'title', 'story', 'setup', 'skills', 'steps'],
  step: ['title', 'task', 'starter', 'solution', 'expected', 'check', 'hint'],
};

export function validateContent({ modules, levels }) {
  const problems = [];
  const ids = new Set();

  const isStr = (v) => typeof v === 'string';
  const need = (obj, key, where, kind = 'string') => {
    const v = obj[key];
    const ok = kind === 'string' ? isStr(v) && v.trim() !== '' : kind === 'array' ? Array.isArray(v) && v.length > 0 : kind === 'number' ? Number.isFinite(v) : true;
    if (!ok) problems.push(`${where}: поле ${key} відсутнє або порожнє`);
    return ok;
  };
  const keys = (obj, type, where) => {
    for (const k of Object.keys(obj)) {
      if (!KEYS[type].includes(k)) problems.push(`${where}: невідоме поле ${k}`);
    }
  };
  const uniq = (id, where) => {
    if (ids.has(id)) problems.push(`${where}: ідентифікатор ${id} повторюється`);
    ids.add(id);
  };
  const scan = (value, where) => {
    if (isStr(value)) {
      if (FORBIDDEN.test(value)) problems.push(`${where}: довге чи коротке тире (U+2014/U+2013), заміни на дефіс, двокрапку чи кому`);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => scan(v, `${where}[${i}]`));
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) scan(v, `${where}.${k}`);
    }
  };

  for (const [mi, mod] of (modules || []).entries()) {
    const mw = `модуль ${mod?.id ?? mi}`;
    keys(mod, 'module', mw);
    need(mod, 'id', mw);
    need(mod, 'title', mw);
    uniq(mod.id, mw);
    if (!need(mod, 'lessons', mw, 'array')) continue;
    for (const lesson of mod.lessons) {
      const lw = `урок ${lesson.id}`;
      keys(lesson, 'lesson', lw);
      need(lesson, 'id', lw);
      need(lesson, 'title', lw);
      need(lesson, 'theory', lw);
      uniq(lesson.id, lw);
      if (!Array.isArray(lesson.examples)) problems.push(`${lw}: examples має бути масивом`);
      for (const [i, ex] of (lesson.examples || []).entries()) {
        const xw = `${lw}/x${i + 1}`;
        keys(ex, 'example', xw);
        need(ex, 'code', xw);
        if (!isStr(ex.output)) problems.push(`${xw}: поле output має бути рядком`);
      }
      if (!need(lesson, 'exercises', lw, 'array')) continue;
      for (const [i, ex] of lesson.exercises.entries()) {
        const ew = `${lw}/e${i + 1}`;
        keys(ex, 'exercise', ew);
        need(ex, 'task', ew);
        need(ex, 'solution', ew);
        if (!isStr(ex.starter)) problems.push(`${ew}: поле starter має бути рядком`);
        if (!isStr(ex.expected) && !isStr(ex.check)) problems.push(`${ew}: потрібне expected або check`);
      }
    }
  }

  for (const [li, level] of (levels || []).entries()) {
    const lw = `рівень ${level?.id ?? li}`;
    keys(level, 'level', lw);
    need(level, 'id', lw);
    need(level, 'level', lw, 'number');
    need(level, 'title', lw);
    need(level, 'description', lw);
    uniq(level.id, lw);
    if (!need(level, 'tasks', lw, 'array')) continue;
    for (const task of level.tasks) {
      const tw = `задача ${task.id}`;
      keys(task, 'task', tw);
      need(task, 'id', tw);
      need(task, 'title', tw);
      need(task, 'story', tw);
      uniq(task.id, tw);
      if (task.setup !== undefined && !isStr(task.setup)) problems.push(`${tw}: setup має бути рядком`);
      if (!need(task, 'steps', tw, 'array')) continue;
      if (task.steps.length < 2) problems.push(`${tw}: задача практикуму має щонайменше 2 кроки`);
      for (const [i, step] of task.steps.entries()) {
        const sw = `${tw}/s${i + 1}`;
        keys(step, 'step', sw);
        need(step, 'title', sw);
        need(step, 'task', sw);
        need(step, 'solution', sw);
        need(step, 'hint', sw);
        if (!isStr(step.starter)) problems.push(`${sw}: поле starter має бути рядком`);
        if (!isStr(step.expected) && !isStr(step.check)) problems.push(`${sw}: потрібне expected або check`);
      }
    }
  }

  scan(modules, 'modules');
  scan(levels, 'levels');
  return problems;
}
