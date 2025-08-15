"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Settings,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ClientProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    avatar?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  company: {
    name: string;
    position: string;
    website?: string;
    industry: string;
    employeeCount: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts';
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  shippingPreferences: {
    defaultOrigin: string;
    defaultDestination: string;
    preferredCarrier: string;
    packagingType: string;
    insuranceRequired: boolean;
  };
  account: {
    memberSince: string;
    lastLogin: string;
    status: 'active' | 'suspended' | 'pending';
    verificationStatus: 'verified' | 'pending' | 'unverified';
  };
}

const mockProfile: ClientProfile = {
  id: "1",
  personalInfo: {
    firstName: "أحمد",
    lastName: "محمد",
    email: "ahmed@client.com",
    phone: "+218 91 234 5678",
    dateOfBirth: "1985-03-15",
    gender: "male",
    avatar: "/avatars/client.jpg"
  },
  address: {
    street: "شارع طرابلس الرئيسي",
    city: "طرابلس",
    state: "طرابلس",
    country: "ليبيا",
    postalCode: "21861"
  },
  company: {
    name: "شركة أحمد محمد للتجارة",
    position: "مدير عام",
    website: "www.ahmedcompany.ly",
    industry: "تجارة عامة",
    employeeCount: "10-50"
  },
  preferences: {
    language: "العربية",
    currency: "دينار ليبي (LYD)",
    timezone: "Africa/Tripoli",
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: true
    },
    privacy: {
      profileVisibility: "contacts",
      showEmail: true,
      showPhone: false
    }
  },
  shippingPreferences: {
    defaultOrigin: "شنغهاي، الصين",
    defaultDestination: "طرابلس، ليبيا",
    preferredCarrier: "DHL",
    packagingType: "صناديق قوية",
    insuranceRequired: true
  },
  account: {
    memberSince: "2023-01-15",
    lastLogin: "2024-01-15T10:30:00Z",
    status: "active",
    verificationStatus: "verified"
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ClientProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Here you would typically save to backend
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unverified': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة المعلومات الشخصية والإعدادات</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                حفظ
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.personalInfo.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.personalInfo.firstName.charAt(0)}{profile.personalInfo.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </h2>
              <p className="text-gray-600">{profile.company.position} في {profile.company.name}</p>
              
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getStatusColor(profile.account.status)}>
                  {profile.account.status === 'active' ? 'نشط' : 
                   profile.account.status === 'suspended' ? 'معلق' : 'في الانتظار'}
                </Badge>
                <Badge className={getVerificationColor(profile.account.verificationStatus)}>
                  {profile.account.verificationStatus === 'verified' ? 'موثق' : 
                   profile.account.verificationStatus === 'pending' ? 'في الانتظار' : 'غير موثق'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>عضو منذ {new Date(profile.account.memberSince).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>آخر تسجيل دخول: {new Date(profile.account.lastLogin).toLocaleString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="company">معلومات الشركة</TabsTrigger>
          <TabsTrigger value="shipping">تفضيلات الشحن</TabsTrigger>
          <TabsTrigger value="preferences">الإعدادات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>المعلومات الأساسية الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, firstName: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, lastName: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, email: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, dateOfBirth: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">الجنس</Label>
                  <select
                    id="gender"
                    value={profile.personalInfo.gender}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, gender: e.target.value as any }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                    <option value="other">آخر</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>العنوان</CardTitle>
              <CardDescription>عنوان الإقامة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">الشارع</Label>
                  <Input
                    id="street"
                    value={profile.address.street}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={profile.address.city}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, city: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="state">الولاية/المحافظة</Label>
                  <Input
                    id="state"
                    value={profile.address.state}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, state: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="country">البلد</Label>
                  <Input
                    id="country"
                    value={profile.address.country}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, country: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">الرمز البريدي</Label>
                  <Input
                    id="postalCode"
                    value={profile.address.postalCode}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, postalCode: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
              <CardDescription>تفاصيل الشركة والعمل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input
                    id="companyName"
                    value={profile.company.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      company: { ...profile.company, name: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="position">المنصب</Label>
                  <Input
                    id="position"
                    value={profile.company.position}
                    onChange={(e) => setProfile({
                      ...profile,
                      company: { ...profile.company, position: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input
                    id="website"
                    value={profile.company.website || ""}
                    onChange={(e) => setProfile({
                      ...profile,
                      company: { ...profile.company, website: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">الصناعة</Label>
                  <Input
                    id="industry"
                    value={profile.company.industry}
                    onChange={(e) => setProfile({
                      ...profile,
                      company: { ...profile.company, industry: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCount">عدد الموظفين</Label>
                  <select
                    id="employeeCount"
                    value={profile.company.employeeCount}
                    onChange={(e) => setProfile({
                      ...profile,
                      company: { ...profile.company, employeeCount: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="1-10">1-10</option>
                    <option value="10-50">10-50</option>
                    <option value="50-200">50-200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Preferences */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الشحن</CardTitle>
              <CardDescription>الإعدادات الافتراضية للشحن</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultOrigin">نقطة الأصل الافتراضية</Label>
                  <Input
                    id="defaultOrigin"
                    value={profile.shippingPreferences.defaultOrigin}
                    onChange={(e) => setProfile({
                      ...profile,
                      shippingPreferences: { ...profile.shippingPreferences, defaultOrigin: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultDestination">نقطة الوجهة الافتراضية</Label>
                  <Input
                    id="defaultDestination"
                    value={profile.shippingPreferences.defaultDestination}
                    onChange={(e) => setProfile({
                      ...profile,
                      shippingPreferences: { ...profile.shippingPreferences, defaultDestination: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredCarrier">شركة الشحن المفضلة</Label>
                  <select
                    id="preferredCarrier"
                    value={profile.shippingPreferences.preferredCarrier}
                    onChange={(e) => setProfile({
                      ...profile,
                      shippingPreferences: { ...profile.shippingPreferences, preferredCarrier: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="Aramex">Aramex</option>
                    <option value="Local">شركة محلية</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="packagingType">نوع التغليف المفضل</Label>
                  <select
                    id="packagingType"
                    value={profile.shippingPreferences.packagingType}
                    onChange={(e) => setProfile({
                      ...profile,
                      shippingPreferences: { ...profile.shippingPreferences, packagingType: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="صناديق قوية">صناديق قوية</option>
                    <option value="أكياس بلاستيكية">أكياس بلاستيكية</option>
                    <option value="تغليف فقاعي">تغليف فقاعي</option>
                    <option value="حاويات خشبية">حاويات خشبية</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="insuranceRequired"
                      checked={profile.shippingPreferences.insuranceRequired}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        shippingPreferences: { ...profile.shippingPreferences, insuranceRequired: checked }
                      })}
                      disabled={!isEditing}
                    />
                    <Label htmlFor="insuranceRequired">تأمين الشحن مطلوب</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>تفضيلات اللغة والعملة والمنطقة الزمنية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <select
                    id="language"
                    value={profile.preferences.language}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, language: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="العربية">العربية</option>
                    <option value="English">English</option>
                    <option value="Français">Français</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <select
                    id="currency"
                    value={profile.preferences.currency}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, currency: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="دينار ليبي (LYD)">دينار ليبي (LYD)</option>
                    <option value="دولار أمريكي (USD)">دولار أمريكي (USD)</option>
                    <option value="يوان صيني (CNY)">يوان صيني (CNY)</option>
                    <option value="يورو (EUR)">يورو (EUR)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <select
                    id="timezone"
                    value={profile.preferences.timezone}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, timezone: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Africa/Tripoli">طرابلس (GMT+2)</option>
                    <option value="Asia/Shanghai">شنغهاي (GMT+8)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تخصيص كيفية استلام الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>إشعارات البريد الإلكتروني</span>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.email}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, email: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>رسائل SMS</span>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.sms}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, sms: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>إشعارات التطبيق</span>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.push}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, push: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>إشعارات التسويق</span>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.marketing}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, marketing: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الخصوصية</CardTitle>
              <CardDescription>التحكم في رؤية المعلومات الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">رؤية الملف الشخصي</Label>
                <select
                  id="profileVisibility"
                  value={profile.preferences.privacy.profileVisibility}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      privacy: { ...profile.preferences.privacy, profileVisibility: e.target.value as any }
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="public">عام</option>
                  <option value="contacts">جهات الاتصال فقط</option>
                  <option value="private">خاص</option>
                </select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>إظهار البريد الإلكتروني</span>
                  <Switch
                    checked={profile.preferences.privacy.showEmail}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        privacy: { ...profile.preferences.privacy, showEmail: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>إظهار رقم الهاتف</span>
                  <Switch
                    checked={profile.preferences.privacy.showPhone}
                    onCheckedChange={(checked) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        privacy: { ...profile.preferences.privacy, showPhone: checked }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>إدارة كلمة المرور والأمان</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">تغيير كلمة المرور</h3>
                  {!showPasswordChange ? (
                    <Button onClick={() => setShowPasswordChange(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      تغيير كلمة المرور
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={handlePasswordChange}>
                          <Save className="h-4 w-4 mr-2" />
                          حفظ كلمة المرور الجديدة
                        </Button>
                        <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                          <X className="h-4 w-4 mr-2" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">إعدادات الأمان الإضافية</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>المصادقة الثنائية</span>
                      <Button variant="outline" size="sm">
                        تفعيل
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>جلسات تسجيل الدخول النشطة</span>
                      <Button variant="outline" size="sm">
                        عرض
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>سجل تسجيل الدخول</span>
                      <Button variant="outline" size="sm">
                        عرض
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 