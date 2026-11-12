import { useEffect, useState } from 'react';

const ADDED_FEEDBACK_MS = 1500;

/**
 * Id del producto recién agregado, para que su tarjeta muestre "Agregado ✓"
 * un momento. Vive fuera de la tarjeta porque el panel también lo dispara.
 * @returns {[string | null, (productId: string) => void]}
 */
export function useAddedFeedback() {
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (addedId === null) return undefined;

    const timeout = setTimeout(() => setAddedId(null), ADDED_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [addedId]);

  return [addedId, setAddedId];
}
