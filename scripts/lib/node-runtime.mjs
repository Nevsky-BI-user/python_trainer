// Pyodide у Node з тим самим harness.py, що й у браузері.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { PYODIDE_VERSION } from '../../src/runtime/version.js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function createNodeRuntime() {
  const pyodide = await loadPyodide({
    packageCacheDir: path.join(ROOT, '.pyodide-cache'),
    stdout: () => {},
    stderr: () => {},
  });
  if (pyodide.version !== PYODIDE_VERSION) {
    throw new Error(`Pyodide у Node ${pyodide.version}, а застосунок вантажить ${PYODIDE_VERSION}`);
  }
  const harness = await readFile(path.join(ROOT, 'src', 'runtime', 'harness.py'), 'utf8');
  pyodide.FS.mkdirTree('/home/pyodide/trainer');
  pyodide.FS.writeFile('/home/pyodide/trainer/trainer_harness.py', harness);
  pyodide.runPython('import sys\nsys.path.insert(0, "/home/pyodide/trainer")\nimport trainer_harness');
  const runJson = pyodide.runPython('trainer_harness.run_json');

  return {
    version: pyodide.version,
    async run(payload) {
      const sources = [payload.code, payload.check, ...(payload.prelude || [])].filter(Boolean).join('\n');
      await pyodide.loadPackagesFromImports(sources, { messageCallback: () => {}, errorCallback: () => {} });
      return JSON.parse(runJson(JSON.stringify(payload)));
    },
  };
}
