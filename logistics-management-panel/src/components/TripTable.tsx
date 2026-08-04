import { useMemo } from "react"
import { ArrowRight, PackageOpen } from "lucide-react"
import { useApp } from "../context/AppContext"
import type { Trip, TripStatus } from "../interfaces/types"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// 💸 Tekil sefer kâr fonksiyonu cezalar ve primler düşülerek revize edildi
function netProfit(t: Trip): number {
  return (
    (t.revenue || 0) -
    (t.fuel_expense || 0) -
    (t.adblue_expense || 0) -
    (t.toll_expense || 0) -
    (t.driver_allowance || 0) -
    (t.extra_expense || 0) -
    (t.fine_expense || 0) -
    (t.driver_bonus || 0)
  )
}

const statusMeta: Record<TripStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Aktif", className: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
  COMPLETED: { label: "Tamamlandı", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  CANCELLED: { label: "İptal", className: "border-red-500/30 bg-red-500/10 text-red-300" },
}

function StatusBadge({ status }: { status: TripStatus }) {
  const meta = statusMeta[status]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}

export default function TripTable() {
  // trailers listesini context'ten çekiyoruz
  const { filteredTrips, trucks, customers, trailers } = useApp()

  const truckMap = useMemo(() => new Map(trucks.map((t) => [t.id, t])), [trucks])
  const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers])
  // Dorseleri hızlı eşleştirmek için Map oluşturuyoruz
  const trailerMap = useMemo(() => new Map(trailers.map((tr) => [tr.id, tr])), [trailers])

  const sorted = useMemo(
    () =>
      [...filteredTrips].sort(
        (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
      ),
    [filteredTrips],
  )

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">Sefer Kayıtları</h2>
        <span className="text-xs text-slate-500">{sorted.length} kayıt</span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PackageOpen className="size-8 text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">Seçilen filtrelere uygun sefer bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Araç / Takım</th>
                <th className="px-5 py-3 font-medium">Müşteri</th>
                <th className="px-5 py-3 font-medium">Güzergah</th>
                <th className="px-5 py-3 font-medium">Tarih</th>
                <th className="px-5 py-3 text-right font-medium">Net Kâr</th>
                <th className="px-5 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {sorted.map((trip) => {
                const truck = truckMap.get(trip.truck_id)
                const customer = customerMap.get(trip.customer_id)
                const trailer = trip.trailer_id ? trailerMap.get(trip.trailer_id) : null
                const net = netProfit(trip)
                return (
                  <tr key={trip.id} className="transition hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-slate-100">
                          {truck?.plate ?? "—"}
                        </span>
                        {trailer && (
                          <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                            + {trailer.plate} ({trailer.trailer_type.split(" ")[0]})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {customer?.company_name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span>{trip.loading_point}</span>
                        <ArrowRight className="size-3.5 text-slate-600" aria-hidden="true" />
                        <span>{trip.delivery_point}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-400">
                      {formatDate(trip.start_date)}
                    </td>
                    <td
                      className={
                        "whitespace-nowrap px-5 py-3.5 text-right font-medium " +
                        (net >= 0 ? "text-emerald-400" : "text-red-400")
                      }
                    >
                      {formatCurrency(net)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={trip.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}