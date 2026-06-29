// Convert linear feet + inches to decimal feet
export function toFeet(feet, inches = 0) {
  return parseFloat(feet || 0) + parseFloat(inches || 0) / 12
}

// Calculate cubic yards from feet dimensions
export function cubicYards(lengthFt, widthFt, thicknessIn) {
  const thicknessFt = parseFloat(thicknessIn || 0) / 12
  return (parseFloat(lengthFt || 0) * parseFloat(widthFt || 0) * thicknessFt) / 27
}

// Calculate cubic yards from a list of area sections
export function totalCubicYards(sections) {
  return sections.reduce((sum, s) => {
    return sum + cubicYards(s.length, s.width, s.thickness)
  }, 0)
}

// Round up to nearest 0.5 yard (typical concrete order minimum)
export function orderYards(cy) {
  return Math.ceil(cy * 2) / 2
}

// Bags of concrete (80lb bag = 0.6 cu ft = ~0.022 cu yd)
export function bagsNeeded(cy) {
  return Math.ceil(cy / 0.022)
}

export function calcMaterialCost(sections, pricing) {
  const cy = totalCubicYards(sections)
  const ordered = orderYards(cy)
  const concreteCost = ordered * parseFloat(pricing.concretePerYard || 0)
  const rebarCost = parseFloat(pricing.rebarCost || 0)
  const formsCost = parseFloat(pricing.formsCost || 0)
  const fiberCost = parseFloat(pricing.fiberCost || 0)
  const otherMaterials = parseFloat(pricing.otherMaterials || 0)
  return {
    cy,
    ordered,
    concreteCost,
    rebarCost,
    formsCost,
    fiberCost,
    otherMaterials,
    total: concreteCost + rebarCost + formsCost + fiberCost + otherMaterials
  }
}

export function calcLaborCost(labor) {
  return labor.reduce((sum, l) => {
    return sum + parseFloat(l.hours || 0) * parseFloat(l.rate || 0)
  }, 0)
}

export function calcQuote(sections, pricing, labor, markup) {
  const materials = calcMaterialCost(sections, pricing)
  const laborTotal = calcLaborCost(labor)
  const subtotal = materials.total + laborTotal
  const markupAmount = subtotal * (parseFloat(markup || 0) / 100)
  const total = subtotal + markupAmount
  return { materials, laborTotal, subtotal, markupAmount, total }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
