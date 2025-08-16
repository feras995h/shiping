"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ClipboardList, Calendar, Package, Ship, Target, Bell, User, LogOut, Menu, Home, Search,
  CheckCircle, AlertCircle, PieChart, TrendingUp, BarChart3, FileText, MessageSquare, Phone,
  Building, Briefcase, Star, Settings, HelpCircle, Folder, Truck, Wrench, MapPin,
  Shield, Globe, Users, BookOpen
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
import { AdvancedWorkflow, type WorkflowStep } from "@/components/shared/advanced-workflow"

const enhancedEmployeeModules: DashboardModule[] = [
  {
    title: "المهام والعمليات",
    icon: ClipboardList,
    color: "from-blue-400 to-blue-600",
    items: [
      { name: "قائمة المهام", href: "/employee/tasks", icon: ClipboardList },
      { name: "التقويم", href: "/employee/calendar", icon: Calendar },
      { name: "سير العمل", href: "/employee/workflow", icon: TrendingUp },
      { name: "المشاريع", href: "/employee/projects", icon: Folder },
      { name: "التقييمات", href: "/employee/evaluations", icon: Star },
    ],
  },
  {
    title: "إدارة الشحن المتقدمة",
    icon: Ship,
    color: "from-cyan-400 to-cyan-600",
    items: [
      { name: "الشحنات", href: "/shipments", icon: Package },
      { name: "التتبع", href: "/tracking", icon: Target },
      { name: "التخليص الجمركي", href: "/customs", icon: Shield },
      { name: "المستندات", href: "/documents", icon: FileText },
      { name: "التنسيق مع الوكالات", href: "/employee/agent-coordination", icon: Globe },
    ],
  },
  {
    title: "التواصل والعملاء",
    icon: Users,
    color: "from-green-400 to-green-600",
    items: [
      { name: "العملاء", href: "/clients", icon: Users },
      { name: "جهات الاتصال", href: "/contacts", icon: Phone },
      { name: "الرسائل", href: "/employee/messages", icon: MessageSquare },
      { name: "التقارير", href: "/employee/reports", icon: FileText },
      { name: "الدعم الفني", href: "/employee/support", icon: HelpCircle },
    ],
  },
  {
    title: "الموارد والمستودعات",
    icon: Building,
    color: "from-orange-400 to-orange-600",
    items: [
      { name: "إدارة المخزون", href: "/employee/inventory", icon: Package },
      { name: "المستودعات", href: "/warehouses", icon: Building },
      { name: "الأصول", href: "/employee/assets", icon: Briefcase },
      { name: "المركبات", href: "/employee/vehicles", icon: Truck },
      { name: "المعدات", href: "/employee/equipment", icon: Wrench },
    ],
  },
  {
    title: "التقارير والأداء",
    icon: BarChart3,
    color: "from-indigo-400 to-indigo-600",
    items: [
      { name: "تقارير العمليات", href: "/reports/operations", icon: PieChart },
      { name: "تقارير الأداء", href: "/reports/performance", icon: TrendingUp },
      { name: "إحصائياتي", href: "/employee/my-stats", icon: BarChart3 },
      { name: "التقييمات", href: "/employee/evaluations", icon: Star },
      { name: "الأهداف", href: "/employee/goals", icon: Target },
    ],
  },
  {
    title: "الإعدادات الشخصية",
    icon: User,
    color: "from-purple-400 to-purple-600",
    items: [
      { name: "الملف الشخصي", href: "/employee/profile", icon: User },
      { name: "إدارة الإعلانات", href: "/employee/advertisements", icon: Settings },
      { name: "الدعم الفني", href: "/employee/support", icon: Settings },
      { name: "التدريب", href: "/employee/training", icon: BookOpen },
      { name: "المساعدة", href: "/employee/help", icon: HelpCircle },
    ],
  },
]

const enhancedEmployeeKPIs: KPICard[] = [
  { title: "مهام اليوم", value: "7", change: "+2", changeType: "positive", icon: ClipboardList, color: "text-blue-600" },
  { title: "شحنات قيد المعالجة", value: "24", change: "-1", changeType: "negative", icon: Package, color: "text-cyan-600" },
  { title: "متابعات مطلوبة", value: "3", change: "+1", changeType: "positive", icon: Target, color: "text-amber-600" },
  { title: "وثائق ناقصة", value: "5", change: "0", changeType: "neutral", icon: FileText, color: "text-purple-600" },
]

const employeeAdvancedKPIs: AdvancedKPICard[] = [
  { title: "معدل الإنجاز", value: "87%", change: "+3%", changeType: "positive", icon: TrendingUp, color: "text-green-600", trend: { data: [70,72,75,80,84,87], labels: [] }, status: 'on-track', target: "90%" },
  { title: "زمن الاستجابة", value: "1.8 ساعة", change: "-0.2س", changeType: "positive", icon: BarChart3, color: "text-amber-600", trend: { data: [3.2,2.8,2.5,2.2,2.0,1.8], labels: [] }, status: 'ahead', target: "< 2س" },
  { title: "رضا العملاء", value: "4.2/5", change: "+0.1", changeType: "positive", icon: Star, color: "text-gold-600", trend: { data: [3.9,4.0,4.1,4.1,4.2,4.2], labels: [] }, status: 'on-track', target: ">= 4.5" },
  { title: "نسبة الالتزام بالمواعيد", value: "93%", change: "+2%", changeType: "positive", icon: Target, color: "text-blue-600", trend: { data: [88,89,90,91,92,93], labels: [] }, status: 'on-track', target: ">= 95%" },
]

