import { useState, useCallback } from 'react';

export const useZoom = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);

  // Constants to prevent breaking the UI
  const MAX_ZOOM = 3.0; // 300%
  const MIN_ZOOM = 0.3; // 30%
  const ZOOM_STEP = 0.2; // How much it zooms per click

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  return { zoom, zoomIn, zoomOut, resetZoom };
};