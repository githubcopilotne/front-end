import { useEffect, useState } from 'react'
import categoryService from '../../../services/categoryService'
import type { CategoryListItem } from '../../../types/category'

interface CategoryModalProps {
    isOpen: boolean
    category: CategoryListItem | null  // null = thêm mới, có data = sửa
    onClose: () => void
    onSuccess: () => void
}

const CategoryModal = ({ isOpen, category, onClose, onSuccess }: CategoryModalProps) => {
    const [categoryName, setCategoryName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(1)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')
    const [nameError, setNameError] = useState('')

    const isEdit = category !== null

    // Khi mở modal → fill form từ data có sẵn (sửa) hoặc reset (thêm)
    useEffect(() => {
        if (!isOpen) return

        setApiError('')
        setNameError('')

        if (isEdit) {
            setCategoryName(category.categoryName)
            setDescription(category.description || '')
            setStatus(category.status)
        } else {
            setCategoryName('')
            setDescription('')
            setStatus(1)
        }
    }, [isOpen, category])

    const handleClose = () => {
        setApiError('')
        setNameError('')
        onClose()
    }

    const handleSubmit = async () => {
        // Validate FE
        const trimmedName = categoryName.trim()
        if (!trimmedName) {
            setApiError('')
            setNameError('Tên danh mục không được để trống')
            return
        }
        setNameError('')

        try {
            setLoading(true)
            setApiError('')

            let res
            if (isEdit) {
                res = await categoryService.update(category.categoryId, {
                    categoryName: trimmedName,
                    description: description.trim() || undefined,
                    status,
                })
            } else {
                res = await categoryService.create({
                    categoryName: trimmedName,
                    description: description.trim() || undefined,
                    status,
                })
            }

            if (res.success) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
                </h3>

                <>
                    {/* Tên danh mục */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            maxLength={100}
                            placeholder="Nhập tên danh mục"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                        />
                        {nameError && (
                            <p className="mt-1 text-xs text-red-500">{nameError}</p>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="Nhập mô tả (tùy chọn)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors resize-none"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                        >
                            <option value={1}>Hiện</option>
                            <option value={0}>Ẩn</option>
                        </select>
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
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </>
            </div>
        </div>
    )
}

export default CategoryModal
