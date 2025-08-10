import { useState, useEffect } from 'react';

/**
 * هوك يستخدم للكشف عن حجم الشاشة وتحديد ما إذا كان الجهاز محمول
 * @param breakpoint نقطة الانكسار التي تحدد حجم الشاشة الذي يعتبر محمول (افتراضياً 768)
 * @returns {boolean} قيمة تشير إلى ما إذا كان الجهاز محمول أم لا
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // دالة لتحديث حالة الموبايل
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // التحقق في البداية
    checkIsMobile();

    // إضافة مستمع لتغيير حجم الشاشة
    window.addEventListener('resize', checkIsMobile);
    
    // إزالة المستمع عند تفكيك المكون
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
