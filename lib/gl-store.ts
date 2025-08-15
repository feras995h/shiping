"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RootAccountType = 'ASSET' | 'EXPENSE' | 'LIABILITY' | 'EQUITY' | 'REVENUE'
export type AccountNature = 'DEBIT' | 'CREDIT'

export type GlAccount = {
  id: string
  name: string
  code: string // e.g. 1.2.3
  level: number
  parentId: string | null
  rootType: RootAccountType
  nature: AccountNature
  currencyCode: string
  isSystem: boolean
  isActive: boolean
  movementsCount: number
}

export const ROOT_NATURE_BY_TYPE: Record<RootAccountType, AccountNature> = {
  ASSET: 'DEBIT',
  EXPENSE: 'DEBIT',
  LIABILITY: 'CREDIT',
  EQUITY: 'CREDIT',
  REVENUE: 'CREDIT',
}

const DEFAULT_CURRENCIES = ['LYD', 'USD', 'EUR', 'CNY']
const DEFAULT_CURRENCY = 'LYD'

function generateId(prefix = 'acc'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function getNextChildSegment(accounts: GlAccount[], parentId: string): number {
  const siblings = accounts.filter(a => a.parentId === parentId)
  let maxSeg = 0
  for (const s of siblings) {
    const parts = s.code.split('.')
    const last = parseInt(parts[parts.length - 1] || '0', 10)
    if (!Number.isNaN(last)) maxSeg = Math.max(maxSeg, last)
  }
  return maxSeg + 1
}

type GlState = {
  currencies: string[]
  accounts: GlAccount[]
  initializeChartIfEmpty: () => void
  addAccount: (args: { name: string; parentId: string; currencyCode?: string }) => GlAccount | null
  updateAccount: (id: string, updates: Partial<Pick<GlAccount, 'name' | 'code' | 'currencyCode' | 'isActive'>>) => void
  deleteAccount: (id: string) => boolean
}

export const useGlStore = create<GlState>()(persist((set, get) => ({
  currencies: DEFAULT_CURRENCIES,
  accounts: [],

  initializeChartIfEmpty: () => {
    const state = get()
    if (state.accounts.length > 0) return
    const roots: Array<{ code: string; name: string; type: RootAccountType }> = [
      { code: '1', name: 'الأصول', type: 'ASSET' },
      { code: '2', name: 'المصروفات', type: 'EXPENSE' },
      { code: '3', name: 'الالتزامات', type: 'LIABILITY' },
      { code: '4', name: 'حقوق الملكية', type: 'EQUITY' },
      { code: '5', name: 'الإيرادات', type: 'REVENUE' },
    ]
    const rootsAccounts: GlAccount[] = roots.map(r => ({
      id: generateId('root'),
      name: r.name,
      code: r.code,
      level: 1,
      parentId: null,
      rootType: r.type,
      nature: ROOT_NATURE_BY_TYPE[r.type],
      currencyCode: DEFAULT_CURRENCY,
      isSystem: true,
      isActive: true,
      movementsCount: 0,
    }))

    // خريطة للوصول السريع حسب الكود
    const byCode = new Map<string, GlAccount>()
    rootsAccounts.forEach(a => byCode.set(a.code, a))

    // تعريف البُنى المطلوبة تحت الجذور
    const toCreate: Array<{ code: string; name: string }> = [
      // الأصول
      { code: '1.1', name: 'الأصول المتداولة' },
      { code: '1.1.1', name: 'النقدية وما في حكمها' },
      { code: '1.1.1.1', name: 'الخزينة الرئيسية' },
      { code: '1.1.2', name: 'المدينون' },
      { code: '1.1.2.3', name: 'المدينون – عملاء' },
      { code: '1.1.2.1', name: 'العهد' },
      { code: '1.1.2.2', name: 'السلف' },
      { code: '1.1.3', name: 'المخزون' },
      { code: '1.1.4', name: 'مصروفات مدفوعة مقدم' },
      { code: '1.1.5', name: 'أصول متداولة أخرى' },
      { code: '1.2', name: 'الأصول الثابتة' },
      { code: '1.3', name: 'أصول أخرى' },
      { code: '1.4', name: 'أصول غير ملموسة' },
      // المصروفات
      { code: '2.1', name: 'إدارية وعمومية' },
      { code: '2.2', name: 'بيعية وتسويقية' },
      { code: '2.3', name: 'شراء' },
      { code: '2.4', name: 'مصروف الإهلاك' },
      // الالتزامات
      { code: '3.1', name: 'متداولة' },
      { code: '3.1.1', name: 'الدائنون – موظفون' },
      { code: '3.2', name: 'طويلة الأجل' },
      { code: '3.2.1', name: 'مجمع الإهلاك' },
      // حقوق الملكية
      { code: '4.1', name: 'رأس المال' },
      { code: '4.2', name: 'أرباح محتجزة' },
      { code: '4.3', name: 'احتياطيات' },
      // الإيرادات
      { code: '5.1', name: 'خدمات الشحن' },
      { code: '5.2', name: 'حوالات مالية' },
      { code: '5.3', name: 'مبيعات' },
      { code: '5.4', name: 'أخرى' },
    ]

    const accounts: GlAccount[] = [...rootsAccounts]
    for (const item of toCreate) {
      const parts = item.code.split('.')
      const parentCode = parts.slice(0, parts.length - 1).join('.')
      const parent = byCode.get(parentCode)
      if (!parent) continue
      const acc: GlAccount = {
        id: generateId('acc'),
        name: item.name,
        code: item.code,
        level: parts.length,
        parentId: parent.id,
        rootType: parent.rootType,
        nature: parent.nature,
        currencyCode: parent.currencyCode,
        isSystem: true,
        isActive: true,
        movementsCount: 0,
      }
      accounts.push(acc)
      byCode.set(item.code, acc)
    }

    set({ accounts })
  },

  addAccount: ({ name, parentId, currencyCode }): GlAccount | null => {
    const state = get()
    const parent = state.accounts.find(a => a.id === parentId)
    if (!parent) return null
    const seg = getNextChildSegment(state.accounts, parentId)
    const code = `${parent.code}.${seg}`
    const account: GlAccount = {
      id: generateId('acc'),
      name,
      code,
      level: parent.level + 1,
      parentId,
      rootType: parent.rootType,
      nature: parent.nature,
      currencyCode: currencyCode || parent.currencyCode || DEFAULT_CURRENCY,
      isSystem: false,
      isActive: true,
      movementsCount: 0,
    }
    set({ accounts: [...state.accounts, account] })
    return account
  },

  updateAccount: (id, updates) => {
    set(state => ({
      accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
    }))
  },

  deleteAccount: (id) => {
    const state = get()
    const hasChildren = state.accounts.some(a => a.parentId === id)
    if (hasChildren) return false
    const target = state.accounts.find(a => a.id === id)
    if (!target) return false
    if (target.movementsCount > 0) return false
    set({ accounts: state.accounts.filter(a => a.id !== id) })
    return true
  },
}), { name: 'gl-chart-store' }))


