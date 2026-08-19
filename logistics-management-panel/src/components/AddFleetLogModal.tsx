import React, { useState } from "react"
import { ClipboardList, X } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useApp } from "../context/AppContext"
import type { FleetLog, FleetLogAction } from "../interfaces/types"

const FLEET_LOG_STORAGE_KEY = "tms-fleet-logs"

const actionOptions: { label: string; value: FleetLogAction }[] = [
  { label: "Alındı", value: "ALINDI" },
  { label: "Satıldı", value: "SATILDI" },
  { label: "Devir Alındı", value: "DEVIR_ALINDI" },
]

function saveToLocalLog(log: FleetLog) {
  try {
    const raw = window.localStorage.getItem(FLEET_LOG_STORAGE_KEY)
    const prev = raw ? (JSON.parse(raw) as FleetLog[]) : []
    const next = [log, ...prev].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    window.localStorage.setItem(FLEET_LOG_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage yazımı engellenirse sessizce devam ediyoruz.
  }
}

export default function AddFleetLogModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refreshData } = useApp()
  const [loading, setLoading] = useState(false)
  const [itemName, setItemName] = useState("")
  const [action, setAction] = useState<FleetLogAction>("ALINDI")
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) {
      alert("Lütfen kayıt adını girin.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        item_name: itemName.trim(),
        action,
        event_date: eventDate,
        note: note.trim() || null,
      }

      const { error } = await supabase.from("fleet_logs").insert([payload])

      if (error) {
        if (error.code === "42P01") {
          saveToLocalLog({
            id: crypto.randomUUID(),
            item_name: payload.item_name,
            action: payload.action,
            event_date: payload.event_date,
            note: payload.note,
            created_at: new Date().toISOString(),
          })
        } else {
          throw error
        }
      }

      await refreshData()
      alert(error ? "Log kaydı local olarak eklendi." : "Log kaydı başarıyla eklendi.")
      onClose()
      setItemName("")
      setAction("ALINDI")
      setEventDate(new Date().toISOString().split("T")[0])
      setNote("")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Log kaydı eklenirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ClipboardList className="size-5 text-sky-400" /> Yeni Log Kaydı
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Kayıt Adı</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Örn: 2018 Model Lowbed Dorse"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">İşlem Türü</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as FleetLogAction)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              >
                {actionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">İşlem Tarihi</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Not (Opsiyonel)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: İhale sonrası devir ile filoya katıldı"
              className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">
              İptal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-sky-700 text-white px-5 py-2 hover:bg-sky-600">
              {loading ? "Kaydediliyor..." : "Logu Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
