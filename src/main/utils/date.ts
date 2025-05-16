export function toISO(d?: string | Date | null) {
    return d ? new Date(d).toISOString() : undefined;
}

export function formatToView(date?: string | Date | null): string {
  let result = '';

  if (date) {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const seconds = d.getUTCSeconds();

      const hasTime = hours !== 0 || minutes !== 0 || seconds !== 0;

      if (hasTime) {
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        result = `${year}-${month}-${day}T${hh}:${mm}:${ss}`;
      } else {
        result = `${year}-${month}-${day}`;
      }
    }
  }

  return result;
}

export function formatLocalDate(s?: string | null): string | undefined {
  let result: string | undefined;

  if (s) {
    const date = new Date(s);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    result = `${day}/${month}/${year}`;
  } else result = undefined;
  
  return result;
}

export async function formatObjectLD(employee: any) {
    for (const [key, value] of Object.entries(employee)) 
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
        employee[key] = formatLocalDate(value);
    return employee;
}