import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import OtpInput from '../../components/common/OtpInput'
import authService from '../../services/authService'

const RegisterPage = () => {
  const navigate = useNavigate()

  // ==================== STATE ====================
  const [step, setStep] = useState(1) // 1: nhập form, 2: nhập OTP
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({}) // Lỗi validate từng field
  const [apiError, setApiError] = useState('') // Lỗi từ BE (email trùng, server lỗi...)
  const [loading, setLoading] = useState(false) // Trạng thái đang gọi API
  const [otp, setOtp] = useState(['', '', '', '', '', '']) // Mảng 6 ô OTP
  const [countdown, setCountdown] = useState(0) // Đếm ngược nút "Gửi lại" (giây)

  // ==================== HANDLERS ====================

  // Cập nhật formData khi user nhập, xóa lỗi validate của field đó
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  // Validate toàn bộ form, trả về true nếu hợp lệ
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống'
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 1: Validate form → gọi API gửi OTP → chuyển sang Step 2
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      await authService.sendOtp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      })
      setOtp(['', '', '', '', '', ''])
      setApiError('')
      setStep(2)
      setCountdown(60)
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Step 2: Gọi API xác thực OTP → thành công thì chuyển trang đăng nhập
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const otpValue = otp.join('')

    setLoading(true)
    try {
      await authService.verifyOtp({
        email: formData.email,
        otpCode: otpValue,
      })
      navigate('/dang-nhap')
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Gửi lại OTP: reset ô nhập, bắt đầu đếm ngược 60s, gọi lại API
  const handleResendOtp = async () => {
    setApiError('')
    setCountdown(60)
    setOtp(['', '', '', '', '', ''])
    try {
      await authService.sendOtp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      })
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
  }

  // ==================== EFFECTS ====================

  // Đếm ngược mỗi giây, dừng khi về 0
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // ==================== RENDER ====================
  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* ========== Step 1: Form đăng ký ========== */}
          {step === 1 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Tạo tài khoản
                </h1>
                <p className="mt-2 text-gray-500">
                  Đăng ký ngay để có trải nghiệm mua sắm tuyệt vời
                </p>
              </div>

              {/* Thông báo lỗi từ BE */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{apiError}</p>
                </div>
              )}

              {/* Form nhập thông tin */}
              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="h-5">
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="h-5">
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="h-5">
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Xác nhận mật khẩu */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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

                {/* Nút đăng ký */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" />Vui lòng đợi...</span> : 'Đăng ký'}
                </button>
              </form>

              {/* Link chuyển sang đăng nhập */}
              <p className="mt-6 text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/dang-nhap" className="text-[#111111] font-medium hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}

          {/* ========== Step 2: Nhập OTP ========== */}
          {step === 2 && (
            <>
              {/* Nút quay lại Step 1, clear lỗi cũ */}
              <button
                onClick={() => { setApiError(''); setStep(1) }}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#111111] mb-6"
              >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>

              {/* Header — hiện email đã gửi OTP */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Xác thực email
                </h1>
                <p className="mt-2 text-gray-500">
                  Chúng tôi đã gửi mã 6 số đến <strong>{formData.email}</strong>
                </p>
              </div>

              {/* Thông báo lỗi từ BE (OTP sai, hết hạn...) */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{apiError}</p>
                </div>
              )}

              {/* Form nhập OTP */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Mã xác thực
                  </label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                {/* Nút xác minh — disable khi chưa nhập đủ 6 số hoặc đang loading */}
                <button
                  type="submit"
                  disabled={otp.some(d => !d) || loading}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" />Đang xác minh...</span> : 'Xác minh'}
                </button>

                {/* Nút gửi lại OTP — disable trong 60s đếm ngược */}
                <p className="text-center text-gray-600">
                  Không nhận được mã?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className={`font-medium ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#111111] hover:underline'}`}
                  >
                    {countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại'}
                  </button>
                </p>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default RegisterPage
