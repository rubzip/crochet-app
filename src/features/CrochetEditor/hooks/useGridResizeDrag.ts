import { useRef, useCallback } from "react";
import type { GridState } from "../types";
import {
    increaseLeft, decreaseLeft, increaseRight, decreaseRight,
    increaseUp, decreaseUp, increaseDown, decreaseDown
} from "../utils/gridResizers";

export type ResizeDirection = 'top' | 'bottom' | 'left' | 'right';

const CELL_SIZE = 30;

export function useGridResizeDrag(
    currentGrid: GridState,
    zoom: number,
    onSaveHistory: () => void,
    onUpdateGrid: (grid: GridState) => void
) {
    const isDragging = useRef<boolean>(false);
    const startPos = useRef<{ x: number, y: number } | null>(null);
    const initialGrid = useRef<GridState | null>(null);
    const dragDirection = useRef<ResizeDirection | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent, direction: ResizeDirection) => {
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        initialGrid.current = currentGrid;
        dragDirection.current = direction;
        
        onSaveHistory(); // Save snapshot BEFORE the resize starts

        // Prevent default text selection/drag behaviors
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [currentGrid, onSaveHistory]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current || !startPos.current || !initialGrid.current || !dragDirection.current) return;

        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;
        
        const zoomedCellSize = CELL_SIZE * zoom;
        let deltaCells = 0;
        let increaseFn: (g: GridState) => GridState;
        let decreaseFn: (g: GridState) => GridState;

        switch (dragDirection.current) {
            case 'left':
                deltaCells = Math.round(-deltaX / zoomedCellSize);
                increaseFn = increaseLeft;
                decreaseFn = decreaseLeft;
                break;
            case 'right':
                deltaCells = Math.round(deltaX / zoomedCellSize);
                increaseFn = increaseRight;
                decreaseFn = decreaseRight;
                break;
            case 'top':
                deltaCells = Math.round(-deltaY / zoomedCellSize);
                increaseFn = increaseUp;
                decreaseFn = decreaseUp;
                break;
            case 'bottom':
                deltaCells = Math.round(deltaY / zoomedCellSize);
                increaseFn = increaseDown;
                decreaseFn = decreaseDown;
                break;
        }

        let newGrid = initialGrid.current;
        if (deltaCells > 0) {
            for (let i = 0; i < deltaCells; i++) newGrid = increaseFn(newGrid);
        } else if (deltaCells < 0) {
            for (let i = 0; i < Math.abs(deltaCells); i++) newGrid = decreaseFn(newGrid);
        }

        onUpdateGrid(newGrid);
    }, [zoom, onUpdateGrid]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (isDragging.current) {
            isDragging.current = false;
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            
            startPos.current = null;
            initialGrid.current = null;
            dragDirection.current = null;
        }
    }, []);

    return { handlePointerDown, handlePointerMove, handlePointerUp };
}
