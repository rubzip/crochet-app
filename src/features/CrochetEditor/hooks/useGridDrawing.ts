import { useRef, useCallback } from "react";
import type { GridState, InteractionMode, DragAction } from "../types";

// Dependency Inversion: Relies on injected callbacks to update state
export function useGridDrawing(
    currentGrid: GridState,
    mode: InteractionMode,
    onSaveHistory: () => void,
    onUpdateGrid: (newGrid: GridState) => void
) {
    const isDrawing = useRef<boolean>(false);
    const dragAction = useRef<DragAction>(null);

    const applyDraw = useCallback((r: number, c: number, action: DragAction) => {
        const targetValue = action === "Paint";
        if (currentGrid.cells[r][c] === targetValue) return;

        const newCells = currentGrid.cells.map((row, rowIndex) =>
            rowIndex === r
                ? row.map((cell, colIndex) => (colIndex === c ? targetValue : cell))
                : row
        );

        onUpdateGrid({ ...currentGrid, cells: newCells });
    }, [currentGrid, onUpdateGrid]);

    const startDrawing = useCallback((r: number, c: number) => {
        if (mode !== "Draw") return;
        isDrawing.current = true;
        dragAction.current = currentGrid.cells[r][c] ? "Erase" : "Paint";

        onSaveHistory(); // Save snapshot before stroke begins
        applyDraw(r, c, dragAction.current);
    }, [mode, currentGrid, onSaveHistory, applyDraw]);

    const continueDrawing = useCallback((r: number, c: number) => {
        if (!isDrawing.current || !dragAction.current || mode !== "Draw") return;
        applyDraw(r, c, dragAction.current);
    }, [mode, applyDraw]);

    const stopDrawing = useCallback(() => {
        isDrawing.current = false;
        dragAction.current = null;
    }, []);

    return { startDrawing, continueDrawing, stopDrawing };
}