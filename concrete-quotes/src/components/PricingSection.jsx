import { Card, Field } from './CustomerSection.jsx'
import { totalCubicYards, orderYards, formatCurrency } from '../utils/calculations.js'

export default function PricingSection({ quote, onChange }) {
  const p = quote.pricing

  function set(field, val) {
    onChange({ pricing: { ...p, [field]: val } })
  }

  const ordered = orderYards(totalCubicYards(quote.sections))
  const concreteCost = ordered * parseFloat(p.concretePerYard || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Concrete">
        <Field label="Price per Cubic Yard ($)">
          <input
            type="number"
            inputMode="decimal"
            value={p.concretePerYard}
            placeholder="175"
            min="0"
            onChange={e => set('concretePerYard', e.target.value)}
          />
        </Field>
        {ordered > 0 && parseFloat(p.concretePerYard) > 0 && (
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}>
            <div style={{ color: '#1e40af', fontWeight: 600 }}>
              {ordered} yd³ × ${parseFloat(p.concretePerYard).toFixed(0)}/yd³ = {formatCurrency(concreteCost)}
            </div>
          </div>
        )}
      </Card>

      <Card title="Other Materials">
        <Field label="Rebar / Wire Mesh ($)">
          <input
            type="number"
            inputMode="decimal"
            value={p.rebarCost}
            placeholder="0.00"
            min="0"
            onChange={e => set('rebarCost', e.target.value)}
          />
        </Field>
        <Field label="Forms & Stakes ($)">
          <input
            type="number"
            inputMode="decimal"
            value={p.formsCost}
            placeholder="0.00"
            min="0"
            onChange={e => set('formsCost', e.target.value)}
          />
        </Field>
        <Field label="Fiber / Admixtures ($)">
          <input
            type="number"
            inputMode="decimal"
            value={p.fiberCost}
            placeholder="0.00"
            min="0"
            onChange={e => set('fiberCost', e.target.value)}
          />
        </Field>
        <Field label="Other Materials ($)">
          <input
            type="number"
            inputMode="decimal"
            value={p.otherMaterials}
            placeholder="0.00"
            min="0"
            onChange={e => set('otherMaterials', e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Markup / Overhead">
        <Field label="Markup Percentage (%)">
          <input
            type="number"
            inputMode="decimal"
            value={quote.markup}
            placeholder="20"
            min="0"
            max="200"
            onChange={e => onChange({ markup: e.target.value })}
          />
        </Field>
        <div style={{ display: 'flex', gap: 8 }}>
          {[10, 15, 20, 25, 30].map(pct => (
            <button
              key={pct}
              onClick={() => onChange({ markup: String(pct) })}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: quote.markup == pct ? '#1e40af' : '#f1f5f9',
                color: quote.markup == pct ? 'white' : '#475569',
                border: 'none'
              }}
            >
              {pct}%
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
