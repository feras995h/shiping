import { NextRequest, NextResponse } from 'next/server'
import { writeFile, copyFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const publicDir = join(process.cwd(), 'public')
    const backupDir = join(process.cwd(), 'backup-logos')

    // إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجوداً
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true })
    }

    // نسخ الشعارات الحالية كنسخة احتياطية
    const currentMainLogo = join(publicDir, 'golden-horse-logo.svg')
    const currentSimpleLogo = join(publicDir, 'golden-horse-logo-simple.svg')
    
    if (existsSync(currentMainLogo)) {
      await copyFile(currentMainLogo, join(backupDir, `golden-horse-logo-backup-${Date.now()}.svg`))
    }
    
    if (existsSync(currentSimpleLogo)) {
      await copyFile(currentSimpleLogo, join(backupDir, `golden-horse-logo-simple-backup-${Date.now()}.svg`))
    }

    // إنشاء الشعارات الافتراضية
    const defaultMainLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F4E4BC;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#E6D7A8;stop-opacity:1" />
      <stop offset="60%" style="stop-color:#D4C095;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C4B083;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="maneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F7E8C3;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#E8D4A5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#D4C095;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4A6741;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#3A5A35;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2D4A2A;stop-opacity:1" />
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#B8A67A" flood-opacity="0.2"/>
    </filter>
    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <circle cx="60" cy="60" r="55" fill="url(#goldGradient)" filter="url(#softShadow)" stroke="#B8A67A" stroke-width="1.5" opacity="0.95"/>
  <path d="M30 75 Q35 70 45 72 Q55 74 65 70 Q75 68 80 75 Q80 85 75 90 Q65 92 55 90 Q45 92 35 90 Q30 85 30 75 Z" 
        fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.9"/>
  <path d="M45 72 Q50 60 55 45 Q60 40 65 45 Q70 50 67 60 Q65 70 65 70" 
        fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.9"/>
  <ellipse cx="62" cy="42" rx="10" ry="12" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.9"/>
  <path d="M58 35 Q60 30 62 35 Q60 38 58 35" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.9"/>
  <path d="M64 35 Q66 30 68 35 Q66 38 64 35" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.9"/>
  <circle cx="60" cy="40" r="3" fill="url(#eyeGradient)"/>
  <circle cx="61" cy="39" r="1" fill="#A8D8F0"/>
  <ellipse cx="62" cy="48" rx="2.5" ry="3.5" fill="#D4C095" stroke="#B8A67A" stroke-width="0.5"/>
  <circle cx="61" cy="47" r="0.6" fill="#8B7355"/>
  <circle cx="63" cy="47" r="0.6" fill="#8B7355"/>
  <path d="M55 35 Q52 25 55 22 Q58 25 60 28 Q62 25 65 22 Q68 25 65 35 Q62 32 60 35 Q58 32 55 35" 
        fill="url(#maneGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.8"/>
  <rect x="40" y="88" width="4" height="14" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="0.5" opacity="0.9"/>
  <rect x="47" y="88" width="4" height="14" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="0.5" opacity="0.9"/>
  <rect x="60" y="88" width="4" height="14" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="0.5" opacity="0.9"/>
  <rect x="67" y="88" width="4" height="14" fill="url(#goldGradient)" stroke="#B8A67A" stroke-width="0.5" opacity="0.9"/>
  <ellipse cx="42" cy="102.5" rx="2.5" ry="2" fill="#8B7355"/>
  <ellipse cx="49" cy="102.5" rx="2.5" ry="2" fill="#8B7355"/>
  <ellipse cx="62" cy="102.5" rx="2.5" ry="2" fill="#8B7355"/>
  <ellipse cx="69" cy="102.5" rx="2.5" ry="2" fill="#8B7355"/>
  <path d="M80 75 Q90 80 93 85 Q90 90 85 92 Q80 90 80 85 Q80 80 80 75" 
        fill="url(#maneGradient)" stroke="#B8A67A" stroke-width="1" opacity="0.8"/>
  <path d="M40 80 Q45 78 50 80" stroke="#B8A67A" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M60 80 Q65 78 70 80" stroke="#B8A67A" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M62 36 L62.5 34.5 L64 35 L62.5 35.5 L62 37 L61.5 35.5 L60 35 L61.5 34.5 Z" 
        fill="#F7E8C3" opacity="0.8"/>
  <circle cx="60" cy="60" r="58" fill="none" stroke="#F7E8C3" stroke-width="1" opacity="0.3" filter="url(#goldGlow)"/>
