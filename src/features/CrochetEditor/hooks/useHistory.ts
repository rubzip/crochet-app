import { useState, useCallback, useEffect } from "react";

export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

// Single Responsibility Principle: Only manages time-travel state.
export function useHistory<T>(initialState: T, storageKey?: string) {
    const [history, setHistory] = useState<HistoryState<T>>(() => {
        if (storageKey) {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    return { past: [], present: JSON.parse(saved), future: [] };
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }
        }
        return {
            past: [],
            present: initialState,
            future: []
        };
    });

    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(history.present));
        }
    }, [history.present, storageKey]);

    const saveState = useCallback((newState: T) => {
        setHistory(prev => ({
            past: [...prev.past, prev.present],
            present: newState,
            future: []
        }));
    }, []);

    const updatePresentWithoutHistory = useCallback((newState: T) => {
        setHistory(prev => ({ ...prev, present: newState }));
    }, []);

    const undo = useCallback(() => {
        setHistory(prev => {
            if (prev.past.length === 0) return prev;
            const previous = prev.past[prev.past.length - 1];
            return {
                past: prev.past.slice(0, -1),
                present: previous,
                future: [prev.present, ...prev.future]
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory(prev => {
            if (prev.future.length === 0) return prev;
            const next = prev.future[0];
            return {
                past: [...prev.past, prev.present],
                present: next,
                future: prev.future.slice(1)
            };
        });
    }, []);

    return {
        current: history.present,
        saveState,
        updatePresentWithoutHistory,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0
    };
}