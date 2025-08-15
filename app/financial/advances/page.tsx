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
import { Download, Filter, Plus, Search, Printer } from "lucide-react"

type Advance = {
  id: string
  beneficiary: string
  type: "موظف" | "مورد"
  date: string
  amount: number
  status: "مسودّة" | "قيد المراجعة" | "معتمدة" | "مسددة"
  notes?: string
}

const mockData: Advance[] = [
  { id: "A-1001", beneficiary: "أحمد علي", type: "موظف", date: "2025-08-01", amount: 5000, status: "قيد المراجعة", notes: "سلفة سفر" },
  { id: "A-1002", beneficiary: "شركة النقل السريع", type: "مورد", date: "2025-07-28", amount: 12500, status: "معتمدة" },
  { id: "A-1003", beneficiary: "محمود سالم", type: "موظف", date: "2025-07-25", amount: 3000, status: "مسددة" },
  { id: "A-1004", beneficiary: "شركة الصيانة المتحدة", type: "مورد", date: "2025-07-22", amount: 8600, status: "مسودّة" },
]

const STORAGE_KEY = "ghs_financial_advances_v1"

const ADVANCE_LIMIT = 15000 // حد أقصى للعهد لكل موظف (د.ل)

export default function AdvancesPage() {
  const [q, setQ] = useState("")
  const [type, setType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [sort, setSort] = useState<string>("date_desc")
  const [rows, setRows] = useState<Advance[]>([])
  const [form, setForm] = useState<Partial<Advance>>({ type: "موظف", status: "مسودّة", date: new Date().toISOString().slice(0,10) })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // init from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: Advance[] = JSON.parse(saved)
        setRows(parsed)
      } else {
        setRows(mockData)
      }
    } catch {
      setRows(mockData)
    }
  }, [])

  // persist to localStorage
  useEffect(() => {
    if (rows.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    else localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }, [rows])

  const fmt = (v: number) => new Intl.NumberFormat("ar-LY", { maximumFractionDigits: 2 }).format(v)

  const filtered = useMemo(() => {
    let list = [...rows]
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      list = list.filter(r =>
        r.id.toLowerCase().includes(s) ||
        r.beneficiary.toLowerCase().includes(s) ||
        (r.notes || "").toLowerCase().includes(s)
      )
    }
    if (type !== "all") list = list.filter(r => r.type === (type as any))
    if (status !== "all") list = list.filter(r => r.status === (status as any))

    switch (sort) {
      case "date_asc": list.sort((a,b) => a.date.localeCompare(b.date)); break
      case "date_desc": list.sort((a,b) => b.date.localeCompare(a.date)); break
      case "amount_asc": list.sort((a,b) => a.amount - b.amount); break
      case "amount_desc": list.sort((a,b) => b.amount - a.amount); break
    }
    return list
  }, [rows, q, type, status, sort])

  const resetForm = () => {
    setForm({ id: undefined, beneficiary: "", type: "موظف", date: new Date().toISOString().slice(0,10), amount: 0, status: "مسودّة", notes: "" })
    setEditingId(null)
    setError(null)
  }

  const validate = (data: Partial<Advance>) => {
    if (!data.beneficiary || !data.date || data.amount === undefined || data.amount === null) return "يرجى إدخال المستفيد والتاريخ والمبلغ"
    if ((data.amount as number) < 0) return "المبلغ يجب أن يكون موجباً"
    // تحقق من الحد الأقصى للعهد لكل موظف
    const totalForBeneficiary = rows
      .filter(r => r.beneficiary === data.beneficiary)
      .reduce((s, r) => s + r.amount, 0)
    const newTotal = totalForBeneficiary + Number(data.amount || 0)
    if (newTotal > ADVANCE_LIMIT) {
      return `تم تجاوز حد العهد (${fmt(ADVANCE_LIMIT)} د.ل) لهذا المستفيد. المجموع بعد الإضافة: ${fmt(newTotal)} د.ل`
    }
    return null
  }

  const addOrUpdate = () => {
    const err = validate(form)
    if (err) { setError(err); return }
    const payload: Advance = {
      id: editingId ?? `A-${Date.now()}`,
      beneficiary: form.beneficiary!.trim(),
      type: form.type as "موظف" | "مورد",
      date: form.date!,
      amount: Number(form.amount),
      status: form.status as Advance["status"],
      notes: form.notes?.trim() || "",
    }
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
    setEditingId(id)
    setForm({ ...r })
    setError(null)
  }

  const removeRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id))
    if (editingId === id) resetForm()
  }

  const transitionStatus = (id: string) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const order: Advance["status"][] = ["مسودّة", "قيد المراجعة", "معتمدة", "مسددة"]
      const idx = order.indexOf(r.status)
      return { ...r, status: order[Math.min(order.length-1, idx+1)] }
    }))
  }

  const exportCsv = () => {
    const header = ["رقم", "المستفيد", "النوع", "التاريخ", "المبلغ", "الحالة", "ملاحظات"]
    const rows = filtered.map(r => [r.id, r.beneficiary, r.type, r.date, r.amount, r.status, r.notes || ""])
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "advances.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // تصدير بسيط إلى XLSX (صيغة Excel) دون مكتبة خارجية عبر SheetJS minimal CSV-based
  const exportExcel = () => {
    // Excel يتعامل جيداً مع CSV، سنستخدم امتداد xls لفتح مباشر
    const header = ["رقم", "المستفيد", "النوع", "التاريخ", "المبلغ", "الحالة", "ملاحظات"]
    const rows = filtered.map(r => [r.id, r.beneficiary, r.type, r.date, r.amount, r.status, r.notes || ""])
    const csv = [header, ...rows].map(r => r.join("\t")).join("\n")
    const blob = new Blob([csv], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "advances.xls"
    a.click()
    URL.revokeObjectURL(url)
  }

  const printSummary = () => {
    const printContent = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8" />
          <title>ملخص العهد</title>
          <style>
            body { font-family: sans-serif; padding: 16px; }
            h1 { margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: right; }
            th { background: #f7f7f7; }
          </style>
        </head>
        <body>
          <h1>ملخص العهد (عدد السجلات: ${filtered.length})</h1>
          <table>
            <thead>
              <tr>
                <th>رقم</th><th>المستفيد</th><th>النوع</th><th>التاريخ</th><th>المبلغ</th><th>الحالة</th><th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(r => `
                <tr>
                  <td>${r.id}</td>
                  <td>${r.beneficiary}</td>
                  <td>${r.type}</td>
                  <td>${r.date}</td>
                  <td>${fmt(r.amount)} د.ل</td>
                  <td>${r.status}</td>
                  <td>${r.notes || "-"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `
    const w = window.open("", "_blank")
    if (!w) return
    w.document.open()
    w.document.write(printContent)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold gold-text">العهد المالية</h1>
          <p className="text-slate-600 text-sm">إدارة العهد المالية للموظفين والموردين (Mock)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCsv} variant="outline" className="hover:bg-gold-50">
            <Download className="h-4 w-4 ml-2" /> تصدير CSV
          </Button>
          <Button onClick={exportExcel} variant="outline" className="hover:bg-gold-50">
            <Download className="h-4 w-4 ml-2" /> تصدير Excel
          </Button>
          <Button onClick={printSummary} variant="outline" className="hover:bg-gold-50">
            <Printer className="h-4 w-4 ml-2" /> طباعة
          </Button>
          <Button className="btn-gold">
            <Plus className="h-4 w-4 ml-2" /> إضافة عهدة
          </Button>
        </div>
      </div>

      {/* Form CRUD */}
      <Card className="card-premium mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">نموذج العهد (إضافة/تعديل)</CardTitle>
          <CardDescription>أدخل بيانات العهد واحفظها محلياً</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label>المستفيد</Label>
            <Input value={form.beneficiary || ""} onChange={e=>setForm(s=>({ ...s, beneficiary: e.target.value }))} placeholder="اسم المستفيد" />
          </div>
          <div>
            <Label>النوع</Label>
            <Select value={form.type || "موظف"} onValueChange={(v)=>setForm(s=>({ ...s, type: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="موظف">موظف</SelectItem>
                <SelectItem value="مورد">مورد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>التاريخ</Label>
            <Input type="date" value={form.date || ""} onChange={e=>setForm(s=>({ ...s, date: e.target.value }))} />
          </div>
          <div>
            <Label>المبلغ</Label>
            <Input type="number" value={form.amount ?? 0} onChange={e=>setForm(s=>({ ...s, amount: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>الحالة</Label>
            <Select value={form.status || "مسودّة"} onValueChange={(v)=>setForm(s=>({ ...s, status: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="مسودّة">مسودّة</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="معتمدة">معتمدة</SelectItem>
                <SelectItem value="مسددة">مسددة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Label>ملاحظات</Label>
            <Input value={form.notes || ""} onChange={e=>setForm(s=>({ ...s, notes: e.target.value }))} placeholder="ملاحظات" />
          </div>
          {error && <div className="md:col-span-6 text-sm text-red-600">{error}</div>}
          <div className="md:col-span-6 flex gap-2">
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
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="col-span-2">
            <Label htmlFor="q">بحث</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="q" value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث بالرقم/المستفيد/الملاحظات" className="pr-10" />
            </div>
          </div>
          <div>
            <Label>النوع</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="موظف">موظف</SelectItem>
                <SelectItem value="مورد">مورد</SelectItem>
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
                <SelectItem value="معتمدة">معتمدة</SelectItem>
                <SelectItem value="مسددة">مسددة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>الترتيب</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">الأحدث أولاً</SelectItem>
                <SelectItem value="date_asc">الأقدم أولاً</SelectItem>
                <SelectItem value="amount_desc">المبلغ الأعلى</SelectItem>
                <SelectItem value="amount_asc">المبلغ الأدنى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium">
        <CardHeader>
          <CardTitle>سجل العهد</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم</TableHead>
                <TableHead className="text-right">المستفيد</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-gold-50/30">
                  <TableCell className="font-mono">{row.id}</TableCell>
                  <TableCell>{row.beneficiary}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="font-mono">{fmt(row.amount)} د.ل</TableCell>
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
        ملاحظة: هذه الصفحة تعمل ببيانات Mock محفوظة محلياً عبر localStorage (ghs_financial_advances_v1)، بدون وسائل دفع إلكترونية.
      </div>

      <div className="mt-4">
        <Button variant="outline" asChild>
          <Link href="/financial/dashboard">العودة للوحة المدير المالي</Link>
        </Button>
      </div>
    </div>
  )
}
