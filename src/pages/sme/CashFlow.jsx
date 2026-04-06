import React, { useState, useMemo } from 'react'
import ChartWidget, { CHART_DEFAULTS, COLORS, lineDataset, legendPlugin } from '../../components/ChartWidget.jsx'

const MONTHS_12 = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

export default function SmeCashFlow() {
  const [rev, setRev] = useState(12)
  const [exp, setExp] = useState(8)
  const [rec, setRec] = useState(28)

  const scenario = useMemo(() => {
    const profit = (rev - exp) * 100000
    const margin = Math.round((rev - exp) / rev * 100)
    const dailyBurn = Math.round(exp * 100000 / 30)
    return { profit, margin, dailyBurn }
  }, [rev, exp, rec])

  const cfChart = {
    type: 'line',
    data: {
      labels: MONTHS_12,
      datasets: [
        lineDataset('Cash Inflow',  [1080,1150,1200,1280,1180,1240,1300,1200,1350,1400,1320,1450].map(v=>v*1000), COLORS.green, true),
        lineDataset('Cash Outflow', [750,760,800,820,770,790,830,800,840,870,850,900].map(v=>v*1000),             COLORS.red,   true),
        lineDataset('Net Cash',     [330,390,400,460,410,450,470,400,510,530,470,550].map(v=>v*1000),             COLORS.amber, false, { borderDash:[6,3] }),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const receivables = [
    { bucket: '0-30 days',  amt: 285000, count: 8, color: COLORS.green },
    { bucket: '31-60 days', amt: 145000, count: 5, color: COLORS.amber },
    { bucket: '61-90 days', amt: 78000,  count: 3, color: COLORS.red },
    { bucket: '90+ days',   amt: 34000,  count: 2, color: '#ef444460' },
  ]

  const alertCls = scenario.margin >= 30 ? 'alert-success' : scenario.margin >= 15 ? 'alert-warn' : 'alert-danger'

  return (
    <>
      <div className="grid-3">
        <div className="metric"><div className="metric-label">Operating Cash Flow</div><div className="metric-val">₹4.2L</div><div className="metric-change pos">Healthy</div></div>
        <div className="metric"><div className="metric-label">Investing Activities</div><div className="metric-val">-₹1.5L</div><div className="metric-change text-3">Equipment purchase</div></div>
        <div className="metric"><div className="metric-label">Free Cash Flow</div><div className="metric-val">₹2.7L</div><div className="metric-change pos">Available for growth</div></div>
      </div>

      <div className="card mb-16">
        <div className="card-title">
          12-Month Cash Flow Forecast
          <span className="badge badge-purple">ML Predicted</span>
        </div>
        <ChartWidget id="sme-cf-main" config={cfChart} height={270} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Receivables Aging</div>
          {receivables.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="flex justify-between mb-8 text-sm">
                <span>{r.bucket}</span>
                <span style={{ color: r.color }}>₹{(r.amt/1000).toFixed(0)}K ({r.count} invoices)</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${r.amt / 5500}%`, background: r.color }} />
              </div>
            </div>
          ))}
          <div className="divider" />
          <div className="flex justify-between text-sm mb-12">
            <span className="text-2">Total Outstanding</span>
            <span style={{ fontWeight: 500 }}>₹{(receivables.reduce((s,r)=>s+r.amt,0)/1000).toFixed(0)}K</span>
          </div>
          <button className="btn btn-primary btn-sm">Send Payment Reminders</button>
        </div>

        <div className="card">
          <div className="card-title">Cash Flow Scenario Planner</div>

          {[
            { label: 'Monthly Revenue (₹L)', val: rev, set: setRev, min: 5,  max: 30, step: 1, fmt: v => `₹${v}L` },
            { label: 'Monthly Expenses (₹L)', val: exp, set: setExp, min: 3,  max: 25, step: 1, fmt: v => `₹${v}L` },
            { label: 'Receivable Days',       val: rec, set: setRec, min: 7,  max: 90, step: 1, fmt: v => `${v} days` },
          ].map(s => (
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
              { l: 'Monthly Profit',  v: `${scenario.profit >= 0 ? '+' : ''}₹${(scenario.profit/100000).toFixed(1)}L`, c: scenario.profit >= 0 ? 'var(--accent2)' : 'var(--accent4)' },
              { l: 'Profit Margin',   v: `${scenario.margin}%`, c: scenario.margin >= 30 ? 'var(--accent2)' : scenario.margin >= 15 ? 'var(--accent3)' : 'var(--accent4)' },
              { l: 'Daily Burn Rate', v: `₹${scenario.dailyBurn.toLocaleString()}`, c: 'var(--accent)' },
              { l: 'Receivable Days', v: `${rec} days`, c: rec <= 30 ? 'var(--accent3)' : 'var(--accent2)' },
            ].map(m => (
              <div key={m.l} style={{ background: 'var(--bg3)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div className="text-xs text-3 mb-8">{m.l}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>

          <div className={`alert-item ${alertCls}`} style={{ marginTop: 12 }}>
            <span>{scenario.margin >= 30 ? '✅' : scenario.margin >= 15 ? '⚠️' : '❌'}</span>
            <div className="text-sm">
              {scenario.margin >= 30 ? 'Healthy margins. Consider reinvesting profit into growth.'
                : scenario.margin >= 15 ? 'Average margins. Optimize expense structure to improve.'
                : 'Margins are critically thin. Review pricing and cost structure immediately.'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
