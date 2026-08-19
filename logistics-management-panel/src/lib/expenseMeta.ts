const VARIABLE_EXPENSE_PREFIX = "DEGISKEN|"
const EXPENSE_META_SEPARATOR = "||"

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^0-9A-Z]/g, "")
}

export function buildStoredExpenseName({
  name,
  isVariable,
  truckPlate,
}: {
  name: string
  isVariable: boolean
  truckPlate?: string
}): string {
  const baseName = isVariable ? `${VARIABLE_EXPENSE_PREFIX}${name}` : name

  if (!truckPlate) return baseName

  const normalizedPlate = normalizePlate(truckPlate)
  if (!normalizedPlate) return baseName

  return `${baseName}${EXPENSE_META_SEPARATOR}TRUCK=${normalizedPlate}`
}

export function parseStoredExpenseName(rawName: string): {
  displayName: string
  isVariable: boolean
  truckPlate?: string
} {
  const [namePart, ...metaParts] = rawName.split(EXPENSE_META_SEPARATOR)
  const isVariable = namePart.startsWith(VARIABLE_EXPENSE_PREFIX)
  const displayName = isVariable ? namePart.replace(VARIABLE_EXPENSE_PREFIX, "") : namePart

  let truckPlate: string | undefined
  metaParts.forEach((entry) => {
    if (entry.startsWith("TRUCK=")) {
      const plate = entry.replace("TRUCK=", "").trim()
      if (plate) truckPlate = plate
    }
  })

  return { displayName, isVariable, truckPlate }
}

export function expenseMatchesTruck(expenseTruckPlate: string | undefined, selectedTruckPlate: string | undefined): boolean {
  if (!selectedTruckPlate) return true
  if (!expenseTruckPlate) return false
  return normalizePlate(expenseTruckPlate) === normalizePlate(selectedTruckPlate)
}
