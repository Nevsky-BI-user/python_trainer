// Порядок модулів і рівнів: за іменем файлу з природним сортуванням (m9 перед m10).
export function sortByFile(globResult) {
  return Object.keys(globResult)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((key) => globResult[key].default);
}
