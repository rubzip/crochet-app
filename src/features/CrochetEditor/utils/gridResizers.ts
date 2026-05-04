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