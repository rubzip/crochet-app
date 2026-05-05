import React, { useRef, useEffect, useCallback } from 'react';
import type { GridState, InteractionMode } from '../types';

interface GridBoardProps {
  grid: GridState;
  mode: InteractionMode;
  startDrawing: (r: number, c: number) => void;
  continueDrawing: (r: number, c: number) => void;
  stopDrawing: () => void;
  zoom: number;
}

const CELL_SIZE = 28;
const COLORS = {
  grid: '#e2e8f0',
  filled: '#334155',
  empty: '#ffffff',
  hover: '#f1f5f9',
  current: '#3b82f6',
  currentOutline: '#60a5fa',
};

export const GridBoard: React.FC<GridBoardProps> = ({ 
  grid, mode, startDrawing, continueDrawing, stopDrawing, zoom 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. EL MOTOR DE RENDERIZADO
  // Este useEffect se ejecuta cada vez que el estado 'grid' cambia
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiamos el lienzo entero antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.grid;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const zoomedCellSize = CELL_SIZE * zoom;
    for (let r = 0; r < grid.height; r++) {
      for (let c = 0; c < grid.width; c++) {
        const isPainted = grid.cells[r][c];
        
        const x = c * zoomedCellSize + 1;
        const y = r * zoomedCellSize + 1;
        const size = zoomedCellSize - 2;

        ctx.fillStyle = isPainted ? COLORS.filled : COLORS.empty;
        ctx.fillRect(x, y, size, size);
      }
    }
  }, [grid, zoom]); // Solo redibuja cuando la matriz o el zoom cambia

  // 2. Coordinate translator
  const getCellFromEvent = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Obtenemos la posición exacta del canvas en la pantalla
    const rect = canvas.getBoundingClientRect();
    
    // Calculamos dónde hizo clic relativo a la esquina superior izquierda del canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Dividimos por el tamaño de la celda con zoom y redondeamos hacia abajo para obtener el índice
    const zoomedCellSize = CELL_SIZE * zoom;
    const c = Math.floor(x / zoomedCellSize);
    const r = Math.floor(y / zoomedCellSize);

    // Verificación de seguridad por si el ratón se sale un píxel
    if (r < 0 || r >= grid.height || c < 0 || c >= grid.width) return null;

    return { r, c };
  }, [grid.width, grid.height, zoom]);

  // 3. Event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse') e.preventDefault(); // Evita comportamientos raros del ratón
    const cell = getCellFromEvent(e);
    if (cell) startDrawing(cell.r, cell.c);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Si no estamos en modo dibujo, ignoramos el movimiento sobre el canvas
    if (mode !== 'Draw') return;
    
    const cell = getCellFromEvent(e);
    // Usamos continueDrawing. El hook interno (useGridDrawing) ya se encarga 
    // de ignorarlo si isDrawing es false.
    if (cell) continueDrawing(cell.r, cell.c);
  };

  return (
    <div 
      className={`crochet-viewport ${mode === "Draw" ? "crochet-viewport--draw" : "crochet-viewport--pan"}`}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
    >
      <canvas
        ref={canvasRef}
        width={grid.width * CELL_SIZE * zoom}
        height={grid.height * CELL_SIZE * zoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          cursor: mode === 'Draw' ? 'crosshair' : 'grab',
          // Esto es vital para que el navegador no intente arrastrar la "imagen" del canvas
          userSelect: 'none',
          WebkitUserSelect: 'none' 
        }}
      />
    </div>
  );
};