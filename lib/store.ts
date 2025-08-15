import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logger } from './logger'

// أنواع البيانات
interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Shipment {
  id: string
  trackingNumber: string
  status: string
  origin: string
  destination: string
  clientName: string
  weight: number
  value: number
  currency: string
  createdAt: string
  progress: number
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  createdAt: string
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  assignedTo: string
  dueDate: string
  createdAt: string
}

interface Notification {
  id: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

interface Voucher {
  id: string
  voucherNumber: string
  type: string
  amount: number
  currency: string
  description: string
  status: string
  date: string
  shipmentId?: string
  paymentMethod?: string
}

interface WarehouseItem {
  id: string
  name: string
  quantity: number
  unit: string
  location: string
  lastUpdated: string
}

interface WarehouseShipment {
  id: string
  shipmentId: string
  status: string
  location: string
  lastUpdated: string
}

interface ReceiptVoucher {
  id: string
  shipmentId: string
  clientName: string
  items: Array<{
    id: string
    description: string
    quantity: number
    value: number
  }>
  receivedDate: string
}

interface DeliveryVoucher {
  id: string
  shipmentId: string
  clientName: string
  items: Array<{
    id: string
    description: string
    quantity: number
    value: number
  }>
  deliveryDate: string
}

interface AppState {
  // حالة المستخدم
  user: User | null
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  sidebarOpen: boolean

  // البيانات
  shipments: Shipment[]
  clients: Client[]
  tasks: Task[]
  notifications: Notification[]
  vouchers: Voucher[]
  warehouseItems: WarehouseItem[]
  warehouseShipments: WarehouseShipment[]
  receiptVouchers: ReceiptVoucher[]
  deliveryVouchers: DeliveryVoucher[]

  // الإجراءات
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarOpen: (open: boolean) => void
  logout: () => void

  // إدارة الشحنات
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt'>) => void
  updateShipment: (id: string, updates: Partial<Shipment>) => void
  deleteShipment: (id: string) => void

  // إدارة العملاء
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void

  // إدارة المهام
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  // إدارة الإشعارات
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  deleteNotification: (id: string) => void

  // إدارة السندات
  addVoucher: (voucher: Omit<Voucher, 'id'>) => void
  updateVoucher: (id: string, updates: Partial<Voucher>) => void
  deleteVoucher: (id: string) => void

  // إدارة المستودع
  addWarehouseItem: (item: Omit<WarehouseItem, 'id' | 'lastUpdated'>) => void
  updateWarehouseItem: (id: string, updates: Partial<WarehouseItem>) => void
  deleteWarehouseItem: (id: string) => void

  // إدارة شحنات المستودع
  addWarehouseShipment: (shipment: Omit<WarehouseShipment, 'id' | 'lastUpdated'>) => void
  updateWarehouseShipment: (id: string, updates: Partial<WarehouseShipment>) => void
  deleteWarehouseShipment: (id: string) => void

  // إدارة سندات القبض
  addReceiptVoucher: (voucher: Omit<ReceiptVoucher, 'id'>) => void
  updateReceiptVoucher: (id: string, updates: Partial<ReceiptVoucher>) => void
  deleteReceiptVoucher: (id: string) => void

  // إدارة سندات التسليم
  addDeliveryVoucher: (voucher: Omit<DeliveryVoucher, 'id'>) => void
  updateDeliveryVoucher: (id: string, updates: Partial<DeliveryVoucher>) => void
  deleteDeliveryVoucher: (id: string) => void

  // وظائف متقدمة
  generatePaymentVoucher: (shipmentId: string, amount: number, method: string) => void
  generateReceiptVoucher: (shipmentId: string, amount: number, method: string) => void
  generateDeliveryVoucher: (shipmentId: string, items: Array<{ id: string, description: string, quantity: number, totalPrice: number }>) => void
  updateShipmentStatus: (shipmentId: string, status: string) => void
  adjustInventory: (itemId: string, adjustment: number) => void
  approveVoucher: (voucherId: string) => void
}

// دالة إنشاء معرف فريد
const genId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      user: null,
      isAuthenticated: false,
      theme: 'light',
      sidebarOpen: false,

      // البيانات الأولية
      shipments: [],
      clients: [],
      tasks: [],
      notifications: [],
      vouchers: [],
      warehouseItems: [],
      warehouseShipments: [],
      receiptVouchers: [],
      deliveryVouchers: [],

