# تحسينات الواجهة الأمامية (Frontend)

## 1. تحسين أداء التحميل

### استخدام التحميل الكسول (Lazy Loading) للمكونات
```tsx
// قبل التحسين - تحميل جميع المكونات دفعة واحدة
import ShipmentTable from '@/components/shipments/shipment-table';
import ShipmentFilters from '@/components/shipments/shipment-filters';
import ShipmentStats from '@/components/shipments/shipment-stats';

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      <ShipmentStats />
      <ShipmentFilters />
      <ShipmentTable />
    </div>
  );
}

// بعد التحسين - تحميل المكونات عند الحاجة
import dynamic from 'next/dynamic';

// تحميل المكونات الكبيرة بشكل كسول
const ShipmentTable = dynamic(
  () => import('@/components/shipments/shipment-table'),
  { loading: () => <div>جاري التحميل...</div>, ssr: false }
);

const ShipmentStats = dynamic(
  () => import('@/components/shipments/shipment-stats'),
  { loading: () => <div>جاري التحميل...</div> }
);

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      <ShipmentStats />
      <ShipmentFilters />
      <ShipmentTable />
    </div>
  );
}
```

### استخدام التحميل المشروط للمكونات
```tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ShipmentDetails = dynamic(
  () => import('@/components/shipments/shipment-details'),
  { loading: () => <div>جاري التحميل...</div> }
);

export default function ShipmentsPage() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3">
        <ShipmentTable onSelect={setSelectedShipment} />
      </div>
      <div className="md:w-1/3">
        {selectedShipment && <ShipmentDetails id={selectedShipment} />}
      </div>
    </div>
  );
}
```

## 2. تحسين إدارة الحالة (State Management)

### استخدام Zustand بشكل فعال
```tsx
// قبل التحديث - استخدام حالة محلية في كل مكون
function ShipmentTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('/api/shipments');
        const data = await response.json();
        setShipments(data.data.shipments);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // ... باقي المكون
}

// بعد التحديث - استخدام Zustand لإدارة الحالة المشتركة
import { create } from 'zustand';

interface ShipmentStore {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
}

const useShipmentStore = create<ShipmentStore>((set, get) => ({
  shipments: [],
  loading: false,
  error: null,

  fetchShipments: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/shipments');
      const data = await response.json();

      if (data.success) {
        set({ shipments: data.data.shipments, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      set({ error: 'فشل في جلب الشحنات', loading: false });
    }
  },

  addShipment: (shipment) => {
    set((state) => ({
      shipments: [shipment, ...state.shipments]
    }));
  },

  updateShipment: (id, updates) => {
    set((state) => ({
      shipments: state.shipments.map((shipment) =>
        shipment.id === id ? { ...shipment, ...updates } : shipment
      )
    }));
  },

  deleteShipment: (id) => {
    set((state) => ({
      shipments: state.shipments.filter((shipment) => shipment.id !== id)
    }));
  }
}));

// استخدام المتجر في المكون
function ShipmentTable() {
  const { shipments, loading, error, fetchShipments } = useShipmentStore();

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      {shipments.map((shipment) => (
        <ShipmentRow key={shipment.id} shipment={shipment} />
      ))}
    </div>
  );
}
```

## 3. تحسين الطلبات (API Requests)

### استخدام SWR أو React Query لإدارة الطلبات
```tsx
// قبل التحديث - استخدام useEffect و fetch
function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/shipments');
        const data = await response.json();

        if (data.success) {
          setShipments(data.data.shipments);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('فشل في جلب الشحنات');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // ... باقي المكون
}

// بعد التحديث - استخدام SWR
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

function ShipmentsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/shipments', fetcher);

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error.message}</div>;

  const shipments = data?.shipments || [];

  // ... باقي المكون
}
```

### تحسين الطلبات المتعددة
```tsx
// قبل التحديث - طلبات متعددة بشكل منفصل
function DashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [shipmentsRes, clientsRes, invoicesRes] = await Promise.all([
          fetch('/api/shipments'),
          fetch('/api/clients'),
          fetch('/api/invoices')
        ]);

        const shipmentsData = await shipmentsRes.json();
        const clientsData = await clientsRes.json();
        const invoicesData = await invoicesRes.json();

        setShipments(shipmentsData.data.shipments);
        setClients(clientsData.data.clients);
        setInvoices(invoicesData.data.invoices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... باقي المكون
}

// بعد التحديث - استخدام SWR مع طلبات متعددة
import useSWR from 'swr';

function DashboardPage() {
  const { data: shipmentsData, error: shipmentsError } = useSWR('/api/shipments');
  const { data: clientsData, error: clientsError } = useSWR('/api/clients');
  const { data: invoicesData, error: invoicesError } = useSWR('/api/invoices');

  const shipments = shipmentsData?.shipments || [];
  const clients = clientsData?.clients || [];
  const invoices = invoicesData?.invoices || [];

  if (!shipmentsData || !clientsData || !invoicesData) {
    return <div>جاري التحميل...</div>;
  }

  if (shipmentsError || clientsError || invoicesError) {
    return <div>حدث خطأ في تحميل البيانات</div>;
  }

  // ... باقي المكون
}
```

