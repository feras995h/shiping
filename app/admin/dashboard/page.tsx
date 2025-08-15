"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Shield, Settings, Users, Server, Activity, Bell, User, LogOut, Menu, Home, Search,
  PieChart, TrendingUp, BarChart3, CheckCircle, AlertCircle, Plus, Wrench, Database, Globe, Key,
  Building, Archive, Cloud, AlertTriangle, Search as SearchIcon, Zap, BookOpen, Target,
  FileText, Building2, Shield as ShieldIcon, Activity as ActivityIcon, BarChart3 as BarChart3Icon,
  Settings as SettingsIcon, Globe as GlobeIcon, Shield as ShieldIcon2
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

const enhancedAdminModules: DashboardModule[] = [
  {
    title: "إدارة النظام الأساسية",
    icon: Settings,
    color: "from-indigo-400 to-indigo-600",
    items: [
      { name: "إعدادات الموقع", href: "/admin/settings", icon: Wrench },
      { name: "المستخدمون والصلاحيات", href: "/admin/users", icon: Key },
      { name: "الأدوار والصلاحيات", href: "/admin/roles", icon: Shield },
      { name: "الخوادم والتكاملات", href: "/admin/integrations", icon: Server },
      { name: "النسخ الاحتياطية", href: "/admin/backups", icon: Database },
    ],
  },
  {
    title: "إدارة البيانات الشاملة",
    icon: Database,
    color: "from-teal-400 to-teal-600",
    items: [
      { name: "العملاء", href: "/clients", icon: Users },
      { name: "الموردون", href: "/suppliers", icon: Building2 },
      { name: "الموظفون", href: "/employees", icon: User },
      { name: "الوثائق", href: "/documents", icon: FileText },
      { name: "الأرشيف", href: "/archive", icon: Archive },
    ],
  },
  {
    title: "إدارة الشحن المتقدمة",
    icon: Globe,
    color: "from-cyan-400 to-cyan-600",
    items: [
      { name: "الشحنات", href: "/shipments", icon: Globe },
      { name: "التتبع", href: "/tracking", icon: Target },
      { name: "التخليص الجمركي", href: "/customs", icon: Shield },
      { name: "المستودعات", href: "/warehouses", icon: Building },
      { name: "الوكالات", href: "/agents", icon: Globe },
    ],
  },
  {
    title: "المراقبة والأمان",
    icon: Activity,
    color: "from-purple-400 to-purple-600",
    items: [
      { name: "لوحة الأداء", href: "/admin/performance", icon: Activity },
      { name: "مراقبة النظام", href: "/admin/monitoring", icon: ActivityIcon },
      { name: "سجلات الأمان", href: "/admin/security-logs", icon: Shield },
      { name: "التنبيهات", href: "/admin/alerts", icon: Bell },
      { name: "المراجعة", href: "/admin/audit", icon: SearchIcon },
    ],
  },
  {
    title: "التقارير والإحصائيات",
    icon: BarChart3,
    color: "from-orange-400 to-orange-600",
    items: [
      { name: "التقارير العامة", href: "/reports", icon: PieChart },
      { name: "إحصائيات النظام", href: "/admin/statistics", icon: TrendingUp },
      { name: "تقارير الأداء", href: "/admin/performance-reports", icon: BarChart3Icon },
      { name: "تحليلات الاستخدام", href: "/admin/analytics", icon: Activity },
    ],
  },
  {
    title: "إدارة التكاملات",
    icon: Cloud,
    color: "from-pink-400 to-pink-600",
    items: [
      { name: "الجمارك", href: "/admin/customs-integrations", icon: Shield },
      { name: "الشركات الشريكة", href: "/admin/partner-integrations", icon: Building2 },
      { name: "الخدمات السحابية", href: "/admin/cloud-services", icon: Cloud },
    ],
  },
  {
    title: "إدارة الجودة والامتثال",
    icon: ShieldIcon,
    color: "from-red-400 to-red-600",
    items: [
      { name: "معايير الجودة", href: "/admin/quality-standards", icon: CheckCircle },
      { name: "الامتثال القانوني", href: "/admin/compliance", icon: ShieldIcon2 },
      { name: "إدارة المخاطر", href: "/admin/risk-management", icon: AlertTriangle },
      { name: "التدقيق الداخلي", href: "/admin/internal-audit", icon: SearchIcon },
    ],
  },
  {
    title: "الإعدادات المتقدمة",
    icon: SettingsIcon,
    color: "from-gray-400 to-gray-600",
    items: [
              { name: "إعدادات النظام", href: "/admin/settings", icon: Settings },
      { name: "إعدادات الأمان", href: "/admin/security-settings", icon: Shield },
      { name: "إعدادات الأداء", href: "/admin/performance-settings", icon: Zap },
      { name: "إعدادات التكامل", href: "/admin/integration-settings", icon: GlobeIcon },
    ],
  },
]

