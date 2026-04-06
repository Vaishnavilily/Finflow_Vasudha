import React, { useState } from 'react'

const IND_ALERTS = [
  { type: 'danger',  title: 'Budget Exceeded: Shopping',    msg: 'You spent ₹10,500 against a ₹8,000 budget (131%). Overspent by ₹2,500.',         time: '2 hrs ago' },
  { type: 'warn',   title: 'Budget Warning: Food & Dining', msg: "You've used 92% of your Food budget (₹7,360 / ₹8,000). 8 days remaining.",        time: '4 hrs ago' },
  { type: 'warn',   title: 'EMI Due in 3 Days',             msg: 'Your home loan EMI of ₹12,000 is due on Apr 9th. Ensure sufficient balance.',      time: '1 day ago' },
  { type: 'info',   title: 'SIP Executed Successfully',     msg: '₹5,000 SIP invested in Axis Bluechip Fund on schedule.',                           time: '2 days ago' },
  { type: 'success',title: 'Goal Milestone Reached',        msg: 'Your "New Laptop" goal is 78% complete! Just ₹15,000 more to go.',                  time: '3 days ago' },
  { type: 'info',   title: 'Tax Saving Tip',                msg: 'FY 2024-25 ends Mar 31. You can still invest ₹30,000 more in ELSS to save tax.',    time: '4 days ago' },
]

const SME_ALERTS = [
  { type: 'danger',  title: 'Cash Flow Warning',        msg: 'Projected cash deficit of ₹45,000 in May 2025 based on current receivables pipeline.',  time: '1 hr ago' },
  { type: 'danger',  title: 'Invoice Overdue',          msg: 'Invoice #INV-2024-089 for ₹1,25,000 from TechCorp is 14 days overdue.',                  time: '2 hrs ago' },
  { type: 'warn',   title: 'GST Filing Due',            msg: 'GSTR-3B for March 2025 is due on Apr 20, 2025. Pending tax liability: ₹34,200.',         time: '3 hrs ago' },
  { type: 'warn',   title: 'Expense Budget Alert',      msg: 'Operations expenses at 88% of monthly budget with 10 days remaining.',                    time: '5 hrs ago' },
  { type: 'info',   title: 'MSME Loan Opportunity',    msg: 'You qualify for a ₹10L MSME Mudra loan at 7.5% based on your revenue history.',           time: '1 day ago' },
  { type: 'success',title: 'Revenue Target Achieved',  msg: 'Q1 2025 revenue of ₹12.4L has exceeded quarterly target by 8%. Well done!',               time: '2 days ago' },
]

const ICON = { danger: '🔴', warn: '🟡', info: '🔵', success: '🟢' }
const CLS  = { danger: 'alert-danger', warn: 'alert-warn', info: 'alert-info', success: 'alert-success' }

export default function Alerts({ mode }) {
  const allAlerts = mode === 'sme' ? SME_ALERTS : IND_ALERTS
  const [alerts, setAlerts] = useState(allAlerts)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter)

  function dismiss(i) {
    setAlerts(prev => prev.filter((_, j) => j !== i))
  }

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Critical</div><div className="metric-val" style={{ color: 'var(--accent4)' }}>{alerts.filter(a=>a.type==='danger').length}</div><div className="metric-change neg">Needs attention</div></div>
        <div className="metric"><div className="metric-label">Warnings</div><div className="metric-val" style={{ color: 'var(--accent3)' }}>{alerts.filter(a=>a.type==='warn').length}</div><div className="metric-change warn">Review soon</div></div>
        <div className="metric"><div className="metric-label">Information</div><div className="metric-val" style={{ color: 'var(--accent)' }}>{alerts.filter(a=>a.type==='info').length}</div><div className="metric-change text-3">FYI</div></div>
        <div className="metric"><div className="metric-label">Positive</div><div className="metric-val" style={{ color: 'var(--accent2)' }}>{alerts.filter(a=>a.type==='success').length}</div><div className="metric-change pos">Good news</div></div>
      </div>

      <div className="card">
        <div className="card-title">
          All Alerts
          <div className="flex gap-8">
            <div className="tab-row" style={{ margin: 0, background: 'var(--bg3)', padding: 3, borderRadius: 8 }}>
              {[['all','All'],['danger','Critical'],['warn','Warnings'],['info','Info'],['success','Positive']].map(([id,label]) => (
                <button key={id}
                  className={`tab${filter === id ? ' active' : ''}`}
                  style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => setFilter(id)}
                >{label}</button>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setAlerts([])}>Clear All</button>
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div>No alerts in this category</div>
          </div>
        )}

        {filtered.map((a, i) => (
          <div key={i} className={`alert-item ${CLS[a.type]}`} style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 16, marginTop: 1 }}>{ICON[a.type]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{a.title}</div>
              <div className="text-sm text-2">{a.msg}</div>
              <div className="text-xs text-3" style={{ marginTop: 4 }}>{a.time}</div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ flexShrink: 0 }} onClick={() => dismiss(i)}>Dismiss</button>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Alert Preferences</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Budget Threshold Alerts',      desc: 'Alert when spending exceeds 80%',       enabled: true  },
            { label: 'Bill/EMI Due Reminders',        desc: '3 days before payment due date',        enabled: true  },
            { label: 'Goal Milestone Alerts',         desc: 'At 25%, 50%, 75%, 100% progress',       enabled: true  },
            { label: 'Investment Execution',          desc: 'SIP & mutual fund updates',             enabled: true  },
            { label: 'Tax Saving Reminders',          desc: 'Before financial year end',             enabled: false },
            { label: 'AI Spending Insights',          desc: 'Weekly pattern analysis',               enabled: false },
          ].map((pref, i) => (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12 }}>
              <div className="flex justify-between mb-8">
                <span className="text-sm" style={{ fontWeight: 500 }}>{pref.label}</span>
                <span className={`badge ${pref.enabled ? 'badge-green' : 'badge-gray'}`}>{pref.enabled ? 'On' : 'Off'}</span>
              </div>
              <div className="text-xs text-3">{pref.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
