import React, { useState } from 'react'

const DEFAULT_BUDGETS = [
  { name: 'Housing & Rent',    budget: 20000, spent: 18000, color: '#3b82f6' },
  { name: 'Food & Dining',     budget: 8000,  spent: 9200,  color: '#ef4444' },
  { name: 'Transport',         budget: 5000,  spent: 3200,  color: '#10b981' },
  { name: 'Entertainment',     budget: 3000,  spent: 2800,  color: '#8b5cf6' },
  { name: 'Shopping',          budget: 8000,  spent: 10500, color: '#ef4444' },
  { name: 'Healthcare',        budget: 2000,  spent: 800,   color: '#10b981' },
  { name: 'Investments',       budget: 15000, spent: 12000, color: '#f59e0b' },
  { name: 'Utilities',         budget: 3000,  spent: 2700,  color: '#3b82f6' },
]

export default function Budgets() {
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS)
  const [form, setForm]       = useState({ name: '', budget: '', threshold: '80' })

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0)
  const totalSpent  = budgets.reduce((s, b) => s + b.spent, 0)
  const remaining   = totalBudget - totalSpent

  function addBudget() {
    if (!form.name || !form.budget) return
    setBudgets(prev => [...prev, {
      name: form.name,
      budget: parseInt(form.budget),
      spent: 0,
      color: '#3b82f6'
    }])
    setForm({ name: '', budget: '', threshold: '80' })
  }

  return (
    <>
      <div className="grid-3">
        <div className="metric">
          <div className="metric-label">Total Budget</div>
          <div className="metric-val">₹{totalBudget.toLocaleString()}</div>
          <div className="metric-change text-3">Monthly limit</div>
        </div>
        <div className="metric">
          <div className="metric-label">Spent So Far</div>
          <div className="metric-val">₹{totalSpent.toLocaleString()}</div>
          <div className="metric-change warn">{Math.round(totalSpent/totalBudget*100)}% used</div>
        </div>
        <div className="metric">
          <div className="metric-label">Remaining</div>
          <div className="metric-val" style={{ color: remaining >= 0 ? 'var(--accent2)' : 'var(--accent4)' }}>
            ₹{Math.abs(remaining).toLocaleString()}
          </div>
          <div className={`metric-change ${remaining >= 0 ? 'pos' : 'neg'}`}>
            {remaining >= 0 ? 'Safe to spend' : 'Over budget!'}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Category Budgets</div>
          {budgets.map((b, i) => {
            const pct  = Math.min(100, Math.round(b.spent / b.budget * 100))
            const over = b.spent > b.budget
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div className="flex justify-between mb-8">
                  <span className="text-sm">{b.name}</span>
                  <span className={`text-sm ${over ? 'neg' : 'text-2'}`}>
                    ₹{b.spent.toLocaleString()} / ₹{b.budget.toLocaleString()} {over ? '⚠ Over' : ''}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: over ? '#ef4444' : b.color }} />
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <div className="card mb-16">
            <div className="card-title">Add Budget Category</div>
            <div className="form-group">
              <label className="label">Category Name</label>
              <input className="input" placeholder="e.g. Groceries"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Monthly Limit (₹)</label>
              <input className="input" type="number" placeholder="5000"
                value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Alert Threshold</label>
              <select className="select" value={form.threshold} onChange={e => setForm(p => ({ ...p, threshold: e.target.value }))}>
                <option value="70">70% used</option>
                <option value="80">80% used</option>
                <option value="90">90% used</option>
              </select>
            </div>
            <button className="btn btn-primary w-full" onClick={addBudget}>+ Add Budget</button>
          </div>

          <div className="card">
            <div className="card-title">Overspending Summary</div>
            {budgets.filter(b => b.spent > b.budget).map((b, i) => (
              <div key={i} className="alert-item alert-danger">
                <span>⚠</span>
                <div><b>{b.name}</b> exceeded by ₹{(b.spent - b.budget).toLocaleString()} this month.</div>
              </div>
            ))}
            {budgets.filter(b => b.spent <= b.budget * 0.7).map((b, i) => (
              <div key={i} className="alert-item alert-success">
                <span>✓</span>
                <div><b>{b.name}</b> is ₹{(b.budget - b.spent).toLocaleString()} under budget. Great job!</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
