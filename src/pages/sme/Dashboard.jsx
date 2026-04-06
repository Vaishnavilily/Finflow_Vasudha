import React from 'react'
import ChartWidget, { CHART_DEFAULTS, COLORS, barDataset, legendPlugin } from '../../components/ChartWidget.jsx'

const MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar']

export default function SmeDashboard({ onNavigate }) {
  const revExpChart = {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        barDataset('Revenue',  [1080000,1150000,1200000,1180000,1220000,1240000], COLORS.green),
        barDataset('Expenses', [750000,760000,800000,770000,790000,780000],       COLORS.red),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const segChart = {
    type: 'doughnut',
    data: {
      labels: ['Product Sales','Services','Consulting','Licensing'],
      datasets: [{
        data: [480000,380000,240000,140000],
        backgroundColor: [COLORS.blue,COLORS.green,COLORS.amber,COLORS.purple],
        borderWidth: 0, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { display: true, position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10 } } }
    }
  }

  const cfChart = {
    type: 'bar',
    data: {
      labels: ['Inflows','Outflows','Net'],
      datasets: [{
        data: [1240000, 780000, 460000],
        backgroundColor: [COLORS.green+'33', COLORS.red+'33', COLORS.blue+'33'],
        borderColor:     [COLORS.green,      COLORS.red,      COLORS.blue],
        borderWidth: 1.5, borderRadius: 4
      }]
    },
    options: { ...CHART_DEFAULTS }
  }

  const expenses = [
    { n: 'Payroll',        a: 380000, pct: 49, c: COLORS.blue },
    { n: 'Operations',     a: 152000, pct: 20, c: COLORS.green },
    { n: 'Marketing',      a: 78000,  pct: 10, c: COLORS.amber },
    { n: 'Technology',     a: 62000,  pct: 8,  c: COLORS.purple },
    { n: 'Rent/Utilities', a: 85000,  pct: 11, c: COLORS.red },
    { n: 'Other',          a: 23000,  pct: 3,  c: COLORS.gray },
  ]

  const kpis = [
    { k: 'Gross Margin',      v: '58.4%',    t: 'pos' },
    { k: 'Operating Margin',  v: '37.1%',    t: 'pos' },
    { k: 'Current Ratio',     v: '2.1',      t: 'pos' },
    { k: 'Quick Ratio',       v: '1.8',      t: 'pos' },
    { k: 'Debt-to-Equity',    v: '0.42',     t: 'warn' },
    { k: 'Receivable Days',   v: '28 days',  t: 'warn' },
    { k: 'Payable Days',      v: '21 days',  t: 'pos' },
    { k: 'Monthly Burn Rate', v: '₹7.8L/mo', t: 'neg' },
  ]

  return (
    <>
      <div className="grid-4">
        {[
          { label: 'Monthly Revenue',   val: '₹12.4L',  change: '↑ 8% vs last month',   cls: 'pos' },
          { label: 'Operating Expenses',val: '₹7.8L',   change: '↑ 3.2% over plan',     cls: 'warn' },
          { label: 'Net Profit',        val: '₹4.6L',   change: '37.1% margin',          cls: 'pos' },
          { label: 'Pending Invoices',  val: '₹3.2L',   change: '4 overdue invoices',    cls: 'neg' },
        ].map(m => (
          <div className="metric" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-val">{m.val}</div>
            <div className={`metric-change ${m.cls}`}>{m.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Revenue vs Expenses (6M) <span className="badge badge-green">FY 2024-25</span></div>
          <ChartWidget id="sme-rev-exp" config={revExpChart} />
        </div>
        <div className="card">
          <div className="card-title">Revenue by Segment <span className="badge badge-blue">This Quarter</span></div>
          <ChartWidget id="sme-seg" config={segChart} />
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-title">Cash Flow Status</div>
          <ChartWidget id="sme-cf" config={cfChart} height={170} />
          <div className="alert-item alert-warn" style={{ marginTop: 10 }}>
            <span>⚠</span>
            <div className="text-sm">Cash buffer of 18 days. Recommended: 30 days.</div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => onNavigate('cashflow')}>
            View Cash Flow →
          </button>
        </div>

        <div className="card">
          <div className="card-title">Expense Breakdown</div>
          {expenses.map((e, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div className="flex justify-between mb-8 text-sm">
                <span className="text-2">{e.n}</span>
                <span>₹{(e.a/1000).toFixed(0)}K <span className="text-3">{e.pct}%</span></span>
              </div>
              <div className="progress-bar" style={{ height: 5 }}>
                <div className="progress-fill" style={{ width: `${e.pct * 1.8}%`, background: e.c }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Key KPIs</div>
          {kpis.map((k, i) => (
            <div key={i} className="flex justify-between" style={{ padding: '7px 0', borderBottom: '1px solid rgba(42,63,95,0.3)', fontSize: 13 }}>
              <span className="text-2">{k.k}</span>
              <span className={k.t}>{k.v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
