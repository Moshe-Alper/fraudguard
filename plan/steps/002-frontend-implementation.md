# 002 — Frontend Implementation

## Goal

Build the React (Vite) frontend for FraudGuard. The user answers 12 range-slider questions across 6 categories, submits the form, and sees a scored architectural recommendation with optional bonus alerts.

---

## Step 1 — Scaffold the Vite + React project

Inside `frontend-react/`:

**`package.json`** — Vite + React + lucide-react:
```json
{
  "name": "fraudguard-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest"
  }
}
```

**`vite.config.js`** — proxy `/api` to Express during dev:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

**`index.html`** — standard Vite entry with `<div id="root">` and `<script type="module" src="/src/main.jsx">`.

---

## Step 2 — CSS structure (cssLayer skill)

```
src/style/
  main.css             ← @import all sub-files
  setup/
    var.css            ← CSS variables: colors, spacing, border-radius, font stack
    typography.css     ← font sizes, weights, line-height
  basics/
    reset.css          ← box-sizing, margin/padding reset
    base.css           ← body, html, scrollbar
    layout.css         ← .container with max-width + padding
    helper.css         ← .flex, .flex-col, .gap-*, .text-center utilities
    button.css         ← .btn, .btn-primary, .btn-secondary
  cmps/
    range-slider.css
    question-form.css
    result-card.css
    bonus-alerts.css
```

**Color variables (light theme default, dark via `[data-theme="dark"]` on `<html>`):**
```css
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-primary: #4f46e5;
  --color-accent: #0ea5e9;
  --color-border: #e2e8f0;
  --color-bonus-bg: #fefce8;
  --color-bonus-border: #fde047;
}
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-primary: #818cf8;
  --color-accent: #38bdf8;
  --color-border: #334155;
  --color-bonus-bg: #1c1917;
  --color-bonus-border: #a16207;
}
```

---

## Step 3 — Service layer

**`src/services/recommend.service.js`**

```js
export async function getRecommendation(answers) {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  })
  if (!response.ok) throw new Error('Request failed')
  return response.json()
}
```

---

## Step 4 — Components

### `src/components/RangeSlider.jsx`

Props: `label`, `value` (`[min, max]`), `onChange(newRange)`

- Two `<input type="range" min="1" max="5" step="0.5">` for low and high bound
- Shows midpoint value: `((min + max) / 2).toFixed(1)`
- Enforces `low <= high` on change

### `src/components/QuestionForm.jsx`

Props: `answers`, `onSliderChange(index, range)`, `onSubmit`, `loading`

Question definitions (hardcoded):

| Index | Category | Question label |
|-------|----------|----------------|
| 0 | Operational | How critical is real-time response? |
| 1 | Operational | How important is low processing latency? |
| 2 | Managerial | How important is verbal reasoning explainability? |
| 3 | Managerial | How important is algorithmic transparency? |
| 4 | Economic | How constrained is your hardware budget? |
| 5 | Economic | How important is minimizing ongoing operational costs? |
| 6 | Technical | How noisy is your input data? |
| 7 | Technical | How complex is audio-video synchronization in your use case? |
| 8 | Strategic | How important is technological independence? |
| 9 | Strategic | How critical is keeping data on-premises? |
| 10 | Quality | How important is detection accuracy? |
| 11 | Quality | How willing are you to trade resources for performance? |

Renders 6 category sections, each containing 2 `<RangeSlider>` components. Submit button at the bottom.

### `src/components/ResultCard.jsx`

Props: `result`, `onReset`

Displays:
- Recommendation title (Late Fusion / Deep Feature Fusion)
- Rationale text
- Score comparison bar: Operational Efficiency vs Accuracy & Trust (visual bar showing relative values)
- Reset button (lucide `RotateCcw` icon)

### `src/components/BonusAlerts.jsx`

Props: `bonuses` (array from API response)

- Renders nothing if `bonuses` is empty
- Each bonus: card with lucide `Lightbulb` icon + bonus text
- Styled with `--color-bonus-bg` and `--color-bonus-border`

---

## Step 5 — App (`src/App.jsx`)

```js
const DEFAULT_ANSWERS = Array.from({ length: 12 }, () => [2, 4])
```

State:
- `answers` — array of 12 `[min, max]` pairs, default `[2, 4]`
- `result` — API response object or `null`
- `loading` — boolean
- `error` — string or `null`
- `theme` — `'light'` | `'dark'`

Logic:
- `onSliderChange(index, range)` — updates `answers[index]`
- `onSubmit()` — computes midpoints `answers.map(([lo, hi]) => (lo + hi) / 2)`, calls `getRecommendation`, sets `result`
- `onReset()` — resets `answers` to defaults, clears `result` and `error`
- `onToggleTheme()` — flips `theme` and sets `document.documentElement.dataset.theme`

Layout:
```
<header>  FraudGuard logo + theme toggle (lucide Sun/Moon)
{!result && <QuestionForm>}
{result  && <ResultCard> + <BonusAlerts>}
{error   && error message}
```

---

## Step 6 — Install & smoke-test

```bash
cd frontend-react && npm install && npm run dev
```

In a second terminal:
```bash
cd backend && npm run dev
```

Open `http://localhost:5173`.

**Test cases:**
- All sliders at high operational values → expect **Late Fusion** + potentially Knowledge Distillation bonus
- All sliders at high accuracy values → expect **Deep Feature Fusion** + potentially Open-Source LLM bonus
- Reset → form returns, result cleared
- Production build: `npm run build` — confirm `dist/` is generated cleanly
