# Filet Crochet App

## 🛠️ Tech Stack
- Vite + React 19 + TypeScript
- React Compiler (babel-plugin-react-compiler)
- Tailwind CSS
- HTML5 Canvas

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Typecheck + build (tsc -b && vite build)
npm run lint    # ESLint
npm run preview # Preview production build
```

## Architecture
- `src/features/*/` — Feature modules (each has components/, hooks/, utils/, types.ts)
- `src/features/CrochetEditor/` — Main grid editor
- State: 2D boolean array (`boolean[][]`), never mutate directly

## Component Architecture (SOLID)
- **Types** (`types.ts`): Core interfaces only
- **Pure Utils** (`utils/`): Math/logic, no React deps
- **Hooks** (`hooks/`): State orchestration, all business logic
- **Components** (`components/`): Dumb UI, consume hooks only

## Rendering Rules
- NO DOM grids for cells. Use Canvas (`ctx.fillRect`) only
- Zoom multiplies visual cell size, does NOT change grid math
- Pointer event coords must be divided by zoomedCellSize to get array indices

## UI/Style
- Tailwind CSS for styling
- Mobile-first (design for touch first, then scale up)
- Usability over complexity: prioritize clear, accessible UI

## Interaction
- Use Pointer Events only (`onPointerDown`, `onPointerMove`, etc.)
- Track drag state with `useRef`, not `useState` (performance)
- Modes: `"Draw"` (touch-action: none) / `"Pan"` (touch-action: auto)

## History
- One continuous stroke (pointer down → up) = single snapshot
- Auto-save to localStorage on change

## Crochet Reader
- Patterns work in turning rows (RTL/LTR alternating)
- Reader UI always shows LTR for user ease

## Strict Rules
- No state mutation: use `.map()`, `.slice()`, spread operator
- All functions/types strictly typed, no `any`
- Comments and UI text in Spanish