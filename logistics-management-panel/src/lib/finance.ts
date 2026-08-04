import type { Trip } from "../interfaces/types"

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
