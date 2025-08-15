import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'تم تحميل الشعارات بنجاح',
      logos: [
        {
          name: 'golden-horse-logo.svg',
          url: '/golden-horse-logo.svg',
          type: 'main',
          description: 'الشعار الرئيسي للنظام'
        },
        {
          name: 'golden-horse-logo-simple.svg',
          url: '/golden-horse-logo-simple.svg',
          type: 'simple',
          description: 'الشعار البسيط للنظام'
        }
      ]
    })
  } catch (error) {
    console.error('خطأ في تحميل الشعارات:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحميل الشعارات' },
      { status: 500 }
    )
  }
}
