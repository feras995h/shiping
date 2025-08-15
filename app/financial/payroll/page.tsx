"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Plus, Search } from "lucide-react"

type PayrollRow = {
  id: string
  emp: string
  dept: string
  month: string // YYYY-MM
  base: number
  allowances: number
  deductions: number
  net: number
  status: "مسودّة" | "قيد المراجعة" | "معتمد" | "مسدد"
  notes?: string
}

const mockData: PayrollRow[] = [
  { id: "P-2025-07-001", emp: "سارة محمد", dept: "الحسابات", month: "2025-07", base: 4500, allowances: 200, deductions: 300, net: 4400, status: "معتمد" },
  { id: "P-2025-07-002", emp: "خالد عمر", dept: "الشحن", month: "2025-07", base: 3800, allowances: 250, deductions: 150, net: 3900, status: "قيد المراجعة", notes: "بدل نقل" },
  { id: "P-2025-07-003", emp: "مريم صالح", dept: "الخدمات", month: "2025-07", base: 3500, allowances: 0, deductions: 0, net: 3500, status: "مسدد" },
  { id: "P-2025-06-004", emp: "أحمد عبدالسلام", dept: "التشغيل", month: "2025-06", base: 4000, allowances: 150, deductions: 100, net: 4050, status: "مسودّة" },
]

const STORAGE_KEY = "ghs_financial_payroll_v1"

// إعدادات الإقفال الشهري (اليوم 5 من الشهر التالي)
const PAYROLL_LOCK_DAY = 5

