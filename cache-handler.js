/**
 * معالج التخزين المؤقت المخصص لتحسين الأداء
 */

class CacheHandler {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // التحقق من انتهاء صلاحية التخزين المؤقت
    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttl = 3600) {
    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expires });
    return true;
  }

  async revalidateTag(tag) {
    // حذف جميع العناصر المرتبطة بهذا الوسم
    for (const [key, item] of this.cache.entries()) {
      if (item.tags && item.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
    return true;
  }
}

module.exports = CacheHandler;
