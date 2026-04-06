import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'

// Individual pages
import IndDashboard    from './pages/individual/Dashboard.jsx'
import Budgets         from './pages/individual/Budgets.jsx'
import Goals           from './pages/individual/Goals.jsx'
import Transactions    from './pages/individual/Transactions.jsx'
import TaxPlanner      from './pages/individual/TaxPlanner.jsx'
import CashForecast    from './pages/individual/CashForecast.jsx'
import ScenarioPlanner from './pages/individual/ScenarioPlanner.jsx'

// SME pages
import SmeDashboard  from './pages/sme/Dashboard.jsx'
import SmeCashFlow   from './pages/sme/CashFlow.jsx'
import SmeExpenses   from './pages/sme/Expenses.jsx'
import FundingHub    from './pages/sme/FundingHub.jsx'
import PricingTool   from './pages/sme/PricingTool.jsx'
import Compliance    from './pages/sme/Compliance.jsx'
import Reports       from './pages/sme/Reports.jsx'

// Shared pages
import Alerts       from './pages/shared/Alerts.jsx'
import AIAssistant  from './pages/shared/AIAssistant.jsx'

const IND_PAGES = {
  dashboard: IndDashboard,
  budgets: Budgets,
  goals: Goals,
  transactions: Transactions,
  tax: TaxPlanner,
  forecast: CashForecast,
  scenario: ScenarioPlanner,
  alerts: Alerts,
  ai: AIAssistant,
}

const SME_PAGES = {
  dashboard: SmeDashboard,
  cashflow: SmeCashFlow,
  expenses: SmeExpenses,
  funding: FundingHub,
  pricing: PricingTool,
  compliance: Compliance,
  reports: Reports,
  alerts: Alerts,
  ai: AIAssistant,
}

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  budgets:      'Budget Manager',
  goals:        'Goal Tracker',
  transactions: 'Transactions',
  tax:          'Tax Planner',
  forecast:     'Cash Flow Forecast',
  scenario:     'Scenario Planner',
  alerts:       'Alerts & Notifications',
  ai:           'AI Financial Assistant',
  cashflow:     'Cash Flow Analysis',
  expenses:     'Expense Management',
  funding:      'Funding Hub',
  pricing:      'Pricing Strategy Tool',
  compliance:   'Compliance Tracker',
  reports:      'Business Reports',
}

export default function App() {
  const [mode, setMode]   = useState('individual')
  const [page, setPage]   = useState('dashboard')
  const [theme, setTheme] = useState('dark')

  // Apply theme to <html> element
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
  }, [theme])

  function switchMode(m) {
    setMode(m)
    setPage('dashboard')
  }

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const pages = mode === 'individual' ? IND_PAGES : SME_PAGES
  const PageComponent = pages[page] || pages['dashboard']
  const title = PAGE_TITLES[page] || 'Dashboard'

  return (
    <div className="app">
      <Sidebar
        mode={mode}
        activePage={page}
        onNavigate={setPage}
        onSwitchMode={switchMode}
      />
      <div className="main">
        <Topbar
          title={title}
          onAlerts={() => setPage('alerts')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="content">
          <PageComponent mode={mode} onNavigate={setPage} />
        </div>
      </div>
    </div>
  )
}
