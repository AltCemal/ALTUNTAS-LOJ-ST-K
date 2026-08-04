import React, { useState } from "react"
import { X, Wallet } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useApp } from "../context/AppContext"

const expenseTypes = [
  "Bandrol",
  "Mazot",
  "Sanayi / Bakım",
  "Lastik",
  "Sigorta / Kasko",
  "Muhasebe",
  "Diğer",
] as const

const VARIABLE_EXPENSE_PREFIX = "DEGISKEN|"

export default function AddExpenseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refreshData } = useApp()
  const [loading, setLoading] = useState(false)
  const [expenseType, setExpenseType] = useState<(typeof expenseTypes)[number]>("Bandrol")
  const [customName, setCustomName] = useState("")
  const [amount, setAmount] = useState(0)
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")
  const [isFixedExpense, setIsFixedExpense] = useState(true)

  if (!isOpen) return null

  const resolvedName = expenseType === "Diğer" ? customName.trim() : expenseType
  const finalNameRaw = note.trim() ? `${resolvedName} - ${note.trim()}` : resolvedName
  const finalName = isFixedExpense ? finalNameRaw : `${VARIABLE_EXPENSE_PREFIX}${finalNameRaw}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedName) return alert("Lütfen gider adını girin.")
    if (!amount || amount <= 0) return alert("Lütfen geçerli bir tutar girin.")

    setLoading(true)
    try {
      const { error } = await supabase.from("fixed_expenses").insert([
        {
          expense_name: finalName,
          amount,
          expense_date: expenseDate,
        },
      ])

      if (error) throw error

      await refreshData()
      alert("Gider kaydı başarıyla eklendi.")
      onClose()
      setExpenseType("Bandrol")
      setCustomName("")
      setAmount(0)
      setExpenseDate(new Date().toISOString().split("T")[0])
      setNote("")
      setIsFixedExpense(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gider eklenirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Wallet className="size-5 text-amber-400" /> Yeni Gider Ekle
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Gider Türü</label>
            <select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value as (typeof expenseTypes)[number])}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
            >
              {expenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {expenseType === "Diğer" && (
            <div>
              <label className="block text-slate-400 mb-1">Gider Adı</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Örn: Otopark"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Tutar (₺)</label>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Örn: 12500"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Gider Tarihi</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: 2026 Ağustos ödemesi"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-slate-300">
            <input
              type="checkbox"
              checked={isFixedExpense}
              onChange={(e) => setIsFixedExpense(e.target.checked)}
              className="size-4 rounded border-slate-600 bg-slate-900"
            />
            <span className="text-xs">
              Sabit gider olarak işle (işaretli değilse değişken gider olarak kaydedilir)
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">
              İptal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-amber-700 text-white px-5 py-2 hover:bg-amber-600">
              {loading ? "Kaydediliyor..." : "Gideri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}