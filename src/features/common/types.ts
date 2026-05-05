export type CellValue = boolean;

export interface GridState {
    width: number;
    height: number;
    cells: CellValue[][];
}
