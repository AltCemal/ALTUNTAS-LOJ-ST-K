import React, { useState } from "react"
import { X, Briefcase } from "lucide-react"
import { supabase } from "../lib/supabase"

export default function AddCustomerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName) return alert("Lütfen cari firma adını girin.")
    
    setLoading(true)
    try {
      const { error } = await supabase.from("customers").insert([
        {
          company_name: companyName,
          contact_person: contactPerson,
          phone_number: phoneNumber
        }
      ])
      if (error) throw error
      alert("Cari hesap / firma başarıyla eklendi.")
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Cari eklenirken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Briefcase className="size-5 text-red-500" /> Yeni Müşteri (Cari Firma) Ekle
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="size-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Firma / Şirket Unvanı</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Örn: Altuntaş Demir Çelik Sanayi" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">İlgili Kişi / Yetkili</label>
            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Örn: Cemal Bey" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Telefon Numarası</label>
            <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Örn: 0532 000 00 00" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-red-600" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-800 text-slate-300 px-4 py-2 hover:bg-slate-700">İptal</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-red-700 text-white px-5 py-2 hover:bg-red-600">{loading ? "Kaydediliyor..." : "Cariyi Kaydet"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}