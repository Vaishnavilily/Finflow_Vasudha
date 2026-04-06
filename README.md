# FinFlow — AI-Based Financial Management System
### Final Year Project | Individual & SME Dashboards

---

## 📋 Project Overview

FinFlow is a complete AI-powered financial management system built with React + Vite.
It serves two user types with dedicated dashboards :

- **Individual** — Personal budgeting, goals, tax planning, investment tracking
- **SME** — Business cash flow, expense management, GST compliance, funding

This project fulfils the abstract requirements:
- ✅ Machine Learning / AI-powered recommendations (via Claude API)
- ✅ Predictive cash flow forecasting
- ✅ Real-time dashboards for financial health
- ✅ Goal tracking with progress bars
- ✅ Tax optimisation with Indian tax slabs (FY 2024-25)
- ✅ Scenario modelling (what-if sliders)
- ✅ Automated alerts (budget, EMI, GST deadlines)
- ✅ Funding opportunities (MSME Mudra, CGTMSE, SIDBI)
- ✅ Pricing strategy tool with margin calculator
- ✅ GST compliance tracker
- ✅ CRUD for transactions, budgets, goals
- ✅ Responsive design

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Build for production
```bash
npm run build
npm run preview
```

---

## 🤖 Enable AI Assistant

1. Get an API key from https://console.anthropic.com
2. Open `src/pages/shared/AIAssistant.jsx`
3. Replace `YOUR_ANTHROPIC_API_KEY` with your actual key

> ⚠️ **Production Warning**: Never expose your API key in frontend code for public apps.
> Use a backend proxy (Node.js/Express) to make API calls instead.

### Backend Proxy (Recommended for Production)

```js
// server.js (Node/Express backend)
const express = require('express')
const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  })
  const data = await response.json()
  res.json(data)
})

app.listen(4000)
```

Then in `AIAssistant.jsx`, change the fetch URL to `/api/chat` and remove the API key header.

---

## 📁 Project Structure

```
finflow/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                    # App entry point
    ├── App.jsx                     # Root component + routing
    ├── styles/
    │   └── global.css              # All global styles
    ├── components/
    │   ├── Sidebar.jsx             # Navigation sidebar
    │   ├── Topbar.jsx              # Top header bar
    │   └── ChartWidget.jsx         # Reusable Chart.js wrapper
    └── pages/
        ├── individual/
        │   ├── Dashboard.jsx       # Overview + metrics + charts
        │   ├── Budgets.jsx         # Category budgets + overspend alerts
        │   ├── Goals.jsx           # Goal tracker with progress
        │   ├── Transactions.jsx    # CRUD transaction manager
        │   ├── TaxPlanner.jsx      # Income tax calculator (Old/New regime)
        │   ├── CashForecast.jsx    # 6-month income/expense forecast
        │   └── ScenarioPlanner.jsx # What-if financial simulator
        ├── sme/
        │   ├── Dashboard.jsx       # SME overview KPIs + charts
        │   ├── CashFlow.jsx        # 12-month forecast + receivables aging
        │   ├── Expenses.jsx        # Budget vs actual + AI recommendations
        │   ├── FundingHub.jsx      # Govt schemes + EMI calculator
        │   ├── PricingTool.jsx     # Margin calculator + pricing strategies
        │   ├── Compliance.jsx      # GST/TDS/PF compliance calendar
        │   └── Reports.jsx         # P&L, YoY charts + downloadable reports
        └── shared/
            ├── Alerts.jsx          # Smart alerts for both modes
            └── AIAssistant.jsx     # Claude AI chatbot
```

---

## 🛠 Tech Stack

| Technology     | Purpose                        |
|----------------|-------------------------------|
| React 18       | UI framework                  |
| Vite 5         | Build tool + dev server        |
| Chart.js 4     | All data visualisations        |
| React Router 6 | Client-side navigation         |
| Anthropic API  | AI financial assistant (Claude)|

---

## 📊 Features by Module

### Individual Dashboard
| Feature | Description |
|---------|-------------|
| Dashboard | Income/expense charts, goal overview, recent transactions |
| Budget Manager | Set category budgets, track spending, overspend alerts |
| Goal Tracker | Create goals, track progress, deposit funds, AI suggestions |
| Transactions | Add/delete/filter transactions, export CSV |
| Tax Planner | Old vs New regime comparison, 80C/80D/NPS savings guide |
| Cash Forecast | 6-month AI-predicted income & expense forecast |
| Scenario Planner | Live what-if sliders, wealth projection calculator |

### SME Dashboard
| Feature | Description |
|---------|-------------|
| SME Dashboard | Revenue, expenses, profit margin, KPIs |
| Cash Flow | 12-month forecast, receivables aging, scenario planner |
| Expense Mgmt | Budget vs actual, AI cost-saving recommendations |
| Funding Hub | Govt MSME schemes, readiness checklist, EMI calculator |
| Pricing Tool | Cost-plus calculator, competitor comparison, volume tiers |
| Compliance | GST/TDS/PF calendar, ITC reconciliation, notices |
| Reports | P&L, YoY charts, downloadable reports (PDF/Excel/CSV) |

### Shared
| Feature | Description |
|---------|-------------|
| Alerts | Budget alerts, bill reminders, GST deadlines, positive news |
| AI Assistant | Claude-powered financial Q&A with contextual mode switching |

---

## 🎓 Abstract Requirements Checklist

| Abstract Claim | Implemented In |
|----------------|---------------|
| AI/ML recommendations | AIAssistant.jsx (Claude API) |
| Predictive analytics | CashForecast.jsx, CashFlow.jsx |
| NLP chatbot | AIAssistant.jsx |
| Budgeting | Budgets.jsx |
| Investment planning | Goals.jsx, ScenarioPlanner.jsx |
| Cash flow forecasting | CashForecast.jsx, CashFlow.jsx |
| Risk management/alerts | Alerts.jsx |
| Tax optimisation | TaxPlanner.jsx |
| Goal tracking | Goals.jsx |
| Expense management | Transactions.jsx, Expenses.jsx |
| Funding opportunities | FundingHub.jsx |
| Pricing strategies | PricingTool.jsx |
| Compliance | Compliance.jsx |
| Scenario modelling | ScenarioPlanner.jsx, CashFlow.jsx |
| Real-time dashboards | Dashboard.jsx (both modes) |
| Automated alerts | Alerts.jsx |
| CRUD operations | Transactions.jsx, Goals.jsx, Budgets.jsx |

---

## 📝 Customisation

### Change default data
All sample data is in each page file. Search for `INIT_` constants to update default values.

### Add new pages
1. Create `src/pages/individual/NewPage.jsx` or `src/pages/sme/NewPage.jsx`
2. Add to `IND_PAGES` or `SME_PAGES` in `App.jsx`
3. Add nav item to `IND_NAV` or `SME_NAV` in `Sidebar.jsx`

### Deploy to Vercel
```bash
npm run build
# Upload the dist/ folder to Vercel, Netlify, or any static host
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## 👨‍💻 Author Notes

- Built for Final Year Project (Abstract: AI-Based Financial Management for Individuals and SMEs)
- All Indian financial data (tax slabs, GST rates, MSME schemes) are accurate as of FY 2024-25
- Charts use Chart.js 4 with custom dark theme
- The AI assistant works with fallback responses even without an API key
