"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, BookOpen, Calculator, TrendingUp, DollarSign, Users, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Layout from "@/components/layout"
import { useGlStore } from "@/lib/gl-store"

type AccountNode = {
  id: string;
  name: string;
  code: string;
  level: number;
  nature: 'DEBIT' | 'CREDIT';
  rootType: 'ASSET' | 'EXPENSE' | 'LIABILITY' | 'EQUITY' | 'REVENUE';
  currencyId: string;
  isSystem: boolean;
  children?: AccountNode[];
}

export default function ChartOfAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [accountFilter, setAccountFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const gl = useGlStore()
  const [tree, setTree] = useState<AccountNode[]>([])
  const [currencies, setCurrencies] = useState<string[]>([])
  const [newAccount, setNewAccount] = useState<{ name: string; parentId: string | null; currencyCode: string | null }>({ name: '', parentId: null, currencyCode: null })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [editTarget, setEditTarget] = useState<AccountNode | null>(null)
  const [editForm, setEditForm] = useState<{ name: string; code: string; currencyCode: string; isActive: boolean }>({ name: '', code: '', currencyCode: '', isActive: true })

  useEffect(() => {
    gl.initializeChartIfEmpty()
    setCurrencies(gl.currencies)
  }, [])

  useEffect(() => {
    // بناء الشجرة من المخزن المحلي
    const byParent: Record<string, AccountNode[]> = {}
    const nodes: AccountNode[] = gl.accounts.map(a => ({
      id: a.id,
      name: a.name,
      code: a.code,
      level: a.level,
      nature: a.nature,
      rootType: a.rootType,
      currencyId: a.currencyCode,
      isSystem: a.isSystem,
      children: [],
    }))
    for (const n of nodes) {
      const key = (gl.accounts.find(a => a.id === n.id)?.parentId) || 'root'
      if (!byParent[key]) byParent[key] = []
      byParent[key].push(n)
    }
    const roots = gl.accounts.filter(a => a.level === 1).map(a => nodes.find(n => n.code === a.code)!)
    const attach = (n: AccountNode) => {
      const children = byParent[n.id] || []
      n.children = children
      children.forEach(attach)
    }
    roots.forEach(attach)
    setTree(roots)
  }, [gl.accounts])

  // إحصائيات محسنة
  const stats = [
    {
      title: "عدد الحسابات",
      value: "34",
      change: "+2",
      icon: BookOpen,
      color: "text-gold-600",
      bgColor: "from-gold-400 to-gold-600",
      description: "حساب نشط"
    },
    {
      title: "حقوق الملكية",
      value: "735,400 د.ل",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
      description: "من الشهر الماضي"
    },
    {
      title: "إجمالي الخصوم",
      value: "196,750 د.ل",
      change: "-2.1%",
      icon: Building2,
      color: "text-red-600",
      bgColor: "from-red-400 to-red-600",
      description: "من الشهر الماضي"
    },
    {
      title: "إجمالي الأصول",
      value: "1,561,200 د.ل",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "from-green-400 to-green-600",
      description: "من الشهر الماضي"
    },
  ]

  const chartOfAccounts = [
    // الأصول المتداولة
    {
      code: "1101",
      name: "النقدية في الصندوق",
      type: "أصول متداولة",
      balance: "125,450.00",
      currency: "LYD",
      parent: "1100",
      level: 2,
    },
    {
      code: "1102",
      name: "النقدية في البنك - الحساب الجاري",
      type: "أصول متداولة",
      balance: "285,600.00",
      currency: "USD",
      parent: "1100",
      level: 2,
    },
    {
      code: "1103",
      name: "النقدية في البنك - حساب التوفير",
      type: "أصول متداولة",
      balance: "150,000.00",
      currency: "USD",
      parent: "1100",
      level: 2,
    },
    {
      code: "1201",
      name: "حسابات العملاء",
      type: "أصول متداولة",
      balance: "85,750.00",
      currency: "LYD",
      parent: "1200",
      level: 2,
    },
    {
      code: "1202",
      name: "أوراق القبض",
      type: "أصول متداولة",
      balance: "45,200.00",
      currency: "LYD",
      parent: "1200",
      level: 2,
    },
    {
      code: "1301",
      name: "المخزون - البضاعة الجاهزة",
      type: "أصول متداولة",
      balance: "320,000.00",
      currency: "LYD",
      parent: "1300",
      level: 2,
    },
    {
      code: "1302",
      name: "المخزون - البضاعة قيد التصنيع",
      type: "أصول متداولة",
      balance: "85,000.00",
      currency: "LYD",
      parent: "1300",
      level: 2,
    },
    {
      code: "1303",
      name: "المخزون - المواد الخام",
      type: "أصول متداولة",
      balance: "125,000.00",
      currency: "LYD",
      parent: "1300",
      level: 2,
    },
    // الأصول الثابتة
    {
      code: "2101",
      name: "الأراضي",
      type: "أصول ثابتة",
      balance: "500,000.00",
      currency: "LYD",
      parent: "2100",
      level: 2,
    },
    {
      code: "2102",
      name: "المباني",
      type: "أصول ثابتة",
      balance: "1,200,000.00",
      currency: "LYD",
      parent: "2100",
      level: 2,
    },
    {
      code: "2201",
      name: "السيارات",
      type: "أصول ثابتة",
      balance: "85,000.00",
      currency: "LYD",
      parent: "2200",
      level: 2,
    },
    {
      code: "2202",
      name: "المعدات المكتبية",
      type: "أصول ثابتة",
      balance: "45,000.00",
      currency: "LYD",
      parent: "2200",
      level: 2,
    },
    // الخصوم المتداولة
    {
      code: "3101",
      name: "حسابات الموردين",
      type: "خصوم متداولة",
      balance: "95,600.00",
      currency: "LYD",
      parent: "3100",
      level: 2,
    },
    {
      code: "3102",
      name: "أوراق الدفع",
      type: "خصوم متداولة",
      balance: "35,000.00",
      currency: "LYD",
      parent: "3100",
      level: 2,
    },
    {
      code: "3201",
      name: "الضرائب المستحقة",
      type: "خصوم متداولة",
      balance: "25,400.00",
      currency: "LYD",
      parent: "3200",
      level: 2,
    },
    {
      code: "3202",
      name: "الرواتب المستحقة",
      type: "خصوم متداولة",
      balance: "18,500.00",
      currency: "LYD",
      parent: "3200",
      level: 2,
    },
    // حقوق الملكية
    {
      code: "4101",
      name: "رأس المال",
      type: "حقوق الملكية",
      balance: "1,000,000.00",
      currency: "LYD",
      parent: "4100",
      level: 2,
    },
    {
      code: "4201",
      name: "الأرباح المحتجزة",
      type: "حقوق الملكية",
      balance: "235,400.00",
      currency: "LYD",
      parent: "4200",
      level: 2,
    },
    // الإيرادات
    {
      code: "5101",
      name: "إيرادات المبيعات",
      type: "إيرادات",
      balance: "2,450,000.00",
      currency: "LYD",
      parent: "5100",
      level: 2,
    },
    {
      code: "5102",
      name: "إيرادات الخدمات",
      type: "إيرادات",
      balance: "185,000.00",
      currency: "LYD",
      parent: "5100",
      level: 2,
    },
    {
      code: "5201",
      name: "إيرادات الفوائد",
      type: "إيرادات",
      balance: "12,500.00",
      currency: "LYD",
      parent: "5200",
      level: 2,
    },
    // المصروفات
    {
      code: "6101",
      name: "مصروفات البضاعة المباعة",
      type: "مصروفات",
      balance: "1,850,000.00",
      currency: "LYD",
      parent: "6100",
      level: 2,
    },
    {
      code: "6201",
      name: "مصروفات الرواتب",
      type: "مصروفات",
      balance: "285,000.00",
      currency: "LYD",
      parent: "6200",
      level: 2,
    },
    {
      code: "6202",
      name: "مصروفات الإيجار",
      type: "مصروفات",
      balance: "45,000.00",
      currency: "LYD",
      parent: "6200",
      level: 2,
    },
    {
      code: "6203",
      name: "مصروفات الكهرباء",
      type: "مصروفات",
      balance: "18,500.00",
      currency: "LYD",
      parent: "6200",
      level: 2,
    },
    {
      code: "6204",
      name: "مصروفات المياه",
      type: "مصروفات",
      balance: "8,200.00",
      currency: "LYD",
      parent: "6200",
      level: 2,
    },
    {
      code: "6205",
      name: "مصروفات الإنترنت",
      type: "مصروفات",
      balance: "3,600.00",
      currency: "LYD",
      parent: "6200",
      level: 2,
    },
    {
      code: "6301",
      name: "مصروفات النقل",
      type: "مصروفات",
      balance: "25,000.00",
      currency: "LYD",
      parent: "6300",
      level: 2,
    },
    {
      code: "6302",
      name: "مصروفات الوقود",
      type: "مصروفات",
      balance: "35,000.00",
      currency: "LYD",
      parent: "6300",
      level: 2,
    },
    {
      code: "6401",
      name: "مصروفات الصيانة",
      type: "مصروفات",
      balance: "15,000.00",
      currency: "LYD",
      parent: "6400",
      level: 2,
    },
    {
      code: "6501",
      name: "مصروفات التأمين",
      type: "مصروفات",
      balance: "12,000.00",
      currency: "LYD",
      parent: "6500",
      level: 2,
    },
    {
      code: "6601",
      name: "مصروفات الإعلان",
      type: "مصروفات",
      balance: "8,500.00",
      currency: "LYD",
      parent: "6600",
      level: 2,
    },
    {
      code: "6701",
      name: "مصروفات الضرائب",
      type: "مصروفات",
      balance: "45,000.00",
      currency: "LYD",
      parent: "6700",
      level: 2,
    },
  ]

  const flatten = (nodes: AccountNode[], acc: AccountNode[] = []) => {
    for (const n of nodes) {
      acc.push(n)
      if (n.children && n.children.length) flatten(n.children, acc)
    }
    return acc
  }

  const filteredAccounts = useMemo(() => {
    const flat = flatten(tree)
    return flat.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.includes(searchTerm)
      const matchesType = accountFilter === 'all' ||
        (accountFilter === 'أصول' && a.rootType === 'ASSET') ||
        (accountFilter === 'مصروفات' && a.rootType === 'EXPENSE') ||
        (accountFilter === 'التزامات' && a.rootType === 'LIABILITY') ||
        (accountFilter === 'حقوق الملكية' && a.rootType === 'EQUITY') ||
        (accountFilter === 'إيرادات' && a.rootType === 'REVENUE')
      const matchesLevel = levelFilter === 'all' || a.level === Number(levelFilter)
      return matchesSearch && matchesType && matchesLevel
    })
  }, [tree, searchTerm, accountFilter, levelFilter])

  const maxLevel = useMemo(() => flatten(tree).reduce((m, a) => Math.max(m, a.level), 1), [tree])

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "أصول متداولة":
        return "badge-gold"
      case "أصول ثابتة":
        return "badge-blue"
      case "خصوم متداولة":
        return "badge-red"
      case "حقوق الملكية":
        return "badge-green"
      case "إيرادات":
        return "badge-purple"
      case "مصروفات":
        return "badge-orange"
      default:
        return "badge-gold-outline"
    }
  }

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case "LYD":
        return "text-gold-600"
      case "USD":
        return "text-green-600"
      case "EUR":
        return "text-blue-600"
      default:
        return "text-slate-600"
    }
  }

  const renderTree = (nodes: AccountNode[], depth = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((n) => {
          const hasChildren = !!(n.children && n.children.length)
          const isOpen = expanded[n.id] ?? true
          return (
            <div key={n.id}>
              <div className="flex items-center gap-2">
                <button
                  className="w-6 text-slate-500"
                  onClick={() => setExpanded(s => ({ ...s, [n.id]: !isOpen }))}
                  aria-label="toggle"
                >
                  {hasChildren ? (isOpen ? '▾' : '▸') : ''}
                </button>
                <span className="font-mono text-xs text-slate-500" style={{ paddingInlineStart: depth * 8 }}>{n.code}</span>
                <span className="text-sm">{n.name}</span>
                <Badge className={n.nature === 'DEBIT' ? 'badge-green' : 'badge-red'}>{n.nature === 'DEBIT' ? 'مدين' : 'دائن'}</Badge>
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="hover:bg-gold-50" onClick={() => {
                    setEditTarget(n)
                    const acc = gl.accounts.find(a => a.id === n.id)
                    setEditForm({ name: n.name, code: n.code, currencyCode: (acc?.currencyCode || ''), isActive: acc?.isActive ?? true })
                    setIsCreateDialogOpen(false)
                  }}>
                    <Edit className="h-4 w-4 text-gold-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-red-50" onClick={() => {
                    gl.deleteAccount(n.id)
                  }}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              {hasChildren && isOpen && (
                <div className="ml-6 border-l pl-3">
                  {renderTree(n.children!, depth + 1)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">دليل الحسابات</h1>
            <p className="text-slate-600">إدارة وتنظيم الحسابات المحاسبية</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 mr-2" />
                إضافة حساب جديد
              </Button>
            </DialogTrigger>
              <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>إضافة حساب جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الحساب الجديد
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    اسم الحساب
                  </Label>
                  <Input
                    id="name"
                    placeholder="اسم الحساب"
                    className="col-span-3 input-gold"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">الحساب الأب</Label>
                  <Select value={newAccount.parentId ?? undefined} onValueChange={(v) => setNewAccount(s => ({ ...s, parentId: v }))}>
                    <SelectTrigger className="col-span-3 input-gold">
                      <SelectValue placeholder="اختر الحساب الأب" />
                    </SelectTrigger>
                    <SelectContent>
                      {flatten(tree).map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.code} — {a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currency" className="text-right">
                    العملة
                  </Label>
                  <Select value={newAccount.currencyCode ?? undefined} onValueChange={(v) => setNewAccount(s => ({ ...s, currencyCode: v }))}>
                    <SelectTrigger className="col-span-3 input-gold">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                  <Button className="btn-gold" onClick={async () => {
                    if (!newAccount.name || !newAccount.parentId) return
                    const created = gl.addAccount({ name: newAccount.name, parentId: newAccount.parentId, currencyCode: newAccount.currencyCode || undefined })
                    if (created) {
                      setIsCreateDialogOpen(false)
                      setNewAccount({ name: '', parentId: null, currencyCode: null })
                    }
                  }}>
                  إضافة الحساب
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-premium hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className={`flex items-center text-xs ${stat.color}`}>
                  {stat.change}
                </div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gold-600" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="البحث في الحسابات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 input-gold"
                />
              </div>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-full sm:w-[200px] input-gold">
                  <SelectValue placeholder="تصفية حسب الجذر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحسابات</SelectItem>
                  <SelectItem value="أصول">الأصول</SelectItem>
                  <SelectItem value="مصروفات">المصروفات</SelectItem>
                  <SelectItem value="التزامات">الالتزامات</SelectItem>
                  <SelectItem value="حقوق الملكية">حقوق الملكية</SelectItem>
                  <SelectItem value="إيرادات">الإيرادات</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-[180px] input-gold">
                  <SelectValue placeholder="تصفية حسب المستوى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المستويات</SelectItem>
                  {Array.from({ length: maxLevel }, (_, i) => i + 1).map(lv => (
                    <SelectItem key={lv} value={String(lv)}>المستوى {lv}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tree View */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold-600" />
              عرض شجري للحسابات
            </CardTitle>
            <CardDescription>إمكانية الطي والتوسيع لعناصر الشجرة</CardDescription>
          </CardHeader>
          <CardContent>
            {renderTree(tree)}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null) }}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>تعديل الحساب</DialogTitle>
              <DialogDescription>
                يمكنك تعديل الاسم والرمز والعملة والحالة. إعادة الترقيم لا تعيد بناء أكواد الأبناء في هذا النموذج المحلي.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">اسم الحساب</Label>
                <Input className="col-span-3 input-gold" value={editForm.name} onChange={(e) => setEditForm(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">رقم الحساب</Label>
                <Input className="col-span-3 input-gold" value={editForm.code} onChange={(e) => setEditForm(s => ({ ...s, code: e.target.value }))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">العملة</Label>
                <Select value={editForm.currencyCode} onValueChange={(v) => setEditForm(s => ({ ...s, currencyCode: v }))}>
                  <SelectTrigger className="col-span-3 input-gold">
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">الحالة</Label>
                <Select value={editForm.isActive ? 'active' : 'inactive'} onValueChange={(v) => setEditForm(s => ({ ...s, isActive: v === 'active' }))}>
                  <SelectTrigger className="col-span-3 input-gold">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">موقوف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditTarget(null)}>إلغاء</Button>
              <Button className="btn-gold" onClick={() => {
                if (!editTarget) return
                gl.updateAccount(editTarget.id, { name: editForm.name, code: editForm.code, currencyCode: editForm.currencyCode, isActive: editForm.isActive })
                setEditTarget(null)
              }}>حفظ التعديلات</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Accounts Table */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold-600" />
              دليل الحسابات
            </CardTitle>
            <CardDescription>
              عرض جميع الحسابات المحاسبية مع إمكانية التعديل والحذف
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="table-gold">
                <TableHeader>
                  <TableRow>
                    <TableHead>رمز الحساب</TableHead>
                    <TableHead>اسم الحساب</TableHead>
                    <TableHead>الطبيعة</TableHead>
                    <TableHead>الرصيد</TableHead>
                    <TableHead>المستوى</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono font-medium">{account.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gold-400`}></div>
                          {account.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={account.nature === 'DEBIT' ? 'badge-green' : 'badge-red'}>
                          {account.nature === 'DEBIT' ? 'مدين' : 'دائن'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">—</TableCell>
                      <TableCell>{account.level}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-gold-50">
                            <Eye className="h-4 w-4 text-gold-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-gold-50">
                            <Edit className="h-4 w-4 text-gold-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
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
      </div>
    </Layout>
  )
}
