import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordSection = () => {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, string> = {}

        if (!form.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
        }

        if (form.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
        }

        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setSuccess(false)
            return
        }

        // TODO: Call API to change password
        setErrors({})
        setSuccess(true)
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
                {/* Thông báo thành công */}
                {success && (
                    <div className="px-4 py-3 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        Đổi mật khẩu thành công!
                    </div>
                )}

                {/* Mật khẩu hiện tại */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={form.currentPassword}
                            onChange={(e) => {
                                setForm({ ...form, currentPassword: e.target.value })
                                setErrors({ ...errors, currentPassword: '' })
                            }}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-colors ${errors.currentPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#111111]'
                                }`}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="mt-1 min-h-[20px] text-sm text-red-500">{errors.currentPassword || ''}</p>
                </div>

                {/* Mật khẩu mới */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mật khẩu mới
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={form.newPassword}
                            onChange={(e) => {
                                setForm({ ...form, newPassword: e.target.value })
                                setErrors({ ...errors, newPassword: '' })
                            }}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-colors ${errors.newPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#111111]'
                                }`}
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="mt-1 min-h-[20px] text-sm text-red-500">{errors.newPassword || ''}</p>
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={form.confirmPassword}
                            onChange={(e) => {
                                setForm({ ...form, confirmPassword: e.target.value })
                                setErrors({ ...errors, confirmPassword: '' })
                            }}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-colors ${errors.confirmPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#111111]'
                                }`}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="mt-1 min-h-[20px] text-sm text-red-500">{errors.confirmPassword || ''}</p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-[#111111] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    )
}

export default PasswordSection
