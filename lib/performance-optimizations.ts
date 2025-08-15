/**
 * تحسينات الأداء العامة للتطبيق
 */

// تحسين أداء التمرير (Scrolling)
export const optimizeScrolling = () => {
  if (typeof window !== 'undefined') {
    // تقليل عدد مرات تشغيل أحداث التمرير
    let ticking = false;

    const updateScrollPosition = () => {
      // تحديث الموضع الحالي للتمرير
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }

  return () => {};
};

// تحسين أداء تغيير حجم النافذة
export const optimizeResize = () => {
  if (typeof window !== 'undefined') {
    let resizeTimeout;

    const handleResize = () => {
      // تحديث متغيرات CSS المتعلقة بحجم النافذة
      document.documentElement.style.setProperty('--window-width', `${window.innerWidth}px`);
      document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });

    // التهيئة الأولية
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }

  return () => {};
};

// تحسين أداء التحميل المسبق للروابط
export const optimizeLinkPrefetching = () => {
  if (typeof window !== 'undefined') {
    // تحميل الروابط المهمة مسبقًا عند تمرير الماوس فوقها
    const prefetchLinks = () => {
      const links = document.querySelectorAll('a[data-prefetch]');

      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          const href = link.getAttribute('href');
          if (href) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = href;
            document.head.appendChild(prefetchLink);
          }
        }, { once: true });
      });
    };

    // تأخير التنفيذ حتى يتم تحميل DOM بالكامل
    if (document.readyState === 'complete') {
      prefetchLinks();
    } else {
      window.addEventListener('load', prefetchLinks);
    }

    return () => {
      window.removeEventListener('load', prefetchLinks);
    };
  }

  return () => {};
};

// تحسين أداء الصور
export const optimizeImages = () => {
  if (typeof window !== 'undefined') {
    // استخدام Intersection Observer لتحميل الصور عند ظهورها في الشاشة
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // مراقبة جميع الصور التي لها سمة data-src
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      imageObserver.observe(img);
    });

    return () => {
      images.forEach(img => {
        imageObserver.unobserve(img);
      });
    };
  }

  return () => {};
};

// تحسين أداء الرسوم المتحركة
export const optimizeAnimations = () => {
  if (typeof window !== 'undefined') {
    // تقليل عدد الرسوم المتحركة عند تفعيل وضع توفير البطارية
    const reduceAnimations = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      }
    };

    reduceAnimations();

    // الاستماع لتغييرات تفضيلات المستخدم
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', reduceAnimations);

    return () => {
      motionQuery.removeEventListener('change', reduceAnimations);
    };
  }

  return () => {};
};

// تطبيق جميع تحسينات الأداء
export const applyPerformanceOptimizations = () => {
  const cleanupFunctions = [
    optimizeScrolling(),
    optimizeResize(),
    optimizeLinkPrefetching(),
    optimizeImages(),
    optimizeAnimations(),
  ];

  // إرجاع دالة لتنظيف جميع المستمعين
  return () => {
    cleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
  };
};
