# 001 — Backend Implementation

## Goal

Build the Node.js + Express backend for the FraudGuard decision support bot. The backend exposes a single REST endpoint that receives 12 slider answers and returns a scored architectural recommendation.

---

## Step 1 — Scaffold `backend/package.json`

Create the package file with:
- `express` and `cors` as dependencies
- `start` script: `node index.js`
- `dev` script: `node --watch index.js`

---

## Step 2 — Create `backend/logic/scoring.js`

Pure function `calculateRecommendation(answers)`. No Express dependency.

**Score calculations (0-indexed):**

| Score | Questions (1-indexed) | Indices |
|---|---|---|
| Operational Efficiency | Q1, Q2, Q5, Q6, Q7, Q8 | 0,1,4,5,6,7 |
| Accuracy & Trust | Q3, Q4, Q11, Q12 | 2,3,10,11 |
| Economic | Q5, Q6 | 4,5 |
| Strategic | Q9, Q10 | 8,9 |

**Decision rules:**
- `operational > accuracyAndTrust` → `'Late Fusion'`
- `accuracyAndTrust >= operational` → `'Deep Feature Fusion'`

**Bonus rules:**
- `economic >= 4` → Knowledge Distillation bonus (cite Karimi et al. 2022)
- `strategic >= 4` → Open-Source LLM bonus

**Response shape:**
```json
{
  "recommendation": "Late Fusion",
  "rationale": "...",
  "scores": { "operationalEfficiency": 3.75, "accuracyAndTrust": 3.25, "economic": 4.0, "strategic": 3.5 },
  "bonuses": [{ "type": "knowledgeDistillation", "text": "..." }]
}
```

---

## Step 3 — Create `backend/routes/recommend.js`

Express router for `POST /api/recommend`:
- Validate `answers` is an array of exactly 12 numbers → 400 if not
- Call `calculateRecommendation(answers)` from scoring.js
- Return result as JSON

---

## Step 4 — Create `backend/index.js`

Wire up Express:
- CORS middleware
- JSON body parser
- Mount router at `/api`
- Serve `../frontend-react/dist` as static files
- SPA fallback to `index.html` for unmatched routes
- Listen on `process.env.PORT || 3001`

---

## Step 5 — Install & smoke-test

```bash
cd backend && npm install
node index.js
```

Test calls:
```bash
# Should return Late Fusion + Knowledge Distillation bonus
curl -X POST http://localhost:3001/api/recommend \
  -H 'Content-Type: application/json' \
  -d '{"answers":[4,4,2,2,4,4,4,4,2,2,2,2]}'

# Should return Deep Feature Fusion + Open-Source LLM bonus
curl -X POST http://localhost:3001/api/recommend \
  -H 'Content-Type: application/json' \
  -d '{"answers":[2,2,4,4,2,2,2,2,4,4,4,4]}'

# Should return 400
curl -X POST http://localhost:3001/api/recommend \
  -H 'Content-Type: application/json' \
  -d '{"answers":[1,2,3]}'
```
