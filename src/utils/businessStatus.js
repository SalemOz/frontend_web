import { business } from '../data/business.js';
import { formatHour, isOpenAt, minutesUntilChange } from './hours.js';

/** 292 → '4 h 52 min'; 45 → '45 min'. */
const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
};

/**
 * Estado del local en la hora de Colombia (business.hours.timezone), no la del navegador.
 * @param {Date} [now]
 * @param {{ open: string, close: string, timezone: string }} [hours]
 * @returns {{ isOpen: boolean, minutesToChange: number, label: string }}
 */
export const getBusinessStatus = (now = new Date(), hours = business.hours) => {
  const isOpen = isOpenAt(hours, now);
  const minutesToChange = minutesUntilChange(hours, now);
  const wait = formatDuration(minutesToChange);

  return {
    isOpen,
    minutesToChange,
    label: isOpen
      ? `Abierto, cierra en ${wait}`
      : `Cerrado, abre a las ${formatHour(hours.open)} (en ${wait})`,
  };
};
