import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

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
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Nhấn Backspace: xóa và quay lại ô trước
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasteData) {
      const newOtp = [...otp]
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i]
      }
      setOtp(newOtp)
      // Focus vào ô cuối cùng được điền
      const lastIndex = Math.min(pasteData.length - 1, 5)
      otpRefs.current[lastIndex]?.focus()
    }
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gửi OTP đến email
    console.log('Send OTP to:', email)
    setStep(2)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Xác thực OTP
    const otpValue = otp.join('')
    console.log('Verify OTP:', otpValue)
    setStep(3)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Đặt lại mật khẩu
    console.log('Reset password:', passwords)
    // Sau khi thành công, chuyển về trang đăng nhập
    navigate('/dang-nhap')
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
            <span>Quay lại đăng nhập</span>
          </Link>

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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Gửi mã xác thực
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
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                      />
                    ))}
                  </div>
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
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
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

                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Đặt lại mật khẩu
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
