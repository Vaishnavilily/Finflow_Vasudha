import React, { useState, useMemo } from 'react'
import ChartWidget, { COLORS } from '../../components/ChartWidget.jsx'

export default function ScenarioPlanner() {
  const [income,    setIncome]    = useState(85000)
  const [rent,      setRent]      = useState(18000)
  const [food,      setFood]      = useState(8000)
  const [transport, setTransport] = useState(3500)
  const [shopping,  setShopping]  = useState(8000)
  const [invest,    setInvest]    = useState(12000)

  const { totalExp, savings, savRate, annual, emFund } = useMemo(() => {
    const totalExp = rent + food + transport + shopping
    const savings  = income - totalExp - invest
    const savRate  = Math.round(savings / income * 100)
    const annual   = savings * 12
    const emFund   = totalExp * 6
    return { totalExp, savings, savRate, annual, emFund }
  }, [income, rent, food, transport, shopping, invest])

  const barChart = {
    type: 'bar',
    data: {
      labels: ['Income','Rent/EMI','Food','Transport','Shopping','Investments','Savings'],
      datasets: [{
        data: [income, -rent, -food, -transport, -shopping, -invest, savings],
        backgroundColor: [
          COLORS.green+'44', COLORS.red+'33', COLORS.amber+'33',
          COLORS.blue+'33', COLORS.purple+'33', COLORS.teal+'33',
          savings >= 0 ? COLORS.green+'33' : COLORS.red+'33'
        ],
        borderColor: [
          COLORS.green, COLORS.red, COLORS.amber,
          COLORS.blue, COLORS.purple, COLORS.teal,
          savings >= 0 ? COLORS.green : COLORS.red
        ],
        borderWidth: 1.5,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
        y: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
      }
    }
  }

  const sliders = [
    { label: 'Monthly Income (₹)',  val: income,    set: setIncome,    min: 30000,  max: 200000, step: 1000, fmt: v => `₹${v.toLocaleString()}` },
    { label: 'Rent / EMI (₹)',      val: rent,      set: setRent,      min: 5000,   max: 60000,  step: 500,  fmt: v => `₹${v.toLocaleString()}` },
    { label: 'Food & Dining (₹)',   val: food,      set: setFood,      min: 2000,   max: 20000,  step: 500,  fmt: v => `₹${v.toLocaleString()}` },
    { label: 'Transport (₹)',       val: transport, set: setTransport, min: 500,    max: 15000,  step: 500,  fmt: v => `₹${v.toLocaleString()}` },
    { label: 'Shopping (₹)',        val: shopping,  set: setShopping,  min: 0,      max: 30000,  step: 500,  fmt: v => `₹${v.toLocaleString()}` },
    { label: 'Investments (₹)',     val: invest,    set: setInvest,    min: 0,      max: 50000,  step: 1000, fmt: v => `₹${v.toLocaleString()}` },
  ]

  const alertCls = savRate >= 20 ? 'alert-success' : savRate >= 10 ? 'alert-warn' : 'alert-danger'
  const alertMsg = savRate >= 20 ? 'Excellent savings rate! You are on track for financial independence.'
    : savRate >= 10 ? 'Decent savings rate. Try to reach the 20% benchmark.'
    : 'Low savings rate. Reduce discretionary spending urgently.'

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">What-If Scenario Planner</div>
          {sliders.map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div className="slider-row">
                <span className="slider-label">{s.label}</span>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                  onChange={e => s.set(+e.target.value)} style={{ flex: 1, accentColor: 'var(--accent)' }} />
                <span className="slider-val">{s.fmt(s.val)}</span>
              </div>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {[
              { l: 'Monthly Savings', v: `${savings >= 0 ? '+' : ''}₹${savings.toLocaleString()}`, c: savings >= 0 ? 'var(--accent2)' : 'var(--accent4)' },
              { l: 'Annual Savings',  v: `${annual >= 0 ? '+' : ''}₹${annual.toLocaleString()}`,  c: annual >= 0 ? 'var(--accent2)' : 'var(--accent4)' },
              { l: 'Savings Rate',    v: `${savRate}%`, c: savRate >= 20 ? 'var(--accent2)' : savRate >= 10 ? 'var(--accent3)' : 'var(--accent4)' },
              { l: 'Emergency Fund Needed', v: `₹${emFund.toLocaleString()}`, c: 'var(--accent)' },
            ].map(m => (
              <div key={m.l} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div className="text-xs text-3 mb-8">{m.l}</div>
                <div style={{ fontSize: 19, fontWeight: 600, color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>

          <div className={`alert-item ${alertCls}`} style={{ marginTop: 12 }}>
            <span>{savRate >= 20 ? '✅' : savRate >= 10 ? '⚠️' : '❌'}</span>
            <div>{alertMsg}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Scenario Comparison Chart</div>
          <ChartWidget id="scenario-bar" config={barChart} height={280} />
          <div className="alert-item alert-info" style={{ marginTop: 12 }}>
            <span>🔮</span>
            <div>
              {savings >= 0
                ? `At this rate, you will save ₹${annual.toLocaleString()} per year. In 5 years: ₹${(annual * 5).toLocaleString()}.`
                : `You are overspending by ₹${Math.abs(savings).toLocaleString()}/month. Adjust sliders to reach a positive balance.`
              }
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="text-xs text-3 mb-8">5-Year Wealth Projection (at 10% CAGR)</div>
            {savings > 0 && (
              <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 12 }}>
                {[1,3,5,10].map(yr => {
                  const fv = annual * ((Math.pow(1.10/12 + 1, yr * 12) - 1) / (0.10/12))
                  return (
                    <div key={yr} className="flex justify-between text-sm" style={{ padding: '4px 0' }}>
                      <span className="text-2">{yr} Year{yr > 1 ? 's' : ''}</span>
                      <span className="pos">₹{Math.round(fv).toLocaleString()}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
