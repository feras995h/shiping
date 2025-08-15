import { prisma } from './prisma'

type SettingsCache = {
  data: Record<string, string>
  loadedAt: number
}

const CACHE_TTL_MS = 60 * 1000 // 1 دقيقة
let cache: SettingsCache | null = null

async function loadAllSettings(): Promise<Record<string, string>> {
  const rows = await prisma.systemSetting.findMany()
  const map: Record<string, string> = {}
  for (const r of rows) {
    const namespacedKey = `${r.category}.${r.key}`.toUpperCase()
    map[namespacedKey] = r.value
  }
  return map
}

async function ensureCache(): Promise<void> {
  if (!cache || (Date.now() - cache.loadedAt) > CACHE_TTL_MS) {
    cache = { data: await loadAllSettings(), loadedAt: Date.now() }
  }
}

export async function getSetting(key: string, defaultValue?: string): Promise<string | undefined> {
  await ensureCache()
  return cache?.data[key.toUpperCase()] ?? defaultValue
}

export async function getNumberSetting(key: string, defaultValue: number): Promise<number> {
  const val = await getSetting(key)
  const num = val !== undefined ? Number(val) : NaN
  return Number.isFinite(num) ? num : defaultValue
}

export async function getApprovalsConfig() {
  const invoiceThreshold = await getNumberSetting('APPROVALS.invoiceThreshold', 25000)
  const paymentThreshold = await getNumberSetting('APPROVALS.paymentThreshold', 25000)
  const defaultApproverRole = await getSetting('APPROVALS.defaultApproverRole', 'FINANCE_MANAGER')
  return { invoiceThreshold, paymentThreshold, defaultApproverRole: defaultApproverRole as string }
}

export async function getAlertsConfig() {
  const lowCashAmount = await getNumberSetting('ALERTS.lowCashAmount', 10000)
  const largeTransactionAmount = await getNumberSetting('ALERTS.largeTransactionAmount', 50000)
  const overdueInvoiceDays = await getNumberSetting('ALERTS.overdueInvoiceDays', 30)
  const balanceMismatchTolerance = await getNumberSetting('ALERTS.balanceMismatchTolerance', 0.01)
  return { lowCashAmount, largeTransactionAmount, overdueInvoiceDays, balanceMismatchTolerance }
}


