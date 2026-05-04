export type CellValue = boolean;

export const MAX_SIZE = 1000;
export const MIN_SIZE = 4;

export interface GridState {
    width: number;
    height: number;
    cells: CellValue[][];
}

export type InteractionMode = "Draw" | "Pan";
export type DragAction = "Erase" | "Paint" | null;