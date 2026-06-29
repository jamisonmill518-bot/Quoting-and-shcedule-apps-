const KEY = 'concrete_quotes'

export function loadQuotes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveQuote(quote) {
  const quotes = loadQuotes()
  const idx = quotes.findIndex(q => q.id === quote.id)
  if (idx >= 0) {
    quotes[idx] = quote
  } else {
    quotes.unshift(quote)
  }
  localStorage.setItem(KEY, JSON.stringify(quotes))
}

export function deleteQuote(id) {
  const quotes = loadQuotes().filter(q => q.id !== id)
  localStorage.setItem(KEY, JSON.stringify(quotes))
}

export function newQuote() {
  return {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'Draft',
    customer: { name: '', phone: '', address: '' },
    jobType: 'Driveway',
    sections: [{ id: '1', label: 'Section 1', length: '', width: '', thickness: '4' }],
    pricing: {
      concretePerYard: '175',
      psi: '3000',
      rebarCost: '',
      formsCost: '',
      fiberCost: '',
      otherMaterials: '',
      coloredConcrete: false,
      colorMethod: 'integral',
      colorCostPerYard: '',
      pumpType: 'none',
      pumpHourlyRate: '',
      pumpHours: '',
      pumpFlatFee: ''
    },
    labor: [{ id: '1', description: 'Labor', hours: '', rate: '75' }],
    markup: '20',
    notes: ''
  }
}
