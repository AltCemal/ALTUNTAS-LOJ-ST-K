export type TruckStatus = "IDLE" | "ON_ROAD" | "WAITING_LOAD" | "MAINTENANCE"
export type TrailerStatus = "IDLE" | "ON_ROAD" | "MAINTENANCE"
export type TripStatus = "ACTIVE" | "COMPLETED" | "CANCELLED"
export type InvoiceStatus = "NOT_INVOICED" | "INVOICED"
export type PaymentStatus = "PENDING" | "COLLECTED"

export interface Truck {
  id: string
  plate: string
  brand_model: string
  status: TruckStatus
  last_known_location: string
  current_mileage: number
  updated_at: string
  next_tuvturk_date?: string
  insurance_expiry_date?: string
  oil_change_mileage?: number
  oil_change_interval?: number
  monthly_depreciation?: number
}

// 🚛 YENİ İNTERFACE: DORSE / TREYLER TANIMI
export interface Trailer {
  id: string
  plate: string
  trailer_type: string // Sal Dorse, Damperli, Tenteli, Lowbed vb.
  status: TrailerStatus
  total_mileage: number // Bağlı olduğu çekici gittikçe bu da artacak
  next_tuvturk_date?: string // Dorsenin de resmi muayenesi var
}

export interface Customer {
  id: string
  company_name: string
  contact_person: string
  phone_number: string
}

export interface FixedExpense {
  id: string
  expense_name: string
  amount: number
  expense_date: string
}

export interface Trip {
  id: string
  truck_id: string
  trailer_id?: string // 🚛 Seferde kullanılan dorse ID'si
  customer_id: string
  loading_point: string
  delivery_point: string
  cargo_type: string
  cargo_weight: number
  start_date: string
  end_date: string | null
  revenue: number
  fuel_expense: number
  adblue_expense: number
  toll_expense: number
  driver_allowance: number
  extra_expense: number
  net_profit: number
  status: TripStatus
  trip_distance_km: number
  fuel_liters: number
  fine_expense: number
  driver_bonus: number
  invoice_status: InvoiceStatus
  payment_status: PaymentStatus
}

export interface DateRange {
  start: Date
  end: Date
}

export interface TripFilter {
  truckId?: string
  dateRange: DateRange
}