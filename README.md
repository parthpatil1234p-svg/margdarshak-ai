# 🌟 MargDarshak AI (मार्गदर्शक AI)
### *Career Path Simulator: From Class 10 to Career*
> **Guiding Students & Parents Through Every Academic Crossroads.**

[![HackMatrix 5.0](https://img.shields.io/badge/HackMatrix%205.0-Kali%20Yuga%20(PCCOE%20Pune)-red.svg)](https://hackmatrix.in)
[![Track](https://img.shields.io/badge/Track-04%20Miscellaneous%20(MISC--01)-blue.svg)](#)
[![SDG 4](https://img.shields.io/badge/SDG%204-Quality%20Education-orange.svg)](https://sdgs.un.org/goals/goal4)
[![SDG 8](https://img.shields.io/badge/SDG%208-Decent%20Work%20%26%20Economic%20Growth-green.svg)](https://sdgs.un.org/goals/goal8)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🎯 1. Problem Overview
In India, completing Class 10 is an irreversible milestone. Millions of students and parents face:
1. **Binary Bias:** Cultural coercion towards engineering (JEE) or medicine (NEET), blind to high-growth modern disciplines.
2. **Financial Blind Spots:** Incurring ₹15–20 Lakhs in high-interest private college loans without knowing realistic debt payback terms.
3. **Absence of Contingency Planning:** Complete failure to answer *"What if I miss the NEET/JEE cutoff?"* or *"What if our family budget shrinks?"*
4. **Opaque Guidance:** Vague career advice lacking sequential, step-by-step milestones from Class 10 to employment.

**MargDarshak AI** solves this through an end-to-end AI decision-support platform providing sequential multi-pathways, dynamic scenario contingency modeling, education loan feasibility analysis, and explainable decision matrices.

---

## 🚀 2. Key Capabilities & Features
* **FR-1: Class 10 Intake Assessment:** Captures 10th marks (Math, Science, English, Social), category, budget, location (India/Abroad), and risk appetite. Includes **1-Click Demo Personas** for rapid hackathon testing:
  - *Persona A (Confused Student):* Aarav Sharma (Likes tech + bio, average in maths, terrified of entrance failure).
  - *Persona B (Practical Parent):* Rajesh Patil (Strict ₹4L budget, debt-averse, prioritizes high ROI).
  - *Persona C (High Aspirant):* Ananya Sen (94% marks, aspiring AI research, India vs Germany curiosity).
* **FR-2: Sequential Multi-Pathway Visualization:** Interactive roadmap mapping `Class 10` ➔ `11th/12th Stream / Diploma` ➔ `Entrance / UG Degree` ➔ `Specialization & Internships` ➔ `Target Career Roles` across 3 distinct viable pathways:
  1. *Primary Aspirant Route* (Tier-1 targets)
  2. *Applied Industry Route* (High-employability skill-first approach)
  3. *Cost-Optimized Route* (Debt-free Polytechnic/State Govt route)
* **FR-3: Interactive "What-If" Scenario Simulator (Core USP):** Dynamic sandbox with presets:
  - *"What if I do not clear NEET?"* ➔ Instant pivot to Biotech/Data Science, saving ₹80L and 2 years.
  - *"What if I do not clear JEE Advanced for IIT?"* ➔ Pivot to State Autonomous (COEP/VJTI) or NIMCET BCA+MCA.
  - *"What if family budget drops by 50%?"* ➔ Pivot to Govt Polytechnic-to-Degree (DSE) with zero debt.
  - *"What if I study in Germany vs Indian Private?"* ➔ €0 tuition comparison with EU career trajectory.
* **FR-4: Financial Feasibility & Borrowing Index Engine:**
  - Dynamic EMI and total interest calculation.
  - Real-world **Debt-to-Income (DTI)** ratio and salary payback horizon.
  - Interactive **Borrowing Risk Gauge** (Debt-Free / Safe / Manageable / Overleveraged Alert).
  - **Scholarship Matcher** linking National Scholarship Portal (NSP), MahaDBT, and international fellowships.
* **FR-5: Explainable Decision Matrix:** Side-by-side comparative table analyzing cost, risk, years to earning, median starting packages, and transparent assumptions with **One-Click Printable Career Dossier (PDF)**.
* **Dual-Engine AI Intelligence:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.5-flash`) + High-Speed Deterministic Heuristic Fallback Engine ensuring 100% demo uptime under all network conditions.

---

## 🏗️ 3. System Architecture

```
            ┌────────────────────────────────────────────────────────┐
            │               Frontend (Client Application)            │
            │   HTML5 / CSS3 / ES6+ / Bootstrap 5.3 / Chart.js       │
            └───────────────┬────────────────────────▲───────────────┘
                            │ HTTPS / JSON Payload   │
                            ▼                        │
            ┌────────────────────────────────────────┴───────────────┐
            │                 Backend API (Node.js / Express)        │
            │   - Assessment Controller   - What-If Engine           │
            │   - Pathway Generator       - Financial ROI Calculator │
            └───────────────┬────────────────────────▲───────────────┘
                            │                        │
   ┌────────────────────────┴────────┐      ┌────────┴────────────────────────┐
   │ Database & Seed Store           │      │ AI Reasoning Engine             │
   │ - Streams, Colleges, Careers    │      │ - Google Gemini API (Structured)│
   │ - Scholarships, Cost Datasets   │      │ - Deterministic Fallback Engine │
   └─────────────────────────────────┘      └─────────────────────────────────┘
```

---

## 🛠️ 4. Tech Stack Selection
* **Frontend:** Responsive Web App (HTML5, CSS3, ES6+, Bootstrap 5.3, FontAwesome 6, Chart.js)
* **Backend:** Node.js (v18+) with Express.js, Helmet, CORS, Dotenv
* **Database:** MongoDB / Mongoose with Seeded In-Memory JSON store for offline-first resilience
* **AI & Intelligence:** Google Gemini API (`gemini-1.5-flash`) + Deterministic Heuristic Engine

---

## ⚡ 5. Quick Start & Local Run

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-username/margdarshak-ai.git
cd "MargDarshak AI"

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env
# Set GEMINI_API_KEY if desired; if omitted, the deterministic AI fallback engine activates automatically!

# 4. Run automated test suite
npm test

# 5. Start the production server
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:5000`**

---

## 📡 6. REST API Endpoints Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health & AI service status |
| `POST` | `/api/assessment/evaluate` | Intake evaluation & stream recommendations |
| `POST` | `/api/pathways/simulate` | Generates 3 sequential multi-stage pathways |
| `GET` | `/api/what-if/scenarios` | Fetches available scenario presets |
| `POST` | `/api/what-if/simulate` | Executes dynamic pivot simulation & impact diff |
| `POST` | `/api/finance/calculate-loan` | Computes loan EMI, total interest & payback years |
| `GET` | `/api/scholarships/match` | Matches eligible scholarships by marks & income |
| `POST` | `/api/matrix/compare` | Compares multi-pathway decision matrix side-by-side |

---

## 📊 7. Verification & Testing
Run the automated test suite verifying all endpoints:
```bash
npm test
```
*Result:*
```
🧪 Starting MargDarshak AI Automated Verification Suite...
✅ [PASS] GET /api/health returns online status
✅ [PASS] POST /api/assessment/evaluate evaluates intake and recommends streams
✅ [PASS] POST /api/pathways/simulate generates 3 sequential multi-stage pathways
✅ [PASS] POST /api/what-if/simulate executes NEET_FAIL scenario pivot
✅ [PASS] POST /api/finance/calculate-loan accurately computes EMI and payback
✅ [PASS] GET /api/scholarships/match returns matching scholarships
✅ [PASS] POST /api/matrix/compare returns side-by-side comparison matrix
📊 Verification Summary: 7 passed, 0 failed.
```

---

## 🏆 8. HackMatrix 5.0 Submission Deliverables
- **Official 7-Slide PPT Content:** Complete markdown text formatted to the official template in [`docs/HACKMATRIX_PPT_CONTENT.md`](docs/HACKMATRIX_PPT_CONTENT.md).
- **Interactive Prototype:** Fully functional on `http://localhost:5000` with 1-click evaluation personas.
- **SDG Mapping:** Detailed alignment with UN SDG 4 (Quality Education) and SDG 8 (Decent Work & Economic Growth).
