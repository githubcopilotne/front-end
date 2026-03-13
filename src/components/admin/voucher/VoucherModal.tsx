import { useEffect, useState } from 'react'
import voucherService from '../../../services/voucherService'
import type { VoucherListItem } from '../../../types/voucher'
import toast from 'react-hot-toast'

interface VoucherModalProps {
    isOpen: boolean
    voucher: VoucherListItem | null  // null = thêm mới, có data = sửa
    onClose: () => void
    onSuccess: () => void
    onDelete?: (voucher: VoucherListItem) => void
}

const VoucherModal = ({ isOpen, voucher, onClose, onSuccess, onDelete }: VoucherModalProps) => {
    const [voucherCode, setVoucherCode] = useState('')
    const [discountType, setDiscountType] = useState(1)
    const [discountValue, setDiscountValue] = useState<number | ''>('')
    const [usageLimit, setUsageLimit] = useState<number | ''>('')
    const [expiryDate, setExpiryDate] = useState('')
    const [status, setStatus] = useState(1)
    
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
    const [visible, setVisible] = useState(false)

    const isEdit = voucher !== null

    // Animation: mở modal
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    // Fill form khi mở modal
    useEffect(() => {
        if (!isOpen) return

        setApiError('')
        setValidationErrors({})

        if (isEdit) {
            setVoucherCode(voucher.voucherCode)
            setDiscountType(voucher.discountType)
            setDiscountValue(voucher.discountValue)
            setUsageLimit(voucher.usageLimit)
            
            // Format date: YYYY-MM-DD
            if (voucher.expiryDate) {
                 setExpiryDate(voucher.expiryDate.split('T')[0]);
            } else {
                 setExpiryDate('')
            }
            
            setStatus(voucher.status)
        } else {
            setVoucherCode('')
            setDiscountType(1)
            setDiscountValue('')
            setUsageLimit('')
            setExpiryDate('')
            setStatus(1)
        }
    }, [isOpen, voucher])

    const handleClose = () => {
        setApiError('')
        setValidationErrors({})
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const validateForm = () => {
        const errors: { [key: string]: string } = {}
        const trimmedCode = voucherCode.trim()

        if (!trimmedCode) {
            errors.voucherCode = 'Mã voucher không được để trống'
        }
        
        if (discountValue === '' || Number(discountValue) <= 0) {
            errors.discountValue = 'Giá trị giảm phải lớn hơn 0'
        } else if (discountType === 1 && Number(discountValue) > 100) {
            errors.discountValue = 'Phần trăm giảm không được vượt quá 100%'
        }

        if (usageLimit === '' || Number(usageLimit) < 1) {
            errors.usageLimit = 'Giới hạn sử dụng phải từ 1 lượt trở lên'
        }

        if (!expiryDate) {
            errors.expiryDate = 'Vui lòng chọn ngày hết hạn'
        } else {
            const selectedDate = new Date(`${expiryDate}T23:59:59`)
            if (selectedDate <= new Date()) {
                errors.expiryDate = 'Ngày hết hạn phải ở trong tương lai'
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            setLoading(true)
            setApiError('')

            // Append 23:59:59 time for the end of the selected day
            const formattedExpiryDate = `${expiryDate}T23:59:59`;

            const dataToSubmit = {
                voucherCode: voucherCode.trim(),
                discountType,
                discountValue: Number(discountValue),
                usageLimit: Number(usageLimit),
                expiryDate: formattedExpiryDate,
                status
            }

            let res
            if (isEdit) {
                res = await voucherService.update(voucher.voucherId, dataToSubmit)
            } else {
                res = await voucherService.create(dataToSubmit)
            }

            if (res.success) {
                toast.success(isEdit ? 'Cập nhật voucher thành công' : 'Tạo voucher thành công')
                onSuccess()
                handleClose()
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-40' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh] transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                    <h3 className="text-xl font-bold text-gray-800">
                        {isEdit ? 'Cập nhật Voucher' : 'Thêm Voucher mới'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit ? 'Chỉnh sửa thông tin mã giảm giá' : 'Tạo mã giảm giá mới cho khách hàng'}
                    </p>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                    
                    {/* Mã Voucher */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Mã giảm giá <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            maxLength={50}
                            placeholder="VD: SUMMER2024"
                            className={`w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.voucherCode ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-blue-500 ring-blue-100'} rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 transition-all uppercase placeholder:normal-case`}
                        />
                        {validationErrors.voucherCode && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-500" />
                                {validationErrors.voucherCode}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {/* Loại giảm giá */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Loại giảm giá
                            </label>
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 ring-blue-100 rounded-xl text-sm font-medium focus:outline-none transition-all"
                            >
                                <option value={1}>Giảm theo phần trăm (%)</option>
                                <option value={2}>Giảm trực tiếp (VNĐ)</option>
                            </select>
                        </div>

                        {/* Giá trị giảm */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Mức giảm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : '')}
                                    min="1"
                                    placeholder={discountType === 1 ? '10' : '100000'}
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.discountValue ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-blue-500 ring-blue-100'} rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 transition-all pr-12`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                                    {discountType === 1 ? '%' : 'đ'}
                                </span>
                            </div>
                            {validationErrors.discountValue && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {validationErrors.discountValue}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Giới hạn sử dụng */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Giới hạn (Lượt) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={usageLimit}
                                onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : '')}
                                min="1"
                                placeholder="100"
                                className={`w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.usageLimit ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-blue-500 ring-blue-100'} rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                            />
                            {validationErrors.usageLimit && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {validationErrors.usageLimit}
                                </p>
                            )}
                        </div>

                        {/* Ngày hết hạn */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Ngày hết hạn <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-50 border ${validationErrors.expiryDate ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-blue-500 ring-blue-100'} rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                            />
                            {validationErrors.expiryDate && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {validationErrors.expiryDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Trạng thái
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 ring-blue-100 rounded-xl text-sm font-medium focus:outline-none transition-all"
                        >
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Ngừng hoạt động</option>
                        </select>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-start gap-2">
                            <span className="mt-0.5 text-red-500 text-lg">⚠️</span>
                            <span>{apiError}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
                    <div>
                        {isEdit && onDelete && voucher && (
                            <button
                                onClick={() => {
                                    handleClose()
                                    onDelete(voucher)
                                }}
                                disabled={loading}
                                className="px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Xóa Voucher
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                        >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 shadow-sm shadow-blue-200 flex items-center justify-center gap-2 min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Đang xử lý</span>
                            </>
                        ) : (
                            isEdit ? 'Cập nhật' : 'Tạo mới'
                        )}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoucherModal
