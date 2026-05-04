# Project Context: Filet Crochet App

## 🎯 Main Objective
A mobile-first web application for creating, managing, and reading "Filet Crochet" patterns. The app features a high-performance Canvas-based grid editor (CrochetEditor) and an algorithmic, guided reading mode (CrochetReader) that translates zigzag crochet rows into an intuitive Left-To-Right (LTR) reading experience.

## 🛠️ Tech Stack
- **Environment:** Vite.
- **Framework:** React 18+ (Functional components and Custom Hooks).
- **Language:** TypeScript (Strict typing, mandatory interfaces).
- **Rendering Engine:** HTML5 `<canvas>` (for high-performance grids and minimaps).

## 🏗️ Architecture & SOLID Principles
The project strictly follows SOLID principles and separates concerns into specific layers:
1. **Types (`types.ts`):** Defines the core data structures (`GridState`, `CellValue`, `InteractionMode`). Shared across all features.
2. **Pure Utilities (`utils/`):** Mathematical and grid-resizing logic (e.g., `increaseLeft`, `readerMath`). These must be 100% pure functions (no React dependencies, no side effects).
3. **Business Logic (`hooks/`):** Custom hooks (`useGridDrawing`, `useHistory`, `useZoom`, `usePatternReader`) handle state orchestration. UI components must remain dumb and only consume these hooks.
4. **Immutability:** The grid state (`GridState`) is a 2D boolean array (`boolean[][]`). Under NO circumstances should the state be mutated directly. Always return new objects/arrays.

## 🎨 Rendering & Canvas Constraints
- **NO DOM GRIDS:** Because patterns can reach sizes of 100x100 or more, DO NOT use HTML `<div>` elements to render the grid cells. This causes DOM bloat and crashes.
- **Canvas Only:** The main `GridBoardCanvas` and the `GridMinimap` must use the HTML5 Canvas API (`ctx.fillRect`) for rendering. 
- **Zoom Logic:** The visual zoom (`useZoom`) multiplies the base cell size. It MUST NOT alter the underlying `GridState` math. Pointer event coordinates must always be divided by the `zoomedCellSize` to find the correct array indices.

## 📱 Interaction & UX (Mobile-First)
- **Interaction Modes (`InteractionMode`):**
  - `"Draw"`: Blocks native scrolling (`touch-action: none;`). Interacting paints/erases.
  - `"Pan"`: Allows native scrolling (`touch-action: auto;`). Disables painting.
- **Pointer Events:** EXCLUSIVELY use Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerLeave`) to unify mouse, touch, and stylus logic. DO NOT use `onMouseDown` or `onTouchStart`.
- **Drag-to-Paint Performance:** Use `useRef` (`isDrawing.current`) to track drag states. DO NOT use `useState` for continuous drag tracking, as it will cause severe performance degradation.

## 🕰️ Storage & History
- **Undo/Redo:** Follows a past/present/future pattern. A continuous stroke (pointer down to pointer up) counts as **a single snapshot** in history.
- **Local Storage:** The `present` grid state should auto-save to the browser's `localStorage` on change to prevent accidental data loss.
- **File Export:** Patterns can be exported and imported as `.json` files.

## 📖 Crochet Reader Mode
- Crochet is worked in turning rows (alternating RTL and LTR). However, the UI Reader Strip must ALWAYS display instructions Left-To-Right for the user's cognitive ease.
- Use the `calculateRemainingBlocks` algorithm to extract the consecutive "Filled" or "Empty" blocks based on the row's `currentOrientation`.
- The visual grid should highlight the `activeRow`, highlight the `activeCol` (pointer), and dim previously read cells.

## 📜 Strict Coding Rules for the AI Agent
1. **Never mutate state:** Always use the spread operator (`...`), `.map()`, or `.slice()` when modifying `GridState`.
2. **Respect the Canvas:** If suggesting changes to how the board looks, write Canvas 2D context code (`ctx.fillStyle`, `ctx.fillRect`), not CSS/HTML modifications for the grid itself.
3. **Keep UI separate from logic:** If adding a new feature, put the logic in a `useFeature.ts` hook and keep the `.tsx` file clean.
4. **TypeScript First:** Ensure all parameters and return types are strictly typed. Avoid `any`.
5. **Language:** Write code comments and UI text in Spanish (as requested by the user), but keep variable/function names in standard English.