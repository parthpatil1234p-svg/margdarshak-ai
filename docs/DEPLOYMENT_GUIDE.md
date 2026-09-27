# 🚀 MargDarshak AI - Full Stack Deployment Guide
### *Frontend on Vercel + Backend on Render (100% Free Tier Supported)*

This guide walks you through deploying **MargDarshak AI** with the Frontend hosted on **Vercel** and the Backend API hosted on **Render.com**, while keeping local development (`http://localhost:5000`) 100% operational.

---

## 🌟 Architecture Overview

```
   ┌────────────────────────────────┐         ┌────────────────────────────────┐
   │        VERCEL (Frontend)       │  HTTPS  │        RENDER (Backend API)    │
   │  • Static Single Page App      │ ──────> │  • Node.js / Express REST API  │
   │  • HTML5, CSS3, ES6+, Chart.js │  /api/* │  • Google Gemini / Heuristics  │
   │  • Instant Global CDN Delivery │         │  • MongoDB Atlas / In-Memory   │
   └────────────────────────────────┘         └────────────────────────────────┘
```

---

## 🛠️ Step 1: Deploy Backend to Render (5 Minutes)

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `https://github.com/parthpatil1234p-svg/margdarshak-ai.git`.
4. Configure the Web Service settings:
   - **Name:** `margdarshak-ai-backend` (or `margdarshak-ai`)
   - **Language / Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add the following (optional but recommended):
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = *(Your MongoDB Atlas connection string, or leave blank for automatic In-Memory fallback)*
   - `GEMINI_API_KEY` = *(Your Google Gemini API Key, or leave blank for deterministic fallback)*
6. Click **Create Web Service**.
7. Once deployed, Render will provide your live Backend URL (e.g., `https://margdarshak-ai-backend.onrender.com`).
8. Verify health check: `https://margdarshak-ai-backend.onrender.com/api/health` ➔ should return `{"status": "online"}`.

---

## ⚡ Step 2: Deploy Frontend to Vercel (2 Minutes)

### Option A: Using Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Import the `margdarshak-ai` repository.
3. Configure Project Settings:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Output Directory:** `public` (or leave default to let `vercel.json` handle rewrites)
4. Click **Deploy**!
5. Vercel will build and assign your live production URL (e.g., `https://margdarshak-ai.vercel.app`).

### Option B: Using Vercel CLI
Run in terminal:
```bash
npx vercel --prod
```

---

## 🔄 Step 3: Connect Vercel Frontend to Render Backend (Optional Proxy)

If you want Vercel to automatically proxy `/api/*` to your Render backend:
In `vercel.json`:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR_RENDER_BACKEND_URL.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/public/$1"
    }
  ]
}
```

*Note: Since `api/index.js` is included in this repository, Vercel can also run the full API as a Serverless Function out-of-the-box with ZERO configuration needed!*

---

## 🔒 Local Run Integrity Check

Even after configuring production deployments, your local development remains 100% intact:
```bash
# Start local development server
npm start

# Access local portal
http://localhost:5000
```