export default function PayrollPage() {
  const [q, setQ] = useState("")
  const [dept, setDept] = useState<string>("all")
  const [month, setMonth] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [sort, setSort] = useState<string>("month_desc")
  const [rows, setRows] = useState<PayrollRow[]>([])
  const [form, setForm] = useState<Partial<PayrollRow>>({
    month: new Date().toISOString().slice(0,7),
    status: "مسودّة",
    base: 0,
    allowances: 0,
    deductions: 0,
    net: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState<Date>(new Date())

  const isMonthLocked = (yyyymm: string, ref: Date = new Date()) => {
    const [y, m] = yyyymm.split("-").map(Number) as [number, number]
    // lock after day PAYROLL_LOCK_DAY of next month
    const lockDate = new Date(y, m, PAYROLL_LOCK_DAY)
    return ref >= lockDate
  }

  // init from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: PayrollRow[] = JSON.parse(saved)
        setRows(parsed)
      } else {
        setRows(mockData)
      }
    } catch {
      setRows(mockData)
    }
    // sync current time
    setNow(new Date())
  }, [])

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  }, [rows])

  const fmt = (v: number) => new Intl.NumberFormat("ar-LY", { maximumFractionDigits: 2 }).format(v)

  const departments = Array.from(new Set(rows.map(r => r.dept)))
  const months = Array.from(new Set(rows.map(r => r.month))).sort().reverse()

  const filtered = useMemo(() => {
    let list = [...rows]
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      list = list.filter(r =>
        r.id.toLowerCase().includes(s) ||
        r.emp.toLowerCase().includes(s) ||
        r.dept.toLowerCase().includes(s) ||
        (r.notes || "").toLowerCase().includes(s)
      )
    }
    if (dept !== "all") list = list.filter(r => r.dept === dept)
    if (month !== "all") list = list.filter(r => r.month === month)
    if (status !== "all") list = list.filter(r => r.status === (status as any))

    switch (sort) {
      case "month_asc": list.sort((a,b) => a.month.localeCompare(b.month)); break
      case "month_desc": list.sort((a,b) => b.month.localeCompare(a.month)); break
      case "net_desc": list.sort((a,b) => b.net - a.net); break
      case "net_asc": list.sort((a,b) => a.net - b.net); break
    }
    return list
  }, [rows, q, dept, month, status, sort])

  const totals = useMemo(() => {
    const base = filtered.reduce((s,r)=>s+r.base,0)
    const allowances = filtered.reduce((s,r)=>s+r.allowances,0)
    const deductions = filtered.reduce((s,r)=>s+r.deductions,0)
    const net = filtered.reduce((s,r)=>s+r.net,0)
    return { base, allowances, deductions, net }
  }, [filtered])

  const recalcNet = (p: Partial<PayrollRow>) => {
    const base = Number(p.base ?? 0)
    const allowances = Number(p.allowances ?? 0)
    const deductions = Number(p.deductions ?? 0)
    return base + allowances - deductions
  }

  const resetForm = () => {
    setForm({ id: undefined, emp: "", dept: "", month: new Date().toISOString().slice(0,7), base: 0, allowances: 0, deductions: 0, net: 0, status: "مسودّة", notes: "" })
    setEditingId(null)
    setError(null)
  }

  const validate = (p: Partial<PayrollRow>) => {
    if (!p.emp || !p.dept || !p.month) return "يرجى إدخال الموظف والقسم والشهر"
    if (Number(p.base) < 0 || Number(p.allowances) < 0 || Number(p.deductions) < 0) return "القيم المالية يجب أن تكون موجبة"
    if (p.month && isMonthLocked(p.month, now)) return `الشهر ${p.month} مقفل بعد اليوم ${PAYROLL_LOCK_DAY} من الشهر التالي. لا يمكن الإضافة/التعديل.`
    return null
  }

  const addOrUpdate = () => {
    const payload: PayrollRow = {
      id: editingId ?? `P-${Date.now()}`,
      emp: form.emp!.trim(),
      dept: form.dept!.trim(),
      month: form.month!,
      base: Number(form.base ?? 0),
      allowances: Number(form.allowances ?? 0),
      deductions: Number(form.deductions ?? 0),
      net: recalcNet(form),
      status: form.status as PayrollRow["status"],
      notes: form.notes?.trim() || "",
    }
    const err = validate(payload)
    if (err) { setError(err); return }
    if (editingId) {
      setRows(prev => prev.map(r => r.id === editingId ? payload : r))
    } else {
      setRows(prev => [payload, ...prev])
    }
    resetForm()
  }

  const editRow = (id: string) => {
    const r = rows.find(x => x.id === id)
    if (!r) return
    if (isMonthLocked(r.month, now)) { setError(`الشهر ${r.month} مقفل ولا يمكن تعديله.`); return }
    setEditingId(id)
    setForm({ ...r })
  }

  const removeRow = (id: string) => {
    const r = rows.find(x => x.id === id)
    if (r && isMonthLocked(r.month, now)) { setError(`الشهر ${r.month} مقفل ولا يمكن حذف سجلاته.`); return }
    setRows(prev => prev.filter(r => r.id !== id))
    if (editingId === id) resetForm()
  }

  const transitionStatus = (id: string) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r
      if (isMonthLocked(r.month, now)) { setError(`الشهر ${r.month} مقفل ولا يمكن تغيير الحالة.`); return r }
      const order: PayrollRow["status"][] = ["مسودّة", "قيد المراجعة", "معتمد", "مسدد"]
      const idx = order.indexOf(r.status)
      return { ...r, status: order[Math.min(order.length-1, idx+1)] }
    }))
  }

  const exportCsv = () => {
    const header = ["رقم", "الموظف", "القسم", "الشهر", "الأساسي", "البدلات", "الاستقطاعات", "الصافي", "الحالة", "ملاحظات"]
    const rows = filtered.map(r => [r.id, r.emp, r.dept, r.month, r.base, r.allowances, r.deductions, r.net, r.status, r.notes || ""])
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payroll.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold gold-text">رواتب الموظفين</h1>
          <p className="text-slate-600 text-sm">إدارة الرواتب والاستقطاعات والمكافآت (Mock)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCsv} variant="outline" className="hover:bg-gold-50">
            <Download className="h-4 w-4 ml-2" /> تصدير CSV
          </Button>
          <Button className="btn-gold">
            <Plus className="h-4 w-4 ml-2" /> إضافة مسير
          </Button>
        </div>
      </div>

      {/* Form CRUD */}
      <Card className="card-premium mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">نموذج الرواتب (إضافة/تعديل)</CardTitle>
          <CardDescription>أدخل بيانات مسير الرواتب واحفظها محلياً</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-8">
          <div>
            <Label>الموظف</Label>
            <Input value={form.emp || ""} onChange={e=>setForm(s=>({ ...s, emp: e.target.value }))} placeholder="اسم الموظف" />
          </div>
          <div>
            <Label>القسم</Label>
            <Input value={form.dept || ""} onChange={e=>setForm(s=>({ ...s, dept: e.target.value }))} placeholder="القسم" />
          </div>
          <div>
            <Label>الشهر</Label>
            <Input type="month" value={form.month || ""} onChange={e=>setForm(s=>({ ...s, month: e.target.value }))} />
          </div>
          <div>
            <Label>الأساسي</Label>
            <Input type="number" value={form.base ?? 0} onChange={e=>setForm(s=>({ ...s, base: Number(e.target.value), net: recalcNet({ ...s, base: Number(e.target.value) }) }))} />
          </div>
          <div>
            <Label>البدلات</Label>
            <Input type="number" value={form.allowances ?? 0} onChange={e=>setForm(s=>({ ...s, allowances: Number(e.target.value), net: recalcNet({ ...s, allowances: Number(e.target.value) }) }))} />
          </div>
          <div>
            <Label>الاستقطاعات</Label>
            <Input type="number" value={form.deductions ?? 0} onChange={e=>setForm(s=>({ ...s, deductions: Number(e.target.value), net: recalcNet({ ...s, deductions: Number(e.target.value) }) }))} />
          </div>
          <div>
            <Label>الصافي</Label>
            <Input readOnly value={fmt(form.net ?? recalcNet(form))} />
          </div>
          <div>
            <Label>الحالة</Label>
            <Select value={form.status || "مسودّة"} onValueChange={(v)=>setForm(s=>({ ...s, status: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="مسودّة">مسودّة</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="معتمد">معتمد</SelectItem>
                <SelectItem value="مسدد">مسدد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-4">
            <Label>ملاحظات</Label>
            <Input value={form.notes || ""} onChange={e=>setForm(s=>({ ...s, notes: e.target.value }))} placeholder="ملاحظات" />
          </div>
          {error && <div className="md:col-span-8 text-sm text-red-600">{error}</div>}
          <div className="md:col-span-8 flex gap-2">
            <Button className="btn-gold" onClick={addOrUpdate}>{editingId ? "تحديث" : "إضافة"}</Button>
            <Button variant="outline" onClick={resetForm}>تفريغ النموذج</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gold-600" />
            تصفية البيانات
          </CardTitle>
          <CardDescription>بحث وتصفية وفرز</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label htmlFor="q">بحث</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="q" value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث بالرقم/الموظف/القسم/الملاحظات" className="pr-10" />
            </div>
          </div>
          <div>
            <Label>القسم</Label>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الشهر</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الحالة</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="مسودّة">مسودّة</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="معتمد">معتمد</SelectItem>
                <SelectItem value="مسدد">مسدد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الترتيب</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month_desc">الأحدث أولاً</SelectItem>
                <SelectItem value="month_asc">الأقدم أولاً</SelectItem>
                <SelectItem value="net_desc">الصافي الأعلى</SelectItem>
                <SelectItem value="net_asc">الصافي الأدنى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-premium">
          <CardHeader><CardTitle>إجمالي الأساسي</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{fmt(totals.base)} د.ل</CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader><CardTitle>إجمالي البدلات</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{fmt(totals.allowances)} د.ل</CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader><CardTitle>إجمالي الاستقطاعات</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{fmt(totals.deductions)} د.ل</CardContent>
        </Card>
        <Card className="card-premium">
          <CardHeader><CardTitle>إجمالي الصافي</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{fmt(totals.net)} د.ل</CardContent>
        </Card>
      </div>

      <Card className="card-premium mt-6">
        <CardHeader>
          <CardTitle>مسيرات الرواتب</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم</TableHead>
                <TableHead className="text-right">الموظف</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">الشهر</TableHead>
                <TableHead className="text-right">الأساسي</TableHead>
                <TableHead className="text-right">البدلات</TableHead>
                <TableHead className="text-right">الاستقطاعات</TableHead>
                <TableHead className="text-right">الصافي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-gold-50/30">
                  <TableCell className="font-mono">{row.id}</TableCell>
                  <TableCell>{row.emp}</TableCell>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell className="font-mono">{fmt(row.base)} د.ل</TableCell>
                  <TableCell className="font-mono">{fmt(row.allowances)} د.ل</TableCell>
                  <TableCell className="font-mono">{fmt(row.deductions)} د.ل</TableCell>
                  <TableCell className="font-mono">{fmt(row.net)} د.ل</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gold-100 text-gold-900">{row.status}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate">{row.notes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>editRow(row.id)}>تعديل</Button>
                      <Button variant="outline" size="sm" onClick={()=>transitionStatus(row.id)}>تقدم الحالة</Button>
                      <Button variant="outline" size="sm" onClick={()=>removeRow(row.id)}>حذف</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 text-sm text-slate-500">
        ملاحظة: هذه الصفحة تعمل ببيانات Mock محفوظة محلياً عبر localStorage (ghs_financial_payroll_v1)، بدون وسائل دفع إلكترونية.
      </div>

      <div className="mt-4">
        <Button variant="outline" asChild>
          <Link href="/financial/dashboard">العودة للوحة المدير المالي</Link>
        </Button>
      </div>
    </div>
  )
}
