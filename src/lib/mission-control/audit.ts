import { randomUUID } from 'node:crypto'

import {
  appendAuditLogEvent,
  listAuditLogForTenant,
} from '@/lib/mission-control/data-access'
import { type AuditLogEvent, type CustomerActionId } from '@/lib/mission-control/types'

export function createRequestId(): string {
  return randomUUID()
}

export async function logCustomerAction(params: {
  requestId: string
  tenantId: string
  userId: string
  role: AuditLogEvent['role']
  endpointId: string | null
  action: CustomerActionId
  result: AuditLogEvent['result']
  error?: string | null
  metadata?: Record<string, string>
}): Promise<AuditLogEvent> {
  return appendAuditLogEvent({
    requestId: params.requestId,
    tenantId: params.tenantId,
    userId: params.userId,
    role: params.role,
    endpointId: params.endpointId,
    action: params.action,
    result: params.result,
    error: params.error || null,
    metadata: params.metadata || {},
  })
}

export async function getTenantAuditLog(tenantId: string, limit = 25): Promise<AuditLogEvent[]> {
  return listAuditLogForTenant(tenantId, limit)
}
