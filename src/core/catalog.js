// Плаский каталог контенту: ідентифікатори вправ і кроків, нумерація, сусіди, прогрес.

export function exerciseId(lesson, index) {
  return `${lesson.id}/e${index + 1}`;
}

export function stepId(task, index) {
  return `${task.id}/s${index + 1}`;
}

export function buildCatalog({ modules, levels }) {
  const lessons = [];
  modules.forEach((mod, mi) => {
    mod.lessons.forEach((lesson, li) => {
      lessons.push({
        lesson,
        module: mod,
        number: `${mi + 1}.${li + 1}`,
        moduleNumber: mi + 1,
        itemIds: lesson.exercises.map((_, i) => exerciseId(lesson, i)),
      });
    });
  });

  const tasks = [];
  levels.forEach((level) => {
    level.tasks.forEach((task, ti) => {
      tasks.push({
        task,
        level,
        number: `${level.level}.${ti + 1}`,
        itemIds: task.steps.map((_, i) => stepId(task, i)),
      });
    });
  });

  const lessonById = new Map(lessons.map((e) => [e.lesson.id, e]));
  const taskById = new Map(tasks.map((e) => [e.task.id, e]));

  return {
    modules,
    levels,
    lessons,
    tasks,
    lessonById,
    taskById,
    neighbours(list, index) {
      return { prev: list[index - 1] || null, next: list[index + 1] || null };
    },
    count(ids, isDone) {
      return { done: ids.filter(isDone).length, total: ids.length };
    },
    totals(isDone) {
      const lessonIds = lessons.flatMap((e) => e.itemIds);
      const taskIds = tasks.flatMap((e) => e.itemIds);
      return {
        exercises: this.count(lessonIds, isDone),
        steps: this.count(taskIds, isDone),
      };
    },
    /** Перше невиконане: спершу уроки по порядку, потім задачі. */
    nextUnsolved(isDone) {
      for (const e of lessons) {
        const i = e.itemIds.findIndex((id) => !isDone(id));
        if (i >= 0) return { route: `#/lesson/${e.lesson.id}`, anchor: e.itemIds[i] };
      }
      for (const e of tasks) {
        const i = e.itemIds.findIndex((id) => !isDone(id));
        if (i >= 0) return { route: `#/task/${e.task.id}`, anchor: e.itemIds[i] };
      }
      return null;
    },
  };
}
