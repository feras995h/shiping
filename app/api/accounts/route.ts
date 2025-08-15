import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { glAccountSchema, glAccountUpdateSchema } from '@/lib/validations'
import { buildGlTree, createGlAccount, ensureInitialChart } from '@/lib/accounting'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const flat = searchParams.get('flat') === 'true'
    const query = searchParams.get('query')?.trim() || ''
    const level = searchParams.get('level') ? parseInt(searchParams.get('level') as string, 10) : undefined

    await ensureInitialChart(prisma)

    if (flat) {
      const where: any = {}
      if (query) where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
      ]
      if (level) where.level = level
      const accounts = await prisma.glAccount.findMany({ where, orderBy: { code: 'asc' } })
      return ApiResponseHandler.success(accounts)
    }

    const tree = await buildGlTree(prisma)
    return ApiResponseHandler.success(tree)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return ApiResponseHandler.serverError('فشل في جلب دليل الحسابات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const parsed = glAccountSchema.safeParse(payload)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      return ApiResponseHandler.validationError(issues)
    }

    // تأكد من تهيئة الجذور والعملات الأساسية
    await ensureInitialChart(prisma)
    const account = await createGlAccount(prisma, {
      name: parsed.data.name,
      parentId: parsed.data.parentId ?? null,
      currencyId: parsed.data.currencyId ?? null,
    })
    return ApiResponseHandler.success(account, 'تم إنشاء الحساب بنجاح')
  } catch (error) {
    console.error('Error creating account:', error)
    return ApiResponseHandler.validationError(['تعذر إنشاء الحساب'])
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()
    const parsed = glAccountUpdateSchema.safeParse(payload)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      return ApiResponseHandler.validationError(issues)
    }

    const { id, ...updates } = parsed.data

    // منع كسر سلامة القيود: لا نسمح بتغيير parent أو rootType عبر هذا المسار
    const updated = await prisma.glAccount.update({
      where: { id },
      data: {
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.code ? { code: updates.code } : {}),
        ...(updates.currencyId ? { currencyId: updates.currencyId } : {}),
        ...(typeof updates.natureOverride !== 'undefined' ? { natureOverride: updates.natureOverride } : {}),
      },
    })
    return ApiResponseHandler.success(updated, 'تم تحديث الحساب')
  } catch (error) {
    console.error('Error updating account:', error)
    return ApiResponseHandler.validationError(['تعذر تحديث الحساب'])
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return ApiResponseHandler.validationError(['id مطلوب'])

    const childrenCount = await prisma.glAccount.count({ where: { parentId: id } })
    if (childrenCount > 0) return ApiResponseHandler.validationError(['لا يمكن حذف حساب يحتوي على فروع'])

    // لاحقًا: تحقق من عدم وجود قيود / قيود يومية مرتبطة قبل الحذف
    await prisma.glAccount.delete({ where: { id } })
    return ApiResponseHandler.success(true, 'تم حذف الحساب')
  } catch (error) {
    console.error('Error deleting account:', error)
    return ApiResponseHandler.validationError(['تعذر حذف الحساب'])
  }
}


