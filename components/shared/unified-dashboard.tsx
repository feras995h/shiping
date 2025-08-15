"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Bell, User, LogOut, Menu, Home, Search, Settings, Shield, Activity,
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown
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

export interface DashboardModule {
  title: string
  icon: any
  color: string
  items: {
    name: string
    href: string
    icon: any
  }[]
}

export interface KPICard {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
  currency?: string
}

export interface QuickAction {
  title: string
  href: string
  icon: any
  description?: string
}

export interface ReportCard {
  title: string
  href: string
  icon: any
  description?: string
}

export interface UnifiedDashboardProps {
  userRole: 'admin' | 'financial' | 'employee' | 'client'
  modules: DashboardModule[]
  kpis: KPICard[]
  quickActions: QuickAction[]
  reports: ReportCard[]
  notices: {
    type: 'success' | 'info' | 'warning' | 'error'
    title: string
    description: string
    icon: any
  }[]
  pageTitle: string
  pageDescription: string
  userTitle: string
  userSubtitle: string
  searchPlaceholder: string
  megaMenuTitle: string
  megaMenuTabs: {
    value: string
    label: string
  }[]
}

export function UnifiedDashboard({
  userRole,
  modules,
  kpis,
  quickActions,
  reports,
  notices,
  pageTitle,
  pageDescription,
  userTitle,
  userSubtitle,
  searchPlaceholder,
  megaMenuTitle,
  megaMenuTabs
}: UnifiedDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeMegaTab, setActiveMegaTab] = useState(megaMenuTabs[0]?.value || "")
  const pathname = usePathname()

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return 'from-indigo-400 to-indigo-600'
      case 'financial': return 'from-gold-400 to-gold-600'
      case 'employee': return 'from-blue-400 to-blue-600'
      case 'client': return 'from-green-400 to-green-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return Shield
      case 'financial': return Activity
      case 'employee': return User
      case 'client': return User
      default: return User
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between min-h-[48px]">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <Image src="/golden-horse-logo.svg" alt="شعار الحصان الذهبي" fill className="object-contain drop-shadow-lg" sizes="36px" priority />
                </div>
                <div className="text-center">
                  <span className="text-base sm:text-xl font-bold gold-text leading-none">الحصان الذهبي للشحن</span>
                  <div className="text-[10px] sm:text-xs text-gold-600/80">{pageTitle}</div>
                </div>
              </div>

              {/* Mega Menu */}
              <div className="hidden lg:flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className="gap-1">
                    <NavigationMenuItem>
                      <Link
                        href={`/${userRole}/dashboard`}
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-gold-100 hover:text-gold-900 focus:bg-gold-100 focus:text-gold-900",
                          pathname === `/${userRole}/dashboard` ? "bg-gold-100 text-gold-900" : "text-slate-700"
                        )}
                      >
                        <Home className="h-4 w-4 ml-2" />
                        لوحة التحكم
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9 bg-transparent px-3 hover:bg-gold-100 hover:text-gold-900 data-[state=open]:bg-gold-100 data-[state=open]:text-gold-900">
                        {megaMenuTitle}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[760px] p-4">
                          <Tabs value={activeMegaTab} onValueChange={setActiveMegaTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-lg border">
                              {megaMenuTabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                              ))}
                            </TabsList>

                            {megaMenuTabs.map((tab) => (
                              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                  {modules
                                    .filter((_, index) => {
                                      const itemsPerTab = Math.ceil(modules.length / megaMenuTabs.length)
                                      const startIndex = megaMenuTabs.indexOf(tab) * itemsPerTab
                                      const endIndex = startIndex + itemsPerTab
                                      return index >= startIndex && index < endIndex
                                    })
                                    .map((menu) => (
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
                            ))}
                          </Tabs>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gold-100">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>{megaMenuTitle}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {modules.map((menu) => (
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

            {/* Row 2 */}
            <div className="flex items-center justify-between gap-2 min-h-[40px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 h-9"
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" className="relative hover:bg-gold-100 h-9 w-9">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-gold-100 h-9">
                      <div className={`h-7 w-7 rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center`}>
                        {React.createElement(getRoleIcon(), { className: "h-4 w-4 text-white" })}
                      </div>
                      <div className="text-right hidden md:block leading-none">
                        <div className="text-xs font-bold text-slate-700">{userTitle}</div>
                        <div className="text-[10px] text-gold-600">{userSubtitle}</div>
                      </div>
                      <span className="sr-only">قائمة المستخدم</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userTitle}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userSubtitle}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
            <div className="text-xs text-gold-700/80 mb-1">{userRole.toUpperCase()}</div>
            <h1 className="text-3xl font-extrabold gold-text mb-2">{pageTitle}</h1>
            <p className="text-slate-600">{pageDescription}</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8 space-y-4">
          {notices.map((alert, index) => (
            <Alert key={index} className={`border-l-4 ${
              alert.type === "success" ? "border-gold-500" : 
              alert.type === "info" ? "border-blue-500" :
              alert.type === "warning" ? "border-amber-500" : "border-red-500"
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
          <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-900 rounded-lg">نظرة عامة</TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-900 rounded-lg">الوحدات</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-900 rounded-lg">التقارير</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi, index) => (
                <Card key={index} className="card-premium hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {kpi.title}
                    </CardTitle>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                      {kpi.value} {kpi.currency && kpi.currency}
                    </div>
                    {kpi.change && (
                      <div className={`flex items-center text-xs ${
                        kpi.changeType === "positive" ? "text-green-600" : 
                        kpi.changeType === "negative" ? "text-red-600" : "text-slate-600"
                      }`}>
                        {kpi.changeType === "positive" ? (
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        ) : kpi.changeType === "negative" ? (
                          <ArrowDownRight className="h-3 w-3 ml-1" />
                        ) : null}
                        {kpi.change}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gold-600" />
                  إجراءات سريعة
                </CardTitle>
                <CardDescription>
                  الوصول السريع للوظائف الأكثر استخداماً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <Button key={index} className="btn-gold" asChild>
                      <Link href={action.href} className="flex items-center">
                        <action.icon className="h-4 w-4 ml-2" />
                        {action.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {modules.map((module, moduleIndex) => (
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

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {reports.map((report, index) => (
                <Card key={index} className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <report.icon className="h-5 w-5 text-gold-600" />
                      {report.title}
                    </CardTitle>
                    {report.description && (
                      <CardDescription>{report.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full btn-gold" asChild>
                      <Link href={report.href} className="flex items-center">
                        <report.icon className="h-4 w-4 ml-2" />
                        عرض التقرير
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 