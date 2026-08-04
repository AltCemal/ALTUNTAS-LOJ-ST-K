import { useEffect, useState } from "react"
import { Pencil, X } from "lucide-react"
import { useApp } from "../context/AppContext"
import type { Trip, TripStatus } from "../interfaces/types"
import { calculateTripNet } from "../lib/finance"

type EditTripModalProps = {
  isOpen: boolean
  trip: Trip | null
  onClose: () => void
  onSave: (tripId: string, payload: Partial<Trip>) => Promise<void>
}

export default function EditTripModal({ isOpen, trip, onClose, onSave }: EditTripModalProps) {
  const { trucks, customers, trailers } = useApp()
  const [loading, setLoading] = useState(false)

  const [truckId, setTruckId] = useState("")
  const [trailerId, setTrailerId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [loadingPoint, setLoadingPoint] = useState("")
  const [deliveryPoint, setDeliveryPoint] = useState("")
  const [cargoType, setCargoType] = useState("")
  const [cargoWeight, setCargoWeight] = useState(0)
  const [tripDistanceKm, setTripDistanceKm] = useState(0)
  const [startDate, setStartDate] = useState("")
  const [status, setStatus] = useState<TripStatus>("ACTIVE")

  const [revenue, setRevenue] = useState(0)
  const [fuelExpense, setFuelExpense] = useState(0)
  const [fuelLiters, setFuelLiters] = useState(0)
  const [adblueExpense, setAdblueExpense] = useState(0)
  const [tollExpense, setTollExpense] = useState(0)
  const [driverAllowance, setDriverAllowance] = useState(0)
  const [driverBonus, setDriverBonus] = useState(0)
  const [fineExpense, setFineExpense] = useState(0)
  const [extraExpense, setExtraExpense] = useState(0)

  useEffect(() => {
    if (!trip) return

    setTruckId(trip.truck_id)
    setTrailerId(trip.trailer_id || "")
    setCustomerId(trip.customer_id)
    setLoadingPoint(trip.loading_point)
    setDeliveryPoint(trip.delivery_point)
    setCargoType(trip.cargo_type)
    setCargoWeight(trip.cargo_weight || 0)
    setTripDistanceKm(trip.trip_distance_km || 0)
    setStartDate(trip.start_date?.split("T")[0] || "")
    setStatus(trip.status)

    setRevenue(trip.revenue || 0)
    setFuelExpense(trip.fuel_expense || 0)
    setFuelLiters(trip.fuel_liters || 0)
    setAdblueExpense(trip.adblue_expense || 0)
    setTollExpense(trip.toll_expense || 0)
    setDriverAllowance(trip.driver_allowance || 0)
    setDriverBonus(trip.driver_bonus || 0)
    setFineExpense(trip.fine_expense || 0)
    setExtraExpense(trip.extra_expense || 0)
  }, [trip])

  if (!isOpen || !trip) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const netProfit = calculateTripNet({
      revenue,
      fuel_expense: fuelExpense,
      adblue_expense: adblueExpense,
      toll_expense: tollExpense,
      driver_allowance: driverAllowance,
      extra_expense: extraExpense,
      fine_expense: fineExpense,
      driver_bonus: driverBonus,
    })

    try {
      await onSave(trip.id, {
        truck_id: truckId,
        trailer_id: trailerId || undefined,
        customer_id: customerId,
        loading_point: loadingPoint,
        delivery_point: deliveryPoint,
        cargo_type: cargoType,
        cargo_weight: cargoWeight,
        trip_distance_km: tripDistanceKm,
        start_date: startDate,
        status,
        revenue,
        fuel_expense: fuelExpense,
        fuel_liters: fuelLiters,
        adblue_expense: adblueExpense,
        toll_expense: tollExpense,
        driver_allowance: driverAllowance,
        driver_bonus: driverBonus,
        fine_expense: fineExpense,
        extra_expense: extraExpense,
        net_profit: netProfit,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Pencil className="size-5 text-sky-400" /> Sefer Düzenle
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Araç</label>
              <select value={truckId} onChange={(e) => setTruckId(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                {trucks.map((t) => (
                  <option key={t.id} value={t.id}>{t.plate} — {t.brand_model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dorse</label>
              <select value={trailerId} onChange={(e) => setTrailerId(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                <option value="">Dorse Yok</option>
                {trailers.map((t) => (
                  <option key={t.id} value={t.id}>{t.plate} — {t.trailer_type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Müşteri</label>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Durum</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TripStatus)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                <option value="ACTIVE">Aktif</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="CANCELLED">İptal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yükleme</label>
              <input value={loadingPoint} onChange={(e) => setLoadingPoint(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Teslimat</label>
              <input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yük Cinsi</label>
              <input value={cargoType} onChange={(e) => setCargoType(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tarih</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">KM</label>
              <input type="number" value={tripDistanceKm || ""} onChange={(e) => setTripDistanceKm(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tonaj</label>
              <input type="number" step="0.1" value={cargoWeight || ""} onChange={(e) => setCargoWeight(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ciro</label>
              <input type="number" value={revenue || ""} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yakıt ₺</label>
              <input type="number" value={fuelExpense || ""} onChange={(e) => setFuelExpense(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yakıt Lt</label>
              <input type="number" value={fuelLiters || ""} onChange={(e) => setFuelLiters(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">AdBlue ₺</label>
              <input type="number" value={adblueExpense || ""} onChange={(e) => setAdblueExpense(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Otoban ₺</label>
              <input type="number" value={tollExpense || ""} onChange={(e) => setTollExpense(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Harcırah ₺</label>
              <input type="number" value={driverAllowance || ""} onChange={(e) => setDriverAllowance(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prim ₺</label>
              <input type="number" value={driverBonus || ""} onChange={(e) => setDriverBonus(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ceza ₺</label>
              <input type="number" value={fineExpense || ""} onChange={(e) => setFineExpense(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Ekstra ₺</label>
            <input type="number" value={extraExpense || ""} onChange={(e) => setExtraExpense(Number(e.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">
              İptal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-sky-700 text-white px-5 py-2 hover:bg-sky-600">
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
