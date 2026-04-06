import React, { useState, useRef, useEffect } from 'react'

// ────────────────────────────────────────────────────────────────
// Replace with your Anthropic API key OR use a backend proxy.
// NEVER expose a real API key in a public/production frontend.
// For production: proxy requests through your own backend server.
// ────────────────────────────────────────────────────────────────
const API_KEY = 'YOUR_ANTHROPIC_API_KEY'
const MODEL   = 'claude-sonnet-4-20250514'

const IND_SUGGESTIONS = [
  'How can I reduce my monthly expenses?',
  'What is the best SIP strategy for ₹10,000/month?',
  'Should I choose old or new tax regime?',
  'How much emergency fund do I need?',
  'Explain the 50-30-20 budgeting rule',
  'How to start investing in mutual funds?',
  'What is SWP in mutual funds?',
  'How to plan for early retirement at 45?',
]

const SME_SUGGESTIONS = [
  'How do I improve my business cash flow?',
  'What are the best funding options for my SME?',
  'Explain GST input tax credit for my business',
  'How to calculate the right pricing for my service?',
  'What government schemes are available for MSMEs?',
  'How to improve my accounts receivable cycle?',
  'Explain the difference between GSTR-1 and GSTR-3B',
  'How to reduce my business tax liability?',
]

const INSIGHTS = {
  individual: [
    { cls: 'alert-info',    icon: '💡', text: 'Your Food spending (₹9,200) exceeded budget. Meal prepping 3 days/week can save ₹2,500/month.' },
    { cls: 'alert-success', icon: '📈', text: 'Investing ₹5,000/month in a Nifty 50 index fund at 12% CAGR gives ₹44.6L in 15 years.' },
    { cls: 'alert-warn',    icon: '⚠️', text: 'Your debt-to-income ratio is 14%. Prepaying the home loan EMI by ₹2,000/month saves ₹3.8L in interest.' },
    { cls: 'alert-info',    icon: '🎯', text: 'You are 4 months away from completing your New Laptop goal at current pace.' },
  ],
  sme: [
    { cls: 'alert-info',    icon: '💡', text: 'Offering early-payment discounts (2% for 10-day payment) can reduce receivable days from 28 to 18.' },
    { cls: 'alert-success', icon: '📊', text: 'Your Q1 revenue growth of 12% YoY exceeds the industry average of 8.4% for IT services SMEs.' },
    { cls: 'alert-warn',    icon: '⚠️', text: 'High payroll-to-revenue ratio at 30.6%. Industry benchmark is 25–28%. Consider performance-based pay.' },
    { cls: 'alert-info',    icon: '💰', text: 'You may qualify for CGTMSE credit guarantee — get a ₹25L working capital loan without collateral.' },
  ]
}

export default function AIAssistant({ mode }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am FinFlow AI, your ${mode === 'sme' ? 'business' : 'personal'} financial assistant. I can help you with ${mode === 'sme' ? 'cash flow management, GST filing, funding, pricing strategy, and business growth' : 'budgeting, investments, tax planning, goal setting, and financial forecasting'}. What would you like to know today?`
    }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const suggestions = mode === 'sme' ? SME_SUGGESTIONS : IND_SUGGESTIONS
  const insights    = INSIGHTS[mode] || INSIGHTS.individual

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const systemPrompt = `You are FinFlow AI, a smart financial assistant for Indian users in ${mode === 'sme' ? 'SME/business' : 'individual/personal'} mode.
Give concise, accurate, actionable financial advice tailored to India.
Use ₹ for currency. Keep responses under 180 words. Be specific and practical.
For tax questions, reference Indian tax laws (Income Tax Act, GST Act).
For SME: reference MSME Act, government schemes, GST compliance.
Always end with one actionable next step.`

      const apiMessages = [
        ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: userMsg }
      ]

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 400,
          system: systemPrompt,
          messages: apiMessages,
        })
      })

      const data = await res.json()
      const reply = data?.content?.[0]?.text

      if (!reply) throw new Error('No response')
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      // Fallback responses when API is not configured
      const fallbacks = {
        individual: [
          'To reduce monthly expenses, start by tracking every rupee for 30 days. Use the 50-30-20 rule: 50% needs, 30% wants, 20% savings. Cut subscriptions you use less than once a week — that alone saves ₹1,500–3,000/month. **Next step:** List all subscriptions and cancel unused ones today.',
          'For a ₹10,000/month SIP, split across Nifty 50 index fund (50%), flexi-cap fund (30%), and a small-cap fund (20%). Increase SIP by 10% every year. At 12% CAGR over 15 years, you will accumulate approximately ₹50L. **Next step:** Open a Zerodha or Groww account and start your first SIP this week.',
          'For FY 2024-25 with income above ₹15L and deductions over ₹3.75L, Old Regime is usually better. If your 80C, 80D, HRA total more than ₹3.75L — choose Old Regime. Below ₹3.75L in deductions — New Regime is better. **Next step:** Use FinFlow\'s Tax Planner to compare both scenarios.',
        ],
        sme: [
          'To improve SME cash flow: (1) Offer 2% early-payment discounts, (2) Invoice immediately on delivery, (3) Use MSME Samadhaan for delayed payments from large buyers, (4) Open a TReDS account for invoice discounting. Target 20-day receivable cycle. **Next step:** Send reminders to all invoices older than 15 days today.',
          'Top SME funding options: MSME Mudra Loan (up to ₹10L, 7.5%), CGTMSE (up to ₹2Cr, no collateral), SIDBI loans (₹10L–₹25Cr). For equity: Startup India Seed Fund (up to ₹20L grant). Your eligibility score of 742 qualifies for most. **Next step:** Apply for Udyam Registration if not done — it is mandatory for all schemes.',
          'Reduce GST liability: Max out ITC on all business purchases, maintain proper invoice records, reconcile GSTR-2B monthly, claim ITC on capital goods in 5 equal instalments. Never miss GSTR-1 deadline — ₹200/day late fee applies. **Next step:** Reconcile your last 3 months of ITC claims against GSTR-2B.',
        ]
      }

      const pool = fallbacks[mode] || fallbacks.individual
      const reply = pool[Math.floor(Math.random() * pool.length)]
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div className="grid-2">
        {/* Chat Panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>FinFlow AI</div>
              <div style={{ fontSize: 11, color: 'var(--accent2)' }}>● Online — {mode === 'sme' ? 'Business' : 'Personal'} Mode</div>
            </div>
          </div>

          <div className="ai-chat">
            <div className="chat-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                />
              ))}
              {loading && (
                <div className="msg msg-ai">
                  <div className="typing">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-row">
              <input
                className="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your finances..."
                disabled={loading}
              />
              <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div>
          <div className="card mb-16">
            <div className="card-title">Quick Questions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  className="btn btn-outline btn-sm"
                  style={{ textAlign: 'left', fontSize: 12 }}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card mb-16">
            <div className="card-title">AI Insights for You</div>
            {insights.map((ins, i) => (
              <div key={i} className={`alert-item ${ins.cls}`}>
                <span>{ins.icon}</span>
                <div className="text-sm">{ins.text}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Setup Note</div>
            <div className="alert-item alert-warn">
              <span>🔑</span>
              <div className="text-sm">
                To enable real AI responses, open <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>src/pages/shared/AIAssistant.jsx</code> and replace <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>YOUR_ANTHROPIC_API_KEY</code> with your key. For production, proxy API calls through your backend server.
              </div>
            </div>
            <div className="alert-item alert-info">
              <span>💡</span>
              <div className="text-sm">
                Without a real API key, the assistant uses built-in fallback responses for common Indian finance questions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
