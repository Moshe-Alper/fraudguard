# Architecture — Fraud Detection Decision Support Bot

## Overview

A web-based decision support system that helps CIOs choose the right AI architecture for real-time fraud/deception detection in video interviews. The user answers 12 range-slider questions, and the system returns a science-backed architectural recommendation.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React (Vite) | Fast dev server, optimized production build |
| Backend | Node.js + Express | Lightweight REST API, easy to deploy |
| Deployment | Render (single service) | One URL, free tier, serves both API and static files |
| Database | None | No persistence required — stateless per session |

---

## Project Structure

```
project-root/
├── frontend-react/          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RangeSlider.jsx      # Reusable range slider component
│   │   │   ├── QuestionForm.jsx     # 12 questions across 6 categories
│   │   │   ├── ResultCard.jsx       # Displays recommendation + reasoning
│   │   │   └── BonusAlerts.jsx      # Conditional bonus recommendations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # Express backend
│   ├── routes/
│   │   └── recommend.js     # POST /api/recommend — scoring logic
│   ├── logic/
│   │   └── scoring.js       # Score calculation + decision rules
│   ├── index.js             # Entry point — serves API + React build
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Data Flow

```
User fills 12 range sliders (min: 1, max: 5)
            │
            ▼
React computes range midpoints  (e.g. [3,5] → 4.0)
            │
            ▼
POST /api/recommend  { answers: [4.0, 3.5, ...] }
            │
            ▼
Express scoring logic:
  - Operational Efficiency Score  = avg(Q1, Q2, Q5, Q6, Q7, Q8)
  - Accuracy & Trust Score        = avg(Q3, Q4, Q11, Q12)
  - Economic Score                = avg(Q5, Q6)
  - Strategic Score               = avg(Q9, Q10)
            │
            ▼
Decision rules:
  - Operational > Accuracy & Trust  →  Late Fusion
  - Accuracy & Trust ≥ Operational  →  Deep Feature Fusion
  - Economic avg ≥ 4                →  + Knowledge Distillation bonus
  - Strategic avg ≥ 4               →  + Open-Source LLM bonus
            │
            ▼
Response JSON  { recommendation, rationale, bonuses[] }
            │
            ▼
React renders ResultCard + BonusAlerts
  Reset button clears all sliders back to default
```

---

## API

### `POST /api/recommend`

**Request body:**
```json
{
  "answers": [4.0, 3.5, 2.0, 3.0, 4.5, 4.0, 3.0, 2.5, 4.0, 4.5, 3.0, 4.0]
}
```
*Array of 12 floats — midpoint of each range slider, in question order.*

**Response:**
```json
{
  "recommendation": "Late Fusion",
  "rationale": "According to Krishnamurthy et al. (2024)...",
  "scores": {
    "operationalEfficiency": 3.75,
    "accuracyAndTrust": 3.25
  },
  "bonuses": [
    {
      "type": "knowledgeDistillation",
      "text": "Consider Knowledge Distillation (Karimi et al., 2022)..."
    }
  ]
}
```

---

## Question Categories

| # | Category | Questions |
|---|---|---|
| 1–2 | Operational (real-time) | Real-time requirement, Response speed |
| 3–4 | Managerial (explainability) | Verbal reasoning need, Algorithmic transparency |
| 5–6 | Economic (budget) | Hardware budget constraint, Ongoing operational costs |
| 7–8 | Technical (environment) | Data noise level, Synchronization complexity |
| 9–10 | Strategic (open-source & security) | Technological independence, Internal data security |
| 11–12 | Quality (accuracy) | Technical accuracy importance, Resource trade-off for performance |

---

## Deployment on Render

The Express server is configured to:
1. Serve the React app's production build (`frontend-react/dist`) as static files
2. Handle all `/api/*` routes as the REST API
3. Fall back to `index.html` for any unmatched route (React Router support)

**Build command (Render settings):**
```bash
cd frontend-react && npm install && npm run build && cd ../backend && npm install
```

**Start command:**
```bash
node backend/index.js
```

**Environment variables:**
```
NODE_ENV=production
PORT=10000
```

---

## Reset Behavior

The frontend holds all 12 slider values in a single `useState` object. The reset button calls a `resetAnswers()` function that sets all values back to their defaults (`[2, 4]` for each slider — the neutral midrange). No server call is needed for reset.
