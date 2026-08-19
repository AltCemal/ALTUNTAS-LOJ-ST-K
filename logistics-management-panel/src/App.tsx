import { useEffect, useMemo, useState } from "react"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { LogOut, Lock, Truck, LayoutDashboard, ArrowRight, Plus, MapPin, Wrench, PlayCircle, Coffee, Disc, Calendar, AlertTriangle, Landmark, TrendingUp, Droplet, ClipboardList } from "lucide-react"
import { supabase, isSupabaseConfigured } from "./lib/supabase"
import { AppProvider, useApp } from "./context/AppContext"
import FilterPanel from "./components/FilterPanel"
import OverviewCards from "./components/OverviewCards"
import TripTable from "./components/TripTable"
import AddTripModal from "./components/AddTripModal"

// 🛠️ MODALLAR IMPORT EDİLDİ
import AddTruckModal from "./components/AddTruckModal"
import AddTrailerModal from "./components/AddTrailerModal"
import AddCustomerModal from "./components/AddCustomerModal"
import AddTireModal from "./components/AddTireModal" 
import AddExpenseModal from "./components/AddExpenseModal"
import EditTripModal from "./components/EditTripModal"
import AddFleetLogModal from "./components/AddFleetLogModal"

// Tip tanımlamasını import ediyoruz
import type { FixedExpense, InvoiceStatus, PaymentStatus, Trailer, Trip, TripStatus } from "./interfaces/types"
import { calculateTripNet } from "./lib/finance"
import { buildInactiveAssetSet, normalizeAssetName } from "./lib/fleetLogs"
import { expenseMatchesTruck, parseStoredExpenseName } from "./lib/expenseMeta"

const inspectionScheduleByPlate: Record<string, string> = {
  "55AUE267": "2026-06-06",
  "55ALT974": "2026-10-08",
  "55AUE147": "2026-12-02",
  "55ACE135": "2026-12-21",
  "61ABG687": "2027-04-17",
  "55AUE143": "2026-12-08",
  "55ATM336": "2026-10-08",
}

const transferPolicyDateByPlate: Record<string, string> = {
  "61ABG687": "2026-08-19",
  "55ACE135": "2026-08-19",
  "55AUE143": "2026-08-19",
  "55ATM336": "2026-08-19",
}

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^0-9A-Z]/g, "")
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function monthsAgo(months: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setMonth(d.getMonth() - months)
  return d
}

function getRolledAnnualDate(dateText?: string): string | undefined {
  if (!dateText) return undefined
  const parsed = new Date(dateText)
  if (Number.isNaN(parsed.getTime())) return undefined

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  while (parsed.getTime() < today.getTime()) {
    parsed.setFullYear(parsed.getFullYear() + 1)
  }

  return toIsoDate(parsed)
}

function resolveInspectionDate(plate: string, currentDate?: string): string | undefined {
  const mappedDate = inspectionScheduleByPlate[normalizePlate(plate)]
  const sourceDate = mappedDate || currentDate
  return getRolledAnnualDate(sourceDate)
}

function resolvePolicyDate(plate: string, currentDate?: string): string | undefined {
  const mappedDate = transferPolicyDateByPlate[normalizePlate(plate)]
  if (mappedDate) {
    const parsed = new Date(mappedDate)
    if (Number.isNaN(parsed.getTime())) return getRolledAnnualDate(currentDate)

    // Devir günü poliçe başlangıcı kabul edilir; bitiş tarihi 1 yıl sonrası olmalıdır.
    parsed.setFullYear(parsed.getFullYear() + 1)
    return getRolledAnnualDate(toIsoDate(parsed))
  }

  return getRolledAnnualDate(currentDate)
}

type ActiveTab = "overview" | "trucks" | "tires" | "maintenance_docs" | "analytics" | "fixed_expenses" | "trailers" | "fleet_logs"

