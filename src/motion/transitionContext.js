import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const TransitionContext = createContext(null);

/** navigate() con cortina cuando cambia la página (sin proveedor, navigate normal). */
export function useTransitionNavigate() {
  const go = useContext(TransitionContext);
  const navigate = useNavigate();
  return go ?? navigate;
}
