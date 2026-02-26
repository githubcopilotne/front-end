import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import OtpInput from '../../components/common/OtpInput'
import authService from '../../services/authService'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: nhập email, 2: nhập OTP, 3: đặt mật khẩu mới
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [resetToken, setResetToken] = useState('')

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Step 1: Gửi OTP đến email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!email.trim()) {
      setErrors({ email: 'Email không được để trống' })
      return
    }

    setLoading(true)
    try {
      await authService.forgotPasswordSendOtp({ email })
      setCooldown(60)
      setStep(2)
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Step 2: Verify OTP → nhận reset token
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    setLoading(true)
    try {
      const res = await authService.forgotPasswordVerifyOtp({
        email,
        otpCode: otp.join(''),
      })
      setResetToken(res.data.resetToken)
      setStep(3)
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Step 3: Gửi reset token + password mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    // Validate
    const newErrors: Record<string, string> = {}
    if (!passwords.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (passwords.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await authService.resetPassword({
        resetToken,
        newPassword: passwords.password,
      })
      navigate('/dang-nhap')
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Gửi lại OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return
    setApiError('')
    setLoading(true)
    try {
      await authService.forgotPasswordSendOtp({ email })
      setCooldown(60)
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Back link */}
          <Link
            to="/dang-nhap"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#111111] mb-6"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </Link>

          {/* Thông báo lỗi từ BE */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            </div>
          )}

          {/* Step 1: Nhập email */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Quên mật khẩu?
                </h1>
                <p className="mt-2 text-gray-500">
                  Nhập email của bạn để nhận mã xác thực
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({})
                    }}
                    placeholder="example@gmail.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="h-5">
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Nhập OTP */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nhập mã xác thực
                </h1>
                <p className="mt-2 text-gray-500">
                  Chúng tôi đã gửi mã 6 số đến <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Mã xác thực
                  </label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                <button
                  type="submit"
                  disabled={otp.some(d => !d) || loading}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xác thực...' : 'Xác nhận'}
                </button>

                <p className="text-center text-gray-600">
                  Không nhận được mã?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || loading}
                    className="text-[#111111] font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? `Gửi lại (${cooldown}s)` : 'Gửi lại'}
                  </button>
                </p>
              </form>
            </>
          )}

          {/* Step 3: Đặt mật khẩu mới */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Đặt mật khẩu mới
                </h1>
                <p className="mt-2 text-gray-500">
                  Tạo mật khẩu mới cho tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={passwords.password}
                      onChange={(e) => {
                        setPasswords({ ...passwords, password: e.target.value })
                        if (errors.password) setErrors({ ...errors, password: '' })
                      }}
                      placeholder="Tối thiểu 6 ký tự"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="h-5">
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={(e) => {
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                      }}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="h-5">
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
