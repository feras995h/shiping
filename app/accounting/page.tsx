"use client"

import { useState } from "react"
import { Calculator, FileText, TrendingUp, DollarSign, Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function AccountingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [accountFilter, setAccountFilter] = useState("all")
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false)

  // دليل الحسابات
  const chartOfAccounts = [
    // الأصول
    { code: "1101", name: "صندوق رئيسي (عملة محلية)", type: "أصول", balance: "125,450.00 د.ل", currency: "LYD" },
    { code: "1102", name: "صندوق دولار / يوان / عملات أجنبية", type: "أصول", balance: "$45,200.00", currency: "USD" },
    { code: "1103", name: "حسابات بنكية (محلي / دولي)", type: "أصول", balance: "$285,600.00", currency: "USD" },
    { code: "1104", name: "حسابات عملاء (أرصدة مدينة)", type: "أصول", balance: "$89,350.00", currency: "USD" },
    { code: "1105", name: "أرصدة مدفوعة مقدماً", type: "أصول", balance: "$15,800.00", currency: "USD" },

    // الخصوم
    { code: "2101", name: "حسابات الموردين (شركات الشحن)", type: "خصوم", balance: "$42,500.00", currency: "USD" },
    { code: "2102", name: "دفعات مقدمة من العملاء", type: "خصوم", balance: "$28,900.00", currency: "USD" },
    { code: "2103", name: "التزامات ضرائب ورسوم", type: "خصوم", balance: "18,750.00 د.ل", currency: "LYD" },

    // حقوق الملكية
    { code: "3101", name: "رأس المال", type: "حقوق الملكية", balance: "$500,000.00", currency: "USD" },
    { code: "3102", name: "الأرباح المحتجزة", type: "حقوق الملكية", balance: "$185,400.00", currency: "USD" },
    { code: "3103", name: "صافي الربح / الخسارة", type: "حقوق الملكية", balance: "$95,200.00", currency: "USD" },

    // الإيرادات
    { code: "4101", name: "عمولات تحويل أموال", type: "إيرادات", balance: "$125,600.00", currency: "USD" },
    { code: "4102", name: "عمولات شحن وتخليص", type: "إيرادات", balance: "$89,400.00", currency: "USD" },
    { code: "4103", name: "رسوم خدمات أخرى", type: "إيرادات", balance: "$32,800.00", currency: "USD" },

    // المصروفات
    { code: "5101", name: "مصاريف التحويل", type: "مصروفات", balance: "$18,500.00", currency: "USD" },
    { code: "5102", name: "مصاريف الشحن", type: "مصروفات", balance: "$45,200.00", currency: "USD" },
    { code: "5103", name: "مصاريف جمركية", type: "مصروفات", balance: "$12,800.00", currency: "USD" },
    { code: "5104", name: "مصاريف لوجستية", type: "مصروفات", balance: "$25,600.00", currency: "USD" },
    { code: "5105", name: "مصاريف تسويق وخدمة عملاء", type: "مصروفات", balance: "$8,900.00", currency: "USD" },
    { code: "5106", name: "مصاريف عمومية وإدارية", type: "مصروفات", balance: "$35,400.00", currency: "USD" },
  ]

  // القيود اليومية
  const journalEntries = [
    {
      id: "JE-001",
      date: "2024-01-15",
      reference: "حوالة-001",
      description: "استلام حوالة من شركة التجارة الليبية",
      entries: [
        { account: "1103", accountName: "حسابات بنكية", debit: "$5,200.00", credit: "" },
        { account: "4101", accountName: "عمولات تحويل أموال", debit: "", credit: "$200.00" },
        { account: "1104", accountName: "حسابات عملاء", debit: "", credit: "$5,000.00" },
      ],
      total: "$5,200.00",
      status: "مرحل",
    },
    {
      id: "JE-002",
      date: "2024-01-14",
      reference: "تحويل-001",
      description: "تحويل مبلغ إلى مورد في الصين",
      entries: [
        { account: "1104", accountName: "حسابات عملاء", debit: "$5,000.00", credit: "" },
        { account: "1103", accountName: "حسابات بنكية", debit: "", credit: "$5,000.00" },
      ],
      total: "$5,000.00",
      status: "مرحل",
    },
    {
      id: "JE-003",
      date: "2024-01-13",
      reference: "شحن-001",
      description: "إيراد خدمة شحن لعميل",
      entries: [
        { account: "1104", accountName: "حسابات عملاء", debit: "$1,500.00", credit: "" },
        { account: "4102", accountName: "عمولات شحن وتخليص", debit: "", credit: "$1,500.00" },
      ],
      total: "$1,500.00",
      status: "مرحل",
    },
    {
      id: "JE-004",
      date: "2024-01-12",
      reference: "مصروف-001",
      description: "دفع مصاريف شحن",
      entries: [
        { account: "5102", accountName: "مصاريف الشحن", debit: "$800.00", credit: "" },
        { account: "1103", accountName: "حسابات بنكية", debit: "", credit: "$800.00" },
      ],
      total: "$800.00",
      status: "مرحل",
    },
  ]

  const filteredAccounts = chartOfAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) || account.code.includes(searchTerm)
    const matchesType = accountFilter === "all" || account.type === accountFilter
    return matchesSearch && matchesType
  })

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "أصول":
        return "default"
      case "خصوم":
        return "destructive"
      case "حقوق الملكية":
        return "secondary"
      case "إيرادات":
        return "outline"
      case "مصروفات":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">النظام المحاسبي</h1>
            <p className="text-muted-foreground">دليل الحسابات والقيود المحاسبية</p>
          </div>
          <Dialog open={isJournalDialogOpen} onOpenChange={setIsJournalDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                قيد محاسبي جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>إنشاء قيد محاسبي جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل القيد المحاسبي</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">التاريخ</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">المرجع</Label>
                    <Input id="reference" placeholder="رقم المرجع" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="LYD">دينار ليبي</SelectItem>
                        <SelectItem value="CNY">يوان صيني</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">البيان</Label>
                  <Textarea id="description" placeholder="وصف القيد المحاسبي" />
                </div>

                {/* Journal Entry Lines */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">تفاصيل القيد</h3>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-5 gap-4 font-medium text-sm">
                      <div>رقم الحساب</div>
                      <div>اسم الحساب</div>
                      <div>مدين</div>
                      <div>دائن</div>
                      <div>إجراءات</div>
                    </div>

                    {/* Entry Line 1 */}
                    <div className="grid grid-cols-5 gap-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحساب" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts.map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="اسم الحساب" disabled />
                      <Input type="number" placeholder="0.00" />
                      <Input type="number" placeholder="0.00" />
                      <Button variant="outline" size="sm">
                        حذف
                      </Button>
                    </div>

                    {/* Entry Line 2 */}
                    <div className="grid grid-cols-5 gap-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحساب" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts.map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="اسم الحساب" disabled />
                      <Input type="number" placeholder="0.00" />
                      <Input type="number" placeholder="0.00" />
                      <Button variant="outline" size="sm">
                        حذف
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة سطر جديد
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium">إجمالي المدين: </span>
                      <span className="text-green-600">$0.00</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">إجمالي الدائن: </span>
                      <span className="text-red-600">$0.00</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">الفرق: </span>
                      <span className="text-blue-600">$0.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsJournalDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsJournalDialogOpen(false)}>حفظ القيد</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأصول</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$561,400</div>
              <p className="text-xs text-muted-foreground">+8.2% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الخصوم</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$90,150</div>
              <p className="text-xs text-muted-foreground">-2.1% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حقوق الملكية</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">$471,250</div>
              <p className="text-xs text-muted-foreground">+12.5% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التوازن المحاسبي</CardTitle>
              <Calculator className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">✓ متوازن</div>
              <p className="text-xs text-muted-foreground">الأصول = الخصوم + حقوق الملكية</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">دليل الحسابات</TabsTrigger>
            <TabsTrigger value="journal">القيود اليومية</TabsTrigger>
            <TabsTrigger value="reports">التقارير المحاسبية</TabsTrigger>
          </TabsList>

          {/* Chart of Accounts */}
          <TabsContent value="chart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>دليل الحسابات</CardTitle>
                <CardDescription>جميع الحسابات المحاسبية مصنفة حسب النوع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الحسابات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={accountFilter} onValueChange={setAccountFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="تصفية حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="أصول">الأصول</SelectItem>
                      <SelectItem value="خصوم">الخصوم</SelectItem>
                      <SelectItem value="حقوق الملكية">حقوق الملكية</SelectItem>
                      <SelectItem value="إيرادات">الإيرادات</SelectItem>
                      <SelectItem value="مصروفات">المصروفات</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية متقدمة
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الحساب</TableHead>
                      <TableHead>اسم الحساب</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الرصيد</TableHead>
                      <TableHead>العملة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.code}>
                        <TableCell className="font-medium">{account.code}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>
                          <Badge variant={getAccountTypeColor(account.type)}>{account.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{account.balance}</TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              تعديل
                            </Button>
                            <Button variant="ghost" size="sm">
                              كشف حساب
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journal Entries */}
          <TabsContent value="journal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>القيود اليومية</CardTitle>
                <CardDescription>جميع القيود المحاسبية المسجلة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="font-medium">{entry.id}</div>
                          <div className="text-sm text-muted-foreground">{entry.date}</div>
                          <div className="text-sm text-muted-foreground">المرجع: {entry.reference}</div>
                          <Badge variant="outline">{entry.status}</Badge>
                        </div>
                        <div className="font-medium text-blue-600">{entry.total}</div>
                      </div>

                      <div className="text-sm text-muted-foreground">{entry.description}</div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم الحساب</TableHead>
                            <TableHead>اسم الحساب</TableHead>
                            <TableHead>مدين</TableHead>
                            <TableHead>دائن</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entry.entries.map((line, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{line.account}</TableCell>
                              <TableCell>{line.accountName}</TableCell>
                              <TableCell className="text-green-600 font-medium">{line.debit}</TableCell>
                              <TableCell className="text-red-600 font-medium">{line.credit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounting Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Income Statement */}
              <Card>
                <CardHeader>
                  <CardTitle>قائمة الدخل</CardTitle>
                  <CardDescription>الإيرادات والمصروفات للفترة الحالية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">الإيرادات</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>عمولات تحويل أموال</span>
                        <span className="text-green-600">$125,600</span>
                      </div>
                      <div className="flex justify-between">
                        <span>عمولات شحن وتخليص</span>
                        <span className="text-green-600">$89,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span>رسوم خدمات أخرى</span>
                        <span className="text-green-600">$32,800</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>إجمالي الإيرادات</span>
                        <span className="text-green-600">$247,800</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-600">المصروفات</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>مصاريف التحويل</span>
                        <span className="text-red-600">$18,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصاريف الشحن</span>
                        <span className="text-red-600">$45,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصاريف جمركية</span>
                        <span className="text-red-600">$12,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصاريف لوجستية</span>
                        <span className="text-red-600">$25,600</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصاريف تسويق</span>
                        <span className="text-red-600">$8,900</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مصاريف عمومية وإدارية</span>
                        <span className="text-red-600">$35,400</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>إجمالي المصروفات</span>
                        <span className="text-red-600">$146,400</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>صافي الربح</span>
                      <span className="text-blue-600">$101,400</span>
                    </div>
                    <div className="text-sm text-muted-foreground">هامش الربح: 40.9%</div>
                  </div>
                </CardContent>
              </Card>

              {/* Balance Sheet */}
              <Card>
                <CardHeader>
                  <CardTitle>الميزانية العمومية</CardTitle>
                  <CardDescription>الأصول والخصوم وحقوق الملكية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-600">الأصول</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>النقدية والبنوك</span>
                        <span>$456,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span>حسابات العملاء</span>
                        <span>$89,350</span>
                      </div>
                      <div className="flex justify-between">
                        <span>أرصدة مدفوعة مقدماً</span>
                        <span>$15,800</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>إجمالي الأصول</span>
                        <span className="text-blue-600">$561,400</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-600">الخصوم</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>حسابات الموردين</span>
                        <span>$42,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>دفعات مقدمة من العملاء</span>
                        <span>$28,900</span>
                      </div>
                      <div className="flex justify-between">
                        <span>التزامات ضرائب</span>
                        <span>$18,750</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>إجمالي الخصوم</span>
                        <span className="text-red-600">$90,150</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">حقوق الملكية</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>رأس المال</span>
                        <span>$300,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الأرباح المحتجزة</span>
                        <span>$75,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span>صافي الربح الحالي</span>
                        <span>$95,400</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>إجمالي حقوق الملكية</span>
                        <span className="text-green-600">$471,250</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 bg-muted/50 p-4 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-bold text-purple-600">المعادلة المحاسبية</div>
                      <div className="text-sm">
                        <span className="text-blue-600 font-medium">الأصول ($561,400)</span>
                        <span className="mx-2">=</span>
                        <span className="text-red-600 font-medium">الخصوم ($90,150)</span>
                        <span className="mx-2">+</span>
                        <span className="text-green-600 font-medium">حقوق الملكية ($471,250)</span>
                      </div>
                      <div className="text-xs text-muted-foreground">✓ الميزانية متوازنة محاسبياً</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Reports */}
            <Card>
              <CardHeader>
                <CardTitle>تقارير سريعة</CardTitle>
                <CardDescription>إنشاء التقارير المحاسبية المختلفة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <FileText className="h-6 w-6" />
                    كشف حساب عميل
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Calculator className="h-6 w-6" />
                    تقرير عمولات التحويل
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <TrendingUp className="h-6 w-6" />
                    تقرير حركة الشحنات
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <DollarSign className="h-6 w-6" />
                    تقرير العملات المتعددة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
