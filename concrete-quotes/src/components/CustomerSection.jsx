const JOB_TYPES = ['Driveway', 'Patio', 'Sidewalk', 'Foundation', 'Garage Floor', 'Pool Deck', 'Retaining Wall', 'Steps', 'Other']

export default function CustomerSection({ quote, onChange }) {
  function set(field, val) {
    onChange({ customer: { ...quote.customer, [field]: val } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Customer Info">
        <Field label="Customer Name">
          <input
            type="text"
            value={quote.customer.name}
            placeholder="John Smith"
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            value={quote.customer.phone}
            placeholder="(555) 000-0000"
            onChange={e => set('phone', e.target.value)}
          />
        </Field>
        <Field label="Job Address">
          <input
            type="text"
            value={quote.customer.address}
            placeholder="123 Main St, City, ST"
            onChange={e => set('address', e.target.value)}
          />
        </Field>
        <Field label="Email (optional)">
          <input
            type="email"
            value={quote.customer.email || ''}
            placeholder="customer@email.com"
            onChange={e => set('email', e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Job Details">
        <Field label="Job Type">
          <select value={quote.jobType} onChange={e => onChange({ jobType: e.target.value })}>
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Notes / Special Instructions">
          <textarea
            rows={4}
            value={quote.notes}
            placeholder="Fiber reinforced mix, colored concrete, special finish..."
            onChange={e => onChange({ notes: e.target.value })}
            style={{ resize: 'none' }}
          />
        </Field>
      </Card>
    </div>
  )
}

export function Card({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
      {title && <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#0f172a' }}>{title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  )
}
