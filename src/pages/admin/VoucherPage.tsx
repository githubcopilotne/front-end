import { useEffect, useState } from 'react'
import { Plus, Pencil, Eye, Ticket, CalendarX2 } from 'lucide-react'
import voucherService from '../../services/voucherService'
import type { VoucherListItem, VoucherDetail } from '../../types/voucher'
import { formatDate } from '../../utils/format'
import VoucherDeleteDialog from '../../components/admin/voucher/VoucherDeleteDialog'
import VoucherModal from '../../components/admin/voucher/VoucherModal'
import VoucherDetailModal from '../../components/admin/voucher/VoucherDetailModal'

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState<VoucherListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    // Delete dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingVoucher, setDeletingVoucher] = useState<VoucherListItem | null>(null)

    // Add/Edit modal state
    const [showModal, setShowModal] = useState(false)
    const [editingVoucher, setEditingVoucher] = useState<VoucherListItem | null>(null)

    // Detail modal state
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [detailVoucherId, setDetailVoucherId] = useState<number | null>(null)

    // Fetch data
    const fetchVouchers = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await voucherService.getAll()
            if (res.success) {
                setVouchers(res.data)
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Voucher</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách mã giảm giá, khuyến mãi cho khách hàng</p>
                </div>
                
                <button
                    onClick={() => {
                        setEditingVoucher(null)
                        setShowModal(true)
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 cursor-pointer w-full sm:w-auto justify-center"
                >
                    <Plus size={18} />
                    Thêm voucher mới
                </button>
            </div>

            {/* Error Message */}
            {apiError && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                    <CalendarX2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-red-800">Lỗi lấy dữ liệu</h4>
                        <p className="text-sm text-red-600 mt-1">{apiError}</p>
                    </div>
                </div>
            )}

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">STT</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã / Mức giảm</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lượt dùng</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Thời hạn</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Trạng thái</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="inline-flex flex-col items-center justify-center gap-3">
                                            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <span className="text-sm font-medium text-gray-500">Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Ticket className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-1">Chưa có voucher nào</h3>
                                            <p className="text-sm text-gray-500 text-center mb-6">Tạo mã giảm giá đầu tiên để chạy các chương trình khuyến mãi cho khách hàng.</p>
                                            <button
                                                onClick={() => {
                                                    setEditingVoucher(null)
                                                    setShowModal(true)
                                                }}
                                                className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                Tạo ngay
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((vc, index) => {
                                    const isExpired = new Date(vc.expiryDate) < new Date();
                                    
                                    return (
                                    <tr key={vc.voucherId} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                                                    <Ticket className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-0.5">{vc.voucherCode}</p>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Giảm {vc.discountType === 1 
                                                            ? `${vc.discountValue}%`
                                                            : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vc.discountValue)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{vc.usedCount} <span className="text-gray-400 font-medium">/ {vc.usageLimit}</span></span>
                                                {/* Progress bar */}
                                                <div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${vc.usedCount >= vc.usageLimit ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                        style={{ width: `${Math.min(100, (vc.usedCount / vc.usageLimit) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-xs font-semibold ${isExpired ? 'text-red-500' : 'text-gray-900'}`}>
                                                    {isExpired ? 'Đã hết hạn' : 'Đến ngày'}
                                                </span>
                                                <span className="text-sm text-gray-500">{formatDate(vc.expiryDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {vc.status === 1 && !isExpired ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-600 border border-green-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Khả dụng
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-600 border border-red-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    {isExpired ? 'Hết hạn' : 'Đã tắt'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setDetailVoucherId(vc.voucherId)
                                                        setShowDetailModal(true)
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingVoucher(vc)
                                                        setShowModal(true)
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <VoucherDeleteDialog
                isOpen={showDeleteDialog}
                voucher={deletingVoucher}
                onClose={() => setShowDeleteDialog(false)}
                onSuccess={fetchVouchers}
            />

            <VoucherModal
                isOpen={showModal}
                voucher={editingVoucher}
                onClose={() => setShowModal(false)}
                onSuccess={fetchVouchers}
                onDelete={(v: VoucherListItem) => {
                    setDeletingVoucher(v)
                    setShowDeleteDialog(true)
                }}
            />

            <VoucherDetailModal
                isOpen={showDetailModal}
                voucherId={detailVoucherId}
                onClose={() => setShowDetailModal(false)}
                onDelete={(v: VoucherDetail) => {
                    // Cần cast kiểu hoặc match fields cần thiết, VoucherDeleteDialog chỉ cần voucherId, voucherCode
                    setDeletingVoucher({
                        ...v,
                        usedCount: v.usedCount || 0
                    } as any)
                    setShowDeleteDialog(true)
                }}
            />
        </div>
    )
}

export default VoucherPage
