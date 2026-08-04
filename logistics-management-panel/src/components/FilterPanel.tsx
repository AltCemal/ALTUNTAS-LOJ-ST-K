import { Calendar, Filter, Truck } from "lucide-react"
import { useApp } from "../context/AppContext"

function monthsAgo(months: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function FilterPanel() {
  const { trucks, filter, setFilter } = useApp()

  const setRangeMonths = (months: number) => {
    setFilter({
      ...filter,
      dateRange: { start: monthsAgo(months), end: new Date() },
    })
  }

  const monthsSpan = Math.round(
    (filter.dateRange.end.getTime() - filter.dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 30),
  )

  const rangeButtons = [
    { label: "Son 3 Ay", months: 3 },
    { label: "Son 6 Ay", months: 6 },
    { label: "Son 1 Yıl", months: 12 },
  ]

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="truck-filter"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            <Truck className="size-3.5" aria-hidden="true" />
            Araç (Plaka)
          </label>
          <div className="relative">
            <select
              id="truck-filter"
              value={filter.truckId ?? ""}
              onChange={(e) =>
                setFilter({ ...filter, truckId: e.target.value === "" ? undefined : e.target.value })
              }
              className="w-full min-w-56 appearance-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pr-9 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="">Tüm Araçlar</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.plate} — {truck.brand_model}
                </option>
              ))}
            </select>
            <Filter
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Calendar className="size-3.5" aria-hidden="true" />
            Tarih Aralığı
          </span>
          <div className="flex flex-wrap gap-2">
            {rangeButtons.map((btn) => {
              const isActive = monthsSpan === btn.months
              return (
                <button
                  key={btn.months}
                  type="button"
                  onClick={() => setRangeMonths(btn.months)}
                  className={
                    "rounded-lg border px-3.5 py-2 text-sm font-medium transition " +
                    (isActive
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white")
                  }
                >
                  {btn.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Gösterilen aralık:{" "}
        <span className="font-medium text-slate-300">{formatShort(filter.dateRange.start)}</span> —{" "}
        <span className="font-medium text-slate-300">{formatShort(filter.dateRange.end)}</span>
      </p>
    </section>
  )
}
