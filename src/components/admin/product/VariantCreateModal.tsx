import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '../../../services/productService'

// Danh sách màu sắc và kích cỡ hardcode
const COLORS = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Xám', 'Nâu', 'Be', 'Cam', 'Tím']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface VariantItem {
    color: string
    size: string
    stockQuantity: number
}

interface VariantCreateModalProps {
    isOpen: boolean
    productId: number
    onClose: () => void
    onSuccess: () => void
}

const VariantCreateModal = ({ isOpen, productId, onClose, onSuccess }: VariantCreateModalProps) => {
    // Form state — chọn từng variant
    const [color, setColor] = useState('')
    const [size, setSize] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')

    // Danh sách tạm chờ lưu
    const [variantList, setVariantList] = useState<VariantItem[]>([])

    // UI state
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [formError, setFormError] = useState('')
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
        setColor('')
        setSize('')
        setStockQuantity('')
        setVariantList([])
        setApiError('')
        setFormError('')
    }, [isOpen])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    // Thêm variant vào danh sách tạm
    const handleAddToList = () => {
        setFormError('')

        if (!color) {
            setFormError('Vui lòng chọn màu sắc')
            return
        }
        if (!size) {
            setFormError('Vui lòng chọn kích cỡ')
            return
        }
        const qty = Number(stockQuantity)
        if (!stockQuantity || qty < 0) {
            setFormError('Số lượng phải >= 0')
            return
        }

        // Check trùng trong danh sách tạm
        const duplicate = variantList.some(v => v.color === color && v.size === size)
        if (duplicate) {
            setFormError(`Biến thể ${color} / ${size} đã có trong danh sách`)
            return
        }

        setVariantList([...variantList, { color, size, stockQuantity: qty }])
        // Reset form để thêm tiếp
        setColor('')
        setSize('')
        setStockQuantity('')
    }

    // Xóa variant khỏi danh sách tạm
    const handleRemoveFromList = (index: number) => {
        setVariantList(variantList.filter((_, i) => i !== index))
    }

    // Lưu tất cả variant vào BE
    const handleSave = async () => {
        if (variantList.length === 0) {
            setFormError('Chưa có biến thể nào trong danh sách')
            return
        }

        try {
            setLoading(true)
            setApiError('')
            const res = await productService.addVariants(productId, variantList)

            if (res.success) {
                toast.success(`Đã thêm ${variantList.length} biến thể`)
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm biến thể</h3>

                {/* Form chọn variant */}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end mb-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                        >
                            <option value="">-- Chọn --</option>
                            {COLORS.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kích cỡ</label>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                        >
                            <option value="">-- Chọn --</option>
                            {SIZES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                        <input
                            type="number"
                            min="0"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleAddToList}
                        className="px-3 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                    >
                        Thêm
                    </button>
                </div>

                {/* Lỗi validate form */}
                {formError && (
                    <p className="text-xs text-red-500 mb-3">{formError}</p>
                )}



                {/* Bảng danh sách tạm */}
                {variantList.length > 0 && (
                    <div className="overflow-x-auto mb-4 border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-500">
                                    <th className="px-3 py-2 font-medium w-12">STT</th>
                                    <th className="px-3 py-2 font-medium">Màu sắc</th>
                                    <th className="px-3 py-2 font-medium">Kích cỡ</th>
                                    <th className="px-3 py-2 font-medium">Tồn kho</th>
                                    <th className="px-3 py-2 font-medium w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {variantList.map((v, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                                        <td className="px-3 py-2 text-gray-800">{v.color}</td>
                                        <td className="px-3 py-2 text-gray-800">{v.size}</td>
                                        <td className="px-3 py-2 text-gray-800">{v.stockQuantity}</td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => handleRemoveFromList(i)}
                                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                title="Xóa khỏi danh sách"
                                            >
                                                <X size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Lỗi từ BE */}
                {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {apiError}
                    </div>
                )}

                {/* Nút Hủy + Lưu */}
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
                        disabled={loading || variantList.length === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : `Lưu (${variantList.length})`}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VariantCreateModal
