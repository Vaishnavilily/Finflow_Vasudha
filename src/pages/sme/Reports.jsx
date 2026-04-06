import React from 'react'
import ChartWidget, { CHART_DEFAULTS, COLORS, barDataset, lineDataset, legendPlugin } from '../../components/ChartWidget.jsx'

export default function Reports() {
  const plChart = {
    type: 'bar',
    data: {
      labels: ['Q1 24','Q2 24','Q3 24','Q4 24','Q1 25'],
      datasets: [
        barDataset('Revenue',    [3100000,3300000,3200000,3500000,3480000], COLORS.green),
        barDataset('Expenses',   [2200000,2300000,2250000,2400000,2360000], COLORS.red),
        barDataset('Net Profit', [900000,1000000,950000,1100000,1120000],   COLORS.blue),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const revByProduct = {
    type: 'doughnut',
    data: {
      labels: ['Product A','Product B','Services','Consulting','Licensing'],
      datasets: [{
        data: [1200000,950000,760000,380000,190000],
        backgroundColor: [COLORS.blue,COLORS.green,COLORS.amber,COLORS.purple,COLORS.red],
        borderWidth: 0, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { display: true, position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10 } } }
    }
  }

  const yoyChart = {
    type: 'line',
    data: {
      labels: ['Q1','Q2','Q3','Q4'],
      datasets: [
        lineDataset('FY 2023-24', [2800000,3100000,3000000,3200000], COLORS.gray,  false, { borderDash: [5,3] }),
        lineDataset('FY 2024-25', [3100000,3300000,3200000,3500000], COLORS.blue,  true),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const DOWNLOAD_REPORTS = [
    { name: 'P&L Statement (Q1 2025)',     fmt: 'PDF',   size: '2.1 MB' },
    { name: 'Balance Sheet (Mar 2025)',    fmt: 'PDF',   size: '1.8 MB' },
    { name: 'Cash Flow Statement',         fmt: 'PDF',   size: '1.2 MB' },
    { name: 'GST Reconciliation Report',   fmt: 'Excel', size: '845 KB' },
    { name: 'Expense Analysis Report',     fmt: 'Excel', size: '1.1 MB' },
    { name: 'Customer Revenue Report',     fmt: 'CSV',   size: '320 KB' },
    { name: 'Employee Cost Summary',       fmt: 'Excel', size: '680 KB' },
    { name: 'Vendor Payment Report',       fmt: 'CSV',   size: '210 KB' },
  ]

  return (
    <>
      <div className="grid-3">
        <div className="metric"><div className="metric-label">Q1 Revenue</div><div className="metric-val">₹34.8L</div><div className="metric-change pos">↑ 12% YoY</div></div>
        <div className="metric"><div className="metric-label">Q1 Net Profit</div><div className="metric-val">₹11.2L</div><div className="metric-change pos">32.2% margin</div></div>
        <div className="metric"><div className="metric-label">Q1 Customers</div><div className="metric-val">148</div><div className="metric-change pos">↑ 23 new</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Quarterly P&L Summary</div>
          <ChartWidget id="rpt-pl" config={plChart} height={260} />
        </div>
        <div className="card">
          <div className="card-title">Revenue by Product Line</div>
          <ChartWidget id="rpt-seg" config={revByProduct} height={260} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Year-over-Year Comparison</div>
          <ChartWidget id="rpt-yoy" config={yoyChart} height={240} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            {[
              { l: 'Revenue Growth',  v: '+12.3% YoY',  c: 'pos' },
              { l: 'Margin Change',   v: '+2.8% YoY',   c: 'pos' },
              { l: 'Cost Efficiency', v: '↑ Improved',  c: 'pos' },
              { l: 'Customer Growth', v: '+18.4% YoY',  c: 'pos' },
            ].map(m => (
              <div key={m.l} style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                <div className="text-xs text-3 mb-8">{m.l}</div>
                <div className={`text-sm ${m.c}`} style={{ fontWeight: 500 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Download Reports</div>
          {DOWNLOAD_REPORTS.map((r, i) => (
            <div key={i} className="flex justify-between" style={{ padding: '10px 0', borderBottom: '1px solid rgba(42,63,95,0.3)' }}>
              <div>
                <div className="text-sm" style={{ fontWeight: 500 }}>{r.name}</div>
                <div className="text-xs text-3">{r.size}</div>
              </div>
              <div className="flex gap-8">
                <span className={`badge ${r.fmt === 'PDF' ? 'badge-red' : r.fmt === 'Excel' ? 'badge-green' : 'badge-blue'}`}>{r.fmt}</span>
                <button className="btn btn-outline btn-sm">↓</button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary w-full" style={{ marginTop: 14 }}>Generate Custom Report</button>
        </div>
      </div>
    </>
  )
}
