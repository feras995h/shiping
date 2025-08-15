"use client"

import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Building, FileText, Search } from 'lucide-react'
import { useGlStore } from '@/lib/gl-store'
import { useGlTransactions } from '@/lib/gl-transactions'

type Asset = {
  id: string
  name: string
  category: string
  cost: number
  purchaseDate: string
  depreciationRate: number // % سنوي
}

function generateId(prefix = 'asset') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export default function FixedAssetsPage() {
  const gl = useGlStore()
  const tx = useGlTransactions()
  const [assets, setAssets] = useState<Asset[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<{ name: string; category: string; cost: string; date: string; rate: string }>({ name: '', category: 'السيارات', cost: '', date: '', rate: '10' })

  useEffect(() => {
    gl.initializeChartIfEmpty()
  }, [])

  const filtered = useMemo(() => assets.filter(a => a.name.toLowerCase().includes(query.toLowerCase())), [assets, query])

  const ensureParents = () => {
    const fixedAssets = gl.accounts.find(a => a.code === '1.2') // الأصول الثابتة
    const depExpense = gl.accounts.find(a => a.code.startsWith('2.4')) // مصروف الإهلاك
    const accDep = gl.accounts.find(a => a.code.startsWith('3.2.1')) // مجمع الإهلاك
    return { fixedAssets, depExpense, accDep }
  }

  const createDepreciationEntry = (asset: Asset, amounts: { depExpense: number; accDep: number }) => {
    const parents = ensureParents()
    if (!parents.depExpense || !parents.accDep) return
    const depAcc = gl.addAccount({ name: `مصروف إهلاك: ${asset.name}`, parentId: parents.depExpense.id })
    const accDepAcc = gl.addAccount({ name: `مجمع إهلاك: ${asset.name}`, parentId: parents.accDep.id })
    if (!depAcc || !accDepAcc) return
    tx.addEntry({
      date: new Date().toISOString().slice(0,10),
      description: `إثبات إهلاك ${asset.name}`,
      currency: 'LYD',
      lines: [
        { accountId: depAcc.id, debit: amounts.depExpense, credit: 0 },
        { accountId: accDepAcc.id, debit: 0, credit: amounts.accDep },
      ]
    })
  }

  const handleCreateAsset = () => {
    if (!form.name || !form.cost || !form.date || !form.rate) return
    const asset: Asset = {
      id: generateId(),
      name: form.name,
      category: form.category,
      cost: Number(form.cost),
      purchaseDate: form.date,
      depreciationRate: Number(form.rate),
    }
    setAssets(prev => [asset, ...prev])

    // إنشاء الحسابات: أصل + (مصروف ومجمع) باستثناء الأراضي
    const { fixedAssets, depExpense, accDep } = ensureParents()
    if (fixedAssets) {
      const assetAcc = gl.addAccount({ name: `أصل: ${asset.name}`, parentId: fixedAssets.id })
      if (assetAcc && !/الأراضي|land/i.test(asset.name)) {
        const depAccParent = depExpense
        const accDepParent = accDep
        if (depAccParent && accDepParent) {
          const depAccount = gl.addAccount({ name: `مصروف إهلاك: ${asset.name}`, parentId: depAccParent.id })
          const accDepAccount = gl.addAccount({ name: `مجمع إهلاك: ${asset.name}`, parentId: accDepParent.id })
          // إثبات قيد إهلاك يومي (محاكاة: تكلفة/365 * معدل)
          const daily = Math.round((asset.cost * (asset.depreciationRate / 100)) / 365)
          if (depAccount && accDepAccount && daily > 0) {
            tx.addEntry({
              date: new Date().toISOString().slice(0,10),
              description: `إثبات إهلاك يومي ${asset.name}`,
              currency: 'LYD',
              lines: [
                { accountId: depAccount.id, debit: daily, credit: 0 },
                { accountId: accDepAccount.id, debit: 0, credit: daily },
              ]
            })
          }
        }
      }
    }

    setIsDialogOpen(false)
    setForm({ name: '', category: 'السيارات', cost: '', date: '', rate: '10' })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">الأصول الثابتة</h1>
            <p className="text-slate-600">إدارة الأصول وإنشاء الإهلاك والقيود تلقائيًا</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gold">
                <Plus className="h-4 w-4 mr-2" />
                إضافة أصل
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                <DialogTitle>إضافة أصل جديد</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">اسم الأصل</Label>
                  <Input className="col-span-3 input-gold" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
                    </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">الفئة</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(s => ({ ...s, category: v }))}>
                    <SelectTrigger className="col-span-3 input-gold">
                      <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                      <SelectItem value="السيارات">السيارات</SelectItem>
                      <SelectItem value="المباني">المباني</SelectItem>
                      <SelectItem value="الأجهزة">الأجهزة</SelectItem>
                      <SelectItem value="الأثاث">الأثاث</SelectItem>
                      <SelectItem value="الأراضي">الأراضي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">التكلفة</Label>
                  <Input type="number" className="col-span-3 input-gold" value={form.cost} onChange={(e) => setForm(s => ({ ...s, cost: e.target.value }))} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">تاريخ الشراء</Label>
                  <Input type="date" className="col-span-3 input-gold" value={form.date} onChange={(e) => setForm(s => ({ ...s, date: e.target.value }))} />
          </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">معدل الإهلاك % سنوي</Label>
                  <Input type="number" className="col-span-3 input-gold" value={form.rate} onChange={(e) => setForm(s => ({ ...s, rate: e.target.value }))} />
        </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button className="btn-gold" onClick={handleCreateAsset}>حفظ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-gold-600" /> قائمة الأصول</CardTitle>
            <CardDescription>إدارة الأصول ورؤية قيود الإهلاك</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="ابحث بالاسم..." value={query} onChange={(e) => setQuery(e.target.value)} className="pr-10 input-gold" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table className="table-gold">
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>التكلفة</TableHead>
                    <TableHead>تاريخ الشراء</TableHead>
                    <TableHead>معدل الإهلاك</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.category}</TableCell>
                      <TableCell className="font-mono">{a.cost.toLocaleString()}</TableCell>
                      <TableCell>{a.purchaseDate}</TableCell>
                      <TableCell>{a.depreciationRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
