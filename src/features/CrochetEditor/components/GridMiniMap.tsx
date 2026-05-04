import React, { useRef, useEffect } from 'react';
import type { GridState } from '../types';

interface GridMinimapProps {
  grid: GridState;
  maxWidth?: number; // Ancho máximo en píxeles que ocupará el minimapa
}

export const GridMinimap: React.FC<GridMinimapProps> = ({ grid, maxWidth = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculamos dinámicamente el tamaño de la celda. 
  // Nunca será menor a 1px, ni mayor a 4px (para que no parezca gigante si el grid es pequeño de 5x5).
  const cellSize = Math.max(1, Math.min(4, Math.floor(maxWidth / grid.width)));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiamos el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pintamos el fondo (puedes ajustarlo al color de tu interfaz)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Para el minimapa, POR RENDIMIENTO, solo dibujamos las celdas que están pintadas (negras)
    ctx.fillStyle = '#333';
    
    for (let r = 0; r < grid.height; r++) {
      for (let c = 0; c < grid.width; c++) {
        if (grid.cells[r][c]) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [grid, cellSize]); // Se actualiza solo si cambia el grid o el tamaño calculado

  return (
    <div 
      style={{
        border: '2px solid #cbd5e1',
        borderRadius: '6px',
        overflow: 'hidden',
        display: 'flex', // Centra el canvas si es muy pequeño
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        padding: '4px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={grid.width * cellSize}
        height={grid.height * cellSize}
        style={{ display: 'block' }}
      />
    </div>
  );
};