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
import { Plus, Users, Receipt, FileText, Search } from 'lucide-react'
import { useGlStore } from '@/lib/gl-store'

// نموذج بيانات بسيط للواجهة فقط
type Employee = {
  id: string
  name: string
  email?: string
  phone?: string
  position?: string
  status: 'ACTIVE' | 'INACTIVE'
}

type EmployeeLedgerRow = {
  date: string
  description: string
  debit: number
  credit: number
  balance: number
}

function generateId(prefix = 'emp') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export default function EmployeesPage() {
  const gl = useGlStore()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [query, setQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<{ name: string; email?: string; phone?: string; position?: string; status: 'ACTIVE' | 'INACTIVE' }>({ name: '', status: 'ACTIVE' })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [ledger, setLedger] = useState<EmployeeLedgerRow[]>([])

  useEffect(() => {
    gl.initializeChartIfEmpty()
  }, [])

  const filtered = useMemo(() => {
    return employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
  }, [employees, query])

  const handleCreateEmployee = () => {
    if (!form.name) return
    const emp: Employee = { id: generateId(), name: form.name, email: form.email, phone: form.phone, position: form.position, status: form.status }
    setEmployees(prev => [emp, ...prev])

    // إنشاء حسابات الموظف تلقائيًا في الدليل المحلي
    const employeesPayableParent = gl.accounts.find(a => a.code === '3.1.1')
    if (employeesPayableParent) {
      gl.addAccount({ name: `حساب الموظف: ${form.name}`, parentId: employeesPayableParent.id })
    }
    const advancesParent = gl.accounts.find(a => a.code === '1.1.2.1')
    if (advancesParent) {
      gl.addAccount({ name: `عهدة: ${form.name}`, parentId: advancesParent.id })
    }
    const loansParent = gl.accounts.find(a => a.code === '1.1.2.2')
    if (loansParent) {
      gl.addAccount({ name: `سلفة: ${form.name}`, parentId: loansParent.id })
    }

    setIsDialogOpen(false)
    setForm({ name: '', status: 'ACTIVE' })
  }

  const openLedger = (emp: Employee) => {
    setSelectedEmployee(emp)
    // بيانات محاكاة للحركات
    const rows: EmployeeLedgerRow[] = [
      { date: '2025-08-01', description: 'استحقاق راتب يوليو', debit: 0, credit: 4500, balance: -4500 },
      { date: '2025-08-05', description: 'صرف راتب يوليو', debit: 4500, credit: 0, balance: 0 },
      { date: '2025-08-10', description: 'عهدة نقدية', debit: 1000, credit: 0, balance: 1000 },
      { date: '2025-08-20', description: 'تسديد عهدة', debit: 0, credit: 600, balance: 400 },
    ]
    setLedger(rows)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">الموظفون</h1>
            <p className="text-slate-600">إدارة الموظفين وحساباتهم المالية</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 mr-2" />
                إضافة موظف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>إضافة موظف جديد</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">اسم الموظف</Label>
                  <Input className="col-span-3 input-gold" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">البريد</Label>
                  <Input className="col-span-3 input-gold" value={form.email || ''} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">الهاتف</Label>
                  <Input className="col-span-3 input-gold" value={form.phone || ''} onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">المسمى</Label>
                  <Input className="col-span-3 input-gold" value={form.position || ''} onChange={(e) => setForm(s => ({ ...s, position: e.target.value }))} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">الحالة</Label>
                  <Select value={form.status} onValueChange={(v: any) => setForm(s => ({ ...s, status: v }))}>
                    <SelectTrigger className="col-span-3 input-gold">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">نشط</SelectItem>
                      <SelectItem value="INACTIVE">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button className="btn-gold" onClick={handleCreateEmployee}>حفظ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-gold-600" /> كشف الموظفين</CardTitle>
            <CardDescription>عرض جميع الموظفين مع البحث والحركة</CardDescription>
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
                    <TableHead>البريد</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>المسمى</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.email || '—'}</TableCell>
                      <TableCell>{emp.phone || '—'}</TableCell>
                      <TableCell>{emp.position || '—'}</TableCell>
                      <TableCell>
                        <Badge className={emp.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}>
                          {emp.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openLedger(emp)}>
                            <Receipt className="h-4 w-4 ml-1" /> كشف حساب
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedEmployee && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-gold-600" /> كشف حساب الموظف — {selectedEmployee.name}</CardTitle>
              <CardDescription>الحركات المدينة والدائنة والرصيد التراكمي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="table-gold">
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>مدين</TableHead>
                      <TableHead>دائن</TableHead>
                      <TableHead>الرصيد التراكمي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell className="font-mono">{row.debit.toLocaleString()}</TableCell>
                        <TableCell className="font-mono">{row.credit.toLocaleString()}</TableCell>
                        <TableCell className="font-mono">{row.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}


