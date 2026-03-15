import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import staffService from '../../../services/staffService'

interface StaffStatusDialogProps {
    isOpen: boolean
    staffId: number | null
    staffName: string
    currentStatus: number     // 1 = đang hoạt động, 0 = đang bị khóa
    onClose: () => void
    onSuccess: () => void     // callback reload danh sách
}

const StaffStatusDialog = ({ isOpen, staffId, staffName, currentStatus, onClose, onSuccess }: StaffStatusDialogProps) => {
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [visible, setVisible] = useState(false)

    const isLocking = currentStatus === 1  // true = đang khóa, false = đang mở

    // Animation
    useEffect(() => {
        if (isOpen && staffId) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen, staffId])

    if (!isOpen || !staffId) return null

    const handleClose = () => {
        setApiError('')
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleConfirm = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await staffService.toggleStatus(staffId)

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

            {/* Dialog */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {isLocking ? 'Xác nhận khóa' : 'Xác nhận mở khóa'}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                    Bạn có chắc muốn {isLocking ? 'khóa' : 'mở khóa'} tài khoản <strong>"{staffName}"</strong>?
                    {isLocking && (
                        <span className="text-red-500 text-xs mt-1 block">
                            Nhân viên sẽ không thể đăng nhập sau khi bị khóa.
                        </span>
                    )}
                </p>

                {/* Lỗi từ BE */}
                {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {apiError}
                    </div>
                )}

                {/* Nút */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${isLocking
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {loading ? 'Đang xử lý...' : isLocking ? 'Khóa' : 'Mở khóa'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StaffStatusDialog
