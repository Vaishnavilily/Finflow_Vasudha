import React, { useState, useMemo } from 'react'
import ChartWidget, { COLORS } from '../../components/ChartWidget.jsx'

export default function PricingTool() {
  const [cogs,       setCogs]       = useState(15000)
  const [overhead,   setOverhead]   = useState(5000)
  const [margin,     setMargin]     = useState(35)
  const [compPrice,  setCompPrice]  = useState(32000)
  const [prodName,   setProdName]   = useState('Web Design Package')

  const calc = useMemo(() => {
    const totalCost = cogs + overhead
    const recPrice  = Math.round(totalCost / (1 - margin / 100))
    const profit    = recPrice - totalCost
    const vsComp    = recPrice - compPrice
    return { totalCost, recPrice, profit, vsComp }
  }, [cogs, overhead, margin, compPrice])

  const barChart = {
    type: 'bar',
    data: {
      labels: ['COGS', 'Overhead', 'Profit', 'Rec. Price', 'Competitor'],
      datasets: [{
        data: [cogs, overhead, calc.profit, calc.recPrice, compPrice],
        backgroundColor: [COLORS.red+'33', COLORS.amber+'33', COLORS.green+'33', COLORS.blue+'33', COLORS.purple+'33'],
        borderColor:     [COLORS.red,      COLORS.amber,      COLORS.green,      COLORS.blue,      COLORS.purple],
        borderWidth: 1.5, borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
        y: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 }, callback: v => `₹${(v/1000).toFixed(0)}K` } },
      }
    }
  }

  const strategies = [
    { s: 'Cost-Plus Pricing',  d: 'Add a fixed % markup to total costs.',      pro: 'Simple, ensures cost coverage', con: 'Ignores market demand',       rec: true },
    { s: 'Value-Based Pricing',d: 'Price based on perceived customer value.',  pro: 'Higher margins possible',       con: 'Requires deep market research', rec: false },
    { s: 'Competitive Pricing',d: 'Match or undercut competitor prices.',      pro: 'Easy market positioning',      con: 'Price war risk',               rec: false },
    { s: 'Freemium Model',     d: 'Basic free, premium paid tiers.',           pro: 'High customer acquisition',     con: 'Conversion uncertainty',       rec: false },
  ]

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Recommended Price</div><div className="metric-val" style={{ color: 'var(--accent)' }}>₹{calc.recPrice.toLocaleString()}</div><div className="metric-change pos">At {margin}% margin</div></div>
        <div className="metric"><div className="metric-label">Profit Per Unit</div><div className="metric-val">₹{calc.profit.toLocaleString()}</div><div className="metric-change pos">{margin}% gross margin</div></div>
        <div className="metric"><div className="metric-label">vs Competitor</div><div className="metric-val" style={{ color: calc.vsComp < 0 ? 'var(--accent2)' : 'var(--accent4)' }}>₹{Math.abs(calc.vsComp).toLocaleString()}</div><div className={`metric-change ${calc.vsComp < 0 ? 'pos' : 'neg'}`}>{calc.vsComp < 0 ? 'Lower' : 'Higher'} than competitor</div></div>
        <div className="metric"><div className="metric-label">Break-even Units</div><div className="metric-val">{Math.ceil(calc.totalCost / calc.profit)}</div><div className="metric-change text-3">Per month to cover costs</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Profit Margin Calculator</div>
          <div className="form-group">
            <label className="label">Product / Service Name</label>
            <input className="input" value={prodName} onChange={e => setProdName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Cost of Goods / Service Delivery (₹)</label>
            <input className="input" type="number" value={cogs} onChange={e => setCogs(+e.target.value || 0)} />
          </div>
          <div className="form-group">
            <label className="label">Overhead Allocation per Unit (₹)</label>
            <input className="input" type="number" value={overhead} onChange={e => setOverhead(+e.target.value || 0)} />
          </div>
          <div className="form-group">
            <label className="label">Target Gross Margin: <b style={{ color: 'var(--accent)' }}>{margin}%</b></label>
            <input type="range" min={5} max={80} step={1} value={margin}
              onChange={e => setMargin(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 4 }} />
          </div>
          <div className="form-group">
            <label className="label">Competitor Price (₹)</label>
            <input className="input" type="number" value={compPrice} onChange={e => setCompPrice(+e.target.value || 0)} />
          </div>

          <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 14 }}>
            {[
              { l: 'Total Cost',          v: `₹${calc.totalCost.toLocaleString()}`,  cls: '' },
              { l: `Profit (${margin}%)`, v: `₹${calc.profit.toLocaleString()}`,     cls: 'pos' },
              { l: 'Competitor Price',    v: `₹${compPrice.toLocaleString()}`,        cls: '' },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-sm" style={{ padding: '5px 0', borderBottom: '1px solid var(--border)20' }}>
                <span className="text-2">{r.l}</span>
                <span className={r.cls}>{r.v}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '8px 0' }} />
            <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 600 }}>
              <span>Recommended Price</span>
              <span style={{ color: 'var(--accent)' }}>₹{calc.recPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-8">
              <span className="text-3">vs Competitor</span>
              <span className={calc.vsComp < 0 ? 'pos' : 'neg'}>
                {calc.vsComp < 0 ? `₹${Math.abs(calc.vsComp).toLocaleString()} lower` : `₹${calc.vsComp.toLocaleString()} higher`}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Price Breakdown Chart</div>
            <ChartWidget id="pricing-bar" config={barChart} height={200} />
          </div>
        </div>

        <div className="card">
          <div className="card-title">Pricing Strategy Guide</div>
          {strategies.map((s, i) => (
            <div key={i} style={{
              background: s.rec ? 'rgba(59,130,246,0.08)' : 'var(--bg3)',
              border: `1px solid ${s.rec ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
              borderRadius: 10, padding: 12, marginBottom: 10
            }}>
              <div className="flex justify-between mb-8">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{s.s}</span>
                {s.rec && <span className="badge badge-blue">Recommended</span>}
              </div>
              <div className="text-sm text-3 mb-8">{s.d}</div>
              <div className="flex gap-16 text-xs">
                <span className="pos">+ {s.pro}</span>
                <span className="neg">− {s.con}</span>
              </div>
            </div>
          ))}

          <div className="divider" />
          <div className="card-title" style={{ marginBottom: 10 }}>Volume Pricing Tiers</div>
          <table className="table">
            <thead><tr><th>Units / Month</th><th>Price per Unit</th><th>Discount</th><th>Margin</th></tr></thead>
            <tbody>
              {[
                { units: '1–5',   price: calc.recPrice,                        disc: '0%',   margin: `${margin}%` },
                { units: '6–20',  price: Math.round(calc.recPrice * 0.95),     disc: '5%',   margin: `${Math.round((1 - calc.totalCost / (calc.recPrice * 0.95)) * 100)}%` },
                { units: '21–50', price: Math.round(calc.recPrice * 0.90),     disc: '10%',  margin: `${Math.round((1 - calc.totalCost / (calc.recPrice * 0.90)) * 100)}%` },
                { units: '50+',   price: Math.round(calc.recPrice * 0.85),     disc: '15%',  margin: `${Math.round((1 - calc.totalCost / (calc.recPrice * 0.85)) * 100)}%` },
              ].map(t => (
                <tr key={t.units}>
                  <td>{t.units}</td>
                  <td style={{ fontWeight: 500 }}>₹{t.price.toLocaleString()}</td>
                  <td className="pos">{t.disc}</td>
                  <td className="warn">{t.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
