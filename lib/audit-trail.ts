import { PrismaClient } from '@prisma/client'

export type AuditContext = {
  userId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}

export type AuditLogInput = {
  entityType: 'INVOICE' | 'PAYMENT' | 'JOURNAL_ENTRY' | 'JOURNAL_ENTRY_LINE' | 'GL_ACCOUNT' | 'CLIENT' | 'SUPPLIER' | 'USER' | 'CURRENCY'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  changes?: Record<string, unknown> | null
  summary?: string | null
} & AuditContext

class AuditTrailService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async log(input: AuditLogInput) {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: input.entityType as any,
          entityId: input.entityId,
          action: input.action as any,
          changes: (input.changes ?? null) as any,
          summary: input.summary ?? undefined,
          userId: input.userId ?? null,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
        },
      })
    } catch (error) {
      console.error('Audit log error:', error)
    }
  }

  async logCreate(entityType: AuditLogInput['entityType'], entityId: string, changes?: Record<string, unknown>, ctx?: AuditContext) {
    await this.log({ entityType, entityId, action: 'CREATE', changes: changes ?? null, ...ctx })
  }

  async logUpdate(entityType: AuditLogInput['entityType'], entityId: string, changes?: Record<string, unknown>, ctx?: AuditContext) {
    await this.log({ entityType, entityId, action: 'UPDATE', changes: changes ?? null, ...ctx })
  }

  async logDelete(entityType: AuditLogInput['entityType'], entityId: string, changes?: Record<string, unknown>, ctx?: AuditContext) {
    await this.log({ entityType, entityId, action: 'DELETE', changes: changes ?? null, ...ctx })
  }
}

let auditTrailInstance: AuditTrailService | null = null
export const getAuditTrail = (prisma: PrismaClient): AuditTrailService => {
  if (!auditTrailInstance) auditTrailInstance = new AuditTrailService(prisma)
  return auditTrailInstance
}

export default AuditTrailService
