import { useEffect, useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import staffService from '../../../services/staffService'
import type { StaffDetail } from '../../../types/staff'

interface StaffFormModalProps {
    isOpen: boolean
    staffData: StaffDetail | null   // null = tạo mới, có data = sửa
    onClose: () => void
    onSuccess: () => void
}

const StaffFormModal = ({ isOpen, staffData, onClose, onSuccess }: StaffFormModalProps) => {
    const isEdit = !!staffData
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        gender: 1,
        birthday: '',
        address: '',
        role: 'Staff',
        idCard: '',
        hireDate: new Date().toISOString().split('T')[0],
    })

    // Fill form khi sửa
    useEffect(() => {
        if (isOpen) {
            if (staffData) {
                setFormData({
                    email: staffData.email,
                    password: '',
                    fullName: staffData.fullName,
                    phone: staffData.phone || '',
                    gender: staffData.gender ?? 1,
                    birthday: staffData.birthday || '',
                    address: staffData.address || '',
                    role: staffData.role,
                    idCard: staffData.idCard || '',
                    hireDate: staffData.hireDate || '',
                })
            } else {
                setFormData({
                    email: '',
                    password: '',
                    fullName: '',
                    phone: '',
                    gender: 1,
                    birthday: '',
                    address: '',
                    role: 'Staff',
                    idCard: '',
                    hireDate: new Date().toISOString().split('T')[0],
                })
            }
            setErrors({})
            setApiError('')
            setShowPassword(false)
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen, staffData])

    if (!isOpen) return null

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.fullName.trim())
            newErrors.fullName = 'Họ tên không được để trống'

        if (!isEdit) {
            if (!formData.email.trim())
                newErrors.email = 'Email không được để trống'
            else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
                newErrors.email = 'Email không đúng định dạng'

            if (!formData.password)
                newErrors.password = 'Mật khẩu không được để trống'
            else if (formData.password.length < 6)
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!formData.phone.trim())
            newErrors.phone = 'Số điện thoại không được để trống'
        else if (!/^0\d{9}$/.test(formData.phone.trim()))
            newErrors.phone = 'SĐT phải bắt đầu bằng 0 và đủ 10 số'

        if (!formData.birthday)
            newErrors.birthday = 'Ngày sinh không được để trống'

        if (!formData.address.trim())
            newErrors.address = 'Địa chỉ không được để trống'

        if (!formData.idCard.trim())
            newErrors.idCard = 'CCCD không được để trống'
        else if (!/^\d{12}$/.test(formData.idCard.trim()))
            newErrors.idCard = 'CCCD phải đúng 12 chữ số'

        if (!formData.hireDate)
            newErrors.hireDate = 'Ngày vào làm không được để trống'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setApiError('')

        if (!validateForm()) return

        try {
            setLoading(true)
            let res

            if (isEdit) {
                res = await staffService.update(staffData!.userId, {
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    gender: Number(formData.gender),
                    birthday: formData.birthday,
                    address: formData.address.trim(),
                    role: formData.role,
                    idCard: formData.idCard.trim(),
                    hireDate: formData.hireDate,
                })
            } else {
                res = await staffService.create({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    gender: Number(formData.gender),
                    birthday: formData.birthday,
                    address: formData.address.trim(),
                    role: formData.role,
                    idCard: formData.idCard.trim(),
                    hireDate: formData.hireDate,
                })
            }

            if (res.success) {
                toast.success(res.message)
                handleClose()
                onSuccess()
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-lg z-10">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEdit ? 'Sửa nhân viên' : 'Tạo nhân viên'}
                    </h2>
                    <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Lỗi từ BE */}
                    {apiError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {apiError}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={isEdit}
                            placeholder="nhanvien@mavela.com"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${isEdit
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                                : errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'
                            }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password — chỉ khi tạo */}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                    )}

                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* SĐT + Giới tính */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0912345678"
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors bg-white"
                            >
                                <option value={1}>Nam</option>
                                <option value={0}>Nữ</option>
                            </select>
                        </div>
                    </div>

                    {/* Ngày sinh + CCCD */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.birthday ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                            />
                            {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CCCD <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="idCard"
                                value={formData.idCard}
                                onChange={handleChange}
                                placeholder="079190012345"
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.idCard ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                            />
                            {errors.idCard && <p className="text-red-500 text-xs mt-1">{errors.idCard}</p>}
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Quận 1, TP.HCM"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Role + Ngày vào làm */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors bg-white"
                            >
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày vào làm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="hireDate"
                                value={formData.hireDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.hireDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#409EFF]'}`}
                            />
                            {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StaffFormModal
