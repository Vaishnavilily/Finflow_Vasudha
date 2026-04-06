import React from 'react'
import ChartWidget, { CHART_DEFAULTS, COLORS, lineDataset, legendPlugin } from '../../components/ChartWidget.jsx'

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']

const FORECAST_DATA = [
  { m: 'April 2025',     inc: 85000,  exp: 52400, sav: 32600 },
  { m: 'May 2025',       inc: 87000,  exp: 54200, sav: 32800 },
  { m: 'June 2025',      inc: 89000,  exp: 53000, sav: 36000 },
  { m: 'July 2025',      inc: 91000,  exp: 55800, sav: 35200 },
  { m: 'August 2025',    inc: 91000,  exp: 54500, sav: 36500 },
  { m: 'September 2025', inc: 93000,  exp: 57000, sav: 36000 },
]

export default function CashForecast() {
  const forecastChart = {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        lineDataset('Income',   [85000,87000,89000,91000,91000,93000,95000,97000], COLORS.green, true),
        lineDataset('Expenses', [52400,54200,53000,55800,54500,57000,56000,58000], COLORS.red, true),
        lineDataset('Forecast', [null,null,null,null,91000,93000,95000,97000],    COLORS.amber, false, { borderDash: [6,3] }),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const savingsChart = {
    type: 'line',
    data: {
      labels: ['Apr','May','Jun','Jul','Aug','Sep'],
      datasets: [
        lineDataset('Accumulated Savings',
          [32600, 65400, 101400, 136600, 173100, 209100],
          COLORS.purple, true)
      ]
    },
    options: { ...CHART_DEFAULTS }
  }

  const cumulative = FORECAST_DATA.reduce((acc, r, i) => {
    acc.push((acc[i - 1] || 0) + r.sav)
    return acc
  }, [])

  return (
    <>
      <div className="grid-3">
        <div className="metric">
          <div className="metric-label">Projected Income (Q2)</div>
          <div className="metric-val">₹2,55,000</div>
          <div className="metric-change pos">↑ 5% growth trend</div>
        </div>
        <div className="metric">
          <div className="metric-label">Projected Expenses (Q2)</div>
          <div className="metric-val">₹1,62,000</div>
          <div className="metric-change warn">Based on 3-month avg</div>
        </div>
        <div className="metric">
          <div className="metric-label">Projected Savings (Q2)</div>
          <div className="metric-val">₹93,000</div>
          <div className="metric-change pos">Estimated surplus</div>
        </div>
      </div>

      <div className="card mb-16">
        <div className="card-title">
          6-Month Income & Expense Forecast
          <span className="badge badge-purple">AI-Predicted</span>
        </div>
        <ChartWidget id="forecast-main" config={forecastChart} height={270} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Monthly Forecast Breakdown</div>
          <div className="flex justify-between mb-8 text-xs text-3" style={{ padding: '0 2px' }}>
            <span>Month</span><span>Income</span><span>Expense</span><span>Savings</span>
          </div>
          {FORECAST_DATA.map((r, i) => (
            <div key={i} className="forecast-row">
              <span className="text-sm">{r.m}</span>
              <span className="pos text-sm">+₹{r.inc.toLocaleString()}</span>
              <span className="neg text-sm">-₹{r.exp.toLocaleString()}</span>
              <span className="pos text-sm">₹{r.sav.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between mt-8" style={{ padding: '8px 0', borderTop: '1px solid var(--border)', fontWeight: 500 }}>
            <span className="text-sm">6-Month Total</span>
            <span className="pos text-sm">₹{FORECAST_DATA.reduce((s,r)=>s+r.sav,0).toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Savings Accumulation</div>
          <ChartWidget id="savings-accum" config={savingsChart} />
          <div className="alert-item alert-success" style={{ marginTop: 12 }}>
            <span>📈</span>
            <div>At this rate, you will accumulate <b>₹2.09L</b> in savings by September 2025.</div>
          </div>
        </div>
      </div>
    </>
  )
}
