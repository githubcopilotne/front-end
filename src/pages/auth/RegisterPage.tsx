import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import OtpInput from '../../components/common/OtpInput'

const RegisterPage = () => {
  const navigate = useNavigate()
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
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gửi thông tin đăng ký và yêu cầu OTP
    console.log('Register form:', formData)
    setStep(2)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join('')
    // TODO: Xác thực OTP và tạo tài khoản
    console.log('Verify OTP:', otpValue)
    navigate('/dang-nhap')
  }

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Step 1: Form đăng ký */}
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

              {/* Form */}
              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Mật khẩu */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Nút đăng ký */}
                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-2"
                >
                  Đăng ký
                </button>
              </form>

              {/* Link đăng nhập */}
              <p className="mt-6 text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/dang-nhap" className="text-[#111111] font-medium hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}

          {/* Step 2: Nhập OTP */}
          {step === 2 && (
            <>
              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#111111] mb-6"
              >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Xác thực email
                </h1>
                <p className="mt-2 text-gray-500">
                  Chúng tôi đã gửi mã 6 số đến <strong>{formData.email}</strong>
                </p>
              </div>

              {/* Form OTP */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Mã xác thực
                  </label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                <button
                  type="submit"
                  disabled={otp.some(d => !d)}
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Xác nhận
                </button>

                <p className="text-center text-gray-600">
                  Không nhận được mã?{' '}
                  <button
                    type="button"
                    onClick={() => console.log('Resend OTP')}
                    className="text-[#111111] font-medium hover:underline"
                  >
                    Gửi lại
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
