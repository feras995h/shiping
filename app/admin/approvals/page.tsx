"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, RefreshCw, Filter, DollarSign, Shield } from "lucide-react"

type Request = {
  id: string
  entityType: 'INVOICE' | 'PAYMENT' | 'JOURNAL_ENTRY'
  entityId: string
  amount: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  reason?: string | null
  approverRole?: string | null
  createdAt: string
  requester: { id: string; name?: string | null; email?: string | null }
  actions: Array<{ id: string; outcome: 'APPROVED' | 'REJECTED'; comment?: string | null; createdAt: string; actor: { id: string; name?: string | null; email?: string | null } }>
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [status, setStatus] = useState('PENDING')
  const [entityType, setEntityType] = useState('all')
  const [approverRole, setApproverRole] = useState('')

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (status !== 'all') params.set('status', status)
      if (entityType !== 'all') params.set('entityType', entityType)
      if (approverRole) params.set('approverRole', approverRole)
      const res = await fetch(`/api/admin/approvals?${params.toString()}`)
      const json = await res.json()
      if (json.success) setRequests(json.data.requests)
    } finally {
      setLoading(false)
    }
  }

  const act = async (requestId: string, outcome: 'APPROVED' | 'REJECTED') => {
    setLoading(true)
    try {
      await fetch('/api/admin/approvals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, actorId: 'user-id', outcome })
      })
      await fetchRequests()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [page])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">طلبات الموافقات</h1>
          <p className="text-gray-600">إدارة واعتماد المعاملات حسب الصلاحيات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRequests} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} /> تحديث
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> لوحة الموافقات</CardTitle>
          <CardDescription>تطبيق سياسات الاعتماد حسب المبالغ والكيانات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-48"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="PENDING">قيد الانتظار</SelectItem>
                <SelectItem value="APPROVED">معتمدة</SelectItem>
                <SelectItem value="REJECTED">مرفوضة</SelectItem>
                <SelectItem value="CANCELLED">ملغاة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-48"><SelectValue placeholder="الكيان" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الكيانات</SelectItem>
                <SelectItem value="INVOICE">فاتورة</SelectItem>
                <SelectItem value="PAYMENT">مدفوع</SelectItem>
                <SelectItem value="JOURNAL_ENTRY">قيد يومية</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="دور المعتمد (اختياري)" value={approverRole} onChange={e => setApproverRole(e.target.value)} />
            <Button variant="outline" onClick={() => { setPage(1); fetchRequests() }}>
              <Filter className="h-4 w-4 ml-2" /> تطبيق الفلاتر
            </Button>
          </div>

          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{r.entityType}</Badge>
                    <div className="font-mono">{r.entityId}</div>
                    <div className="flex items-center gap-1 text-green-700"><DollarSign className="h-4 w-4" /> {r.amount}</div>
                    <Badge variant="outline" className={r.status === 'PENDING' ? 'border-yellow-300 text-yellow-700' : r.status === 'APPROVED' ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}>{r.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" disabled={loading || r.status !== 'PENDING'} onClick={() => act(r.id, 'APPROVED')}>
                      <Check className="h-4 w-4 ml-1" /> اعتماد
                    </Button>
                    <Button size="sm" variant="outline" disabled={loading || r.status !== 'PENDING'} onClick={() => act(r.id, 'REJECTED')}>
                      <X className="h-4 w-4 ml-1" /> رفض
                    </Button>
                  </div>
                </div>
                {r.reason && <div className="text-xs text-gray-600 mt-2">سبب الطلب: {r.reason}</div>}
                {r.actions.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    آخر إجراء: {r.actions[0].outcome} بواسطة {r.actions[0].actor.email || r.actions[0].actor.name} في {new Date(r.actions[0].createdAt).toLocaleString('ar-EG')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


