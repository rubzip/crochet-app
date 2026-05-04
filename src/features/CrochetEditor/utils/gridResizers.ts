import type { GridState } from '../types';
import { MAX_SIZE, MIN_SIZE } from '../types';


export const increaseLeft = (grid: GridState): GridState => {
    if (grid.width >= MAX_SIZE) return grid;
    return {
        width: grid.width + 1,
        height: grid.height,
        cells: grid.cells.map(row => [false, ...row]),
    };
};

export const increaseRight = (grid: GridState): GridState => {
    if (grid.width >= MAX_SIZE) return grid;
    return {
        width: grid.width + 1,
        height: grid.height,
        cells: grid.cells.map(row => [...row, false]),
    };
};

export const increaseUp = (grid: GridState): GridState => {
    if (grid.height >= MAX_SIZE) return grid;
    const newRow = Array(grid.width).fill(false);
    return {
        width: grid.width,
        height: grid.height + 1,
        cells: [newRow, ...grid.cells],
    };
};

export const increaseDown = (grid: GridState): GridState => {
    if (grid.height >= MAX_SIZE) return grid;
    const newRow = Array(grid.width).fill(false);
    return {
        width: grid.width,
        height: grid.height + 1,
        cells: [...grid.cells, newRow],
    };
};

export const decreaseLeft = (grid: GridState): GridState => {
    if (grid.width <= MIN_SIZE) return grid;
    return {
        width: grid.width - 1,
        height: grid.height,
        cells: grid.cells.map(row => row.slice(1)),
    };
};

export const decreaseRight = (grid: GridState): GridState => {
    if (grid.width <= MIN_SIZE) return grid;
    return {
        width: grid.width - 1,
        height: grid.height,
        cells: grid.cells.map(row => row.slice(0, -1)),
    };
};

export const decreaseUp = (grid: GridState): GridState => {
    if (grid.height <= MIN_SIZE) return grid;
    return {
        width: grid.width,
        height: grid.height - 1,
        cells: grid.cells.slice(1),
    };
};

export const decreaseDown = (grid: GridState): GridState => {
    if (grid.height <= MIN_SIZE) return grid;
    return {
        width: grid.width,
        height: grid.height - 1,
        cells: grid.cells.slice(0, -1),
    };
};

export const resizeToExactDimensions = (grid: GridState, newW: number, newH: number): GridState => {
    const w = Math.min(Math.max(newW, MIN_SIZE), MAX_SIZE);
    const h = Math.min(Math.max(newH, MIN_SIZE), MAX_SIZE);

    if (w === grid.width && h === grid.height) return grid;

    let newCells = grid.cells;

    // Adjust height (rows)
    if (h < grid.height) {
        // Crop from bottom
        newCells = newCells.slice(0, h);
    } else if (h > grid.height) {
        // Add to bottom
        const diff = h - grid.height;
        const emptyRows = Array.from({ length: diff }, () => Array(grid.width).fill(false));
        newCells = [...newCells, ...emptyRows];
    }

    // Adjust width (columns)
    if (w < grid.width) {
        // Crop from right
        newCells = newCells.map(row => row.slice(0, w));
    } else if (w > grid.width) {
        // Add to right
        const diff = w - grid.width;
        newCells = newCells.map(row => [...row, ...Array(diff).fill(false)]);
    }

    return {
        width: w,
        height: h,
        cells: newCells
    };
};