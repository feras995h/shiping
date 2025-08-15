import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'الحصان الذهبي للشحن - Golden Horse Shipping',
  description: 'نظام إدارة الشحن والمالية المتكامل - الحصان الذهبي للشحن',
  generator: 'Golden Horse Shipping System',
  icons: {
    icon: [
      {
        url: '/golden-horse-logo.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon.svg',
    apple: '/golden-horse-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <head />
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10 antialiased">
        <div className="relative isolate min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-amber-200/40 to-transparent dark:from-amber-400/10"
          />
          {children}
        </div>
      </body>
    </html>
  )
}
