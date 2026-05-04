import React from 'react';
import type { InteractionMode } from '../types';

interface ToolbarProps {
    mode: InteractionMode;
    setMode: (mode: InteractionMode) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    zoom: number;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

// Single Responsibility Principle: Renders the top control bar
export const Toolbar: React.FC<ToolbarProps> = ({ mode, setMode, undo, redo, canUndo, canRedo, zoom, zoomIn, zoomOut, resetZoom }) => (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '5px' }}>
            <button
                style={{ padding: '10px', backgroundColor: mode === "Pan" ? '#ddd' : '#fff' }}
                onClick={() => setMode("Pan")}
            >🖐 Pan</button>
            <button
                style={{ padding: '10px', backgroundColor: mode === "Draw" ? '#ddd' : '#fff' }}
                onClick={() => setMode("Draw")}
            >✏️ Draw</button>
        </div>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '5px' }}>
            <button style={{ padding: '10px', backgroundColor: '#fff', border: 'none', borderRight: '1px solid #ccc' }} onClick={zoomOut}>-</button>
            <button style={{ padding: '10px', backgroundColor: '#fff', border: 'none', borderRight: '1px solid #ccc' }} onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
            <button style={{ padding: '10px', backgroundColor: '#fff', border: 'none' }} onClick={zoomIn}>+</button>
        </div>
        <button onClick={undo} disabled={!canUndo}>↩️ Undo</button>
        <button onClick={redo} disabled={!canRedo}>↪️ Redo</button>
    </div>
);