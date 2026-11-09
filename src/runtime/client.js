// Клієнт Python-воркера: черга запусків, тайм-аут з перезапуском, стан для індикатора.

const TIMEOUT_MS = 12000;

export function createRunner({ onStatus = () => {} } = {}) {
  let worker = null;
  let seq = 0;
  let current = null;
  const queue = [];
  let status = { state: 'idle', detail: '' };

  const setStatus = (next) => {
    status = next;
    onStatus(status);
  };

  function spawn() {
    worker = new Worker(new URL('./py.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => handle(data);
    worker.onerror = (event) => {
      setStatus({ state: 'failed', detail: event.message || 'Воркер Python не запустився' });
      if (current) finish({ infraError: 'Python не запустився. Перевір інтернет: Pyodide вантажиться з CDN.' });
    };
  }

  function handle(msg) {
    if (msg.type === 'status') {
      setStatus({ state: msg.state, detail: msg.detail });
      if (msg.state === 'failed' && current) {
        finish({ infraError: `Python не завантажився: ${msg.detail}. Перевір підключення до інтернету.` });
      }
      return;
    }
    if (!current || msg.id !== current.id) return;
    if (msg.type === 'started') {
      setStatus({ state: 'running', detail: 'Виконую' });
      current.timer = setTimeout(onTimeout, current.timeoutMs);
    } else if (msg.type === 'result') {
      setStatus({ state: 'ready', detail: status.detail === 'Виконую' ? 'Готово' : status.detail });
      finish({ result: msg.result });
    } else if (msg.type === 'failed') {
      setStatus({ state: 'ready', detail: 'Готово' });
      finish({ infraError: msg.message });
    }
  }

  function onTimeout() {
    worker.terminate();
    // Новий воркер до finish: finish одразу віддає наступне завдання з черги.
    spawn();
    setStatus({ state: 'loading', detail: 'Перезапускаю Python' });
    const seconds = Math.round(current.timeoutMs / 1000);
    finish({
      result: {
        stdout: '',
        stderr: '',
        error: `TimeoutError: код виконувався довше ${seconds} с і був зупинений`,
        errorType: 'TimeoutError',
        errorLine: null,
        check: null,
        images: [],
        truncated: false,
      },
    });
  }

  function finish(outcome) {
    const job = current;
    current = null;
    clearTimeout(job.timer);
    job.resolve(outcome);
    pump();
  }

  function pump() {
    if (current || !queue.length) return;
    current = queue.shift();
    worker.postMessage({ type: 'run', id: current.id, payload: current.payload });
  }

  spawn();

  return {
    get status() {
      return status;
    },
    /** Повертає { result } або { infraError }. */
    run(payload, { timeoutMs = TIMEOUT_MS } = {}) {
      return new Promise((resolve) => {
        seq += 1;
        queue.push({ id: seq, payload, resolve, timeoutMs, timer: null });
        pump();
      });
    },
    /** Завантажити бібліотеки наперед, щоб перший запуск уроку pandas не чекав. */
    prefetch(source) {
      if (source) worker.postMessage({ type: 'prefetch', source });
    },
  };
}
