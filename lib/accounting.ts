import { PrismaClient, AccountNature, RootAccountType } from '@prisma/client'

export type GlAccountTreeNode = {
  id: string
  name: string
  code: string
  level: number
  nature: AccountNature
  rootType: RootAccountType
  currencyId: string
  isSystem: boolean
  children: GlAccountTreeNode[]
}

export const ROOT_NATURE_BY_TYPE: Record<RootAccountType, AccountNature> = {
  ASSET: 'DEBIT',
  EXPENSE: 'DEBIT',
  LIABILITY: 'CREDIT',
  EQUITY: 'CREDIT',
  REVENUE: 'CREDIT',
}

export async function ensureInitialChart(prisma: PrismaClient) {
  // Pick default currency (pref: LYD then USD then first)
  const defaultCurrency = await prisma.currency.findFirst({
    where: { code: { in: ['LYD', 'USD'] }, isActive: true },
    orderBy: { code: 'asc' },
  }) || await prisma.currency.findFirst()

  if (!defaultCurrency) return

  const existingRoots = await prisma.glAccount.findMany({ where: { level: 1 } })
  if (existingRoots.length >= 5) return

  const roots: Array<{ code: string; name: string; type: RootAccountType }> = [
    { code: '1', name: 'الأصول', type: 'ASSET' },
    { code: '2', name: 'المصروفات', type: 'EXPENSE' },
    { code: '3', name: 'الالتزامات', type: 'LIABILITY' },
    { code: '4', name: 'حقوق الملكية', type: 'EQUITY' },
    { code: '5', name: 'الإيرادات', type: 'REVENUE' },
  ]

  for (const r of roots) {
    const exists = await prisma.glAccount.findFirst({ where: { code: r.code } })
    if (!exists) {
      await prisma.glAccount.create({
        data: {
          name: r.name,
          code: r.code,
          level: 1,
          rootType: r.type,
          nature: ROOT_NATURE_BY_TYPE[r.type],
          currencyId: defaultCurrency.id,
          isSystem: true,
        }
      })
    }
  }

  // Ensure standard system parents
  const assetsRoot = await prisma.glAccount.findFirst({ where: { code: '1' } })
  const expenseRoot = await prisma.glAccount.findFirst({ where: { code: '2' } })
  const liabilityRoot = await prisma.glAccount.findFirst({ where: { code: '3' } })

  if (assetsRoot) {
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'advances',
      name: 'العهد',
      parentId: assetsRoot.id,
      currencyId: defaultCurrency.id,
    })
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'employee_loans',
      name: 'السلف',
      parentId: assetsRoot.id,
      currencyId: defaultCurrency.id,
    })
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'accounts_receivable_clients',
      name: 'المدينون – عملاء',
      parentId: assetsRoot.id,
      currencyId: defaultCurrency.id,
    })
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'fixed_assets',
      name: 'الأصول الثابتة',
      parentId: assetsRoot.id,
      currencyId: defaultCurrency.id,
    })
  }
  if (expenseRoot) {
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'depreciation_expense',
      name: 'مصروف الإهلاك',
      parentId: expenseRoot.id,
      currencyId: defaultCurrency.id,
    })
  }
  if (liabilityRoot) {
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'employees_payable',
      name: 'الدائنون – موظفون',
      parentId: liabilityRoot.id,
      currencyId: defaultCurrency.id,
    })
    await getOrCreateSystemAccountBySlug(prisma, {
      slug: 'accumulated_depreciation',
      name: 'مجمع الإهلاك',
      parentId: liabilityRoot.id,
      currencyId: defaultCurrency.id,
    })
  }
}

export async function getOrCreateSystemAccountBySlug(
  prisma: PrismaClient,
  opts: { slug: string; name: string; parentId: string | null; currencyId: string }
) {
  const existing = await prisma.glAccount.findFirst({ where: { slug: opts.slug } })
  if (existing) return existing

  return createGlAccount(prisma, {
    name: opts.name,
    parentId: opts.parentId,
    currencyId: opts.currencyId,
    slug: opts.slug,
    isSystem: true,
  })
}

export async function createGlAccount(
  prisma: PrismaClient,
  data: { name: string; parentId?: string | null; currencyId?: string | null; slug?: string | null; isSystem?: boolean; natureOverride?: AccountNature | null }
) {
  const parent = data.parentId ? await prisma.glAccount.findUnique({ where: { id: data.parentId } }) : null
  let level = 1
  let rootType: RootAccountType
  let nature: AccountNature
  let parentCodePrefix = ''

  if (parent) {
    level = (parent.level ?? 1) + 1
    rootType = parent.rootType
    nature = parent.nature
    parentCodePrefix = parent.code + '.'
  } else {
    throw new Error('يجب اختيار حساب أب لإنشاء حساب جديد')
  }

  const segment = await nextChildSegment(prisma, parent.id)
  const code = `${parentCodePrefix}${segment}`

  // استنتاج العملة: من الأب أو أول عملة فعالة
  let currencyId = data.currencyId || parent?.currencyId || null
  if (!currencyId) {
    const cur = await prisma.currency.findFirst({ where: { isActive: true }, orderBy: { code: 'asc' } })
    if (cur) currencyId = cur.id
  }
  if (!currencyId) throw new Error('لا توجد عملة متاحة، يرجى إضافة عملة من شاشة العملات')

  const account = await prisma.glAccount.create({
    data: {
      name: data.name,
      code,
      level,
      parentId: parent?.id ?? null,
      rootType,
      nature: data.natureOverride ?? nature,
      currencyId,
      isSystem: data.isSystem ?? false,
      slug: data.slug ?? null,
    }
  })
  return account
}

export async function nextChildSegment(prisma: PrismaClient, parentId: string): Promise<number> {
  // Get max last segment among siblings
  const siblings = await prisma.glAccount.findMany({ where: { parentId }, select: { code: true } })
  let maxSeg = 0
  for (const s of siblings) {
    const parts = s.code.split('.')
    const last = parseInt(parts[parts.length - 1] || '0', 10)
    if (!Number.isNaN(last)) maxSeg = Math.max(maxSeg, last)
  }
  return maxSeg + 1
}

export async function buildGlTree(prisma: PrismaClient, rootIds?: string[]): Promise<GlAccountTreeNode[]> {
  const accounts = await prisma.glAccount.findMany({
    where: rootIds && rootIds.length > 0 ? { OR: rootIds.map(id => ({ id })) } : { level: 1 },
    orderBy: { code: 'asc' },
  })
  const all = await prisma.glAccount.findMany({ orderBy: { code: 'asc' } })
  const byParent: Record<string, typeof all> = {}
  for (const a of all) {
    const key = a.parentId ?? 'root'
    if (!byParent[key]) byParent[key] = []
    byParent[key].push(a)
  }
  const toNode = (a: typeof all[number]): GlAccountTreeNode => ({
    id: a.id,
    name: a.name,
    code: a.code,
    level: a.level,
    nature: a.nature,
    rootType: a.rootType,
    currencyId: a.currencyId,
    isSystem: a.isSystem,
    children: (byParent[a.id] || []).map(toNode),
  })
  return accounts.map(toNode)
}


