"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings,
  User,
  Bell,
  Shield,
  Save,
  X,
  Mail,
  Smartphone,
  Globe
} from "lucide-react";

interface ClientSettings {
  account: {
    username: string;
    email: string;
    phone: string;
    language: string;
    timezone: string;
    currency: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    browser: boolean;
    shipping: boolean;
    billing: boolean;
    support: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
}

const mockSettings: ClientSettings = {
  account: {
    username: "ahmed_client",
    email: "ahmed@client.com",
    phone: "+218 91 234 5678",
    language: "العربية",
    timezone: "Africa/Tripoli",
    currency: "دينار ليبي (LYD)"
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    browser: true,
    shipping: true,
    billing: true,
    support: true,
    marketing: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<ClientSettings>(mockSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">تخصيص إعدادات الحساب والنظام</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              تعديل الإعدادات
            </Button>
          )}
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">الحساب</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الحساب</CardTitle>
              <CardDescription>المعلومات الأساسية للحساب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={settings.account.username}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, username: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, email: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={settings.account.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <select
                    id="language"
                    value={settings.account.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, language: e.target.value }
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
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <select
                    id="timezone"
                    value={settings.account.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, timezone: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Africa/Tripoli">طرابلس (GMT+2)</option>
                    <option value="Asia/Shanghai">شنغهاي (GMT+8)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <select
                    id="currency"
                    value={settings.account.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      account: { ...settings.account, currency: e.target.value }
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تخصيص كيفية استلام الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  إشعارات البريد الإلكتروني
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>تفعيل إشعارات البريد الإلكتروني</span>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: checked }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الشحن</span>
                    <Switch
                      checked={settings.notifications.shipping}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, shipping: checked }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الفواتير</span>
                    <Switch
                      checked={settings.notifications.billing}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, billing: checked }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الدعم</span>
                    <Switch
                      checked={settings.notifications.support}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, support: checked }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات التسويق</span>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, marketing: checked }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  إشعارات SMS
                </h3>
                <div className="flex items-center justify-between">
                  <span>تفعيل إشعارات SMS</span>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: checked }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  إشعارات التطبيق
                </h3>
                <div className="flex items-center justify-between">
                  <span>تفعيل إشعارات التطبيق</span>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Browser Notifications */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  إشعارات المتصفح
                </h3>
                <div className="flex items-center justify-between">
                  <span>تفعيل إشعارات المتصفح</span>
                  <Switch
                    checked={settings.notifications.browser}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, browser: checked }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>إدارة أمان الحساب والجلسات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  المصادقة الثنائية
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">المصادقة الثنائية</p>
                    <p className="text-sm text-gray-600">
                      {settings.security.twoFactorAuth 
                        ? "مفعلة - تضيف طبقة أمان إضافية" 
                        : "غير مفعلة - يوصى بتفعيلها للأمان"}
                    </p>
                  </div>
                  <Button 
                    variant={settings.security.twoFactorAuth ? "destructive" : "default"}
                    onClick={() => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: !settings.security.twoFactorAuth }
                    })}
                    disabled={!isEditing}
                  >
                    {settings.security.twoFactorAuth ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                </div>
              </div>

              {/* Session Management */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  إدارة الجلسات
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">مهلة انتهاء الجلسة (دقائق)</Label>
                    <select
                      id="sessionTimeout"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة</option>
                      <option value={60}>ساعة واحدة</option>
                      <option value={120}>ساعتان</option>
                      <option value={480}>8 ساعات</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry">انتهاء صلاحية كلمة المرور (أيام)</Label>
                    <select
                      id="passwordExpiry"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={30}>30 يوم</option>
                      <option value={60}>60 يوم</option>
                      <option value={90}>90 يوم</option>
                      <option value={180}>180 يوم</option>
                      <option value={365}>365 يوم</option>
                    </select>
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