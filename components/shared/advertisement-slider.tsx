
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
