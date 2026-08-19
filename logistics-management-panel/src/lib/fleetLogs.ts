import type { FleetLog } from "../interfaces/types"

export function normalizeAssetName(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
}

function getLogTimestamp(log: FleetLog): number {
  const eventDateMs = new Date(log.event_date).getTime()
  const createdAtMs = log.created_at ? new Date(log.created_at).getTime() : 0
  return Number.isFinite(eventDateMs) ? eventDateMs + createdAtMs / 1e12 : 0
}

export function buildInactiveAssetSet(fleetLogs: FleetLog[]): Set<string> {
  const latestByAsset = new Map<string, FleetLog>()

  fleetLogs.forEach((log) => {
    const key = normalizeAssetName(log.item_name)
    const prev = latestByAsset.get(key)

    if (!prev || getLogTimestamp(log) >= getLogTimestamp(prev)) {
      latestByAsset.set(key, log)
    }
  })

  const inactive = new Set<string>()

  latestByAsset.forEach((log, assetKey) => {
    if (log.action === "SATILDI") inactive.add(assetKey)
  })

  return inactive
}
