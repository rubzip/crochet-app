import React, { useState } from 'react';
import './CrochetEditor.css'; // Importamos la hoja de estilos
import type { InteractionMode, GridState } from './types';
import { useHistory } from './hooks/useHistory';
import { useGridDrawing } from './hooks/useGridDrawing';
import { Toolbar } from './components/Toolbar';
import { GridBoard } from './components/GridBoard';
import {
    increaseLeft, increaseRight, increaseUp, increaseDown,
    decreaseLeft, decreaseRight, decreaseUp, decreaseDown
} from './utils/gridResizers';

const generateEmptyGrid = (w: number, h: number): GridState => ({
    width: w, height: h, cells: Array.from({ length: h }, () => Array(w).fill(false))
});

export const CrochetEditor: React.FC = () => {
    const { current: grid, saveState, updatePresentWithoutHistory, undo, redo, canUndo, canRedo } = useHistory<GridState>(generateEmptyGrid(15, 15));
    const [mode, setMode] = useState<InteractionMode>("Draw");

    const saveHistorySnapshot = () => saveState(grid);

    const { startDrawing, continueDrawing, stopDrawing } = useGridDrawing(
        grid, mode, saveHistorySnapshot, updatePresentWithoutHistory
    );

    const applyResize = (resizeFn: (g: GridState) => GridState) => {
        const newGrid = resizeFn(grid);
        if (newGrid !== grid) saveState(newGrid);
    };

    return (
        <div className="crochet-editor">
            <Toolbar
                mode={mode} setMode={setMode}
                undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
            />

            <div className="crochet-layout">
                <div className="crochet-controls-v">
                    <button className="crochet-btn" onClick={() => applyResize(increaseLeft)}>+ Izq</button>
                    <button className="crochet-btn" onClick={() => applyResize(decreaseLeft)}>- Izq</button>
                </div>

                <div className="crochet-board-wrapper">
                    <div className="crochet-controls-h">
                        <button className="crochet-btn" onClick={() => applyResize(increaseUp)}>+ Arriba</button>
                        <button className="crochet-btn" onClick={() => applyResize(decreaseUp)}>- Arriba</button>
                    </div>

                    <GridBoard
                        grid={grid} mode={mode}
                        startDrawing={startDrawing} continueDrawing={continueDrawing} stopDrawing={stopDrawing}
                    />

                    <div className="crochet-controls-h">
                        <button className="crochet-btn" onClick={() => applyResize(increaseDown)}>+ Abajo</button>
                        <button className="crochet-btn" onClick={() => applyResize(decreaseDown)}>- Abajo</button>
                    </div>
                </div>

                <div className="crochet-controls-v">
                    <button className="crochet-btn" onClick={() => applyResize(increaseRight)}>+ Der</button>
                    <button className="crochet-btn" onClick={() => applyResize(decreaseRight)}>- Der</button>
                </div>
            </div>
        </div>
    );
};