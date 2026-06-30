import { calcQuote, formatCurrency, formatDate } from '../utils/calculations.js'

const STATUS_COLORS = {
  Draft: { bg: '#fef9c3', text: '#92400e' },
  Sent: { bg: '#fef3c7', text: '#b45309' },
  Accepted: { bg: '#dcfce7', text: '#166534' },
  Declined: { bg: '#fee2e2', text: '#991b1b' }
}

export default function QuoteList({ quotes, onNew, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{
        background: '#1c1917',
        color: 'white',
        padding: '16px 16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        borderBottom: '3px solid #f59e0b'
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#f59e0b', marginBottom: 2 }}>⚙ CONCRETE QUOTE PRO</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>My Quotes</div>
        <div style={{ fontSize: 13, color: '#a8a29e', marginTop: 2 }}>{quotes.length} quote{quotes.length !== 1 ? 's' : ''}</div>
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '12px 16px', paddingBottom: 'max(80px, calc(env(safe-area-inset-bottom) + 80px))' }}>
        {quotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a8a29e' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#44403c', marginBottom: 6 }}>No quotes yet</div>
            <div style={{ fontSize: 14 }}>Tap the button below to create your first concrete quote</div>
          </div>
        ) : (
          quotes.map(q => {
            const result = calcQuote(q.sections, q.pricing, q.labor, q.markup, q.addons, q.aggregates || [])
            const sc = STATUS_COLORS[q.status] || STATUS_COLORS.Draft
            return (
              <div
                key={q.id}
                onClick={() => onEdit(q)}
                style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 10,
                  boxShadow: '0 2px 6px rgba(0,0,0,.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderLeft: '4px solid #f59e0b'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#1c1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.customer.name || 'Unnamed Customer'}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: sc.bg, color: sc.text, flexShrink: 0 }}>
                      {q.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#57534e', marginBottom: 2 }}>
                    {q.jobType} • {q.customer.address || 'No address'}
                  </div>
                  <div style={{ fontSize: 12, color: '#a8a29e' }}>{formatDate(q.createdAt)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#1c1917' }}>{formatCurrency(result.total)}</div>
                  <button
                    onClick={e => { e.stopPropagation(); if (confirm('Delete this quote?')) onDelete(q.id) }}
                    style={{ background: 'none', color: '#dc2626', fontSize: 12, marginTop: 4, padding: '2px 0' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onNew}
        style={{
          position: 'fixed',
          bottom: 'max(24px, calc(env(safe-area-inset-bottom) + 16px))',
          right: 20,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: '#f59e0b',
          color: '#1c1917',
          fontSize: 28,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(245,158,11,.5)',
          zIndex: 10
        }}
      >
        +
      </button>
    </div>
  )
}
