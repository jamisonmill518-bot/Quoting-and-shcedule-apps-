import { Card, Field } from './CustomerSection.jsx'
import { formatCurrency } from '../utils/calculations.js'

export default function LaborSection({ quote, onChange }) {
  const labor = quote.labor

  function update(id, field, val) {
    onChange({ labor: labor.map(l => l.id === id ? { ...l, [field]: val } : l) })
  }

  function add() {
    onChange({
      labor: [...labor, { id: Date.now().toString(), description: 'Labor', hours: '', rate: '75' }]
    })
  }

  function remove(id) {
    if (labor.length === 1) return
    onChange({ labor: labor.filter(l => l.id !== id) })
  }

  const total = labor.reduce((s, l) => s + parseFloat(l.hours || 0) * parseFloat(l.rate || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Total Labor</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#15803d' }}>{formatCurrency(total)}</div>
        </div>
        <div style={{ fontSize: 36 }}>👷</div>
      </div>

      {labor.map(l => {
        const lineTotal = parseFloat(l.hours || 0) * parseFloat(l.rate || 0)
        return (
          <Card key={l.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input
                value={l.description}
                onChange={e => update(l.id, 'description', e.target.value)}
                style={{ fontWeight: 700, fontSize: 15, border: 'none', padding: 0, background: 'none', color: '#0f172a', flex: 1 }}
              />
              {labor.length > 1 && (
                <button
                  onClick={() => remove(l.id)}
                  style={{ color: '#dc2626', background: 'none', fontSize: 20, lineHeight: 1, marginLeft: 8 }}
                >
                  ×
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Hours">
                <input
                  type="number"
                  inputMode="decimal"
                  value={l.hours}
                  placeholder="0"
                  min="0"
                  onChange={e => update(l.id, 'hours', e.target.value)}
                />
              </Field>
              <Field label="Rate ($/hr)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={l.rate}
                  placeholder="75"
                  min="0"
                  onChange={e => update(l.id, 'rate', e.target.value)}
                />
              </Field>
            </div>
            {lineTotal > 0 && (
              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                {l.hours}h × ${parseFloat(l.rate).toFixed(0)}/hr = {formatCurrency(lineTotal)}
              </div>
            )}
          </Card>
        )
      })}

      <button
        onClick={add}
        style={{
          background: 'white',
          border: '2px dashed #cbd5e1',
          borderRadius: 14,
          padding: '14px',
          color: '#1e40af',
          fontWeight: 600,
          fontSize: 15,
          width: '100%'
        }}
      >
        + Add Labor Line
      </button>

      <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#78350f' }}>
        <strong>Tip:</strong> Add separate lines for finishing crew, equipment rental, subcontractors, etc.
      </div>
    </div>
  )
}