/* ------------------------------------------------------------------ */
/* Kurumsal Ön Yüz                                                    */
/* ------------------------------------------------------------------ */
function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900">
        <Truck className="size-8 text-brand" aria-hidden="true" />
      </span>
      <div className="space-y-4">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
          Ağır Yük Taşımacılığında Güvenilir Çözüm Ortağınız
        </h1>
        <p className="text-pretty text-lg leading-relaxed text-slate-400">
          3-4 tırlık filomuzla yurt içi ağır yük ogv proje taşımacılığı hizmeti sunuyoruz.
          Operasyon, finans ogv sefer takibi tek panelde yönetilir.
        </p>
      </div>
      <a
        href="/admin/"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
      >
        <LayoutDashboard className="size-4" aria-hidden="true" />
        Yönetim Paneline Giriş
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* Giriş Formu                                                        */
/* ------------------------------------------------------------------ */
function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isSupabaseConfigured) {
      setError("Supabase yapılandırması eksik. Lütfen ortam değişkenlerini tanımlayın.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-xl border border-slate-800 bg-slate-900">
            <Lock className="size-5 text-brand" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Yönetim Paneli</h1>
            <p className="mt-1 text-sm text-slate-500">Devam etmek için giriş yapın</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-slate-400">E-posta</label>
            <input id="email" type="email" required={isSupabaseConfigured} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@firma.com" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-brand" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-slate-400">Şifre</label>
            <input id="password" type="password" required={isSupabaseConfigured} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-brand" />
          </div>
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:opacity-90 disabled:opacity-60">
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* Admin Panel Düzeni (Layout)                                         */
/* ------------------------------------------------------------------ */
function DashboardLayout({ onSignOut }: { onSignOut: () => void }) {
  const { usingDemoData, loading, trucks, setTrucks, trips, filteredTrips, customers, fixedExpenses, trailers, fleetLogs, setTrips } = useApp()
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview")

  // Modalların Açık/Kapalı Kontrol Stateleri
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false)
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isFleetLogModalOpen, setIsFleetLogModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [expenseMonthsRange, setExpenseMonthsRange] = useState(1)
  const [expenseTruckId, setExpenseTruckId] = useState("ALL")

  // Lastik Modalı Kontrol Stateleri
  const [isTireModalOpen, setIsTireModalOpen] = useState(false)
  const [selectedTireTruckId, setSelectedTireTruckId] = useState("")
  const [selectedTirePositionId, setSelectedTirePositionId] = useState(1)
  const [selectedTirePositionLabel, setSelectedTirePositionLabel] = useState("")
  
  const [editingTruckId, setEditingTruckId] = useState<string | null>(null)
  const [tempLocation, setTempLocation] = useState("")

  const inactiveAssetSet = useMemo(() => buildInactiveAssetSet(fleetLogs), [fleetLogs])
  const activeTrucks = useMemo(
    () => trucks.filter((truck) => !inactiveAssetSet.has(normalizeAssetName(truck.plate))),
    [trucks, inactiveAssetSet],
  )
  const activeTrailers = useMemo(
    () => trailers.filter((trailer) => !inactiveAssetSet.has(normalizeAssetName(trailer.plate))),
    [trailers, inactiveAssetSet],
  )

  const selectedExpenseTruckPlate = useMemo(() => {
    if (expenseTruckId === "ALL") return undefined
    const truck = trucks.find((item) => item.id === expenseTruckId)
    return truck?.plate
  }, [expenseTruckId, trucks])

  const filteredExpenseRecords = useMemo(() => {
    const start = monthsAgo(expenseMonthsRange).getTime()

    return fixedExpenses
      .map((exp) => {
        const parsed = parseStoredExpenseName(exp.expense_name)
        return {
          ...exp,
          parsed,
        }
      })
      .filter((exp) => {
        const expenseDateMs = new Date(exp.expense_date).getTime()
        if (Number.isFinite(expenseDateMs) && expenseDateMs < start) return false
        return expenseMatchesTruck(exp.parsed.truckPlate, selectedExpenseTruckPlate, exp.parsed.displayName)
      })
  }, [fixedExpenses, expenseMonthsRange, selectedExpenseTruckPlate])

  const fixedExpenseItems = filteredExpenseRecords.filter((exp) => !exp.parsed.isVariable)
  const variableExpenseItems = filteredExpenseRecords.filter((exp) => exp.parsed.isVariable)

  const totalFixedExpenses = fixedExpenseItems.reduce((sum, e) => sum + e.amount, 0)
  const totalVariableExpenses = variableExpenseItems.reduce((sum, e) => sum + e.amount, 0)

  // Giderler sekmesinin kendi tarih + araç filtresine göre hesaplanan sefer kârı
  const expenseFilteredTrips = useMemo(() => {
    const start = monthsAgo(expenseMonthsRange).getTime()
    return trips.filter((trip) => {
      const tripMs = new Date(trip.start_date).getTime()
      if (tripMs < start) return false
      if (expenseTruckId !== "ALL" && trip.truck_id !== expenseTruckId) return false
      return true
    })
  }, [trips, expenseMonthsRange, expenseTruckId])

  const logActionText: Record<string, string> = {
    ALINDI: "Alındı",
    SATILDI: "Satıldı",
    DEVIR_ALINDI: "Devir Alındı",
  }

  const logActionBadgeClass: Record<string, string> = {
    ALINDI: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    SATILDI: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    DEVIR_ALINDI: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  }

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const syncInspectionDates = async () => {
      for (const truck of trucks) {
        const nextInspection = resolveInspectionDate(truck.plate, truck.next_tuvturk_date)
        const nextPolicy = resolvePolicyDate(truck.plate, truck.insurance_expiry_date)

        const truckUpdate: { next_tuvturk_date?: string; insurance_expiry_date?: string } = {}
        if (nextInspection && nextInspection !== truck.next_tuvturk_date) {
          truckUpdate.next_tuvturk_date = nextInspection
        }
        if (nextPolicy && nextPolicy !== truck.insurance_expiry_date) {
          truckUpdate.insurance_expiry_date = nextPolicy
        }
        if (Object.keys(truckUpdate).length === 0) continue

        const { error } = await supabase
          .from("trucks")
          .update(truckUpdate)
          .eq("id", truck.id)

        if (error) {
          // eslint-disable-next-line no-console
          console.warn("[TMS] Truck tarihleri güncellenemedi:", error.message)
        }
      }

      for (const trailer of trailers) {
        const nextInspection = resolveInspectionDate(trailer.plate, trailer.next_tuvturk_date)
        if (nextInspection && nextInspection !== trailer.next_tuvturk_date) {
          const { error } = await supabase
            .from("trailers")
            .update({ next_tuvturk_date: nextInspection })
            .eq("id", trailer.id)

          if (error) {
            // eslint-disable-next-line no-console
            console.warn("[TMS] Trailer muayene tarihi güncellenemedi:", error.message)
          }
        }

        const nextPolicy = resolvePolicyDate(trailer.plate)
        if (nextPolicy) {
          const { error } = await supabase
            .from("trailers")
            .update({ insurance_expiry_date: nextPolicy })
            .eq("id", trailer.id)

          if (error && error.code !== "42703") {
            // eslint-disable-next-line no-console
            console.warn("[TMS] Trailer sigorta/kasko tarihi güncellenemedi:", error.message)
          }
        }
      }
    }

    void syncInspectionDates()
  }, [trucks, trailers])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ON_ROAD": return <PlayCircle className="size-4 text-sky-400" />
      case "MAINTENANCE": return <Wrench className="size-4 text-red-400" />
      case "WAITING_LOAD": return <Coffee className="size-4 text-amber-400" />
      default: return <MapPin className="size-4 text-slate-400" />
    }
  }

  // 🚀 HEM VERİTABANINI HEM EKRANI ANINDA DEĞİŞTİREN GÜNCEL handleStatusUpdate
  // Not: artık trucks dizisini doğrudan mutasyona uğratmıyoruz, setTrucks ile yeni referans üretiyoruz.
  const handleStatusUpdate = async (truckId: string, newStatus: string) => {
    try {
      let autoLocation: string | null = null
      if (newStatus === "WAITING_LOAD") autoLocation = "Garaj"
      if (newStatus === "MAINTENANCE") autoLocation = "Sanayi"

      const updateData: any = { status: newStatus }
      if (autoLocation) {
        updateData.last_known_location = autoLocation
      }

      // 1. Veritabanını sessizce arkada güncelliyoruz
      const { error } = await supabase
        .from("trucks")
        .update(updateData)
        .eq("id", truckId)

      if (error) throw error

      // 2. Local state'i immutable şekilde güncelleyip render tetikliyoruz
      setTrucks(prev =>
        prev.map(t => (t.id === truckId ? { ...t, ...updateData } : t))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Durum değiştirilirken hata oluştu.")
    }
  }

  const handleLocationSave = async (truckId: string) => {
    try {
      const { error } = await supabase.from("trucks").update({ last_known_location: tempLocation }).eq("id", truckId)
      if (error) throw error
      setTrucks(prev =>
        prev.map(t => (t.id === truckId ? { ...t, last_known_location: tempLocation } : t))
      )
      setEditingTruckId(null)
    } catch (err) {
      if (usingDemoData) alert("Demo modunda veriler kalıcı olarak değiştirilemez.")
    }
  }

  const handleResetOilMileage = async (truckId: string, currentMileage: number) => {
    const confirmReset = window.confirm("Bu aracın motor yağı bakımının yapıldığını onaylıyor musunuz? Takip sayacı sıfırlanacaktır.")
    if (!confirmReset) return

    try {
      const { error } = await supabase
        .from("trucks")
        .update({ oil_change_mileage: currentMileage })
        .eq("id", truckId)
      
      if (error) throw error
      alert("Motor yağı bakım kaydı başarıyla işlendi ve sayaç güncellendi.")

      setTrucks(prev =>
        prev.map(t => (t.id === truckId ? { ...t, oil_change_mileage: currentMileage } : t))
      )
    } catch (err) {
      alert("Bakım kaydı işlenirken bir hata oluştu.")
    }
  }

  const handleTripStatusUpdate = async (tripId: string, status: TripStatus) => {
    try {
      const { error } = await supabase.from("trips").update({ status }).eq("id", tripId)
      if (error) throw error

      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, status } : trip)))
    } catch (err) {
      if (usingDemoData) alert("Demo modunda veriler kalıcı olarak değiştirilemez.")
      alert(err instanceof Error ? err.message : "Sefer durumu güncellenirken hata oluştu.")
    }
  }

  const handleInvoiceStatusChange = async (tripId: string, invoiceStatus: InvoiceStatus) => {
    try {
      const { error } = await supabase.from("trips").update({ invoice_status: invoiceStatus }).eq("id", tripId)
      if (error) throw error

      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, invoice_status: invoiceStatus } : trip)))
    } catch (err) {
      if (usingDemoData) alert("Demo modunda veriler kalıcı olarak değiştirilemez.")
      alert(err instanceof Error ? err.message : "Fatura durumu güncellenirken hata oluştu.")
    }
  }

  const handlePaymentStatusChange = async (tripId: string, paymentStatus: PaymentStatus) => {
    try {
      const { error } = await supabase.from("trips").update({ payment_status: paymentStatus }).eq("id", tripId)
      if (error) throw error

      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, payment_status: paymentStatus } : trip)))
    } catch (err) {
      if (usingDemoData) alert("Demo modunda veriler kalıcı olarak değiştirilemez.")
      alert(err instanceof Error ? err.message : "Tahsilat durumu güncellenirken hata oluştu.")
    }
  }

  const handleTripSave = async (tripId: string, payload: Partial<Trip>) => {
    try {
      const { error } = await supabase.from("trips").update(payload).eq("id", tripId)
      if (error) throw error

      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, ...payload } : trip)))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Sefer güncellenirken hata oluştu.")
    }
  }

  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return 365
    const diff = new Date(dateStr).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const alerts: string[] = []
  activeTrucks.forEach((t) => {
    const tuv = getDaysRemaining(resolveInspectionDate(t.plate, t.next_tuvturk_date) || "2027-02-15")
    if (tuv < 30) alerts.push(`${t.plate} plakalı aracın TÜVTÜRK muayenesine son ${tuv} gün kaldı!`)
    
    if (t.oil_change_mileage && t.oil_change_mileage > 0) {
      const interval = t.oil_change_interval || 40000
      const oilRemaining = (t.oil_change_mileage + interval) - t.current_mileage
      if (oilRemaining < 3000) {
        alerts.push(`${t.plate} aracının motor yağı değişimine son ${oilRemaining.toLocaleString("tr-TR")} KM kaldı.`)
      }
    }
  })

  activeTrailers.forEach((tr) => {
    const trailerInspectionDate = resolveInspectionDate(tr.plate, tr.next_tuvturk_date)
    if (trailerInspectionDate) {
      const trTuv = getDaysRemaining(trailerInspectionDate)
      if (trTuv < 30) alerts.push(`${tr.plate} plakalı dorsenin muayenesine son ${trTuv} gün kaldı!`)
    }
  })

  // 🎯 GÖVDEDEN SİLİNEN openTireConfig FONKSİYONU YENİDEN EKLENDİ!
  const openTireConfig = (truckId: string, posId: number, label: string) => {
    setSelectedTireTruckId(truckId)
    setSelectedTirePositionId(posId)
    setSelectedTirePositionLabel(label)
    setIsTireModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-brand">
              <Truck className="size-4.5 text-brand-foreground" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-100">Nakliye TMS</p>
              <p className="text-xs text-slate-500">Operasyon & Finans Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
              <Plus className="size-4" /> Yeni Sefer Başlat
            </button>
            <button type="button" onClick={() => setIsExpenseModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-600">
              <Plus className="size-4" /> Yeni Gider Ekle
            </button>
            <button type="button" onClick={onSignOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:text-white">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        
        {alerts.length > 0 && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="size-4" /> Kritik Operasyonel Uyarısı
            </div>
            <ul className="text-sm text-red-300/90 list-disc list-inside space-y-1">
              {alerts.map((alert, i) => <li key={i}>{alert}</li>)}
            </ul>
          </div>
        )}

        {/* 🚛 HIZLI FİLO & CARİ EKLEME PANELİ BANDI */}
        <div className="flex flex-wrap gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <button onClick={() => setIsTruckModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition">
            <Plus className="size-4 text-red-500" /> Yeni Çekici (Tır) Tanımla
          </button>
          <button onClick={() => setIsTrailerModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition">
            <Plus className="size-4 text-red-500" /> Yeni Dorse (Treyler) Tanımla
          </button>
          <button onClick={() => setIsCustomerModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition">
            <Plus className="size-4 text-red-500" /> Yeni Cari Firma (Müşteri) Ekle
          </button>
          <button onClick={() => setIsFleetLogModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition">
            <ClipboardList className="size-4 text-sky-400" /> Log Kaydı Ekle
          </button>
        </div>

        {/* Navigasyon Çubuğu */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
          <button onClick={() => setActiveTab("overview")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "overview" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Genel Bakış Finans</button>
          <button onClick={() => setActiveTab("trucks")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "trucks" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Şoför & Konum</button>
          <button onClick={() => setActiveTab("tires")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "tires" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Lastik Yönetimi</button>
          <button onClick={() => setActiveTab("maintenance_docs")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "maintenance_docs" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Evrak & Motor Bakım</button>
          <button onClick={() => setActiveTab("trailers")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "trailers" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Dorse Filosu</button>
          <button onClick={() => setActiveTab("analytics")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "analytics" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Performans Analitiği</button>
          <button onClick={() => setActiveTab("fixed_expenses")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "fixed_expenses" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Giderler</button>
          <button onClick={() => setActiveTab("fleet_logs")} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === "fleet_logs" ? "border-brand text-slate-100" : "border-transparent text-slate-500"}`}>Alım / Satım Logları</button>
        </div>

        {usingDemoData && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300">
            Demo veri modu aktif. Real veriler için Supabase ortam değişkenlerini tanımlayın.
          </div>
        )}

        {!loading && (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                <FilterPanel />
                <OverviewCards />
                <TripTable
                  onStatusChange={handleTripStatusUpdate}
                  onInvoiceChange={handleInvoiceStatusChange}
                  onPaymentChange={handlePaymentStatusChange}
                  onEditTrip={setEditingTrip}
                />
              </div>
            )}

            {activeTab === "trucks" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeTrucks.map((truck) => (
                    <div key={truck.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur flex flex-col justify-between gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-base font-mono font-bold text-slate-100">{truck.plate}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{truck.brand_model}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {truck.current_mileage.toLocaleString("tr-TR")} km
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-950/50 p-3 border border-slate-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {getStatusIcon(truck.status)}
                            <div className="text-xs">
                              <p className="text-slate-400 font-medium">Son Konum</p>
                              {editingTruckId === truck.id ? (
                                <input type="text" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)} className="mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-red-500" placeholder="Konum..." autoFocus />
                              ) : (
                                <p className="text-slate-200 mt-0.5 font-semibold">{truck.last_known_location || "Garaj"}</p>
                              )}
                            </div>
                          </div>
                          {editingTruckId === truck.id ? (
                            <button onClick={() => handleLocationSave(truck.id)} className="text-[10px] bg-emerald-700 text-white px-2 py-1 rounded font-medium">Kaydet</button>
                          ) : (
                            <button onClick={() => { setEditingTruckId(truck.id); setTempLocation(truck.last_known_location || "") }} className="text-[10px] text-slate-500 underline font-medium">Değiştir</button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 border-t border-slate-800/60 relative z-30">
                        <button 
                          type="button"
                          onClick={() => handleResetOilMileage(truck.id, truck.current_mileage)}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-950/30 cursor-pointer active:scale-95 transition"
                        >
                          <Droplet className="size-3.5" /> Motor Yağı Değişti (KM Sıfırla)
                        </button>
                        
                        <div className="grid grid-cols-3 gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleStatusUpdate(truck.id, "ON_ROAD")} 
                            className={`text-[10px] font-medium py-1.5 rounded border cursor-pointer active:scale-95 transition-all ${
                              truck.status === "ON_ROAD" 
                                ? "bg-sky-500/25 text-sky-400 border-sky-400 shadow-lg font-bold" 
                                : "bg-sky-950/20 text-sky-500 border-sky-900/40 hover:border-sky-700"
                            }`}
                          >
                            Yolda
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleStatusUpdate(truck.id, "WAITING_LOAD")} 
                            className={`text-[10px] font-medium py-1.5 rounded border cursor-pointer active:scale-95 transition-all ${
                              truck.status === "WAITING_LOAD" || truck.status === "IDLE"
                                ? "bg-amber-500/25 text-amber-400 border-amber-400 shadow-lg font-bold" 
                                : "bg-amber-950/20 text-amber-500 border-amber-900/40 hover:border-amber-700"
                            }`}
                          >
                            Garajda
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleStatusUpdate(truck.id, "MAINTENANCE")} 
                            className={`text-[10px] font-medium py-1.5 rounded border cursor-pointer active:scale-95 transition-all ${
                              truck.status === "MAINTENANCE" 
                                ? "bg-red-500/25 text-red-400 border-red-400 shadow-lg font-bold" 
                                : "bg-red-950/20 text-red-500 border-red-900/40 hover:border-red-700"
                            }`}
                          >
                            Sanayide
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "tires" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {activeTrucks.map((truck) => (
                    <div key={truck.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
                      <div className="border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-mono font-bold text-slate-200">{truck.plate} — Lastik Şeması (Düzenlemek İçin Tıklayın)</h3>
                      </div>
                      <div className="flex flex-col items-center gap-4 py-4 bg-slate-950/40 rounded-xl border border-slate-800/50">
                        {/* Ön Aks */}
                        <div className="flex justify-between w-40">
                          <button onClick={() => openTireConfig(truck.id, 1, "Ön Sol Lastik")} className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-700 hover:border-red-500 transition"><Disc className="size-5 text-emerald-400" /> 1. Ön Sol</button>
                          <button onClick={() => openTireConfig(truck.id, 2, "Ön Sağ Lastik")} className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-700 hover:border-red-500 transition">2. Ön Sağ <Disc className="size-5 text-emerald-400" /></button>
                        </div>
                        <div className="w-0.5 h-6 bg-slate-800"></div>
                        {/* Çeker Aks */}
                        <div className="flex justify-between w-52">
                          <div className="flex gap-1">
                            <button onClick={() => openTireConfig(truck.id, 3, "Çeker Sol Dış")} className="bg-slate-900 border border-slate-700 hover:border-red-500 p-1 rounded transition" title="Çeker Sol Dış"><Disc className="size-5 text-emerald-400" /></button>
                            <button onClick={() => openTireConfig(truck.id, 4, "Çeker Sol İç")} className="bg-slate-900 border border-slate-700 hover:border-red-500 p-1 rounded transition" title="Çeker Sol İç"><Disc className="size-5 text-emerald-400" /></button>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openTireConfig(truck.id, 5, "Çeker Sağ İç")} className="bg-slate-900 border border-slate-700 hover:border-red-500 p-1 rounded transition" title="Çeker Sağ İç"><Disc className="size-5 text-emerald-400" /></button>
                            <button onClick={() => openTireConfig(truck.id, 6, "Çeker Sağ Dış")} className="bg-slate-900 border border-slate-700 hover:border-red-500 p-1 rounded transition" title="Çeker Sağ Dış"><Disc className="size-5 text-emerald-400" /></button>
                          </div>
                        </div>
                        <div className="w-0.5 h-6 bg-slate-800"></div>
                        {/* Avara Aks */}
                        <div className="flex justify-between w-40">
                          <button onClick={() => openTireConfig(truck.id, 7, "Avara Arka Sol")} className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-700 hover:border-red-500 transition"><Disc className="size-5 text-slate-500" /> 7. Sol Ark</button>
                          <button onClick={() => openTireConfig(truck.id, 8, "Avara Arka Sağ")} className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-700 hover:border-red-500 transition">8. Sağ Ark <Disc className="size-5 text-slate-500" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "maintenance_docs" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTrucks.map((truck) => {
                    const truckInspectionDate = resolveInspectionDate(truck.plate, truck.next_tuvturk_date)
                    const tuvDays = getDaysRemaining(truckInspectionDate || "2027-02-15")
                    const insDays = getDaysRemaining(truck.insurance_expiry_date || "2027-05-20")
                    const oilRemaining = truck.oil_change_mileage && truck.oil_change_mileage > 0 
                      ? (truck.oil_change_mileage + (truck.oil_change_interval || 40000)) - truck.current_mileage
                      : null

                    return (
                      <div key={truck.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-base font-mono font-bold text-slate-200">{truck.plate}</span>
                          <span className="text-xs text-slate-500">{truck.brand_model}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className={`p-3 rounded-lg border ${tuvDays < 30 ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-slate-950/50 border-slate-800 text-slate-200"}`}>
                            <div className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="size-3.5" /> Muayene Vadesi</div>
                            <p className="text-sm font-bold mt-2">{tuvDays > 0 ? `${tuvDays} Gün` : "Süresi Geçti!"}</p>
                          </div>
                          <div className="p-3 rounded-lg border bg-slate-950/50 border-slate-800 text-slate-200">
                            <div className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="size-3.5" /> Sigorta / Kasko</div>
                            <p className="text-sm font-bold mt-2">{insDays} Gün</p>
                          </div>
                          <div className={`p-3 rounded-lg border ${oilRemaining !== null && oilRemaining < 5000 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-slate-950/50 border-slate-800 text-slate-200"}`}>
                            <div className="flex items-center gap-1 text-xs text-slate-400"><Wrench className="size-3.5" /> Kalan Yağ Ömrü</div>
                            <p className="text-sm font-bold mt-2">{oilRemaining !== null ? `${oilRemaining.toLocaleString("tr-TR")} KM` : "Veri Yok"}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "trailers" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Dorse Envanteri ve Kilometre/Muayene Durumları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTrailers.map((trailer: Trailer) => {
                    const trailerInspectionDate = resolveInspectionDate(trailer.plate, trailer.next_tuvturk_date)
                    const trTuvDays = trailerInspectionDate ? getDaysRemaining(trailerInspectionDate) : 365
                    return (
                      <div key={trailer.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-medium">{trailer.trailer_type}</span>
                            <p className="text-lg font-mono font-bold text-slate-100 mt-1.5">{trailer.plate}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                            trailer.status === "ON_ROAD" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {trailer.status === "ON_ROAD" ? "Seferde" : trailer.status === "MAINTENANCE" ? "Bakımda" : "Boşta"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                          <div className="bg-slate-950/40 p-2 rounded border border-slate-800">
                            <p className="text-slate-500">Toplam Ömür</p>
                            <p className="text-slate-200 font-mono font-semibold mt-0.5">{trailer.total_mileage.toLocaleString("tr-TR")} KM</p>
                          </div>
                          <div className={`p-2 rounded border ${trTuvDays < 30 ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-slate-950/40 border-slate-800 text-slate-200"}`}>
                            <p className="text-slate-500">Dorse Muayene</p>
                            <p className="font-semibold mt-0.5">{trailerInspectionDate ? (trTuvDays > 0 ? `${trTuvDays} Gün` : "Süresi Geçti!") : "Veri Yok"}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Araç Tüketim ve İhlal Grafiği</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 font-medium">
                          <th className="pb-2">Plaka</th>
                          <th className="pb-2 text-center">Ort. Yakıt (100km)</th>
                          <th className="pb-2 text-right">Toplam Ceza</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trucks.map(truck => {
                          const tTrips = filteredTrips.filter(t => t.truck_id === truck.id)
                          const tKm = tTrips.reduce((sum, t) => sum + (t.trip_distance_km || 0), 0)
                          const tLiters = tTrips.reduce((sum, t) => sum + (Number(t.fuel_liters) || 0), 0)
                          const tFines = tTrips.reduce((sum, t) => sum + (Number(t.fine_expense) || 0), 0)
                          return (
                            <tr key={truck.id} className="border-b border-slate-800/40 font-mono text-slate-300">
                              <td className="py-2.5 font-bold">{truck.plate}</td>
                              <td className="py-2.5 text-center text-sky-400 font-semibold">{tKm > 0 ? `${((tLiters / tKm) * 100).toFixed(1)} Lt` : "—"}</td>
                              <td className="py-2.5 text-right text-red-400">₺{tFines.toLocaleString("tr-TR")}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="size-4 text-emerald-400" /> Cari Karlılık Derecelendirmesi
                    </h3>
                    <div className="space-y-3">
                      {customers.map(c => {
                        const cTrips = filteredTrips.filter(t => t.customer_id === c.id)
                        const totalRev = cTrips.reduce((sum, t) => sum + t.revenue, 0)
                        const totalProfit = cTrips.reduce((sum, t) => sum + calculateTripNet(t), 0)
                        const profitMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0
                        return (
                          <div key={c.id} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-semibold text-slate-200">{c.company_name}</p>
                              <p className="text-slate-500 font-mono mt-0.5">{cTrips.length} Sefer | Toplam Ciro: ₺{totalRev.toLocaleString("tr-TR")}</p>
                            </div>
                            <span className={`px-2 py-1 rounded font-mono font-bold ${profitMargin > 45 ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                              %{profitMargin.toFixed(0)} Kâr
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fixed_expenses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Bandrol otomatik sabit, mazot otomatik değişken gider olarak kaydedilir.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                  >
                    <Plus className="size-4" /> Gider Ekle
                  </button>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">Tarih Filtresi</span>
                      <div className="flex flex-wrap gap-2">
                        {[1, 3, 6, 12].map((months) => (
                          <button
                            key={months}
                            type="button"
                            onClick={() => setExpenseMonthsRange(months)}
                            className={
                              "rounded-lg border px-3 py-2 text-xs font-medium transition " +
                              (expenseMonthsRange === months
                                ? "border-brand bg-brand text-brand-foreground"
                                : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white")
                            }
                          >
                            Son {months === 1 ? "1 Ay" : `${months} Ay`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">Araç Filtresi</label>
                      <select
                        value={expenseTruckId}
                        onChange={(e) => setExpenseTruckId(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand"
                      >
                        <option value="ALL">Tüm Araçlar ve Genel Giderler</option>
                        {activeTrucks.map((truck) => (
                          <option key={truck.id} value={truck.id}>
                            {truck.plate} — {truck.brand_model}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Brüt Sefer Kârı</span>
                    <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">₺{expenseFilteredTrips.reduce((sum: number, t: Trip) => sum + calculateTripNet(t), 0).toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sabit Giderler</span>
                    <p className="text-2xl font-bold font-mono text-red-400 mt-2">-₺{totalFixedExpenses.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Değişken Giderler</span>
                    <p className="text-2xl font-bold font-mono text-orange-400 mt-2">-₺{totalVariableExpenses.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-800 bg-emerald-950/10 p-5">
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Landmark className="size-4" /> Kasaya Kalan Net Bakiye
                    </span>
                    <p className="text-2xl font-bold font-mono text-emerald-300 mt-2">
                      ₺{(expenseFilteredTrips.reduce((sum: number, t: Trip) => sum + calculateTripNet(t), 0) - totalFixedExpenses - totalVariableExpenses).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Sabit Gider Kayıtları</h3>
                  <div className="divide-y divide-slate-800">
                    {fixedExpenseItems.length === 0 && (
                      <div className="py-3 text-xs text-slate-500">Seçilen filtrelerde sabit gider kaydı yok.</div>
                    )}
                    {fixedExpenseItems.map((exp: FixedExpense & { parsed: { displayName: string; truckPlate?: string } }) => (
                      <div key={exp.id} className="py-3 flex justify-between items-center text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-slate-300">{exp.parsed.displayName}</span>
                          <p className="text-[11px] text-slate-500">
                            {new Date(exp.expense_date).toLocaleDateString("tr-TR")} • {exp.parsed.truckPlate || "Genel"}
                          </p>
                        </div>
                        <span className="text-red-400 font-bold">₺{exp.amount.toLocaleString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Değişken Gider Kayıtları</h3>
                  <div className="divide-y divide-slate-800">
                    {variableExpenseItems.length === 0 && (
                      <div className="py-3 text-xs text-slate-500">Seçilen filtrelerde değişken gider kaydı yok.</div>
                    )}
                    {variableExpenseItems.map((exp: FixedExpense & { parsed: { displayName: string; truckPlate?: string } }) => (
                      <div key={exp.id} className="py-3 flex justify-between items-center text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-slate-300">{exp.parsed.displayName}</span>
                          <p className="text-[11px] text-slate-500">
                            {new Date(exp.expense_date).toLocaleDateString("tr-TR")} • {exp.parsed.truckPlate || "Genel"}
                          </p>
                        </div>
                        <span className="text-amber-400 font-bold">₺{exp.amount.toLocaleString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fleet_logs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Filoya alınan, satılan veya devirle eklenen varlıklarınızı tarih bazlı kaydedin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFleetLogModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
                  >
                    <Plus className="size-4" /> Log Ekle
                  </button>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Varlık Hareket Geçmişi</h3>
                  {fleetLogs.length === 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-8 text-center text-sm text-slate-500">
                      Henüz log kaydı yok. "Log Ekle" butonundan ilk kaydı oluşturabilirsiniz.
                    </div>
                  )}
                  {fleetLogs.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-medium">
                            <th className="pb-2">Tarih</th>
                            <th className="pb-2">Kayıt</th>
                            <th className="pb-2">İşlem</th>
                            <th className="pb-2">Not</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fleetLogs
                            .slice()
                            .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                            .map((log) => (
                              <tr key={log.id} className="border-b border-slate-800/40 text-slate-300">
                                <td className="py-3 font-mono">{new Date(log.event_date).toLocaleDateString("tr-TR")}</td>
                                <td className="py-3 font-semibold text-slate-100">{log.item_name}</td>
                                <td className="py-3">
                                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${logActionBadgeClass[log.action] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                                    {logActionText[log.action] || log.action}
                                  </span>
                                </td>
                                <td className="py-3 text-slate-400">{log.note || "-"}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <AddTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
      <AddTruckModal isOpen={isTruckModalOpen} onClose={() => setIsTruckModalOpen(false)} />
      <AddTrailerModal isOpen={isTrailerModalOpen} onClose={() => setIsTrailerModalOpen(false)} />
      <AddCustomerModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} />
      <EditTripModal isOpen={Boolean(editingTrip)} trip={editingTrip} onClose={() => setEditingTrip(null)} onSave={handleTripSave} />
      <AddFleetLogModal isOpen={isFleetLogModalOpen} onClose={() => setIsFleetLogModalOpen(false)} />
      
      <AddTireModal 
        isOpen={isTireModalOpen} 
        onClose={() => setIsTireModalOpen(false)} 
        truckId={selectedTireTruckId} 
        positionId={selectedTirePositionId} 
        positionLabel={selectedTirePositionLabel} 
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Kök Uygulama — Rota & Oturum Yönetimi                               */
/* ------------------------------------------------------------------ */
export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [demoAuthed, setDemoAuthed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const isAdminRoute = /^\/admin(?:\/|$)/.test(window.location.pathname)

  useEffect(() => {
    if (!isAdminRoute) { setCheckingAuth(false); return }
    if (!isSupabaseConfigured) { setCheckingAuth(false); return }
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => { setSession(data.session); setCheckingAuth(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => { setSession(newSession) })
    return () => subscription.unsubscribe()
  }, [isAdminRoute])

  const handleSignOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setDemoAuthed(false)
    setSession(null)
  }

  if (isAdminRoute && !isSupabaseConfigured) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-200">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
          <h1 className="text-base font-semibold text-amber-300">Admin Panel Yapılandırması Eksik</h1>
          <p className="mt-2 text-amber-200/90">
            Demo modu kapatıldı. Devam etmek için dağıtım ortamında <strong>VITE_SUPABASE_URL</strong> ve <strong>VITE_SUPABASE_ANON_KEY</strong>
            değişkenlerini tanımlayın.
          </p>
        </div>
      </main>
    )
  }

  if (!isAdminRoute) return <LandingPage />
  if (checkingAuth) return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-slate-500">Yükleniyor...</div>
  const isAuthed = Boolean(session) || demoAuthed
  if (!isAuthed) return <LoginForm />
  return (<AppProvider><DashboardLayout onSignOut={handleSignOut} /></AppProvider>)
}