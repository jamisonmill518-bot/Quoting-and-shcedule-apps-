import { useState } from 'react'
import { calcQuote, formatCurrency, totalCubicYards, orderYards, calcAddonLineTotal, calcAggregateLineTotal } from '../utils/calculations.js'
import CustomerSection from './CustomerSection.jsx'
import AreasSection from './AreasSection.jsx'
import AggregateSection from './AggregateSection.jsx'
import PricingSection from './PricingSection.jsx'
import AddonsSection from './AddonsSection.jsx'
import LaborSection from './LaborSection.jsx'
import SummarySection from './SummarySection.jsx'

const TABS = ['Customer', 'Areas', 'Aggregate', 'Pricing', 'Add-ons', 'Labor', 'Summary']

export default function QuoteEditor({ quote, onSave, onBack }) {
  const [q, setQ] = useState(quote)
  const [tab, setTab] = useState(0)

  function update(patch) {
    const updated = { ...q, ...patch }
    setQ(updated)
    onSave(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        background: '#1c1917',
        color: 'white',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        paddingBottom: 0,
        borderBottom: '3px solid #f59e0b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 12px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', color: 'white', fontSize: 24, marginRight: 12, lineHeight: 1, padding: 0 }}
          >
            ‹
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>
              {q.customer.name || 'New Quote'}
            </div>
            <div style={{ fontSize: 12, opacity: .75 }}>{q.jobType}</div>
          </div>
          <StatusBadge status={q.status} onChange={s => update({ status: s })} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,.15)' }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: tab === i ? '#f59e0b' : 'rgba(255,255,255,.5)',
                background: 'none',
                borderBottom: tab === i ? '2px solid #f59e0b' : '2px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        {tab === 0 && <CustomerSection quote={q} onChange={update} />}
        {tab === 1 && <AreasSection quote={q} onChange={update} />}
        {tab === 2 && <AggregateSection quote={q} onChange={update} />}
        {tab === 3 && <PricingSection quote={q} onChange={update} />}
        {tab === 4 && <AddonsSection quote={q} onChange={update} />}
        {tab === 5 && <LaborSection quote={q} onChange={update} />}
        {tab === 6 && <SummarySection quote={q} onShare={() => shareSummary(q)} />}
      </div>

      {/* Nav arrows */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        display: 'flex',
        gap: 10
      }}>
        <button
          disabled={tab === 0}
          onClick={() => setTab(t => t - 1)}
          style={{ flex: 1, padding: '12px', borderRadius: 10, background: tab === 0 ? '#e7e0d8' : '#1c1917', color: tab === 0 ? '#a8a29e' : 'white', fontWeight: 700, fontSize: 15 }}
        >
          ← Back
        </button>
        {tab < TABS.length - 1 ? (
          <button
            onClick={() => setTab(t => t + 1)}
            style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#f59e0b', color: '#1c1917', fontWeight: 700, fontSize: 15 }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => shareSummary(q)}
            style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#16a34a', color: 'white', fontWeight: 700, fontSize: 15 }}
          >
            Share Quote
          </button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, onChange }) {
  const options = ['Draft', 'Sent', 'Accepted', 'Declined']
  const colors = { Draft: '#92400e', Sent: '#b45309', Accepted: '#166534', Declined: '#991b1b' }
  return (
    <select
      value={status}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'rgba(245,158,11,.15)',
        border: '1px solid rgba(245,158,11,.4)',
        color: '#f59e0b',
        borderRadius: 8,
        padding: '4px 8px',
        fontSize: 12,
        fontWeight: 700,
        width: 'auto'
      }}
    >
      {options.map(o => <option key={o} value={o} style={{ color: colors[o], background: 'white' }}>{o}</option>)}
    </select>
  )
}

function shareSummary(q) {
  const aggregates = q.aggregates || []
  const r = calcQuote(q.sections, q.pricing, q.labor, q.markup, q.addons, aggregates)
  const cy = totalCubicYards(q.sections)
  const addonLines = (q.addons || [])
    .map(a => {
      const total = calcAddonLineTotal(a)
      return total > 0 ? `${a.description}: ${formatCurrency(total)}` : undefined
    })
    .filter(Boolean)
  const aggLines = aggregates
    .map(a => {
      const total = calcAggregateLineTotal(a)
      return total > 0 ? `${a.description}: ${formatCurrency(total)}` : undefined
    })
    .filter(Boolean)
  const text = [
    `CONCRETE QUOTE`,
    `Date: ${new Date(q.createdAt).toLocaleDateString()}`,
    `Status: ${q.status}`,
    ``,
    `CUSTOMER`,
    `Name: ${q.customer.name}`,
    `Phone: ${q.customer.phone}`,
    `Address: ${q.customer.address}`,
    ``,
    `JOB: ${q.jobType}`,
    `Concrete: ${cy.toFixed(2)} yd³ (order ${orderYards(cy)} yd³) @ ${q.pricing.psi} PSI`,
    ``,
    `COST BREAKDOWN`,
    r.materials.colorCost > 0 ? `Colored Concrete: ${formatCurrency(r.materials.colorCost)}` : undefined,
    r.materials.pumpCost > 0 ? `Concrete Pump: ${formatCurrency(r.materials.pumpCost)}` : undefined,
    aggLines.length > 0 ? `Base/Aggregate:` : undefined,
    ...aggLines,
    `Materials: ${formatCurrency(r.materials.total)}`,
    ...addonLines,
    r.addonsTotal > 0 ? `Add-ons Total: ${formatCurrency(r.addonsTotal)}` : undefined,
    `Labor: ${formatCurrency(r.laborTotal)}`,
    `Markup (${q.markup}%): ${formatCurrency(r.markupAmount)}`,
    `─────────────────────`,
    `TOTAL: ${formatCurrency(r.total)}`,
    ``,
    q.notes ? `Notes: ${q.notes}` : ''
  ].filter(l => l !== undefined).join('\n')

  if (navigator.share) {
    navigator.share({ title: `Concrete Quote - ${q.customer.name}`, text })
  } else {
    navigator.clipboard?.writeText(text).then(() => alert('Quote copied to clipboard!'))
  }
}
