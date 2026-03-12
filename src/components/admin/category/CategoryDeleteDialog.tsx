import { useEffect, useState } from 'react'
import categoryService from '../../../services/categoryService'
import type { CategoryListItem } from '../../../types/category'
import toast from 'react-hot-toast'

interface CategoryDeleteDialogProps {
    isOpen: boolean
    category: CategoryListItem | null
    onClose: () => void
    onSuccess: () => void
}

const CategoryDeleteDialog = ({ isOpen, category, onClose, onSuccess }: CategoryDeleteDialogProps) => {
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [visible, setVisible] = useState(false)

    // Animation: mở dialog
    useEffect(() => {
        if (isOpen && category) {
            requestAnimationFrame(() => setVisible(true))
        } else {
            setVisible(false)
        }
    }, [isOpen, category])

    if (!isOpen || !category) return null

    const handleClose = () => {
        setApiError('')
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await categoryService.delete(category.categoryId)

            if (res.success) {
                toast.success('Xóa danh mục thành công')
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay — fade in/out */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${visible ? 'opacity-50' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Dialog — fade + scale */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Xác nhận xóa</h3>

                <p className="text-sm text-gray-600 mb-4">
                    Bạn có chắc muốn xóa danh mục <strong>"{category.categoryName}"</strong>?
                </p>

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
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryDeleteDialog
