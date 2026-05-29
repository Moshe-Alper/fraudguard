# 003 — Deployment to Render

## Goal

Deploy FraudGuard as a single Render web service. One URL serves both the Express API and the built React frontend. No database, no separate frontend hosting — everything runs from one Node.js process.

---

## Step 1 — Add root-level `package.json`

Create `/Users/moshikalper/Dev/fraudguard/package.json`:

```json
{
  "name": "fraudguard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "cd frontend-react && npm install && npm run build",
    "start": "cd backend && node index.js",
    "install-backend": "cd backend && npm install"
  }
}
```

Render needs a build command and a start command. This file provides them at the repo root.

---

## Step 2 — Create `render.yaml`

Create `/Users/moshikalper/Dev/fraudguard/render.yaml`:

```yaml
services:
  - type: web
    name: fraudguard
    runtime: node
    buildCommand: cd backend && npm install && cd ../frontend-react && npm install && npm run build
    startCommand: cd backend && node index.js
    envVars:
      - key: NODE_ENV
        value: production
```

Render auto-detects this file when the repo is connected. The build command installs deps for both backend and frontend, then compiles React to `frontend-react/dist/`. The start command runs Express, which serves the API and the dist folder.

---

## Step 3 — Verify `.gitignore`

Make sure these are ignored (Render builds them in CI — they must not be committed):

```
node_modules/
frontend-react/dist/
frontend-react/node_modules/
backend/node_modules/
```

---

## Step 4 — Push to GitHub and connect on Render

1. Commit and push the repo to GitHub (if not already done)
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect the GitHub repo
4. Render reads `render.yaml` automatically — confirm the build/start commands look correct
5. Click Deploy

---

## Step 5 — Smoke-test the live URL

Once deployed, visit the Render URL and verify:

```
GET  https://<your-app>.onrender.com/          → React app loads
POST https://<your-app>.onrender.com/api/recommend  → returns JSON recommendation
```

Manual test: adjust all sliders high → Submit → expect **Deep Feature Fusion** + bonus alerts.  
Manual test: adjust all sliders low → Submit → expect **Late Fusion**, no bonuses.

---

## Files to create / modify

| File | Action |
|------|--------|
| `package.json` (root) | Create |
| `render.yaml` | Create |
| `.gitignore` | Verify / update if needed |
