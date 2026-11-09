// Завантаження контенту в Node у тому самому порядку, що й import.meta.glob у застосунку.
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './node-runtime.mjs';
import { sortByFile } from '../../src/content/order.js';

async function loadDir(dir) {
  const abs = path.join(ROOT, 'src', 'content', dir);
  const files = (await readdir(abs)).filter((f) => f.endsWith('.js'));
  const entries = await Promise.all(
    files.map(async (f) => [`./${dir}/${f}`, await import(pathToFileURL(path.join(abs, f)).href)]),
  );
  return sortByFile(Object.fromEntries(entries));
}

export async function loadContent() {
  return { modules: await loadDir('lessons'), levels: await loadDir('practice') };
}
