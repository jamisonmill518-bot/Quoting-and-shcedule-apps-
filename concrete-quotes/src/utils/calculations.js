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

// Typical U.S. ready-mix price adders by PSI strength, relative to 3,000 PSI base.
// Reference only — actual pricing varies by region and producer; confirm with your local plant.
export const PSI_OPTIONS = [
  { psi: '2500', label: '2,500 PSI', use: 'Walkways, light patios', adder: -10 },
  { psi: '3000', label: '3,000 PSI', use: 'Standard residential slabs', adder: 0 },
  { psi: '3500', label: '3,500 PSI', use: 'Driveways, exterior flatwork', adder: 10 },
  { psi: '4000', label: '4,000 PSI', use: 'Garage floors, footings, freeze-thaw areas', adder: 18 },
  { psi: '4500', label: '4,500 PSI', use: 'Heavy-duty / structural', adder: 25 },
  { psi: '5000', label: '5,000 PSI', use: 'High-strength industrial floors', adder: 30 }
]

// Reference cost ranges for color methods — actual pricing varies by supplier/region.
export const COLOR_METHODS = [
  { id: 'integral', label: 'Integral Color (powder/liquid)', rangeLow: 50, rangeHigh: 100, unit: 'yd³' },
  { id: 'hardener', label: 'Color Hardener (broadcast)', rangeLow: 75, rangeHigh: 150, unit: 'yd³' },
  { id: 'stamped', label: 'Stamped / Decorative', rangeLow: 150, rangeHigh: 300, unit: 'yd³' }
]

// Reference pump rates — actual pricing varies by region, reach, and minimum hours.
export const PUMP_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'line', label: 'Line Pump (trailer)', hourlyLow: 200, hourlyHigh: 320, minHours: 3 },
  { id: 'boom', label: 'Boom Pump', hourlyLow: 225, hourlyHigh: 300, minHours: 4 }
]

export function calcColorCost(ordered, pricing) {
  if (!pricing.coloredConcrete) return 0
  return ordered * parseFloat(pricing.colorCostPerYard || 0)
}

export function calcPumpCost(pricing) {
  if (!pricing.pumpType || pricing.pumpType === 'none') return 0
  const hourly = parseFloat(pricing.pumpHourlyRate || 0) * parseFloat(pricing.pumpHours || 0)
  const flat = parseFloat(pricing.pumpFlatFee || 0)
  return hourly + flat
}

export function calcMaterialCost(sections, pricing) {
  const cy = totalCubicYards(sections)
  const ordered = orderYards(cy)
  const concreteCost = ordered * parseFloat(pricing.concretePerYard || 0)
  const rebarCost = parseFloat(pricing.rebarCost || 0)
  const formsCost = parseFloat(pricing.formsCost || 0)
  const fiberCost = parseFloat(pricing.fiberCost || 0)
  const otherMaterials = parseFloat(pricing.otherMaterials || 0)
  const colorCost = calcColorCost(ordered, pricing)
  const pumpCost = calcPumpCost(pricing)
  return {
    cy,
    ordered,
    concreteCost,
    rebarCost,
    formsCost,
    fiberCost,
    otherMaterials,
    colorCost,
    pumpCost,
    total: concreteCost + rebarCost + formsCost + fiberCost + otherMaterials + colorCost + pumpCost
  }
}

export function calcLaborCost(labor) {
  return labor.reduce((sum, l) => {
    return sum + parseFloat(l.hours || 0) * parseFloat(l.rate || 0)
  }, 0)
}

// Reference price ranges for decorative add-ons — confirm with local contractors/suppliers.
export const ADDON_TYPES = [
  { id: 'border', label: 'Textured / Stamped Border', unit: 'ft', unitLabel: 'Linear Feet', rateLabel: '$ per Linear Ft', low: 15, high: 18 },
  { id: 'stairFace', label: 'Custom Stair Face / Riser', unit: 'step', unitLabel: 'Number of Steps', rateLabel: '$ per Step', low: 280, high: 420 },
  { id: 'exposedAggregate', label: 'Exposed Aggregate Finish', unit: 'sqft', unitLabel: 'Square Feet', rateLabel: '$ per Sq Ft', low: 7, high: 18 },
  { id: 'sawCut', label: 'Saw Cut Control Joints', unit: 'ft', unitLabel: 'Linear Feet', rateLabel: '$ per Linear Ft', low: 1, high: 2 },
  { id: 'sealer', label: 'Concrete Sealer', unit: 'sqft', unitLabel: 'Square Feet', rateLabel: '$ per Sq Ft', low: 1.35, high: 2.5 },
  { id: 'custom', label: 'Custom Add-on', unit: 'flat', unitLabel: null, rateLabel: 'Flat Cost ($)', low: 0, high: 0 }
]

export function calcAddonLineTotal(addon) {
  if (addon.type === 'custom') return parseFloat(addon.rate || 0)
  return parseFloat(addon.qty || 0) * parseFloat(addon.rate || 0)
}

export function calcAddonsCost(addons) {
  return (addons || []).reduce((sum, a) => sum + calcAddonLineTotal(a), 0)
}

export function calcQuote(sections, pricing, labor, markup, addons = []) {
  const materials = calcMaterialCost(sections, pricing)
  const laborTotal = calcLaborCost(labor)
  const addonsTotal = calcAddonsCost(addons)
  const subtotal = materials.total + laborTotal + addonsTotal
  const markupAmount = subtotal * (parseFloat(markup || 0) / 100)
  const total = subtotal + markupAmount
  return { materials, laborTotal, addonsTotal, subtotal, markupAmount, total }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