      // إدارة المستخدم
      setUser: (user) => {
        set({ user })
        if (user) {
          logger.logUserAction('تسجيل دخول', user.id, { email: user.email, role: user.role })
        }
      },

      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated })
        logger.logSystemEvent(`تغيير حالة المصادقة: ${authenticated}`)
      },

      setTheme: (theme) => {
        set({ theme })
        logger.logSystemEvent(`تغيير المظهر: ${theme}`)
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      logout: () => {
        const user = get().user
        if (user) {
          logger.logUserAction('تسجيل خروج', user.id, { email: user.email })
        }
        set({ 
          user: null, 
          isAuthenticated: false,
          sidebarOpen: false
        })
      },

      // إدارة الشحنات
      addShipment: (shipmentData) => {
        const shipment: Shipment = {
          ...shipmentData,
          id: genId('SHP'),
          createdAt: new Date().toISOString()
        }
        set(state => ({ shipments: [shipment, ...state.shipments] }))
        logger.logSystemEvent('إضافة شحنة جديدة', { shipmentId: shipment.id, status: shipment.status })
      },

      updateShipment: (id, updates) => {
        set(state => ({
          shipments: state.shipments.map(s => 
            s.id === id ? { ...s, ...updates } : s
          )
        }))
        logger.logSystemEvent('تحديث شحنة', { shipmentId: id, updates })
      },

      deleteShipment: (id) => {
        set(state => ({
          shipments: state.shipments.filter(s => s.id !== id)
        }))
        logger.logSystemEvent('حذف شحنة', { shipmentId: id })
      },

      // إدارة العملاء
      addClient: (clientData) => {
        const client: Client = {
          ...clientData,
          id: genId('CLI'),
          createdAt: new Date().toISOString()
        }
        set(state => ({ clients: [client, ...state.clients] }))
        logger.logSystemEvent('إضافة عميل جديد', { clientId: client.id, name: client.name })
      },

      updateClient: (id, updates) => {
        set(state => ({
          clients: state.clients.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }))
        logger.logSystemEvent('تحديث عميل', { clientId: id, updates })
      },

      deleteClient: (id) => {
        set(state => ({
          clients: state.clients.filter(c => c.id !== id)
        }))
        logger.logSystemEvent('حذف عميل', { clientId: id })
      },

      // إدارة المهام
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: genId('TSK'),
          createdAt: new Date().toISOString()
        }
        set(state => ({ tasks: [task, ...state.tasks] }))
        logger.logSystemEvent('إضافة مهمة جديدة', { taskId: task.id, title: task.title })
      },

      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }))
        logger.logSystemEvent('تحديث مهمة', { taskId: id, updates })
      },

      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== id)
        }))
        logger.logSystemEvent('حذف مهمة', { taskId: id })
      },

      // إدارة الإشعارات
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: genId('NTF'),
          createdAt: new Date().toISOString()
        }
        set(state => ({ notifications: [notification, ...state.notifications] }))
      },

      markNotificationAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }))
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      // إدارة السندات
      addVoucher: (voucherData) => {
        const voucher: Voucher = {
          ...voucherData,
          id: genId('VCH')
        }
        set(state => ({ vouchers: [voucher, ...state.vouchers] }))
        logger.logFinancialOperation('إنشاء سند', voucher.amount, voucher.currency, undefined, { voucherId: voucher.id, type: voucher.type })
      },

      updateVoucher: (id, updates) => {
        set(state => ({
          vouchers: state.vouchers.map(v => 
            v.id === id ? { ...v, ...updates } : v
          )
        }))
        logger.logSystemEvent('تحديث سند', { voucherId: id, updates })
      },

      deleteVoucher: (id) => {
        set(state => ({
          vouchers: state.vouchers.filter(v => v.id !== id)
        }))
        logger.logSystemEvent('حذف سند', { voucherId: id })
      },

      // إدارة المستودع
      addWarehouseItem: (itemData) => {
        const item: WarehouseItem = {
          ...itemData,
          id: genId('ITM'),
          lastUpdated: new Date().toISOString()
        }
        set(state => ({ warehouseItems: [item, ...state.warehouseItems] }))
        logger.logSystemEvent('إضافة عنصر مستودع', { itemId: item.id, name: item.name })
      },

      updateWarehouseItem: (id, updates) => {
        set(state => ({
          warehouseItems: state.warehouseItems.map(i => 
            i.id === id ? { ...i, ...updates, lastUpdated: new Date().toISOString() } : i
          )
        }))
        logger.logSystemEvent('تحديث عنصر مستودع', { itemId: id, updates })
      },

      deleteWarehouseItem: (id) => {
        set(state => ({
          warehouseItems: state.warehouseItems.filter(i => i.id !== id)
        }))
        logger.logSystemEvent('حذف عنصر مستودع', { itemId: id })
      },

      // إدارة شحنات المستودع
      addWarehouseShipment: (shipmentData) => {
        const shipment: WarehouseShipment = {
          ...shipmentData,
          id: genId('WSH'),
          lastUpdated: new Date().toISOString()
        }
        set(state => ({ warehouseShipments: [shipment, ...state.warehouseShipments] }))
        logger.logSystemEvent('إضافة شحنة مستودع', { shipmentId: shipment.id })
      },

      updateWarehouseShipment: (id, updates) => {
        set(state => ({
          warehouseShipments: state.warehouseShipments.map(s => 
            s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s
          )
        }))
        logger.logSystemEvent('تحديث شحنة مستودع', { shipmentId: id, updates })
      },

      deleteWarehouseShipment: (id) => {
        set(state => ({
          warehouseShipments: state.warehouseShipments.filter(s => s.id !== id)
        }))
        logger.logSystemEvent('حذف شحنة مستودع', { shipmentId: id })
      },

      // إدارة سندات القبض
      addReceiptVoucher: (voucherData) => {
        const voucher: ReceiptVoucher = {
          ...voucherData,
          id: genId('RCV')
        }
        set(state => ({ receiptVouchers: [voucher, ...state.receiptVouchers] }))
        logger.logFinancialOperation('إنشاء سند قبض', 0, 'LYD', undefined, { voucherId: voucher.id })
      },

      updateReceiptVoucher: (id, updates) => {
        set(state => ({
          receiptVouchers: state.receiptVouchers.map(v => 
            v.id === id ? { ...v, ...updates } : v
          )
        }))
        logger.logSystemEvent('تحديث سند قبض', { voucherId: id, updates })
      },

      deleteReceiptVoucher: (id) => {
        set(state => ({
          receiptVouchers: state.receiptVouchers.filter(v => v.id !== id)
        }))
        logger.logSystemEvent('حذف سند قبض', { voucherId: id })
      },

      // إدارة سندات التسليم
      addDeliveryVoucher: (voucherData) => {
        const voucher: DeliveryVoucher = {
          ...voucherData,
          id: genId('DLV')
        }
        set(state => ({ deliveryVouchers: [voucher, ...state.deliveryVouchers] }))
        logger.logSystemEvent('إنشاء سند تسليم', { voucherId: voucher.id })
      },

      updateDeliveryVoucher: (id, updates) => {
        set(state => ({
          deliveryVouchers: state.deliveryVouchers.map(v => 
            v.id === id ? { ...v, ...updates } : v
          )
        }))
        logger.logSystemEvent('تحديث سند تسليم', { voucherId: id, updates })
      },

      deleteDeliveryVoucher: (id) => {
        set(state => ({
          deliveryVouchers: state.deliveryVouchers.filter(v => v.id !== id)
        }))
        logger.logSystemEvent('حذف سند تسليم', { voucherId: id })
      },

      // الوظائف المتقدمة
      generatePaymentVoucher: (shipmentId, amount, method) => {
        const id = genId('VCH')
        const date = new Date().toISOString().slice(0,10)
        set(state => ({
          vouchers: [{ id, voucherNumber: id, type: 'payment', amount, currency: 'LYD', description: `سند دفع للشحنة ${shipmentId}`, status: 'pending', date, shipmentId, paymentMethod: method }, ...state.vouchers],
          tasks: [{ 
            id: genId('TSK'), 
            title: `مراجعة دفع ${shipmentId}`.trim(), 
            status: 'PENDING', 
            priority: 'MEDIUM',
            assignedTo: 'system',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // أسبوع من الآن
            createdAt: new Date().toISOString() 
          }, ...state.tasks],
          notifications: [{ 
            id: genId('NTF'), 
            message: `تم تسجيل دفع للشحنة ${shipmentId}`, 
            type: 'info',
            read: false,
            createdAt: new Date().toISOString() 
          }, ...state.notifications],
        }))
        logger.logFinancialOperation('إنشاء سند دفع', amount, 'LYD', undefined, { voucherId: id, shipmentId })
      },

      generateReceiptVoucher: (shipmentId, amount, method) => {
        const id = genId('VCH')
        const date = new Date().toISOString().slice(0,10)
        set(state => ({
          vouchers: [{ id, voucherNumber: id, type: 'receipt', amount, currency: 'LYD', description: `سند قبض للشحنة ${shipmentId}`, status: 'approved', date, shipmentId, paymentMethod: method }, ...state.vouchers],
          receiptVouchers: [{ id, shipmentId, clientName: 'عميل', items: [{ id: genId('ITM'), description: 'قبض', quantity: 1, value: amount }], receivedDate: date }, ...state.receiptVouchers],
          notifications: [{ 
            id: genId('NTF'), 
            message: `إنشاء سند قبض ${id}`, 
            type: 'success',
            read: false,
            createdAt: new Date().toISOString() 
          }, ...state.notifications],
        }))
        logger.logFinancialOperation('إنشاء سند قبض', amount, 'LYD', undefined, { voucherId: id, shipmentId })
      },

      generateDeliveryVoucher: (shipmentId, items) => {
        const id = genId('DLV')
        const date = new Date().toISOString().slice(0,10)
        set(state => ({
          deliveryVouchers: [{ id, shipmentId, clientName: 'عميل', items: items.map(i => ({ id: i.id, description: i.description, quantity: i.quantity, value: i.totalPrice })), deliveryDate: date }, ...state.deliveryVouchers],
          vouchers: [{ id, voucherNumber: id, type: 'delivery', amount: 0, currency: 'LYD', description: `سند تسليم للشحنة ${shipmentId}`, status: 'approved', date, shipmentId }, ...state.vouchers],
          shipments: state.shipments.map(s => s.id === shipmentId ? { ...s, status: 'delivered', progress: 100, deliveryDate: date } : s),
        }))
        logger.logSystemEvent('إنشاء سند تسليم', { voucherId: id, shipmentId })
      },

      updateShipmentStatus: (shipmentId, status) => {
        set(state => ({ 
          shipments: state.shipments.map(s => 
            s.id === shipmentId ? { 
              ...s, 
              status, 
              progress: status === 'at_port' ? 70 : s.progress 
            } : s
          ) 
        }))
        logger.logSystemEvent('تحديث حالة الشحنة', { shipmentId, status })
      },

      adjustInventory: (itemId, adjustment) => {
        set(state => {
          const found = state.warehouseItems.find(i => i.id === itemId)
          if (found) {
            return { 
              warehouseItems: state.warehouseItems.map(i => 
                i.id === itemId ? { ...i, quantity: i.quantity + adjustment } : i
              ) 
            }
          }
          // إذا لم يوجد العنصر، أنشئ واحدًا بسيطًا
          return { 
            warehouseItems: [{ 
              id: itemId, 
              name: 'عنصر', 
              quantity: Math.max(0, adjustment),
              unit: 'قطعة',
              location: 'غير محدد',
              lastUpdated: new Date().toISOString()
            }, ...state.warehouseItems] 
          }
        })
        logger.logSystemEvent('تعديل المخزون', { itemId, adjustment })
      },

      approveVoucher: (voucherId) => {
        set(state => ({ 
          vouchers: state.vouchers.map(v => 
            v.id === voucherId ? { ...v, status: 'approved' } : v
          ) 
        }))
        logger.logSystemEvent('موافقة على سند', { voucherId })
      },
    }),
    {
      name: 'shipping-finance-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Selectors used by pages
export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    setUser, 
    setAuthenticated, 
    logout 
  } = useAppStore()

  const login = async (email: string, password: string, userType: string) => {
    try {
      // في التطبيق الحقيقي، ستقوم بإرسال طلب إلى API
      const user = {
        id: genId('USR'),
        name: 'مستخدم تجريبي',
        email,
        role: userType,
        avatar: undefined
      }
      
      setUser(user)
      setAuthenticated(true)
      
      logger.logUserAction('تسجيل دخول', user.id, { email, role: userType })
      return true
    } catch (error) {
      logger.error('خطأ في تسجيل الدخول', { email, error })
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    setAuthenticated
  }
}

// Simple hooks expected by pages
export const useShipments = () => useAppStore(s => s.shipments)
export const useClients = () => useAppStore(s => s.clients)
export const useTasks = () => useAppStore(s => s.tasks)
export const useNotifications = () => useAppStore(s => s.notifications)
export const useVouchers = () => useAppStore(s => s.vouchers)
export const useWarehouseItems = () => useAppStore(s => s.warehouseItems)
export const useWarehouseShipments = () => useAppStore(s => s.warehouseShipments)
export const useReceiptVouchers = () => useAppStore(s => s.receiptVouchers)
export const useDeliveryVouchers = () => useAppStore(s => s.deliveryVouchers) 