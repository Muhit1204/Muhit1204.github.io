export function readLocalClock(date = new Date(), timeZone?: string) {
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone,
  }).format(date);
  const zone = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(date).find(part => part.type === 'timeZoneName')?.value ?? 'local';
  return { time, zone, dateTime: date.toISOString() };
}
export type ClockReading = ReturnType<typeof readLocalClock>;
