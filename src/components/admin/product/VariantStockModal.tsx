import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import productService from '../../../services/productService'

interface VariantStockModalProps {
    isOpen: boolean
    productId: number
    variant: any           // { variantId, color, size, stockQuantity }
    onClose: () => void
    onSuccess: () => void
}

const VariantStockModal = ({ isOpen, productId, variant, onClose, onSuccess }: VariantStockModalProps) => {
    const [mode, setMode] = useState('add')
    const [quantity, setQuantity] = useState('')
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [quantityError, setQuantityError] = useState('')
    const [visible, setVisible] = useState(false)

    // Animation
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen])

    // Reset khi mở modal
    useEffect(() => {
        if (!isOpen) return
        setMode('add')
        setQuantity('')
        setApiError('')
        setQuantityError('')
    }, [isOpen])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleSave = async () => {
        const qty = Number(quantity)

        if (!quantity || isNaN(qty)) {
            setQuantityError('Vui lòng nhập số lượng')
            return
        }

        if (mode === 'add' && qty <= 0) {
            setQuantityError('Số lượng cộng dồn phải lớn hơn 0')
            return
        }

        if (mode === 'set' && qty < 0) {
            setQuantityError('Số lượng không được âm')
            return
        }

        setQuantityError('')

        try {
            setLoading(true)
            setApiError('')
            const res = await productService.updateVariantStock(productId, variant.variantId, { mode, quantity: qty })

            if (res.success) {
                toast.success('Cập nhật tồn kho thành công')
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

    if (!isOpen || !variant) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Cập nhật tồn kho</h3>
                <p className="text-sm text-gray-500 mb-4">
                    {variant.color} / {variant.size} — hiện tại: <strong>{variant.stockQuantity}</strong>
                </p>

                {/* Mode */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chế độ</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    >
                        <option value="add">Nhập thêm hàng</option>
                        <option value="set">Đặt lại</option>
                    </select>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder={mode === 'add' ? 'Nhập số lượng thêm' : 'Nhập số lượng mới'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    />
                    {quantityError && <p className="mt-1 text-xs text-red-500">{quantityError}</p>}
                </div>

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
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VariantStockModal
