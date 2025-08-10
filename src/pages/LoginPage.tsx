import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser, signIn } = useAuth()

  // عرض رسالة من صفحة التسجيل
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password
      })
      
      if (result.success) {
        await refreshUser()
        
        // توجيه للمسار السابق أو الرئيسية بعد تسجيل الدخول
        const redirectTo = (location.state as any)?.from?.pathname || '/'
        navigate(redirectTo)

      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* خلفية صورة أفلام مع overlay */}
      <div className="absolute inset-0 z-0">
        <img src="https://aflam.world/wp-content/uploads/2023/12/LEG-FILM-CATALOG-1-scaled-1.jpg" alt="bg" className="w-full h-full object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      {/* شعار في الأعلى يمين */}
      <div className="absolute top-6 right-8 z-10 flex items-center gap-2">
        <span className="text-2xl md:text-3xl font-bold">
          <span style={{color: '#3ecfff'}}>Cine</span>
          <span style={{color: '#ffd13c'}}>Verse</span>
          <span style={{color: '#fff', fontSize: 18, marginRight: 4, marginLeft: 2}}>+</span>
        </span>
      </div>
      {/* صندوق تسجيل الدخول */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="text-right mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">تسجيل الدخول</h2>
          <p className="text-gray-500 text-sm">البريد الإلكتروني</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="example@example.com"
              className="w-full bg-gray-100 rounded-lg pr-12 pl-4 py-3 text-gray-900 border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none text-base"
              required
              autoFocus
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-gray-100 rounded-lg pr-12 pl-4 py-3 text-gray-900 border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Link to="#" className="text-sm text-gray-500 hover:text-yellow-500 transition">نسيت كلمة المرور؟</Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg py-3 text-lg shadow-md transition-all duration-200 mt-2"
          disabled={loading}
        >
          تسجيل الدخول
        </Button>
        <div className="text-center text-gray-500 text-sm mt-2">
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="text-yellow-600 font-bold hover:underline">إنشاء حساب</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