## 4. تحسين أداء المكونات

### استخدام React.memo لمنع إعادة التصيير غير الضرورية
```tsx
// قبل التحديث - المكون يعيد التصيير مع كل تغيير في الحالة
function ShipmentRow({ shipment }: { shipment: Shipment }) {
  return (
    <tr>
      <td>{shipment.trackingNumber}</td>
      <td>{shipment.origin}</td>
      <td>{shipment.destination}</td>
      <td>{shipment.status}</td>
      <td>{shipment.createdAt}</td>
    </tr>
  );
}

// بعد التحديث - استخدام React.memo
const ShipmentRow = React.memo(({ shipment }: { shipment: Shipment }) => {
  return (
    <tr>
      <td>{shipment.trackingNumber}</td>
      <td>{shipment.origin}</td>
      <td>{shipment.destination}</td>
      <td>{shipment.status}</td>
      <td>{shipment.createdAt}</td>
    </tr>
  );
});

// إضافة مقارنة مخصصة إذا لزم الأمر
const ShipmentRow = React.memo(
  ({ shipment }: { shipment: Shipment }) => {
    return (
      <tr>
        <td>{shipment.trackingNumber}</td>
        <td>{shipment.origin}</td>
        <td>{shipment.destination}</td>
        <td>{shipment.status}</td>
        <td>{shipment.createdAt}</td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // مقارنة مخصصة لمنع إعادة التصيير إلا عند تغيير الحقول المهمة
    return (
      prevProps.shipment.id === nextProps.shipment.id &&
      prevProps.shipment.status === nextProps.shipment.status &&
      prevProps.shipment.trackingNumber === nextProps.shipment.trackingNumber
    );
  }
);
```

### استخدام useMemo و useCallback
```tsx
// قبل التحديث - إعادة الحساب في كل مرة
function ShipmentTable({ shipments }: { shipments: Shipment[] }) {
  const filteredShipments = shipments.filter(shipment => 
    shipment.status === 'IN_TRANSIT'
  );

  const handleStatusChange = (id: string, status: string) => {
    // تحديث حالة الشحنة
  };

  return (
    <table>
      {filteredShipments.map(shipment => (
        <ShipmentRow 
          key={shipment.id} 
          shipment={shipment} 
          onStatusChange={handleStatusChange}
        />
      ))}
    </table>
  );
}

// بعد التحديث - استخدام useMemo و useCallback
function ShipmentTable({ shipments }: { shipments: Shipment[] }) {
  // استخدام useMemo لحفظ نتيجة التصفية
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => 
      shipment.status === 'IN_TRANSIT'
    );
  }, [shipments]);

  // استخدام useCallback لحفظ الدالة
  const handleStatusChange = useCallback((id: string, status: string) => {
    // تحديث حالة الشحنة
  }, []);

  return (
    <table>
      {filteredShipments.map(shipment => (
        <ShipmentRow 
          key={shipment.id} 
          shipment={shipment} 
          onStatusChange={handleStatusChange}
        />
      ))}
    </table>
  );
}
```

## 5. تحسين تحميل الصور والأصول

### استخدام تحميل الصور المحسن
```tsx
// قبل التحديث - استخدام علامة img العادية
function ShipmentImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-full h-auto" />;
}

// بعد التحديث - استخدام مكون Image من Next.js
import Image from 'next/image';

function ShipmentImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={300}
      className="w-full h-auto"
      loading="lazy"
    />
  );
}
```

### استخدام الأصول المحسنة
```tsx
// قبل التحديث - تحميل جميع الأصول دفعة واحدة
import heavyChartLibrary from 'heavy-chart-library';

function Dashboard() {
  // استخدام المكتبة الثقيلة
  return <ChartComponent data={data} library={heavyChartLibrary} />;
}

// بعد التحديث - تحميل الأصول عند الحاجة
import dynamic from 'next/dynamic';

// تحميل المكتبة الثقيلة بشكل ديناميكي
const ChartComponent = dynamic(
  () => import('heavy-chart-library').then(mod => mod.Chart),
  { 
    loading: () => <div>جاري تحميل الرسم البياني...</div>,
    ssr: false 
  }
);

function Dashboard() {
  return <ChartComponent data={data} />;
}
```
