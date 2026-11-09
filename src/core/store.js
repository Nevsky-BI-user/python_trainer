// Прогрес і код учня в localStorage. Кожне читання і запис обгорнуті try/catch:
// у приватному вікні сховище може бути недоступне, застосунок тоді просто не пам'ятає.

const KEY = 'pytrainer:v2';
const EMPTY = () => ({ done: {}, code: {}, theme: null, last: null });

export function createStore(storage = safeStorage()) {
  let state = load();
  let timer = null;
  const listeners = new Set();

  function load() {
    try {
      const raw = storage?.getItem(KEY);
      if (!raw) return EMPTY();
      return sanitize(JSON.parse(raw));
    } catch {
      return EMPTY();
    }
  }

  function persist() {
    try {
      storage?.setItem(KEY, JSON.stringify(state));
    } catch {
      /* сховище недоступне або переповнене */
    }
  }

  function persistSoon() {
    clearTimeout(timer);
    timer = setTimeout(persist, 300);
  }

  function emit() {
    for (const fn of listeners) fn(state);
  }

  return {
    get state() {
      return state;
    },
    isDone: (id) => state.done[id] === true,
    getCode: (id) => state.code[id],
    setCode(id, code) {
      state.code[id] = code;
      persistSoon();
    },
    clearCode(id) {
      delete state.code[id];
      persistSoon();
    },
    markDone(id) {
      if (state.done[id]) return;
      state.done[id] = true;
      persist();
      emit();
    },
    setTheme(theme) {
      state.theme = theme;
      persist();
    },
    setLast(route) {
      state.last = route;
      persistSoon();
    },
    reset() {
      state = { ...EMPTY(), theme: state.theme };
      persist();
      emit();
    },
    exportJson() {
      return JSON.stringify({ app: 'python-trainer', version: 2, ...state }, null, 2);
    },
    importJson(text) {
      const data = JSON.parse(text);
      if (data.app !== 'python-trainer') throw new Error('Це не файл прогресу тренажера');
      state = sanitize(data);
      persist();
      emit();
    },
    flush() {
      clearTimeout(timer);
      persist();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

function sanitize(data) {
  const out = EMPTY();
  if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data.done || {})) if (v === true) out.done[k] = true;
    for (const [k, v] of Object.entries(data.code || {})) if (typeof v === 'string') out.code[k] = v;
    if (data.theme === 'light' || data.theme === 'dark') out.theme = data.theme;
    if (typeof data.last === 'string') out.last = data.last;
  }
  return out;
}

function safeStorage() {
  try {
    const s = globalThis.localStorage;
    const probe = '__pytrainer_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}
