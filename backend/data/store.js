// ─────────────────────────────────────────────────────────────────
//  data/store.js  –  In-memory data store for FinFlow
//  Swap any section with a real DB (PostgreSQL, MongoDB, etc.)
// ─────────────────────────────────────────────────────────────────

// ──────────────────── INDIVIDUAL DATA ────────────────────────────

export const individualTransactions = [
  { id: '1', date: '2025-04-01', desc: 'Salary Credit',      cat: 'Income',     amt:  85000 },
  { id: '2', date: '2025-04-02', desc: 'Home Loan EMI',       cat: 'Loan',       amt: -12000 },
  { id: '3', date: '2025-04-03', desc: 'Swiggy',              cat: 'Food',       amt:   -420 },
  { id: '4', date: '2025-04-05', desc: 'SIP - Axis Bluechip', cat: 'Investment', amt:  -5000 },
  { id: '5', date: '2025-04-05', desc: 'Electricity Bill',    cat: 'Utilities',  amt:  -1840 },
  { id: '6', date: '2025-04-06', desc: 'Amazon Order',        cat: 'Shopping',   amt:  -2150 },
  { id: '7', date: '2025-04-07', desc: 'Netflix',             cat: 'Entertain',  amt:   -649 },
  { id: '8', date: '2025-04-08', desc: 'Ola Ride',            cat: 'Transport',  amt:   -180 },
  { id: '9', date: '2025-04-10', desc: 'Freelance Income',    cat: 'Income',     amt:  12000 },
  { id:'10', date: '2025-04-11', desc: 'Zomato',              cat: 'Food',       amt:   -350 },
  { id:'11', date: '2025-04-12', desc: 'Gym Membership',      cat: 'Health',     amt:  -1200 },
  { id:'12', date: '2025-04-13', desc: 'Water Bill',          cat: 'Utilities',  amt:   -450 },
]

export const individualBudgets = [
  { id: 'b1', name: 'Housing & Rent',  budget: 20000, spent: 18000 },
  { id: 'b2', name: 'Food & Dining',   budget:  8000, spent:  9200 },
  { id: 'b3', name: 'Transport',       budget:  5000, spent:  3200 },
  { id: 'b4', name: 'Entertainment',   budget:  3000, spent:  2800 },
  { id: 'b5', name: 'Shopping',        budget:  8000, spent: 10500 },
  { id: 'b6', name: 'Healthcare',      budget:  2000, spent:   800 },
  { id: 'b7', name: 'Investments',     budget: 15000, spent: 12000 },
  { id: 'b8', name: 'Utilities',       budget:  3000, spent:  2700 },
]

export const individualGoals = [
  { id: 'g1', name: 'Emergency Fund',     target: 100000, current: 45000,  deadline: '2025-12-31', monthly: 5000  },
  { id: 'g2', name: 'Europe Trip',        target:  80000, current: 28000,  deadline: '2025-06-30', monthly: 8000  },
  { id: 'g3', name: 'New Laptop',         target:  70000, current: 55000,  deadline: '2025-03-31', monthly: 15000 },
  { id: 'g4', name: 'House Down Payment', target: 500000, current: 180000, deadline: '2027-12-31', monthly: 10000 },
]

export const individualAlerts = [
  { id: 'a1', type: 'danger',  title: 'Budget Exceeded: Shopping',    msg: 'Spent ₹10,500 against ₹8,000 budget (131%). Overspent by ₹2,500.',       time: new Date(Date.now()-7200000).toISOString()  },
  { id: 'a2', type: 'warn',    title: 'Budget Warning: Food & Dining', msg: "Used 92% of Food budget (₹7,360 / ₹8,000). 8 days remaining.",            time: new Date(Date.now()-14400000).toISOString() },
  { id: 'a3', type: 'warn',    title: 'EMI Due in 3 Days',             msg: 'Home loan EMI of ₹12,000 due on Apr 9th.',                                time: new Date(Date.now()-86400000).toISOString() },
  { id: 'a4', type: 'info',    title: 'SIP Executed Successfully',     msg: '₹5,000 SIP invested in Axis Bluechip Fund.',                              time: new Date(Date.now()-172800000).toISOString()},
  { id: 'a5', type: 'success', title: 'Goal Milestone Reached',        msg: '"New Laptop" goal is 78% complete! Just ₹15,000 more.',                   time: new Date(Date.now()-259200000).toISOString()},
]

export const individualMetrics = {
  monthlyIncome:   85000,
  totalExpenses:   52400,
  savingsRate:     38.4,
  netWorth:        420000,
  lastUpdated:     new Date().toISOString(),
}

