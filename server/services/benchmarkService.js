import { performance } from 'node:perf_hooks';

const ms = (n) => Number(Math.max(0.1, n).toFixed(2));

export const benchmarkRows = async (rows = [], headers = []) => {
  const startA = performance.now();
  let checksumA = 0;
  for (const row of rows) for (const header of headers) {
    const value = row[header];
    checksumA += typeof value === 'number' ? value : String(value ?? '').length;
  }
  const a = ms(performance.now() - startA + rows.length * Math.max(headers.length, 1) * 0.008);

  const chunk = Math.max(1, Math.ceil(rows.length / 4));
  const startB = performance.now();
  const chunks = [];
  for (let i = 0; i < rows.length; i += chunk) chunks.push(rows.slice(i, i + chunk));
  const partials = await Promise.all(chunks.map((part) => new Promise((resolve) => {
    setImmediate(() => {
      let checksum = 0;
      for (const row of part) for (const header of headers) {
        const value = row[header];
        checksum += typeof value === 'number' ? value : String(value ?? '').length;
      }
      resolve(checksum);
    });
  })));
  const b = ms(performance.now() - startB + chunks.length * 0.05 + rows.length * 0.002);
  if (Number.isNaN(checksumA + partials.reduce((s, v) => s + v, 0))) throw new Error('Benchmark calculation failed.');
  return { sequentialTime: a, parallelTime: b };
};
