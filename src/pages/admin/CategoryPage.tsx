import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import categoryService from '../../services/categoryService'
import type { CategoryListItem } from '../../types/category'
import { formatDate } from '../../utils/format'
import CategoryDeleteDialog from '../../components/admin/category/CategoryDeleteDialog'
import CategoryModal from '../../components/admin/category/CategoryModal'
import CategoryDetailModal from '../../components/admin/category/CategoryDetailModal'

const CategoryPage = () => {
    const [categories, setCategories] = useState<CategoryListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    // State cho dialog xóa
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deletingCategory, setDeletingCategory] = useState<CategoryListItem | null>(null)

    // State cho modal thêm/sửa
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null)

    // State cho modal chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [detailCategoryId, setDetailCategoryId] = useState<number | null>(null)

    // Lấy danh sách danh mục khi vào trang
    const fetchCategories = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await categoryService.getAll()
            if (res.success) {
                setCategories(res.data)
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
        fetchCategories()
    }, [])


    return (
        <div>
            {/* Header — nút thêm */}
            <div className="flex items-center justify-between mb-4">
                <div />
                <button
                    onClick={() => {
                        setEditingCategory(null)
                        setShowModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#409EFF] text-white text-sm font-medium rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                >
                    <Plus size={18} />
                    Thêm danh mục
                </button>
            </div>

            {/* Lỗi từ API */}
            {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {apiError}
                </div>
            )}

            {/* Bảng danh mục */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-16">STT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Tên danh mục</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Mô tả</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-28">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-32">Ngày tạo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-28">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                                    Chưa có danh mục nào
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat, index) => (
                                <tr key={cat.categoryId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{cat.categoryName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                                        {cat.description || <span className="text-gray-300 italic">Không có mô tả</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {cat.status === 1 ? (
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
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(cat.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setDetailCategoryId(cat.categoryId)
                                                    setShowDetailModal(true)
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(cat)
                                                    setShowModal(true)
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Sửa"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingCategory(cat)
                                                    setShowDeleteDialog(true)
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog xác nhận xóa */}
            <CategoryDeleteDialog
                isOpen={showDeleteDialog}
                category={deletingCategory}
                onClose={() => setShowDeleteDialog(false)}
                onSuccess={fetchCategories}
            />

            {/* Modal thêm/sửa */}
            <CategoryModal
                isOpen={showModal}
                category={editingCategory}
                onClose={() => setShowModal(false)}
                onSuccess={fetchCategories}
            />

            {/* Modal chi tiết */}
            <CategoryDetailModal
                isOpen={showDetailModal}
                categoryId={detailCategoryId}
                onClose={() => setShowDetailModal(false)}
            />
        </div>
    )
}

export default CategoryPage
