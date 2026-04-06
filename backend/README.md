# FinFlow Backend — Real-Time API Server

A production-ready Node.js/Express backend for the FinFlow financial management system, featuring REST APIs for all data operations and a WebSocket server for live metric streaming.

---

## Architecture Overview

```
finflow-backend/
├── server.js              ← Express app + HTTP server entry point
├── .env.example           ← Environment variables template
├── package.json
├── data/
│   └── store.js           ← In-memory data store (swap with DB)
├── routes/
│   ├── individual.js      ← REST endpoints for Individual mode
│   ├── sme.js             ← REST endpoints for SME mode
│   └── ai.js              ← Secure Anthropic AI proxy
└── realtime/
    └── ws.js              ← WebSocket server (live ticker)
```

---

## Quick Start

### 1. Install dependencies
```bash
cd finflow-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set your ANTHROPIC_API_KEY
```

### 3. Start the backend
```bash
npm run dev       # development (auto-restart on file changes)
npm start         # production
```

The server starts at **http://localhost:4000**

---

## Environment Variables

| Variable           | Default                          | Description                              |
|--------------------|----------------------------------|------------------------------------------|
| `PORT`             | `4000`                           | HTTP server port                         |
| `ANTHROPIC_API_KEY`| —                                | Your Anthropic key (for AI chat proxy)   |
| `CORS_ORIGINS`     | `http://localhost:5173,...`      | Comma-separated allowed frontend origins |
| `REALTIME_TICK_MS` | `5000`                           | WebSocket broadcast interval (ms)        |

---

## REST API Reference

### Health Check
```
GET /health
```

---

### Individual — Metrics & Charts
```
GET /api/individual/metrics
GET /api/individual/charts/income-vs-expenses
GET /api/individual/charts/spending
```

### Individual — Transactions
```
GET    /api/individual/transactions          ?cat=Food&search=swiggy&limit=20&offset=0
POST   /api/individual/transactions          { date, desc, cat, amt }
DELETE /api/individual/transactions/:id
```

### Individual — Budgets
```
GET    /api/individual/budgets
POST   /api/individual/budgets               { name, budget }
PATCH  /api/individual/budgets/:id           { name?, budget?, spent? }
DELETE /api/individual/budgets/:id
```

### Individual — Goals
```
GET    /api/individual/goals
POST   /api/individual/goals                 { name, target, deadline?, monthly? }
PATCH  /api/individual/goals/:id/deposit     { amount }
DELETE /api/individual/goals/:id
```

### Individual — Alerts
```
GET    /api/individual/alerts
DELETE /api/individual/alerts/:id
DELETE /api/individual/alerts                (clear all)
```

---

### SME — Metrics & Charts
```
GET /api/sme/metrics
GET /api/sme/charts/cashflow
GET /api/sme/charts/expenses-breakdown
GET /api/sme/cashflow/summary
```

### SME — Expenses
```
GET    /api/sme/expenses                     ?cat=Payroll&status=Pending&search=aws
POST   /api/sme/expenses                     { date, vendor, cat, amt, status }
PATCH  /api/sme/expenses/:id                 { any fields }
DELETE /api/sme/expenses/:id
```

### SME — Invoices
```
GET    /api/sme/invoices                     ?status=Overdue&search=techcorp
POST   /api/sme/invoices                     { client, amt, due }
PATCH  /api/sme/invoices/:id/status          { status: 'Paid'|'Overdue'|'Pending'|'Cancelled' }
DELETE /api/sme/invoices/:id
```

### SME — Alerts
```
GET    /api/sme/alerts
DELETE /api/sme/alerts/:id
DELETE /api/sme/alerts                       (clear all)
```

---

### AI Chat Proxy
```
POST /api/ai/chat
Body: { mode: 'individual'|'sme', messages: [{role, content}], userMessage: string }
```
Proxies requests to Anthropic API. API key stays server-side, never exposed to the browser.

---

## WebSocket — Real-Time Metrics

Connect to `ws://localhost:4000/ws`

### Client → Server messages
```json
{ "type": "subscribe",   "channel": "individual" }
{ "type": "subscribe",   "channel": "sme" }
{ "type": "unsubscribe", "channel": "individual" }
{ "type": "ping" }
```

### Server → Client messages
```json
{ "type": "connected", "message": "...", "channels": ["individual","sme"] }
{ "type": "subscribed", "channel": "sme" }
{ "type": "metrics",   "channel": "individual", "data": { monthlyIncome, totalExpenses, savingsRate, netWorth, lastUpdated } }
{ "type": "metrics",   "channel": "sme",        "data": { monthlyRevenue, operatingExpenses, netProfit, grossMargin, ... } }
{ "type": "pong", "timestamp": "..." }
```

Clients auto-reconnect if the connection drops.

---

## Frontend Integration

The frontend uses `src/api/client.js` to communicate with this backend.

### REST example
```js
import api from './api/client.js'

// Fetch transactions filtered by category
const { data, credits, debits } = await api.individual.getTransactions({ cat: 'Food' })

// Add a transaction
await api.individual.addTransaction({ desc: 'Swiggy', cat: 'Food', amt: -420 })

// Deposit to a goal
await api.individual.depositToGoal('g1', 5000)
```

### Real-time example
```jsx
import { useRealtimeMetrics } from './api/client.js'

function Dashboard() {
  const { metrics, connected } = useRealtimeMetrics('individual')
  // metrics updates every 5 seconds from WebSocket
  return <div>{metrics?.monthlyIncome}</div>
}
```

---

## Connecting to a Real Database

The data store (`data/store.js`) uses plain JavaScript arrays. To swap in PostgreSQL, MongoDB, or any other DB:

1. Replace the array exports with DB queries in each `routes/*.js` file
2. All route handlers already use `async/await` — just replace the array operations with DB calls

Example swap for transactions GET:
```js
// Before (in-memory)
let result = [...individualTransactions]

// After (PostgreSQL with pg)
let result = await db.query('SELECT * FROM transactions WHERE user_id = $1', [userId])
result = result.rows
```

---

## Running Both Frontend & Backend

```bash
# Terminal 1 — backend
cd finflow-backend
npm run dev

# Terminal 2 — frontend
cd finflow
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:4000
