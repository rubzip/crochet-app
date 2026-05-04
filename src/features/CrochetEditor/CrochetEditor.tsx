import React, { useState } from 'react';
import type { InteractionMode, GridState } from './types';
import { useHistory } from './hooks/useHistory';
import { useGridDrawing } from './hooks/useGridDrawing';
import { useGridResizeDrag } from './hooks/useGridResizeDrag';
import { useZoom } from './hooks/useZoom';
import { Toolbar } from './components/Toolbar';
import { GridBoard } from './components/GridBoard';
import { GridMinimap } from './components/GridMiniMap';
import { GridResizeHandle } from './components/GridResizeHandle';
import { resizeToExactDimensions } from './utils/gridResizers';

const generateEmptyGrid = (w: number, h: number): GridState => ({
    width: w, height: h, cells: Array.from({ length: h }, () => Array(w).fill(false))
});

export const CrochetEditor: React.FC = () => {
    // History con auto-save en localStorage
    const { current: grid, saveState, updatePresentWithoutHistory, undo, redo, canUndo, canRedo } = useHistory<GridState>(generateEmptyGrid(15, 15), "crochet_editor_grid");
    const [mode, setMode] = useState<InteractionMode>("Draw");
    const { zoom, zoomIn, zoomOut, resetZoom } = useZoom(1);

    const saveHistorySnapshot = () => saveState(grid);

    const { startDrawing, continueDrawing, stopDrawing } = useGridDrawing(
        grid, mode, saveHistorySnapshot, updatePresentWithoutHistory
    );

    const { handlePointerDown, handlePointerMove, handlePointerUp } = useGridResizeDrag(
        grid, zoom, saveHistorySnapshot, updatePresentWithoutHistory
    );

    const handleExactResize = (newW: number, newH: number) => {
        const newGrid = resizeToExactDimensions(grid, newW, newH);
        if (newGrid !== grid) {
            saveState(newGrid);
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen bg-slate-50 font-sans">
            <div className="max-w-5xl mx-auto">
                <Toolbar
                    mode={mode} setMode={setMode}
                    undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
                    zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom}
                    gridWidth={grid.width} gridHeight={grid.height} onResizeSubmit={handleExactResize}
                />
                
                <div className="flex justify-center mb-8">
                    <GridMinimap grid={grid} />
                </div>

                <div className="flex justify-center w-full overflow-hidden">
                    <div className="relative inline-flex p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                        <GridResizeHandle direction="top" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
                        <GridResizeHandle direction="bottom" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
                        <GridResizeHandle direction="left" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
                        <GridResizeHandle direction="right" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />

                        <div className="flex flex-col items-center gap-2">
                            <GridBoard
                                grid={grid} mode={mode} zoom={zoom}
                                startDrawing={startDrawing} continueDrawing={continueDrawing} stopDrawing={stopDrawing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};