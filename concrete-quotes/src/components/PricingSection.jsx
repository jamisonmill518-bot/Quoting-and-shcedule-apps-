import { Card, Field } from './CustomerSection.jsx'
import {
  totalCubicYards,
  orderYards,
  formatCurrency,
  PSI_OPTIONS,
  COLOR_METHODS,
  PUMP_TYPES,
  calcColorCost,
  calcPumpCost
} from '../utils/calculations.js'

export default function PricingSection({ quote, onChange }) {
  const p = quote.pricing

  function set(field, val) {
    onChange({ pricing: { ...p, [field]: val } })
  }

  const ordered = orderYards(totalCubicYards(quote.sections))
  const concreteCost = ordered * parseFloat(p.concretePerYard || 0)
  const psiOption = PSI_OPTIONS.find(o => o.psi === p.psi) || PSI_OPTIONS[1]
  const colorMethod = COLOR_METHODS.find(c => c.id === p.colorMethod) || COLOR_METHODS[0]
  const pumpOption = PUMP_TYPES.find(t => t.id === p.pumpType) || PUMP_TYPES[0]
  const colorCost = calcColorCost(ordered, p)
  const pumpCost = calcPumpCost(p)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Concrete Strength (PSI)">
        <Field label="PSI Grade">
          <select value={p.psi} onChange={e => set('psi', e.target.value)}>
            {PSI_OPTIONS.map(o => <option key={o.psi} value={o.psi}>{o.label}</option>)}
          </select>
        </Field>
        <div style={{ background: '#faf7f4', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#57534e' }}>
          {psiOption.use}. Typical adder vs. 3,000 PSI base: <strong>{psiOption.adder >= 0 ? '+' : ''}${psiOption.adder}/yd³</strong>
          {' '}(2026 national reference — confirm with your local producer).
        </div>
        <button
          onClick={() => set('concretePerYard', String((175 + psiOption.adder).toFixed(0)))}
          style={{ background: '#fef3c7', color: '#d97706', borderRadius: 8, padding: '8px 0', fontWeight: 700, fontSize: 13 }}
        >
          Apply suggested price (${(175 + psiOption.adder).toFixed(0)}/yd³)
        </button>
      </Card>

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
          <div style={{ background: '#fef9e7', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}>
            <div style={{ color: '#d97706', fontWeight: 700 }}>
              {ordered} yd³ × ${parseFloat(p.concretePerYard).toFixed(0)}/yd³ = {formatCurrency(concreteCost)}
            </div>
          </div>
        )}
      </Card>

      <Card title="Colored Concrete">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontSize: 14, fontWeight: 600, color: '#334155' }}>
          <input
            type="checkbox"
            checked={p.coloredConcrete}
            onChange={e => set('coloredConcrete', e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          This job uses colored concrete
        </label>

        {p.coloredConcrete && (
          <>
            <Field label="Coloring Method">
              <select value={p.colorMethod} onChange={e => set('colorMethod', e.target.value)}>
                {COLOR_METHODS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <div style={{ background: '#faf7f4', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#57534e' }}>
              Typical range: <strong>${colorMethod.rangeLow}–${colorMethod.rangeHigh}/{colorMethod.unit}</strong> (2026 reference, varies by intensity/supplier)
            </div>
            <Field label="Color Cost per Cubic Yard ($)">
              <input
                type="number"
                inputMode="decimal"
                value={p.colorCostPerYard}
                placeholder={String(colorMethod.rangeLow)}
                min="0"
                onChange={e => set('colorCostPerYard', e.target.value)}
              />
            </Field>
            {colorCost > 0 && (
              <div style={{ background: '#fef9e7', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#d97706', fontWeight: 700 }}>
                {ordered} yd³ × ${parseFloat(p.colorCostPerYard).toFixed(0)}/yd³ = {formatCurrency(colorCost)}
              </div>
            )}
          </>
        )}
      </Card>

      <Card title="Concrete Pump">
        <Field label="Pump Type">
          <select value={p.pumpType} onChange={e => set('pumpType', e.target.value)}>
            {PUMP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>

        {p.pumpType !== 'none' && (
          <>
            <div style={{ background: '#faf7f4', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#57534e' }}>
              Typical rate: <strong>${pumpOption.hourlyLow}–${pumpOption.hourlyHigh}/hr</strong>, {pumpOption.minHours}-hour minimum (2026 reference, plus possible trip/standby fees)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Hourly Rate ($)">
                <input
                  type="number"
                  inputMode="decimal"
                  value={p.pumpHourlyRate}
                  placeholder={String(pumpOption.hourlyLow)}
                  min="0"
                  onChange={e => set('pumpHourlyRate', e.target.value)}
                />
              </Field>
              <Field label="Hours">
                <input
                  type="number"
                  inputMode="decimal"
                  value={p.pumpHours}
                  placeholder={String(pumpOption.minHours)}
                  min="0"
                  onChange={e => set('pumpHours', e.target.value)}
                />
              </Field>
            </div>
            <Field label="Trip / Standby Fee ($)">
              <input
                type="number"
                inputMode="decimal"
                value={p.pumpFlatFee}
                placeholder="0.00"
                min="0"
                onChange={e => set('pumpFlatFee', e.target.value)}
              />
            </Field>
            {pumpCost > 0 && (
              <div style={{ background: '#fef9e7', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#d97706', fontWeight: 700 }}>
                Pump total: {formatCurrency(pumpCost)}
              </div>
            )}
          </>
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
                background: quote.markup == pct ? '#1c1917' : '#f5f0eb',
                color: quote.markup == pct ? '#f59e0b' : '#57534e',
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
