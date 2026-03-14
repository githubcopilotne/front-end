import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import customerService from '../../../services/customerService'
import type { CustomerDetail } from '../../../types/customer'
import { formatPrice, formatDate, formatGender } from '../../../utils/format'

interface CustomerDetailModalProps {
    isOpen: boolean
    onClose: () => void
    customerId: number | null
}

const CustomerDetailModal = ({ isOpen, onClose, customerId }: CustomerDetailModalProps) => {
    const [customer, setCustomer] = useState<CustomerDetail | null>(null)
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
        if (!isOpen || !customerId) return

        const fetchCustomer = async () => {
            try {
                setLoading(true)
                setApiError('')
                const res = await customerService.getById(customerId)
                if (res.success) {
                    setCustomer(res.data)
                } else {
                    setApiError(res.message)
                }
            } catch (err: any) {
                setApiError(err.response?.data?.message || 'Không thể kết nối server')
            } finally {
                setLoading(false)
            }
        }
        fetchCustomer()
    }, [isOpen, customerId])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
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
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết khách hàng</h3>
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
                    ) : customer ? (
                        <div className="space-y-3">
                            {/* Thống kê đơn hàng */}
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-blue-600">{customer.totalOrders}</div>
                                    <div className="text-xs text-blue-500 mt-1">Đơn hàng</div>
                                </div>
                                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-green-600">{formatPrice(customer.totalSpent)}</div>
                                    <div className="text-xs text-green-500 mt-1">Tổng chi tiêu</div>
                                </div>
                            </div>

                            {/* Thông tin cá nhân */}
                            <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                                <span className="text-gray-500">Họ tên</span>
                                <span className="text-gray-800 font-medium">{customer.fullName}</span>

                                <span className="text-gray-500">Email</span>
                                <span className="text-gray-800">{customer.email}</span>

                                <span className="text-gray-500">Số điện thoại</span>
                                <span className="text-gray-800">{customer.phone || 'Chưa cập nhật'}</span>

                                <span className="text-gray-500">Giới tính</span>
                                <span className="text-gray-800">{formatGender(customer.gender)}</span>

                                <span className="text-gray-500">Ngày sinh</span>
                                <span className="text-gray-800">{customer.birthday ? formatDate(customer.birthday) : 'Chưa cập nhật'}</span>

                                <span className="text-gray-500">Địa chỉ</span>
                                <span className="text-gray-800">{customer.address || 'Chưa cập nhật'}</span>

                                <span className="text-gray-500">Ngày tham gia</span>
                                <span className="text-gray-800">{formatDate(customer.createdAt)}</span>

                                <span className="text-gray-500">Trạng thái</span>
                                <span>
                                    {customer.status === 1 ? (
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
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200">
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

export default CustomerDetailModal
