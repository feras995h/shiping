"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Home,
  Building,
  Star,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  MoreVertical,
  Search,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Address {
  id: string;
  name: string;
  type: 'home' | 'work' | 'warehouse' | 'other';
  isDefault: boolean;
  isVerified: boolean;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  contactPerson: string;
  notes?: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    name: "المنزل الرئيسي",
    type: "home",
    isDefault: true,
    isVerified: true,
    street: "شارع طرابلس الرئيسي",
    city: "طرابلس",
    state: "طرابلس",
    country: "ليبيا",
    postalCode: "21861",
    phone: "+218 91 234 5678",
    contactPerson: "أحمد محمد",
    notes: "العنوان الرئيسي للمنزل",
    createdAt: "2023-01-15T10:30:00Z",
    lastUsed: "2024-01-15T14:20:00Z",
    usageCount: 25
  },
  {
    id: "2",
    name: "مكتب العمل",
    type: "work",
    isDefault: false,
    isVerified: true,
    street: "شارع بنغازي التجاري",
    city: "بنغازي",
    state: "بنغازي",
    country: "ليبيا",
    postalCode: "21862",
    phone: "+218 92 345 6789",
    contactPerson: "فاطمة علي",
    notes: "عنوان مكتب العمل الرئيسي",
    createdAt: "2023-02-20T09:15:00Z",
    lastUsed: "2024-01-10T11:30:00Z",
    usageCount: 15
  },
  {
    id: "3",
    name: "المستودع",
    type: "warehouse",
    isDefault: false,
    isVerified: false,
    street: "منطقة الصناعية",
    city: "مصراتة",
    state: "مصراتة",
    country: "ليبيا",
    postalCode: "21863",
    phone: "+218 93 456 7890",
    contactPerson: "محمد أحمد",
    notes: "مستودع البضائع",
    createdAt: "2023-03-10T16:45:00Z",
    lastUsed: "2024-01-05T08:15:00Z",
    usageCount: 8
  },
  {
    id: "4",
    name: "عنوان بديل",
    type: "other",
    isDefault: false,
    isVerified: true,
    street: "شارع سرت",
    city: "سرت",
    state: "سرت",
    country: "ليبيا",
    postalCode: "21864",
    phone: "+218 94 567 8901",
    contactPerson: "علي حسن",
    notes: "عنوان بديل للشحنات",
    createdAt: "2023-04-05T12:20:00Z",
    lastUsed: "2023-12-20T15:45:00Z",
    usageCount: 3
  }
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [newAddress, setNewAddress] = useState({
    name: "",
    type: "home" as const,
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    contactPerson: "",
    notes: ""
  });

  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || address.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateAddress = () => {
    const address: Address = {
      id: Date.now().toString(),
      name: newAddress.name,
      type: newAddress.type,
      isDefault: addresses.length === 0,
      isVerified: false,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      country: newAddress.country,
      postalCode: newAddress.postalCode,
      phone: newAddress.phone,
      contactPerson: newAddress.contactPerson,
      notes: newAddress.notes,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    
    setAddresses([address, ...addresses]);
    setNewAddress({
      name: "", type: "home", street: "", city: "", state: "", country: "",
      postalCode: "", phone: "", contactPerson: "", notes: ""
    });
    setShowNewAddress(false);
  };

  const handleEditAddress = () => {
    if (!selectedAddress) return;
    
    setAddresses(addresses.map(addr =>
      addr.id === selectedAddress.id ? { ...selectedAddress } : addr
    ));
    setShowEditAddress(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Building className="h-4 w-4" />;
      case 'warehouse': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-800';
      case 'work': return 'bg-green-100 text-green-800';
      case 'warehouse': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'home': return 'منزل';
      case 'work': return 'عمل';
      case 'warehouse': return 'مستودع';
      default: return 'آخر';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const defaultAddress = addresses.find(addr => addr.isDefault);
  const verifiedAddresses = addresses.filter(addr => addr.isVerified).length;
  const totalAddresses = addresses.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">العناوين</h1>
          <p className="text-gray-600">إدارة العناوين المختلفة</p>
        </div>
        <Button onClick={() => setShowNewAddress(true)}>
          <Plus className="h-4 w-4 mr-2" />
          عنوان جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي العناوين</p>
                <p className="text-2xl font-bold">{totalAddresses}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">العناوين الموثقة</p>
                <p className="text-2xl font-bold">{verifiedAddresses}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">العنوان الافتراضي</p>
                <p className="text-2xl font-bold">{defaultAddress?.name || 'غير محدد'}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">آخر استخدام</p>
                <p className="text-2xl font-bold">
                  {defaultAddress?.lastUsed ? formatDate(defaultAddress.lastUsed) : 'غير محدد'}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Addresses List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>العناوين</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في العناوين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="home">منزل</SelectItem>
                    <SelectItem value="work">عمل</SelectItem>
                    <SelectItem value="warehouse">مستودع</SelectItem>
                    <SelectItem value="other">آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedAddress?.id === address.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">{address.name}</h4>
                          {address.isDefault && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              افتراضي
                            </Badge>
                          )}
                          {address.isVerified && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{address.street}</p>
                        <p className="text-xs text-gray-500">{address.city}, {address.state}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getTypeColor(address.type)}`}>
                            {getTypeText(address.type)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {address.usageCount} استخدام
                          </span>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedAddress(address)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedAddress(address);
                            setShowEditAddress(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            تعيين كافتراضي
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAddress(address.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل العنوان</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAddress ? (
                <div className="space-y-4">
                  {/* Address Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${getTypeColor(selectedAddress.type)}`}>
                            {getTypeIcon(selectedAddress.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{selectedAddress.name}</h3>
                            <p className="text-sm text-gray-600">{getTypeText(selectedAddress.type)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedAddress.isDefault && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              افتراضي
                            </Badge>
                          )}
                          {selectedAddress.isVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              موثق
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              غير موثق
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          نسخ
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowEditAddress(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">تفاصيل العنوان</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">الشارع:</span>
                          <span className="font-medium mr-2">{selectedAddress.street}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">المدينة:</span>
                          <span className="font-medium mr-2">{selectedAddress.city}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">الولاية:</span>
                          <span className="font-medium mr-2">{selectedAddress.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">البلد:</span>
                          <span className="font-medium mr-2">{selectedAddress.country}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">الرمز البريدي:</span>
                          <span className="font-medium mr-2">{selectedAddress.postalCode}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">معلومات الاتصال</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">الشخص المسؤول:</span>
                          <span className="font-medium mr-2">{selectedAddress.contactPerson}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">رقم الهاتف:</span>
                          <span className="font-medium mr-2">{selectedAddress.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد الاستخدامات:</span>
                          <span className="font-medium mr-2">{selectedAddress.usageCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">آخر استخدام:</span>
                          <span className="font-medium mr-2">
                            {selectedAddress.lastUsed ? formatDate(selectedAddress.lastUsed) : 'غير محدد'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">تاريخ الإنشاء:</span>
                          <span className="font-medium mr-2">{formatDate(selectedAddress.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAddress.notes && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">ملاحظات</h4>
                      <p className="text-sm text-gray-700">{selectedAddress.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر عنواناً لعرض تفاصيله</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">عنوان جديد</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم العنوان</Label>
                <Input
                  id="name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="type">نوع العنوان</Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value: any) => setNewAddress({...newAddress, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">منزل</SelectItem>
                    <SelectItem value="work">عمل</SelectItem>
                    <SelectItem value="warehouse">مستودع</SelectItem>
                    <SelectItem value="other">آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="street">الشارع</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="state">الولاية</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">البلد</Label>
                  <Input
                    id="country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">الرمز البريدي</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                <Input
                  id="contactPerson"
                  value={newAddress.contactPerson}
                  onChange={(e) => setNewAddress({...newAddress, contactPerson: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={newAddress.notes}
                  onChange={(e) => setNewAddress({...newAddress, notes: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreateAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة العنوان
                </Button>
                <Button variant="outline" onClick={() => setShowNewAddress(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditAddress && selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">تعديل العنوان</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">اسم العنوان</Label>
                <Input
                  id="edit-name"
                  value={selectedAddress.name}
                  onChange={(e) => setSelectedAddress({...selectedAddress, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">نوع العنوان</Label>
                <Select
                  value={selectedAddress.type}
                  onValueChange={(value: any) => setSelectedAddress({...selectedAddress, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">منزل</SelectItem>
                    <SelectItem value="work">عمل</SelectItem>
                    <SelectItem value="warehouse">مستودع</SelectItem>
                    <SelectItem value="other">آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-street">الشارع</Label>
                <Input
                  id="edit-street"
                  value={selectedAddress.street}
                  onChange={(e) => setSelectedAddress({...selectedAddress, street: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-city">المدينة</Label>
                  <Input
                    id="edit-city"
                    value={selectedAddress.city}
                    onChange={(e) => setSelectedAddress({...selectedAddress, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">الولاية</Label>
                  <Input
                    id="edit-state"
                    value={selectedAddress.state}
                    onChange={(e) => setSelectedAddress({...selectedAddress, state: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-country">البلد</Label>
                  <Input
                    id="edit-country"
                    value={selectedAddress.country}
                    onChange={(e) => setSelectedAddress({...selectedAddress, country: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-postalCode">الرمز البريدي</Label>
                  <Input
                    id="edit-postalCode"
                    value={selectedAddress.postalCode}
                    onChange={(e) => setSelectedAddress({...selectedAddress, postalCode: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-contactPerson">الشخص المسؤول</Label>
                <Input
                  id="edit-contactPerson"
                  value={selectedAddress.contactPerson}
                  onChange={(e) => setSelectedAddress({...selectedAddress, contactPerson: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  value={selectedAddress.phone}
                  onChange={(e) => setSelectedAddress({...selectedAddress, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Input
                  id="edit-notes"
                  value={selectedAddress.notes || ""}
                  onChange={(e) => setSelectedAddress({...selectedAddress, notes: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleEditAddress}>
                  <Edit className="h-4 w-4 mr-2" />
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setShowEditAddress(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 