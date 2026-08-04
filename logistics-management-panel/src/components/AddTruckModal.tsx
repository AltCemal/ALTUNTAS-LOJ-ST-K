import React, { useState } from "react"
import { X, Truck } from "lucide-react"
import { supabase } from "../lib/supabase"

export default function AddTruckModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [plate, setPlate] = useState("")
  const [brandModel, setBrandModel] = useState("")
  const [currentMileage, setCurrentMileage] = useState(0)
  const [oilMileage, setOilMileage] = useState(0) // 🛢️ Yeni: Yağ Değişim KM State'i
  const [tuvDate, setTuvDate] = useState(new Date().toISOString().split("T")[0])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plate || !brandModel) return alert("Lütfen plaka ve araç modelini girin.")
    
    setLoading(true)
    try {
      const { error } = await supabase.from("trucks").insert([
        {
          plate: plate.toUpperCase().replace(/\s+/g, ""),
          brand_model: brandModel,
          current_mileage: currentMileage,
          oil_change_mileage: oilMileage || currentMileage, // 🛢️ Girilmezse mevcut KM'yi baz alır
          next_tuvturk_date: tuvDate,
          status: "IDLE",
          last_known_location: "Garaj"
        }
      ])
      if (error) throw error
      alert("Çekici başarıyla filoya eklendi.")
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Araç eklenirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Truck className="size-5 text-red-500" /> Yeni Çekici (Tır) Ekle
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="size-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Araç Plakası</label>
            <input type="text" value={plate} onChange={e => setPlate(e.target.value)} placeholder="Örn: 55ALT55" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm uppercase outline-none focus:border-red-600" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Marka / Model</label>
            <input type="text" value={brandModel} onChange={e => setBrandModel(e.target.value)} placeholder="Örn: Scania R 450" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Mevcut Kilometre</label>
              <input type="number" value={currentMileage || ""} onChange={e => setCurrentMileage(Number(e.target.value))} placeholder="0" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
            </div>
            {/* 🛢️ YENİ INPUT: SON YAĞ DEĞİŞİM KM'Sİ */}
            <div>
              <label className="block text-slate-400 mb-1">Son Yağ Değişim KM</label>
              <input type="number" value={oilMileage || ""} onChange={e => setOilMileage(Number(e.target.value))} placeholder="Örn: 420000" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">TÜVTÜRK Vadesi</label>
            <input type="date" value={tuvDate} onChange={e => setTuvDate(e.target.value)} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">İptal</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-red-700 text-white px-5 py-2 hover:bg-red-600">{loading ? "Kaydediliyor..." : "Aracı Kaydet"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}