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
        <div className="flex flex-wrap gap-3 items-center mb-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "Pan" ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setMode("Pan")}
                >
                    Mover
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "Draw" ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setMode("Draw")}
                >
                    Pintar
                </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

            <form onSubmit={handleResizeSubmit} className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Ancho</label>
                <input 
                    type="number" 
                    value={inputW} 
                    onChange={e => setInputW(e.target.value)} 
                    className="w-12 px-2 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span className="text-slate-400">×</span>
                <label className="text-xs font-medium text-slate-500">Alto</label>
                <input 
                    type="number" 
                    value={inputH} 
                    onChange={e => setInputH(e.target.value)} 
                    className="w-12 px-2 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button type="submit" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-medium rounded-md transition-all">
                    Aplicar
                </button>
            </form>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 rounded-md transition-all" onClick={zoomOut}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <button className="min-w-[3.5rem] h-8 flex items-center justify-center text-xs font-semibold text-slate-700 hover:bg-white active:scale-95 rounded-md transition-all" onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white active:scale-95 rounded-md transition-all" onClick={zoomIn}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            <div className="flex-1"></div>

            {/* Undo/Redo */}
            <div className="flex gap-1.5">
                <button 
                    onClick={undo} 
                    disabled={!canUndo}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed active:scale-95 text-slate-700 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 0 1 5 5v2M3 10l4-4m-4 4l4 4" /></svg>
                    Deshacer
                </button>
                <button 
                    onClick={redo} 
                    disabled={!canRedo}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed active:scale-95 text-slate-700 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                >
                    Rehacer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a5 5 0 0 0-5 5v2m15-7l-4-4m4 4l-4 4" /></svg>
                </button>
            </div>
        </div>
    );
};