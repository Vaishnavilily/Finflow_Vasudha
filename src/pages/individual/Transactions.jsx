import React, { useState } from 'react'

const INIT_TXNS = [
  { date: '01 Apr', desc: 'Salary Credit',       cat: 'Income',      catCls: 'badge-green',  amt: 85000 },
  { date: '02 Apr', desc: 'Home Loan EMI',        cat: 'Loan',        catCls: 'badge-red',    amt: -12000 },
  { date: '03 Apr', desc: 'Swiggy',               cat: 'Food',        catCls: 'badge-amber',  amt: -420 },
  { date: '05 Apr', desc: 'SIP - Axis Bluechip',  cat: 'Investment',  catCls: 'badge-purple', amt: -5000 },
  { date: '05 Apr', desc: 'Electricity Bill',     cat: 'Utilities',   catCls: 'badge-blue',   amt: -1840 },
  { date: '06 Apr', desc: 'Amazon Order',         cat: 'Shopping',    catCls: 'badge-blue',   amt: -2150 },
  { date: '07 Apr', desc: 'Netflix',              cat: 'Entertain',   catCls: 'badge-purple', amt: -649 },
  { date: '08 Apr', desc: 'Ola Ride',             cat: 'Transport',   catCls: 'badge-amber',  amt: -180 },
  { date: '10 Apr', desc: 'Freelance Income',     cat: 'Income',      catCls: 'badge-green',  amt: 12000 },
  { date: '11 Apr', desc: 'Zomato',               cat: 'Food',        catCls: 'badge-amber',  amt: -350 },
  { date: '12 Apr', desc: 'Gym Membership',       cat: 'Health',      catCls: 'badge-green',  amt: -1200 },
  { date: '13 Apr', desc: 'Water Bill',           cat: 'Utilities',   catCls: 'badge-blue',   amt: -450 },
]

const CATS = ['All','Income','Food','Shopping','Transport','Loan','Investment','Utilities','Entertain','Health']

export default function Transactions() {
  const [txns, setTxns]     = useState(INIT_TXNS)
  const [filter, setFilter] = useState('All')
  const [form, setForm]     = useState({ date: '', desc: '', cat: 'Food', amt: '' })

  const filtered = filter === 'All' ? txns : txns.filter(t => t.cat === filter)
  const credits  = txns.filter(t => t.amt > 0).reduce((s, t) => s + t.amt, 0)
  const debits   = txns.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0)

  function addTxn() {
    if (!form.desc || !form.amt) return
    const amt = parseFloat(form.amt)
    const catCls = form.cat === 'Income' ? 'badge-green' : form.cat === 'Loan' ? 'badge-red'
      : form.cat === 'Food' ? 'badge-amber' : 'badge-blue'
    setTxns(prev => [{ date: 'Today', desc: form.desc, cat: form.cat, catCls, amt }, ...prev])
    setForm({ date: '', desc: '', cat: 'Food', amt: '' })
  }

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Total Credits</div><div className="metric-val">₹{credits.toLocaleString()}</div><div className="metric-change pos">This month</div></div>
        <div className="metric"><div className="metric-label">Total Debits</div><div className="metric-val">₹{debits.toLocaleString()}</div><div className="metric-change neg">This month</div></div>
        <div className="metric"><div className="metric-label">Transactions</div><div className="metric-val">{txns.length}</div><div className="metric-change text-3">This month</div></div>
        <div className="metric"><div className="metric-label">Net Flow</div><div className="metric-val" style={{ color: credits-debits >= 0 ? 'var(--accent2)' : 'var(--accent4)' }}>₹{(credits-debits).toLocaleString()}</div><div className="metric-change pos">Cash flow</div></div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-title">
            All Transactions
            <div className="flex gap-8">
              <select className="select" style={{ width: 150, padding: '6px 10px', fontSize: 12 }}
                value={filter} onChange={e => setFilter(e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className="btn btn-outline btn-sm">Export CSV</button>
            </div>
          </div>
          <table className="table">
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i}>
                  <td className="text-3">{t.date}</td>
                  <td>{t.desc}</td>
                  <td><span className={`badge ${t.catCls}`}>{t.cat}</span></td>
                  <td className={t.amt > 0 ? 'pos' : 'neg'}>{t.amt > 0 ? '+' : ''}₹{Math.abs(t.amt).toLocaleString()}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => setTxns(prev => prev.filter((_, j) => j !== i))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Add Transaction</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div><label className="label">Category</label>
            <select className="select" value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))}>
              {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Description</label>
            <input className="input" placeholder="Transaction description" value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
          </div>
          <div><label className="label">Amount (₹)</label>
            <input className="input" type="number" placeholder="+/- amount" value={form.amt} onChange={e => setForm(p => ({ ...p, amt: e.target.value }))} />
          </div>
          <div><label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div><button className="btn btn-primary" onClick={addTxn}>+ Add</button></div>
        </div>
      </div>
    </>
  )
}
