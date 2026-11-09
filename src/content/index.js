import { sortByFile } from './order.js';

// Новий модуль чи рівень: просто покласти файл у lessons/ або practice/.
export const modules = sortByFile(import.meta.glob('./lessons/*.js', { eager: true }));
export const levels = sortByFile(import.meta.glob('./practice/*.js', { eager: true }));
