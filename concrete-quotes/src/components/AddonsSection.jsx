import { Card, Field } from './CustomerSection.jsx'
import { ADDON_TYPES, calcAddonLineTotal, calcAddonsCost, formatCurrency } from '../utils/calculations.js'

export default function AddonsSection({ quote, onChange }) {
  const addons = quote.addons || []

  function update(id, field, val) {
    onChange({ addons: addons.map(a => a.id === id ? { ...a, [field]: val } : a) })
  }

  function changeType(id, typeId) {
    const typeDef = ADDON_TYPES.find(t => t.id === typeId)
    onChange({
      addons: addons.map(a => a.id === id ? { ...a, type: typeId, description: typeDef.label, qty: typeDef.unit === 'flat' ? '1' : a.qty } : a)
    })
  }

  function add() {
    const typeDef = ADDON_TYPES[0]
    onChange({
      addons: [...addons, { id: Date.now().toString(), type: typeDef.id, description: typeDef.label, qty: '', rate: '' }]
    })
  }

  function remove(id) {
    onChange({ addons: addons.filter(a => a.id !== id) })
  }

  const total = calcAddonsCost(addons)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fdf4ff', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: '#a21caf', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Add-ons Total</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#86198f' }}>{formatCurrency(total)}</div>
        </div>
        <div style={{ fontSize: 36 }}>✨</div>
      </div>

      {addons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 16px', color: '#94a3b8', fontSize: 14 }}>
          No add-ons yet. Add textured borders, custom stair faces, exposed aggregate, saw cuts, sealer, or any other decorative extra.
        </div>
      )}

      {addons.map(a => {
        const typeDef = ADDON_TYPES.find(t => t.id === a.type) || ADDON_TYPES[0]
        const lineTotal = calcAddonLineTotal(a)
        return (
          <Card key={a.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input
                value={a.description}
                onChange={e => update(a.id, 'description', e.target.value)}
                style={{ fontWeight: 700, fontSize: 15, border: 'none', padding: 0, background: 'none', color: '#0f172a', flex: 1 }}
              />
              <button
                onClick={() => remove(a.id)}
                style={{ color: '#dc2626', background: 'none', fontSize: 20, lineHeight: 1, marginLeft: 8 }}
              >
                ×
              </button>
            </div>

            <Field label="Add-on Type">
              <select value={a.type} onChange={e => changeType(a.id, e.target.value)}>
                {ADDON_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>

            {typeDef.id !== 'custom' && typeDef.high > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#475569' }}>
                Typical range: <strong>${typeDef.low}–${typeDef.high} {typeDef.rateLabel.replace('$ per ', '/ ')}</strong> (2026 reference, varies by region/contractor)
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: typeDef.unit === 'flat' ? '1fr' : '1fr 1fr', gap: 10 }}>
              {typeDef.unit !== 'flat' && (
                <Field label={typeDef.unitLabel}>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={a.qty}
                    placeholder="0"
                    min="0"
                    onChange={e => update(a.id, 'qty', e.target.value)}
                  />
                </Field>
              )}
              <Field label={typeDef.rateLabel}>
                <input
                  type="number"
                  inputMode="decimal"
                  value={a.rate}
                  placeholder={String(typeDef.low || 0)}
                  min="0"
                  onChange={e => update(a.id, 'rate', e.target.value)}
                />
              </Field>
            </div>

            {lineTotal > 0 && (
              <div style={{ background: '#fdf4ff', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#86198f', fontWeight: 600 }}>
                {typeDef.unit === 'flat'
                  ? `Flat cost: ${formatCurrency(lineTotal)}`
                  : `${a.qty || 0} × ${formatCurrency(a.rate)} = ${formatCurrency(lineTotal)}`}
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
        + Add Decorative Add-on
      </button>
    </div>
  )
}
