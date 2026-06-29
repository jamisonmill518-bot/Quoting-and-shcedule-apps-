import { cubicYards, totalCubicYards, orderYards, formatCurrency } from '../utils/calculations.js'
import { Card, Field } from './CustomerSection.jsx'

const THICKNESS_OPTIONS = ['2', '3', '4', '5', '6', '8', '10', '12']

export default function AreasSection({ quote, onChange }) {
  const sections = quote.sections

  function updateSection(id, field, val) {
    const updated = sections.map(s => s.id === id ? { ...s, [field]: val } : s)
    onChange({ sections: updated })
  }

  function addSection() {
    const id = Date.now().toString()
    onChange({
      sections: [
        ...sections,
        { id, label: `Section ${sections.length + 1}`, length: '', width: '', thickness: '4' }
      ]
    })
  }

  function removeSection(id) {
    if (sections.length === 1) return
    onChange({ sections: sections.filter(s => s.id !== id) })
  }

  const totalCY = totalCubicYards(sections)
  const orderedCY = orderYards(totalCY)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#eff6ff', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Total Concrete</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af' }}>{totalCY.toFixed(2)} <span style={{ fontSize: 14 }}>yd³</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Order Amount</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af' }}>{orderedCY.toFixed(1)} <span style={{ fontSize: 14 }}>yd³</span></div>
        </div>
      </div>

      {sections.map((s, i) => {
        const cy = cubicYards(s.length, s.width, s.thickness)
        return (
          <Card key={s.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: -4 }}>
              <input
                value={s.label}
                onChange={e => updateSection(s.id, 'label', e.target.value)}
                style={{ fontWeight: 700, fontSize: 15, border: 'none', padding: 0, background: 'none', color: '#0f172a', width: 'auto', flex: 1 }}
              />
              {sections.length > 1 && (
                <button
                  onClick={() => removeSection(s.id)}
                  style={{ color: '#dc2626', background: 'none', fontSize: 20, lineHeight: 1, padding: 0, marginLeft: 8 }}
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Length (ft)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.length}
                  placeholder="0"
                  min="0"
                  onChange={e => updateSection(s.id, 'length', e.target.value)}
                />
              </Field>
              <Field label="Width (ft)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.width}
                  placeholder="0"
                  min="0"
                  onChange={e => updateSection(s.id, 'width', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Thickness (inches)">
              <select value={s.thickness} onChange={e => updateSection(s.id, 'thickness', e.target.value)}>
                {THICKNESS_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}"</option>
                ))}
              </select>
            </Field>

            {cy > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#475569' }}>
                {s.length}ft × {s.width}ft × {s.thickness}" = <strong>{cy.toFixed(2)} yd³</strong>
                {' '}({(cy * 27).toFixed(1)} ft³)
              </div>
            )}
          </Card>
        )
      })}

      <button
        onClick={addSection}
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
        + Add Section
      </button>

      <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#78350f' }}>
        <strong>Tip:</strong> Add 5–10% waste to your order. Rounded up to nearest 0.5 yd³.
      </div>
    </div>
  )
}
