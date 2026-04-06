import React, { useState } from 'react'

const FILINGS = [
  { name: 'GSTR-1 (March 2025)',      type: 'GST',         due: 'Apr 11, 2025', tax: '₹18,400',   status: 'Overdue'  },
  { name: 'GSTR-3B (March 2025)',     type: 'GST',         due: 'Apr 20, 2025', tax: '₹34,200',   status: 'Pending'  },
  { name: 'TDS Payment Q4 FY25',      type: 'TDS',         due: 'Apr 30, 2025', tax: '₹12,500',   status: 'Pending'  },
  { name: 'ESI Contribution (Mar)',   type: 'ESI',         due: 'Apr 15, 2025', tax: '₹8,200',    status: 'Pending'  },
  { name: 'PF Contribution (Mar)',    type: 'PF',          due: 'Apr 15, 2025', tax: '₹15,600',   status: 'Pending'  },
  { name: 'Advance Tax Q1 FY26',      type: 'Income Tax',  due: 'Jun 15, 2025', tax: '₹28,000',   status: 'Upcoming' },
  { name: 'ROC Annual Filing',        type: 'ROC',         due: 'Sep 30, 2025', tax: '—',          status: 'Upcoming' },
  { name: 'Income Tax Return FY25',   type: 'IT',          due: 'Jul 31, 2025', tax: 'Est. ₹2.4L', status: 'Upcoming' },
]

