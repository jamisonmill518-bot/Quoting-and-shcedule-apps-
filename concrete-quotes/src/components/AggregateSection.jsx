import { Card, Field } from './CustomerSection.jsx'
import { AGGREGATE_TYPES, calcAggregateLineTotal, calcAggregatesCost, formatCurrency } from '../utils/calculations.js'

export default function AggregateSection({ quote, onChange }) {
  const aggregates = quote.aggregates || []

  function update(id, field, val) {
    onChange({ aggregates: aggregates.map(a => a.id === id ? { ...a, [field]: val } : a) })
  }

  function changeType(id, typeId) {
    const typeDef = AGGREGATE_TYPES.find(t => t.id === typeId)
    onChange({
      aggregates: aggregates.map(a => a.id === id
        ? { ...a, type: typeId, description: typeDef.id !== 'custom' ? typeDef.label : a.description }
        : a
      )
    })
  }

  function add() {
    const typeDef = AGGREGATE_TYPES[0]
    onChange({
      aggregates: [...aggregates, { id: Date.now().toString(), type: typeDef.id, description: typeDef.label, tons: '', rate: '', delivery: '' }]
    })
  }

  function remove(id) {
    onChange({ aggregates: aggregates.filter(a => a.id !== id) })
  }

  const total = calcAggregatesCost(aggregates)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#1c1917', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Aggregate / Base Total</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{formatCurrency(total)}</div>
        </div>
        <div style={{ fontSize: 30 }}>🪨</div>
      </div>

      {aggregates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 16px', color: '#a8a29e', fontSize: 14 }}>
          No aggregate or base material added yet. Add crushed stone, sand, crusher run, or any other material.
        </div>
      )}

      {aggregates.map(a => {
        const typeDef = AGGREGATE_TYPES.find(t => t.id === a.type) || AGGREGATE_TYPES[0]
        const lineTotal = calcAggregateLineTotal(a)
        return (
          <Card key={a.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input
                value={a.description}
                onChange={e => update(a.id, 'description', e.target.value)}
                style={{ fontWeight: 700, fontSize: 15, border: 'none', padding: 0, background: 'none', color: '#1c1917', flex: 1 }}
              />
              <button
                onClick={() => remove(a.id)}
                style={{ color: '#dc2626', background: 'none', fontSize: 20, lineHeight: 1, marginLeft: 8 }}
              >
                ×
              </button>
            </div>

            <Field label="Material Type">
              <select value={a.type} onChange={e => changeType(a.id, e.target.value)}>
                {AGGREGATE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>

            {typeDef.id !== 'custom' && (
              <div style={{ background: '#faf7f4', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#57534e' }}>
                <strong>{typeDef.use}</strong> — Typical: <strong>${typeDef.low}–${typeDef.high}/ton</strong> (2026 reference, confirm with local quarry/supplier)
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Quantity (tons)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={a.tons}
                  placeholder="0"
                  min="0"
                  onChange={e => update(a.id, 'tons', e.target.value)}
                />
              </Field>
              <Field label="Price per Ton ($)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={a.rate}
                  placeholder={typeDef.low > 0 ? String(typeDef.low) : '0'}
                  min="0"
                  onChange={e => update(a.id, 'rate', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Delivery Fee ($, optional)">
              <input
                type="number"
                inputMode="decimal"
                value={a.delivery}
                placeholder="0.00"
                min="0"
                onChange={e => update(a.id, 'delivery', e.target.value)}
              />
            </Field>

            {lineTotal > 0 && (
              <div style={{ background: '#fef9e7', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#d97706', fontWeight: 700 }}>
                {parseFloat(a.tons) > 0 ? `${a.tons} ton${parseFloat(a.tons) !== 1 ? 's' : ''} × $${parseFloat(a.rate || 0).toFixed(0)}/ton` : 'Delivery only'}
                {parseFloat(a.delivery) > 0 ? ` + ${formatCurrency(a.delivery)} delivery` : ''}
                {' '}= {formatCurrency(lineTotal)}
              </div>
            )}
          </Card>
        )
      })}

      <button
        onClick={add}
        style={{
          background: 'white',
          border: '2px dashed #d97706',
          borderRadius: 14,
          padding: '14px',
          color: '#d97706',
          fontWeight: 700,
          fontSize: 15,
          width: '100%'
        }}
      >
        + Add Base / Aggregate Material
      </button>

      <div style={{ background: '#fef9e7', border: '1px solid #f59e0b', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#92400e' }}>
        <strong>Ton estimator:</strong> 1 ton of gravel covers ~100 sq ft at 2" depth. 1 ton of sand covers ~80 sq ft at 2" depth. Adjust for your compacted depth.
      </div>
    </div>
  )
}
