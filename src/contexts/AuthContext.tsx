import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type AppUser = {
  id: string
  email: string | null
}

export type UserProfile = {
  id: string
  user_id: string
  full_name?: string | null
  phone?: string | null
  is_activated: boolean
  can_access_content: boolean
  subscription_status?: 'active' | 'inactive' | 'trial' | 'expired' | null
  created_at?: string
}

type SignInPayload = { email: string; password: string }
type SignUpPayload = { email: string; password: string; fullName?: string; phone?: string }

type AuthContextValue = {
  user: AppUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (payload: SignInPayload) => Promise<{ success: boolean; error?: string }>
  signUp: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  activateAccount: (args: { code: string }) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSession = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email })
        await loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (data) setProfile(data as UserProfile)
  }

  useEffect(() => {
    loadSession()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email })
        loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const signIn = async ({ email, password }: SignInPayload) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    await loadSession()
    return { success: true }
  }

  const signUp = async ({ email, password, fullName, phone }: SignUpPayload) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { success: false, error: error.message }
    // إنشاء/تحديث ملف المستخدم
    const uid = data.user?.id
    if (uid) {
      await supabase.from('user_profiles').upsert({
        user_id: uid,
        full_name: fullName || null,
        phone: phone || null,
      }, { onConflict: 'user_id' })
    }
    return { success: true }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const activateAccount = async ({ code }: { code: string }) => {
    // استدعاء دالة قاعدة البيانات لتفعيل الحساب
    const { data, error } = await supabase.rpc('activate_account', { p_code: code })
    if (error) return { success: false, error: error.message }
    await loadSession()
    return { success: !!data }
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    activateAccount,
    refreshUser: loadSession,
  }), [user, profile, loading])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
