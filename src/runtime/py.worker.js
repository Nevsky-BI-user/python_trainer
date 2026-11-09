// Web Worker з Pyodide: важкий Python не блокує інтерфейс, а нескінченний цикл
// зупиняється перезапуском воркера (див. client.js).
import harnessSource from './harness.py?raw';
import { PYODIDE_INDEX_URL } from './version.js';

let pyodide = null;
let runJson = null;

const post = (msg) => self.postMessage(msg);

async function init() {
  post({ type: 'status', state: 'loading', detail: 'Завантажую Python' });
  const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_INDEX_URL}pyodide.mjs`);
  pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL, stdout: () => {}, stderr: () => {} });
  pyodide.FS.mkdirTree('/home/pyodide/trainer');
  pyodide.FS.writeFile('/home/pyodide/trainer/trainer_harness.py', harnessSource);
  pyodide.runPython('import sys\nsys.path.insert(0, "/home/pyodide/trainer")\nimport trainer_harness');
  runJson = pyodide.runPython('trainer_harness.run_json');
  post({ type: 'status', state: 'ready', detail: `Python ${pyodide.runPython('import sys; sys.version.split()[0]')}` });
}

const ready = init().catch((err) => {
  post({ type: 'status', state: 'failed', detail: String(err?.message || err) });
  throw err;
});

const HEAVY = ['numpy', 'pandas', 'matplotlib'];

async function loadPackagesFor(source) {
  const wanted = HEAVY.filter((name) => new RegExp(`(^|\\n)\\s*(import|from)\\s+${name}\\b`).test(source));
  if (!wanted.length && !/(^|\n)\s*(import|from)\s+/.test(source)) return;
  let announced = false;
  await pyodide.loadPackagesFromImports(source, {
    messageCallback: (message) => {
      if (!announced && /^Loading/.test(message)) {
        announced = true;
        post({ type: 'status', state: 'packages', detail: `Завантажую ${wanted.join(', ') || 'бібліотеки'}` });
      }
    },
    errorCallback: () => {},
  });
  if (announced) post({ type: 'status', state: 'ready', detail: 'Бібліотеки готові' });
}

self.onmessage = async ({ data }) => {
  if (data.type === 'prefetch') {
    try {
      await ready;
      await loadPackagesFor(data.source);
      for (const name of ['numpy', 'pandas', 'matplotlib.pyplot']) {
        if (data.source.includes(name)) pyodide.runPython(`import ${name}`);
      }
    } catch {
      /* передзавантаження не критичне */
    }
    return;
  }

  if (data.type === 'run') {
    const { id, payload } = data;
    try {
      await ready;
      const source = [payload.code, payload.check, ...(payload.prelude || [])].filter(Boolean).join('\n');
      await loadPackagesFor(source);
      post({ type: 'started', id });
      const result = JSON.parse(runJson(JSON.stringify(payload)));
      post({ type: 'result', id, result });
    } catch (err) {
      post({ type: 'failed', id, message: String(err?.message || err) });
    }
  }
};
