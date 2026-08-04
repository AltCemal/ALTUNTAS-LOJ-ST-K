import { useMemo } from "react"
import { ArrowRight, PackageOpen } from "lucide-react"
import { useApp } from "../context/AppContext"
import type { InvoiceStatus, PaymentStatus, Trip, TripStatus } from "../interfaces/types"
import { calculateTripNet } from "../lib/finance"

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

const statusMeta: Record<TripStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Aktif", className: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
  COMPLETED: { label: "Tamamlandı", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  CANCELLED: { label: "İptal", className: "border-red-500/30 bg-red-500/10 text-red-300" },
}

const invoiceOptions: Array<{ value: InvoiceStatus; label: string }> = [
  { value: "NOT_INVOICED", label: "Faturalanmadı" },
  { value: "INVOICED", label: "Faturalandı" },
]

const paymentOptions: Array<{ value: PaymentStatus; label: string }> = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "COLLECTED", label: "Tahsil Edildi" },
]

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

type TripTableProps = {
  onStatusChange: (tripId: string, status: TripStatus) => Promise<void>
  onInvoiceChange: (tripId: string, status: InvoiceStatus) => Promise<void>
  onPaymentChange: (tripId: string, status: PaymentStatus) => Promise<void>
  onEditTrip: (trip: Trip) => void
}

export default function TripTable({ onStatusChange, onInvoiceChange, onPaymentChange, onEditTrip }: TripTableProps) {
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
                <th className="px-5 py-3 font-medium">Fatura</th>
                <th className="px-5 py-3 font-medium">Tahsilat</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {sorted.map((trip) => {
                const truck = truckMap.get(trip.truck_id)
                const customer = customerMap.get(trip.customer_id)
                const trailer = trip.trailer_id ? trailerMap.get(trip.trailer_id) : null
                const net = calculateTripNet(trip)
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
                      <select
                        value={trip.invoice_status}
                        onChange={(e) => onInvoiceChange(trip.id, e.target.value as InvoiceStatus)}
                        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                      >
                        {invoiceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={trip.payment_status}
                        onChange={(e) => onPaymentChange(trip.id, e.target.value as PaymentStatus)}
                        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                      >
                        {paymentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {trip.status === "ACTIVE" && (
                          <>
                            <button
                              type="button"
                              onClick={() => onStatusChange(trip.id, "COMPLETED")}
                              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
                            >
                              Tamamla
                            </button>
                            <button
                              type="button"
                              onClick={() => onStatusChange(trip.id, "CANCELLED")}
                              className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300"
                            >
                              İptal Et
                            </button>
                          </>
                        )}
                        {trip.status !== "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(trip.id, "ACTIVE")}
                            className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-xs text-sky-300"
                          >
                            Aktife Al
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditTrip(trip)}
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
                        >
                          Düzenle
                        </button>
                      </div>
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