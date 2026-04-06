import React, { useState } from 'react'
import ChartWidget, { COLORS, legendPlugin } from '../../components/ChartWidget.jsx'

const INIT_EXPENSES = [
  { name: 'Payroll',        budget: 390000, actual: 380000, color: COLORS.blue   },
  { name: 'Operations',     budget: 155000, actual: 152000, color: COLORS.green  },
  { name: 'Rent/Utilities', budget: 85000,  actual: 85000,  color: COLORS.red    },
  { name: 'Marketing',      budget: 82000,  actual: 78000,  color: COLORS.amber  },
  { name: 'Technology',     budget: 64000,  actual: 62000,  color: COLORS.purple },
  { name: 'Other',          budget: 25000,  actual: 23000,  color: COLORS.gray   },
]

const AI_RECS = [
  { area: 'Software Tools',       saving: '₹22,000/mo', tip: 'You have 3 overlapping PM tools. Consolidate to one.', priority: 'High' },
  { area: 'Cloud Infrastructure', saving: '₹18,000/mo', tip: 'Right-size unused EC2 instances — utilization at 34%.', priority: 'High' },
  { area: 'Marketing Spend',      saving: '₹25,000/mo', tip: 'Shift budget from low-ROI channels to high-ROI ones.',  priority: 'Medium' },
  { area: 'Office Supplies',      saving: '₹8,000/mo',  tip: 'Bulk purchasing from single vendor reduces cost.',       priority: 'Low' },
  { area: 'Travel Expenses',      saving: '₹11,000/mo', tip: 'Replace 40% of travel with video conferencing.',         priority: 'Medium' },
]

export default function SmeExpenses() {
  const [expenses, setExpenses] = useState(INIT_EXPENSES)
  const [form, setForm]         = useState({ name: '', budget: '', actual: '' })

  const totalBudget = expenses.reduce((s, e) => s + e.budget, 0)
  const totalActual = expenses.reduce((s, e) => s + e.actual, 0)
  const totalSaving = AI_RECS.reduce((s, r) => s + parseInt(r.saving.replace(/[₹,\/mo]/g, '')), 0)

  const barChart = {
    type: 'bar',
    data: {
      labels: expenses.map(e => e.name),
      datasets: [
        {
          label: 'Budget', data: expenses.map(e => e.budget),
          backgroundColor: COLORS.blue + '33', borderColor: COLORS.blue,
          borderWidth: 1.5, borderRadius: 4
        },
        {
          label: 'Actual', data: expenses.map(e => e.actual),
          backgroundColor: COLORS.green + '33', borderColor: COLORS.green,
          borderWidth: 1.5, borderRadius: 4
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: legendPlugin() },
      scales: {
        x: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
        y: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
      }
    }
  }

  function addExpense() {
    if (!form.name || !form.budget) return
    setExpenses(prev => [...prev, {
      name: form.name,
      budget: parseInt(form.budget),
      actual: parseInt(form.actual) || 0,
      color: COLORS.teal
    }])
    setForm({ name: '', budget: '', actual: '' })
  }

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Total Expenses</div><div className="metric-val">₹{(totalActual/100000).toFixed(1)}L</div><div className="metric-change neg">↑ 3.2% over plan</div></div>
        <div className="metric"><div className="metric-label">Largest Category</div><div className="metric-val">Payroll</div><div className="metric-change text-3">₹3.8L — 49%</div></div>
        <div className="metric"><div className="metric-label">AI Savings Potential</div><div className="metric-val">₹84K/mo</div><div className="metric-change pos">Identified by AI</div></div>
        <div className="metric"><div className="metric-label">Budget Variance</div><div className="metric-val">₹{((totalBudget - totalActual)/1000).toFixed(0)}K</div><div className="metric-change pos">Under budget</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Budget vs Actual <span className="badge badge-amber">This Month</span></div>
          <ChartWidget id="sme-exp-bar" config={barChart} height={270} />
          <div className="divider" />
          <div className="card-title" style={{ marginBottom: 10 }}>Add Expense Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <div>
              <label className="label">Category</label>
              <input className="input" placeholder="e.g. R&D" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Budget (₹)</label>
              <input className="input" type="number" placeholder="50000" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
            </div>
            <div>
              <label className="label">Actual (₹)</label>
              <input className="input" type="number" placeholder="0" value={form.actual} onChange={e => setForm(p => ({ ...p, actual: e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={addExpense}>Add</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">AI Cost Saving Recommendations</div>
          {AI_RECS.map((r, i) => (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div className="flex justify-between mb-8">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{r.area}</span>
                <span className={`badge ${r.priority === 'High' ? 'badge-red' : r.priority === 'Medium' ? 'badge-amber' : 'badge-blue'}`}>
                  {r.priority}
                </span>
              </div>
              <div className="text-sm text-2 mb-8">{r.tip}</div>
              <div className="pos text-sm" style={{ fontWeight: 500 }}>Potential saving: {r.saving}</div>
            </div>
          ))}
          <div className="alert-item alert-success" style={{ marginTop: 4 }}>
            <span>💰</span>
            <div>Total AI-identified savings: <b>₹84,000/month</b> — act on High priority items first.</div>
          </div>
        </div>
      </div>
    </>
  )
}
