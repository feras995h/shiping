
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink, Calendar, Clock } from "lucide-react"

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

interface AdvertisementBannerProps {
  className?: string
  maxAds?: number
}

export function AdvertisementBanner({ className = "", maxAds = 3 }: AdvertisementBannerProps) {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [dismissedAds, setDismissedAds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch('/api/advertisements')
        if (!response.ok) {
          throw new Error('فشل في جلب الإعلانات')
        }
        const data = await response.json()
        const activeAds = (data.data || [])
          .filter((ad: Advertisement) => ad.isActive)
          .slice(0, maxAds)
        setAds(activeAds)
      } catch (err) {
        console.error('خطأ في جلب الإعلانات:', err)
        // البيانات الافتراضية
        setAds([
          {
            id: "1",
            title: "خدمات شحن متطورة",
            description: "نوفر أفضل خدمات الشحن من الصين إلى ليبيا",
            content: "خدمات شحن احترافية وموثوقة",
            linkUrl: "/services",
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
  }, [maxAds])

  const handleDismiss = (adId: string) => {
    setDismissedAds(prev => new Set(prev).add(adId))
  }

  const handleAdClick = (ad: Advertisement) => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, '_blank')
    }
  }

  const visibleAds = ads.filter(ad => !dismissedAds.has(ad.id))

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (visibleAds.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {visibleAds.map((ad) => (
        <Card 
          key={ad.id} 
          className="relative overflow-hidden border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    إعلان مهم
                  </Badge>
                  {ad.startDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(ad.startDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">
                  {ad.title}
                </h4>
                
                <p className="text-sm text-gray-600 mb-3">
                  {ad.description}
                </p>
                
                <div className="flex items-center gap-3">
                  {ad.linkUrl && (
                    <Button 
                      size="sm"
                      onClick={() => handleAdClick(ad)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                    >
                      <ExternalLink className="h-3 w-3 ml-1" />
                      المزيد
                    </Button>
                  )}
                  
                  {ad.endDate && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock className="h-3 w-3" />
                      <span>ينتهي: {new Date(ad.endDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(ad.id)}
                className="absolute top-2 left-2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
