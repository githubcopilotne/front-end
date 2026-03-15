import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Copy, Check } from 'lucide-react'
import staffService from '../../../services/staffService'

interface StaffResetPasswordDialogProps {
    isOpen: boolean
    staffId: number | null
    staffName: string
    onClose: () => void
}

const StaffResetPasswordDialog = ({ isOpen, staffId, staffName, onClose }: StaffResetPasswordDialogProps) => {
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [visible, setVisible] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [copied, setCopied] = useState(false)

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
        setNewPassword('')
        setCopied(false)
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleConfirm = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await staffService.resetPassword(staffId)

            if (res.success) {
                setNewPassword(res.data.newPassword)
                toast.success(res.message)
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(newPassword)
        setCopied(true)
        toast.success('Đã sao chép mật khẩu')
        setTimeout(() => setCopied(false), 2000)
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
                {!newPassword ? (
                    <>
                        {/* Màn hình xác nhận */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Reset mật khẩu
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Bạn có chắc muốn reset mật khẩu của <strong>"{staffName}"</strong>?
                            <span className="text-amber-500 text-xs mt-1 block">
                                Mật khẩu hiện tại sẽ bị thay thế bằng mật khẩu ngẫu nhiên.
                            </span>
                        </p>

                        {apiError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                {apiError}
                            </div>
                        )}

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
                                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Đang xử lý...' : 'Reset'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Màn hình hiện mật khẩu mới */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Mật khẩu mới
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">
                            Mật khẩu mới của <strong>"{staffName}"</strong>:
                        </p>

                        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <code className="flex-1 text-lg font-mono font-bold text-gray-800 tracking-wider">
                                {newPassword}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Sao chép"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>

                        <p className="text-xs text-amber-500 mb-4">
                            Hãy gửi mật khẩu này cho nhân viên. Mật khẩu chỉ hiện một lần.
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default StaffResetPasswordDialog
