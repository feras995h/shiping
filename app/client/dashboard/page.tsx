"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Users, Package, Ship, Target, Bell, User, LogOut, Menu, Home, Search,
  CheckCircle, AlertCircle, PieChart, TrendingUp, BarChart3, FileText, Receipt, CreditCard,
  MessageSquare, Ticket, Mail, HelpCircle, MapPin, Settings, Shield, Percent, DollarSign,
  Star, TrendingDown
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
import { UnifiedDashboard, type DashboardModule, type KPICard, type QuickAction, type ReportCard } from "@/components/shared/unified-dashboard"
import { AdvancedKPIGrid, type AdvancedKPICard } from "@/components/shared/advanced-kpi-grid"

const enhancedClientModules: DashboardModule[] = [
  {
    title: "إدارة الشحنات",
    icon: Package,
    color: "from-cyan-400 to-cyan-600",
    items: [
      { name: "الشحنات", href: "/shipments", icon: Package },
      { name: "التتبع", href: "/tracking", icon: Target },
      { name: "الوثائق", href: "/documents", icon: FileText },
      { name: "التخليص الجمركي", href: "/customs", icon: Shield },
      { name: "التسعير", href: "/client/pricing", icon: DollarSign },
    ],
  },
  {
    title: "الفوترة",
    icon: Receipt,
    color: "from-amber-400 to-amber-600",
    items: [
      { name: "فواتيري", href: "/invoices", icon: Receipt },
      { name: "التسويات", href: "/client/settlements", icon: DollarSign },
      { name: "الخصومات", href: "/client/discounts", icon: Percent },
    ],
  },
  {
    title: "التواصل والدعم",
    icon: MessageSquare,
    color: "from-green-400 to-green-600",
    items: [
      { name: "الدردشة المباشرة", href: "/client/chat", icon: MessageSquare },
      { name: "التذاكر", href: "/client/tickets", icon: Ticket },
      { name: "الرسائل", href: "/client/messages", icon: Mail },
      { name: "الاستفسارات", href: "/client/inquiries", icon: HelpCircle },
      { name: "الشكاوى", href: "/client/complaints", icon: AlertCircle },
    ],
  },
  {
    title: "التقارير والتحليلات",
    icon: BarChart3,
    color: "from-indigo-400 to-indigo-600",
    items: [
      { name: "تقارير الشحن", href: "/reports/shipping", icon: Ship },
      { name: "التقارير المالية", href: "/client/financial-reports", icon: PieChart },
      { name: "إحصائياتي", href: "/client/my-statistics", icon: BarChart3 },
      { name: "تحليل التكلفة", href: "/client/cost-analysis", icon: TrendingUp },
      { name: "مقارنة الأسعار", href: "/client/price-comparison", icon: DollarSign },
    ],
  },
  {
    title: "الإعدادات الشخصية",
    icon: User,
    color: "from-purple-400 to-purple-600",
    items: [
      { name: "الملف الشخصي", href: "/client/profile", icon: User },
      { name: "العناوين", href: "/client/addresses", icon: MapPin },
      { name: "التفضيلات", href: "/client/preferences", icon: Settings },
      { name: "الإشعارات", href: "/client/notifications", icon: Bell },
      { name: "الأمان", href: "/client/security", icon: Shield },
    ],
  },
]

const enhancedClientKPIs: KPICard[] = [
  { title: "شحنات نشطة", value: "5", change: "+1", changeType: "positive", icon: Package, color: "text-cyan-600" },
  { title: "فواتير مستحقة", value: "2", change: "0", changeType: "neutral", icon: Receipt, color: "text-amber-600" },
  { title: "فواتير هذا الشهر", value: "3", change: "+1", changeType: "positive", icon: Receipt, color: "text-green-600" },
  { title: "تنبيهات", value: "1", change: "-2", changeType: "positive", icon: Bell, color: "text-red-600" },
  { title: "معدل الرضا", value: "4.5/5", change: "+0.2", changeType: "positive", icon: Star, color: "text-gold-600" },
  { title: "التوفير المحقق", value: "15%", change: "+3%", changeType: "positive", icon: TrendingDown, color: "text-green-600" },
]

const clientAdvancedKPIs: AdvancedKPICard[] = [
  { title: "وقت التسليم المتوسط", value: "3.2 يوم", change: "-0.4ي", changeType: "positive", icon: Ship, color: "text-cyan-600", trend: { data: [4.1,3.9,3.7,3.5,3.4,3.2], labels: [] }, status: 'ahead', target: "≤ 3 أيام" },
  { title: "معدل الاستجابة للدعم", value: "2.4 ساعة", change: "-0.3س", changeType: "positive", icon: MessageSquare, color: "text-green-600", trend: { data: [3.1,2.9,2.8,2.6,2.5,2.4], labels: [] }, status: 'on-track', target: "≤ 2س" },
  { title: "نسبة الالتزام بالمواعيد", value: "95%", change: "+1%", changeType: "positive", icon: Target, color: "text-blue-600", trend: { data: [92,93,93,94,94,95], labels: [] }, status: 'on-track', target: ">= 96%" },
  { title: "إنفاق شهري", value: "12,450 د.ل", change: "+8%", changeType: "positive", icon: DollarSign, color: "text-amber-600", trend: { data: [9500,10200,10800,11300,11800,12450], labels: [] }, status: 'on-track' },
]

const clientQuickActions: QuickAction[] = [
  { title: "استعراض الشحنات", href: "/shipments", icon: Package },
  { title: "التتبع", href: "/tracking", icon: Target },
  { title: "فواتيري", href: "/invoices", icon: Receipt },
  { title: "التسويات", href: "/client/settlements", icon: DollarSign },
]

const clientReports: ReportCard[] = [
  { title: "تقرير الشحن الشخصي", href: "/client/shipping-report", icon: Ship, description: "متابعة شحناتك وتفاصيلها" },
  { title: "التقرير المالي", href: "/client/financial-report", icon: PieChart, description: "تحليل الفواتير والمدفوعات" },
  { title: "تحليل التكلفة", href: "/client/cost-analysis", icon: TrendingUp, description: "مقارنة التكاليف والتحسينات" },
  { title: "تقرير الرضا", href: "/client/satisfaction-report", icon: Star, description: "تقييم الخدمة والرضا" },
]

const clientNotices = [
  { type: "success" as const, title: "تم تحميل مستند", description: "تم استلام بوليصة الشحن للشحنة GH-2025-003.", icon: CheckCircle },
  { type: "info" as const, title: "تنبيه فاتورة", description: "فاتورة INV-2025-012 بانتظار السداد.", icon: AlertCircle },
]

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <UnifiedDashboard
        userRole="client"
        modules={enhancedClientModules}
        kpis={enhancedClientKPIs}
        quickActions={clientQuickActions}
        reports={clientReports}
        notices={clientNotices}
        pageTitle="لوحة العميل"
        pageDescription="متابعة الشحنات، الفواتير والمدفوعات، والتقارير"
        userTitle="العميل"
        userSubtitle="حساب عميل"
        searchPlaceholder="ابحث عن شحنة أو فاتورة..."
        megaMenuTitle="قائمة العميل"
        megaMenuTabs={[
          { value: "الشحن", label: "الشحن" },
          { value: "الفوترة", label: "الفوترة" },
          { value: "التواصل", label: "التواصل" },
          { value: "التقارير", label: "التقارير" },
        ]}
      />
      <div className="container mx-auto px-4">
        <AdvancedKPIGrid kpis={clientAdvancedKPIs} showTrends showCharts columns={4} />
      </div>
    </div>
  )
}
