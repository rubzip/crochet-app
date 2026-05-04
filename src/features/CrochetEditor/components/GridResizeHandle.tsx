import React from 'react';
import type { ResizeDirection } from '../hooks/useGridResizeDrag';

interface GridResizeHandleProps {
    direction: ResizeDirection;
    onPointerDown: (e: React.PointerEvent, direction: ResizeDirection) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
}

export const GridResizeHandle: React.FC<GridResizeHandleProps> = ({
    direction,
    onPointerDown,
    onPointerMove,
    onPointerUp,
}) => {
    const positionClasses = {
        top: "top-0 left-6 right-6 h-6 cursor-row-resize",
        bottom: "bottom-0 left-6 right-6 h-6 cursor-row-resize",
        left: "left-0 top-6 bottom-6 w-6 cursor-col-resize",
        right: "right-0 top-6 bottom-6 w-6 cursor-col-resize",
    }[direction];

    const gripClasses = {
        top: "w-10 h-1.5",
        bottom: "w-10 h-1.5",
        left: "w-1.5 h-10",
        right: "w-1.5 h-10",
    }[direction];

    return (
        <div
            className={`absolute group flex justify-center items-center bg-transparent transition-colors duration-200 hover:bg-black/5 active:bg-blue-500/10 touch-none ${positionClasses}`}
            onPointerDown={(e) => onPointerDown(e, direction)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            <div className={`bg-slate-300 rounded-full transition-transform duration-200 group-hover:scale-110 group-active:scale-110 group-active:bg-blue-400 ${gripClasses}`} />
        </div>
    );
};
