import React, { useMemo, useState } from "react"
import { Plus, X } from "lucide-react"
import { useApp } from "../context/AppContext"
import { supabase } from "../lib/supabase"
import type { TripStatus, InvoiceStatus, PaymentStatus } from "../interfaces/types"
import { calculateTripNet } from "../lib/finance"
import { buildInactiveAssetSet, normalizeAssetName } from "../lib/fleetLogs"

export default function AddTripModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { trucks, customers, trailers, fleetLogs } = useApp()
  const [loading, setLoading] = useState(false)

  const inactiveAssetSet = useMemo(() => buildInactiveAssetSet(fleetLogs), [fleetLogs])
  const availableTrucks = useMemo(
    () => trucks.filter((truck) => !inactiveAssetSet.has(normalizeAssetName(truck.plate))),
    [trucks, inactiveAssetSet],
  )
  const availableTrailers = useMemo(
    () => trailers.filter((trailer) => !inactiveAssetSet.has(normalizeAssetName(trailer.plate))),
    [trailers, inactiveAssetSet],
  )
  
  // Standart Form Alanları
  const [truckId, setTruckId] = useState("")
  const [trailerId, setTrailerId] = useState("") 
  const [customerId, setCustomerId] = useState("")
  const [loadingPoint, setLoadingPoint] = useState("")
  const [deliveryPoint, setDeliveryPoint] = useState("")
  const [cargoType, setCargoType] = useState("")
  const [cargoWeight, setCargoWeight] = useState(0)
  const [tripDistanceKm, setTripDistanceKm] = useState(0)
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [revenue, setRevenue] = useState(0)
  
  // Gider Kalemleri (Yakıt Litresi, Kantar Cezası ve Şoför Primi Dahil)
  const [fuelExpense, setFuelExpense] = useState(0)
  const [fuelLiters, setFuelLiters] = useState(0)
  const [adblueExpense, setAdblueExpense] = useState(0)
  const [tollExpense, setTollExpense] = useState(0)
  const [driverAllowance, setDriverAllowance] = useState(0)
  const [driverBonus, setDriverBonus] = useState(0)
  const [fineExpense, setFineExpense] = useState(0)
  const [extraExpense, setExtraExpense] = useState(0)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!truckId || !customerId) return alert("Lütfen araç ve cari firma seçimini yapın.")
    
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

    const newTrip = {
      truck_id: truckId,
      trailer_id: trailerId || null, 
      customer_id: customerId,
      loading_point: loadingPoint,
      delivery_point: deliveryPoint,
      cargo_type: cargoType,
      cargo_weight: cargoWeight,
      trip_distance_km: tripDistanceKm,
      start_date: startDate,
      end_date: null,
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
      status: "ACTIVE" as TripStatus,
      invoice_status: "NOT_INVOICED" as InvoiceStatus,
      payment_status: "PENDING" as PaymentStatus
    }

    try {
      const { error } = await supabase.from("trips").insert([newTrip])
      if (error) throw error
      
      await supabase
        .from("trucks")
        .update({ status: "ON_ROAD", last_known_location: loadingPoint })
        .eq("id", truckId)

      if (trailerId) {
        await supabase
          .from("trailers")
          .update({ status: "ON_ROAD" })
          .eq("id", trailerId)
      }

      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Sefer eklenirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="size-5 text-red-500" /> Yeni Sefer Başlat
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Araç, Dorse ve Cari Hesap Seçimi */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Araç (Plaka)</label>
              <select value={truckId} onChange={e => setTruckId(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600">
                <option value="">Araç Seçin</option>
                {availableTrucks.map(t => <option key={t.id} value={t.id}>{t.plate} — {t.brand_model}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dorse (Treyler)</label>
              <select value={trailerId} onChange={e => setTrailerId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600">
                <option value="">Dorse Yok (Kuru Çekici)</option>
                {availableTrailers.map((tr) => (
                  <option key={tr.id} value={tr.id}>{tr.plate} — {tr.trailer_type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Firma (Cari)</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600">
                <option value="">Firma Seçin</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
          </div>

          {/* Rota */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yükleme Noktası</label>
              <input type="text" value={loadingPoint} onChange={e => setLoadingPoint(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Teslimat Noktası</label>
              <input type="text" value={deliveryPoint} onChange={e => setDeliveryPoint(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mesafe (KM)</label>
              <input type="number" value={tripDistanceKm || ""} onChange={e => setTripDistanceKm(Number(e.target.value))} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
          </div>

          {/* Yük Detayı */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yük Cinsi</label>
              <input type="text" value={cargoType} onChange={e => setCargoType(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ağırlık (Ton)</label>
              <input type="number" step="0.1" value={cargoWeight || ""} onChange={e => setCargoWeight(Number(e.target.value))} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tarih</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-600" />
            </div>
          </div>

          <hr className="border-slate-800 my-2" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">Finansal Navlun ve Yakıt/Gider Detayları</h3>
          
          {/* Ciro & Yakıt */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Navlun Bedeli (Ciro ₺)</label>
              <input type="number" value={revenue || ""} onChange={e => setRevenue(Number(e.target.value))} required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yakıt Tutarı (₺)</label>
              <input type="number" value={fuelExpense || ""} onChange={e => setFuelExpense(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yakıt Litresi (Lt)</label>
              <input type="number" value={fuelLiters || ""} onChange={e => setFuelLiters(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
          </div>

          {/* Harcamalar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">AdBlue (₺)</label>
              <input type="number" value={adblueExpense || ""} onChange={e => setAdblueExpense(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Otoban / Köprü (₺)</label>
              <input type="number" value={tollExpense || ""} onChange={e => setTollExpense(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Şoför Harcırahı (₺)</label>
              <input type="number" value={driverAllowance || ""} onChange={e => setDriverAllowance(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
          </div>

          {/* Gelişmiş Finans Girdileri */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Şoför Sefer Primi (₺)</label>
              <input type="number" value={driverBonus || ""} onChange={e => setDriverBonus(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Kantar / İhlal Cezası (₺)</label>
              <input type="number" value={fineExpense || ""} onChange={e => setFineExpense(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ekstra Masraf / Diğer (₺)</label>
              <input type="number" value={extraExpense || ""} onChange={e => setExtraExpense(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 font-mono outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-sm font-medium transition">
              İptal
            </button>
            <button type="submit" disabled={loading}
              className="rounded-lg bg-red-700 hover:bg-red-600 active:bg-red-800 text-white px-5 py-2 text-sm font-medium transition">
              {loading ? "Kaydediliyor..." : "Seferi Başlat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}