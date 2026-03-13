import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import voucherService from '../../../services/voucherService'
import type { VoucherListItem } from '../../../types/voucher'
import toast from 'react-hot-toast'

interface VoucherDeleteDialogProps {
    isOpen: boolean
    voucher: VoucherListItem | null
    onClose: () => void
    onSuccess: () => void
}

const VoucherDeleteDialog = ({ isOpen, voucher, onClose, onSuccess }: VoucherDeleteDialogProps) => {
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    // Animation: khi mở dialog
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleDelete = async () => {
        if (!voucher) return

        try {
            setLoading(true)
            const res = await voucherService.delete(voucher.voucherId)
            
            if (res.success) {
                toast.success('Xóa voucher thành công')
                onSuccess()
                handleClose()
            } else {
                toast.error(res.message || 'Xóa thất bại')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Lỗi server khi xóa voucher')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !voucher) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Dialog container */}
            <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transition-all duration-200 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                
                {/* Header pattern/color */}
                <div className="h-24 bg-red-50 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-400 via-transparent to-transparent" />
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm relative z-10">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Xác nhận xóa
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">
                        Bạn có chắc chắn muốn xóa voucher này?
                    </p>
                    <p className="font-semibold text-gray-800 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100 inline-block mb-6">
                        {voucher.voucherCode}
                    </p>
                    <p className="text-xs text-red-500/80 mb-6 px-4">
                        Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-200 transition-all cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Đang xóa...</span>
                                </>
                            ) : (
                                'Xóa voucher'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoucherDeleteDialog
