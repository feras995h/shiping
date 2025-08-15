import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

// البيانات الافتراضية للإعدادات
const defaultSettings = [
  {
    id: '1',
    key: 'APPROVAL_THRESHOLD',
    value: '10000',
    category: 'APPROVALS',
    description: 'حد الموافقة على المدفوعات (بالدينار الليبي)'
  },
  {
    id: '2',
    key: 'ALERT_BALANCE_THRESHOLD',
    value: '5000',
    category: 'ALERTS',
    description: 'حد التنبيه عند انخفاض الرصيد (بالدينار الليبي)'
  },
  {
    id: '3',
    key: 'TAX_RATE',
    value: '15',
    category: 'TAX',
    description: 'نسبة الضريبة العامة (%)'
  },
  {
    id: '4',
    key: 'DEFAULT_CURRENCY',
    value: 'LYD',
    category: 'CURRENCY',
    description: 'العملة الافتراضية للنظام'
  },
  {
    id: '5',
    key: 'SYSTEM_NAME',
    value: 'الحصان الذهبي للشحن',
    category: 'SYSTEM',
    description: 'اسم النظام'
  },
  {
    id: '6',
    key: 'MAX_FILE_SIZE',
    value: '10',
    category: 'SYSTEM',
    description: 'الحد الأقصى لحجم الملفات (ميجابايت)'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let settings: any[] = defaultSettings
    let settingsCount = defaultSettings.length

    // محاولة الاتصال بقاعدة البيانات
    try {
      // التحقق من وجود إعدادات في قاعدة البيانات
      settingsCount = await prisma.systemSetting.count()
      
      // إذا لم تكن هناك إعدادات، قم بإنشاء البيانات الافتراضية
      if (settingsCount === 0) {
        for (const setting of defaultSettings) {
          await prisma.systemSetting.create({
            data: {
              key: setting.key,
              value: setting.value,
              category: setting.category,
              description: setting.description,
              createdBy: 'system'
            }
          })
        }
        settingsCount = defaultSettings.length
      }

      const where: any = {}
      if (category && category !== 'all') {
        where.category = category
      }

      const dbSettings = await prisma.systemSetting.findMany({
        where,
        orderBy: { category: 'asc' }
      })

      if (dbSettings.length > 0) {
        settings = dbSettings
      }
    } catch (dbError) {
      console.warn('Database connection failed, using default settings:', dbError)
      // استخدام البيانات الافتراضية إذا فشل الاتصال بقاعدة البيانات
      settings = defaultSettings
    }

    // تجميع الإعدادات حسب الفئة
    const groupedSettings = settings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      // توحيد نوع البيانات
      const formattedSetting = {
        id: setting.id,
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description || ''
      }
      acc[setting.category].push(formattedSetting)
      return acc
    }, {})

    return ApiResponseHandler.success({
      settings: groupedSettings,
      categories: Object.keys(groupedSettings),
      totalSettings: settingsCount,
      usingDefaults: settings === defaultSettings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // في حالة الفشل الكامل، إرجاع البيانات الافتراضية
    const groupedDefaults = defaultSettings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    }, {})

    return ApiResponseHandler.success({
      settings: groupedDefaults,
      categories: Object.keys(groupedDefaults),
      totalSettings: defaultSettings.length,
      usingDefaults: true,
      message: 'تم استخدام الإعدادات الافتراضية'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, category, description } = body

    const setting = await prisma.systemSetting.create({
      data: {
        key,
        value,
        category,
        description,
        createdBy: 'system', // سيتم استبداله بـ user ID الفعلي
      }
    })

    return ApiResponseHandler.success(setting, 'تم إنشاء الإعداد بنجاح')
  } catch (error) {
    console.error('Error creating setting:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, value, description } = body

    const setting = await prisma.systemSetting.update({
      where: { id },
      data: {
        value,
        description,
        updatedAt: new Date()
      }
    })

    return ApiResponseHandler.success(setting, 'تم تحديث الإعداد بنجاح')
  } catch (error) {
    console.error('Error updating setting:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 