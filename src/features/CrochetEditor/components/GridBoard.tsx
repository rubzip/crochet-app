import React from 'react';
import type { GridState, InteractionMode } from '../types';

interface GridBoardProps {
    grid: GridState;
    mode: InteractionMode;
    startDrawing: (r: number, c: number) => void;
    continueDrawing: (r: number, c: number) => void;
    stopDrawing: () => void;
}

export const GridBoard: React.FC<GridBoardProps> = ({ grid, mode, startDrawing, continueDrawing, stopDrawing }) => {
    const viewportClass = mode === "Draw" ? "crochet-viewport--draw" : "crochet-viewport--pan";
    const cursorClass = mode === "Draw" ? "crochet-cell--draw" : "crochet-cell--pan";

    return (
        <div
            className={`crochet-viewport ${viewportClass}`}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
        >
            <div
                className="crochet-grid"
                style={{
                    // Estos valores DEBEN ser inline porque son variables matemáticas de estado
                    gridTemplateColumns: `repeat(${grid.width}, 30px)`,
                    gridTemplateRows: `repeat(${grid.height}, 30px)`,
                }}
            >
                {grid.cells.map((row, r) =>
                    row.map((isPainted, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`crochet-cell ${isPainted ? 'crochet-cell--painted' : ''} ${cursorClass}`}
                            onPointerDown={(e) => {
                                if (e.pointerType === 'mouse') e.preventDefault();
                                startDrawing(r, c);
                            }}
                            onPointerEnter={() => continueDrawing(r, c)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};