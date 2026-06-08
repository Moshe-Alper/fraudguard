# FraudGuard

**Live demo:** [https://fraudguard-4zj3.onrender.com/](https://fraudguard-4zj3.onrender.com/)

A conversational decision support tool that helps CIOs choose the right AI architecture for real-time fraud and deception detection in video interviews.

The user answers 12 questions via a chat interface — each answered with a range slider — and receives a science-backed architectural recommendation.

---

## How it works

The chatbot walks through 12 questions across six categories:

| Category | Questions | Weight |
|---|---|---|
| Operational (real-time) | Real-time requirement, response speed | Operational Efficiency score |
| Managerial (explainability) | Verbal reasoning need, algorithmic transparency | Accuracy & Trust score |
| Economic (budget) | Hardware budget, ongoing operational costs | Economic score |
| Technical (environment) | Data noise level, channel sync complexity | Operational Efficiency score |
| Strategic (open-source & security) | Tech independence, internal data security | Strategic score |
| Quality (accuracy) | Accuracy importance, resource trade-off | Accuracy & Trust score |

Each answer is a range (1–5); the midpoint is used for scoring.

**Decision rules:**
- `Operational Efficiency > Accuracy & Trust` → **Late Fusion**
- `Accuracy & Trust ≥ Operational Efficiency` → **Deep Feature Fusion**
- `Economic avg ≥ 4` → + **Knowledge Distillation** bonus recommendation
- `Strategic avg ≥ 4` → + **Open-Source LLM** bonus recommendation

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Deployment | Render (single web service) |

The Express server serves both the REST API (`/api/*`) and the React production build as static files. No database — fully stateless per session.

---

## API

### `POST /api/recommend`

```json
// Request
{ "answers": [4.0, 3.5, 2.0, 3.0, 4.5, 4.0, 3.0, 2.5, 4.0, 4.5, 3.0, 4.0] }

// Response
{
  "recommendation": "מיזוג מאוחר (Late Fusion)",
  "rationale": "...",
  "scores": {
    "operationalEfficiency": 3.75,
    "accuracyAndTrust": 3.25,
    "economic": 4.25,
    "strategic": 4.5
  },
  "bonuses": [
    { "type": "knowledgeDistillation", "text": "..." }
  ]
}
```

---

## Local development

```bash
# Install deps and build the frontend
npm run build

# Start the server (serves API + built frontend on port 3001)
npm start
```

Visit `http://localhost:3001`.

To run the frontend dev server with hot reload:

```bash
cd frontend-react && npm run dev
```

The Vite config proxies `/api` to `localhost:3001`, so the backend must also be running.

---

## Deployment (Render)

Configured via `render.yaml`:

- **Build:** `cd backend && npm install && cd ../frontend-react && npm install --include=dev && npm run build`
- **Start:** `cd backend && node index.js`
- **Env:** `NODE_ENV=production`

The built frontend is copied into `backend/public` and served as static files by Express.
