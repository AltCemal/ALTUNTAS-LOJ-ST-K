import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabase"
import type { Customer, Trip, TripFilter, Truck, Trailer, FixedExpense } from "../interfaces/types"

type SupabaseLikeError = {
  code?: string
  message?: string
}

interface AppContextValue {
  trucks: Truck[]
  setTrucks: React.Dispatch<React.SetStateAction<Truck[]>> // 🚀 Yeni: App.tsx'teki yerel state değişimini context'e bağlamak için ekledik
  trips: Trip[]
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>
  customers: Customer[]
  trailers: Trailer[] 
  fixedExpenses: FixedExpense[] 
  filteredTrips: Trip[]
  filter: TripFilter
  setFilter: (filter: TripFilter) => void
  loading: boolean
  error: string | null
  usingDemoData: boolean
  refreshData: () => Promise<void> // 🚀 Yeni: Manuel tetikleme fonksiyonu açtık
}

const defaultFilter: TripFilter = {
  truckId: undefined,
  dateRange: {
    // Varsayılan: son 6 ay
    start: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() - 6)
      return d
    })(),
    end: new Date(),
  },
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [trailers, setTrailers] = useState<Trailer[]>([]) 
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]) 
  const [filter, setFilter] = useState<TripFilter>(defaultFilter)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingDemoData, setUsingDemoData] = useState(false)

  const isMissingTableError = (err: unknown) => {
    if (!err || typeof err !== "object") return false
    const code = (err as SupabaseLikeError).code
    return code === "42P01"
  }

  // 🚀 Sonsuz döngü yaratmayan izole veri çekme fonksiyonu
  async function loadData() {
    setError(null)
    if (!isSupabaseConfigured) {
      setTrucks([])
      setTrips([])
      setCustomers([])
      setTrailers([])
      setFixedExpenses([])
      setError("Supabase yapılandırması eksik. Lütfen VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini tanımlayın.")
      setUsingDemoData(false)
      setLoading(false)
      return
    }

    try {
      const [trucksRes, tripsRes, customersRes, trailersRes, expensesRes] = await Promise.all([
        supabase.from("trucks").select("*").order("plate", { ascending: true }), // 🎯 Plakaya göre sıralı çekiyoruz ki sayfa yenilenince yerleri kaymasın
        supabase.from("trips").select("*"),
        supabase.from("customers").select("*"),
        supabase.from("trailers").select("*"),
        supabase.from("fixed_expenses").select("*"),
      ])

      if (trucksRes.error) throw trucksRes.error
      if (tripsRes.error) throw tripsRes.error
      if (customersRes.error) throw customersRes.error
      if (trailersRes.error && !isMissingTableError(trailersRes.error)) throw trailersRes.error
      if (expensesRes.error && !isMissingTableError(expensesRes.error)) throw expensesRes.error

      setTrucks((trucksRes.data as Truck[]) ?? [])
      setTrips((tripsRes.data as Trip[]) ?? [])
      setCustomers((customersRes.data as Customer[]) ?? [])
      setTrailers(trailersRes.error ? [] : ((trailersRes.data as Trailer[]) ?? []))
      setFixedExpenses(expensesRes.error ? [] : ((expensesRes.data as FixedExpense[]) ?? []))
      setUsingDemoData(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Veriler yüklenirken hata oluştu.")
      setUsingDemoData(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadData()

    // 🚨 KİLİT ÇÖZÜM: Sonsuz döngüyü kıran akıllı realtime subscription paketi
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel("tms-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "trucks" }, () => {
          // Doğrudan loadData çağırmak yerine sadece tablodaki spesifik değişimleri sessizce çekiyoruz
          supabase.from("trucks").select("*").order("plate", { ascending: true }).then(({ data }: { data: Truck[] | null }) => {
            if (data) setTrucks(data as Truck[])
          })
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "trips" }, () => {
          supabase.from("trips").select("*").then(({ data }: { data: Trip[] | null }) => {
            if (data) setTrips(data as Trip[])
          })
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => {
          supabase.from("customers").select("*").then(({ data }: { data: Customer[] | null }) => {
            if (data) setCustomers(data as Customer[])
          })
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "trailers" }, () => {
          supabase.from("trailers").select("*").then(({ data }: { data: Trailer[] | null }) => {
            if (data) setTrailers(data as Trailer[])
          })
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "fixed_expenses" }, () => {
          supabase.from("fixed_expenses").select("*").then(({ data }: { data: FixedExpense[] | null }) => {
            if (data) setFixedExpenses(data as FixedExpense[])
          })
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  // Filtre uygulanmış seferler
  const filteredTrips = useMemo(() => {
    const startMs = filter.dateRange.start.getTime()
    const endMs = filter.dateRange.end.getTime()

    return trips.filter((trip) => {
      if (filter.truckId && trip.truck_id !== filter.truckId) return false
      const tripMs = new Date(trip.start_date).getTime()
      return tripMs >= startMs && tripMs <= endMs
    })
  }, [trips, filter])

  const value: AppContextValue = {
    trucks,
    setTrucks, // State manipülasyon yeteneğini dışarı verdik
    trips,
    setTrips,
    customers,
    trailers, 
    fixedExpenses, 
    filteredTrips,
    filter,
    setFilter,
    loading,
    error,
    usingDemoData,
    refreshData: loadData // Yenileme tetiğini dışa aktardık
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within an AppProvider")
  return ctx
}