export default function Compliance() {
  const [filings, setFilings] = useState(FILINGS)
  const [tab, setTab]         = useState('calendar')

  const overdue  = filings.filter(f => f.status === 'Overdue').length
  const pending  = filings.filter(f => f.status === 'Pending').length
  const upcoming = filings.filter(f => f.status === 'Upcoming').length

  const totalDue = filings
    .filter(f => f.status !== 'Upcoming')
    .reduce((s, f) => {
      const n = parseInt(f.tax.replace(/[₹,.L]/g, '')) || 0
      return s + (f.tax.includes('L') ? n * 100000 : n)
    }, 0)

  function markFiled(i) {
    setFilings(prev => prev.map((f, j) => j === i ? { ...f, status: 'Filed' } : f))
  }

  return (
    <>
      <div className="grid-4">
        <div className="metric"><div className="metric-label">Overdue</div><div className="metric-val" style={{ color: 'var(--accent4)' }}>{overdue}</div><div className="metric-change neg">Immediate action needed</div></div>
        <div className="metric"><div className="metric-label">Due This Month</div><div className="metric-val" style={{ color: 'var(--accent3)' }}>{pending}</div><div className="metric-change warn">Total: ₹88,900</div></div>
        <div className="metric"><div className="metric-label">Upcoming</div><div className="metric-val">{upcoming}</div><div className="metric-change text-3">Next 90 days</div></div>
        <div className="metric"><div className="metric-label">Compliance Score</div><div className="metric-val">78%</div><div className="metric-change warn">Needs attention</div></div>
      </div>

      <div className="tab-row">
        {[['calendar','Compliance Calendar'],['gst','GST Summary'],['notices','Notices']].map(([id,label])=>(
          <button key={id} className={`tab${tab===id?' active':''}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'calendar' && (
        <div className="card">
          <div className="card-title">
            All Compliance Filings
            <button className="btn btn-primary btn-sm">+ Add Filing</button>
          </div>
          <table className="table">
            <thead>
              <tr><th>Filing</th><th>Type</th><th>Due Date</th><th>Tax/Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filings.map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{f.name}</td>
                  <td><span className="badge badge-blue">{f.type}</span></td>
                  <td className={f.status === 'Overdue' ? 'neg' : 'text-2'}>{f.due}</td>
                  <td style={{ fontWeight: 500 }}>{f.tax}</td>
                  <td>
                    <span className={`badge ${f.status === 'Overdue' ? 'badge-red' : f.status === 'Pending' ? 'badge-amber' : f.status === 'Filed' ? 'badge-green' : 'badge-gray'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>
                    {f.status !== 'Filed' && (
                      <button className={`btn btn-sm ${f.status === 'Overdue' ? 'btn-danger' : 'btn-primary'}`} onClick={() => markFiled(i)}>
                        {f.status === 'Overdue' ? 'File Now!' : f.status === 'Pending' ? 'Prepare' : 'View'}
                      </button>
                    )}
                    {f.status === 'Filed' && <span className="pos text-sm">✓ Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gst' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">GST Summary (March 2025)</div>
            {[
              { l: 'Total Sales (Taxable)',     v: '₹6,18,000', cls: '' },
              { l: 'CGST Collected (9%)',        v: '₹55,620',   cls: '' },
              { l: 'SGST Collected (9%)',        v: '₹55,620',   cls: '' },
              { l: 'IGST Collected (18%)',       v: '₹12,360',   cls: '' },
              { l: 'Total Output GST',           v: '₹1,23,600', cls: 'neg', bold: true },
              { l: 'Input Tax Credit (ITC)',     v: '-₹71,200',  cls: 'pos' },
            ].map(r => (
              <div key={r.l} className="flex justify-between" style={{ padding: '8px 0', borderBottom: '1px solid rgba(42,63,95,0.3)', fontSize: 13, fontWeight: r.bold ? 600 : 400 }}>
                <span className="text-2">{r.l}</span>
                <span className={r.cls}>{r.v}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="flex justify-between" style={{ fontSize: 15, fontWeight: 600 }}>
              <span>Net GST Payable</span>
              <span className="neg">₹52,400</span>
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop: 14 }}>Download GST Report</button>
          </div>
          <div className="card">
            <div className="card-title">ITC Reconciliation</div>
            <div className="alert-item alert-info">
              <span>ℹ️</span>
              <div>Ensure all purchases are linked to suppliers who have filed GSTR-1. Mismatched ITC will be reversed.</div>
            </div>
            {[
              { l: 'ITC as per Books',    v: '₹74,500', ok: true },
              { l: 'ITC as per GSTR-2B', v: '₹71,200', ok: true },
              { l: 'Mismatch',            v: '₹3,300',  ok: false },
            ].map(r => (
              <div key={r.l} className="flex justify-between" style={{ padding: '8px 0', borderBottom: '1px solid rgba(42,63,95,0.3)', fontSize: 13 }}>
                <span className="text-2">{r.l}</span>
                <span className={r.ok ? 'pos' : 'neg'}>{r.v}</span>
              </div>
            ))}
            <div className="alert-item alert-warn" style={{ marginTop: 10 }}>
              <span>⚠️</span>
              <div>₹3,300 ITC mismatch detected. Contact 2 vendors to file their GSTR-1 to resolve.</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'notices' && (
        <div className="card">
          <div className="card-title">Important Notices & Reminders</div>
          <div className="alert-item alert-danger">
            <span>🔴</span>
            <div>
              <b>GSTR-1 overdue!</b> Late fee of ₹200/day applies from Apr 12. File immediately to avoid further penalties.
              <div className="mt-8"><button className="btn btn-danger btn-sm">File GSTR-1 Now</button></div>
            </div>
          </div>
          <div className="alert-item alert-warn">
            <span>🟡</span>
            <div><b>ESI & PF due Apr 15.</b> Ensure payroll data is finalized and contributions are calculated before filing.</div>
          </div>
          <div className="alert-item alert-warn">
            <span>🟡</span>
            <div><b>GSTR-3B due Apr 20.</b> Net tax payable ₹52,400. Ensure sufficient balance in GST electronic cash ledger.</div>
          </div>
          <div className="alert-item alert-info">
            <span>🔵</span>
            <div><b>New:</b> MSME Invoice discounting facility now available on TReDS platform. Register to improve cash flow.</div>
          </div>
          <div className="alert-item alert-info">
            <span>🔵</span>
            <div><b>Budget 2025-26:</b> New tax slabs effective from AY 2026-27. Consult your CA for revised advance tax calculations.</div>
          </div>
          <div className="alert-item alert-success">
            <span>✅</span>
            <div><b>Udyam Registration valid.</b> Your MSME certificate is active and eligible for all government scheme benefits.</div>
          </div>
        </div>
      )}
    </>
  )
}
