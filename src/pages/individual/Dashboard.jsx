import React from 'react'
import ChartWidget, { CHART_DEFAULTS, COLORS, barDataset, lineDataset, legendPlugin } from '../../components/ChartWidget.jsx'

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

export default function IndDashboard({ onNavigate }) {
  const incExpChart = {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        barDataset('Income',   [78000,80000,82000,79000,83000,85000], COLORS.green),
        barDataset('Expenses', [51000,53000,49000,55000,50000,52400], COLORS.red),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const spendChart = {
    type: 'doughnut',
    data: {
      labels: ['Housing','Food','Transport','Shopping','Investment','Other'],
      datasets: [{
        data: [18000,9200,3200,10500,12000,5500],
        backgroundColor: [COLORS.blue, COLORS.red, COLORS.green, COLORS.amber, COLORS.purple, COLORS.gray],
        borderWidth: 0, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { display: true, position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10 } } }
    }
  }

  const budgetChart = {
    type: 'bar',
    data: {
      labels: ['Housing','Food','Transport','Entertain','Shopping','Health','Invest','Utilities'],
      datasets: [
        barDataset('Budget', [20000,8000,5000,3000,8000,2000,15000,3000], COLORS.blue),
        barDataset('Spent',  [18000,9200,3200,2800,10500,800,12000,2700], COLORS.red),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const forecastChart = {
    type: 'line',
    data: {
      labels: ['Apr','May','Jun','Jul','Aug','Sep'],
      datasets: [
        lineDataset('Monthly Savings', [32000,32800,36000,35200,36500,36000], COLORS.blue, true),
        lineDataset('Cumulative',       [32000,64800,100800,136000,172500,208500], COLORS.green, false, { borderDash: [5,3] }),
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: legendPlugin() } }
  }

  const goals = [
    { name: 'Emergency Fund',    current: 45000,  target: 100000, color: COLORS.blue },
    { name: 'Europe Trip',       current: 28000,  target: 80000,  color: COLORS.green },
    { name: 'New Laptop',        current: 55000,  target: 70000,  color: COLORS.amber },
    { name: 'House Down Payment',current: 180000, target: 500000, color: COLORS.purple },
  ]

  const recentTxns = [
    { desc: 'Swiggy Order',    cat: 'Food',       catCls: 'badge-amber',  amt: -420 },
    { desc: 'Salary Credit',   cat: 'Income',     catCls: 'badge-green',  amt: 85000 },
    { desc: 'Amazon Purchase', cat: 'Shopping',   catCls: 'badge-blue',   amt: -2150 },
    { desc: 'Netflix',         cat: 'Entertain',  catCls: 'badge-purple', amt: -649 },
    { desc: 'Home Loan EMI',   cat: 'Loan',       catCls: 'badge-red',    amt: -12000 },
    { desc: 'SIP Investment',  cat: 'Investment', catCls: 'badge-green',  amt: -10000 },
  ]

  return (
    <>
      <div className="grid-4">
        {[
          { label: 'Monthly Income',  val: '₹85,000', change: '↑ 5.2% from last month', cls: 'pos' },
          { label: 'Total Expenses',  val: '₹52,400', change: '↑ 8.1% over budget',     cls: 'neg' },
          { label: 'Savings Rate',    val: '38.4%',   change: '↑ 2.1% vs last month',   cls: 'pos' },
          { label: 'Net Worth',       val: '₹4.2L',   change: '↑ ₹18,000 this month',   cls: 'pos' },
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
          <div className="card-title">Income vs Expenses <span className="badge badge-blue">6 months</span></div>
          <ChartWidget id="ind-inc-exp" config={incExpChart} />
        </div>
        <div className="card">
          <div className="card-title">Spending by Category <span className="badge badge-purple">This month</span></div>
          <ChartWidget id="ind-spend" config={spendChart} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Goals Progress</div>
          {goals.map(g => {
            const pct = Math.round(g.current / g.target * 100)
            return (
              <div className="goal-item" key={g.name}>
                <div className="goal-header">
                  <span className="goal-name">{g.name}</span>
                  <span className="goal-amount">₹{g.current.toLocaleString()} / ₹{g.target.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: g.color }} />
                </div>
              </div>
            )
          })}
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={() => onNavigate('goals')}>
            Manage Goals →
          </button>
        </div>

        <div className="card">
          <div className="card-title">Recent Transactions</div>
          <div className="scrollable">
            <table className="table">
              <thead><tr><th>Description</th><th>Category</th><th>Amount</th></tr></thead>
              <tbody>
                {recentTxns.map((t, i) => (
                  <tr key={i}>
                    <td>{t.desc}</td>
                    <td><span className={`badge ${t.catCls}`}>{t.cat}</span></td>
                    <td className={t.amt > 0 ? 'pos' : 'neg'}>
                      {t.amt > 0 ? '+' : ''}₹{Math.abs(t.amt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={() => onNavigate('transactions')}>
            View All →
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Budget Utilization</div>
          <ChartWidget id="ind-budget" config={budgetChart} />
        </div>
        <div className="card">
          <div className="card-title">3-Month Cash Forecast</div>
          <ChartWidget id="ind-forecast-mini" config={forecastChart} />
        </div>
      </div>
    </>
  )
}
