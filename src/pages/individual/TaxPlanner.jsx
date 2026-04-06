import React, { useState, useMemo } from 'react'

export default function TaxPlanner() {
  const [income,  setIncome]  = useState(1000000)
  const [regime,  setRegime]  = useState('new')
  const [ded80c,  setDed80c]  = useState(150000)
  const [hra,     setHra]     = useState(84000)
  const [other,   setOther]   = useState(50000)

  const result = useMemo(() => {
    let taxable = income
    if (regime === 'old') {
      taxable = Math.max(0, income - ded80c - hra - other - 50000)
    } else {
      taxable = Math.max(0, income - 75000)
    }

    let tax = 0
    if (regime === 'new') {
      if      (taxable <= 300000)  tax = 0
      else if (taxable <= 700000)  tax = (taxable - 300000) * 0.05
      else if (taxable <= 1000000) tax = 20000  + (taxable - 700000)  * 0.10
      else if (taxable <= 1200000) tax = 50000  + (taxable - 1000000) * 0.15
      else if (taxable <= 1500000) tax = 80000  + (taxable - 1200000) * 0.20
      else                         tax = 140000 + (taxable - 1500000) * 0.30
    } else {
      if      (taxable <= 250000)  tax = 0
      else if (taxable <= 500000)  tax = (taxable - 250000) * 0.05
      else if (taxable <= 1000000) tax = 12500  + (taxable - 500000)  * 0.20
      else                         tax = 112500 + (taxable - 1000000) * 0.30
    }

    const cess    = Math.round(tax * 0.04)
    const total   = Math.round(tax + cess)
    const monthly = Math.round(total / 12)
    const effRate = (total / income * 100).toFixed(1)
    return { taxable, tax: Math.round(tax), cess, total, monthly, effRate }
  }, [income, regime, ded80c, hra, other])

  const saving = [{
    section: 'Section 80C', desc: 'PF, ELSS, LIC, PPF, NSC', max: '₹1,50,000',
    used: '₹1,20,000', tip: 'Invest ₹30,000 more in ELSS to max out deduction'
  }, {
    section: 'Section 80D', desc: 'Health Insurance Premium', max: '₹25,000',
    used: '₹12,000', tip: 'Increase health cover to claim full ₹25,000'
  }, {
    section: 'Section 24', desc: 'Home Loan Interest', max: '₹2,00,000',
    used: '₹1,44,000', tip: 'Well utilized — ₹56,000 remaining'
  }, {
    section: 'NPS 80CCD(1B)', desc: 'NPS Additional', max: '₹50,000',
    used: '₹0', tip: 'Invest in NPS to save additional tax of ₹15,600'
  }, {
    section: '80TTA', desc: 'Savings Account Interest', max: '₹10,000',
    used: '₹6,000', tip: 'Claim remaining ₹4,000 if eligible'
  }]

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Income Tax Calculator (FY 2024-25)</div>

          <div className="form-group">
            <label className="label">Annual Gross Income (₹)</label>
            <input className="input" type="number" value={income} onChange={e => setIncome(+e.target.value || 0)} />
          </div>
          <div className="form-group">
            <label className="label">Tax Regime</label>
            <select className="select" value={regime} onChange={e => setRegime(e.target.value)}>
              <option value="new">New Regime (Default from FY 2023-24)</option>
              <option value="old">Old Regime (With deductions)</option>
            </select>
          </div>
          {regime === 'old' && <>
            <div className="form-group">
              <label className="label">Section 80C Deductions (₹)</label>
              <input className="input" type="number" value={ded80c} onChange={e => setDed80c(+e.target.value || 0)} />
            </div>
            <div className="form-group">
              <label className="label">HRA Exemption (₹)</label>
              <input className="input" type="number" value={hra} onChange={e => setHra(+e.target.value || 0)} />
            </div>
            <div className="form-group">
              <label className="label">Other Deductions (₹)</label>
              <input className="input" type="number" value={other} onChange={e => setOther(+e.target.value || 0)} />
            </div>
          </>}

          <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 16, marginTop: 8 }}>
            {[
              { l: 'Gross Income',              v: `₹${income.toLocaleString()}`,         cls: '' },
              { l: 'Taxable Income',             v: `₹${result.taxable.toLocaleString()}`, cls: '' },
              { l: 'Income Tax',                 v: `₹${result.tax.toLocaleString()}`,     cls: 'neg' },
              { l: 'Health & Education Cess 4%', v: `₹${result.cess.toLocaleString()}`,    cls: 'neg' },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-sm" style={{ padding: '5px 0', borderBottom: '1px solid var(--border)20' }}>
                <span className="text-2">{r.l}</span>
                <span className={r.cls}>{r.v}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '8px 0' }} />
            <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 600 }}>
              <span>Total Tax Liability</span>
              <span className="neg">₹{result.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-8">
              <span className="text-3">Monthly TDS</span>
              <span className="warn">₹{result.monthly.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between text-sm" style={{ marginTop: 4 }}>
              <span className="text-3">Effective Tax Rate</span>
              <span className="text-2">{result.effRate}%</span>
            </div>
          </div>

          <div className="alert-item alert-info" style={{ marginTop: 12 }}>
            <span>💡</span>
            <div>
              {regime === 'new'
                ? 'Switch to Old Regime and maximize deductions to potentially save more tax.'
                : 'You are using Old Regime. Make sure to max out all deductions.'}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Tax Saving Opportunities</div>
          {saving.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div className="flex justify-between mb-8">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{s.section}</span>
                <span className="badge badge-blue">{s.max}</span>
              </div>
              <div className="text-xs text-3 mb-8">{s.desc}</div>
              <div className="flex justify-between text-sm">
                <span className="text-2">Used: {s.used}</span>
                <span style={{ color: 'var(--accent2)', fontSize: 12 }}>💡 {s.tip}</span>
              </div>
            </div>
          ))}
          <div className="alert-item alert-success" style={{ marginTop: 8 }}>
            <span>💰</span>
            <div>You can save up to <b>₹18,720</b> more in taxes by optimising 80C and NPS contributions.</div>
          </div>
        </div>
      </div>
    </>
  )
}