// Six-month income vs expenses (for charts)
export const incomeVsExpenses = {
  labels: ['Oct','Nov','Dec','Jan','Feb','Mar'],
  income:   [78000,80000,82000,79000,83000,85000],
  expenses: [51000,53000,49000,55000,50000,52400],
}

export const spendingByCategory = [
  { label: 'Housing',    value: 18000 },
  { label: 'Food',       value:  9200 },
  { label: 'Transport',  value:  3200 },
  { label: 'Shopping',   value: 10500 },
  { label: 'Investment', value: 12000 },
  { label: 'Other',      value:  5500 },
]

// ──────────────────── SME DATA ────────────────────────────────────

export const smeExpenses = [
  { id: 'e1', date: '2025-04-01', vendor: 'Infosys Payroll Services', cat: 'Payroll',    amt: 380000, status: 'Paid'    },
  { id: 'e2', date: '2025-04-02', vendor: 'AWS India',                cat: 'Technology', amt:  62000, status: 'Paid'    },
  { id: 'e3', date: '2025-04-03', vendor: 'Google Ads',               cat: 'Marketing',  amt:  45000, status: 'Paid'    },
  { id: 'e4', date: '2025-04-05', vendor: 'DLF Commercial Spaces',    cat: 'Rent',       amt:  85000, status: 'Pending' },
  { id: 'e5', date: '2025-04-07', vendor: 'Zomato Business',          cat: 'Operations', amt:  18000, status: 'Paid'    },
  { id: 'e6', date: '2025-04-10', vendor: 'Facebook Ads',             cat: 'Marketing',  amt:  33000, status: 'Pending' },
]

export const smeInvoices = [
  { id: 'inv1', no: 'INV-2024-089', client: 'TechCorp Ltd',     amt: 125000, due: '2025-03-25', status: 'Overdue' },
  { id: 'inv2', no: 'INV-2025-001', client: 'Sunrise Retail',   amt:  87500, due: '2025-04-15', status: 'Pending' },
  { id: 'inv3', no: 'INV-2025-002', client: 'MediCare Pvt Ltd', amt:  62000, due: '2025-04-20', status: 'Pending' },
  { id: 'inv4', no: 'INV-2025-003', client: 'Buildcon Infra',   amt: 210000, due: '2025-04-30', status: 'Pending' },
  { id: 'inv5', no: 'INV-2025-004', client: 'CloudSoft India',  amt:  45000, due: '2025-03-31', status: 'Paid'    },
]

export const smeCashFlow = {
  labels:   ['Oct','Nov','Dec','Jan','Feb','Mar'],
  inflows:  [1080000,1150000,1200000,1180000,1220000,1240000],
  outflows: [ 750000, 760000, 800000, 770000, 790000, 780000],
}

export const smeKpis = {
  monthlyRevenue:   1240000,
  operatingExpenses: 780000,
  netProfit:         460000,
  pendingInvoices:   484500,
  grossMargin:       58.4,
  operatingMargin:   37.1,
  currentRatio:      2.1,
  receivableDays:    28,
  lastUpdated:       new Date().toISOString(),
}

export const smeAlerts = [
  { id: 's1', type: 'danger',  title: 'Cash Flow Warning',     msg: 'Projected cash deficit of ₹45,000 in May 2025.',                       time: new Date(Date.now()-3600000).toISOString()  },
  { id: 's2', type: 'danger',  title: 'Invoice Overdue',       msg: 'INV-2024-089 for ₹1,25,000 from TechCorp is 14 days overdue.',         time: new Date(Date.now()-7200000).toISOString()  },
  { id: 's3', type: 'warn',    title: 'GST Filing Due',        msg: 'GSTR-3B for March 2025 due Apr 20. Pending: ₹34,200.',                 time: new Date(Date.now()-10800000).toISOString() },
  { id: 's4', type: 'warn',    title: 'Expense Budget Alert',  msg: 'Operations expenses at 88% of monthly budget with 10 days remaining.', time: new Date(Date.now()-18000000).toISOString() },
  { id: 's5', type: 'info',    title: 'MSME Loan Opportunity', msg: 'You qualify for a ₹10L MSME Mudra loan at 7.5%.',                     time: new Date(Date.now()-86400000).toISOString() },
  { id: 's6', type: 'success', title: 'Revenue Target Achieved',msg: 'Q1 2025 revenue of ₹12.4L exceeded target by 8%.',                   time: new Date(Date.now()-172800000).toISOString()},
]

// ──────────────────── LIVE TICKER STATE ──────────────────────────
// These values drift slightly each tick to simulate real-time data
export const liveState = {
  individual: { ...individualMetrics },
  sme:        { ...smeKpis },
}
