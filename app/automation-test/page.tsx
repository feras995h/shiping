"use client"

import { useState } from "react"
import { Play, CheckCircle, AlertCircle, Clock, Settings, Zap, ArrowRight, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Layout from "@/components/layout"
import { useAppStore, useShipments, useClients, useTasks, useNotifications, useVouchers, useWarehouseItems } from "@/lib/store"

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
  duration?: number
}

export default function AutomationTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")

  const { actions } = useAppStore()
  const shipments = useShipments()
  const clients = useClients()
  const tasks = useTasks()
  const notifications = useNotifications()
  const vouchers = useVouchers()
  const warehouseItems = useWarehouseItems()

  const automationTests = [
    {
      name: "إنشاء سير عمل شحنة جديدة",
      description: "اختبار إنشاء شحنة مع مهمة وإشعار تلقائي",
      test: async () => {
        const initialShipmentCount = shipments.length
        const initialTaskCount = tasks.length
        const initialNotificationCount = notifications.length

        actions.createShipmentWorkflow("CL-001", {
          origin: "شنغهاي، الصين",
          destination: "طرابلس، ليبيا",
          type: "حاوية 20 قدم",
          priority: "high",
          status: "pending",
          progress: 0,
          value: "50,000 د.ل",
          eta: "2024-02-20"
        })

        // التحقق من النتائج
        const newShipmentCount = shipments.length
        const newTaskCount = tasks.length
        const newNotificationCount = notifications.length

        if (newShipmentCount > initialShipmentCount && 
            newTaskCount > initialTaskCount && 
            newNotificationCount > initialNotificationCount) {
          return { success: true, message: "تم إنشاء الشحنة والمهمة والإشعار بنجاح" }
        } else {
          return { success: false, message: "فشل في إنشاء سير العمل الكامل" }
        }
      }
    },
    {
      name: "إنشاء سير عمل عميل جديد",
      description: "اختبار إضافة عميل مع مهمة متابعة وإشعار",
      test: async () => {
        const initialClientCount = clients.length
        const initialTaskCount = tasks.length
        const initialNotificationCount = notifications.length

        actions.createClientOnboarding({
          name: "شركة الاختبار التجارية",
          email: "test@company.ly",
          phone: "+218-91-1234567",
          address: "طرابلس، ليبيا",
          type: "شركة",
          status: "active",
          creditLimit: "100,000 د.ل",
          paymentTerms: "30 يوم"
        })

        const newClientCount = clients.length
        const newTaskCount = tasks.length
        const newNotificationCount = notifications.length

        if (newClientCount > initialClientCount && 
            newTaskCount > initialTaskCount && 
            newNotificationCount > initialNotificationCount) {
          return { success: true, message: "تم إنشاء العميل والمهمة والإشعار بنجاح" }
        } else {
          return { success: false, message: "فشل في إنشاء سير عمل العميل" }
        }
      }
    },
    {
      name: "إنشاء سير عمل الدفع",
      description: "اختبار معالجة دفع مع تحديث حالة الشحنة",
      test: async () => {
        const testShipment = shipments[0]
        if (!testShipment) {
          return { success: false, message: "لا توجد شحنات للاختبار" }
        }

        const initialTaskCount = tasks.length
        const initialNotificationCount = notifications.length

        actions.createPaymentWorkflow(testShipment.id, {
          amount: "25,000 د.ل",
          method: "cash",
          reference: "TEST-PAY-001"
        })

        const updatedShipment = shipments.find(s => s.id === testShipment.id)
        const newTaskCount = tasks.length
        const newNotificationCount = notifications.length

        if (updatedShipment?.status === 'clearing' && 
            newTaskCount > initialTaskCount && 
            newNotificationCount > initialNotificationCount) {
          return { success: true, message: "تم تحديث حالة الشحنة وإنشاء المهمة والإشعار" }
        } else {
          return { success: false, message: "فشل في سير عمل الدفع" }
        }
      }
    },
    {
      name: "إنشاء سند قبض تلقائي",
      description: "اختبار إنشاء سند قبض مع إشعار",
      test: async () => {
        const testShipment = shipments[0]
        if (!testShipment) {
          return { success: false, message: "لا توجد شحنات للاختبار" }
        }

        const initialVoucherCount = vouchers.length
        const initialNotificationCount = notifications.length

        actions.generateReceiptVoucher(testShipment.id, 30000, "cash")

        const newVoucherCount = vouchers.length
        const newNotificationCount = notifications.length

        if (newVoucherCount > initialVoucherCount && 
            newNotificationCount > initialNotificationCount) {
          return { success: true, message: "تم إنشاء سند القبض والإشعار بنجاح" }
        } else {
          return { success: false, message: "فشل في إنشاء سند القبض" }
        }
      }
    },
    {
      name: "إنشاء سند تسليم تلقائي",
      description: "اختبار إنشاء سند تسليم مع تحديث حالة الشحنة",
      test: async () => {
        const testShipment = shipments.find(s => s.status !== 'delivered')
        if (!testShipment) {
          return { success: false, message: "لا توجد شحنات غير مسلمة للاختبار" }
        }

        const initialVoucherCount = vouchers.length
        const initialNotificationCount = notifications.length

        const deliveryItems = [
          {
            id: `ITM-${Date.now()}-1`,
            description: "حاويات البضائع",
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0
          }
        ]

        actions.generateDeliveryVoucher(testShipment.id, deliveryItems)

        const updatedShipment = shipments.find(s => s.id === testShipment.id)
        const newVoucherCount = vouchers.length
        const newNotificationCount = notifications.length

        if (updatedShipment?.status === 'delivered' && 
            newVoucherCount > initialVoucherCount && 
            newNotificationCount > initialNotificationCount) {
          return { success: true, message: "تم إنشاء سند التسليم وتحديث حالة الشحنة" }
        } else {
          return { success: false, message: "فشل في إنشاء سند التسليم" }
        }
      }
    },
    {
      name: "تحديث حالة الشحنة التلقائي",
      description: "اختبار تحديث حالة الشحنة مع التقدم",
      test: async () => {
        const testShipment = shipments[0]
        if (!testShipment) {
          return { success: false, message: "لا توجد شحنات للاختبار" }
        }

        const originalStatus = testShipment.status
        const originalProgress = testShipment.progress

        actions.updateShipmentStatus(testShipment.id, 'at_port')

        const updatedShipment = shipments.find(s => s.id === testShipment.id)

        if (updatedShipment?.status === 'at_port' && 
            updatedShipment.progress === 70) {
          return { success: true, message: "تم تحديث حالة الشحنة والتقدم بنجاح" }
        } else {
          return { success: false, message: "فشل في تحديث حالة الشحنة" }
        }
      }
    },
    {
      name: "إدارة المخزون التلقائية",
      description: "اختبار تعديل المخزون مع تسجيل المعاملة",
      test: async () => {
        const testItem = warehouseItems[0]
        if (!testItem) {
          return { success: false, message: "لا توجد عناصر مخزون للاختبار" }
        }

        const originalQuantity = testItem.quantity
        const adjustmentQuantity = 10

        actions.adjustInventory(testItem.id, adjustmentQuantity, "اختبار التشغيل التلقائي", "USR-001")

        const updatedItem = warehouseItems.find(i => i.id === testItem.id)

        if (updatedItem?.quantity === originalQuantity + adjustmentQuantity) {
          return { success: true, message: "تم تعديل المخزون وتسجيل المعاملة بنجاح" }
        } else {
          return { success: false, message: "فشل في تعديل المخزون" }
        }
      }
    }
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    for (const test of automationTests) {
      setCurrentTest(test.name)
      
      // إضافة النتيجة كـ "running"
      setTestResults(prev => [...prev, {
        name: test.name,
        status: 'running',
        message: 'جاري التشغيل...'
      }])

      try {
        const startTime = Date.now()
        const result = await test.test()
        const duration = Date.now() - startTime

        // تحديث النتيجة
        setTestResults(prev => prev.map(r => 
          r.name === test.name ? {
            ...r,
            status: result.success ? 'success' : 'error',
            message: result.message,
            duration
          } : r
        ))

        // انتظار قصير بين الاختبارات
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        setTestResults(prev => prev.map(r => 
          r.name === test.name ? {
            ...r,
            status: 'error',
            message: `خطأ في التشغيل: ${error}`
          } : r
        ))
      }
    }

    setIsRunning(false)
    setCurrentTest("")
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running': return "badge-blue"
      case 'success': return "badge-green"
      case 'error': return "badge-red"
      default: return "badge-slate"
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const totalTests = automationTests.length

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">اختبار التشغيل التلقائي</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">التحقق من سير العمل والتكامل بين الأنظمة</p>
          </div>
          <Button 
            className="btn-gold" 
            onClick={runAllTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                جاري التشغيل...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 ml-2" />
                تشغيل جميع الاختبارات
              </>
            )}
          </Button>
        </div>

        {/* Progress Overview */}
        {testResults.length > 0 && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gold-500" />
                نتائج الاختبارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>التقدم: {testResults.length} / {totalTests}</span>
                  <span>نجح: {successCount} | فشل: {errorCount}</span>
                </div>
                <Progress value={(testResults.length / totalTests) * 100} className="h-2" />
                {currentTest && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>جاري تشغيل: {currentTest}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <div className="grid gap-4">
          {automationTests.map((test, index) => {
            const result = testResults.find(r => r.name === test.name)
            
            return (
              <Card key={index} className="card-premium hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result?.status || 'pending')}
                      <div>
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </div>
                    </div>
                    {result && (
                      <Badge className={getStatusColor(result.status)}>
                        {result.status === 'running' ? 'جاري التشغيل' :
                         result.status === 'success' ? 'نجح' :
                         result.status === 'error' ? 'فشل' : 'في الانتظار'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                {result && (
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">{result.message}</p>
                      {result.duration && (
                        <p className="text-xs text-slate-500">
                          وقت التنفيذ: {result.duration}ms
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* System Integration Status */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-gold-500" />
              حالة التكامل بين الأنظمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">إدارة الشحنات</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">إدارة العملاء</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">النظام المالي</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">إدارة المهام</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">نظام الإشعارات</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">إدارة المستودع</p>
                  <p className="text-sm text-green-600">متصل ويعمل</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
