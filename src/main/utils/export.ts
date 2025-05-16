import fs from 'fs';

export function exportCSV<T extends Record<string, unknown>>(
  data: T[],
  filePath = 'output.csv'
): void {
  if (data.length === 0) throw new Error('El array de datos está vacío');
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data
    .map(obj =>
      Object.values(obj)
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  fs.writeFileSync(filePath, '\uFEFF' + header + rows, 'utf8');
}