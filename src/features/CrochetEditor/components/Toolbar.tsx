import React, { useState, useEffect } from 'react';
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
    gridWidth: number;
    gridHeight: number;
    onResizeSubmit: (w: number, h: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
    mode, setMode, undo, redo, canUndo, canRedo, 
    zoom, zoomIn, zoomOut, resetZoom,
    gridWidth, gridHeight, onResizeSubmit
}) => {
    const [inputW, setInputW] = useState(gridWidth.toString());
    const [inputH, setInputH] = useState(gridHeight.toString());

    // Sync local input state with actual grid dimensions if changed externally
    useEffect(() => {
        setInputW(gridWidth.toString());
        setInputH(gridHeight.toString());
    }, [gridWidth, gridHeight]);

    const handleResizeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const w = parseInt(inputW, 10);
        const h = parseInt(inputH, 10);
        if (!isNaN(w) && !isNaN(h)) {
            onResizeSubmit(w, h);
        }
    };

    return (
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
            {/* Draw/Pan Modes */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "Pan" ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setMode("Pan")}
                >
                    🖐 Pan
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "Draw" ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setMode("Draw")}
                >
                    ✏️ Draw
                </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

            {/* Dimension Inputs */}
            <form onSubmit={handleResizeSubmit} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-2 hidden sm:inline">Size:</span>
                <input 
                    type="number" 
                    value={inputW} 
                    onChange={e => setInputW(e.target.value)} 
                    className="w-14 px-2 py-1 text-sm bg-white border border-slate-200 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                />
                <span className="text-slate-400 font-medium">×</span>
                <input 
                    type="number" 
                    value={inputH} 
                    onChange={e => setInputH(e.target.value)} 
                    className="w-14 px-2 py-1 text-sm bg-white border border-slate-200 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                />
                <button type="submit" className="px-3 py-1 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-medium rounded transition-all shadow-sm">
                    Apply
                </button>
            </form>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

            {/* Zoom Controls */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 rounded-md transition-all" onClick={zoomOut}>-</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-white active:scale-95 rounded-md transition-all" onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
                <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 rounded-md transition-all" onClick={zoomIn}>+</button>
            </div>

            <div className="flex-1"></div>

            {/* Undo/Redo */}
            <div className="flex gap-2">
                <button 
                    onClick={undo} 
                    disabled={!canUndo}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:active:scale-100 active:scale-95 text-slate-700 text-sm font-medium rounded-lg transition-all"
                >
                    ↩️ Undo
                </button>
                <button 
                    onClick={redo} 
                    disabled={!canRedo}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:active:scale-100 active:scale-95 text-slate-700 text-sm font-medium rounded-lg transition-all"
                >
                    ↪️ Redo
                </button>
            </div>
        </div>
    );
};