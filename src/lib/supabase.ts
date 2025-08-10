import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ملاحظة: يستخدم هذا العميل تكوين Supabase المتوفر عبر التكامل الأصلي مع Lovable.
// إذا لم يتم حقنه تلقائياً، يرجى التأكد من ربط المشروع بـ Supabase من الزر الأخضر في الأعلى.
// هذه القيم متاحة عادة عبر حقن بيئي من المنصة.
const SUPABASE_URL = (window as any)?.__SUPABASE_URL__ || 'https://isldjdjboewgwadeoepx.supabase.co'
const SUPABASE_ANON_KEY = (window as any)?.__SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbGRqZGpib2V3Z3dhZGVvZXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NTk1NjMsImV4cCI6MjA3MDQzNTU2M30.4E4R7obmw_WD_oJC4VJZn3wf_7w7GjB6TEFUHcuGtUs'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[Supabase] لم يتم العثور على إعدادات Supabase. تأكد من ربط المشروع بـ Supabase.')
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string
)

export type { SupabaseClient }
