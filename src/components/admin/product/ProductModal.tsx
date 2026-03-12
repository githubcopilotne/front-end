import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import productService from '../../../services/productService'
import categoryService from '../../../services/categoryService'
import type { CategoryListItem } from '../../../types/category'
import toast from 'react-hot-toast'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product?: any           // null/undefined = tạo mới, có data = sửa
    onEditSuccess?: () => void   // callback khi sửa thành công (reload data)
}

const ProductModal = ({ isOpen, onClose, product, onEditSuccess }: ProductModalProps) => {
    const navigate = useNavigate()
    const isEdit = !!product

    // Form state
    const [productName, setProductName] = useState('')
    const [categoryId, setCategoryId] = useState<number | ''>('')
    const [unitPrice, setUnitPrice] = useState('')
    const [description, setDescription] = useState('')

    // UI state
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [nameError, setNameError] = useState('')
    const [categoryError, setCategoryError] = useState('')
    const [priceError, setPriceError] = useState('')
    const [visible, setVisible] = useState(false)

    // Danh sách danh mục cho dropdown
    const [categories, setCategories] = useState<CategoryListItem[]>([])

    // Animation
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

        // Reset error
        setApiError('')
        setNameError('')
        setCategoryError('')
        setPriceError('')

        if (isEdit) {
            // Mode sửa — fill data sẵn
            setProductName(product.productName || '')
            setCategoryId(product.category?.categoryId || product.categoryId || '')
            setUnitPrice(String(product.unitPrice || ''))
            setDescription(product.description || '')
        } else {
            // Mode tạo — reset form
            setProductName('')
            setCategoryId('')
            setUnitPrice('')
            setDescription('')
        }

        // Lấy danh mục
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll()
                if (res.success) {
                    // Chỉ hiện danh mục đang hiện (status = 1)
                    setCategories(res.data.filter((c: CategoryListItem) => c.status === 1))
                }
            } catch {
                setCategories([])
            }
        }
        fetchCategories()
    }, [isOpen])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleSubmit = async () => {
        // Validate FE
        let hasError = false

        const trimmedName = productName.trim()
        if (!trimmedName) {
            setNameError('Tên sản phẩm không được để trống')
            hasError = true
        } else {
            setNameError('')
        }

        if (!categoryId) {
            setCategoryError('Vui lòng chọn danh mục')
            hasError = true
        } else {
            setCategoryError('')
        }

        const price = Number(unitPrice)
        if (!unitPrice || price <= 0) {
            setPriceError('Giá phải lớn hơn 0')
            hasError = true
        } else {
            setPriceError('')
        }

        if (hasError) {
            setApiError('')
            return
        }

        try {
            setLoading(true)
            setApiError('')

            const data = {
                productName: trimmedName,
                categoryId: Number(categoryId),
                unitPrice: price,
                description: description.trim() || undefined,
            }

            if (isEdit) {
                // Mode sửa
                const res = await productService.updateProduct(product.productId, data)
                if (res.success) {
                    toast.success('Cập nhật sản phẩm thành công')
                    handleClose()
                    onEditSuccess?.()
                } else {
                    setApiError(res.message)
                }
            } else {
                // Mode tạo
                const res = await productService.create(data)
                if (res.success) {
                    toast.success('Tạo sản phẩm thành công')
                    handleClose()
                    setTimeout(() => {
                        navigate(`/admin/san-pham/${res.data.productId}`)
                    }, 250)
                } else {
                    setApiError(res.message)
                }
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
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                </h3>

                {/* Tên sản phẩm */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        maxLength={200}
                        placeholder="Nhập tên sản phẩm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    />
                    {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
                </div>

                {/* Danh mục */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    {categoryError && <p className="mt-1 text-xs text-red-500">{categoryError}</p>}
                </div>

                {/* Giá */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={unitPrice ? Number(unitPrice).toLocaleString('vi-VN') : ''}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '')
                            setUnitPrice(raw)
                        }}
                        placeholder="Nhập giá sản phẩm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    />
                    {priceError && <p className="mt-1 text-xs text-red-500">{priceError}</p>}
                </div>

                {/* Mô tả */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Nhập mô tả (tùy chọn)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors resize-none"
                    />
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
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Lưu & Tiếp tục'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
