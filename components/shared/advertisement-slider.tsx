
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, X, ExternalLink, Calendar, MapPin } from "lucide-react"

interface Advertisement {
  id: string
  title: string
  description: string
  content: string
  imageUrl?: string
  linkUrl?: string
  startDate?: string
  endDate?: string
  isActive: boolean
  order: number
  createdAt: string
}

export function AdvertisementSlider() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // جلب الإعلانات من API
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch('/api/advertisements')
        if (!response.ok) {
          throw new Error('فشل في جلب الإعلانات')
        }
        const data = await response.json()
        setAds(data.data || [])
      } catch (err) {
        setError('خطأ في تحميل الإعلانات')
        console.error('خطأ في جلب الإعلانات:', err)
        // البيانات الافتراضية في حالة الخطأ
        setAds([
          {
            id: "1",
            title: "عروض خاصة على الشحن من الصين",
            description: "خصم 20% على جميع شحنات البضائع من الصين",
            content: "استفد من عروضنا الخاصة للشحن من الصين مع ضمان الجودة والسرعة",
            imageUrl: "/placeholder.jpg",
            linkUrl: "/client/pricing",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            isActive: true,
            order: 1,
            createdAt: "2024-01-01T00:00:00Z"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [])

  // التنقل التلقائي
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === ads.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [ads.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === ads.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1
    )
  }

  const handleAdClick = (ad: Advertisement) => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || ads.length === 0) {
    return null
  }

  const currentAd = ads[currentIndex]

  return (
    <Card className="w-full mb-6 overflow-hidden bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
      <CardContent className="p-0">
        <div className="relative">
          {/* محتوى الإعلان */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    إعلان
                  </Badge>
                  {currentAd.startDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(currentAd.startDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentAd.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentAd.description}
                </p>
                <div className="flex items-center gap-3">
                  {currentAd.linkUrl && (
                    <Button 
                      onClick={() => handleAdClick(currentAd)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4 ml-2" />
                      اعرف أكثر
                    </Button>
                  )}
                </div>
              </div>
              
              {currentAd.imageUrl && (
                <div className="ml-6">
                  <img 
                    src={currentAd.imageUrl} 
                    alt={currentAd.title}
                    className="w-32 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* أزرار التنقل */}
          {ads.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* مؤشرات الصفحات */}
          {ads.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? 'bg-yellow-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
