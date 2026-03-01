import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import authService from '../../services/authService'
import useAuthStore from '../../stores/authStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  // ==================== STATE ====================
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({}) // Lỗi validate từng field
  const [apiError, setApiError] = useState('') // Lỗi từ BE
  const [loading, setLoading] = useState(false) // Trạng thái đang gọi API

  // ==================== HANDLERS ====================

  // Cập nhật formData khi user nhập, xóa lỗi validate của field đó
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  // Validate form, trả về true nếu hợp lệ
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate → gọi API login → lưu token + user vào store → về trang chủ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password,
      })
      login(result.data.token, result.data.user)
      navigate('/')
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // Gọi API google-login → lưu token + user vào store → về trang chủ
  const handleGoogleLogin = async (credential: string) => {
    setApiError('')
    setLoading(true)
    try {
      const result = await authService.googleLogin({ credential })
      login(result.data.token, result.data.user)
      navigate('/')
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Không thể kết nối server')
    }
    setLoading(false)
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Đăng nhập
            </h1>
            <p className="mt-2 text-gray-500">
              Đăng nhập để trải nghiệm mua sắm tốt hơn
            </p>
          </div>

          {/* Thông báo lỗi từ BE */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            </div>
          )}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                  placeholder="Nhập mật khẩu"
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

            {/* Quên mật khẩu */}
            <div className="text-right">
              <Link to="/quen-mat-khau" className="text-sm text-gray-600 hover:text-[#111111] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" />Đang đăng nhập...</span> : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <div className="w-full">
              <GoogleLogin
                onSuccess={(response) => {
                  if (response.credential) {
                    handleGoogleLogin(response.credential)
                  }
                }}
                onError={() => {
                  setApiError('Đăng nhập Google thất bại')
                }}
                logo_alignment="center"
                size="large"
                shape="pill"
              />
            </div>
          </div>

          {/* Link đăng ký */}
          <p className="mt-6 text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/dang-ky" className="text-[#111111] font-medium hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
