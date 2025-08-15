"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, Calculator, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import Layout from "@/components/layout"

export default function CurrenciesPage() {
  const [isConverterOpen, setIsConverterOpen] = useState(false)
  const [fromAmount, setFromAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("LYD")

  // أسعار الصرف الحالية
  const exchangeRates = [
    {
      currency: "USD",
      name: "دولار أمريكي",
      symbol: "$",
      rate: 1.0,
      change: "+0.00%",
      trend: "stable",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      currency: "LYD",
      name: "دينار ليبي",
      symbol: "د.ل",
      rate: 4.85,
      change: "+0.25%",
      trend: "up",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      currency: "CNY",
      name: "يوان صيني",
      symbol: "¥",
      rate: 7.245,
      change: "-0.15%",
      trend: "down",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      currency: "EUR",
      name: "يورو",
      symbol: "€",
      rate: 0.918,
      change: "+0.08%",
      trend: "up",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      currency: "GBP",
      name: "جنيه إسترليني",
      symbol: "£",
      rate: 0.789,
      change: "-0.12%",
      trend: "down",
      lastUpdate: "2024-01-15 14:30",
    },
    {
      currency: "AED",
      name: "درهم إماراتي",
      symbol: "د.إ",
      rate: 3.673,
      change: "+0.02%",
      trend: "up",
      lastUpdate: "2024-01-15 14:30",
    },
  ]

  // معاملات العملات الأخيرة
  const recentTransactions = [
    {
      id: "CX-001",
      date: "2024-01-15",
      type: "تحويل",
      fromAmount: "$5,000.00",
      fromCurrency: "USD",
      toAmount: "24,250.00 د.ل",
      toCurrency: "LYD",
      rate: "4.8500",
      client: "شركة التجارة الليبية",
      status: "مكتمل",
    },
    {
      id: "CX-002",
      date: "2024-01-14",
      type: "شراء",
      fromAmount: "36,225.00 ¥",
      fromCurrency: "CNY",
      toAmount: "$5,000.00",
      toCurrency: "USD",
      rate: "7.2450",
      client: "مؤسسة الاستيراد الحديثة",
      status: "مكتمل",
    },
    {
      id: "CX-003",
      date: "2024-01-13",
      type: "تحويل",
      fromAmount: "$3,200.00",
      fromCurrency: "USD",
      toAmount: "15,520.00 د.ل",
      toCurrency: "LYD",
      rate: "4.8500",
      client: "شركة النقل السريع",
      status: "معلق",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (change: string) => {
    if (change.startsWith("+")) return "text-green-600"
    if (change.startsWith("-")) return "text-red-600"
    return "text-muted-foreground"
  }

  const convertCurrency = () => {
    if (!fromAmount) return "0.00"

    const amount = Number.parseFloat(fromAmount)
    const fromRate = exchangeRates.find((r) => r.currency === fromCurrency)?.rate || 1
    const toRate = exchangeRates.find((r) => r.currency === toCurrency)?.rate || 1

    // تحويل إلى USD أولاً ثم إلى العملة المطلوبة
    const usdAmount = amount / fromRate
    const convertedAmount = usdAmount * toRate

    return convertedAmount.toFixed(2)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة العملات</h1>
            <p className="text-muted-foreground">أسعار الصرف والتحويلات متعددة العملات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث الأسعار
            </Button>
            <Dialog open={isConverterOpen} onOpenChange={setIsConverterOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calculator className="h-4 w-4 ml-2" />
                  محول العملات
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>محول العملات</DialogTitle>
                  <DialogDescription>تحويل بين العملات المختلفة</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAmount">المبلغ</Label>
                    <Input
                      id="fromAmount"
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromCurrency">من</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {exchangeRates.map((rate) => (
                            <SelectItem key={rate.currency} value={rate.currency}>
                              {rate.currency} - {rate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toCurrency">إلى</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {exchangeRates.map((rate) => (
                            <SelectItem key={rate.currency} value={rate.currency}>
                              {rate.currency} - {rate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">النتيجة</div>
                      <div className="text-2xl font-bold">
                        {convertCurrency()} {exchangeRates.find((r) => r.currency === toCurrency)?.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        سعر الصرف: 1 {fromCurrency} ={" "}
                        {(exchangeRates.find((r) => r.currency === toCurrency)?.rate || 1) /
                          (exchangeRates.find((r) => r.currency === fromCurrency)?.rate || 1)}{" "}
                        {toCurrency}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsConverterOpen(false)}>
                      إغلاق
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 ml-2" />
                      تسجيل المعاملة
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Exchange Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              أسعار الصرف الحالية
            </CardTitle>
            <CardDescription>أسعار الصرف مقابل الدولار الأمريكي - آخر تحديث: 15 يناير 2024، 14:30</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exchangeRates.map((rate) => (
                <Card key={rate.currency} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{rate.symbol}</div>
                      <div>
                        <div className="font-semibold">{rate.currency}</div>
                        <div className="text-sm text-muted-foreground">{rate.name}</div>
                      </div>
                    </div>
                    {getTrendIcon(rate.trend)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {rate.currency === "USD" ? "1.0000" : rate.rate.toFixed(4)}
                    </div>
                    <div className={`text-sm ${getTrendColor(rate.change)}`}>{rate.change}</div>
                    <div className="text-xs text-muted-foreground">آخر تحديث: {rate.lastUpdate}</div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Balances */}
        <Card>
          <CardHeader>
            <CardTitle>أرصدة العملات</CardTitle>
            <CardDescription>الأرصدة المتاحة في مختلف العملات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">دولار أمريكي</div>
                  <div className="text-lg">$</div>
                </div>
                <div className="text-2xl font-bold text-green-600">$285,600.00</div>
                <div className="text-sm text-muted-foreground">متاح للتحويل</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">دينار ليبي</div>
                  <div className="text-lg">د.ل</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">125,450.00 د.ل</div>
                <div className="text-sm text-muted-foreground">متاح للتحويل</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">يوان صيني</div>
                  <div className="text-lg">¥</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">¥89,250.00</div>
                <div className="text-sm text-muted-foreground">متاح للتحويل</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">درهم إماراتي</div>
                  <div className="text-lg">د.إ</div>
                </div>
                <div className="text-2xl font-bold text-orange-600">د.إ45,800.00</div>
                <div className="text-sm text-muted-foreground">متاح للتحويل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Currency Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>معاملات العملات الأخيرة</CardTitle>
            <CardDescription>آخر عمليات التحويل والصرف</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم المعاملة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>من</TableHead>
                  <TableHead>إلى</TableHead>
                  <TableHead>سعر الصرف</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="font-medium text-red-600">{transaction.fromAmount}</TableCell>
                    <TableCell className="font-medium text-green-600">{transaction.toAmount}</TableCell>
                    <TableCell>{transaction.rate}</TableCell>
                    <TableCell>{transaction.client}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "مكتمل"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Currency Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>تحليل العملات</CardTitle>
              <CardDescription>إحصائيات التحويلات الشهرية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">USD → LYD</span>
                  <span className="font-medium">$125,600</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CNY → USD</span>
                  <span className="font-medium">$89,400</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">USD → CNY</span>
                  <span className="font-medium">$67,200</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">AED → USD</span>
                  <span className="font-medium">$45,800</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عمولات الصرف</CardTitle>
              <CardDescription>الأرباح من عمليات الصرف</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">$8,450</div>
                <div className="text-sm text-muted-foreground">إجمالي العمولات هذا الشهر</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">عمولة تحويل USD/LYD</span>
                  <span className="font-medium text-green-600">$3,140</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">عمولة تحويل CNY/USD</span>
                  <span className="font-medium text-green-600">$2,235</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">عمولة تحويل USD/CNY</span>
                  <span className="font-medium text-green-600">$1,680</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">عمولات أخرى</span>
                  <span className="font-medium text-green-600">$1,395</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
