"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, FileText, Calculator,
  CreditCard, Banknote, Receipt, AlertCircle, CheckCircle, Users, MonitorSpeaker,
  Building, ArrowUpRight, ArrowDownRight, BookOpen, Database, Package, Briefcase,
  Wallet, Globe, Shield, Ship, Target, Building2, Home, Bell, User, LogOut, Menu,
  Settings, Sparkles, Plus, Search, Clock, UserCheck, ClipboardList, Archive,
  Calendar, Percent, HandCoins, Coins, ArrowLeftRight, Eye, Filter, BarChart2,
  CandlestickChart, Activity, TrendingDownIcon, TrendingUpIcon, UserCog,
  FolderOpen, FileSpreadsheet, Inbox, PiggyBank, Shuffle, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { AdvertisementSlider } from "@/components/shared/advertisement-slider"
import { UnifiedDashboard, type DashboardModule, type KPICard, type QuickAction, type ReportCard } from "@/components/shared/unified-dashboard"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"
import FinancialAlertsPanel from "@/components/financial/financial-alerts-panel"
import SyncButton from "@/components/financial/sync-button"
import SimpleAdvancedFinancialDashboard from "@/components/financial/simple-advanced-financial-dashboard"
import { AdvancedKPIGrid } from "@/components/shared/advanced-kpi-grid"
import { AnimatedCard, StaggeredCards } from "@/components/ui/animated-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ProgressRing } from "@/components/ui/progress-ring"
import { GoldenSpinner } from "@/components/ui/loading-spinner"

const financialModules = [
  {
    title: "المحاسبة الأساسية",
    icon: Calculator,
    color: "from-slate-400 to-slate-600",
    items: [
      { name: "دفتر اليومية العامة", href: "/accounting/journal", icon: BookOpen },
      { name: "كشف حساب الأستاذ", href: "/accounting/ledger", icon: Database },
      { name: "دليل الحسابات", href: "/accounting/chart", icon: FolderOpen },
      { name: "ميزان المراجعة", href: "/accounting/trial-balance", icon: BarChart2 },
      { name: "قائمة الدخل", href: "/accounting/income-statement", icon: TrendingUp },
      { name: "الميزانية العمومية", href: "/accounting/balance-sheet", icon: CandlestickChart },
    ],
  },
  {
    title: "إدارة الحوالات المالية",
    icon: ArrowLeftRight,
    color: "from-emerald-400 to-emerald-600",
    items: [
      { name: "إرسال حوالة", href: "/financial/transfers/send", icon: ArrowUpRight },
      { name: "استلام حوالة", href: "/financial/transfers/receive", icon: ArrowDownRight },
      { name: "تتبع الحوالات", href: "/financial/transfers/track", icon: Eye },
      { name: "تاريخ الحوالات", href: "/financial/transfers/history", icon: Clock },
    ],
  },
  {
    title: "السندات المالية",
    icon: Receipt,
    color: "from-blue-400 to-blue-600",
    items: [
      { name: "سندات القبض", href: "/financial/vouchers/receipt", icon: Coins },
      { name: "سندات الصرف", href: "/financial/vouchers/payment", icon: HandCoins },
      { name: "تحويل الأموال", href: "/financial/transfers", icon: Shuffle },
      { name: "شراء العملة", href: "/currencies", icon: DollarSign },
    ],
  },
  {
    title: "متابعة الشيكات",
    icon: CreditCard,
    color: "from-indigo-400 to-indigo-600",
    items: [
      { name: "الشيكات الصادرة", href: "/financial/checks/outgoing", icon: ArrowUpRight },
      { name: "الشيكات الواردة", href: "/financial/checks/incoming", icon: ArrowDownRight },
      { name: "الشيكات الآجلة", href: "/financial/checks/postdated", icon: Calendar },
      { name: "الشيكات الملغية", href: "/financial/checks/cancelled", icon: Archive },
    ],
  },
  {
    title: "الأصول الثابتة",
    icon: Building,
    color: "from-amber-400 to-amber-600",
    items: [
      { name: "إضافة أصل ثابت", href: "/fixed-assets/add", icon: Plus },
      { name: "إهلاك الأصول", href: "/fixed-assets/depreciation", icon: TrendingDown },
      { name: "تخريد الأصول", href: "/fixed-assets/disposal", icon: Archive },
      { name: "سجل الأصول", href: "/fixed-assets", icon: ClipboardList },
    ],
  },
  {
    title: "إعدادات الحسابات",
    icon: Settings,
    color: "from-purple-400 to-purple-600",
    items: [
      { name: "دليل الحسابات", href: "/accounting/chart", icon: BookOpen },
      { name: "إدارة العملات", href: "/currencies", icon: Globe },
      { name: "إعدادات الضريبة", href: "/financial/tax-settings", icon: Percent },
              { name: "إعدادات النظام", href: "/admin/settings", icon: Settings },
    ],
  },
]

