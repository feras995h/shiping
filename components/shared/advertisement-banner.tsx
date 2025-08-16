
'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
}

interface AdvertisementBannerProps {
  className?: string;
  type?: 'BANNER' | 'ANNOUNCEMENT';
  dismissible?: boolean;
}

export function AdvertisementBanner({
  className,
  type = 'BANNER',
  dismissible = true
}: AdvertisementBannerProps) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/advertisements?active=true&type=${type}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // أخذ الإعلان ذو الأولوية الأعلى
          const sortedAds = data.data.sort((a: Advertisement, b: Advertisement) => b.priority - a.priority);
          setAdvertisement(sortedAds[0]);
        }
      } catch (error) {
        console.error('خطأ في جلب الإعلان:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisement();
  }, [type]);

  if (isLoading || !advertisement || !isVisible) {
    return null;
  }

  return (
    <Alert className={cn("relative border-blue-200 bg-blue-50", className)}>
      <AlertDescription className="flex items-center justify-between pr-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-blue-900">{advertisement.title}</span>
            <span className="text-blue-700">{advertisement.content}</span>
            {advertisement.linkUrl && (
              <Button
                variant="link"
                size="sm"
                className="text-blue-600 p-0 h-auto"
                onClick={() => window.open(advertisement.linkUrl, '_blank')}
              >
                المزيد
                <ExternalLink className="h-3 w-3 mr-1" />
              </Button>
            )}
          </div>
        </div>
        
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
