import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const ActivatePage = () => {
  const { activateAccount, profile } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.title = 'تفعيل الحساب | CineVerse'
  }, [])

  useEffect(() => {
    if (profile?.is_activated) {
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [profile, navigate, location.state])

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return toast.error('يرجى إدخال كود التفعيل')
    setLoading(true)
    const res = await activateAccount({ code })
    setLoading(false)
    if (res.success) {
      toast.success('تم تفعيل الحساب بنجاح')
      navigate('/')
    } else {
      toast.error(res.error || 'كود التفعيل غير صحيح أو منتهي')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://aflam.world/wp-content/uploads/2023/12/LEG-FILM-CATALOG-1-scaled-1.jpg" alt="bg" className="w-full h-full object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <form onSubmit={handleActivate} className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">تفعيل الحساب</h1>
          <p className="text-gray-500 text-sm">أدخل كود التفعيل المرسل/المتوفر لديك</p>
        </div>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="أدخل كود التفعيل"
          required
          className="bg-gray-100"
        />
        <Button type="submit" disabled={loading} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
          {loading ? 'جاري التفعيل...' : 'تفعيل'}
        </Button>
      </form>
    </div>
  )
}

export default ActivatePage
