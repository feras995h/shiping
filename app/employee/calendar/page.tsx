"use client"

import { useState, useEffect } from "react"
import {
  Calendar, Clock, User, MapPin, AlertCircle, CheckCircle, 
  ChevronLeft, ChevronRight, Plus, Filter, Search, CalendarDays
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarEvent {
  id: string
  title: string
  description: string
  type: 'meeting' | 'task' | 'deadline' | 'reminder' | 'shipment' | 'customs'
  startDate: string
  endDate: string
  allDay: boolean
  location?: string
  attendees?: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  color: string
  reminder?: string
  notes?: string
}

export default function EmployeeCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockEvents: CalendarEvent[] = [
          {
            id: "EVT-001",
            title: "اجتماع مراجعة الشحنات الأسبوعي",
            description: "مراجعة حالة جميع الشحنات والتخطيط للأسبوع القادم",
            type: "meeting",
            startDate: "2024-01-15T10:00:00Z",
            endDate: "2024-01-15T11:30:00Z",
            allDay: false,
            location: "قاعة الاجتماعات الرئيسية",
            attendees: ["مدير العمليات", "أحمد محمد", "فاطمة علي", "محمد حسن"],
            priority: "high",
            status: "pending",
            color: "blue",
            reminder: "15 minutes"
          },
          {
            id: "EVT-002",
            title: "موعد نهائي: تسليم مستندات الشحنة GH-2025-010",
            description: "آخر موعد لتسليم جميع المستندات المطلوبة للتخليص الجمركي",
            type: "deadline",
            startDate: "2024-01-20T17:00:00Z",
            endDate: "2024-01-20T17:00:00Z",
            allDay: true,
            priority: "urgent",
            status: "pending",
            color: "red",
            reminder: "1 day"
          },
          {
            id: "EVT-003",
            title: "وصول شحنة الحاويات من شنغهاي",
            description: "وصول شحنة الحاويات إلى ميناء طرابلس",
            type: "shipment",
            startDate: "2024-01-18T08:00:00Z",
            endDate: "2024-01-18T16:00:00Z",
            allDay: true,
            location: "ميناء طرابلس",
            priority: "high",
            status: "pending",
            color: "green",
            reminder: "2 hours"
          },
          {
            id: "EVT-004",
            title: "بدء التخليص الجمركي للشحنة",
            description: "بدء إجراءات التخليص الجمركي للشحنة الواردة",
            type: "customs",
            startDate: "2024-01-19T09:00:00Z",
            endDate: "2024-01-19T12:00:00Z",
            allDay: false,
            location: "مكتب الجمارك",
            priority: "medium",
            status: "pending",
            color: "orange",
            reminder: "30 minutes"
          },
          {
            id: "EVT-005",
            title: "تدريب الموظف الجديد على النظام",
            description: "جلسة تدريبية للموظف الجديد على استخدام نظام إدارة الشحن",
            type: "task",
            startDate: "2024-01-22T14:00:00Z",
            endDate: "2024-01-22T17:00:00Z",
            allDay: false,
            location: "قاعة التدريب",
            attendees: ["أحمد محمد", "الموظف الجديد"],
            priority: "low",
            status: "pending",
            color: "purple",
            reminder: "1 hour"
          },
          {
            id: "EVT-006",
            title: "تذكير: إعداد تقرير الأداء الشهري",
            description: "تذكير بإعداد تقرير الأداء الشهري وإرساله للإدارة",
            type: "reminder",
            startDate: "2024-01-25T09:00:00Z",
            endDate: "2024-01-25T09:00:00Z",
            allDay: true,
            priority: "medium",
            status: "pending",
            color: "yellow",
            reminder: "1 day"
          },
          {
            id: "EVT-007",
            title: "اجتماع مع وكيل الشحن في شنغهاي",
            description: "اجتماع عبر الفيديو مع وكيل الشحن لتنسيق الشحنات القادمة",
            type: "meeting",
            startDate: "2024-01-16T15:00:00Z",
            endDate: "2024-01-16T16:00:00Z",
            allDay: false,
            location: "Zoom Meeting",
            attendees: ["أحمد محمد", "وكيل الشحن"],
            priority: "high",
            status: "pending",
            color: "blue",
            reminder: "10 minutes"
          },
          {
            id: "EVT-008",
            title: "فحص جودة البضائع المستلمة",
            description: "فحص جودة البضائع المستلمة من الشحنة الأخيرة",
            type: "task",
            startDate: "2024-01-17T10:00:00Z",
            endDate: "2024-01-17T12:00:00Z",
            allDay: false,
            location: "المستودع الرئيسي",
            priority: "medium",
            status: "pending",
            color: "green",
            reminder: "1 hour"
          }
        ]
        
        setEvents(mockEvents)
        setFilteredEvents(mockEvents)
      } catch (error) {
        console.error("خطأ في جلب الأحداث:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // تصفية الأحداث
  useEffect(() => {
    let filtered = events

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(event => event.priority === priorityFilter)
    }

    setFilteredEvents(filtered)
  }, [events, typeFilter, priorityFilter])

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'task': return 'bg-green-100 text-green-800'
      case 'deadline': return 'bg-red-100 text-red-800'
      case 'reminder': return 'bg-yellow-100 text-yellow-800'
      case 'shipment': return 'bg-purple-100 text-purple-800'
      case 'customs': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'اجتماع'
      case 'task': return 'مهمة'
      case 'deadline': return 'موعد نهائي'
      case 'reminder': return 'تذكير'
      case 'shipment': return 'شحنة'
      case 'customs': return 'جمارك'
      default: return 'حدث'
    }
  }

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-red-500'
      case 'high': return 'border-orange-500'
      case 'medium': return 'border-yellow-500'
      case 'low': return 'border-green-500'
      default: return 'border-gray-300'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
            // معالجة النقر على الحدث
        // يمكن إضافة منطق عرض تفاصيل الحدث هنا
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل التقويم...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const monthDays = getMonthDays(currentDate)
  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            التقويم
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة الأحداث والمواعيد والمهام
          </p>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="نوع الحدث" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="meeting">اجتماع</SelectItem>
                    <SelectItem value="task">مهمة</SelectItem>
                    <SelectItem value="deadline">موعد نهائي</SelectItem>
                    <SelectItem value="reminder">تذكير</SelectItem>
                    <SelectItem value="shipment">شحنة</SelectItem>
                    <SelectItem value="customs">جمارك</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>

                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  حدث جديد
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Tabs value={view} onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="month">شهري</TabsTrigger>
            <TabsTrigger value="week">أسبوعي</TabsTrigger>
            <TabsTrigger value="day">يومي</TabsTrigger>
          </TabsList>

          <TabsContent value="month">
            <Card>
              <CardContent className="p-6">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {monthDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day)
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                    const isToday = day.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()

                    return (
                      <div
                        key={index}
                        className={`min-h-32 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-colors ${
                          isCurrentMonth 
                            ? 'bg-white dark:bg-gray-900' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                        } ${
                          isToday 
                            ? 'ring-2 ring-blue-500' 
                            : ''
                        } ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/20' 
                            : ''
                        }`}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className="text-sm font-medium mb-2">
                          {day.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded cursor-pointer ${getTypeColor(event.type)} ${getPriorityColor(event.priority)} border-r-4`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEventClick(event)
                              }}
                            >
                              <div className="font-medium truncate">
                                {event.title}
                              </div>
                              {!event.allDay && (
                                <div className="text-xs opacity-75">
                                  {new Date(event.startDate).toLocaleTimeString('ar-SA', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayEvents.length - 3} أكثر
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  عرض أسبوعي - قيد التطوير
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="day">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  عرض يومي - قيد التطوير
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                أحداث {selectedDate.toLocaleDateString('ar-SA', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد أحداث في هذا اليوم</p>
              ) : (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${getPriorityColor(event.priority)} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <Badge className={getTypeColor(event.type)}>
                              {getTypeText(event.type)}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {event.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {!event.allDay && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(event.startDate).toLocaleTimeString('ar-SA', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(event.endDate).toLocaleTimeString('ar-SA', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>الأحداث القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents
                .filter(event => new Date(event.startDate) > new Date())
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className={`w-3 h-3 rounded-full ${event.color === 'blue' ? 'bg-blue-500' : event.color === 'red' ? 'bg-red-500' : event.color === 'green' ? 'bg-green-500' : event.color === 'yellow' ? 'bg-yellow-500' : event.color === 'purple' ? 'bg-purple-500' : event.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString('ar-SA')} - {getTypeText(event.type)}
                      </p>
                    </div>
                    <Badge className={getTypeColor(event.type)}>
                      {getTypeText(event.type)}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 