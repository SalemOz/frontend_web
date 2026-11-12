import { useEffect } from 'react';
import { business } from '../data/business.js';

/** Título de la pestaña mientras la página está montada; al salir se restaura. */
export function useDocumentTitle(pageName) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${pageName} | ${business.name}`;
    return () => {
      document.title = previousTitle;
    };
  }, [pageName]);
}
