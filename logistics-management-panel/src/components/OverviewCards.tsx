import { useMemo } from "react"
import { Banknote, Route, TrendingDown, TrendingUp, Truck } from "lucide-react"
import { useApp } from "../context/AppContext"
import { calculateRevenueWithTax, calculateTripNet } from "../lib/finance"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value)
}

export default function OverviewCards() {
  const { filteredTrips } = useApp()

  const stats = useMemo(() => {
    const totalDistance = filteredTrips.reduce((sum, t) => sum + (t.trip_distance_km || 0), 0)
    const tripCount = filteredTrips.length
    const totalRevenueExcludingVat = filteredTrips.reduce((sum, t) => sum + (t.revenue || 0), 0)
    const taxSummary = calculateRevenueWithTax(totalRevenueExcludingVat)
    
    const totalNet = filteredTrips.reduce((sum, t) => sum + calculateTripNet(t), 0)
    return {
      totalDistance,
      tripCount,
      totalRevenueExcludingVat,
      totalRevenueIncludingVat: taxSummary.revenueIncludingVat,
      totalWithholding: taxSummary.withholdingAmount,
      collectibleAmount: taxSummary.collectibleAmount,
      totalNet,
    }
  }, [filteredTrips])

  const isProfit = stats.totalNet >= 0

  const cards = [
    {
      label: "Toplam Yapılan Mesafe",
      value: `${formatNumber(stats.totalDistance)} km`,
      icon: Route,
      accent: "text-sky-400",
      ring: "bg-sky-500/10",
    },
    {
      label: "Toplam Sefer Sayısı",
      value: formatNumber(stats.tripCount),
      icon: Truck,
      accent: "text-brand",
      ring: "bg-amber-500/10",
    },
    {
      label: "Toplam Ciro (KDV Hariç)",
      value: formatCurrency(stats.totalRevenueExcludingVat),
      icon: Banknote,
      accent: "text-slate-100",
      ring: "bg-slate-500/10",
    },
    {
      label: "Toplam Ciro (KDV Dahil)",
      value: formatCurrency(stats.totalRevenueIncludingVat),
      icon: Banknote,
      accent: "text-emerald-300",
      ring: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-slate-700"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-slate-400">{card.label}</p>
            <span className={`grid size-9 place-items-center rounded-lg ${card.ring}`}>
              <card.icon className={`size-4.5 ${card.accent}`} aria-hidden="true" />
            </span>
          </div>
          <p className={`mt-4 text-2xl font-semibold tracking-tight ${card.accent}`}>{card.value}</p>
        </div>
      ))}

      {/* Net Kârlılık — yeşil/kırmızı vurgulu */}
      <div
        className={
          "rounded-xl border p-5 backdrop-blur transition " +
          (isProfit
            ? "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50"
            : "border-red-500/30 bg-red-500/10 hover:border-red-500/50")
        }
      >
        <div className="flex items-start justify-between">
          <p className="text-sm text-slate-300">Net Kârlılık</p>
          <span
            className={
              "grid size-9 place-items-center rounded-lg " +
              (isProfit ? "bg-emerald-500/20" : "bg-red-500/20")
            }
          >
            {isProfit ? (
              <TrendingUp className="size-4.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-4.5 text-red-400" aria-hidden="true" />
            )}
          </span>
        </div>
        <p
          className={
            "mt-4 text-2xl font-semibold tracking-tight " +
            (isProfit ? "text-emerald-400" : "text-red-400")
          }
        >
          {formatCurrency(stats.totalNet)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-slate-700">
        <p className="text-sm text-slate-400">Toplam Tevkifat</p>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-amber-300">{formatCurrency(stats.totalWithholding)}</p>
        <p className="mt-2 text-xs text-slate-500">Tahsil Edilebilir: {formatCurrency(stats.collectibleAmount)}</p>
      </div>
    </div>
  )
}