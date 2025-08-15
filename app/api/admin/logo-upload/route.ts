import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const logo = formData.get('logo') as File
    const type = formData.get('type') as string

    if (!logo || !type) {
      return NextResponse.json(
        { success: false, message: 'الملف ونوع الشعار مطلوبان' },
        { status: 400 }
      )
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(logo.type)) {
      return NextResponse.json(
        { success: false, message: 'نوع الملف غير مدعوم. يرجى رفع ملف SVG أو PNG أو JPG' },
        { status: 400 }
      )
    }

    // تحديد اسم الملف بناءً على النوع
    let fileName: string
    if (type === 'main') {
      fileName = 'golden-horse-logo.svg'
    } else if (type === 'simple') {
      fileName = 'golden-horse-logo-simple.svg'
    } else {
      return NextResponse.json(
        { success: false, message: 'نوع الشعار غير صحيح' },
        { status: 400 }
      )
    }

    // إنشاء مجلد public إذا لم يكن موجوداً
    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // حفظ الملف
    const bytes = await logo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(publicDir, fileName)
    
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      message: `تم رفع الشعار ${type === 'main' ? 'الرئيسي' : 'البسيط'} بنجاح`,
      fileName,
      fileSize: logo.size,
      fileType: logo.type
    })

  } catch (error) {
    console.error('خطأ في رفع الشعار:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء رفع الشعار' },
      { status: 500 }
    )
  }
}


