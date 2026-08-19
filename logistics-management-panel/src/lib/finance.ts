import type { Trip } from "../interfaces/types"

export const DEFAULT_VAT_RATE = 0.2
export const DEFAULT_WITHHOLDING_RATE = 0.2

export function calculateTripNet(trip: Pick<Trip, "revenue" | "fuel_expense" | "adblue_expense" | "toll_expense" | "driver_allowance" | "extra_expense" | "fine_expense" | "driver_bonus">): number {
  return (
    (trip.revenue || 0) -
    (trip.fuel_expense || 0) -
    (trip.adblue_expense || 0) -
    (trip.toll_expense || 0) -
    (trip.driver_allowance || 0) -
    (trip.extra_expense || 0) -
    (trip.fine_expense || 0) -
    (trip.driver_bonus || 0)
  )
}

export function calculateRevenueWithTax(
  revenueExcludingVat: number,
  vatRate: number = DEFAULT_VAT_RATE,
  withholdingRate: number = DEFAULT_WITHHOLDING_RATE,
): {
  revenueExcludingVat: number
  vatAmount: number
  revenueIncludingVat: number
  withholdingAmount: number
  collectibleAmount: number
} {
  const safeRevenue = revenueExcludingVat || 0
  const safeVatRate = Number.isFinite(vatRate) && vatRate >= 0 ? vatRate : DEFAULT_VAT_RATE
  const safeWithholdingRate = Number.isFinite(withholdingRate) && withholdingRate >= 0 ? withholdingRate : DEFAULT_WITHHOLDING_RATE

  const vatAmount = safeRevenue * safeVatRate
  const revenueIncludingVat = safeRevenue + vatAmount
  const withholdingAmount = vatAmount * safeWithholdingRate
  const collectibleAmount = revenueIncludingVat - withholdingAmount

  return {
    revenueExcludingVat: safeRevenue,
    vatAmount,
    revenueIncludingVat,
    withholdingAmount,
    collectibleAmount,
  }
}
