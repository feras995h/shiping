
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { AdvertisementSlider } from '@/components/shared/advertisement-slider';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'BANNER' | 'POPUP' | 'SLIDER' | 'ANNOUNCEMENT';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  priority: number;
  startDate?: string;
  endDate?: string;
  targetRole?: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdvertisementForm {
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  type: string;
  status: string;
  priority: number;
  startDate: string;
  endDate: string;
  targetRole: string;
}

const initialForm: AdvertisementForm = {
  title: '',
  content: '',
  imageUrl: '',
  linkUrl: '',
  type: 'SLIDER',
  status: 'DRAFT',
  priority: 0,
  startDate: '',
  endDate: '',
  targetRole: ''
};

export default function AdvertisementsManagementPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [form, setForm] = useState<AdvertisementForm>(initialForm);
  const [previewMode, setPreviewMode] = useState(false);

  // جلب الإعلانات
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/advertisements');
      const data = await response.json();
      
      if (data.success) {
        setAdvertisements(data.data || []);
      } else {
        toast.error(data.message || 'خطأ في جلب الإعلانات');
      }
    } catch (error) {
      console.error('خطأ في جلب الإعلانات:', error);
      toast.error('خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.content) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }

    try {
      const method = editingAd ? 'PUT' : 'POST';
      const url = editingAd ? `/api/advertisements/${editingAd.id}` : '/api/advertisements';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          priority: parseInt(form.priority.toString())
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(editingAd ? 'تم تحديث الإعلان بنجاح' : 'تم إنشاء الإعلان بنجاح');
        setIsDialogOpen(false);
        setEditingAd(null);
        setForm(initialForm);
        fetchAdvertisements();
      } else {
        toast.error(data.message || 'خطأ في العملية');
      }
    } catch (error) {
      console.error('خطأ في العملية:', error);
      toast.error('خطأ في الاتصال بالخادم');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setForm({
      title: ad.title,
      content: ad.content,
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl || '',
      type: ad.type,
      status: ad.status,
      priority: ad.priority,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
      targetRole: ad.targetRole || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const response = await fetch(`/api/advertisements/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('تم حذف الإعلان بنجاح');
        fetchAdvertisements();
      } else {
        toast.error(data.message || 'خطأ في حذف الإعلان');
      }
    } catch (error) {
      console.error('خطأ في حذف الإعلان:', error);
      toast.error('خطأ في الاتصال بالخادم');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      DRAFT: 'secondary',
      ACTIVE: 'default',
      INACTIVE: 'outline',
      EXPIRED: 'destructive'
    };

    const labels = {
      DRAFT: 'مسودة',
      ACTIVE: 'نشط',
      INACTIVE: 'غير نشط',
      EXPIRED: 'منتهي الصلاحية'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels = {
      BANNER: 'بانر',
      POPUP: 'نافذة منبثقة',
      SLIDER: 'شريحة',
      ANNOUNCEMENT: 'إعلان'
    };

    return (
      <Badge variant="outline">
        {labels[type] || type}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* الهيدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الإعلانات</h1>
          <p className="text-gray-600">إنشاء وإدارة الإعلانات والبانرات</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'إخفاء المعاينة' : 'معاينة'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAd(null);
                setForm(initialForm);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                إنشاء إعلان جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? 'تعديل الإعلان' : 'إنشاء إعلان جديد'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">العنوان *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      placeholder="عنوان الإعلان"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">النوع</Label>
                    <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SLIDER">شريحة</SelectItem>
                        <SelectItem value="BANNER">بانر</SelectItem>
                        <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                        <SelectItem value="POPUP">نافذة منبثقة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">المحتوى *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({...form, content: e.target.value})}
                    placeholder="محتوى الإعلان"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">رابط الصورة</Label>
                    <Input
                      id="imageUrl"
                      value={form.imageUrl}
                      onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl">رابط الإعلان</Label>
                    <Input
                      id="linkUrl"
                      value={form.linkUrl}
                      onChange={(e) => setForm({...form, linkUrl: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={form.status} onValueChange={(value) => setForm({...form, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">مسودة</SelectItem>
                        <SelectItem value="ACTIVE">نشط</SelectItem>
                        <SelectItem value="INACTIVE">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">الأولوية</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={form.priority}
                      onChange={(e) => setForm({...form, priority: parseInt(e.target.value) || 0})}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">الفئة المستهدفة</Label>
                    <Select value={form.targetRole} onValueChange={(value) => setForm({...form, targetRole: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="الكل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">الكل</SelectItem>
                        <SelectItem value="CLIENT">العملاء</SelectItem>
                        <SelectItem value="EMPLOYEE">الموظفين</SelectItem>
                        <SelectItem value="ADMIN">المديرين</SelectItem>
                        <SelectItem value="FINANCE_MANAGER">المدير المالي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">تاريخ البداية</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({...form, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">تاريخ النهاية</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({...form, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingAd ? 'تحديث' : 'إنشاء'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* معاينة السلايدر */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة السلايدر</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvertisementSlider 
              type="SLIDER"
              autoPlay={true}
              interval={3000}
            />
          </CardContent>
        </Card>
      )}

      {/* قائمة الإعلانات */}
      <Card>
        <CardHeader>
          <CardTitle>الإعلانات ({advertisements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : advertisements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد إعلانات
            </div>
          ) : (
            <div className="space-y-4">
              {advertisements.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ad.title}</h3>
                        {getStatusBadge(ad.status)}
                        {getTypeBadge(ad.type)}
                        {ad.priority > 0 && (
                          <Badge variant="destructive">أولوية: {ad.priority}</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{ad.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>بواسطة: {ad.creator.name}</span>
                        <span>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                        {ad.imageUrl && (
                          <span>
                            <ImageIcon className="h-4 w-4 inline mr-1" />
                            صورة
                          </span>
                        )}
                        {ad.linkUrl && (
                          <span>
                            <LinkIcon className="h-4 w-4 inline mr-1" />
                            رابط
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ad)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
