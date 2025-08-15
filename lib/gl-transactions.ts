"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useGlStore } from './gl-store'
import { getAccountingService } from './accounting-service'

export type JournalLine = {
  accountId: string
  debit: number
  credit: number
}

export type JournalEntry = {
  id: string
  date: string
  reference?: string
  description?: string
  currency: string
  lines: JournalLine[]
}

function generateId(prefix = 'je') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

type BalanceMap = Record<string, number> // accountId -> balance (debit positive, credit negative)

type GlTxnState = {
  entries: JournalEntry[]
  addEntry: (payload: Omit<JournalEntry, 'id'>) => { ok: true; id: string } | { ok: false; error: string }
  removeEntry: (id: string) => void
  computeBalances: () => BalanceMap
}

export const useGlTransactions = create<GlTxnState>()(persist((set, get) => ({
  entries: [],

  addEntry: (payload) => {
    // تحقق من التوازن
    const totalDebit = payload.lines.reduce((s, l) => s + (l.debit || 0), 0)
    const totalCredit = payload.lines.reduce((s, l) => s + (l.credit || 0), 0)
    if (Math.abs(totalDebit - totalCredit) > 1e-6) {
      return { ok: false, error: 'يجب أن يتساوى مجموع المدين مع مجموع الدائن' }
    }

    // حفظ القيد
    const entry: JournalEntry = { id: generateId(), ...payload }
    set(state => ({ entries: [entry, ...state.entries] }))

    // تحديث عداد الحركات على الحسابات المشاركة
    const gl = useGlStore.getState()
    const involved = new Set(payload.lines.map(l => l.accountId))
    for (const id of involved) {
      const acc = gl.accounts.find(a => a.id === id)
      // Note: movementsCount field not available in current GL store interface
    }

    return { ok: true, id: entry.id }
  },

  removeEntry: (id) => {
    // ملاحظة: لا نعيد إنقاص العداد هنا للحفاظ على الأثر التاريخي
    set(state => ({ entries: state.entries.filter(e => e.id !== id) }))
  },

  computeBalances: () => {
    const balances: BalanceMap = {}
    for (const e of get().entries) {
      for (const l of e.lines) {
        const prev = balances[l.accountId] || 0
        balances[l.accountId] = prev + (l.debit || 0) - (l.credit || 0)
      }
    }
    return balances
  },
}), { name: 'gl-transactions-store' }))


