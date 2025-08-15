"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Package,
  Users,
  CreditCard,
  Settings,
  Home,
  Calculator,
  TrendingUp,
  Ship,
  Building2,
  DollarSign,
  Crown,
  Sparkles,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Archive,
  Briefcase,
  PieChart,
  Receipt,
  Wallet,
  Database,
  Shield,
  Globe,
  BookOpen,
  Target,
  Zap,
  TestTube,
  Bug,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigationMenus = [
  {
    title: "المحاسبة الأساسية",
    icon: Calculator,
    items: [
      { name: "دليل الحسابات", href: "/accounting/chart", icon: BookOpen, description: "إدارة دليل الحسابات" },
      { name: "القيود اليومية", href: "/accounting/journal", icon: FileText, description: "تسجيل القيود المحاسبية" },
      { name: "دفتر الأستاذ", href: "/accounting/ledger", icon: Database, description: "عرض حسابات الأستاذ" },
      { name: "التقارير المالية", href: "/reports/financial", icon: PieChart, description: "التقارير المالية الأساسية" },
    ],
  },
  {
    title: "المبيعات والفواتير",
    icon: Receipt,
    items: [
      { name: "الفواتير", href: "/invoices", icon: FileText, description: "إدارة فواتير الشحن" },
      { name: "عروض الأسعار", href: "/quotes", icon: Receipt, description: "عروض أسعار الشحن" },
      { name: "أوامر الشحن", href: "/shipping-orders", icon: Package, description: "أوامر الشحن من العملاء" },
    ],
  },
  {
    title: "المشتريات والموردين",
    icon: Briefcase,
    items: [
      { name: "أوامر الشراء", href: "/purchase-orders", icon: Package, description: "أوامر الشراء من الصين" },
      { name: "فواتير الموردين", href: "/supplier-invoices", icon: FileText, description: "فواتير الموردين الصينيين" },
      { name: "الموردين", href: "/suppliers", icon: Building2, description: "إدارة الموردين في الصين" },
    ],
  },
  {
    title: "الخزينة",
    icon: Wallet,
    items: [
      { name: "المقبوضات", href: "/receipts", icon: DollarSign, description: "إدارة مقبوضات العملاء" },
      { name: "إدارة السندات", href: "/vouchers", icon: FileText, description: "سندات القبض والتسليم والصرف" },
    ],
  },
  {
    title: "إدارة الشحن",
    icon: Ship,
    items: [
      { name: "الشحنات", href: "/shipments", icon: Package, description: "إدارة الشحنات من الصين" },
      { name: "التتبع", href: "/tracking", icon: Target, description: "تتبع الشحنات" },
      { name: "التخليص الجمركي", href: "/customs", icon: Shield, description: "إجراءات التخليص في ليبيا" },
      { name: "الوثائق", href: "/documents", icon: FileText, description: "وثائق الشحن والجمارك" },
    ],
  },
  {
    title: "العملاء",
    icon: Users,
    items: [
      { name: "العملاء", href: "/clients", icon: Users, description: "إدارة العملاء الليبيين" },
      { name: "جهات الاتصال", href: "/contacts", icon: User, description: "جهات الاتصال" },
    ],
  },
  {
    title: "التقارير",
    icon: BarChart3,
    items: [
      { name: "تقارير المبيعات", href: "/reports/sales", icon: TrendingUp, description: "تقارير المبيعات" },
      { name: "تقارير الشحن", href: "/reports/shipping", icon: Ship, description: "تقارير الشحن" },
      { name: "تقارير الأرباح", href: "/reports/profit", icon: DollarSign, description: "تقارير الأرباح والخسائر" },
    ],
  },
  {
    title: "إدارة النظام",
    icon: Settings,
    items: [
              { name: "إعدادات النظام", href: "/admin/settings", icon: Settings, description: "إعدادات عامة للنظام" },
      { name: "النسخ الاحتياطي", href: "/backup", icon: Database, description: "إدارة النسخ الاحتياطية" },
      { name: "اختبار التشغيل التلقائي", href: "/automation-test", icon: Zap, description: "التحقق من سير العمل والتكامل" },
      { name: "اختبار جودة النظام", href: "/system-test", icon: TestTube, description: "اختبار شامل لجميع ميزات النظام" },
      { name: "تتبع الأخطاء", href: "/bug-tracker", icon: Bug, description: "إدارة وتتبع الأخطاء والمشاكل" },
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30" dir="rtl">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gold-200/50 glass-header shadow-lg">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                <Image src="/golden-horse-logo.svg" alt="شعار الحصان الذهبي" fill className="object-contain drop-shadow-lg" sizes="36px" priority />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-extrabold gold-text">الحصان الذهبي للشحن</span>
                <span className="text-[10px] sm:text-xs text-gold-700/80">النظام المحاسبي المتكامل</span>
              </div>
            </Link>

            {/* Center quick links (simple) */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "/shipments", label: "الشحنات" },
                { href: "/invoices", label: "الفواتير" },
                { href: "/vouchers", label: "السندات" },
                { href: "/reports/financial", label: "التقارير" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm hover:bg-gold-100 hover:text-gold-900 transition-colors",
                    pathname === l.href ? "bg-gold-100 text-gold-900" : "text-slate-700"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 sm:w-64 pr-10 h-9"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-gold-100">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs">3</Badge>
              </Button>

              {/* User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gold-100 h-9">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                      <span className="text-xs font-bold text-white">أ</span>
                    </div>
                    <div className="hidden md:flex flex-col leading-none text-right">
                      <span className="text-xs font-bold text-slate-800">أحمد محمد</span>
                      <span className="text-[10px] text-gold-700">المدير المالي</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="ml-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="ml-2 h-4 w-4" />
                    الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gold-100 h-9 w-9">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[380px]">
                  <SheetHeader className="text-right">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="relative h-7 w-7">
                        <Image src="/golden-horse-logo-simple.svg" alt="شعار الحصان الذهبي" fill className="object-contain" sizes="28px" />
                      </div>
                      <span className="text-lg font-bold gold-text">الحصان الذهبي للشحن</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="بحث..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10 h-9"
                      />
                    </div>
                  </div>
                  <nav className="mt-4 space-y-1">
                    {navigationMenus.map((menu) => (
                      <div key={menu.title} className="space-y-1">
                        <div className="px-3 py-2 text-sm font-semibold text-slate-700">{menu.title}</div>
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gold-50 hover:text-gold-900",
                              pathname === item.href ? "bg-gold-100 text-gold-900" : "text-slate-600"
                            )}
                          >
                            <item.icon className="h-4 w-4 text-gold-600" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gold-200/50 bg-gradient-to-r from-slate-50 to-gold-50/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8">
                  <Image src="/golden-horse-logo-simple.svg" alt="شعار الحصان الذهبي" fill className="object-contain" sizes="32px" />
                </div>
                <span className="text-xl font-bold gold-text">الحصان الذهبي للشحن</span>
              </div>
              <p className="text-sm text-slate-600">النظام المحاسبي المتكامل لإدارة عمليات الشحن والتجارة الدولية</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">الخدمات</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>إدارة الشحنات</li>
                <li>التخليص الجمركي</li>
                <li>التحويلات المالية</li>
                <li>التأمين</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">الدعم</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>مركز المساعدة</li>
                <li>الدعم الفني</li>
                <li>التدريب</li>
                <li>الوثائق</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">تواصل معنا</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>+218 91 234 5678</li>
                <li>info@libya-shipping.ly</li>
                <li>طرابلس، ليبيا</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gold-200/50 mt-8 pt-8 text-center text-sm text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span>© 2024 شحن ليبيا. جميع الحقوق محفوظة.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