export default function FinancialDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeMegaTab, setActiveMegaTab] = useState("الأساسية")
  const pathname = usePathname()

  const gl = useGlStore()
  const tx = useGlTransactions()

  useEffect(() => {
    gl.initializeChartIfEmpty()
  }, [])

  const balances = tx.computeBalances()
  const { revenueTotal, expenseTotal, cashLikeTotal } = useMemo(() => {
    let revenue = 0
    let expense = 0
    let cashLike = 0
    for (const acc of gl.accounts) {
      const bal = balances[acc.id] || 0
      if (acc.rootType === 'REVENUE') revenue += -bal // الإيراد يزيد بالدائن
      if (acc.rootType === 'EXPENSE') expense += bal  // المصروف يزيد بالمدين
      // نقدية وما في حكمها 1.1.1.*
      if (acc.code.startsWith('1.1.1')) cashLike += bal
    }
    return { revenueTotal: Math.max(0, revenue), expenseTotal: Math.max(0, expense), cashLikeTotal: cashLike }
  }, [gl.accounts, balances])

  const netProfit = revenueTotal - expenseTotal

  const financialStats = [
    { title: 'إجمالي الإيرادات اليومية', value: revenueTotal.toLocaleString(), currency: 'د.ل', change: '+12.5%', changeType: 'positive', icon: TrendingUp, color: 'text-emerald-600' },
    { title: 'إجمالي المصروفات اليومية', value: expenseTotal.toLocaleString(), currency: 'د.ل', change: '-8.3%', changeType: 'negative', icon: TrendingDown, color: 'text-red-500' },
    { title: 'رصيد الصندوق', value: (cashLikeTotal * 0.6).toLocaleString(), currency: 'د.ل', change: '+5.2%', changeType: 'positive', icon: PiggyBank, color: 'text-blue-600' },
    { title: 'رصيد البنك', value: (cashLikeTotal * 0.4).toLocaleString(), currency: 'د.ل', change: '+2.1%', changeType: 'positive', icon: Building2, color: 'text-indigo-600' },
    { title: 'الحوالات الصادرة اليومية', value: '15', currency: 'حوالة', change: '+3', changeType: 'positive', icon: ArrowUpRight, color: 'text-orange-600' },
    { title: 'الحوالات الواردة اليومية', value: '22', currency: 'حوالة', change: '+7', changeType: 'positive', icon: ArrowDownRight, color: 'text-teal-600' },
    { title: 'إجمالي الإيرادات الشهرية', value: (revenueTotal * 30).toLocaleString(), currency: 'د.ل', change: '+18.7%', changeType: 'positive', icon: BarChart2, color: 'text-green-600' },
    { title: 'صافي الربح الشهري', value: (netProfit * 30).toLocaleString(), currency: 'د.ل', change: netProfit >= 0 ? '+15.3%' : '-5.2%', changeType: netProfit >= 0 ? 'positive' : 'negative', icon: DollarSign, color: 'text-amber-600' },
  ]

  const financialAlerts = [
    {
      type: "success",
      title: "النظام المالي المتكامل",
      description: "جميع الوظائف المالية والمحاسبية متاحة في لوحة تحكم واحدة",
      icon: CheckCircle,
    },
    {
      type: "info",
      title: "صلاحيات المدير المالي",
      description: "لديك صلاحيات كاملة على جميع الوظائف المالية والمحاسبية",
      icon: AlertCircle,
    },
  ]

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col gap-2">
            {/* Row 1: Logo + Mega Nav */}
            <div className="flex items-center justify-between min-h-[48px]">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <Image
                    src="/golden-horse-logo.svg"
                    alt="شعار الحصان الذهبي"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="36px"
                    priority
                  />
                </div>
                <div className="text-center">
                  <span className="text-base sm:text-xl font-bold gold-text leading-none">الحصان الذهبي للشحن</span>
                  <div className="text-[10px] sm:text-xs text-gold-600/80">لوحة تحكم المدير المالي</div>
                </div>
              </div>

              {/* Mega Menu (collapsed) */}
              <div className="hidden lg:flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className="gap-1">
                    <NavigationMenuItem>
                      <Link
                        href="/financial/dashboard"
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-gold-100 hover:text-gold-900 focus:bg-gold-100 focus:text-gold-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          pathname === "/financial/dashboard" ? "bg-gold-100 text-gold-900" : "text-slate-700",
                        )}
                      >
                        <Home className="h-4 w-4 ml-2" />
                        لوحة التحكم
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9 bg-transparent px-3 hover:bg-gold-100 hover:text-gold-900 data-[state=open]:bg-gold-100 data-[state=open]:text-gold-900">
                        القائمة المالية
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[760px] p-4">
                          <Tabs value={activeMegaTab} onValueChange={setActiveMegaTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-lg border">
                              <TabsTrigger value="الأساسية">الأساسية</TabsTrigger>
                              <TabsTrigger value="المبيعات">المبيعات</TabsTrigger>
                              <TabsTrigger value="الخزينة">الخزينة</TabsTrigger>
                              <TabsTrigger value="التقارير">التقارير</TabsTrigger>
                            </TabsList>

                            <TabsContent value="الأساسية" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                {[
                                  financialModules[0],
                                  financialModules[4],
                                  financialModules[5],
                                ].map((menu) => (
                                  <div key={menu.title} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                      <menu.icon className="h-4 w-4 text-gold-600" />
                                      {menu.title}
                                    </div>
                                    <div className="space-y-1">
                                      {menu.items.map((item) => (
                                        <NavigationMenuLink key={item.name} asChild>
                                          <Link
                                            href={item.href}
                                            className={cn("block select-none rounded-md p-2 text-sm leading-none transition-colors hover:bg-gold-50 hover:text-gold-900 focus:bg-gold-50 focus:text-gold-900")}
                                          >
                                            <div className="flex items-center gap-2">
                                              <item.icon className="h-4 w-4 text-slate-500" />
                                              <span>{item.name}</span>
                                            </div>
                                          </Link>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="المبيعات" className="mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                {[financialModules[1], financialModules[2]].map((menu) => (
                                  <div key={menu.title} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                      <menu.icon className="h-4 w-4 text-gold-600" />
                                      {menu.title}
                                    </div>
                                    <div className="space-y-1">
                                      {menu.items.map((item) => (
                                        <NavigationMenuLink key={item.name} asChild>
                                          <Link
                                            href={item.href}
                                            className="block select-none rounded-md p-2 text-sm leading-none transition-colors hover:bg-gold-50 hover:text-gold-900 focus:bg-gold-50 focus:text-gold-900"
                                          >
                                            <div className="flex items-center gap-2">
                                              <item.icon className="h-4 w-4 text-slate-500" />
                                              <span>{item.name}</span>
                                            </div>
                                          </Link>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="الخزينة" className="mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                {[financialModules[3]].map((menu) => (
                                  <div key={menu.title} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                      <menu.icon className="h-4 w-4 text-gold-600" />
                                      {menu.title}
                                    </div>
                                    <div className="space-y-1">
                                      {menu.items.map((item) => (
                                        <NavigationMenuLink key={item.name} asChild>
                                          <Link
                                            href={item.href}
                                            className="block select-none rounded-md p-2 text-sm leading-none transition-colors hover:bg-gold-50 hover:text-gold-900 focus:bg-gold-50 focus:text-gold-900"
                                          >
                                            <div className="flex items-center gap-2">
                                              <item.icon className="h-4 w-4 text-slate-500" />
                                              <span>{item.name}</span>
                                            </div>
                                          </Link>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="التقارير" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                {[financialModules[0]].map((menu) => (
                                  <div key={menu.title} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                      <menu.icon className="h-4 w-4 text-gold-600" />
                                      {menu.title}
                                    </div>
                                    <div className="space-y-1">
                                      {menu.items.map((item) => (
                                        <NavigationMenuLink key={item.name} asChild>
                                          <Link
                                            href={item.href}
                                            className="block select-none rounded-md p-2 text-sm leading-none transition-colors hover:bg-gold-50 hover:text-gold-900 focus:bg-gold-50 focus:text-gold-900"
                                          >
                                            <div className="flex items-center gap-2">
                                              <item.icon className="h-4 w-4 text-slate-500" />
                                              <span>{item.name}</span>
                                            </div>
                                          </Link>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Mobile menu button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gold-100">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>القائمة الرئيسية</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {financialModules.map((menu) => (
                      <div key={menu.title} className="space-y-2">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                          <menu.icon className="h-4 w-4" />
                          {menu.title}
                        </h3>
                        <div className="space-y-1 mr-4">
                          {menu.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block p-2 text-sm text-slate-600 hover:text-gold-600 hover:bg-gold-50 rounded-md transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Row 2: Search + Notifications + User */}
            <div className="flex items-center justify-between gap-2 min-h-[40px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="البحث في النظام المالي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 h-9"
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <SyncButton />
                <Button variant="ghost" size="icon" className="relative hover:bg-gold-100 h-9 w-9">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-gold-100 h-9">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-right hidden md:block leading-none">
                        <div className="text-xs font-bold text-slate-700">المدير المالي</div>
                        <div className="text-[10px] text-gold-600">صلاحيات كاملة</div>
                      </div>
                      <span className="sr-only">قائمة المستخدم</span>
                    </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">المدير المالي</p>
                        <p className="text-xs leading-none text-muted-foreground">صلاحيات كاملة على النظام المالي</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/approvals">الموافقات</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/audit">سجل التدقيق</Link>
                      </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="card-premium rounded-2xl p-6 text-center">
            <div className="text-xs text-gold-700/80 mb-1">المـالـي</div>
            <h1 className="text-3xl font-extrabold gold-text mb-2">الحصان الذهبي للشحن - المدير المالي</h1>
            <p className="text-slate-600">Golden Horse Shipping - النظام المالي المتكامل - جميع الوظائف المالية والمحاسبية في مكان واحد</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8 space-y-4">
          {financialAlerts.map((alert, index) => (
            <Alert key={index} className={`border-l-4 ${
              alert.type === "success" ? "border-gold-500" : "border-blue-500"
            }`}>
              <alert.icon className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm text-slate-600">{alert.description}</div>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-8 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-white rounded-lg text-xs font-medium">التحليل المتقدم</TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">الوظائف المالية</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">التقارير والاستفسارات</TabsTrigger>
            <TabsTrigger value="debtors" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">إدارة المدينين</TabsTrigger>
            <TabsTrigger value="advances" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">إدارة العهد</TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">إدارة الموظفين</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg text-xs">المخزون</TabsTrigger>
          </TabsList>

          {/* Advanced Analysis Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <SimpleAdvancedFinancialDashboard />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Slider for Advertisements */}
            <div className="container mx-auto px-4">
              <AdvertisementSlider
                className="mb-6"
                autoPlay={true}
                interval={8000}
                showDots={true}
                showArrows={true}
              />
            </div>

            {/* Advanced KPIs */}
            <AdvancedKPIGrid
              kpis={[
                { title: 'إجمالي الإيرادات', value: `${revenueTotal.toLocaleString()} د.ل`, change: '+18% شهر/شهر', changeType: 'positive', icon: BarChart3, color: 'text-green-600', trend: { data: [12,14,16,18,21,25], labels: ['ش','ف','م','أ','م','ي'] }, status: 'on-track' },
                { title: 'إجمالي المصروفات', value: `${expenseTotal.toLocaleString()} د.ل`, change: '-6% شهر/شهر', changeType: 'positive', icon: PieChart, color: 'text-red-600', trend: { data: [15,14,13,12,12,11], labels: ['ش','ف','م','أ','م','ي'] }, status: 'ahead' },
                { title: 'هامش الربح', value: `${((netProfit/(revenueTotal||1))*100).toFixed(1)}%`, change: '+2.4 نقطة', changeType: 'positive', icon: TrendingUp, color: 'text-amber-600', trend: { data: [8,9,10,11,12,13], labels: [] }, status: 'on-track' },
                { title: 'دوران النقدية', value: `${cashLikeTotal.toLocaleString()} د.ل`, change: '+5% سيولة', changeType: 'positive', icon: DollarSign, color: 'text-blue-600', trend: { data: [60,62,63,64,66,69], labels: [] }, status: 'on-track' }
              ]}
              showTrends
              showCharts
              columns={4}
              className="mb-6"
            />

            {/* Main Financial Sections */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Core Accounting */}
              <Card className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Calculator className="h-5 w-5 text-slate-600" />
                    الأقسام الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/accounting/journal" className="flex items-center">
                      <BookOpen className="h-4 w-4 ml-2 text-slate-600" />
                      دفتر اليومية العامة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/accounting/ledger" className="flex items-center">
                      <Database className="h-4 w-4 ml-2 text-slate-600" />
                      كشف حساب الأستاذ العام
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/financial/transfers" className="flex items-center">
                      <ArrowLeftRight className="h-4 w-4 ml-2 text-slate-600" />
                      إدارة الحوالات المالية
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/reports/financial" className="flex items-center">
                      <BarChart2 className="h-4 w-4 ml-2 text-slate-600" />
                      تقارير الإيرادات والمصروفات
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Reports */}
              <Card className="bg-blue-50/50 backdrop-blur-sm border border-blue-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    التقارير المالية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/accounting/trial-balance" className="flex items-center">
                      <BarChart2 className="h-4 w-4 ml-2 text-blue-600" />
                      ميزان المراجعة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/accounting/income-statement" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2 text-blue-600" />
                      قائمة الدخل
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/accounting/balance-sheet" className="flex items-center">
                      <CandlestickChart className="h-4 w-4 ml-2 text-blue-600" />
                      الميزانية العمومية
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/fixed-assets" className="flex items-center">
                      <Building className="h-4 w-4 ml-2 text-blue-600" />
                      إدارة الأصول الثابتة
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Documents & Vouchers */}
              <Card className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <Receipt className="h-5 w-5 text-emerald-600" />
                    السندات والوثائق
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/financial/vouchers/receipt" className="flex items-center">
                      <Coins className="h-4 w-4 ml-2 text-emerald-600" />
                      سندات القبض والصرف
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/financial/transfers" className="flex items-center">
                      <Shuffle className="h-4 w-4 ml-2 text-emerald-600" />
                      تحويل الأموال
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/currencies" className="flex items-center">
                      <DollarSign className="h-4 w-4 ml-2 text-emerald-600" />
                      شراء العملة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/financial/checks" className="flex items-center">
                      <CreditCard className="h-4 w-4 ml-2 text-emerald-600" />
                      متابعة الشيكات
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Financial Alerts Panel */}
            <FinancialAlertsPanel />

            {/* Quick Actions & Settings */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-white/50 backdrop-blur-sm border border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                  إجراءات سريعة
                </CardTitle>
                <CardDescription>
                  الوصول السريع للوظائف الأكثر استخداماً
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button className="bg-slate-600 hover:bg-slate-700 text-white" asChild>
                      <Link href="/accounting/journal" className="flex items-center">
                      <Plus className="h-4 w-4 ml-2" />
                        قيد يومية جديد
                    </Link>
                  </Button>
                    <Button className="bg-slate-600 hover:bg-slate-700 text-white" asChild>
                      <Link href="/financial/vouchers/receipt" className="flex items-center">
                        <Receipt className="h-4 w-4 ml-2" />
                        إنشاء سند جديد
                    </Link>
                  </Button>
                    <Button className="bg-slate-600 hover:bg-slate-700 text-white" asChild>
                      <Link href="/financial/transfers/send" className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                        إرسال حوالة
                    </Link>
                  </Button>
                    <Button className="bg-slate-600 hover:bg-slate-700 text-white" asChild>
                    <Link href="/reports/financial" className="flex items-center">
                      <BarChart3 className="h-4 w-4 ml-2" />
                        تقرير مالي
                    </Link>
                  </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-600" />
                    إعدادات الحسابات
                  </CardTitle>
                  <CardDescription>
                    إدارة إعدادات النظام المحاسبي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" className="justify-start hover:bg-slate-100" asChild>
                     <Link href="/accounting/chart" className="flex items-center">
                       <BookOpen className="h-4 w-4 ml-2" />
                        دليل الحسابات
                     </Link>
                   </Button>
                    <Button variant="outline" className="justify-start hover:bg-slate-100" asChild>
                      <Link href="/currencies" className="flex items-center">
                        <Globe className="h-4 w-4 ml-2" />
                        العملات
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start hover:bg-slate-100" asChild>
                      <Link href="/financial/tax-settings" className="flex items-center">
                        <Percent className="h-4 w-4 ml-2" />
                        الضريبة
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start hover:bg-slate-100" asChild>
                      <Link href="/admin/settings" className="flex items-center">
                        <Settings className="h-4 w-4 ml-2" />
                        إعدادات النظام
                     </Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {financialModules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="card-premium hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                        <module.icon className="h-4 w-4 text-white" />
                      </div>
                      {module.title}
                    </CardTitle>
                    <CardDescription>الوصول لجميع وظائف {module.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          asChild
                          variant="outline"
                          className="w-full justify-start text-right hover-gold"
                        >
                          <Link href={item.href} className="flex items-center">
                            <item.icon className="h-4 w-4 ml-2 text-slate-600" />
                            <div className="text-right">
                              <div className="font-medium text-slate-800">{item.name}</div>
                              {/* شارات للوظائف الجديدة */}
                              {(item.href === "/financial/advances" || item.href === "/financial/payroll") && (
                                <div className="text-[10px] text-gold-600">جديد</div>
                              )}
                            </div>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Reports Tab */}
          <TabsContent value="reports" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Inventory Reports */}
              <Card className="bg-amber-50/50 backdrop-blur-sm border border-amber-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Package className="h-5 w-5 text-amber-600" />
                    تقارير المخزون والأصناف
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/inventory/total" className="flex items-center">
                      <Package className="h-4 w-4 ml-2 text-amber-600" />
                      تقرير المخزون الإجمالي
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/inventory/movement" className="flex items-center">
                      <Activity className="h-4 w-4 ml-2 text-amber-600" />
                      تقرير حركة المخزون
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/inventory/reorder" className="flex items-center">
                      <RefreshCw className="h-4 w-4 ml-2 text-amber-600" />
                      تقرير حد إعادة الطلب
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/sales/items" className="flex items-center">
                      <BarChart2 className="h-4 w-4 ml-2 text-amber-600" />
                      المبيعات حسب الصنف
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/inventory/profitability" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2 text-amber-600" />
                      الربحية لكل صنف
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                    <Link href="/reports/inventory/stagnant" className="flex items-center">
                      <Archive className="h-4 w-4 ml-2 text-amber-600" />
                      الأصناف الراكدة
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Receipts & Payments Reports */}
              <Card className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <Coins className="h-5 w-5 text-emerald-600" />
                    تقارير المقبوضات والمدفوعات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-700 mb-2">المقبوضات:</div>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/reports/receipts/customer" className="flex items-center">
                      <Users className="h-3 w-3 ml-2 text-emerald-600" />
                      البحث حسب العميل
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/reports/receipts/period" className="flex items-center">
                      <Calendar className="h-3 w-3 ml-2 text-emerald-600" />
                      البحث حسب الفترة
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/reports/receipts/payment-method" className="flex items-center">
                      <CreditCard className="h-3 w-3 ml-2 text-emerald-600" />
                      عرض طريقة الدفع
                    </Link>
                  </Button>

                  <div className="text-xs font-semibold text-emerald-700 mb-2 mt-4">المدفوعات:</div>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/reports/payments/period" className="flex items-center">
                      <Calendar className="h-3 w-3 ml-2 text-emerald-600" />
                      المدفوعات حسب الفترة
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-emerald-100" asChild>
                    <Link href="/reports/payments/category" className="flex items-center">
                      <FolderOpen className="h-3 w-3 ml-2 text-emerald-600" />
                      تصنيف المصروفات
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Comprehensive Accounts Reports */}
              <Card className="bg-blue-50/50 backdrop-blur-sm border border-blue-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    تقارير الحسابات الشاملة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/reports/accounts/comprehensive" className="flex items-center">
                      <Database className="h-4 w-4 ml-2 text-blue-600" />
                      كشف حساب شامل
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/accounting/trial-balance" className="flex items-center">
                      <BarChart2 className="h-4 w-4 ml-2 text-blue-600" />
                      ميزان مراجعة تفصيلي
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/reports/revenue-expense" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2 text-blue-600" />
                      تقارير الإيرادات والمصروفات
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-100" asChild>
                    <Link href="/reports/balance-history" className="flex items-center">
                      <Clock className="h-4 w-4 ml-2 text-blue-600" />
                      رصيد الحسابات في تاريخ
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Reports */}
              <Card className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <PieChart className="h-5 w-5 text-slate-600" />
                    التقارير المالية الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-slate-600 hover:bg-slate-700 text-white" asChild>
                    <Link href="/reports/financial" className="flex items-center">
                      <PieChart className="h-4 w-4 ml-2" />
                      التقرير المالي الشامل
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/accounting/balance-sheet" className="flex items-center">
                      <CandlestickChart className="h-4 w-4 ml-2 text-slate-600" />
                      الميزانية العمومية
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100" asChild>
                    <Link href="/accounting/income-statement" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2 text-slate-600" />
                      قائمة الدخل
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Sales Reports */}
              <Card className="bg-green-50/50 backdrop-blur-sm border border-green-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    تقارير المبيعات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href="/reports/sales" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2" />
                      تقرير المبيعات الشامل
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/invoices" className="flex items-center">
                      <FileText className="h-4 w-4 ml-2 text-green-600" />
                      تقرير الفواتير
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/quotes" className="flex items-center">
                      <Receipt className="h-4 w-4 ml-2 text-green-600" />
                      تقرير عروض الأسعار
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Profit & Loss Reports */}
              <Card className="bg-indigo-50/50 backdrop-blur-sm border border-indigo-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    تقارير الأرباح والخسائر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                    <Link href="/reports/profit" className="flex items-center">
                      <DollarSign className="h-4 w-4 ml-2" />
                      تقرير الأرباح والخسائر
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-indigo-100" asChild>
                    <Link href="/vouchers" className="flex items-center">
                      <FileText className="h-4 w-4 ml-2 text-indigo-600" />
                      تقرير السندات
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-indigo-100" asChild>
                    <Link href="/receipts" className="flex items-center">
                      <Banknote className="h-4 w-4 ml-2 text-indigo-600" />
                      تقرير المقبوضات
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Debtors Management Tab */}
          <TabsContent value="debtors" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Debtors List */}
              <Card className="bg-red-50/50 backdrop-blur-sm border border-red-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Users className="h-5 w-5 text-red-600" />
                    إدارة المدينين وتتبع السداد
                  </CardTitle>
                  <CardDescription>
                    قائمة العملاء المدينين ومتابعة الديون والسداد
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                      <Link href="/financial/debtors">عرض جميع المدينين</Link>
                    </Button>
                    <Button variant="outline" className="hover:bg-red-100">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مدين
                    </Button>
                    <Button variant="outline" className="hover:bg-red-100">
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                    <Button variant="outline" className="hover:bg-red-100">
                      <FileSpreadsheet className="h-4 w-4 ml-2" />
                      تصدير Excel
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-right border-b border-red-200">
                          <th className="py-2 text-xs">العميل</th>
                          <th className="py-2 text-xs">المبلغ المدين</th>
                          <th className="py-2 text-xs">تاريخ الاستحقاق</th>
                          <th className="py-2 text-xs">الحالة</th>
                          <th className="py-2 text-xs">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { client: "شركة النقل المتحدة", amount: "125,500 د.ل", due: "2025-08-15", status: "مستحق", overdue: true },
                          { client: "مؤسسة التجارة الدولية", amount: "87,300 د.ل", due: "2025-08-25", status: "قريب الاستحقاق", overdue: false },
                          { client: "شركة الشحن السريع", amount: "45,200 د.ل", due: "2025-09-05", status: "ضمن الموعد", overdue: false },
                          { client: "العميل الجديد", amount: "12,750 د.ل", due: "2025-09-12", status: "ضمن الموعد", overdue: false },
                        ].map((row, i) => (
                          <tr key={i} className={`border-b border-red-100 hover:bg-red-50/30 ${row.overdue ? 'bg-red-100/50' : ''}`}>
                            <td className="py-2 text-xs font-medium">{row.client}</td>
                            <td className="py-2 text-xs font-mono text-red-700">{row.amount}</td>
                            <td className="py-2 text-xs">{row.due}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                row.overdue ? 'bg-red-200 text-red-900' :
                                row.status === 'قريب الاستحقاق' ? 'bg-amber-200 text-amber-900' :
                                'bg-green-200 text-green-900'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                  <Bell className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Tracking & Analytics */}
              <Card className="bg-amber-50/50 backdrop-blur-sm border border-amber-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <BarChart2 className="h-5 w-5 text-amber-600" />
                    تحليل وتتبع السداد
                  </CardTitle>
                  <CardDescription>
                    تقارير تحليلية ونسب التحصيل
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Collection Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-amber-600">نسبة التحصيل</div>
                      <div className="text-lg font-bold text-amber-800">87.5%</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-amber-600">متوسط فترة التحصيل</div>
                      <div className="text-lg font-bold text-amber-800">23 يوم</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-amber-600">إجمالي المديونية</div>
                      <div className="text-lg font-bold text-amber-800">270,750 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-amber-600">ديون متأخرة</div>
                      <div className="text-lg font-bold text-red-700">125,500 د.ل</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                      <Link href="/financial/debtors/statement" className="flex items-center">
                        <FileText className="h-4 w-4 ml-2 text-amber-600" />
                        كشف حساب تفصيلي (مالي + تسليم)
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                      <Link href="/financial/debtors/payment-tracking" className="flex items-center">
                        <Clock className="h-4 w-4 ml-2 text-amber-600" />
                        تتبع تواريخ وطرق السداد
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                      <Link href="/financial/debtors/alerts" className="flex items-center">
                        <Bell className="h-4 w-4 ml-2 text-amber-600" />
                        تنبيهات مواعيد الاستحقاق
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-amber-100" asChild>
                      <Link href="/reports/collection-analysis" className="flex items-center">
                        <BarChart2 className="h-4 w-4 ml-2 text-amber-600" />
                        تقارير تحليلية للتحصيل
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advances (العهد المالية) Tab */}
          <TabsContent value="advances" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Advances Management */}
              <Card className="bg-cyan-50/50 backdrop-blur-sm border border-cyan-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-700">
                    <HandCoins className="h-5 w-5 text-cyan-600" />
                    إدارة العهد المالية
                  </CardTitle>
                  <CardDescription>
                    تسجيل ومتابعة العهد للموظفين والفروع
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" asChild>
                      <Link href="/financial/advances">إدارة العهد</Link>
                    </Button>
                    <Button variant="outline" className="hover:bg-cyan-100">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عهدة
                    </Button>
                    <Button variant="outline" className="hover:bg-cyan-100">
                      <CheckCircle className="h-4 w-4 ml-2" />
                      اعتماد
                    </Button>
                    <Button variant="outline" className="hover:bg-cyan-100">
                      <Archive className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-right border-b border-cyan-200">
                          <th className="py-2 text-xs">المستفيد</th>
                          <th className="py-2 text-xs">الغرض</th>
                          <th className="py-2 text-xs">المبلغ</th>
                          <th className="py-2 text-xs">المتبقي</th>
                          <th className="py-2 text-xs">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { beneficiary: "أحمد علي", purpose: "مصروفات سفر", amount: "5,000", remaining: "2,300", status: "قيد التسوية" },
                          { beneficiary: "فرع الزاوية", purpose: "مصروفات تشغيلية", amount: "15,000", remaining: "8,500", status: "نشطة" },
                          { beneficiary: "محمود سالم", purpose: "صيانة مركبات", amount: "3,500", remaining: "0", status: "مصفاة" },
                          { beneficiary: "سارة أحمد", purpose: "مشتريات مكتبية", amount: "1,200", remaining: "450", status: "قيد التسوية" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-cyan-100 hover:bg-cyan-50/30">
                            <td className="py-2 text-xs font-medium">{row.beneficiary}</td>
                            <td className="py-2 text-xs">{row.purpose}</td>
                            <td className="py-2 text-xs font-mono text-cyan-700">{row.amount} د.ل</td>
                            <td className="py-2 text-xs font-mono text-amber-700">{row.remaining} د.ل</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                row.status === 'مصفاة' ? 'bg-green-200 text-green-900' :
                                row.status === 'نشطة' ? 'bg-blue-200 text-blue-900' :
                                'bg-amber-200 text-amber-900'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Advances Features */}
              <Card className="bg-teal-50/50 backdrop-blur-sm border border-teal-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-700">
                    <ClipboardList className="h-5 w-5 text-teal-600" />
                    وظائف إدارة العهد
                  </CardTitle>
                  <CardDescription>
                    جميع العمليات المتعلقة بالعهد المالية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-teal-600">إجمالي العهد النشطة</div>
                      <div className="text-lg font-bold text-teal-800">24,950 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-teal-600">عدد العهد</div>
                      <div className="text-lg font-bold text-teal-800">12 عهدة</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-teal-600">عهد تحتاج تسوية</div>
                      <div className="text-lg font-bold text-amber-700">6 عهد</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-teal-600">تنبيهات التأخير</div>
                      <div className="text-lg font-bold text-red-700">2 تنبيه</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start hover:bg-teal-100" asChild>
                      <Link href="/financial/advances/expense-tracking" className="flex items-center">
                        <Eye className="h-4 w-4 ml-2 text-teal-600" />
                        متابعة المصروفات من العهدة
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-teal-100" asChild>
                      <Link href="/financial/advances/remaining-balance" className="flex items-center">
                        <PiggyBank className="h-4 w-4 ml-2 text-teal-600" />
                        عرض الرصيد المتبقي
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-teal-100" asChild>
                      <Link href="/reports/advances/movement" className="flex items-center">
                        <Activity className="h-4 w-4 ml-2 text-teal-600" />
                        تقارير حركة العهد
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-teal-100" asChild>
                      <Link href="/financial/advances/settlement" className="flex items-center">
                        <CheckCircle className="h-4 w-4 ml-2 text-teal-600" />
                        تصفية العهد
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-teal-100" asChild>
                      <Link href="/financial/advances/alerts" className="flex items-center">
                        <Bell className="h-4 w-4 ml-2 text-teal-600" />
                        تنبيهات تأخر التصفية
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employee Management Tab */}
          <TabsContent value="employees" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Administrative Section */}
              <Card className="bg-purple-50/50 backdrop-blur-sm border border-purple-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <UserCog className="h-5 w-5 text-purple-600" />
                    الجانب الإداري للموظفين
                  </CardTitle>
                  <CardDescription>
                    إدارة البيانات الشخصية والعقود والمستندات
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-purple-600">إجمالي الموظفين</div>
                      <div className="text-lg font-bold text-purple-800">127</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-purple-600">موظفين نشطين</div>
                      <div className="text-lg font-bold text-green-700">119</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-purple-600">عقود تنتهي قريباً</div>
                      <div className="text-lg font-bold text-amber-700">8</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-purple-600">مستندات منتهية</div>
                      <div className="text-lg font-bold text-red-700">3</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white" asChild>
                      <Link href="/financial/employees" className="flex items-center">
                        <Users className="h-4 w-4 ml-2" />
                        إدارة الموظفين
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-purple-100" asChild>
                      <Link href="/financial/employees/personal-data" className="flex items-center">
                        <User className="h-4 w-4 ml-2 text-purple-600" />
                        البيانات الشخصية والمؤهلات
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-purple-100" asChild>
                      <Link href="/financial/employees/contracts" className="flex items-center">
                        <FileText className="h-4 w-4 ml-2 text-purple-600" />
                        إدارة العقود
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-purple-100" asChild>
                      <Link href="/financial/employees/documents" className="flex items-center">
                        <Archive className="h-4 w-4 ml-2 text-purple-600" />
                        أرشفة المستندات
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-purple-100" asChild>
                      <Link href="/financial/employees/alerts" className="flex items-center">
                        <Bell className="h-4 w-4 ml-2 text-purple-600" />
                        تنبيهات انتهاء العقود
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Section */}
              <Card className="bg-indigo-50/50 backdrop-blur-sm border border-indigo-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    الجانب المحاسبي - الرواتب
                  </CardTitle>
                  <CardDescription>
                    إدارة الرواتب والمستحقات والخصومات
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-indigo-600">إجمالي الرواتب الشهرية</div>
                      <div className="text-lg font-bold text-indigo-800">487,250 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-indigo-600">السلف والاقتطاعات</div>
                      <div className="text-lg font-bold text-indigo-800">32,150 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-indigo-600">صافي المدفوعات</div>
                      <div className="text-lg font-bold text-green-700">455,100 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-indigo-600">معاملات مُعلقة</div>
                      <div className="text-lg font-bold text-amber-700">5</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                      <Link href="/financial/payroll" className="flex items-center">
                        <Calculator className="h-4 w-4 ml-2" />
                        إدارة الرواتب
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-100" asChild>
                      <Link href="/financial/payroll/advances" className="flex items-center">
                        <HandCoins className="h-4 w-4 ml-2 text-indigo-600" />
                        السلف والاقتطاعات
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-100" asChild>
                      <Link href="/reports/payroll/monthly" className="flex items-center">
                        <BarChart2 className="h-4 w-4 ml-2 text-indigo-600" />
                        تقارير الرواتب الشهرية
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-100" asChild>
                      <Link href="/reports/payroll/quarterly" className="flex items-center">
                        <Calendar className="h-4 w-4 ml-2 text-indigo-600" />
                        تقارير فصلية وسنوية
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employee Table */}
            <Card className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  قائمة الموظفين والرواتب
                </CardTitle>
                <CardDescription>
                  عرض شامل لبيانات الموظفين والجانب المالي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="hover:bg-slate-100">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة موظف
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <Calculator className="h-4 w-4 ml-2" />
                    إضافة مسير راتب
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    اعتماد
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <FileSpreadsheet className="h-4 w-4 ml-2" />
                    تصدير Excel
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-right border-b border-slate-200">
                        <th className="py-2 text-xs">الموظف</th>
                        <th className="py-2 text-xs">القسم</th>
                        <th className="py-2 text-xs">المنصب</th>
                        <th className="py-2 text-xs">الراتب الأساسي</th>
                        <th className="py-2 text-xs">الاستقطاعات</th>
                        <th className="py-2 text-xs">الصافي</th>
                        <th className="py-2 text-xs">تاريخ العقد</th>
                        <th className="py-2 text-xs">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { emp: "سارة محمد أحمد", dept: "الحسابات", position: "محاسب أول", base: "4,500", deductions: "300", net: "4,200", contract: "2023-01-15", status: "نشط" },
                        { emp: "خالد عمر سالم", dept: "الشحن", position: "مشرف شحن", base: "3,800", deductions: "150", net: "3,650", contract: "2022-03-20", status: "نشط" },
                        { emp: "مريم صالح علي", dept: "خدمة العملاء", position: "ممثل خدمة", base: "3,500", deductions: "0", net: "3,500", contract: "2024-06-10", status: "نشط" },
                        { emp: "أحمد محمود طه", dept: "الإدارة", position: "مساعد إداري", base: "3,200", deductions: "200", net: "3,000", contract: "2021-11-05", status: "إجازة" },
                        { emp: "فاطمة حسن محمد", dept: "التسويق", position: "منسق تسويق", base: "4,000", deductions: "250", net: "3,750", contract: "2023-08-18", status: "نشط" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-2 text-xs font-medium">{row.emp}</td>
                          <td className="py-2 text-xs">{row.dept}</td>
                          <td className="py-2 text-xs">{row.position}</td>
                          <td className="py-2 text-xs font-mono text-slate-700">{row.base} د.ل</td>
                          <td className="py-2 text-xs font-mono text-red-600">{row.deductions} د.ل</td>
                          <td className="py-2 text-xs font-mono text-green-700">{row.net} د.ل</td>
                          <td className="py-2 text-xs">{row.contract}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              row.status === 'نشط' ? 'bg-green-200 text-green-900' :
                              row.status === 'إجازة' ? 'bg-blue-200 text-blue-900' :
                              'bg-gray-200 text-gray-900'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Management Tab */}
          <TabsContent value="inventory" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Inventory Overview */}
              <Card className="bg-orange-50/50 backdrop-blur-sm border border-orange-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Package className="h-5 w-5 text-orange-600" />
                    نظرة عامة على المخزون
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-orange-600">إجمالي قيمة المخزون</div>
                      <div className="text-lg font-bold text-orange-800">1,247,350 د.ل</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-orange-600">عدد الأصناف</div>
                      <div className="text-lg font-bold text-orange-800">287 صنف</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-orange-600">أصناف تحتاج إعادة طلب</div>
                      <div className="text-lg font-bold text-red-700">23 صنف</div>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <div className="text-xs text-orange-600">أصناف راكدة</div>
                      <div className="text-lg font-bold text-amber-700">15 صنف</div>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" asChild>
                    <Link href="/inventory" className="flex items-center">
                      <Package className="h-4 w-4 ml-2" />
                      إدارة المخزون
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Inventory Reports */}
              <Card className="bg-yellow-50/50 backdrop-blur-sm border border-yellow-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <BarChart2 className="h-5 w-5 text-yellow-600" />
                    تقارير المخزون
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-100" asChild>
                    <Link href="/reports/inventory/total" className="flex items-center">
                      <Package className="h-4 w-4 ml-2 text-yellow-600" />
                      المخزون الإجمالي
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-100" asChild>
                    <Link href="/reports/inventory/movement" className="flex items-center">
                      <Activity className="h-4 w-4 ml-2 text-yellow-600" />
                      حركة المخزون
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-100" asChild>
                    <Link href="/reports/inventory/reorder" className="flex items-center">
                      <RefreshCw className="h-4 w-4 ml-2 text-yellow-600" />
                      حد إعادة الطلب
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-100" asChild>
                    <Link href="/reports/inventory/profitability" className="flex items-center">
                      <TrendingUp className="h-4 w-4 ml-2 text-yellow-600" />
                      ربحية الأصناف
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-100" asChild>
                    <Link href="/reports/inventory/stagnant" className="flex items-center">
                      <Archive className="h-4 w-4 ml-2 text-yellow-600" />
                      الأصناف الراكدة
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Integration */}
              <Card className="bg-green-50/50 backdrop-blur-sm border border-green-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    التكامل المالي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/reports/cost-analysis" className="flex items-center">
                      <Calculator className="h-4 w-4 ml-2 text-green-600" />
                      تحليل التكاليف
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/reports/inventory/valuation" className="flex items-center">
                      <DollarSign className="h-4 w-4 ml-2 text-green-600" />
                      تقييم المخزون
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/reports/inventory/cogs" className="flex items-center">
                      <BarChart3 className="h-4 w-4 ml-2 text-green-600" />
                      تكلفة البضاعة المباعة
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-100" asChild>
                    <Link href="/accounting/inventory-entries" className="flex items-center">
                      <BookOpen className="h-4 w-4 ml-2 text-green-600" />
                      قيود المخزون
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Items Table */}
            <Card className="bg-white/50 backdrop-blur-sm border border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  أصناف المخزون والحالة المالية
                </CardTitle>
                <CardDescription>
                  عرض شامل لأصناف المخزون مع التكاليف والأرباح
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="hover:bg-slate-100">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة صنف
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    تحديث الأسعار
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية
                  </Button>
                  <Button variant="outline" className="hover:bg-slate-100">
                    <FileSpreadsheet className="h-4 w-4 ml-2" />
                    تصدير
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-right border-b border-slate-200">
                        <th className="py-2 text-xs">الصنف</th>
                        <th className="py-2 text-xs">الكمية المتاحة</th>
                        <th className="py-2 text-xs">تكلفة الوحدة</th>
                        <th className="py-2 text-xs">سعر البيع</th>
                        <th className="py-2 text-xs">الربح للوحدة</th>
                        <th className="py-2 text-xs">إجمالي القيمة</th>
                        <th className="py-2 text-xs">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: "حقائب الشحن - حجم كبير", qty: "150", cost: "45", sale: "65", profit: "20", total: "6,750", status: "متوفر" },
                        { item: "صناديق الحماية المقواة", qty: "8", cost: "12", sale: "18", profit: "6", total: "96", status: "مخزون منخفض" },
                        { item: "أكياس التغليف البلاستيكية", qty: "500", cost: "2", sale: "3.5", profit: "1.5", total: "1,000", status: "متوفر" },
                        { item: "شريط لاصق للتغليف", qty: "0", cost: "8", sale: "12", profit: "4", total: "0", status: "نفذ المخزون" },
                        { item: "علامات الشحن والعناوين", qty: "75", cost: "15", sale: "25", profit: "10", total: "1,125", status: "متوفر" },
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-slate-100 hover:bg-slate-50/50 ${
                          row.status === 'نفذ المخزون' ? 'bg-red-50/50' :
                          row.status === 'مخزون منخفض' ? 'bg-amber-50/50' : ''
                        }`}>
                          <td className="py-2 text-xs font-medium">{row.item}</td>
                          <td className="py-2 text-xs font-mono">{row.qty}</td>
                          <td className="py-2 text-xs font-mono text-red-600">{row.cost} د.ل</td>
                          <td className="py-2 text-xs font-mono text-blue-600">{row.sale} د.ل</td>
                          <td className="py-2 text-xs font-mono text-green-600">{row.profit} د.ل</td>
                          <td className="py-2 text-xs font-mono text-slate-700">{row.total} د.ل</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              row.status === 'متوفر' ? 'bg-green-200 text-green-900' :
                              row.status === 'مخزون منخفض' ? 'bg-amber-200 text-amber-900' :
                              'bg-red-200 text-red-900'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}