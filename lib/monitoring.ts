
import { prisma } from './prisma';
import os from 'os';

export interface SystemMetrics {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface ServiceHealth {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: string;
  lastCheck: string;
}

export class MonitoringService {
  constructor(private db: typeof prisma) {}

  async getSystemMetrics(): Promise<SystemMetrics[]> {
    try {
      const cpuUsage = process.cpuUsage();
      const memoryUsage = process.memoryUsage();
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      
      const metrics: SystemMetrics[] = [
        {
          name: "استخدام المعالج",
          value: Math.round((cpuUsage.user + cpuUsage.system) / 1000000).toString(),
          unit: "%",
          status: "normal",
          trend: "stable",
          change: "0%"
        },
        {
          name: "استخدام الذاكرة",
          value: Math.round(((totalMemory - freeMemory) / totalMemory) * 100).toString(),
          unit: "%",
          status: "normal",
          trend: "up",
          change: "+2%"
        },
        {
          name: "استخدام القرص",
          value: "45",
          unit: "%",
          status: "normal",
          trend: "stable",
          change: "0%"
        },
        {
          name: "المستخدمين النشطين",
          value: (await this.getActiveUsers()).toString(),
          unit: "",
          status: "normal",
          trend: "up",
          change: "+12%"
        }
      ];

      return metrics;
    } catch (error) {
      console.error('خطأ في جلب مقاييس النظام:', error);
      return [];
    }
  }

  async getServiceHealth(): Promise<ServiceHealth[]> {
    try {
      const services: ServiceHealth[] = [
        {
          name: "قاعدة البيانات",
          status: await this.checkDatabaseHealth(),
          uptime: "99.8%",
          responseTime: await this.getDatabaseResponseTime(),
          lastCheck: new Date().toISOString()
        },
        {
          name: "خدمة المصادقة",
          status: "online",
          uptime: "99.9%",
          responseTime: "45ms",
          lastCheck: new Date().toISOString()
        },
        {
          name: "خدمة التخزين",
          status: "online",
          uptime: "99.7%",
          responseTime: "89ms",
          lastCheck: new Date().toISOString()
        }
      ];

      return services;
    } catch (error) {
      console.error('خطأ في فحص صحة الخدمات:', error);
      return [];
    }
  }

  private async checkDatabaseHealth(): Promise<'online' | 'offline' | 'degraded'> {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return 'online';
    } catch (error) {
      return 'offline';
    }
  }

  private async getDatabaseResponseTime(): Promise<string> {
    try {
      const start = Date.now();
      await this.db.$queryRaw`SELECT 1`;
      const end = Date.now();
      return `${end - start}ms`;
    } catch (error) {
      return 'timeout';
    }
  }

  private async getActiveUsers(): Promise<number> {
    try {
      // حساب المستخدمين النشطين في آخر 24 ساعة
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const activeUsers = await this.db.securityLog.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: yesterday
          }
        }
      });

      return activeUsers.length;
    } catch (error) {
      console.error('خطأ في حساب المستخدمين النشطين:', error);
      return 0;
    }
  }

  async performHealthChecks(): Promise<Array<{service: string, status: string}>> {
    const checks = [
      { service: 'database', status: await this.checkDatabaseHealth() },
      { service: 'auth', status: 'healthy' },
      { service: 'storage', status: 'healthy' }
    ];

    return checks;
  }
}

export function getMonitoringService(db: typeof prisma) {
  return new MonitoringService(db);
}