</svg>`

    const defaultSimpleLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <defs>
    <linearGradient id="horseGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F4E4BC"/>
      <stop offset="50%" style="stop-color:#E6D7A8"/>
      <stop offset="100%" style="stop-color:#D4C095"/>
    </linearGradient>
    <linearGradient id="maneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F7E8C3"/>
      <stop offset="50%" style="stop-color:#E8D4A5"/>
      <stop offset="100%" style="stop-color:#D4C095"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <path d="M40 12 Q36 16 34 22 Q32 28 34 34 Q36 40 40 42 Q44 40 46 34 Q48 28 46 22 Q44 16 40 12 Z" 
        fill="url(#horseGold)" stroke="#B8A67A" stroke-width="1" filter="url(#glow)"/>
  <path d="M36 16 Q34 10 36 8 Q38 10 40 12 Q42 10 44 8 Q46 10 44 16 Q42 14 40 16 Q38 14 36 16" 
        fill="url(#maneGradient)" stroke="#B8A67A" stroke-width="0.8"/>
  <path d="M36 18 Q34 14 36 16" fill="url(#horseGold)" stroke="#B8A67A" stroke-width="0.5"/>
  <path d="M44 18 Q46 14 44 16" fill="url(#horseGold)" stroke="#B8A67A" stroke-width="0.5"/>
  <circle cx="38" cy="24" r="2" fill="#4A6741"/>
  <circle cx="38.5" cy="23.5" r="0.6" fill="#A8D8F0"/>
  <ellipse cx="40" cy="30" rx="2" ry="2.5" fill="#D4C095"/>
  <circle cx="39.5" cy="29.5" r="0.4" fill="#8B7355"/>
  <circle cx="40.5" cy="29.5" r="0.4" fill="#8B7355"/>
  <path d="M40 42 Q36 46 34 52 Q32 58 36 62 Q40 64 44 62 Q48 58 46 52 Q44 46 40 42" 
        fill="url(#horseGold)" stroke="#B8A67A" stroke-width="1"/>
  <rect x="36" y="60" width="2.5" height="8" fill="url(#horseGold)" stroke="#B8A67A" stroke-width="0.5"/>
  <rect x="42" y="60" width="2.5" height="8" fill="url(#horseGold)" stroke="#B8A67A" stroke-width="0.5"/>
  <ellipse cx="37.25" cy="68.5" rx="2" ry="1.5" fill="#8B7355"/>
  <ellipse cx="43.25" cy="68.5" rx="2" ry="1.5" fill="#8B7355"/>
  <path d="M46 54 Q50 56 52 60 Q50 62 48 62 Q46 60 46 56" 
        fill="url(#maneGradient)" stroke="#B8A67A" stroke-width="0.8"/>
  <path d="M40 20 L40.3 19.2 L41.2 19.5 L40.3 19.8 L40 20.6 L31.7 19.8 L30.8 19.5 L31.7 19.2 Z" 
        fill="#F7E8C3" opacity="0.8"/>
  <circle cx="40" cy="40" r="38" fill="none" stroke="#F7E8C3" stroke-width="1" opacity="0.2"/>
</svg>`

    // حفظ الشعارات الافتراضية
    await writeFile(join(publicDir, 'golden-horse-logo.svg'), defaultMainLogo)
    await writeFile(join(publicDir, 'golden-horse-logo-simple.svg'), defaultSimpleLogo)

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين الشعارات للافتراضي بنجاح',
      backupCreated: true
    })

  } catch (error) {
    console.error('خطأ في إعادة تعيين الشعارات:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إعادة تعيين الشعارات' },
      { status: 500 }
    )
  }
}

