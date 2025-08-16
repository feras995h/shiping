
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Advertisement {
  id: string
  title: string
  description?: string
  content: string
  imageUrl?: string
  linkUrl?: string
  isActive: boolean
  order: number
  startDate?: string
  endDate?: string
}

interface AdvertisementSliderProps {
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export function AdvertisementSlider({
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = ""
}: AdvertisementSliderProps) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  useEffect(() => {
    if (autoPlay && advertisements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % advertisements.length)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [autoPlay, interval, advertisements.length])

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertisements')
      const data = await response.json()
      
      if (data.success) {
        setAdvertisements(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب الإعلانات:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? advertisements.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length)
  }

  if (isLoading) {
    return (
      <Card className={`w-full h-64 ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">جاري تحميل الإعلانات...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (advertisements.length === 0) {
    return null
  }

  const currentAd = advertisements[currentIndex]

  return (
    <Card className={`relative w-full overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative h-64 md:h-80 lg:h-96">
          {/* الإعلان الحالي */}
          <div className="relative w-full h-full">
            {currentAd.imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={currentAd.imageUrl}
                  alt={currentAd.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}
            
            <div className="relative z-10 flex flex-col justify-center h-full p-6 text-white">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {currentAd.title}
                </h2>
                
                {currentAd.description && (
                  <p className="text-lg mb-4 opacity-90">
                    {currentAd.description}
                  </p>
                )}
                
                <div className="text-sm mb-4 opacity-80">
                  {currentAd.content}
                </div>
                
                {currentAd.linkUrl && (
                  <Link href={currentAd.linkUrl} target="_blank">
                    <Button variant="secondary" className="inline-flex items-center">
                      المزيد من التفاصيل
                      <ExternalLink className="h-4 w-4 mr-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* أسهم التنقل */}
          {showArrows && advertisements.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* مؤشرات التنقل */}
          {showDots && advertisements.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}

          {/* عداد الإعلانات */}
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 z-20 bg-white/80"
          >
            {currentIndex + 1} من {advertisements.length}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdvertisementSliderProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  type?: 'SLIDER' | 'BANNER' | 'ANNOUNCEMENT';
}

export function AdvertisementSlider({
  className,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  type = 'SLIDER'
}: AdvertisementSliderProps) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب الإعلانات النشطة
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/advertisements?active=true&type=${type}`);
        const data = await response.json();
        
        if (data.success) {
          setAdvertisements(data.data || []);
        } else {
          setError(data.message || 'خطأ في جلب الإعلانات');
        }
      } catch (error) {
        console.error('خطأ في جلب الإعلانات:', error);
        setError('خطأ في الاتصال بالخادم');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisements();
  }, [type]);

  // التنقل التلقائي
  useEffect(() => {
    if (!autoPlay || advertisements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, advertisements.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className={cn("w-full h-48 bg-gray-100 animate-pulse rounded-lg", className)} />
    );
  }

  if (error || advertisements.length === 0) {
    return null;
  }

  const currentAd = advertisements[currentIndex];

  return (
    <div className={cn("relative w-full", className)}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64 lg:h-80">
            {/* الصورة الخلفية */}
            {currentAd.imageUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${currentAd.imageUrl})` }}
              />
            )}
            
            {/* التدرج */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            
            {/* المحتوى */}
            <div className="relative h-full flex items-center p-6 md:p-8">
              <div className="text-white max-w-2xl">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
                  {currentAd.title}
                </h3>
                <p className="text-sm md:text-base lg:text-lg mb-4 line-clamp-3">
                  {currentAd.content}
                </p>
                
                {currentAd.linkUrl && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(currentAd.linkUrl, '_blank')}
                  >
                    المزيد
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* أزرار التحكم */}
            {showControls && advertisements.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* مؤشرات الشرائح */}
            {showIndicators && advertisements.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {advertisements.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentIndex 
                        ? "bg-white w-8" 
                        : "bg-white/50 hover:bg-white/70"
                    )}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}

            {/* نوع الإعلان */}
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-white/20 text-white border-white/30"
            >
              {currentAd.type === 'SLIDER' && 'شريحة'}
              {currentAd.type === 'BANNER' && 'بانر'}
              {currentAd.type === 'ANNOUNCEMENT' && 'إعلان'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
