import React, { useState } from 'react'

const SCHEMES = [
  { name: 'MSME Mudra Loan',          type: 'Loan',      amt: 'Up to ₹10L',   rate: '7.5% p.a.',  status: 'Eligible', desc: 'Collateral-free business loan under PM Mudra Yojana (Kishor/Tarun).' },
  { name: 'CGTMSE Scheme',            type: 'Guarantee', amt: 'Up to ₹2Cr',   rate: '1% fee',     status: 'Eligible', desc: 'Credit guarantee cover for term loans and working capital from banks.' },
  { name: 'SIDBI Direct Credit',      type: 'Loan',      amt: '₹10L–₹25Cr',  rate: '8.5–10%',    status: 'Eligible', desc: 'Working capital and term loans directly from SIDBI for MSMEs.' },
  { name: 'Startup India Seed Fund',  type: 'Grant',     amt: 'Up to ₹20L',   rate: '0%',         status: 'Apply',    desc: 'DPIIT-recognized startups can apply for seed funding (equity-free).' },
  { name: 'PM SVANidhi',              type: 'Loan',      amt: 'Up to ₹10L',   rate: '7% p.a.',    status: 'Check',    desc: 'Micro-credit facility for small businesses and street vendors.' },
  { name: 'NSIC Raw Material Assist', type: 'Scheme',    amt: 'As needed',    rate: 'Subsidised',  status: 'Apply',    desc: 'National Small Industries Corporation — subsidised raw material procurement.' },
]

const CHECKLIST = [
  { item: 'GST Registration (GSTIN)',      done: true },
  { item: 'Business Account (2+ years)',   done: true },
  { item: 'ITR Filed — Last 2 years',      done: true },
  { item: 'MSME / Udyam Registration',     done: true },
  { item: 'Audited Balance Sheet',         done: false },
  { item: 'Projected P&L Statement',       done: false },
  { item: 'Business Plan Document',        done: false },
  { item: 'Collateral Documentation',      done: true },
]

