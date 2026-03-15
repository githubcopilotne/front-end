import { useEffect, useState } from 'react'
import { X, Pencil, Lock, Unlock, KeyRound } from 'lucide-react'
import staffService from '../../../services/staffService'
import type { StaffDetail } from '../../../types/staff'
import { formatDate, formatGender } from '../../../utils/format'

interface StaffDetailModalProps {
    isOpen: boolean
    onClose: () => void
    staffId: number | null
    refreshTrigger: number
    onEdit: (staff: StaffDetail) => void
    onToggleStatus: (staff: StaffDetail) => void
    onResetPassword: (staff: StaffDetail) => void
}

const StaffDetailModal = ({ isOpen, onClose, staffId, refreshTrigger, onEdit, onToggleStatus, onResetPassword }: StaffDetailModalProps) => {
    const [staff, setStaff] = useState<StaffDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [visible, setVisible] = useState(false)

    // Animation mở/đóng
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    // Gọi API lấy chi tiết khi mở modal
    useEffect(() => {
        if (!isOpen || !staffId) return

        const fetchStaff = async () => {
            try {
                setLoading(true)
                setApiError('')
                const res = await staffService.getById(staffId)
                if (res.success) {
                    setStaff(res.data)
                } else {
                    setApiError(res.message)
                }
            } catch (err: any) {
                setApiError(err.response?.data?.message || 'Không thể kết nối server')
            } finally {
                setLoading(false)
            }
        }
        fetchStaff()
    }, [isOpen, staffId, refreshTrigger])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết nhân viên</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
                    ) : apiError ? (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {apiError}
                        </div>
                    ) : staff ? (
                        <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                            <span className="text-gray-500">Mã NV</span>
                            <span className="text-[#409EFF] font-medium">{staff.employeeCode || '—'}</span>

                            <span className="text-gray-500">Họ tên</span>
                            <span className="text-gray-800 font-medium">{staff.fullName}</span>

                            <span className="text-gray-500">Email</span>
                            <span className="text-gray-800">{staff.email}</span>

                            <span className="text-gray-500">Số điện thoại</span>
                            <span className="text-gray-800">{staff.phone || 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">Giới tính</span>
                            <span className="text-gray-800">{staff.gender !== null ? formatGender(staff.gender) : 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">Ngày sinh</span>
                            <span className="text-gray-800">{staff.birthday ? formatDate(staff.birthday) : 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">Địa chỉ</span>
                            <span className="text-gray-800">{staff.address || 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">CCCD</span>
                            <span className="text-gray-800">{staff.idCard || 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">Role</span>
                            <span>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${staff.role === 'Admin'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {staff.role}
                                </span>
                            </span>

                            <span className="text-gray-500">Ngày vào làm</span>
                            <span className="text-gray-800">{staff.hireDate ? formatDate(staff.hireDate) : 'Chưa cập nhật'}</span>

                            <span className="text-gray-500">Ngày nghỉ</span>
                            <span className="text-gray-800">{staff.leaveDate ? formatDate(staff.leaveDate) : '—'}</span>

                            <span className="text-gray-500">Ngày tạo TK</span>
                            <span className="text-gray-800">{formatDate(staff.createdAt)}</span>

                            <span className="text-gray-500">Trạng thái</span>
                            <span>
                                {staff.status === 1 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Hoạt động
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-500 whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        Bị khóa
                                    </span>
                                )}
                            </span>
                        </div>
                    ) : null}
                </div>

                {/* Footer — 3 nút action */}
                {staff && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        {/* Bên trái: hành động nhạy cảm */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onToggleStatus(staff)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${staff.status === 1
                                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                    : 'text-green-600 bg-green-50 hover:bg-green-100'
                                }`}
                            >
                                {staff.status === 1 ? <Lock size={14} /> : <Unlock size={14} />}
                                {staff.status === 1 ? 'Khóa' : 'Mở khóa'}
                            </button>
                            <button
                                onClick={() => onResetPassword(staff)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <KeyRound size={14} />
                                Reset MK
                            </button>
                        </div>

                        {/* Bên phải: sửa */}
                        <button
                            onClick={() => onEdit(staff)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#409EFF] hover:bg-[#3a8ee6] rounded-lg transition-colors cursor-pointer"
                        >
                            <Pencil size={14} />
                            Sửa
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StaffDetailModal