const employeeQuickActions: QuickAction[] = [
  { title: "فتح الشحنات", href: "/shipments", icon: Package },
  { title: "فتح التتبع", href: "/tracking", icon: Target },
  { title: "إدارة المستندات", href: "/documents", icon: FileText },
  { title: "تقارير العمليات", href: "/reports/shipping", icon: PieChart },
]

const employeeReports: ReportCard[] = [
  { title: "تقرير المهام اليومية", href: "/employee/daily-tasks", icon: ClipboardList, description: "متابعة المهام المطلوبة اليوم" },
  { title: "تقرير الشحن", href: "/reports/shipping", icon: Ship, description: "إحصائيات الشحن والتتبع" },
  { title: "تقرير الأداء الشخصي", href: "/employee/performance", icon: TrendingUp, description: "تحليل أداء الموظف" },
  { title: "تقرير العملاء", href: "/employee/customer-reports", icon: Users, description: "متابعة العملاء والاتصالات" },
]

const employeeNotices = [
  { type: "success" as const, title: "تذكير مهام", description: "تم إكمال 4 مهام هذا الصباح.", icon: CheckCircle },
  { type: "info" as const, title: "تنبيه شحنة", description: "الشحنة GH-2025-010 تحتاج مراجعة مستند.", icon: AlertCircle },
]

// سير العمل المتقدم للموظف
const advancedWorkflowSteps: WorkflowStep[] = [
  {
    id: "task-assignment",
    title: "استلام المهمة",
    description: "استلام المهمة من المدير أو النظام",
    status: "completed",
    completedAt: "2024-01-15T09:00:00Z",
    estimatedDuration: 15,
    actualDuration: 12,
    assignee: "أحمد محمد",
    priority: "medium"
  },
  {
    id: "planning",
    title: "التخطيط والتحضير",
    description: "تحضير المستندات والموارد المطلوبة",
    status: "completed",
    completedAt: "2024-01-15T09:30:00Z",
    estimatedDuration: 30,
    actualDuration: 25,
    assignee: "أحمد محمد",
    priority: "medium"
  },
  {
    id: "execution",
    title: "تنفيذ المهمة",
    description: "تنفيذ المهمة المطلوبة",
    status: "in_progress",
    startedAt: "2024-01-15T10:00:00Z",
    estimatedDuration: 120,
    assignee: "أحمد محمد",
    priority: "high",
    dependencies: ["task-assignment", "planning"]
  },
  {
    id: "quality-check",
    title: "فحص الجودة",
    description: "فحص جودة العمل المنجز",
    status: "pending",
    estimatedDuration: 45,
    assignee: "أحمد محمد",
    priority: "high",
    dependencies: ["execution"]
  },
  {
    id: "documentation",
    title: "التوثيق",
    description: "توثيق العمل المنجز والمستندات",
    status: "pending",
    estimatedDuration: 30,
    assignee: "أحمد محمد",
    priority: "medium",
    dependencies: ["quality-check"]
  },
  {
    id: "submission",
    title: "تقديم العمل",
    description: "تقديم العمل المنجز للمراجعة النهائية",
    status: "pending",
    estimatedDuration: 15,
    assignee: "أحمد محمد",
    priority: "high",
    dependencies: ["documentation"]
  }
]

export default function EmployeeDashboardPage() {
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState("execution")

  const handleStepClick = (stepId: string) => {
    // معالجة النقر على الخطوة
    setCurrentWorkflowStep(stepId)
  }

  const handleStatusChange = (stepId: string, status: WorkflowStep['status']) => {
    // معالجة تغيير الحالة
    // يمكن إضافة منطق تحديث الحالة هنا
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
      {/* استخدام المكون الموحد */}
      <UnifiedDashboard
        userRole="employee"
        modules={enhancedEmployeeModules}
        kpis={enhancedEmployeeKPIs}
        quickActions={employeeQuickActions}
        reports={employeeReports}
        notices={employeeNotices}
        pageTitle="لوحة الموظف"
        pageDescription="مهام اليوم، الشحنات، المستندات وسير العمل"
        userTitle="موظف"
        userSubtitle="صلاحيات تشغيل"
        searchPlaceholder="ابحث عن مهمة أو شحنة..."
        megaMenuTitle="قائمة الموظف"
        megaMenuTabs={[
          { value: "المهام", label: "المهام" },
          { value: "الشحن", label: "الشحن" },
          { value: "التقارير", label: "التقارير" },
          { value: "الإعدادات", label: "الإعدادات" },
        ]}
      />

      <div className="container mx-auto px-4">
        <AdvancedKPIGrid kpis={employeeAdvancedKPIs} showTrends showCharts columns={4} className="mt-6" />
      </div>

      {/* إضافة سير العمل المتقدم في تبويب منفصل */}
      <div className="container mx-auto px-4 py-8">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gold-600" />
              سير العمل المتقدم
            </CardTitle>
            <CardDescription>
              تتبع تفصيلي لسير العمل والمهام المطلوبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedWorkflow
              steps={advancedWorkflowSteps}
              currentStep={currentWorkflowStep}
              showProgress={true}
              showTimeline={true}
              showActions={true}
              onStepClick={handleStepClick}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}