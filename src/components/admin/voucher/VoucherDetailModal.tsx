import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import voucherService from '../../../services/voucherService'
import type { VoucherDetail } from '../../../types/voucher'
import { formatDate } from '../../../utils/format'

interface VoucherDetailModalProps {
    isOpen: boolean
    voucherId: number | null
    onClose: () => void
    onDelete?: (voucher: VoucherDetail) => void
}

const VoucherDetailModal = ({ isOpen, voucherId, onClose, onDelete }: VoucherDetailModalProps) => {
    const [voucher, setVoucher] = useState<VoucherDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    useEffect(() => {
        const fetchDetail = async () => {
            if (!isOpen || !voucherId) return

            try {
                setLoading(true)
                setError('')
                const res = await voucherService.getById(voucherId)
                if (res.success) {
                    setVoucher(res.data)
                } else {
                    setError(res.message)
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải thông tin chi tiết')
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [isOpen, voucherId])

    const handleClose = () => {
        setVisible(false)
        setTimeout(() => {
            setVoucher(null)
            setError('')
            onClose()
        }, 200)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết Voucher</h3>
                    <div className="flex gap-2">
                        {voucher && onDelete && (
                            <button
                                onClick={() => {
                                    handleClose()
                                    onDelete(voucher)
                                }}
                                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                Xóa
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
                ) : error ? (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                ) : voucher && (
                    <div className="space-y-3">
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Mã Voucher</span>
                            <span className="text-sm font-bold text-gray-800">{voucher.voucherCode}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Trạng thái</span>
                            {voucher.status === 1 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Hiện
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    Ẩn
                                </span>
                            )}
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Loại giảm giá</span>
                            <span className="text-sm text-gray-600">
                                {voucher.discountType === 1 ? 'Giảm theo phần trăm (%)' : 'Giảm tiền trực tiếp'}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Mức giảm giá</span>
                            <span className="text-sm font-medium text-blue-600">
                                {voucher.discountType === 1 
                                    ? `${voucher.discountValue}%`
                                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discountValue)}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Số lượng giới hạn</span>
                            <span className="text-sm text-gray-600">{voucher.usageLimit} lượt</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Đã sử dụng</span>
                            <span className="text-sm text-gray-600">{voucher.usedCount} lượt</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Ngày tạo</span>
                            <span className="text-sm text-gray-600">{formatDate(voucher.createdAt)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-36 text-sm text-gray-500 shrink-0">Ngày hết hạn</span>
                            <span className={`text-sm ${new Date(voucher.expiryDate) < new Date() ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                                {formatDate(voucher.expiryDate)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Nút đóng */}
                <div className="flex justify-end mt-5">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VoucherDetailModal
