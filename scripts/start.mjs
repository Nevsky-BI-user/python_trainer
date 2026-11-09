// Запуск тренажера одним кліком: ярлик на робочому столі (scripts/shortcut.ps1) або
//   npm start                  зібрати за потреби, підняти сервер і відкрити вікно застосунку
//   npm start -- --no-open     те саме без вікна
//
// dist збирається, лише коли код новіший за збірку. Сервер vite preview стоїть на сталому
// порту, поки відкрите вікно консолі. Якщо тренажер уже працює, відкривається ще одне вікно.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Порт сталий: прогрес і код учня лежать у localStorage, а він прив'язаний до адреси з портом.
const PORT = 5317;
const APP_URL = `http://localhost:${PORT}/`;
const SOURCES = ['src', 'index.html', 'vite.config.js', 'package-lock.json'];
const LOCK = join(ROOT, '.local', 'start.lock');
const LOCK_MS = 5 * 60_000;
const noOpen = process.argv.includes('--no-open');

process.title = 'Python тренажер';
process.chdir(ROOT);

try {
  if (await isTrainer()) {
    openApp();
  } else if (takeLock()) {
    await serve();
  } else {
    // Інший запуск саме збирає чи піднімає сервер: дочекатися його, а не збирати вдруге.
    console.log('Тренажер уже запускається в іншому вікні, чекаю.');
    if (!(await waitTrainer(LOCK_MS))) {
      rmSync(LOCK, { force: true });
      throw new Error('Тренажер не запустився за 5 хвилин. Закрийте інші вікна тренажера і спробуйте ще раз.');
    }
    openApp();
  }
} catch (err) {
  console.error(`\n${err.message}`);
  if (process.stdin.isTTY) {
    console.error('\nНатисніть Enter, щоб закрити вікно.');
    await new Promise((resolve) => process.stdin.once('data', resolve));
  }
  process.exit(1);
}

async function serve() {
  try {
    if (stale(join('node_modules', '.package-lock.json'), ['package-lock.json'])) {
      console.log('Ставлю залежності: npm ci');
      if (spawnSync('npm ci', { shell: true, stdio: 'inherit' }).status !== 0) throw new Error('npm ci завершився з помилкою.');
    }
    const { build, preview } = await import('vite');
    if (stale(join('dist', 'index.html'), SOURCES)) {
      console.log('Збираю застосунок.');
      await build({ logLevel: 'warn' });
    }
    try {
      await preview({ logLevel: 'warn', preview: { port: PORT, strictPort: true } });
    } catch (err) {
      if (!/already in use/.test(err.message)) throw err;
      if (!(await isTrainer())) throw new Error(`Порт ${PORT} зайнятий іншою програмою. Закрийте її і запустіть тренажер знову.`);
      return openApp();
    }
  } finally {
    rmSync(LOCK, { force: true });
  }
  console.log(`Тренажер працює: ${APP_URL}`);
  console.log('Закрийте це вікно, щоб зупинити сервер.');
  openApp();
}

/** На порту відповідає саме тренажер, а не інша програма. */
async function isTrainer() {
  try {
    const res = await fetch(APP_URL, { signal: AbortSignal.timeout(1500) });
    return (await res.text()).includes('<title>Python тренажер</title>');
  } catch {
    return false;
  }
}

async function waitTrainer(ms) {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 500))) {
    if (await isTrainer()) return true;
  }
  return false;
}

/** Ціль застаріла: її немає або щось із джерел змінилося пізніше. */
function stale(target, sources) {
  if (!existsSync(target)) return true;
  const built = statSync(target).mtimeMs;
  return sources.filter((p) => existsSync(p)).some((p) => newest(p) > built);
}

function newest(path) {
  const st = statSync(path);
  if (!st.isDirectory()) return st.mtimeMs;
  return Math.max(st.mtimeMs, ...readdirSync(path).map((name) => newest(join(path, name))));
}

/**
 * Замок на час збирання і запуску: другий швидкий клік чекає перший, а не збирає dist
 * разом із ним. Замок закритого вікна (мертвий процес) чи давній замок забирається.
 */
function takeLock() {
  mkdirSync(dirname(LOCK), { recursive: true });
  try {
    writeFileSync(LOCK, String(process.pid), { flag: 'wx' });
    return true;
  } catch {
    const pid = Number(readFileSync(LOCK, 'utf8'));
    if (alive(pid) && Date.now() - statSync(LOCK).mtimeMs < LOCK_MS) return false;
    writeFileSync(LOCK, String(process.pid));
    return true;
  }
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === 'EPERM';
  }
}

/** Окреме вікно застосунку в Edge; без Edge відкривається браузер за замовчуванням. */
function openApp() {
  if (noOpen || process.platform !== 'win32') return;
  const edge = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA]
    .filter(Boolean)
    .map((dir) => join(dir, 'Microsoft', 'Edge', 'Application', 'msedge.exe'))
    .find((p) => existsSync(p));
  const [cmd, args] = edge ? [edge, [`--app=${APP_URL}`]] : ['explorer.exe', [APP_URL]];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}
