import React, { useState } from 'react'

const INIT_GOALS = [
  { name: 'Emergency Fund',    target: 100000, current: 45000,  color: '#3b82f6', icon: '🛡️', deadline: 'Dec 2025', monthly: 5000 },
  { name: 'Europe Trip',       target: 80000,  current: 28000,  color: '#10b981', icon: '✈️', deadline: 'Jun 2025', monthly: 8000 },
  { name: 'New Laptop',        target: 70000,  current: 55000,  color: '#f59e0b', icon: '💻', deadline: 'Mar 2025', monthly: 15000 },
  { name: 'House Down Payment',target: 500000, current: 180000, color: '#8b5cf6', icon: '🏠', deadline: 'Dec 2027', monthly: 10000 },
]

export default function Goals() {
  const [goals, setGoals]   = useState(INIT_GOALS)
  const [form, setForm]     = useState({ name: '', target: '', deadline: '', monthly: '', category: 'Savings' })

  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const onTrack     = goals.filter(g => {
    const pct = g.current / g.target
    return pct >= 0.3
  }).length

  function addGoal() {
    if (!form.name || !form.target) return
    setGoals(prev => [...prev, {
      name: form.name, target: parseInt(form.target),
      current: 0, color: '#3b82f6', icon: '🎯',
      deadline: form.deadline, monthly: parseInt(form.monthly) || 0
    }])
    setForm({ name: '', target: '', deadline: '', monthly: '', category: 'Savings' })
  }

  function deposit(idx) {
    const amt = parseInt(prompt('Enter deposit amount (₹):') || '0')
    if (!amt || amt <= 0) return
    setGoals(prev => prev.map((g, i) =>
      i === idx ? { ...g, current: Math.min(g.target, g.current + amt) } : g
    ))
  }

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Active Goals</div><div className="metric-val">{goals.length}</div><div className="metric-change text-3">{onTrack} on track</div></div>
        <div className="metric"><div className="metric-label">Total Saved</div><div className="metric-val">₹{(totalSaved/100000).toFixed(2)}L</div><div className="metric-change pos">This month</div></div>
        <div className="metric"><div className="metric-label">Total Target</div><div className="metric-val">₹{(totalTarget/100000).toFixed(1)}L</div><div className="metric-change text-3">Across all goals</div></div>
        <div className="metric"><div className="metric-label">Completion</div><div className="metric-val">{Math.round(totalSaved/totalTarget*100)}%</div><div className="metric-change pos">Overall progress</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">My Goals</div>
          {goals.map((g, idx) => {
            const pct = Math.round(g.current / g.target * 100)
            const rem = g.target - g.current
            const months = g.monthly ? Math.ceil(rem / g.monthly) : '—'
            return (
              <div key={idx} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div className="flex justify-between mb-8">
                  <div className="flex gap-8">
                    <span>{g.icon}</span>
                    <span style={{ fontWeight: 500 }}>{g.name}</span>
                  </div>
                  <span className="badge badge-blue">{pct}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8, marginBottom: 8 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: g.color }} />
                </div>
                <div className="flex justify-between text-xs text-3">
                  <span>₹{g.current.toLocaleString()} saved</span>
                  <span>₹{g.target.toLocaleString()} target</span>
                </div>
                {g.monthly > 0 && (
                  <div className="flex justify-between text-xs text-3 mt-8">
                    <span>~{months} months at ₹{g.monthly.toLocaleString()}/mo</span>
                    {g.deadline && <span>By {g.deadline}</span>}
                  </div>
                )}
                <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => deposit(idx)}>
                  + Add Funds
                </button>
              </div>
            )
          })}
        </div>

        <div>
          <div className="card mb-16">
            <div className="card-title">Add New Goal</div>
            <div className="form-group"><label className="label">Goal Name</label>
              <input className="input" placeholder="e.g. Buy a Car" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group"><label className="label">Target Amount (₹)</label>
              <input className="input" type="number" placeholder="200000" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} />
            </div>
            <div className="form-group"><label className="label">Target Date</label>
              <input className="input" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
            </div>
            <div className="form-group"><label className="label">Monthly Contribution (₹)</label>
              <input className="input" type="number" placeholder="5000" value={form.monthly} onChange={e => setForm(p => ({ ...p, monthly: e.target.value }))} />
            </div>
            <div className="form-group"><label className="label">Category</label>
              <select className="select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['Savings','Travel','Electronics','Real Estate','Education','Emergency','Vehicle','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-primary w-full" onClick={addGoal}>Create Goal</button>
          </div>
          <div className="card">
            <div className="card-title">AI Suggestions</div>
            <div className="alert-item alert-info"><span>💡</span><div>Increase Emergency Fund contribution by ₹2,000/month to reach target 3 months early.</div></div>
            <div className="alert-item alert-success"><span>✅</span><div>New Laptop goal is 78% done! Consider a one-time deposit to finish it early.</div></div>
            <div className="alert-item alert-warn"><span>⚠️</span><div>House Down Payment requires ₹10,000/month. Current pace reaches goal in 32 months.</div></div>
          </div>
        </div>
      </div>
    </>
  )
}
