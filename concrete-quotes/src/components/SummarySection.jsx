import { calcQuote, formatCurrency, totalCubicYards, orderYards, formatDate } from '../utils/calculations.js'

export default function SummarySection({ quote, onShare }) {
  const r = calcQuote(quote.sections, quote.pricing, quote.labor, quote.markup)
  const cy = totalCubicYards(quote.sections)
  const ordered = orderYards(cy)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Total hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        borderRadius: 18,
        padding: '24px 20px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(30,64,175,.3)'
      }}>
        <div style={{ fontSize: 13, opacity: .8, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Total Quote
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
          {formatCurrency(r.total)}
        </div>
        <div style={{ fontSize: 13, opacity: .75, marginTop: 8 }}>
          {quote.customer.name || 'Customer'} • {quote.jobType} • {formatDate(quote.createdAt)}
        </div>
      </div>

      {/* Concrete summary */}
      <SummaryCard title="Concrete">
        <Row label="Calculated volume" value={`${cy.toFixed(2)} yd³`} />
        <Row label="Order amount" value={`${ordered.toFixed(1)} yd³`} highlight />
        <Row label={`PSI grade`} value={`${quote.pricing.psi} PSI`} />
        <Row label="Price per yard" value={formatCurrency(quote.pricing.concretePerYard)} />
        <Row label="Concrete cost" value={formatCurrency(r.materials.concreteCost)} />
      </SummaryCard>

      {/* Color & Pump */}
      {(r.materials.colorCost > 0 || r.materials.pumpCost > 0) && (
        <SummaryCard title="Color & Pump">
          {r.materials.colorCost > 0 && <Row label="Colored concrete" value={formatCurrency(r.materials.colorCost)} />}
          {r.materials.pumpCost > 0 && <Row label="Concrete pump" value={formatCurrency(r.materials.pumpCost)} />}
        </SummaryCard>
      )}

      {/* Materials */}
      {(r.materials.rebarCost > 0 || r.materials.formsCost > 0 || r.materials.fiberCost > 0 || r.materials.otherMaterials > 0) && (
        <SummaryCard title="Other Materials">
          {r.materials.rebarCost > 0 && <Row label="Rebar / Mesh" value={formatCurrency(r.materials.rebarCost)} />}
          {r.materials.formsCost > 0 && <Row label="Forms & Stakes" value={formatCurrency(r.materials.formsCost)} />}
          {r.materials.fiberCost > 0 && <Row label="Fiber / Admixtures" value={formatCurrency(r.materials.fiberCost)} />}
          {r.materials.otherMaterials > 0 && <Row label="Other" value={formatCurrency(r.materials.otherMaterials)} />}
        </SummaryCard>
      )}

      {/* Labor */}
      <SummaryCard title="Labor">
        {quote.labor.map(l => {
          const amt = parseFloat(l.hours || 0) * parseFloat(l.rate || 0)
          return amt > 0 ? (
            <Row key={l.id} label={`${l.description} (${l.hours}h @ $${l.rate}/hr)`} value={formatCurrency(amt)} />
          ) : null
        })}
        <Row label="Labor total" value={formatCurrency(r.laborTotal)} highlight />
      </SummaryCard>

      {/* Totals */}
      <SummaryCard title="Totals">
        <Row label="Materials" value={formatCurrency(r.materials.total)} />
        <Row label="Labor" value={formatCurrency(r.laborTotal)} />
        <Row label={`Subtotal`} value={formatCurrency(r.subtotal)} />
        <Row label={`Markup / Overhead (${quote.markup}%)`} value={formatCurrency(r.markupAmount)} />
        <div style={{ borderTop: '2px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
          <Row label="TOTAL" value={formatCurrency(r.total)} total />
        </div>
      </SummaryCard>

      {quote.notes ? (
        <SummaryCard title="Notes">
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{quote.notes}</p>
        </SummaryCard>
      ) : null}

      <button
        onClick={onShare}
        style={{
          background: '#16a34a',
          color: 'white',
          padding: '16px',
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 16,
          boxShadow: '0 4px 12px rgba(22,163,74,.3)'
        }}
      >
        Share / Send Quote
      </button>
    </div>
  )
}

function SummaryCard({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  )
}

function Row({ label, value, highlight, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: total ? 15 : 14, fontWeight: total ? 700 : 400, color: total ? '#0f172a' : '#475569' }}>{label}</span>
      <span style={{ fontSize: total ? 18 : 14, fontWeight: total || highlight ? 700 : 500, color: total ? '#1e40af' : highlight ? '#0f172a' : '#334155' }}>
        {value}
      </span>
    </div>
  )
}
