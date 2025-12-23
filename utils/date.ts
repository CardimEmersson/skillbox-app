

export function convertDateToIso(date: string): string {
  if (!date) return "";

  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function convertIsoToDate(date: string): string {
  if (!date) return "";

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}