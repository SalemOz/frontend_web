// Abierto o cerrado según la hora del local (no la del celular de quien mira).

const toMinutes = (hhmm) => {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesInZone = (date, timeZone) => {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  return toMinutes(time);
};

/**
 * @param {{ open: string, close: string, timezone: string }} hours horario 'HH:MM'
 * @param {Date} [now]
 * @returns {boolean}
 */
export const isOpenAt = (hours, now = new Date()) => {
  const current = minutesInZone(now, hours.timezone);
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);

  // Un horario que pasa de medianoche (p. ej. 17:00–02:00) se parte en dos tramos.
  return open <= close
    ? current >= open && current < close
    : current >= open || current < close;
};