const enhancedAdminKPIs: KPICard[] = [
  { title: "عدد المستخدمين", value: "128", change: "+3%", changeType: "positive", icon: Users, color: "text-indigo-600" },
  { title: "عمليات الدخول اليوم", value: "312", change: "+8%", changeType: "positive", icon: Activity, color: "text-green-600" },
  { title: "التكاملات النشطة", value: "7", change: "0%", changeType: "neutral", icon: Server, color: "text-teal-600" },
  { title: "تنبيهات الأمان", value: "2", change: "-1", changeType: "positive", icon: Shield, color: "text-red-600" },
  { title: "الشحنات النشطة", value: "45", change: "+12%", changeType: "positive", icon: Globe, color: "text-cyan-600" },
  { title: "معدل الأداء", value: "94%", change: "+2%", changeType: "positive", icon: TrendingUp, color: "text-gold-600" },
]

const adminQuickActions: QuickAction[] = [
  { title: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
  { title: "إدارة العملاء", href: "/clients", icon: Users },
  { title: "إدارة الموردين", href: "/suppliers", icon: Building2 },
  { title: "تقارير عامة", href: "/reports", icon: BarChart3 },
]

const adminReports: ReportCard[] = [
  { title: "التقرير المالي الشامل", href: "/reports/financial", icon: PieChart, description: "تحليل شامل للأداء المالي" },
  { title: "تقرير الشحن", href: "/reports/shipping", icon: Globe, description: "إحصائيات الشحن والتتبع" },
  { title: "تقرير الأداء", href: "/admin/performance-reports", icon: Activity, description: "مؤشرات أداء النظام" },
  { title: "تقرير الأمان", href: "/admin/security-reports", icon: Shield, description: "تحليل الأمان والتهديدات" },
]

const adminNotices = [
  { type: "success" as const, title: "تهيئة ناجحة", description: "تم تحديث إعدادات الموقع.", icon: CheckCircle },
  { type: "info" as const, title: "تنبيه صلاحيات", description: "تمت إضافة دور جديد: مدير المحتوى.", icon: AlertCircle },
]

export default function AdminDashboardPage() {
  return (
    <UnifiedDashboard
      userRole="admin"
      modules={enhancedAdminModules}
      kpis={enhancedAdminKPIs}
      quickActions={adminQuickActions}
      reports={adminReports}
      notices={adminNotices}
      pageTitle="لوحة مدير النظام"
      pageDescription="إدارة شاملة للنظام والمستخدمين والصلاحيات والمراقبة"
      userTitle="مدير النظام"
      userSubtitle="صلاحيات كاملة"
      searchPlaceholder="بحث إداري..."
      megaMenuTitle="القائمة الإدارية"
      megaMenuTabs={[
        { value: "النظام", label: "النظام" },
        { value: "البيانات", label: "البيانات" },
        { value: "المراقبة", label: "المراقبة" },
        { value: "الإعدادات", label: "الإعدادات" },
      ]}
    />
  )
}
