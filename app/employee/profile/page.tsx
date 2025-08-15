"use client"

import { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Award,
  Clock,
  Building,
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface EmployeeProfile {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  employeeId: string
  address: string
  city: string
  country: string
  dateOfBirth: string
  gender: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  skills: string[]
  certifications: Certification[]
  workHistory: WorkHistory[]
  education: Education[]
  performance: PerformanceStats
}

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'pending'
}

interface WorkHistory {
  id: string
  position: string
  company: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  degree: string
  institution: string
  graduationYear: string
  field: string
}

interface PerformanceStats {
  rating: number
  completedTasks: number
  totalTasks: number
  attendanceRate: number
  efficiencyScore: number
  customerSatisfaction: number
}

const mockProfile: EmployeeProfile = {
  id: "1",
  name: "سارة أحمد محمد",
  email: "sara.ahmed@company.com",
  phone: "+218 91 234 5678",
  position: "مدير العمليات",
  department: "إدارة الشحن",
  joinDate: "2022-03-15",
  employeeId: "EMP-001",
  address: "شارع طرابلس الرئيسي",
  city: "طرابلس",
  country: "ليبيا",
  dateOfBirth: "1990-05-20",
  gender: "أنثى",
  emergencyContact: {
    name: "أحمد محمد",
    phone: "+218 92 345 6789",
    relationship: "أخ"
  },
  skills: [
    "إدارة سلسلة التوريد",
    "إدارة المشاريع",
    "تحليل البيانات",
    "التواصل الفعال",
    "القيادة",
    "حل المشاكل",
    "العمل الجماعي",
    "إدارة الوقت"
  ],
  certifications: [
    {
      id: "1",
      name: "شهادة إدارة سلسلة التوريد",
      issuer: "معهد الشحن الدولي",
      issueDate: "2023-06-15",
      expiryDate: "2025-06-15",
      status: "active"
    },
    {
      id: "2",
      name: "شهادة إدارة المشاريع",
      issuer: "PMI",
      issueDate: "2022-12-10",
      expiryDate: "2024-12-10",
      status: "active"
    },
    {
      id: "3",
      name: "شهادة الجودة",
      issuer: "ISO",
      issueDate: "2021-08-20",
      expiryDate: "2023-08-20",
      status: "expired"
    }
  ],
  workHistory: [
    {
      id: "1",
      position: "مدير العمليات",
      company: "شركة الشحن الحالية",
      startDate: "2022-03-15",
      endDate: "الحالي",
      description: "إدارة عمليات الشحن والتنسيق مع الموردين والعملاء"
    },
    {
      id: "2",
      position: "مشرف شحن",
      company: "شركة النقل السابقة",
      startDate: "2019-01-10",
      endDate: "2022-02-28",
      description: "إشراف على عمليات الشحن والتخليص الجمركي"
    },
    {
      id: "3",
      position: "موظف شحن",
      company: "شركة الشحن الأولى",
      startDate: "2017-06-01",
      endDate: "2018-12-31",
      description: "معالجة الشحنات والتواصل مع العملاء"
    }
  ],
  education: [
    {
      id: "1",
      degree: "ماجستير في إدارة الأعمال",
      institution: "جامعة طرابلس",
      graduationYear: "2019",
      field: "إدارة الأعمال"
    },
    {
      id: "2",
      degree: "بكالوريوس في التجارة",
      institution: "جامعة بنغازي",
      graduationYear: "2017",
      field: "التجارة الدولية"
    }
  ],
  performance: {
    rating: 4.8,
    completedTasks: 156,
    totalTasks: 165,
    attendanceRate: 98,
    efficiencyScore: 92,
    customerSatisfaction: 96
  }
}

const getCertificationStatusColor = (status: Certification['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'expired': return 'bg-red-100 text-red-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getCertificationStatusText = (status: Certification['status']) => {
  switch (status) {
    case 'active': return 'نشط'
    case 'expired': return 'منتهي الصلاحية'
    case 'pending': return 'في الانتظار'
    default: return 'غير محدد'
  }
}

export default function EmployeeProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [editedProfile, setEditedProfile] = useState(mockProfile)

  const handleEdit = () => {
    setEditedProfile(profile)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const currentProfile = isEditing ? editedProfile : profile

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600">عرض وتعديل المعلومات الشخصية</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="ml-2 h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="ml-2 h-4 w-4" />
                إلغاء
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-16 w-16 text-blue-600" />
                  </div>
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{currentProfile.name}</h2>
                  <p className="text-gray-600">{currentProfile.position}</p>
                  <p className="text-sm text-gray-500">{currentProfile.department}</p>
                </div>
                <div className="flex justify-center">
                  <Badge variant="outline">الموظف #{currentProfile.employeeId}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                إحصائيات الأداء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">التقييم العام:</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{profile.performance.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">المهام المكتملة:</span>
                <span className="font-semibold">{profile.performance.completedTasks}/{profile.performance.totalTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">معدل الحضور:</span>
                <span className="font-semibold">{profile.performance.attendanceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">كفاءة العمل:</span>
                <span className="font-semibold">{profile.performance.efficiencyScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">رضا العملاء:</span>
                <span className="font-semibold">{profile.performance.customerSatisfaction}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
              <TabsTrigger value="professional">المهنية</TabsTrigger>
              <TabsTrigger value="skills">المهارات والشهادات</TabsTrigger>
              <TabsTrigger value="history">السيرة الذاتية</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
                      <Input
                        value={currentProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <Input
                        value={currentProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                      <Input
                        value={currentProfile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                      <Input
                        type="date"
                        value={currentProfile.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">الجنس</label>
                      <Input
                        value={currentProfile.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                      <Input
                        value={currentProfile.joinDate}
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">العنوان</label>
                    <Textarea
                      value={currentProfile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">المدينة</label>
                      <Input
                        value={currentProfile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">البلد</label>
                      <Input
                        value={currentProfile.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>جهة الاتصال في الطوارئ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">الاسم</label>
                      <Input
                        value={currentProfile.emergencyContact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                      <Input
                        value={currentProfile.emergencyContact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">العلاقة</label>
                      <Input
                        value={currentProfile.emergencyContact.relationship}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات المهنية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">المنصب الحالي</label>
                      <Input
                        value={currentProfile.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">القسم</label>
                      <Input
                        value={currentProfile.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">رقم الموظف</label>
                      <Input
                        value={currentProfile.employeeId}
                        disabled
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                      <Input
                        value={currentProfile.joinDate}
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المهارات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الشهادات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">
                            تاريخ الإصدار: {cert.issueDate} | تاريخ الانتهاء: {cert.expiryDate}
                          </p>
                        </div>
                        <Badge className={getCertificationStatusColor(cert.status)}>
                          {getCertificationStatusText(cert.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    الخبرة العملية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.workHistory.map((work) => (
                    <div key={work.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{work.position}</h4>
                          <p className="text-sm text-gray-600">{work.company}</p>
                          <p className="text-xs text-gray-500">
                            {work.startDate} - {work.endDate}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">{work.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    التعليم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">
                          {edu.field} | {edu.graduationYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 