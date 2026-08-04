import React, { useState, useEffect } from "react"
import { X, Disc } from "lucide-react"
import { supabase } from "../lib/supabase"

interface AddTireModalProps {
  isOpen: boolean
  onClose: () => void
  truckId: string
  positionId: number
  positionLabel: string
}

export default function AddTireModal({ isOpen, onClose, truckId, positionId, positionLabel }: AddTireModalProps) {
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState("Petlas")
  const [percentage, setPercentage] = useState(100)
  const [mileage, setMileage] = useState(0)

  // Modal her açıldığında seçilen tekerleğin veritabanındaki güncel durumunu çekelim
  useEffect(() => {
    if (!isOpen || !truckId) return

    async function fetchTireData() {
      const { data, error } = await supabase
        .from("truck_tires")
        .select("*")
        .eq("truck_id", truckId)
        .eq("tire_position", positionId)
        .single()

      if (data && !error) {
        setBrand(data.brand)
        setPercentage(data.tread_depth_percentage)
        setMileage(data.mileage_km)
      } else {
        // Veri yoksa varsayılan değerlere çek
        setBrand("Petlas")
        setPercentage(100)
        setMileage(0)
      }
    }

    fetchTireData()
  }, [isOpen, truckId, positionId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Postgres UPSERT mantığı: Varsa güncelle, yoksa yeni satır ekle
      const { error } = await supabase.from("truck_tires").upsert(
        {
          truck_id: truckId,
          tire_position: positionId,
          brand: brand,
          tread_depth_percentage: percentage,
          mileage_km: mileage,
          updated_at: new Date().toISOString()
        },
        { onConflict: "truck_id,tire_position" }
      )

      if (error) throw error
      alert(`${positionLabel} verileri başarıyla güncellendi.`)
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lastik verisi kaydedilirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Disc className="size-5 text-red-500" /> {positionLabel} Güncelleme
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="size-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Lastik Markası</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600">
              <option value="Petlas">Petlas</option>
              <option value="Michelin">Michelin</option>
              <option value="Bridgestone">Bridgestone</option>
              <option value="Continental">Continental</option>
              <option value="Goodyear">Goodyear</option>
              <option value="Lassa">Lassa</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Diş Derinliği Sağlığı (Yüzde)</label>
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="100" step="5" value={percentage} onChange={e => setPercentage(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600" />
              <span className="font-mono text-sm font-bold text-white w-12 text-right">%{percentage}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Lastik Mevcut Kilometresi (Ömür)</label>
            <input type="number" value={mileage || ""} onChange={e => setMileage(Number(e.target.value))} placeholder="Örn: 15000" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">İptal</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-red-700 text-white px-5 py-2 hover:bg-red-600">{loading ? "Kaydediliyor..." : "Verileri Kaydet"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}