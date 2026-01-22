export function createUTCDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}