export default function FundingHub() {
  const [activeTab, setActiveTab] = useState('schemes')
  const completed = CHECKLIST.filter(c => c.done).length
  const score = Math.round((completed / CHECKLIST.length) * 100)

  return (
    <>
      <div className="grid-3">
        <div className="metric"><div className="metric-label">Eligibility Score</div><div className="metric-val">742</div><div className="metric-change pos">Good — Top 35%</div></div>
        <div className="metric"><div className="metric-label">Available Credit Est.</div><div className="metric-val">₹45L</div><div className="metric-change text-3">Based on financials</div></div>
        <div className="metric"><div className="metric-label">Active Loans</div><div className="metric-val">1</div><div className="metric-change text-3">₹8.5L outstanding</div></div>
      </div>

      <div className="tab-row">
        {[['schemes','Government Schemes'],['checklist','Readiness Checklist'],['calculator','EMI Calculator']].map(([id,label])=>(
          <button key={id} className={`tab${activeTab===id?' active':''}`} onClick={()=>setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {activeTab === 'schemes' && (
        <div className="grid-2">
          {SCHEMES.map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div className="flex justify-between mb-8">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</span>
                <span className={`badge ${s.status==='Eligible'?'badge-green':s.status==='Apply'?'badge-blue':'badge-amber'}`}>{s.status}</span>
              </div>
              <div className="text-xs text-3 mb-8">{s.desc}</div>
              <div className="flex gap-16 text-sm mb-12">
                <span className="text-2">Amount: <b style={{ color: 'var(--text)' }}>{s.amt}</b></span>
                <span className="text-2">Rate: <b style={{ color: 'var(--accent2)' }}>{s.rate}</b></span>
              </div>
              <div className="flex gap-8">
                <span className={`badge ${s.type==='Loan'?'badge-blue':s.type==='Grant'?'badge-green':'badge-purple'}`}>{s.type}</span>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                  {s.status === 'Eligible' ? 'Apply Now' : 'Learn More'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Funding Readiness: {score}%</div>
            <div className="progress-bar" style={{ height: 10, marginBottom: 16 }}>
              <div className="progress-fill" style={{ width: `${score}%`, background: score >= 70 ? 'var(--accent2)' : 'var(--accent3)' }} />
            </div>
            {CHECKLIST.map((c, i) => (
              <div key={i} className="flex gap-12" style={{ padding: '9px 0', borderBottom: '1px solid rgba(42,63,95,0.3)', fontSize: 13 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: c.done ? 'var(--accent2)' : 'var(--border)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, flexShrink: 0, color: c.done ? '#fff' : 'transparent'
                }}>✓</span>
                <span className={c.done ? 'text-2' : 'neg'}>{c.item} {!c.done && '— Required'}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Missing Documents Impact</div>
            <div className="alert-item alert-warn">
              <span>📄</span>
              <div><b>Audited Balance Sheet</b> is required for loans above ₹25L. Get CA-certified accounts.</div>
            </div>
            <div className="alert-item alert-warn">
              <span>📊</span>
              <div><b>Projected P&L</b> increases approval chances by 40%. Show 3-year projections.</div>
            </div>
            <div className="alert-item alert-info">
              <span>📋</span>
              <div><b>Business Plan</b> is mandatory for equity-based funding and grant applications.</div>
            </div>
            <div className="alert-item alert-success">
              <span>✅</span>
              <div>Completing all checklist items unlocks ₹45L+ in funding options across 6 schemes.</div>
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop: 12 }}>Get Funding Assistance →</button>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && <EMICalculator />}
    </>
  )
}

function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [rate, setRate]           = useState(9)
  const [tenure, setTenure]       = useState(36)

  const emi    = Math.round(principal * (rate/1200) * Math.pow(1 + rate/1200, tenure) / (Math.pow(1 + rate/1200, tenure) - 1))
  const total  = emi * tenure
  const interest = total - principal

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-title">Business Loan EMI Calculator</div>
        {[
          { label: 'Loan Amount (₹)', val: principal, set: setPrincipal, min: 100000, max: 10000000, step: 50000, fmt: v => `₹${v.toLocaleString()}` },
          { label: 'Annual Interest Rate (%)', val: rate, set: setRate, min: 6, max: 20, step: 0.5, fmt: v => `${v}%` },
          { label: 'Loan Tenure (months)', val: tenure, set: setTenure, min: 6, max: 120, step: 6, fmt: v => `${v} months` },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 14 }}>
            <div className="slider-row">
              <span className="slider-label">{s.label}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e => s.set(+e.target.value)} style={{ flex: 1, accentColor: 'var(--accent)' }} />
              <span className="slider-val" style={{ minWidth: 90 }}>{s.fmt(s.val)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">EMI Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { l: 'Monthly EMI',     v: `₹${emi.toLocaleString()}`,       c: 'var(--accent)' },
            { l: 'Total Interest',  v: `₹${interest.toLocaleString()}`,  c: 'var(--accent4)' },
            { l: 'Total Payment',   v: `₹${total.toLocaleString()}`,     c: 'var(--text)' },
            { l: 'Interest Ratio',  v: `${Math.round(interest/total*100)}%`, c: 'var(--accent3)' },
          ].map(m => (
            <div key={m.l} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div className="text-xs text-3 mb-8">{m.l}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: m.c }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div className="divider" />
        <div className="text-sm text-2">Amortization Summary</div>
        <div style={{ marginTop: 10 }}>
          {[12, 24, 36].filter(y => y <= tenure).map(y => {
            const paid = emi * y
            const paidPrincipal = principal - (principal * Math.pow(1 + rate/1200, y - tenure) * (Math.pow(1 + rate/1200, tenure) - Math.pow(1 + rate/1200, y)) / (Math.pow(1 + rate/1200, tenure) - 1))
            return (
              <div key={y} className="flex justify-between text-sm" style={{ padding: '5px 0', borderBottom: '1px solid rgba(42,63,95,0.3)' }}>
                <span className="text-2">Month {y}</span>
                <span>EMI Paid: <b>₹{paid.toLocaleString()}</b></span>
                <span className="pos">Principal: ₹{Math.round(paidPrincipal).toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
