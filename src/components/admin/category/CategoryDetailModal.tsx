import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import categoryService from '../../../services/categoryService'
import type { CategoryDetail } from '../../../types/category'
import { formatDate } from '../../../utils/format'

interface CategoryDetailModalProps {
    isOpen: boolean
    categoryId: number | null
    onClose: () => void
}

const CategoryDetailModal = ({ isOpen, categoryId, onClose }: CategoryDetailModalProps) => {
    const [category, setCategory] = useState<CategoryDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [visible, setVisible] = useState(false)

    // Animation
    useEffect(() => {
        if (isOpen && categoryId) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen, categoryId])

    // Gọi API lấy chi tiết khi mở modal
    useEffect(() => {
        if (!isOpen || !categoryId) return

        const fetchDetail = async () => {
            try {
                setLoading(true)
                setApiError('')
                const res = await categoryService.getById(categoryId)
                if (res.success) {
                    setCategory(res.data)
                } else {
                    setApiError(res.message)
                }
            } catch (err: any) {
                setApiError(err.response?.data?.message || 'Không thể kết nối server')
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [isOpen, categoryId])

    if (!isOpen || !categoryId) return null

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

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
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết danh mục</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
                ) : apiError ? (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {apiError}
                    </div>
                ) : category && (
                    <div className="space-y-3">
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500 shrink-0">Tên danh mục</span>
                            <span className="text-sm font-medium text-gray-800">{category.categoryName}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500 shrink-0">Slug</span>
                            <span className="text-sm text-gray-600 font-mono">{category.slug}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500 shrink-0">Mô tả</span>
                            <span className="text-sm text-gray-600">{category.description || <span className="text-gray-300 italic">Không có mô tả</span>}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 text-sm text-gray-500 shrink-0">Trạng thái</span>
                            {category.status === 1 ? (
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
                            <span className="w-32 text-sm text-gray-500 shrink-0">Ngày tạo</span>
                            <span className="text-sm text-gray-600">{formatDate(category.createdAt)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500 shrink-0">Ngày cập nhật</span>
                            <span className="text-sm text-gray-600">{category.updatedAt ? formatDate(category.updatedAt) : <span className="text-gray-300 italic">Chưa cập nhật</span>}</span>
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

export default CategoryDetailModal
