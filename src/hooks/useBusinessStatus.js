import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBusinessStatus } from '../utils/businessStatus.js';

const REFRESH_MS = 30_000;

// Simulación para demos: ?estado=abierto | cerrado fija el estado (se guarda en la
// pestaña para sobrevivir a la navegación interna); ?estado=real vuelve a la hora real.
const SIMULATION_KEY = 'delicias.estadoSimulado.v1';
const SIMULATED_TIMES = {
  abierto: '2026-01-01T19:30:00-05:00', // 7:30 p. m. en Bogotá
  cerrado: '2026-01-01T15:00:00-05:00', // 3:00 p. m. en Bogotá
};

const isSimulation = (value) => typeof value === 'string' && Object.hasOwn(SIMULATED_TIMES, value);

const readStoredSimulation = () => {
  try {
    return window.sessionStorage.getItem(SIMULATION_KEY);
  } catch {
    return null;
  }
};

const writeStoredSimulation = (value) => {
  try {
    if (value) window.sessionStorage.setItem(SIMULATION_KEY, value);
    else window.sessionStorage.removeItem(SIMULATION_KEY);
  } catch {
    // Sin sessionStorage (modo privado estricto): la simulación dura solo mientras está en la URL.
  }
};

/** Estado del local (abierto/cerrado), actualizado cada 30 s. */
export function useBusinessStatus() {
  const [searchParams] = useSearchParams();
  const [now, setNow] = useState(() => new Date());
  const param = searchParams.get('estado');

  let simulation = readStoredSimulation();
  if (param === 'real') simulation = null;
  if (isSimulation(param)) simulation = param;
  if (!isSimulation(simulation)) simulation = null;

  useEffect(() => {
    if (param === 'real' || isSimulation(param)) writeStoredSimulation(simulation);
  }, [param, simulation]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  return getBusinessStatus(simulation ? new Date(SIMULATED_TIMES[simulation]) : now);
}
