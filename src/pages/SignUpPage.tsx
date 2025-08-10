import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, User, Phone, Lock, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const steps = [
  {
    title: 'البيانات الشخصية',
    fields: [
      { name: 'firstName', label: 'الاسم الأول', placeholder: 'الاسم الأول', icon: <User className="w-5 h-5 text-gray-400" /> },
      { name: 'lastName', label: 'الاسم الأخير', placeholder: 'الاسم الأخير', icon: <User className="w-5 h-5 text-gray-400" /> },
      { name: 'phone', label: 'رقم الجوال (اختياري)', placeholder: 'XXX XXX XXX', icon: <Phone className="w-5 h-5 text-gray-400" />, optional: true },
    ]
  },
  {
    title: 'إعداد الحساب',
    fields: [
      { name: 'email', label: 'البريد الإلكتروني', placeholder: 'example@example.com', icon: <Mail className="w-5 h-5 text-gray-400" /> },
      { name: 'password', label: 'كلمة المرور', placeholder: '********', icon: <Lock className="w-5 h-5 text-gray-400" />, type: 'password' },
      { name: 'pin', label: 'رمز الرقابة الأبوية (اختياري)', placeholder: 'XXXX', icon: <Info className="w-5 h-5 text-gray-400" />, type: 'password', optional: true },
    ]
  },
  {
    title: 'شراء كود الاشتراك',
    fields: []
  },
  {
    title: 'إنشاء الحساب والتفعيل',
    fields: [
      { name: 'activationCode', label: 'كود الاشتراك او رمز نقل عضوية', placeholder: 'أدخل كود التفعيل', icon: null },
    ]
  },
]

const SignUpPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    pin: '',
    activationCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { signUp, signIn, activateAccount } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // إزالة الخطأ عند الكتابة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب'
      if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب'
    }

    if (currentStep === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'البريد الإلكتروني مطلوب'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'البريد الإلكتروني غير صحيح'
      }
      
      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة'
      } else if (formData.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      }

      // رمز الرقابة الأبوية اختياري
      if (formData.pin && formData.pin.length !== 4) {
        newErrors.pin = 'رمز الرقابة الأبوية يجب أن يكون 4 أرقام'
      }
    }

    if (currentStep === 3) {
      if (!formData.activationCode.trim()) {
        newErrors.activationCode = 'كود التفعيل مطلوب'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(step)) {
      return
    }

    if (step === 3) {
      // إنشاء الحساب وتفعيله في الخطوة الأخيرة
      setIsLoading(true)
      try {
        console.log('بدء عملية إنشاء الحساب مع التفعيل')
        
        // إنشاء الحساب أولاً
        const signUpResult = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone || undefined
        })

        if (!signUpResult.success) {
          toast.error(signUpResult.error || 'فشل في إنشاء الحساب')
          return
        }

        console.log('تم إنشاء الحساب بنجاح، بدء عملية التفعيل')

        // محاولة تسجيل دخول تلقائي
        const signInResult = await signIn({
          email: formData.email,
          password: formData.password
        })

        if (!signInResult.success) {
          toast.error('فشل في تسجيل الدخول التلقائي')
          return
        }

        console.log('تم تسجيل الدخول التلقائي بنجاح')

        // الآن محاولة تفعيل الحساب
        const activateResult = await activateAccount({
          code: formData.activationCode
        })

        if (activateResult.success) {
          toast.success('تم إنشاء وتفعيل الحساب بنجاح!')
          navigate('/')
        } else {
          toast.error(activateResult.error || 'فشل في تفعيل الحساب')
        }
      } catch (error) {
        console.error('خطأ في عملية إنشاء وتفعيل الحساب:', error)
        toast.error('حدث خطأ أثناء إنشاء وتفعيل الحساب')
      } finally {
        setIsLoading(false)
      }
    } else {
      setStep(step + 1)
    }
  }

  const handlePrev = (e: React.FormEvent) => {
    e.preventDefault()
    if (step > 0) setStep(step - 1)
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
      {/* صندوق إنشاء الحساب */}
      <form className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="text-right mb-2">
          <div className="text-gray-700 font-bold text-lg mb-1">{`الخطوة ${step+1} / ${steps.length}`}</div>
          <div className="text-gray-500 text-sm">{steps[step].title}</div>
        </div>
        {/* الحقول */}
        {step === 2 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-gray-700 text-center mb-4">البيانات جاهزة!</div>
            <div className="text-gray-600 text-center text-sm mb-6">الآن يمكنك الحصول على كود التفعيل من خلال التواصل مع المبرمج</div>
            <div className="flex gap-4 mt-6">
              <a href="https://wtsi.me/966543310024" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                whatsapp 
              </a>
              
            </div>
            
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {steps[step].fields.map((f, i) => (
              <div className="relative" key={i}>
                <input
                  type={f.type === 'password' ? (f.name === 'password' ? (showPassword ? 'text' : 'password') : (showPin ? 'text' : 'password')) : 'text'}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={e => handleInputChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full bg-gray-100 rounded-lg pr-12 pl-4 py-3 text-gray-900 border focus:outline-none text-base transition-colors ${
                    errors[f.name] ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100'
                  }`}
                  required={!f.optional}
                  maxLength={f.name === 'pin' ? 4 : undefined}
                />
                {f.icon && <span className="absolute right-4 top-1/2 -translate-y-1/2">{f.icon}</span>}
                {f.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => f.name === 'password' ? setShowPassword(s => !s) : setShowPin(s => !s)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {(f.name === 'password' ? showPassword : showPin) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
                {errors[f.name] && (
                  <div className="text-red-500 text-sm mt-1 text-right">{errors[f.name]}</div>
                )}
                {f.optional && (
                  <div className="text-gray-500 text-xs mt-1 text-right">(اختياري)</div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* كابتشا وخانة التفعيل في الخطوة الأخيرة */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="robot" className="w-5 h-5" required />
              <label htmlFor="robot" className="text-gray-600 text-sm">أنا لست برنامج روبوت</label>
            </div>
          </div>
        )}
        {/* أزرار التنقل */}
        <div className="flex gap-2 mt-2">
          {step > 0 && (
            <Button 
              type="button" 
              onClick={handlePrev} 
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 font-bold rounded-lg py-3 text-lg shadow-sm hover:bg-gray-300 disabled:opacity-50"
            >
              السابق
            </Button>
          )}
          <Button 
            type="submit" 
            onClick={handleNext} 
            disabled={isLoading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg py-3 text-lg shadow-md transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'جاري إنشاء الحساب...' : (step === steps.length - 1 ? 'إنشاء الحساب والتفعيل' : 'التالي')}
          </Button>
        </div>
        {step === 0 && (
          <div className="text-center text-gray-500 text-sm mt-2">
            لديك حساب؟{' '}
            <Link to="/login" className="text-yellow-600 font-bold hover:underline">تسجيل الدخول</Link>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignUpPage
